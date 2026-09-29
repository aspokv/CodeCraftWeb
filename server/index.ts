interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
}
const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
function database(env: Env) {
  if (!env.DB) throw new Error("Storage unavailable");
  return env.DB;
}
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/demo") {
      if (request.method !== "POST")
        return json({ error: "Método não permitido." }, 405);
      if (request.headers.get("Origin") !== url.origin)
        return json({ error: "Origem não permitida." }, 403);
      if (!request.headers.get("Content-Type")?.includes("application/json"))
        return json({ error: "Formato inválido." }, 415);
      try {
        const raw = await request.text();
        if (raw.length > 4096)
          return json({ error: "Solicitação muito longa." }, 413);
        let data: Record<string, unknown>;
        try {
          data = JSON.parse(raw);
        } catch {
          return json({ error: "Solicitação inválida." }, 400);
        }
        if (!data || typeof data !== "object")
          return json({ error: "Solicitação inválida." }, 400);
        if (data.website) return json({ error: "Solicitação inválida." }, 400);
        const field = (key: string) =>
          typeof data[key] === "string" ? (data[key] as string).trim() : "";
        const id = field("id"),
          name = field("name"),
          email = field("email").toLowerCase(),
          school = field("school"),
          role = field("role");
        if (
          !/^[a-f0-9-]{36}$/i.test(id) ||
          name.length < 2 ||
          name.length > 100 ||
          school.length < 2 ||
          school.length > 160 ||
          email.length > 200 ||
          !/^\S+@\S+\.\S+$/.test(email) ||
          ![
            "Direção",
            "Coordenação pedagógica",
            "Professor(a)",
            "Outro",
          ].includes(role) ||
          data.consent !== "yes"
        )
          return json(
            { error: "Confira os campos e autorize o contato para continuar." },
            400,
          );
        const db = database(env);
        const exists = await db
          .prepare("SELECT id FROM demo_requests WHERE id = ?")
          .bind(id)
          .first();
        if (exists) return json({ ok: true });
        const now = new Date();
        const ip = request.headers.get("CF-Connecting-IP") || "unknown";
        const hash = await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(ip + now.toISOString().slice(0, 10)),
        );
        const ipHash = Array.from(new Uint8Array(hash), (x) =>
          x.toString(16).padStart(2, "0"),
        ).join("");
        const inserted = await db
          .prepare(
            "INSERT INTO demo_requests (id,name,email,school,role,created_at,consent_at,ip_hash) SELECT ?,?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM demo_requests WHERE ip_hash = ? AND created_at > ?) < 5 ON CONFLICT(id) DO NOTHING",
          )
          .bind(
            id,
            name,
            email,
            school,
            role,
            now.toISOString(),
            now.toISOString(),
            ipHash,
            ipHash,
            new Date(now.getTime() - 3600000).toISOString(),
          )
          .run();
        if (!inserted.meta.changes)
          return json(
            {
              error: "Muitas solicitações. Aguarde um pouco e tente novamente.",
            },
            429,
          );
        return json({ ok: true }, 201);
      } catch (error) {
        console.error(
          "Demo request failed",
          error instanceof Error ? error.message : "unknown",
        );
        return json(
          {
            error:
              "Não foi possível registrar agora. Seus dados continuam no formulário. Tente novamente.",
          },
          503,
        );
      }
    }
    if (url.pathname.startsWith("/api/"))
      return json({ error: "Não encontrado." }, 404);
    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()",
    );
    headers.set("X-Frame-Options", "SAMEORIGIN");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
