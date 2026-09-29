import { useEffect, useRef, useState, type FormEvent } from "react";
import { X, Check, LoaderCircle } from "lucide-react";
export default function LeadDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const requestId = useRef<string | null>(null);
  if (!requestId.current) {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 15) | 64;
    bytes[8] = (bytes[8] & 63) | 128;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(
      "",
    );
    requestId.current = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setStatus("sending");
    try {
      const response = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, id: requestId.current }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok)
        throw Error(
          result.error || "Não foi possível registrar agora. Tente novamente.",
        );
      setStatus("done");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Falha de conexão. Tente novamente.",
      );
      setStatus("error");
    }
  }
  return (
    <dialog
      ref={dialog}
      className="lead-dialog"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === dialog.current) onClose();
      }}
      aria-labelledby="demo-title"
    >
      <button className="close-dialog" onClick={onClose} aria-label="Fechar">
        <X size={22} />
      </button>
      {status === "done" ? (
        <div className="success">
          <span className="success-icon">
            <Check />
          </span>
          <p className="eyebrow">PRÓXIMO PASSO</p>
          <h2 id="demo-title">Sua escola entrou no jogo.</h2>
          <p>
            Sua solicitação foi registrada. O contato informado poderá ser usado
            pela equipe CodeCraft para conversar sobre a demonstração.
          </p>
          <button className="button primary" onClick={onClose}>
            Voltar à experiência
          </button>
        </div>
      ) : (
        <>
          <p className="eyebrow">CODECRAFT PARA ESCOLAS</p>
          <h2 id="demo-title">Vamos abrir esse novo mundo?</h2>
          <p>
            Conte um pouco sobre sua escola para solicitar uma demonstração.
          </p>
          <form onSubmit={submit}>
            <label>
              Seu nome
              <input
                name="name"
                autoComplete="name"
                minLength={2}
                maxLength={100}
                required
                placeholder="Como podemos chamar você?"
              />
            </label>
            <label>
              E-mail profissional
              <input
                name="email"
                type="email"
                autoComplete="email"
                maxLength={200}
                required
                placeholder="voce@escola.com.br"
              />
            </label>
            <label>
              Escola
              <input
                name="school"
                autoComplete="organization"
                minLength={2}
                maxLength={160}
                required
                placeholder="Nome da instituição"
              />
            </label>
            <label>
              Seu papel na escola
              <select name="role" required defaultValue="">
                <option value="" disabled>
                  Selecione
                </option>
                <option>Direção</option>
                <option>Coordenação pedagógica</option>
                <option>Professor(a)</option>
                <option>Outro</option>
              </select>
            </label>
            <label className="honey" aria-hidden="true">
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
            <label className="consent">
              <input name="consent" type="checkbox" required value="yes" />
              <span>
                Autorizo o CodeCraft a usar estes dados para responder à minha
                solicitação.
              </span>
            </label>
            {status === "error" && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
            <button
              className="button primary"
              disabled={status === "sending"}
              type="submit"
            >
              {status === "sending" ? (
                <>
                  <LoaderCircle className="spin" size={18} /> Registrando…
                </>
              ) : (
                "Solicitar demonstração"
              )}
            </button>
            <p className="form-note">
              Sem compromisso. A solicitação não confirma um horário.
            </p>
          </form>
        </>
      )}
    </dialog>
  );
}
