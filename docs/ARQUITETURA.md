# Arquitetura do Audis Lab

Este documento descreve o código como ele está neste projeto. Os nomes curtos (`W`, `re`, `ot`…) vêm do compilador e são os nomes reais no código; a tabela mais abaixo traduz os principais.

## Visão geral

- App de página única em React 18, sem servidor próprio. Roda dentro de um artefato do claude.ai.
- Navegação por *hash*: `#/material?topico=...`. A rota é o caminho; os parâmetros vêm depois de `?`.
- Todo acesso externo passa por `window.claude.use(nome)`, entregue pelo claude.ai:
  - `db`: banco de documentos JSON (limite de 256 KiB por documento).
  - `sample`: chamadas ao Claude, com a conta de quem está usando.
  - `assets`: arquivos enviados (imagens do Quadro), servidos em `/_blob/<id>`.
  - `downloads`: salvar um arquivo no aparelho (cópia do acervo).
- No modo local, `dev/claude-shim.js` implementa essas quatro capacidades sobre `dev/server.mjs`.

## Como o código é montado

`scripts/build.mjs` concatena, nesta ordem:

1. `src/00-vendor.js`
2. `src/10-nucleo-1.js`
3. `src/modulos/*.js` em ordem alfabética
4. `src/90-nucleo-2.js`

O resultado é **um único arquivo dentro de uma função** (`(() => { ... })()`), aberta em `00-vendor.js` e fechada em `90-nucleo-2.js`. Consequências:

- Nenhum arquivo de `src/` funciona sozinho. Não há `import` nem `export`.
- Tudo compartilha o mesmo escopo. Um módulo usa funções do núcleo pelo nome, e o núcleo usa componentes dos módulos (as rotas em `90-nucleo-2.js` apontam para `__RXW`, `__FC`, `__CQ`…).
- Declarações `function` valem no arquivo todo. Já `var x = ...` só tem valor depois da linha em que aparece, então a ordem dos arquivos importa para constantes.
- Cada arquivo contém declarações inteiras, mas nenhum abre ou fecha a função sozinho. Depois de renomear, criar ou reordenar arquivos, confira com `npm run check`.

## O que há em cada arquivo do núcleo

`src/10-nucleo-1.js` (as posições são aproximadas e mudam conforme o arquivo é editado; procure pelo nome):

| Trecho | Conteúdo |
|---|---|
| início | utilitários de texto e data (`Z`, `Ae`, `ot`), missões (`mo`, `Js`), árvore do material (`Zb`, `Ee`) |
| `al = class` | **o serviço**: todas as operações sobre o acervo (lista abaixo) |
| depois do serviço até `Jr = class` | biblioteca de validação de esquemas (zod) e o esquema do acervo (`pB`) |
| `ih = class` | armazenamento por HTTP de uma versão antiga com servidor e login. **Não é usado** |
| `sh = class` | **armazenamento em uso**: grava o acervo no `db` do artefato, em páginas |
| `fh = class`, `JD`, `W` | montagem do pedido de análise para colar numa conversa com o Claude (`fh`) e o provedor React que entrega `{ state, service }` (`JD`, lido com `W`) |
| ícones (`G("...")`), `rO` | ícones e a moldura do app: barra lateral, itens de menu, topo |
| `MC` | tela Missões do dia |
| `ZB`, `kO`, `$O` | análise de questão colada: ferramentas dadas ao Claude, chamada e validação |
| `ZC` | tela Hoje |
| `OO`, `DO`, `MO`, `e0`, `tM`, `VO`, `ZO` | peças do Material: árvore, classificar seção, lixeira, texto com grifos, explicação e anotação de um grifo |

`src/90-nucleo-2.js`:

| Nome | Conteúdo |
|---|---|
| `t0` | tela Material (abas Completo, Revisão, Visual, Quadro) |
| `a0` | tela Meus Erros (o caderno) |
| `i0` | tela Professor |
| `c0` | tela Desempenho |
| `g0` | tela Adicionar / Trazer questão do TEC |
| `h0` | tela de foco (`/foco`) |
| `wM`, `C3` | tabela de rotas e o roteador; no fim, `createRoot(...).render(...)` |

### Rotas

| Rota | Componente | Observação |
|---|---|---|
| `/` | `ZC` | Hoje |
| `/missoes` | `__PLW` | abas: Missões do dia (`MC`) e Plano da semana (`__PL`, com `?aba=semana`) |
| `/material` | `t0` | `?topico=<id>`, `?subtema=<chave>`, `?trilha=1`, `?quadro=1` |
| `/erros` | `__RXW` | abas: caderno (`a0`) e Raio-X (`__RX`, com `?aba=raiox`); `?treinar=<tipo>&n=<qtd>` abre o treino |
| `/flashcards` | `__FC` | |
| `/mapas` | `__MP` | `?m=<id>` abre um mapa |
| `/teoria` | `__TE` | `?m=<id do mapa>` abre o documento do assunto |
| `/ciclo` | `__CI` | quadro do ciclo de estudos |
| `/edital` | `__ED` | visão geral do edital: um quadro por assunto, que abre a página do assunto |
| `/assunto` | `__AS` | `?a=<id do assunto>`: página do assunto (estudado, teoria, mapa, Ciclo, Material, áudio). No menu, conta como Edital |
| `/professor` | `i0` | `?questao=<id>` |
| `/desempenho` | `c0` | |
| `/conquistas` | `__CQ` | |
| `/radar` | `__RDR` | |
| `/adicionar` | `g0` | |
| `/foco` | `h0` | fora da moldura normal |

## Tradução dos nomes do núcleo

| Nome | O que é |
|---|---|
| `W()` | *hook*: devolve `{ state, service }`. `state` é o acervo inteiro; `service` é o objeto com as operações |
| `re` | componente de link interno: `h(re, { href: "/erros" }, "texto")` |
| `Yr()` | *hook*: parâmetros da rota (`URLSearchParams`). Só pode ser chamado no corpo de um componente, nunca dentro de `useState(() => ...)` ou de um evento |
| `gh()` | *hook*: caminho da rota atual |
| `ka(nome)` | `await ka("db")`: pega uma capacidade do `window.claude`; devolve `null` se não houver |
| `ot(data)` | dia local no formato `AAAA-MM-DD` |
| `Z(texto)` | normaliza texto para comparar (minúsculas, sem acento) |
| `Ae(questao)` | chave única de uma questão (`tec:<número>` nas questões do TEC) |
| `Ee(secao)` | caminho de tema e subtema de uma seção do material |
| `Zb(material)` | monta a árvore disciplina › tema › subtema |
| `zn(n)` | faixa de cor da incidência de um grifo |
| `mo(state)`, `Js(state)` | missões diárias e o progresso de hoje |
| `XO(questoes)` | opções de banca para filtros |
| `Za` | cabeçalho de página (`eyebrow`, `title`, `description`) |
| `da` | janela modal |
| `te` | mensagem de aviso ou erro (`<p class="notice">`) |
| `k`, `Qa`, `V`, `mt`, `st`, `be`, `fe`, `K`, `B`, `S`, `L`, `ee`, `Ct`… | todos são o mesmo `react/jsx-runtime`. `(0, k.jsx)("div", {...})` é o JSX compilado |
| `kt`, `zt`, `Tn`, `qo`, `Vi`, `Ha`, `ph`… | todos são o mesmo `React` (para `useState`, `useMemo`…) |
| `__rdR` | o `React` usado pelos módulos; neles, `let h = __rdR.createElement` |

### Operações do serviço (`service`)

Consulta: `activeMaterial`, `section`, `question`, `performanceQuestions`, `statistics`, `sectionPerformance`, `topicPerformance`, `dueReviews`, `relatedErrors`, `relatedMaterial`, `searchMaterial`, `incidenceContext`, `previewIncidences`, `checkQuestionCode`, `context`.

Questões e análises: `createIntake`, `receiveIntake`, `approveIntake`, `approveIntakeWithMaterial`, `rejectIntake`, `intakeMaterial`, `importResponse`, `addQuestion`, `recordAnswer`, `recordAnalysisSubmissions`, `answerFeedback`, `selectQuestion`, `setCurrentQuestion`, `openQuestionId`, `setQuestionUnderstanding`.

Material: `propose`, `proposeManual`, `prepareProposal`, `proposal`, `reviewProposal`, `classifyMaterial`, `renameSubtopic`, `archiveMaterial`, `restoreMaterial`, `saveMaterialScene`, `saveSimpleSummary`, `saveThemePath`, `placeThemeStep`, `moveThemeStep`, `setThemeStepLevel`.

Grifos: `setHighlightUnderstanding`, `setHighlightNote`, `saveHighlightNoteReview`, `saveHighlightExplanation`, `saveNote`.

Erros: `addError`, `reviewError(id, lembrou, data)`, `setErrorUnderstanding`.

Missões: `saveDailyMission`, `adjustMissionCount`, `completeMission`, `syncDailyCompletions`.

## Dados

### O acervo (`state`)

| Campo | Conteúdo |
|---|---|
| `questions` | questões coladas: `id`, `number` (código no TEC), `subject`, `topic`, `subtopics`, `board`, `year`, `exam`, `statement`, `alternatives`, `correct`, `chosen`, `answeredCorrectly`, `commentary`, `date`, `sectionId`, `source` (`"tec-manual"` nas questões reais) |
| `material` | seções do Material Único: `id`, `subject`, `topicPath`, `topic`, `title`, `text`, `version`, `concepts`, `highlights`, `deletedAt` |
| `material[].highlights` | grifos: `phrase` (trecho literal do texto), `count`, `references` (questões que cobraram: `questionId`, `key`, `board`, `exam`, `evidence`, `explanation`), `understanding` (`understood`, `partial`, `not_understood` ou ausente), `note`, `noteReview` |
| `errors` | caderno de erros: `id`, `questionId`, `questionSnapshot`, `concept`, `correctRule`, `probableCause`, `trap`, `memorizationPhrase`, `reviews` (`{ date, recalled }`) |
| `responses` | análise do Claude por questão (objeto com chave = id da questão) |
| `proposals` | propostas de mudança no material (`status`: `pending`…) |
| `intakes` | fila de questões coladas (`status`: `waiting`, `review`, `rejected`, `approved`) |
| `history` | registro de eventos |
| `dailyMissions`, `missionLog`, `completedMissions` | missões diárias, ajustes manuais (+1/+5) e metas cumpridas |
| `themePaths`, `notes`, `answerHistory`, `currentQuestionId` | trilhas de tema, anotações, histórico de respostas e questão atual |

### Como o acervo é gravado

A classe `sh` divide o acervo em **páginas** na coleção `pages`. Cada documento tem a forma:

```json
{ "collection": "errors", "records": { "[\"<id>\",0]": { "position": 0, "rev": 1793644772667, "value": { } } }, "updatedAt": "...", "writeId": "..." }
```

- O nome do documento é `<coleção>.<sufixo>` (por exemplo `errors.mutcihh32lh2o`). Uma coleção grande ocupa várias páginas, para respeitar o limite de 256 KiB.
- A chave de cada registro é `["id", parte]` em JSON. Um registro grande pode ser partido em várias partes.
- Antes de gravar, a classe escreve um diário em `journal/` e `meta/journal`, e pega uma trava em `meta/lock`, para não corromper o acervo se dois aparelhos salvarem ao mesmo tempo.

### Outras coleções do banco

| Coleção | Documentos | Quem usa |
|---|---|---|
| `fcards` | `srs` (agenda de cada card: `d` próxima data, `i` intervalo, `n` vezes, `r` resultado `u`/`p`/`n`, `t` quando), `q0`…`q7` (perguntas geradas pelo Claude) | Flashcards |
| `rxerr` | `types` (tipo de cada erro: `t`, e o par `a`/`b` quando é confusão), `pairs` (quadros comparativos) | Raio-X |
| `quadro` | um documento por imagem: `sid` (seção), `asset`, `title`, `o` (ordem), `q`/`qn`/`qb` (questão), `read` (leitura do Claude), `fc` (virou flashcard) | Quadro |
| `quadroimg` | imagem em base64, só quando o envio de arquivos não está disponível | Quadro |
| `mapas` | um documento por mapa: `nome`, `disc`, `srs` (`s` degrau, `d` próxima data, `t` último treino, `r` % lembrado), `tr` (treino do mapa inteiro ainda não terminado: `res` com a resposta de cada lacuna já feita, `at`; some ao terminar; `__mpPend` diz se há o que continuar), `pags` (cada página: `id`, `asset` ou `dbimg`, `titulo`, `ramos[].itens[]` com `id`, `x` e as lacunas entre `{{ }}`, `m` selo; `mst` com a última resposta de cada lacuna, chave `<id do item>\|<nº>`, valor `y` lembrou/entendido, `p` parcial, `n` não lembrou/não entendido). Cada ramo pode ter `subs` (chaves de nós da árvore do Material, as mesmas de `Zb`) e `sug` (sugestões do Claude ainda não confirmadas). O mapa pode ter `faltas` (`itens[]`: `rid`, `iid`, `sid` seção, `x` afirmação, `txt` parágrafo sugerido, `st` `p` proposta criada ou `x` dispensado). A imagem de uma página sem `asset` fica em `quadroimg/<id da página>` | Mapas |
| `teoria` | um documento por mapa (mesmo id): `nome`, `caps` (`rid` id do ramo, `t` título, `s` retrato do ramo quando o capítulo foi escrito, `auto` subtemas do Material que o Claude achou para o capítulo, `iv` e `gv` (retratos das afirmações do mapa e dos trechos marcados já levados em conta, para detectar o que é novo: `__teNovidades`), `bl` blocos `{ k: "f" fonte | "c" complemento do Claude, x, g: trechos marcados do Material que tratam do mesmo ponto [{ s: id da seção, p: frase }] }`), `livre` (texto mudado pela conversa: os capítulos têm `id` e `rids` em vez de `rid`), `ant` (versão anterior, para desfazer), `chat` (últimas 12 mensagens). Capítulo copiado de outra teoria: `cp` (`<id do mapa de origem>\|<chave>`), `rids` vazio |
| `ciclo` | dois documentos. `edital`: `nome`, `discs` (`id`, `n` nome, `q` questões, `peso`, `b` blocos por volta, `as` assuntos `{ id, t }`); só existe depois que o aluno edita, antes vale `__ciRef`. `andamento`: `volta`, `done` (blocos feitos na volta, chave `<disciplina>#<nº>`), `cont` (blocos por assunto), `tot` (blocos por disciplina), `log` (últimos 400 blocos), `est` (assuntos marcados como estudados: id do assunto › dia; `__ciEstudado`) |
| `ouvir` | `tempo`: `dias` (`AAAA-MM-DD` › matéria › segundos de leitura em voz alta ouvidos; últimos 120 dias; ao juntar aparelhos vale o maior valor) | Ouvir |
| `plano` | `config` (minutos padrão por dia), `w-AAAA-MM-DD` (uma semana, pela segunda-feira): `mins`, `blocks`, `reasons`, `claude` | Plano da semana |

### Preferências no navegador (`localStorage`)

Chaves `magis:*` e `audis:*`: filtros de telas, modo e sessão do dia dos Flashcards (`magis:fc-ses`), cópias locais de `fcards`, `rxerr`, `quadro` e `plano` para abrir rápido, última seção aberta no Material. Nada disso é a fonte da verdade, exceto a sessão de flashcards do dia.

## Os módulos

Cada módulo usa um prefixo próprio. Funções com letra minúscula depois de `__` são lógica; com maiúscula, componentes React.

| Arquivo | Prefixo | Conteúdo |
|---|---|---|
| `20-subtemas-auxiliares.js` | `__sb` | codificar a chave de um subtema para a URL e achar o nó na árvore |
| `21-radar-da-banca-e-utilitarios.js` | `__rd` | `__rdR` (React), `__rdLS`/`__rdSS` (localStorage), `__rdHash`, `__rdPath`, `__rdData`; tela `__RDR` |
| `22-entendimento-dos-grifos.js` | `__ut` | barra "Seu entendimento dos grifos" (`__UTB`) |
| `23-conquistas.js` | `__cq` | tela `__CQ`: nível, territórios, flashcards, questões por subtema |
| `24-flashcards.js` | `__fc` | `__fcCards` (monta os cards a partir dos grifos classificados), agenda, geração e correção pelo Claude; `__FCCard`, `__FC` |
| `25-raio-x-dos-erros.js` | `__rx` | classificação dos erros (regras e Claude), pares confundidos, treino (`__RXTrain`), tela `__RX`, abas `__RXW` |
| `26-quadro-do-topico.js` | `__qd` | guarda e lê imagens, leitura pelo Claude, mural e detalhe (`__QD`), alfinete na árvore (`__QDPin`) |
| `27-plano-da-semana.js` | `__pl` | gerador do plano (`__plGen`), progresso automático (`__plProg`), ajuste pelo Claude, tela `__PL`, abas `__PLW`; no fim, `__rxAuto` (abre o treino do Raio-X pela URL) |
| `29-mapa-mental.js` | `__mp` | área Mapas: armazenamento próprio (`__mpStore`, `__mpPut`), leitura de uma página pelo Claude (`__mpReadPage`), lacunas (`__mpParts`, `__mpGaps`, `__mpBuild`), agenda (`__mpSched`), migração do que foi lido no Quadro (`__mpMigrate`); telas `__MP` (lista), `__MPMap` (um mapa), `__MPRamos` e `__MPItemEdit` (correção), `__MPStudy` (treino), `__MPBadge` (contador do menu). As imagens usam as funções do Quadro (`__qdPrep`, `__qdStoreImg`, `__qdSrc`) |
| `30-mapas-e-material.js` | `__mp` | ligação dos ramos de um mapa com o Material: índice dos subtemas (`__mpIdx`, `__mpNodesFor`), espelho de questões e grifos (`__mpNodeStats`, `__mpRamoStats`), sugestão de subtemas (`__mpSuggest`) e comparação com o texto das seções (`__mpCompare`) pelo Claude; componentes `__MPSubs` (subtemas de um ramo), `__MPBanca` (Mapa × banca) e `__MPLink` (atalho no Material) |
| `31-teoria.js` | `__te` | área Teoria: um documento por mapa, um capítulo por ramo. Armazenamento próprio (`__teStore`, `__tePut`), escrita pelo Claude com um pedido por ramo, dois de cada vez, gravando cada capítulo assim que chega (`__teGerar`, `__teCap`), capítulos que faltam ou mudaram (`__teFalta`, `__teSigRamo`), e "O que já caiu" lido do Material pelos subtemas do ramo (`__TECaiu`, usa `__mpRamoStats`). Copiar capítulos para a teoria de outro assunto (`__teCopiar`, janela `__TECopia`, aberta na Teoria e no Edital): o texto vai igual, o destino fica `livre` e o mapa do assunto é criado se faltar (`__ciMapaCriar`); como o áudio guardado no aparelho é achado pelo texto (módulo 35), os parágrafos copiados não geram pedido novo à ElevenLabs |
| `32-ciclo-edital.js` | `__ciRef` | edital de referência do Ciclo: Auditor-Fiscal da Receita Federal, Edital nº 1/2022 (FGV), transcrito do PDF oficial. Os ids das disciplinas e dos assuntos não podem mudar |
| `33-ciclo.js` | `__ci` | área Ciclo: armazenamento próprio (`__ciStore`, `__ciSave`), fila da volta (`__ciFila`), registro e desfazer de bloco (`__ciFeito`, `__ciDesfazer`), cronômetro de 25 min guardado no localStorage (`audis:ci-timer`), mapa do edital por disciplina (`__CIDisc`). Não usa IA |
| `34-edital.js` | `__ed` | área Edital: índice das disciplinas, um painel por disciplina e um quadro por assunto. Cor do quadro: forte se o assunto está marcado como estudado (`est` no andamento do Ciclo), clara se tem teoria ou mapa, tracejada se não tem nada (`__edInfo`). O quadro é um link para `/assunto?a=<id>`. Não guarda nada: lê `__ciEd`, `__ciAn`, `__mpStore` e `__teStore`. Não usa IA |
| `36-assunto.js` | `__as` | página de um assunto do edital (`__AS`): marca de estudado (`__ciEstudado`), cartões de teoria (abrir, criar com `__ciAbrir`, ouvir, copiar com `__TECopia`), mapa, Ciclo, subtemas do Material (ramos do mapa e `auto` dos capítulos, com `__mpRamoStats`) e áudio da matéria (`__OVTempo`). Não guarda nada próprio e não usa IA |
| `35-ouvir.js` | `__ov` | leitura em voz alta com a voz do aparelho (`speechSynthesis` do navegador; não usa IA nem o banco). Fila de frases curtas (`__ovFrases`, com as abreviações jurídicas abertas por `__ovFalado`), tocar, pausar, pular parágrafo, velocidade, hora de parar (`__ovTocar`, `__ovPausar`, `__ovPular`, `__ovVel`, `__ovSono`); botão `__OVBtn` e barra `__OVPlayer`. Onde o servidor tem a chave da ElevenLabs (`/__config` devolve `voz: true`), pede o áudio de cada parágrafo em `/__voz` (`__ovBusca`, `__ovFalarEl`) e toca num `<audio>`; se falhar, segue com a voz do aparelho (`__ovSemEl`). A ponte fica em `ia/voz.mjs` (usada por `dev/server.mjs` e `api/voz.js`; no site publicado, `pages/sw.js` encaminha com a senha). A Teoria monta os parágrafos com `__ovDaTeoria`; os ids `te-h-<capítulo>` e `te-b-<capítulo>-<nº>` dos elementos servem para destacar o trecho lido. Preferências em `audis:ov` no localStorage. Tempo ouvido por dia e por matéria: `__ovTick` soma o tempo de relógio com a leitura tocando (a cada 5 s e a cada mudança do leitor), `__ovTGrava` grava em `ouvir/tempo` a cada minuto e ao pausar, `__ovTSeg` consulta; quadro `__OVTempo` (tela Teoria e página do assunto) e gráfico por dia `__OVGraf` (tela Hoje; período em `audis:ov-graf`) |
| `28-material-unico-do-subtema.js` | `__SBV` | leitura de um subtema inteiro; é o único módulo escrito no estilo do compilador |

Pontos em que o núcleo foi alterado para encaixar os módulos (procure pelo nome):

- Rotas em `wM` (`90-nucleo-2.js`): `__PLW`, `__RXW`, `__RDR`, `__FC`, `__CQ`, `__MP`, `__ED`, `__AS`.
- Tela Hoje (`ZC`): gráfico `__OVGraf`, logo depois dos números do dia.
- Moldura (`10-nucleo-1.js`): em `/assunto`, o item Edital do menu fica ativo e o topo mostra "Edital".
- Menu lateral (`10-nucleo-1.js`): itens Flashcards, Mapas, Conquistas e Radar, com os ícones `__fcIcon`, `__mpIcon`, `__cqIcon`, `__rdIcon`, e os contadores `__fcBadge` e `__MPBadge`.
- Tela Material (`t0`) e Material único do subtema (`__SBV`): atalho para o mapa (`__MPLink`).
- Tela Material (`t0`): aba "Quadro" (`__QDTab`, `__QD`), barra `__UTB`, botão "Material único do subtema" (`__sbOpen`, `__SBV`).
- Árvore do material (`DO`): alfinete `__QDPin`.
- Flashcards (`__fcCards`, `__FCCard`): cards vindos do Quadro (`__qdFcAdd`, `__QDFcBack`).

## Chamadas ao Claude

Todas usam `sample(...)` ou `sample.json(...)`, com `modelTier` `quick`, `default` ou `complex`.

| Onde | Função | Nível |
|---|---|---|
| Analisar questão colada (com ferramentas `buscar_material`, `ler_secao`, `conferir_codigo`, `enviar_analise`) | `kO` | escolhido na tela |
| Trilha de um tema | `AO` | `default`, com nova tentativa em `complex` se a resposta vier cortada |
| Cena visual do material, explicação de um grifo, análise de anotação, resumo simples | `RO`, `jO`, `qO` e a função de resumo em `90-nucleo-2.js` | `default` ou `complex` |
| Radar: agrupar pegadinhas | `__rdGroup` | `default` |
| Flashcards: gerar perguntas / corrigir resposta | `__fcGen` / `__fcGrade` | `default` / `quick` |
| Raio-X: classificar erros / quadro comparativo | `__rxClassify` / `__rxCompare` | `quick` / `default` |
| Quadro: ler imagem e comparar com o material | `__qdRead` | `default`, com imagem |
| Mapas: sugerir subtemas para os ramos / comparar o mapa com o Material | `__mpSuggest` / `__mpCompare` | `default` |
| Mapas: transcrever a página em ramos e lacunas | `__mpReadPage` | `default`, com imagem |
| Mapas: conferir a resposta escrita numa lacuna e sugerir entendido, parcial ou não entendido | `__mpGrade` | `quick` (resposta igual ao trecho não gera pedido) |
| Teoria: achar no Material os subtemas de cada ramo / escrever um capítulo | `__teLigar` / `__teCap` | `default` |
| Teoria: acréscimo num capítulo já escrito (afirmações e trechos marcados novos) | `__teInc`, chamado por `__teAtualizarPag` e por `__teGerar` | `default` |
| Teoria: conversa para mudar o texto (plano da mudança / um pedido por capítulo reescrito) | `__teConversa` / `__teCapChat` | `default` |
| Plano: ajustar por pedido em texto | `adjust` dentro de `__PL` | `default` |

Os prompts tratam o texto do aluno e das questões como dado, pedem JSON e validam a resposta antes de salvar.

## Cores usadas nos gráficos

- Entendimento dos grifos: verde `#3d8b57`, âmbar `#c99a2e`, vermelho `#c4473a`, cinza hachurado para "sem marcação".
- Consolidação dos flashcards (azuis): `#2b5c8a`, `#6f9fcf`, `#b3cde8`.
- Questões: certas em violeta `#6250d6`, erradas em laranja `#eb6834`.
- Blocos do plano: questões verde `#516a43`, erros laranja `#eb6834`, flashcards azul `#2b5c8a`, material âmbar `#c99a2e`, fechamento violeta `#6250d6`.
