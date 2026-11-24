# Funcionalidades do Audis Lab (versão 29)

## Telas

| Tela | O que faz |
|---|---|
| **Hoje** | Resumo do dia e atalhos para continuar o estudo. |
| **Missões › Missões do dia** | Uma meta diária de questões por matéria. Contam as questões coladas no dia; os botões +1 e +5 registram as feitas no TEC sem colar. |
| **Missões › Plano da semana** | Plano semanal em blocos (questões, erros, flashcards, material, fechamento, bloco livre), montado a partir do tempo de cada dia e do que está pendente. Tudo editável: mudar, mover, duplicar, excluir, criar blocos, pedir ajuste ao Claude, replanejar. Balanço planejado × feito. |
| **Material** | O Material Único: seções por disciplina › tema › subtema, com grifos ligados às questões que cobraram cada trecho. Abas Completo, Revisão, Visual e Quadro. Leitura de um subtema inteiro. |
| **Material › Quadro** | Mural de imagens por tópico (prints dos comentários do TEC). O Claude lê a imagem, compara com o texto do tópico e prepara um flashcard da tese. |
| **Erros › Caderno de erros** | Cada erro com regra certa, causa provável, pegadinha e frase de memorização. Revisão espaçada. |
| **Erros › Raio-X** | Classifica os erros por tipo de deslize, mostra pares de institutos confundidos, matriz matéria × tipo, erros por semana e treinos dirigidos. |
| **Flashcards** | Cards a partir dos grifos já classificados e das imagens do Quadro. Resposta por escrito corrigida pelo Claude; escala Consolidado, Parcialmente consolidado, Não consolidado, separada da marcação dos grifos. |
| **Mapas** | Área própria para mapas mentais, organizados por disciplina › mapa › páginas. Cada página é uma imagem; o Claude transcreve em ramos e afirmações e marca as palavras-chave. Imagem e ramos lado a lado, correção da transcrição (texto, selo e quais palavras ficam escondidas), treino de lacunas (uma por vez, Lembrei / Não lembrei) do mapa inteiro, de uma página ou só das que faltaram. Depois de um treino do mapa inteiro, ele volta em 1, 3, 7, 15 e 30 dias; o menu mostra quantos mapas há para revisar hoje. |
| **Mapas › Mapa × banca** | Cada ramo do mapa é ligado a subtemas do Material: o Claude sugere e você confirma, ou você escolhe à mão. O ramo mostra, direto do Material (sem cópia), as questões e os erros do subtema e os grifos com o seu entendimento. A visão Mapa × banca ordena os ramos pelos erros, indica por onde começar e treina só um ramo. O Claude também compara o mapa com o texto das seções e lista o que falta no Material, com botão para criar a proposta de inclusão. No Material, o tópico ou subtema que está num mapa mostra o atalho, o aproveitamento e o treino dos ramos. |
| **Teoria** | Um documento de estudo por mapa (assunto), com um capítulo por ramo. O Claude escreve o texto a partir do mapa e das seções do Material ligadas ao ramo, e pode completar com o que sabe: esses parágrafos aparecem marcados como "Complemento do Claude". Em cada capítulo, "O que já caiu" mostra as questões, os erros e os trechos marcados do Material nos subtemas ligados ao ramo (lidos na hora, sem cópia). Se o mapa mudar, a tela avisa para atualizar. |
| **Professor** | Análise de cada questão: explicação, tese, fundamento, pegadinha. |
| **Desempenho** | Resultados das questões que você trouxe para o Audis. |
| **Conquistas** | Nível e XP, territórios por subtema, números dos flashcards e questões por subtema. |
| **Radar** | O que a banca mais cobra nas suas questões e as pegadinhas, agrupadas pelo Claude. |
| **Adicionar** | Colar uma questão do TEC; o Claude extrai a ficha, analisa e propõe atualizações no material. |

## Histórico das últimas versões

| Versão | Mudança |
|---|---|
| 26 | Conquistas: questões resolvidas por subtema |
| 27 | Raio-X dos erros (aba em Erros) |
| 28 | Quadro do tópico (aba no Material); o artefato passou a guardar imagens |
| 29 | Plano da semana editável (aba em Missões) |
| depois da 29 (neste projeto e no Vercel; não publicado no claude.ai) | Mapas: área própria no menu, com lacunas e agenda de revisão (etapa 1); ligação com os subtemas, Mapa × banca, pontos que faltam e atalho no Material (etapa 2) |
| depois da 29 (só no endereço do Vercel) | Sincronização entre aparelhos: cada gravação sobe para a nuvem e os outros aparelhos recebem (veja o README) |

Antes disso, na mesma linha de evolução: Radar da banca, mapa de Conquistas, barra de entendimento dos grifos, Material único do subtema e Flashcards da banca.

## Ideias que não viraram função

As imagens estão em `docs/ideias/`.

- **Mira dos grifos** e **Rodada da banca**: ideias que deram origem aos Flashcards; não foram implementadas como desenhadas.
- **Lei seca da banca**: mapa dos artigos de lei cobrados nas questões, com o texto do artigo e as trocas da banca marcadas. Ficou só no planejamento; não há imagem.
- No Quadro: "grifar no texto" a partir da imagem (os grifos nascem das questões, não há grifo manual) e flashcards "A × B" a partir dos pares do Raio-X.
- Mapas, etapa 3: Julgue as afirmações (com agenda própria), Mapa em branco (dois níveis de pista), mapas do dia na tela Hoje e bloco "mapa" no Plano da semana. Decidido: treino de mapa não conta para Conquistas nem Missões.
- No Plano da semana: enviar os blocos para o Google Agenda.

## MAGISara

Existe um segundo artefato, o MAGISara (https://claude.ai/artifact/Vh8BEahne9zBkvwgGTVZXh), com o mesmo código adaptado ao QConcursos e com acervo próprio. Na última atualização feita por aqui (04/11/2026) ele estava na versão 7, que corresponde ao Audis Lab 27: **não tem o Quadro nem o Plano da semana**. Este projeto contém só o Audis Lab.
