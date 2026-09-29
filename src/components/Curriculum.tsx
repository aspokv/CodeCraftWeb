import { useState } from "react";
import { Plus, Minus, BookOpen, Flag, Check } from "lucide-react";
import modules from "../data/curriculum.json";
import { stages } from "../data/stages";
export function Journey() {
  const [active, setActive] = useState(0);
  const s = stages[active];
  return (
    <section className="journey section-wrap" id="jornada">
      <div className="section-heading">
        <span className="eyebrow">PEQUENOS PASSOS. GRANDES DESCOBERTAS.</span>
        <h2>
          Começa com um bloco.
          <br />
          Vai até o <span>código de verdade.</span>
        </h2>
        <p>
          Uma progressão que acompanha a descoberta: primeiro o mundo, depois a
          lógica, os algoritmos e o JavaScript.
        </p>
      </div>
      <div
        className="journey-tabs"
        role="tablist"
        aria-label="Etapas da aprendizagem"
      >
        {stages.map((stage, i) => (
          <button
            key={i}
            id={`stage-tab-${i}`}
            role="tab"
            aria-selected={active === i}
            aria-controls="stage-panel"
            tabIndex={active === i ? 0 : -1}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                const next = (active + (e.key === "ArrowRight" ? 1 : 3)) % 4;
                setActive(next);
                document.getElementById(`stage-tab-${next}`)?.focus();
              }
            }}
            className={active === i ? "active" : ""}
            onClick={() => setActive(i)}
          >
            <span className={`step-icon ${stage.className}`}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>
              <small>{stage.tag}</small>
              {stage.short}
            </span>
            <span className="tab-dot" />
          </button>
        ))}
      </div>
      <div
        id="stage-panel"
        role="tabpanel"
        aria-labelledby={`stage-tab-${active}`}
        className={`stage-panel ${s.className}`}
      >
        <div className="stage-copy">
          <span className="pill">
            {s.range} <span>·</span> {s.weeks}
          </span>
          <h3>{s.headline}</h3>
          <p>{s.body}</p>
          <ul>
            {s.skills.map((skill) => (
              <li key={skill}>
                <Check size={17} />
                {skill}
              </li>
            ))}
          </ul>
        </div>
        <div className="stage-example">
          <div className="example-heading">
            <span>UMA IDEIA GANHA FORMA</span>
            <span>0{active + 1}</span>
          </div>
          <div className="logic-blocks">
            {s.code.map((line, i) => (
              <div key={line} className={`logic-block block-${i}`}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <code>{line}</code>
              </div>
            ))}
          </div>
          <div className="example-project">
            <Flag size={22} />
            <div>
              <small>PROJETO DA TRILHA</small>
              <strong>{s.project}</strong>
            </div>
          </div>
          <p className="example-note">
            {active === 3
              ? "Esquema ilustrativo da progressão."
              : "A lógica explicada em linguagem simples."}
          </p>
        </div>
      </div>
    </section>
  );
}
export function Curriculum() {
  const [filter, setFilter] = useState(-1);
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="curriculum section-wrap" id="curriculo">
      <div className="curriculum-heading">
        <div>
          <span className="eyebrow">DIVERSÃO COM UM CAMINHO PEDAGÓGICO.</span>
          <h2>
            Por trás de cada missão,
            <br />
            um novo aprendizado.
          </h2>
        </div>
        <p>
          19 módulos conectam computação espacial, lógica de programação e
          JavaScript. Explore o conteúdo do curso.
        </p>
      </div>
      <div className="curriculum-filters" aria-label="Filtrar currículo">
        <button aria-pressed={filter === -1} onClick={() => setFilter(-1)}>
          Todos os módulos
        </button>
        {stages.map((s, i) => (
          <button
            key={i}
            aria-pressed={filter === i}
            onClick={() => setFilter(i)}
          >
            {s.short}
          </button>
        ))}
      </div>
      <div className="module-list">
        {modules
          .filter((m) => filter === -1 || m.stage === filter)
          .map((m) => (
            <article key={m.id} className={open === m.id ? "expanded" : ""}>
              <h3>
                <button
                  aria-expanded={open === m.id}
                  aria-controls={`module-${m.id}`}
                  onClick={() => setOpen(open === m.id ? null : m.id)}
                >
                  <span
                    className={`module-number ${stages[m.stage].className}`}
                  >
                    {String(m.id).padStart(2, "0")}
                  </span>
                  <span className="module-title">{m.title}</span>
                  <span className="module-meta">{m.missions} missões</span>
                  {open === m.id ? <Minus size={18} /> : <Plus size={18} />}
                </button>
              </h3>
              <div
                id={`module-${m.id}`}
                hidden={open !== m.id}
                className="module-body"
              >
                <span className="module-time">
                  <BookOpen size={15} />
                  {m.weeks}
                </span>
                <p>{m.description}</p>
                <p className="module-projects">
                  <strong>Projetos:</strong> {m.projects}
                </p>
              </div>
            </article>
          ))}
      </div>
      <p className="curriculum-note">
        Formação completa prevista em 54 semanas. Conteúdo: CodeCraft — Voxel &
        Código.
      </p>
    </section>
  );
}
