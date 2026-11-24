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
| **Teoria** | Um documento de estudo por mapa (assunto), com um capítulo por ramo. O Claude escreve o texto a partir do mapa e das seções do Material ligadas ao ramo, e pode completar com o que sabe: esses parágrafos aparecem marcados como "Complemento do Claude". Ao escrever, o Claude procura sozinho no Material os subtemas de cada ramo (somam-se aos confirmados no mapa; dá para tirar um que não seja do capítulo). Os trechos marcados que tratam do mesmo ponto aparecem logo depois do parágrafo ("Já caiu · você marcou no Material"), e o fim do capítulo traz as questões, os erros e os demais trechos marcados desses subtemas (lidos na hora, sem cópia). Se o mapa mudar, a tela avisa para atualizar. "Conversar com o Claude para mudar o texto" abre uma conversa: o aluno pede a mudança (reorganizar capítulos, trocar títulos, simplificar, aprofundar), o Claude responde e reescreve só os capítulos atingidos; a versão anterior fica guardada para "desfazer a última mudança". Depois de uma mudança pela conversa os capítulos deixam de seguir os ramos do mapa, e "Reescrever do mapa" (com confirmação) volta ao texto gerado do mapa. Na tela do mapa, cada página tem a faixa "Teoria desta página": mostra se os ramos da página já estão na teoria e se há novidades (afirmação nova no mapa, trecho marcado novo no Material por causa de questões novas). O botão escreve os capítulos que faltam e, nos que já existem, pede ao Claude só o acréscimo (onde encaixar os trechos novos e os parágrafos que faltam), sem reescrever o texto; o parágrafo acrescentado fica com a data. Se não há novidade, nada é pedido ao Claude. |
| **Teoria › Ouvir** | Leitura em voz alta da teoria com a voz do próprio aparelho (sem IA e sem internet). "Ouvir a teoria" começa do início e "ouvir a partir daqui" começa de um capítulo. A barra do leitor tem pausar, voltar e avançar parágrafo, velocidade (0,8x a 2x), hora de parar (15, 30 ou 60 min) e escolha da voz quando o aparelho tem mais de uma em português. O parágrafo lido fica destacado e a tela acompanha. Lê os títulos e o texto dos capítulos; não lê os quadros "Já caiu". Some onde o navegador não tem leitura em voz alta. |
| **Ciclo** | Quadro visual do ciclo de estudos em blocos de 25 minutos. No topo, o próximo bloco com cronômetro (pausa, concluir, cancelar; também dá para marcar à mão e desfazer) e a fila da volta: cada disciplina tem um número de blocos por volta, espalhados na fila; ao completar todos, a volta recomeça. Embaixo, o mapa do edital: um cartão por disciplina com os assuntos e um quadradinho por bloco feito em cada um. Vem carregado com o edital de Auditor-Fiscal da Receita Federal de 2022 (FGV), com blocos por volta proporcionais ao número de questões; disciplinas e assuntos são editáveis. Com um assunto escolhido, "Criar o mapa do assunto" cria um mapa com o nome do assunto e a disciplina (guardando a ligação em `ci`) e abre o mapa; "Abrir a teoria" leva à Teoria desse mesmo mapa. |
| **Edital** | Visão geral do edital em quadros: um painel por disciplina e um quadro por assunto. A cor do quadro mostra se o assunto já tem teoria escrita, só o mapa ou nada ainda, e o rodapé traz os capítulos e os blocos feitos no Ciclo. Tocar no quadro abre a Teoria do assunto; se ele ainda não tem mapa, uma janela mostra o texto completo do assunto e cria o mapa antes de abrir. Filtro Todos, Com teoria, Sem teoria. O edital é o mesmo do Ciclo (edita-se lá). |
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
