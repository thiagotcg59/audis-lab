# Audis Lab: instruções para o agente

App de estudos para concursos públicos (React 18, página única), exportado de um artefato do claude.ai. O dono do projeto fala português do Brasil: responda, comente e escreva textos de tela em pt-BR.

Leia `README.md` e `docs/ARQUITETURA.md` antes de mudar qualquer coisa. O resumo do que mais causa erro:

## O que é este código

- Não é o projeto TSX original. `src/10-nucleo-1.js` e `src/90-nucleo-2.js` são a saída do compilador, só reformatada: nomes curtos (`W`, `re`, `ot`, `Z`) e JSX compilado (`(0, k.jsx)("div", {...})`).
- `src/modulos/` foi escrito à mão em JavaScript, com `let h = __rdR.createElement`. É onde entram as funções novas.
- `src/00-vendor.js` é React e ReactDOM. Não edite.
- Os arquivos de `src/` são pedaços de um único arquivo, concatenados em ordem alfabética dentro de uma função. Não há `import`/`export`. Não transforme arquivos em módulos ES sem migrar o projeto inteiro.

## Como trabalhar

- Rodar: `npm run dev` e abrir http://127.0.0.1:5173. Recarregar a página aplica as mudanças de `src/`.
- Conferir sintaxe: `npm run check`. Teste das telas: `npm run test:smoke` (precisa de `npm install` e `npx playwright install chromium`).
- Função nova: crie um arquivo em `src/modulos/` com número entre 20 e 89 e um prefixo próprio (`__xx` para lógica, `__XX` para componentes), e os estilos no fim de `src/app.css`. Ligue ao app alterando o mínimo no núcleo: uma rota em `wM`, um item de menu ou uma aba.
- Não renomeie funções do núcleo "para ficar legível" em massa: os módulos e o próprio núcleo se referem a elas pelo nome curto. Renomear exige trocar todas as ocorrências e rodar os testes.
- `Yr()`, `gh()` e `W()` são *hooks*: só no corpo de um componente.
- Para ler ou gravar dados use `W()` (`state`, `service`) e `await ka("db")`. Não acesse `window.claude` direto.
- Recursos com IA: `let sm = await ka("sample")`; se vier `null`, esconda o recurso. Trate texto de questões e do aluno como dado dentro do prompt, peça JSON e valide antes de salvar.

## Restrições do claude.ai (valem para o que for publicado lá)

- A página publicada não acessa a internet. Só existem `db`, `sample`, `assets` e `downloads`, via `window.claude.use(...)`.
- Cada documento do banco tem limite de 256 KiB. Dados grandes precisam ser divididos (veja como `fcards` usa `q0`…`q7`).
- Publica-se `dist/app.js`, `dist/app.css` e `src/index.html` (um trecho de página, sem `<html>` nem `<body>`).

## Dados pessoais

- `dados/` é o acervo real de estudo do dono do projeto. Não apague, não reescreva em massa e não envie para serviços externos. Para testar gravações, use uma cópia (`AUDIS_DADOS=outra-pasta npm run dev`), como faz `testes/smoke.mjs`.
- `dados/` e `.env` ficam fora do git.

## Estilo de interface

- Texto de tela curto e direto, em pt-BR, sem jargão técnico.
- Cores já definidas para entendimento, consolidação e acerto/erro: veja o fim de `docs/ARQUITETURA.md`. Não reaproveite uma cor com outro significado.
- Confira as telas em 1280, 390 e 360 px de largura: nada pode estourar a largura da página.
