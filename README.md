# CodeCraft — Voxel & Código

Landing para escolas, com identidade de aventura voxel para crianças a partir de 8 anos. O conteúdo foi reconstruído a partir do documento `CONTEUDO_PROGRAMATICO.md` enviado pelo proprietário: 19 módulos, 521 missões, 54 semanas e 57+ projetos.

## Executar

```sh
npm ci
npm run dev
npm run build
```

Stack: React 19, Vite, Tailwind CSS 4, Three.js, React Three Fiber, Drei, GSAP e Framer Motion. Sem chaves externas. O servidor Vite mostra a interface; o formulário exige o Worker Cloudflare com bindings `DB` (D1) e `ASSETS` (`dist/client`).

## Arquitetura

- `src/App.tsx`: página, animação de abertura, perguntas frequentes e navegação.
- `src/components/Curriculum.tsx`: etapas interativas e currículo filtrável com os 19 módulos.
- `src/data/curriculum.json`: conteúdo estruturado do documento fornecido.
- `src/data/stages.ts`: resumo das quatro etapas, do mundo 3D ao JavaScript.
- `src/components/WorldLab.tsx`: experiência de repetição, altura da torre e seletor de cristais.
- `src/scene/WorldScene.tsx`: cena 3D lazy, DPR adaptativo, câmera, rotação e vista explodida.
- `src/scene/config.ts`: caminho substituível do GLB.
- `src/components/LeadDialog.tsx`: diálogo, consentimento e formulário.
- `server/index.ts`: endpoint preparado para D1, idempotência, validação e limite de solicitações.
- `db/schema.ts`, `drizzle/`: esquema e migrações imutáveis.

## Assets e fatos

A arte de abertura é uma ilustração original, identificada como universo ilustrativo; não é uma captura da plataforma. Criada pelo imagegen integrado, otimizada em WebP (~296 KB). Brief: mundo voxel colorido com florestas, construções, rio, exploradores e circuitos físicos roxos, luz diurna e sem texto.

O GLB é um cenário original de demonstração criado por `node scripts/create-demo-model.mjs`. O laboratório desta landing é uma simulação identificada como tal. Não executa strings arbitrárias. O número do controle gera andares na cena. O modelo definitivo pode substituir `MODEL_CONFIG.url`; grupos de primeiro nível com `userData.layer` controlam as camadas. Materiais `Crystal` respondem ao seletor de cor. Decodificador Draco local incluído.

O currículo é a fonte das informações; não foram adicionados depoimentos, clientes ou métricas de resultado. A autenticação no domínio original não foi concluída, portanto não foi alegada inspeção da plataforma interna.

## Produção e limites

Saída: `dist/client` (assets) e `dist/server/index.js` (Worker ESM). D1 recebe solicitações na tabela `demo_requests`. O formulário registra interesse; não marca uma reunião nem envia e-mail. O proprietário deve acompanhar os contatos e conectar sua rotina comercial. Falhas preservam os campos do visitante.

A visualização 3D é opcional: sem WebGL2, uma imagem e o resultado textual mantêm a experiência acessível. Sombras somente no desktop. O navegador de revisão não ofereceu WebGL2; nesse ambiente foram verificados o fallback, controles, filtros, formulário e layout de celular de 375 px sem rolagem horizontal. O desempenho de 60fps não foi medido.
