import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  Play,
  RotateCcw,
  Layers3,
  MoveHorizontal,
  Check,
  Box,
  Palette,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SceneBoundary from "./SceneBoundary";
import type { SceneState } from "../scene/config";
const WorldScene = lazy(() => import("../scene/WorldScene"));
const colors = [
  { name: "Ametista", hex: "#8953e8" },
  { name: "Safira", hex: "#318edd" },
  { name: "Âmbar", hex: "#f2b22d" },
];
export default function WorldLab() {
  const root = useRef<HTMLElement>(null);
  const [state, setState] = useState<SceneState>({
    progress: 0,
    spin: 0,
    explode: false,
    color: "#8953e8",
    material: 0,
    reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
    hotspots: false,
    tower: 4,
  });
  const [height, setHeight] = useState(4);
  const [message, setMessage] = useState(
    "Mude a altura e execute para construir sua torre.",
  );
  const [ready, setReady] = useState(false);
  const [available] = useState(() => {
    try {
      return !!document.createElement("canvas").getContext("webgl2");
    } catch {
      return false;
    }
  });
  const [mobile, setMobile] = useState(
    () => matchMedia("(max-width:760px)").matches,
  );
  const drag = useRef<number | null>(null);
  useEffect(() => {
    const m = matchMedia("(max-width:760px)");
    const onChange = () => setMobile(m.matches);
    m.addEventListener("change", onChange);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    if (root.current) observer.observe(root.current);
    const t = ScrollTrigger.create({
      trigger: root.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (s) => setState((v) => ({ ...v, progress: s.progress })),
    });
    return () => {
      observer.disconnect();
      m.removeEventListener("change", onChange);
      t.kill();
    };
  }, []);
  const fallback = (
    <div className="world-fallback">
      <Box size={40} />
      <strong>{state.tower} andares construídos.</strong>
      <p>
        O código pode ser explorado mesmo sem a visualização 3D neste
        dispositivo.
      </p>
    </div>
  );
  return (
    <section className="world-lab" id="universo" ref={root}>
      <div className="section-heading section-wrap">
        <span className="eyebrow">MENOS “E SE?”. MAIS “EU FIZ!”.</span>
        <h2>
          Uma ideia no código.
          <br />
          <span>Uma construção no mundo.</span>
        </h2>
        <p>
          Altere a altura. Execute. Veja a repetição transformar um comando em
          uma torre.
        </p>
      </div>
      <div className="lab-layout section-wrap">
        <div className="world-viewport">
          <div className="world-label">
            <span /> MUNDO EM CONSTRUÇÃO <small>3D INTERATIVO</small>
          </div>
          <SceneBoundary fallback={fallback}>
            {available && ready ? (
              <Suspense
                fallback={
                  <div className="world-loading">Preparando seu mundo…</div>
                }
              >
                <WorldScene state={state} mobile={mobile} />
              </Suspense>
            ) : available ? (
              <div className="world-loading">Preparando seu mundo…</div>
            ) : (
              fallback
            )}
          </SceneBoundary>
          <div
            className="world-drag"
            tabIndex={0}
            role="slider"
            aria-label="Girar mundo 3D"
            aria-valuemin={0}
            aria-valuemax={360}
            aria-valuenow={Math.round(
              ((((state.spin * 180) / Math.PI) % 360) + 360) % 360,
            )}
            onPointerDown={(e) => {
              drag.current = e.clientX;
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (drag.current !== null) {
                const diff = (e.clientX - drag.current) * 0.01;
                setState((v) => ({ ...v, spin: v.spin + diff }));
                drag.current = e.clientX;
              }
            }}
            onPointerUp={() => {
              drag.current = null;
            }}
            onPointerCancel={() => {
              drag.current = null;
            }}
            onKeyDown={(e) => {
              if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
                e.preventDefault();
                setState((v) => ({
                  ...v,
                  spin: v.spin + (e.key === "ArrowLeft" ? -0.2 : 0.2),
                }));
              }
            }}
          />
          <div className="world-controls">
            <span>
              <MoveHorizontal size={16} /> Arraste para explorar
            </span>
            <div>
              <button
                aria-pressed={state.explode}
                aria-label="Separar as camadas do mundo"
                title="Separar camadas"
                onClick={() => setState((v) => ({ ...v, explode: !v.explode }))}
              >
                <Layers3 size={18} />
              </button>
              <button
                aria-label="Restaurar posição"
                title="Restaurar posição"
                onClick={() =>
                  setState((v) => ({ ...v, spin: 0, explode: false }))
                }
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        </div>
        <div className="lab-console">
          <div className="console-top">
            <span>
              <span /> PRIMEIRO ALGORITMO
            </span>
            <span>JavaScript</span>
          </div>
          <div className="code-editor">
            <div>
              <span>1</span>
              <code>
                <b>const</b> altura = <em>{height}</em>;
              </code>
            </div>
            <div>
              <span>2</span>
              <code />
            </div>
            <div>
              <span>3</span>
              <code>
                <b>for</b> (<b>let</b> y = 0; y &lt; altura; y++) {"{"}
              </code>
            </div>
            <div>
              <span>4</span>
              <code>
                &nbsp; <i>placeBlock</i>(0, y, 0, <strong>"pedra"</strong>);
              </code>
            </div>
            <div>
              <span>5</span>
              <code>{"}"}</code>
            </div>
          </div>
          <div className="lab-configuration">
            <label htmlFor="tower-height">
              Quantos andares sua torre vai ter?
              <output htmlFor="tower-height">{height}</output>
            </label>
            <input
              type="range"
              id="tower-height"
              min="2"
              max="8"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
            <div className="range-labels">
              <span>2 andares</span>
              <span>8 andares</span>
            </div>
            <div className="crystal-colors">
              <span>
                <Palette size={15} /> Cor dos cristais
              </span>
              <div>
                {colors.map((c) => (
                  <button
                    key={c.name}
                    aria-label={c.name}
                    aria-pressed={state.color === c.hex}
                    style={{ background: c.hex }}
                    onClick={() => setState((v) => ({ ...v, color: c.hex }))}
                  />
                ))}
              </div>
            </div>
            <button
              className="button primary"
              onClick={() => {
                setState((v) => ({ ...v, tower: height }));
                setMessage(
                  `Pronto! ${height} repetições, ${height} andares. Você mudou o mundo com uma variável.`,
                );
              }}
            >
              <Play size={16} fill="currentColor" /> Executar minha ideia
            </button>
            <p className="lab-status" aria-live="polite">
              <Check size={16} />
              {message}
            </p>
          </div>
          <div className="lab-note">
            Experimento criado para esta página. Conheça a plataforma completa
            na demonstração.
          </div>
        </div>
      </div>
    </section>
  );
}
