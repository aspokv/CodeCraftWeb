import { useState } from "react";
import { Flag, Check } from "lucide-react";
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
