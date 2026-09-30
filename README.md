# CodeCraft — Voxel & Código

Landing para escolas, com identidade de aventura voxel para crianças a partir de 8 anos. O curso tem 19 módulos, 521 missões, 54 semanas e 57+ projetos. A página mostra esses números e a jornada em quatro etapas; o catálogo módulo a módulo foi retirado de propósito, para não competir com a chamada para ação.

## Executar

```sh
npm ci
npm run dev
npm run build
```

Stack: React 19, Vite, Tailwind CSS 4, Three.js, React Three Fiber, Drei, GSAP e Framer Motion.

**Front-end puro.** Não há servidor, banco nem chave externa: o site é um conjunto de arquivos estáticos. O formulário não grava nada em lugar nenhum — ele monta uma mensagem e abre o WhatsApp de quem atende.

> **O número que atende os leads fica em `src/components/LeadDialog.tsx`, na constante `NUMERO_DO_WHATSAPP`.** É a única linha que precisa mudar para trocar o atendente. Enquanto ela estiver com o valor de exemplo, nenhum lead chega a ninguém.

## Arquitetura

- `src/App.tsx`: página, animação de abertura, perguntas frequentes e navegação.
- `src/components/Curriculum.tsx`: as quatro etapas interativas da jornada.
- `src/data/stages.ts`: resumo das quatro etapas, do mundo 3D ao JavaScript.
- `src/components/WorldLab.tsx`: experiência de repetição, altura da torre e seletor de cristais.
- `src/scene/WorldScene.tsx`: cena 3D lazy, DPR adaptativo, câmera, rotação e vista explodida.
- `src/scene/config.ts`: caminho substituível do GLB.
- `src/components/LeadDialog.tsx`: formulário que abre o WhatsApp com os dados já escritos.

## Assets e fatos

A arte de abertura é uma ilustração original, identificada como universo ilustrativo; não é uma captura da plataforma. Criada pelo imagegen integrado, otimizada em WebP (~296 KB). Brief: mundo voxel colorido com florestas, construções, rio, exploradores e circuitos físicos roxos, luz diurna e sem texto.

O GLB é um cenário original de demonstração criado por `node scripts/create-demo-model.mjs`. O laboratório desta landing é uma simulação identificada como tal. Não executa strings arbitrárias. O número do controle gera andares na cena. O modelo definitivo pode substituir `MODEL_CONFIG.url`; grupos de primeiro nível com `userData.layer` controlam as camadas. Materiais `Crystal` respondem ao seletor de cor. Decodificador Draco local incluído.

O currículo é a fonte das informações; não foram adicionados depoimentos, clientes ou métricas de resultado. A autenticação no domínio original não foi concluída, portanto não foi alegada inspeção da plataforma interna.

## Produção e limites

Saída: `dist/client`, só arquivos estáticos. Pode ser servido por qualquer hospedagem de site estático.

O lead existe apenas na conversa do WhatsApp: não há banco, então quem atende é quem guarda. Se a pessoa preencher o formulário e não apertar enviar no WhatsApp, esse contato se perde — é o preço de não ter back-end, e vale saber disso ao medir conversão.

A visualização 3D é opcional: sem WebGL2, uma imagem e o resultado textual mantêm a experiência acessível. Sombras somente no desktop. O navegador de revisão não ofereceu WebGL2; nesse ambiente foram verificados o fallback, controles, filtros, formulário e layout de celular de 375 px sem rolagem horizontal. O desempenho de 60fps não foi medido.
