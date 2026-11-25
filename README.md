# Audis Lab

App de estudos para concursos, exportado do artefato do claude.ai (versão 29, de 08/11/2026), com um ambiente local para continuar o desenvolvimento fora do Claude.

## Leia antes: isto não é o projeto TSX original

O artefato do claude.ai guarda só o app **compilado**: um `app.js`, um `app.css` e um `index.html`. O projeto original em TSX não está no artefato e não esteve nas conversas em que o Audis Lab foi evoluído. Todas as funções novas foram escritas direto sobre o código compilado.

O que há neste projeto:

| Parte | O que é | Estado do código |
|---|---|---|
| `src/modulos/` | As funções acrescentadas depois: Radar da banca, entendimento dos grifos, Conquistas, Flashcards, Raio-X dos erros, Quadro do tópico, Plano da semana, Material único do subtema | **Código-fonte de verdade**: foi escrito à mão em JavaScript, com nomes legíveis e `React.createElement` (sem JSX). Só foi reformatado. |
| `src/10-nucleo-1.js` e `src/90-nucleo-2.js` | O núcleo do app: dados, telas principais (Hoje, Missões, Material, Erros, Professor, Desempenho, Adicionar), análise de questões | **Saída do compilador**, reformatada. A lógica está toda lá, mas os nomes de variáveis e funções são curtos (`W`, `re`, `ot`, `Z`…) e o JSX aparece como chamadas `jsx(...)`. |
| `src/00-vendor.js` | React e ReactDOM empacotados | Biblioteca de terceiros. Não é para editar. |
| `src/app.css` | Todo o estilo | Reformatado; classes com nomes legíveis. |

Se o projeto TSX original ainda existir, ele está onde o Audis foi criado pela primeira vez (outro computador, outra conversa ou repositório). O código compilado tem vestígios de uma versão com servidor próprio e login (`/login`, "conector Audis (MCP)"), o que indica que o original era um app web com servidor. Vale procurar por uma pasta com `package.json` e arquivos `.tsx`. Se você achar, as funções de `src/modulos/` podem ser portadas para lá.

## Como rodar

Precisa de Node 20 ou mais novo.

```bash
npm run dev
```

Abra http://127.0.0.1:5173. O app sobe com os seus dados (pasta `dados/`). Depois de editar qualquer arquivo de `src/`, basta recarregar a página: o servidor monta o `app.js` de novo a cada pedido.

`npm run dev` não precisa de `npm install`. As dependências do `package.json` (esbuild e Playwright) servem só para minificar e para o teste automático.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor local em http://127.0.0.1:5173, montando `src/` na hora |
| `npm run build` | Gera `dist/` legível (`app.js`, `app.css`, `index.html`) |
| `npm run build:min` | Gera `dist/` minificado, do tamanho do que está publicado (precisa de `npm install`) |
| `npm run preview` | Minifica e serve `dist/`, para conferir exatamente o que seria publicado |
| `npm run check` | Monta e confere a sintaxe do `app.js` |
| `npm run test:smoke` | Abre as 14 telas principais num navegador e confere que carregam sem erro. Usa uma cópia dos dados. Precisa de `npm install` e `npx playwright install chromium` |

## Estrutura

```
src/
  00-vendor.js            React e ReactDOM (não editar)
  10-nucleo-1.js          núcleo: dados, serviço, armazenamento, telas (saída do compilador)
  modulos/                funções novas, em ordem de carga
    20-subtemas-auxiliares.js
    21-radar-da-banca-e-utilitarios.js
    22-entendimento-dos-grifos.js
    23-conquistas.js
    24-flashcards.js
    25-raio-x-dos-erros.js
    26-quadro-do-topico.js
    27-plano-da-semana.js
    28-material-unico-do-subtema.js
  90-nucleo-2.js          resto do núcleo: Material, Erros, Professor, Desempenho, Adicionar, rotas
  app.css                 estilos
  index.html              trecho de página publicado no claude.ai
dev/
  server.mjs              servidor local (sem dependências)
  claude-shim.js          simula o window.claude do claude.ai
  index.html              página do modo local
scripts/build.mjs         junta src/ em dist/
testes/smoke.mjs          teste rápido das telas
dados/                    SEUS DADOS (fora do git): banco e imagens
publicado-v29/            cópia exata do que está publicado no claude.ai
docs/                     arquitetura, funcionalidades e imagens das ideias
AGENTS.md                 instruções para o agente do Antigravity
```

Os arquivos de `src/` **não são módulos independentes**: são pedaços de um único arquivo, concatenados em ordem alfabética. Todos compartilham o mesmo escopo. Por isso um módulo pode chamar funções do núcleo (`W()`, `ot()`, `Z()`), e a ordem dos arquivos importa. Detalhes em [docs/ARQUITETURA.md](docs/ARQUITETURA.md).

## Recursos com IA (API do Claude)

No claude.ai, o Audis usa o Claude da sua conta. Fora de lá, ele chama a API do Claude com uma chave sua. **A API é cobrada por uso**, separada da assinatura do claude.ai: crie a chave e ponha créditos em https://platform.claude.com.

A conversa com a API fica em `ia/claude.mjs` (SDK oficial). O app pede três níveis, e cada um tem modelo e esforço próprios:

| Nível | Usado em | Padrão |
|---|---|---|
| rápido | corrigir flashcard, classificar erros | `claude-haiku-5-5`, esforço `low` |
| padrão | análise de questão, leitura de imagem, plano, trilha | `claude-opus-5-5`, esforço `medium` |
| complexo | análise "aprofundada" | `claude-opus-5-5`, esforço `high` |

Para gastar menos, troque o nível padrão para `claude-sonnet-5-5` (variáveis `AUDIS_MODELO_*` e `AUDIS_ESFORCO_*`, veja `.env.example`).

**No computador:** copie `.env.example` para `.env`, preencha `ANTHROPIC_API_KEY`, rode `npm install` uma vez e reinicie `npm run dev`.

**No celular (Vercel):** em vercel.com, no projeto, abra Settings › Environment Variables e crie `ANTHROPIC_API_KEY` (a chave) e `AUDIS_SENHA` (uma senha que você inventa). Faça um novo deploy (Deployments › ⋯ › Redeploy). No app, abra "Dados neste aparelho", digite a senha e toque em "Salvar e testar". A senha existe porque o endereço é público: sem ela, qualquer pessoa com o link gastaria os seus créditos. A chave nunca sai do servidor.

No GitHub Pages não há servidor, então lá a IA não funciona.

### Voz da ElevenLabs para ouvir a Teoria

"Ouvir a teoria" usa a voz do aparelho, de graça. Para ler com uma voz da ElevenLabs (paga por caractere, com conta e chave suas em https://elevenlabs.io), o servidor precisa de duas variáveis:

- `ELEVENLABS_API_KEY`: a chave (no site da ElevenLabs, Developers › API Keys).
- `ELEVENLABS_VOICE_ID`: o id da voz escolhida (em Voices, no menu da voz, "Copy voice ID").

**No computador:** ponha as duas no `.env` e reinicie `npm run dev`. **No Vercel:** crie as duas em Settings › Environment Variables, junto com `AUDIS_SENHA` (a mesma senha da IA; não precisa ter a chave do Claude), faça um novo deploy e, no app, digite a senha em "Dados neste aparelho". No leitor, o campo "Voz" passa a oferecer "ElevenLabs"; dá para voltar à voz do aparelho ali mesmo. No GitHub Pages e no claude.ai só existe a voz do aparelho.

O app pede o áudio de um parágrafo por vez (o seguinte só é pedido quando o atual está acabando) e guarda cada um no navegador do aparelho: ouvir de novo o mesmo texto, com a mesma voz e o mesmo modelo, não gasta nada; o leitor mostra quantos caracteres novos foram pedidos na leitura. O que fica guardado vale só para aquele aparelho e some se os dados do site forem limpos; se o texto de um parágrafo mudar, só ele é pedido de novo. Por isso a Teoria protege o que já foi ouvido: capítulo com áudio guardado aparece marcado com "áudio guardado" e não é reescrito nas atualizações nem pela conversa (recebe só parágrafos novos), a não ser que você escolha reescrever mesmo assim. A ponte (`ia/voz.mjs`) foi testada contra uma ElevenLabs simulada; o primeiro uso com a sua chave é o teste real.

Sem chave, o app funciona normalmente e esconde o que depende de IA.

A ponte foi testada contra uma API simulada (formato dos pedidos, rodadas com ferramentas, imagens, erros, senha). Ainda não rodou contra a API real: o primeiro uso com a sua chave é o teste. Imagens muito pesadas (acima de uns 3 MB) podem não passar pelo limite de envio do Vercel.

## Seus dados

`dados/` é uma cópia do banco do artefato tirada em 23/11/2026:

- `dados/db/pages/`: o acervo principal (questões, material, erros, análises, histórico, missões).
- `dados/db/fcards/`, `rxerr/`, `quadro/`, `plano/`: dados dos Flashcards, do Raio-X, do Quadro e do Plano da semana.
- `dados/assets/`: as 2 imagens coladas no Quadro.

Pontos de atenção:

- **O modo local e o claude.ai não se sincronizam.** O que você estudar em um não aparece no outro.
- `dados/` e `.env` estão no `.gitignore`. São dados pessoais de estudo; não suba para repositório público.
- No modo local, as preferências de tela (filtros, sessão de flashcards do dia) ficam no `localStorage` do navegador em `127.0.0.1:5173`, separadas das do claude.ai.

## Abrir pelo GitHub Pages (celular)

A cada envio para a `main`, o GitHub publica o app em https://thiagotcg59.github.io/audis-lab/ (`.github/workflows/pages.yml`).

Lá não existe servidor. Os arquivos de `pages/` fazem o papel dele dentro do navegador: `sw.js` responde aos mesmos pedidos que `dev/server.mjs` e guarda tudo no IndexedDB do aparelho (`armazem.js`). O app e o simulador `dev/claude-shim.js` são os mesmos.

- **Os dados não vão para o GitHub.** Leve-os num pacote: `npm run dados:empacotar` gera `pacotes/audis-dados-AAAA-MM-DD.json.gz`; no celular, abra `…/audis-lab/dados.html` e carregue o arquivo.
- **Cada aparelho tem a sua cópia.** Nada se sincroniza com o computador nem com o claude.ai.
- **Faça cópias.** Se o navegador limpar os dados do site, o estudo feito ali se perde. Em `dados.html`, "Baixar cópia dos dados" gera um pacote igual.
- **Trazer de volta ao computador:** `node scripts/empacotar-dados.mjs --abrir <pacote> dados-do-celular` cria uma pasta nova (nunca escreve por cima); confira com `AUDIS_DADOS=dados-do-celular npm run dev`.
- **Sem IA:** não há onde guardar uma chave com segurança numa página pública, então os recursos com IA ficam escondidos.
- Para testar antes de enviar: `npm run build:pages` gera `site/`.
- **Instalar como app:** o site tem manifesto e ícones (`pages/manifest.webmanifest`, `pages/icones/`). No Android: menu do Chrome › "Adicionar à tela inicial". No iPhone: Safari › Compartilhar › "Adicionar à Tela de Início". No iPhone o app instalado tem armazenamento separado do Safari: carregue o pacote de dados de dentro do app (link "Dados neste aparelho" no fim da página).
- **Vercel:** `vercel.json` já diz como montar (`site/`). Com o repositório importado em vercel.com, cada envio para a `main` republica sozinho. O endereço do Vercel e o do GitHub Pages guardam dados separados; escolha um para usar.

## Publicar de volta no claude.ai

O artefato continua no ar e pode receber novas versões:

1. Rode `npm run build:min`.
2. Numa conversa com o Claude, envie `dist/app.js` e `dist/app.css` e peça para publicar no artefato do Audis Lab (https://claude.ai/artifact/Bgnsr5SPbQ1zXnHGbBSiUR).

No claude.ai a página não acessa a internet: tudo passa pelo `window.claude`. Qualquer função nova que chame outra API vai funcionar só no modo local.

## Fora do claude.ai, de vez

Para hospedar o Audis por conta própria, o caminho é trocar o simulador por serviços reais: `dev/claude-shim.js` mostra exatamente quais chamadas o app faz (`db`, `sample`, `assets`, `downloads`). Um banco de documentos e um servidor que guarde a chave da IA bastam. O servidor de `dev/` é só para desenvolvimento: não tem login e guarda tudo em arquivos.
