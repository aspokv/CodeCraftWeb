import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Box,
  Code2,
  Play,
  Plus,
  Minus,
  Menu,
  X,
  Check,
  Compass,
  GraduationCap,
  Blocks,
  MousePointer2,
  Sparkles,
  Flag,
  Lightbulb,
  Braces,
} from "lucide-react";
import { Journey, Curriculum } from "./components/Curriculum";
import LeadDialog from "./components/LeadDialog";
import WorldLab from "./components/WorldLab";
gsap.registerPlugin(ScrollTrigger);
const faqs = [
  [
    "Para qual idade o CodeCraft foi pensado?",
    "O conteúdo programático foi desenvolvido para alunos a partir dos 8 anos. O Módulo 0 começa com movimentação, câmera, inventário e ferramentas para que a turma conheça o mundo 3D antes de avançar na programação.",
  ],
  [
    "É só um jogo ou o aluno aprende programação?",
    "O jogo é o ambiente de aprendizagem. O currículo reúne 19 módulos e 521 missões, passando por lógica, variáveis, decisões, loops, funções, estruturas de dados e JavaScript ES6+. Cada conceito é aplicado em projetos dentro do mundo.",
  ],
  [
    "Como acontece a passagem dos blocos para o código?",
    "A jornada começa com circuitos físicos de Codestone, evolui para algoritmos visuais no Blockly e chega ao código textual no editor Monaco. A trilha de JavaScript aprofunda funções, arrays, objetos, JSON e assincronia.",
  ],
  [
    "Qual é a duração da formação?",
    "O programa completo está organizado em 54 semanas, dos módulos 0 ao 18. A distribuição na rotina da escola deve ser alinhada na demonstração; não estamos assumindo que 54 semanas cabem em um único ano letivo.",
  ],
  [
    "O que a turma constrói ao longo do curso?",
    "Entre os projetos previstos estão sistemas de alarme, portas secretas, pontes, torres, vilas procedurais e veículos 3D. No projeto integrador A Cidade Viva, os conhecimentos se conectam em uma cidade com sistemas programados.",
  ],
  [
    "Como conhecer os requisitos e levar para a escola?",
    "Solicite uma demonstração para conversar sobre faixa etária, estrutura disponível, formato das aulas, requisitos técnicos e condições de implantação. O formulário registra seu interesse, sem confirmar um horário de reunião.",
  ],
];
export default function App() {
  const [menu, setMenu] = useState(false);
  const [demo, setDemo] = useState(false);
  const [faq, setFaq] = useState<number | null>(0);
  const page = useRef<HTMLDivElement>(null);
  const open = () => {
    setDemo(true);
    setMenu(false);
  };
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-text > *", {
        opacity: 0,
        y: 22,
        stagger: 0.09,
        duration: 0.7,
        ease: "power2.out",
      });
      gsap.from(".hero-art", {
        opacity: 0,
        scale: 1.03,
        duration: 1.1,
        ease: "power2.out",
      });
      gsap.to(".hero-art img", {
        y: 50,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, page);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={page}>
      <a className="skip-link" href="#jornada">
        Pular para o conteúdo
      </a>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="CodeCraft início">
          <img
            className="brand-logo"
            src="/images/codecraft-logo.png"
            alt="CodeCraft"
            width="1254"
            height="1254"
          />
        </a>
        <nav className={menu ? "open" : ""} aria-label="Navegação principal">
          <a href="#jornada" onClick={() => setMenu(false)}>
            Como funciona
          </a>
          <a href="#universo" onClick={() => setMenu(false)}>
            O universo
          </a>
          <a href="#curriculo" onClick={() => setMenu(false)}>
            O que se aprende
          </a>
          <a href="#escolas" onClick={() => setMenu(false)}>
            Para escolas
          </a>
        </nav>
        <button className="button header-button" onClick={open}>
          Quero na minha escola <Plus size={16} />
        </button>
        <button
          className="menu-toggle"
          onClick={() => setMenu(!menu)}
          aria-expanded={menu}
          aria-label={menu ? "Fechar menu" : "Abrir menu"}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      <main>
        <section className="hero" id="inicio">
          <div className="hero-art">
            <img
              src="/images/codecraft-adventure.webp"
              alt="Ilustração de um mundo voxel colorido com floresta, construções, rio e circuitos de programação"
              width="1536"
              height="1024"
              fetchPriority="high"
            />
          </div>
          <div className="hero-content section-wrap">
            <div className="hero-text">
              <span className="hero-badge">
                <Sparkles size={15} /> PARA PEQUENOS GRANDES CRIADORES · 8+
              </span>
              <h1>
                Eles amam <br />
                jogar.
                <br />
                <span>
                  Imagine criar <br />o próprio mundo.
                </span>
              </h1>
              <p>
                No CodeCraft, crianças aprendem programação construindo,
                explorando e resolvendo desafios em um mundo 3D.
              </p>
              <div className="hero-actions">
                <motion.button
                  className="button primary"
                  onClick={open}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Leve essa aventura para sua escola <Plus size={18} />
                </motion.button>
                <a className="play-link" href="#universo">
                  <span>
                    <Play size={14} fill="currentColor" />
                  </span>{" "}
                  Conheça o universo
                </a>
              </div>
              <div className="hero-proof">
                <span>
                  <Check size={14} /> A partir de 8 anos
                </span>
                <span>
                  <Check size={14} /> Do primeiro bloco ao JavaScript
                </span>
              </div>
            </div>
            <div className="hero-float mission-float">
              <span className="float-icon">
                <Flag size={24} />
              </span>
              <div>
                <small>PRÓXIMA MISSÃO</small>
                <strong>Transformar ideias em mundos.</strong>
              </div>
            </div>
            <div className="hero-float code-float">
              <Braces size={22} />
              <span>
                + curiosidade
                <br />
                <strong>+ possibilidades</strong>
              </span>
            </div>
            <span className="art-caption">Universo ilustrativo CodeCraft</span>
          </div>
        </section>
        <section className="stats-band" aria-label="O curso em números">
          <div className="stats-intro">
            <span>Um mundo para jogar.</span>
            <strong>Um caminho para aprender.</strong>
          </div>
          <div>
            <strong>19</strong>
            <span>módulos de formação</span>
          </div>
          <div>
            <strong>521</strong>
            <span>missões práticas</span>
          </div>
          <div>
            <strong>57+</strong>
            <span>projetos no jogo</span>
          </div>
          <div>
            <strong>54</strong>
            <span>semanas de jornada</span>
          </div>
        </section>
        <Journey />
        <section className="learning-strip section-wrap">
          <div>
            <span className="strip-icon">
              <Lightbulb />
            </span>
            <h2>
              A diversão é o começo.
              <br />
              <span>O aprendizado vai muito além.</span>
            </h2>
          </div>
          <p>
            Planejar uma construção, descobrir por que um circuito falhou, fazer
            uma ideia funcionar. Aqui, os conceitos têm um lugar para acontecer.
          </p>
        </section>
        <WorldLab />
        <section className="school-section section-wrap" id="escolas">
          <div className="school-heading">
            <span className="eyebrow">
              PARA QUEM ENSINA. PARA QUEM DESCOBRE.
            </span>
            <h2>
              A linguagem que eles amam.
              <br />
              <span>A formação que sua escola valoriza.</span>
            </h2>
          </div>
          <div className="school-columns">
            <article>
              <span className="feature-icon green">
                <Compass />
              </span>
              <h3>Curiosidade com direção.</h3>
              <p>
                Uma trilha de missões transforma a vontade de explorar em
                oportunidades para aplicar lógica e resolver problemas.
              </p>
              <span className="feature-note">DESCOBERTA + RACIOCÍNIO</span>
            </article>
            <article>
              <span className="feature-icon purple">
                <Blocks />
              </span>
              <h3>Complexidade, passo a passo.</h3>
              <p>
                O concreto vem antes da abstração: mundo 3D, circuitos físicos,
                blocos visuais e, então, programação textual.
              </p>
              <span className="feature-note">CONCRETO → VISUAL → TEXTO</span>
            </article>
            <article>
              <span className="feature-icon blue">
                <GraduationCap />
              </span>
              <h3>Criações que contam uma história.</h3>
              <p>
                Projetos conectam os conhecimentos da jornada. O ponto de
                chegada é A Cidade Viva, um mundo construído com código.
              </p>
              <span className="feature-note">APRENDER CONSTRUINDO</span>
            </article>
          </div>
        </section>
        <Curriculum />
        <section className="final-project section-wrap">
          <div className="project-image">
            <img
              src="/images/codecraft-adventure.webp"
              alt="Paisagem voxel ilustrativa com arquitetura, natureza e circuitos"
              width="1536"
              height="1024"
              loading="lazy"
            />
            <span className="image-label">
              <Flag size={16} /> O GRANDE PROJETO FINAL
            </span>
          </div>
          <div className="project-copy">
            <span className="eyebrow">QUANDO TUDO SE CONECTA.</span>
            <h2>
              Um aluno.
              <br />
              Muitas descobertas.
              <br />
              <span>Uma Cidade Viva.</span>
            </h2>
            <p>
              No projeto integrador, construir é só o começo. A turma conecta
              código e sistemas para dar vida à sua própria cidade.
            </p>
            <ul>
              <li>
                <Check size={17} /> Trânsito e semáforos coordenados
              </li>
              <li>
                <Check size={17} /> Iluminação que responde ao ciclo do dia
              </li>
              <li>
                <Check size={17} /> Estruturas salvas e carregadas com JSON
              </li>
              <li>
                <Check size={17} /> Funções, eventos e assincronia trabalhando
                juntos
              </li>
            </ul>
            <span className="project-endnote">
              Projeto previsto no Módulo 18 · JavaScript
            </span>
          </div>
        </section>
        <section className="faq-section section-wrap">
          <div>
            <span className="eyebrow">VAMOS TIRAR AS DÚVIDAS?</span>
            <h2>
              Antes de apertar
              <br />
              <span>o play.</span>
            </h2>
            <p>O que sua escola precisa saber para dar o próximo passo.</p>
          </div>
          <div className="faq-list">
            {faqs.map(([q, a], i) => (
              <article key={q}>
                <h3>
                  <button
                    aria-expanded={faq === i}
                    aria-controls={`faq-${i}`}
                    onClick={() => setFaq(faq === i ? null : i)}
                  >
                    {q}
                    {faq === i ? <Minus size={19} /> : <Plus size={19} />}
                  </button>
                </h3>
                <div hidden={faq !== i} id={`faq-${i}`}>
                  <p>{a}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="final-cta section-wrap">
          <span className="cta-icon">
            <Box size={35} />
          </span>
          <span className="eyebrow">
            A PRÓXIMA GRANDE IDEIA PODE COMEÇAR NA SUA ESCOLA.
          </span>
          <h2>
            Hoje, eles constroem mundos.
            <br />
            <span>Amanhã, novas possibilidades.</span>
          </h2>
          <p>
            Conheça o CodeCraft e transforme a vontade de jogar
            <br className="desktop-break" /> em uma jornada de criação e
            programação.
          </p>
          <motion.button
            className="button primary"
            onClick={open}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            Quero conhecer para minha escola <Plus size={19} />
          </motion.button>
          <small>Solicite uma demonstração. Sem compromisso.</small>
        </section>
      </main>
      <footer className="site-footer section-wrap">
        <a className="brand" href="#inicio" aria-label="CodeCraft início">
          <img
            className="brand-logo"
            src="/images/codecraft-logo.png"
            alt="CodeCraft"
            width="1254"
            height="1254"
            loading="lazy"
          />
        </a>
        <p>Aprenda a programar construindo mundos.</p>
        <span>© {new Date().getFullYear()} CodeCraft</span>
      </footer>
      <div className="mobile-cta">
        <span>
          Uma nova aventura
          <br />
          <strong>para sua escola.</strong>
        </span>
        <button onClick={open}>Conhecer o CodeCraft</button>
      </div>
      <LeadDialog open={demo} onClose={() => setDemo(false)} />
    </div>
  );
}
