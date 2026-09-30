import { useEffect, useRef, useState, type FormEvent } from "react";
import { X, Check, MessageCircle } from "lucide-react";

/**
 * ⚠️ TROQUE AQUI PELO NÚMERO QUE VAI ATENDER OS LEADS.
 *
 * Formato: código do país + DDD + número, só dígitos, sem espaço, sem "+".
 * Exemplo para um celular de Porto Alegre: 5551998765432
 *
 * É a única linha deste site que precisa ser editada para trocar quem atende.
 */
const NUMERO_DO_WHATSAPP = "5551000000000";

/** Monta a mensagem que já chega escrita na conversa. */
function mensagemDoLead(d: Record<string, string>) {
  const linhas = [
    "Olá! Quero conhecer o CodeCraft para a minha escola.",
    "",
    "Nome: " + d.name,
    "Escola: " + d.school,
    "Papel na escola: " + d.role,
  ];
  if (d.email) linhas.push("E-mail: " + d.email);
  return linhas.join(String.fromCharCode(10));
}

export default function LeadDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [enviado, setEnviado] = useState(false);
  const [link, setLink] = useState("");
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
  useEffect(() => {
    if (!open) {
      setEnviado(false);
      setLink("");
    }
  }, [open]);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const dados = Object.fromEntries(
      new FormData(e.currentTarget),
    ) as Record<string, string>;
    if (dados.website) return; // armadilha para robô: humano não preenche
    const url =
      "https://wa.me/" +
      NUMERO_DO_WHATSAPP +
      "?text=" +
      encodeURIComponent(mensagemDoLead(dados));
    setLink(url);
    setEnviado(true);
    // Abre na hora. Se o navegador bloquear, o botão da tela seguinte resolve.
    window.open(url, "_blank", "noopener,noreferrer");
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
      {enviado ? (
        <div className="success">
          <span className="success-icon">
            <Check />
          </span>
          <p className="eyebrow">É SÓ ENVIAR</p>
          <h2 id="demo-title">Abrimos o WhatsApp para você.</h2>
          <p>
            A mensagem já está escrita com os dados da sua escola. É só apertar
            enviar que um de nós responde.
          </p>
          <a
            className="button primary"
            href={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir o WhatsApp <MessageCircle size={18} />
          </a>
        </div>
      ) : (
        <>
          <p className="eyebrow">CODECRAFT PARA ESCOLAS</p>
          <h2 id="demo-title">Vamos abrir esse novo mundo?</h2>
          <p>
            Conte um pouco sobre sua escola. Ao enviar, você fala direto com a
            nossa equipe no WhatsApp.
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
            <label>
              <span>
                E-mail <span className="field-optional">(opcional)</span>
              </span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                maxLength={200}
                placeholder="voce@escola.com.br"
              />
            </label>
            <label className="honey" aria-hidden="true">
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
            <button className="button primary" type="submit">
              Falar no WhatsApp <MessageCircle size={18} />
            </button>
            <p className="form-note">
              Sem compromisso. Seus dados vão apenas na mensagem que você envia.
            </p>
          </form>
        </>
      )}
    </dialog>
  );
}
