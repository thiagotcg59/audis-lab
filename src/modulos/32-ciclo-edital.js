  // Edital de referência do Ciclo (módulo 33): Auditor-Fiscal da Receita Federal do Brasil, conteúdo programático de 2026
  // (PDF "RFB_Auditor_Conteudo_Programatico", recebido em 27/11/2026). Substituiu o Edital nº 1/2022 (FGV).
  // Os ids ("d3", "d3a7") não podem mudar: o andamento do aluno é contado por eles. Na troca de 2022 para 2026,
  // cada assunto que continuou no edital manteve o id antigo, mesmo quando mudou de disciplina (por isso há "d4a1"
  // dentro de "d3", "d7a28" em Direito Administrativo, "d14a7" em Legislação Tributária e "d15a1" em Legislação Aduaneira).
  // Estatística ("d4") entrou em "d3" e Administração Pública ("d7") em "d6"; o módulo 33 junta o andamento (__ciMigAn).
  // `v` é a versão do edital: ao subir, o módulo 33 atualiza o edital que o aluno tinha salvo (__ciMigEd).
  // `fora` são os assuntos de 2022 que saíram (n: disciplina antiga; p: assunto atual que cobre o mesmo conteúdo, se houver).
  // O que o aluno tem neles (mapa, teoria, blocos) não é apagado: a tela Edital avisa e dá o atalho (__ciFora).
  // O PDF de 2026 não traz número de questões nem pesos; `b` (blocos por volta) é 2 por disciplina, com as duas que juntaram matérias somadas.
  var __ciRef = {
    "v": 2,
    "nome": "Auditor-Fiscal da Receita Federal · Conteúdo programático de 2026",
    "fonte": "RFB_Auditor_Conteudo_Programatico.pdf (conteúdo programático recebido em 27/11/2026)",
    "discs": [
      {
        "id": "d1",
        "n": "Língua Portuguesa",
        "grupo": "básicos",
        "b": 2,
        "as": [
          {
            "id": "d1a1",
            "t": "1. Compreensão e interpretação de textos de gêneros variados."
          },
          {
            "id": "d1a10",
            "t": "2. Tipos ou modos de organização textual. 2.1. Narração. 2.2. Descrição. 2.3. Argumentação."
          },
          {
            "id": "d1a11",
            "t": "3. Organização e estruturação do texto. 3.1. Coerência e coesão textual. 3.1.1. Referenciação, substituição e repetição. 3.1.2. Emprego de conectores e relações de sentido por eles estabelecidas. 3.1.3. Encadeamento e progressão das ideias no texto."
          },
          {
            "id": "d1a2",
            "t": "4. Semântica. 4.1. Significado e emprego de palavras e expressões no contexto. 4.2. Sinonímia, antonímia e polissemia. 4.3. Sentido literal e figurado."
          },
          {
            "id": "d1a3",
            "t": "5. Morfologia. 5.1. Reconhecimento, emprego e sentido das classes de palavras. 5.2. Processos de formação e flexão de palavras. 5.3. Emprego de tempos e modos verbais."
          },
          {
            "id": "d1a4",
            "t": "6. Sintaxe. 6.1. Frase, oração e período. 6.2. Termos da oração. 6.3. Relações de coordenação e subordinação. 6.4. Concordância nominal e verbal. 6.5. Transitividade verbal e regência nominal e verbal. 6.6. Colocação dos pronomes átonos."
          },
          {
            "id": "d1a5",
            "t": "7.1. Ortografia."
          },
          {
            "id": "d1a6",
            "t": "7.2. Acentuação gráfica."
          },
          {
            "id": "d1a7",
            "t": "8. Emprego do sinal indicativo de crase."
          },
          {
            "id": "d1a8",
            "t": "9. Pontuação. 9.1. Emprego dos sinais de pontuação. 9.2. Efeitos de sentido decorrentes da pontuação."
          },
          {
            "id": "d1a9",
            "t": "10. Reescrita de frases, períodos e parágrafos. 10.1. Substituição de palavras e trechos. 10.2. Deslocamento e reorganização de estruturas. 10.3. Paralelismo. 10.4. Preservação e alteração de sentidos."
          },
          {
            "id": "d1a12",
            "t": "11. Variação linguística. 11.1. Níveis de formalidade. 11.2. Adequação à norma-padrão."
          }
        ]
      },
      {
        "id": "d2",
        "n": "Língua Inglesa",
        "grupo": "básicos",
        "b": 2,
        "as": [
          {
            "id": "d2a2",
            "t": "1. Compreensão e interpretação de textos em língua inglesa. 1.2. Identificação de ideias principais e secundárias. 1.3. Identificação de informações explícitas e implícitas e realização de inferências. 1.4. Relações entre informações e ideias apresentadas em um mesmo texto ou em textos distintos."
          },
          {
            "id": "d2a3",
            "t": "1.1. Vocabulário e estruturas gramaticais relevantes à construção dos sentidos do texto."
          }
        ]
      },
      {
        "id": "d3",
        "n": "Raciocínio Lógico-Matemático e Estatística",
        "grupo": "básicos",
        "b": 3,
        "as": [
          {
            "id": "d3a1",
            "t": "1.1. Lógica. 1.1.1. Proposições. 1.1.2. Conectivos. 1.1.3. Equivalências lógicas. 1.1.4. Quantificadores. 1.1.5. Predicados."
          },
          {
            "id": "d3a2",
            "t": "1.2. Conjuntos e suas operações. 1.2.1. Diagramas."
          },
          {
            "id": "d3a3",
            "t": "1.3. Números inteiros, racionais e reais, suas operações, porcentagem e juros."
          },
          {
            "id": "d3a4",
            "t": "1.4. Proporcionalidade direta e inversa."
          },
          {
            "id": "d3a5",
            "t": "1.5. Medidas. 1.5.1. Comprimento. 1.5.2. Área. 1.5.3. Volume. 1.5.4. Massa. 1.5.5. Tempo."
          },
          {
            "id": "d3a6",
            "t": "1.6. Estrutura lógica de relações arbitrárias entre pessoas, lugares, objetos ou eventos fictícios. 1.6.1. Dedução de novas informações das relações fornecidas. 1.6.2. Avaliação das condições usadas para estabelecer a estrutura das relações fornecidas."
          },
          {
            "id": "d3a7",
            "t": "1.7. Compreensão e análise da lógica de uma situação, utilizando as funções intelectuais. 1.7.1. Raciocínio verbal. 1.7.2. Raciocínio matemático. 1.7.3. Raciocínio sequencial. 1.7.4. Orientação espacial. 1.7.5. Orientação temporal. 1.7.6. Formação de conceitos. 1.7.7. Discriminação de elementos."
          },
          {
            "id": "d3a8",
            "t": "1.8. Compreensão de dados apresentados em gráficos e tabelas."
          },
          {
            "id": "d3a9",
            "t": "1.9. Raciocínio lógico envolvendo problemas aritméticos, geométricos e matriciais."
          },
          {
            "id": "d3a10",
            "t": "1.10. Problemas de contagem e noções de probabilidade."
          },
          {
            "id": "d3a11",
            "t": "1.11. Geometria básica. 1.11.1. Ângulos. 1.11.2. Triângulos. 1.11.3. Polígonos. 1.11.4. Distâncias. 1.11.5. Proporcionalidade. 1.11.6. Perímetro. 1.11.7. Área."
          },
          {
            "id": "d3a12",
            "t": "1.12. Plano cartesiano. 1.12.1. Sistema de coordenadas. 1.12.2. Distância."
          },
          {
            "id": "d3a13",
            "t": "1.13. Problemas de lógica e raciocínio."
          },
          {
            "id": "d4a1",
            "t": "2.1. Estatística descritiva. 2.1.1. Tabelas. 2.1.2. Gráficos."
          },
          {
            "id": "d4a2",
            "t": "2.1.3. Medidas de tendência central. 2.1.4. Dispersão. 2.1.5. Posição."
          },
          {
            "id": "d4a3",
            "t": "2.2. Probabilidade. 2.2.1. Probabilidade condicional. 2.2.2. Independência. 2.2.3. Teorema de Bayes. 2.2.4. Distribuições de probabilidade: binomial, Poisson, normal e exponencial."
          },
          {
            "id": "d4a4",
            "t": "2.3. Inferência estatística. 2.3.1. Amostragem. 2.3.2. Estimação pontual. 2.3.3. Estimação intervalar. 2.3.4. Testes de hipóteses. 2.3.5. Valor-p. 2.3.6. Poder do teste."
          },
          {
            "id": "d4a5",
            "t": "2.4. Correlação e regressão. 2.4.1. Correlação. 2.4.2. Regressão linear simples. 2.4.3. Regressão linear múltipla."
          },
          {
            "id": "d4a6",
            "t": "2.4.4. Regressão logística. 2.4.4.1. Predição. 2.4.4.2. Classificação."
          },
          {
            "id": "d4a7",
            "t": "2.5. Séries temporais. 2.5.1. Tendência. 2.5.2. Sazonalidade. 2.5.3. Previsão."
          }
        ]
      },
      {
        "id": "d12",
        "n": "Direito Constitucional",
        "grupo": "básicos",
        "b": 2,
        "as": [
          {
            "id": "d12a1",
            "t": "1. Teoria Geral do Estado."
          },
          {
            "id": "d12a2",
            "t": "2. Os Poderes do Estado e as respectivas funções."
          },
          {
            "id": "d12a3",
            "t": "3. Teoria geral da Constituição. 3.1. Conceito. 3.2. Origens. 3.3. Conteúdo e elementos. 3.4. Estrutura. 3.5. Classificação. 3.6. Hermenêutica e interpretação constitucional."
          },
          {
            "id": "d12a4",
            "t": "4. Supremacia da Constituição."
          },
          {
            "id": "d12a21",
            "t": "5. Aplicabilidade e eficácia das normas constitucionais. 5.1. Normas de eficácia plena, contida e limitada. 5.2. Normas programáticas."
          },
          {
            "id": "d12a6",
            "t": "6. Poder constituinte."
          },
          {
            "id": "d12a7",
            "t": "7. Os princípios constitucionais."
          },
          {
            "id": "d12a8",
            "t": "8. Controle de constitucionalidade. 8.1. Conceito, espécies e modelos de controle de constitucionalidade. 8.2. Inconstitucionalidade por ação e por omissão. 8.3. Controle difuso e controle concentrado. 8.4. Competência dos tribunais. 8.5. Efeitos das decisões no controle de constitucionalidade."
          },
          {
            "id": "d12a9",
            "t": "9. Emenda, reforma e revisão constitucional."
          },
          {
            "id": "d12a10",
            "t": "10. Hierarquia das normas jurídicas."
          },
          {
            "id": "d12a11",
            "t": "11. Dos princípios fundamentais da Constituição da República Federativa do Brasil."
          },
          {
            "id": "d12a12",
            "t": "12. Dos direitos e garantias fundamentais."
          },
          {
            "id": "d12a13",
            "t": "13. Da organização político-administrativa do Estado: União, Estados, Distrito Federal e Municípios. 13.1. Repartição constitucional de competências. 13.2. Da Administração Pública: princípios e disposições gerais. 13.3. Dos servidores públicos."
          },
          {
            "id": "d12a14",
            "t": "14. A organização dos Poderes. 14.1. O Poder Legislativo: fiscalização contábil, financeira e orçamentária; controle externo e sistemas de controle interno; Tribunal de Contas da União; processo legislativo. 14.2. O Poder Executivo: Presidente e Vice-Presidente da República, atribuições e responsabilidade do Presidente, Ministros de Estado. 14.3. O Poder Judiciário: disposições gerais, STF, STJ, Tribunais Regionais Federais e Juízes Federais."
          },
          {
            "id": "d12a15",
            "t": "15. Funções essenciais à Justiça: Ministério Público, Advocacia Pública, Advocacia e Defensoria Pública."
          },
          {
            "id": "d12a16",
            "t": "16. A defesa do Estado e das instituições democráticas."
          },
          {
            "id": "d12a17",
            "t": "17. Da tributação e do orçamento. 17.1. Sistema Tributário Nacional. 17.1.1. Disposições gerais. 17.1.2. Repartição das receitas tributárias. 17.2. Das finanças públicas. 17.2.1. Do orçamento."
          },
          {
            "id": "d12a18",
            "t": "18. Da ordem econômica e financeira."
          },
          {
            "id": "d12a19",
            "t": "19. Da ordem social."
          },
          {
            "id": "d12a20",
            "t": "20. Das disposições constitucionais gerais e do Ato das Disposições Constitucionais Transitórias (ADCT)."
          }
        ]
      },
      {
        "id": "d11",
        "n": "Direito Administrativo",
        "grupo": "básicos",
        "b": 2,
        "as": [
          {
            "id": "d11a1",
            "t": "1. Administração pública: princípios básicos."
          },
          {
            "id": "d11a2",
            "t": "2. Poderes administrativos. 2.1. Poder hierárquico. 2.2. Poder disciplinar. 2.3. Poder regulamentar. 2.4. Poder de polícia. 2.5. Uso e abuso do poder."
          },
          {
            "id": "d11a3",
            "t": "3. Ato administrativo. 3.1. Conceito, requisitos e atributos. 3.2. Anulação, revogação e convalidação. 3.3. Discricionariedade e vinculação."
          },
          {
            "id": "d11a4",
            "t": "4. Organização administrativa. 4.1. Administração direta e indireta. 4.2. Administração centralizada e descentralizada. 4.2.1. Autarquias. 4.2.2. Fundações. 4.2.3. Empresas públicas. 4.2.4. Sociedades de economia mista."
          },
          {
            "id": "d11a5",
            "t": "5. Consórcios públicos (Lei nº 11.107/2005)."
          },
          {
            "id": "d11a6",
            "t": "6. Órgãos públicos. 6.1. Conceito. 6.2. Natureza. 6.3. Classificação."
          },
          {
            "id": "d11a7",
            "t": "7. Servidores públicos. 7.1. Cargo. 7.2. Emprego público. 7.3. Função pública."
          },
          {
            "id": "d11a8",
            "t": "8. Regime Jurídico dos Servidores Públicos Civis da União (Lei nº 8.112/1990). 8.1. Disposições preliminares: provimento, vacância, remoção, redistribuição, substituição. 8.2. Direitos e vantagens: vencimento, remuneração, vantagens, férias, licenças, afastamentos, direito de petição. 8.3. Regime disciplinar: deveres e proibições, acumulação, responsabilidades, penalidades. 8.4. Processo administrativo disciplinar."
          },
          {
            "id": "d11a9",
            "t": "9. Processo administrativo (Lei nº 9.784/1999)."
          },
          {
            "id": "d11a10",
            "t": "10. Controle e responsabilização da administração. 10.1. Controle administrativo. 10.2. Controle judicial. 10.3. Controle legislativo."
          },
          {
            "id": "d11a11",
            "t": "11. Responsabilidade extracontratual do Estado."
          },
          {
            "id": "d11a12",
            "t": "12. Improbidade Administrativa (Lei nº 8.429/1992)."
          },
          {
            "id": "d11a13",
            "t": "13. Lei de Licitações e Contratos da Administração Pública (Lei nº 14.133/2021)."
          },
          {
            "id": "d11a14",
            "t": "14. Serviços públicos."
          },
          {
            "id": "d11a15",
            "t": "14.1. Disposições preliminares. 14.1.1. Conceito. 14.1.2. Pressupostos constitucionais. 14.1.3. Regime jurídico. 14.1.4. Princípios do serviço público. 14.1.5. Usuário. 14.1.6. Titularidade."
          },
          {
            "id": "d11a16",
            "t": "14.2. Delegação de serviço público. 14.2.1. Autorização. 14.2.2. Permissão. 14.2.3. Concessão."
          },
          {
            "id": "d11a17",
            "t": "15. Bens públicos. 15.1. Disposições preliminares: regime jurídico, classificação, administração, aquisição, alienação. 15.2. Utilização por terceiros: autorização de uso, permissão de uso, concessão de uso, concessão de direito real de uso, cessão de uso."
          },
          {
            "id": "d11a18",
            "t": "16. Intervenção do Estado na propriedade. 16.1. Desapropriação. 16.2. Servidão administrativa. 16.3. Tombamento. 16.4. Requisição administrativa. 16.5. Ocupação temporária. 16.6. Limitação administrativa."
          },
          {
            "id": "d11a19",
            "t": "17. Terceiro Setor. 17.1. Entes paraestatais."
          },
          {
            "id": "d11a20",
            "t": "18. Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018)."
          },
          {
            "id": "d7a28",
            "t": "19. Lei de Acesso à Informação (Lei nº 12.527/2011)."
          }
        ]
      },
      {
        "id": "d6",
        "n": "Administração Geral e Pública",
        "grupo": "básicos",
        "b": 4,
        "as": [
          {
            "id": "d6a1",
            "t": "1.1.1. Evolução das teorias da administração e das organizações: abordagens clássica, burocrática, das relações humanas, sistêmica e contingencial."
          },
          {
            "id": "d6a3",
            "t": "1.1.2. Funções da administração: planejamento, organização, direção e controle."
          },
          {
            "id": "d6a9",
            "t": "1.1.2.2. Organização."
          },
          {
            "id": "d6a12",
            "t": "1.1.2.4. Controle."
          },
          {
            "id": "d6a5",
            "t": "1.1.3.1. Planejamento estratégico."
          },
          {
            "id": "d6a6",
            "t": "1.1.3.2. Planejamento tático."
          },
          {
            "id": "d6a7",
            "t": "1.1.3.3. Planejamento operacional."
          },
          {
            "id": "d6a11",
            "t": "1.2.1. Comportamento organizacional. 1.2.1.1. Cultura organizacional. 1.2.1.2. Liderança. 1.2.1.3. Comunicação organizacional. 1.2.1.4. Trabalho em equipe."
          },
          {
            "id": "d6a14",
            "t": "1.2.2. Gestão de pessoas. 1.2.2.1. Planejamento da força de trabalho."
          },
          {
            "id": "d6a19",
            "t": "1.2.2.2. Gestão por competências."
          },
          {
            "id": "d6a18",
            "t": "1.2.2.3. Gestão do desempenho."
          },
          {
            "id": "d7a5",
            "t": "1.3.1. Gestão por resultados. 1.3.1.1. Objetivos e metas. 1.3.1.3. Monitoramento e avaliação de resultados."
          },
          {
            "id": "d6a28",
            "t": "1.3.1.2. Indicadores de desempenho."
          },
          {
            "id": "d6a22",
            "t": "1.3.2. Gestão de processos."
          },
          {
            "id": "d6a23",
            "t": "1.3.2.1. Abordagem por processos."
          },
          {
            "id": "d6a24",
            "t": "1.3.2.2. Mapeamento e análise de processos. 1.3.2.3. Racionalização e melhoria de processos."
          },
          {
            "id": "d7a22",
            "t": "1.3.3. Gestão de riscos."
          },
          {
            "id": "d7a23",
            "t": "1.3.3.1. Identificação de riscos. 1.3.3.2. Avaliação de riscos. 1.3.3.3. Tratamento de riscos. 1.3.3.4. Monitoramento de riscos."
          },
          {
            "id": "d7a2",
            "t": "2.1.1. Evolução da Administração Pública. 2.1.1.1. Modelo patrimonial. 2.1.1.2. Modelo burocrático. 2.1.1.3. Modelo gerencial."
          },
          {
            "id": "d7a17",
            "t": "2.1.2. Governança e gestão públicas."
          },
          {
            "id": "d7a18",
            "t": "2.1.2.1. Governança e gestão públicas: conceitos, distinções e relações."
          },
          {
            "id": "d7a34",
            "t": "2.1.2.2. Funções da governança pública: avaliar, direcionar e monitorar."
          },
          {
            "id": "d7a21",
            "t": "2.1.2.3. Mecanismos de governança pública: liderança, estratégia e controle."
          },
          {
            "id": "d7a35",
            "t": "2.1.2.4. Entregas, resultados e geração de valor público."
          },
          {
            "id": "d7a4",
            "t": "2.1.3. Transparência, accountability, participação e controle social."
          },
          {
            "id": "d7a30",
            "t": "2.2.1. Princípios e diretrizes do governo digital e da eficiência pública."
          },
          {
            "id": "d7a31",
            "t": "2.2.2. Transformação digital e integração de serviços e canais de atendimento."
          },
          {
            "id": "d7a32",
            "t": "2.2.3. Prestação de serviços públicos com foco no usuário. 2.2.3.1. Simplificação e acessibilidade. 2.2.3.2. Experiência e satisfação dos usuários."
          },
          {
            "id": "d7a33",
            "t": "2.2.4. Inovação e transformação de processos e serviços públicos. 2.2.4.1. Redesenho e melhoria de processos e serviços. 2.2.4.2. Incorporação de tecnologias aos processos de trabalho."
          }
        ]
      },
      {
        "id": "d10",
        "n": "Fluência em Dados",
        "grupo": "básicos",
        "b": 2,
        "as": [
          {
            "id": "d10a1",
            "t": "1. Conceitos. 1.1. Atributos. 1.2. Métricas. 1.3. Transformação de dados."
          },
          {
            "id": "d10a2",
            "t": "2. Análise de Dados."
          },
          {
            "id": "d10a6",
            "t": "2.1. Conceitos de analytics."
          },
          {
            "id": "d10a3",
            "t": "2.2. Agrupamentos."
          },
          {
            "id": "d10a4",
            "t": "2.3. Tendências."
          },
          {
            "id": "d10a5",
            "t": "2.4. Projeções."
          },
          {
            "id": "d10a25",
            "t": "3. Visualização de dados. 3.1. Microsoft Fabric. 3.2. Bibliotecas de visualização de dados para Python, R e Javascript."
          },
          {
            "id": "d10a10",
            "t": "4. Governança de Dados. 4.1. Conceitos. 4.2. Papéis. 4.3. Tipos (centralizada, compartilhada e federada)."
          },
          {
            "id": "d10a26",
            "t": "5. Qualidade de Dados. 5.1. Conceitos. 5.2. Dimensões."
          },
          {
            "id": "d10a27",
            "t": "6. Versionamento de códigos. 6.1. Ferramentas. 6.2. Comandos."
          },
          {
            "id": "d10a21",
            "t": "7. Linguagens de programação. 7.1. SQL. 7.2. Python. 7.3. R."
          },
          {
            "id": "d10a28",
            "t": "8. Bancos de dados. 8.1. Bancos de dados relacionais. 8.3. Modelagem de dados."
          },
          {
            "id": "d10a22",
            "t": "8.2. Bancos de dados não relacionais."
          },
          {
            "id": "d10a23",
            "t": "8.4. Principais SGBDs relacionais. 8.5. Principais SGBDs não relacionais (NoSQL)."
          },
          {
            "id": "d10a12",
            "t": "9. Big Data."
          },
          {
            "id": "d10a24",
            "t": "9.1. Soluções para Big Data."
          },
          {
            "id": "d10a13",
            "t": "9.2. Big Data em relação a outras disciplinas."
          },
          {
            "id": "d10a18",
            "t": "9.3. Arquitetura de Big Data."
          },
          {
            "id": "d10a19",
            "t": "9.4. Modelos de entrega e distribuição de serviços de Big Data."
          },
          {
            "id": "d10a17",
            "t": "10. Computação em nuvens."
          },
          {
            "id": "d10a20",
            "t": "10.1. Plataformas de computação em nuvem para Big Data."
          },
          {
            "id": "d10a11",
            "t": "11. Ciência de dados. 11.1. Importância da informação."
          },
          {
            "id": "d10a15",
            "t": "11.2. Ciclo de vida do processo de ciência de dados."
          },
          {
            "id": "d10a16",
            "t": "11.3. Papéis dos envolvidos em projetos de ciência de dados."
          },
          {
            "id": "d10a8",
            "t": "12. Inteligência Artificial: conceitos e aplicações."
          },
          {
            "id": "d10a7",
            "t": "12.1. Aprendizado de máquina: conceitos e aplicações."
          },
          {
            "id": "d10a29",
            "t": "13. Inteligência artificial generativa. 13.1. Modelos de linguagem de grande escala (LLMs). 13.2. Capacidades e limitações. 13.3. Erro probabilístico, alucinação e viés algorítmico. 13.4. Conceitos básicos de engenharia de prompts e de verificação de resultados gerados."
          },
          {
            "id": "d10a30",
            "t": "14. Ética, riscos e governança da inteligência artificial. 14.1. Transparência e explicabilidade. 14.2. Mitigação de vieses. 14.3. Supervisão humana e responsabilidade decisória do agente público. 14.4. Proteção de dados pessoais e protegidos por sigilo legal em sistemas de inteligência artificial. 14.5. Política de Inteligência Artificial no âmbito da Receita Federal (Portaria RFB nº 647/2026)."
          },
          {
            "id": "d10a9",
            "t": "15. Processamento de linguagem natural."
          },
          {
            "id": "d10a31",
            "t": "16. Segurança da informação aplicada à fluência em dados. 16.1. Confidencialidade, integridade, disponibilidade e autenticidade. 16.2. Classificação da informação. 16.3. Privacidade e proteção de dados. 16.4. Controle de acesso. 16.5. Principais riscos em projetos orientados por dados. 16.6. Compartilhamento seguro de arquivos, pastas, dashboards e relatórios."
          },
          {
            "id": "d10a32",
            "t": "17. Criptografia e proteção técnica básica. 17.1. Noções de criptografia em repouso e em trânsito. 17.2. HTTPS, VPN e armazenamento criptografado."
          },
          {
            "id": "d10a33",
            "t": "18. Riscos humanos e engenharia social: phishing, smishing, golpes por e-mail e mensagens falsas. 18.1. Manipulação para obtenção de dados."
          },
          {
            "id": "d10a34",
            "t": "19. Segurança em dados usados por IA e automação. 19.1. Riscos ao inserir dados sensíveis em ferramentas de IA e vazamento de informações em prompts. 19.2. Cuidados com bases usadas para treinamento, teste e validação."
          }
        ]
      },
      {
        "id": "d9",
        "n": "Contabilidade Geral e Avançada",
        "grupo": "específicos",
        "b": 2,
        "as": [
          {
            "id": "d9a2",
            "t": "1. Estrutura Conceitual para Elaboração e Divulgação de Relatório Contábil-Financeiro (NBC TG). 1.1. Patrimônio: componentes patrimoniais, ativo, passivo e situação líquida; equação fundamental do patrimônio. 1.2. Características fundamentais e de melhoria da informação contábil. 1.3. Entidade que reporta versus pessoa jurídica."
          },
          {
            "id": "d9a11",
            "t": "1.4. Ativos. 1.5. Passivos: conceitos, estrutura, classificações, contas, processos de avaliação, registros contábeis e evidenciações. 1.6. Patrimônio líquido: capital social, adiantamentos para aumento de capital, ajustes de avaliação patrimonial, ações em tesouraria, prejuízos acumulados, reservas de capital e de lucros."
          },
          {
            "id": "d9a10",
            "t": "2. Fatos contábeis e respectivas variações patrimoniais."
          },
          {
            "id": "d9a23",
            "t": "3. Sistema de contas, contas patrimoniais, de resultado e plano de contas."
          },
          {
            "id": "d9a9",
            "t": "4. Escrituração: conceito e métodos, partidas dobradas, lançamento contábil, rotina, fórmulas, processos de escrituração."
          },
          {
            "id": "d9a5",
            "t": "4.1. Livros contábeis obrigatórios, SPED Contábil."
          },
          {
            "id": "d9a24",
            "t": "5. Balancete de verificação: conceito, forma, apresentação, finalidade, elaboração."
          },
          {
            "id": "d9a25",
            "t": "6. Instrumentos financeiros: definições, classificação, reconhecimento e mensuração (NBC TG 48)."
          },
          {
            "id": "d9a26",
            "t": "7. Provisões, Passivos Contingentes e Ativos Contingentes (NBC TG 25)."
          },
          {
            "id": "d9a27",
            "t": "8. Tratamento das participações societárias: coligadas e controladas, influência significativa, métodos de avaliação, equivalência patrimonial, lucros não realizados, lucros ou dividendos de coligadas e controladas (Lei nº 6.404/1976, NBC TG 18, ITG 09 e NBC TG 36)."
          },
          {
            "id": "d9a28",
            "t": "9. Combinação de negócios: definições, mensuração ao valor justo dos ativos líquidos, cálculo do goodwill e do ganho por compra vantajosa e a sua contabilização (NBC TG 15, ITG 09 e NBC TG 36)."
          },
          {
            "id": "d9a29",
            "t": "10. Redução ao valor recuperável: mensuração, registro contábil, reversão (NBC TG 01)."
          },
          {
            "id": "d9a30",
            "t": "11. Tratamento das depreciações, amortização e exaustão: conceitos, determinação da vida útil, forma de cálculo e registros (NBC TG 27)."
          },
          {
            "id": "d9a31",
            "t": "12. Tratamento de reparo e conservação de bens do ativo, gastos de capital versus gastos do período (NBC TG 27)."
          },
          {
            "id": "d9a32",
            "t": "13. Debêntures: conceito, avaliação e tratamento contábil."
          },
          {
            "id": "d9a33",
            "t": "14. Tratamento das partes beneficiárias."
          },
          {
            "id": "d9a34",
            "t": "15. Operações financeiras ativas e passivas: tratamento contábil e cálculo das variações monetárias, das receitas e despesas financeiras, empréstimos e financiamentos, juros transcorridos e a transcorrer e ajustes a valor presente."
          },
          {
            "id": "d9a35",
            "t": "16. Despesas antecipadas e receitas antecipadas."
          },
          {
            "id": "d9a36",
            "t": "17. Folha de pagamentos: cálculos, tratamento de encargos e contabilização."
          },
          {
            "id": "d9a16",
            "t": "18. Operações com mercadorias, fatores que alteram valores de compra e venda, forma de registro e apuração do custo das mercadorias ou dos serviços vendidos (NBC TG 16)."
          },
          {
            "id": "d9a37",
            "t": "19. Tratamento de operações de arrendamento mercantil (NBC TG 06)."
          },
          {
            "id": "d9a38",
            "t": "20. Ativo Não Circulante Mantido para Venda, Operação Descontinuada e Propriedade para Investimento: conceitos e tratamento contábil (NBC TG 31)."
          },
          {
            "id": "d9a39",
            "t": "21. Ativos intangíveis: conceito, apropriação, forma de avaliação e registros contábeis (NBC TG 04)."
          },
          {
            "id": "d9a7",
            "t": "22. Apuração do resultado, incorporação e distribuição do resultado, compensação de prejuízos, dividendos e juros sobre capital próprio, transferência do lucro líquido para reservas, cálculo, utilização e reversão de reservas (Lei nº 6.404/76 e NBC)."
          },
          {
            "id": "d9a40",
            "t": "23. Mensuração a valor justo e apuração dos ativos líquidos: conceitos, cálculos e tratamento contábil (NBC TG 46)."
          },
          {
            "id": "d9a41",
            "t": "24. Subvenção e Assistência Governamentais: conceitos, tratamento contábil, avaliação e evidenciação (NBC TG 07)."
          },
          {
            "id": "d9a12",
            "t": "25. Demonstrações contábeis: obrigatoriedade de apresentação e elaboração (Lei nº 6.404/76 e NBC). 25.1. Balanço Patrimonial. 25.2. Demonstração do Resultado do Exercício. 25.3. Demonstração do Resultado Abrangente. 25.4. Demonstração de Mutações do Patrimônio Líquido. 25.5. Demonstração do Fluxo de Caixa. 25.6. Demonstração do Valor Adicionado."
          },
          {
            "id": "d9a42",
            "t": "26. Políticas Contábeis, Mudança de Estimativa e Retificação de Erro (NBC TG 23)."
          },
          {
            "id": "d9a43",
            "t": "27. Análise das demonstrações. Análise horizontal e indicadores de evolução. Índices e quocientes financeiros de estrutura, liquidez, rentabilidade e econômicos."
          }
        ]
      },
      {
        "id": "d8",
        "n": "Auditoria",
        "grupo": "específicos",
        "b": 2,
        "as": [
          {
            "id": "d8a1",
            "t": "1.1. Normas Brasileiras de Contabilidade (NBC TA e NBC PA)."
          },
          {
            "id": "d8a2",
            "t": "1.2. Amostragem em Auditoria (NBC TA 530)."
          },
          {
            "id": "d8a3",
            "t": "1.3. Testes de observância."
          },
          {
            "id": "d8a4",
            "t": "1.4. Testes substantivos."
          },
          {
            "id": "d8a5",
            "t": "1.5. Testes para subavaliação e testes para superavaliação."
          },
          {
            "id": "d8a6",
            "t": "1.6. Evidências de auditoria."
          },
          {
            "id": "d8a7",
            "t": "1.7. Procedimentos de auditoria."
          },
          {
            "id": "d8a37",
            "t": "1.8. Documentação de auditoria."
          },
          {
            "id": "d8a38",
            "t": "1.9. Relatório de auditoria."
          },
          {
            "id": "d8a8",
            "t": "2.1. Identificação de fraudes na escrita contábil."
          },
          {
            "id": "d8a10",
            "t": "2.2. Auditoria no ativo circulante. 2.2.1. Recomposição contábil do fluxo de caixa da empresa."
          },
          {
            "id": "d8a11",
            "t": "2.2.2. Identificação de saldo credor na conta caixa por falta de emissão de documentos fiscais."
          },
          {
            "id": "d8a12",
            "t": "2.2.3. Suprimento das disponibilidades sem que haja comprovação quanto à efetiva entrega dos recursos financeiros: aumento do capital social, adiantamentos de clientes, empréstimos de sócios ou de terceiros, operações, prestações ou recebimentos sem origem, alienação de investimentos e bens do ativo imobilizado."
          },
          {
            "id": "d8a13",
            "t": "2.2.4. Aquisições de mercadorias, bens, serviços e outros ativos não contabilizados e sem comprovação da origem do numerário."
          },
          {
            "id": "d8a14",
            "t": "2.2.5. Baixa fictícia de títulos não recebidos."
          },
          {
            "id": "d8a15",
            "t": "2.2.6. Cotejamento de recebíveis com os registros contábeis de receitas."
          },
          {
            "id": "d8a16",
            "t": "2.2.7. Superavaliação na formação dos custos de estoque."
          },
          {
            "id": "d8a18",
            "t": "2.3. Auditoria no ativo não circulante. 2.3.1. Auditoria em investimentos: classificação e mensuração de participações societárias e de propriedades para investimento."
          },
          {
            "id": "d8a19",
            "t": "2.3.2. Auditoria no ativo imobilizado. 2.3.2.1. Ativos ocultos."
          },
          {
            "id": "d8a20",
            "t": "2.3.2.2. Alienação fictícia de bens."
          },
          {
            "id": "d8a39",
            "t": "2.3.2.3. Superestimação ou subestimação de depreciação. 2.3.2.4. Superestimação ou subestimação de perdas por desvalorização (teste de recuperabilidade)."
          },
          {
            "id": "d8a21",
            "t": "2.3.3. Auditoria no ativo intangível: classificação e mensuração de intangíveis."
          },
          {
            "id": "d8a22",
            "t": "2.4. Auditoria no passivo circulante e no passivo não circulante. 2.4.1. Falta de registro contábil dos passivos de curto prazo."
          },
          {
            "id": "d8a23",
            "t": "2.4.2. Passivos fictícios."
          },
          {
            "id": "d8a24",
            "t": "2.4.3. Identificação de passivos já pagos e não baixados."
          },
          {
            "id": "d8a27",
            "t": "2.5. Auditoria no patrimônio líquido. 2.5.1. Aumento do capital social sem comprovação quanto à efetiva entrega dos recursos financeiros."
          },
          {
            "id": "d8a28",
            "t": "2.5.2. Contabilização de reservas."
          },
          {
            "id": "d8a29",
            "t": "2.5.3. Contabilização indevida de subvenções governamentais em reserva de incentivos fiscais."
          },
          {
            "id": "d8a31",
            "t": "2.6. Auditoria em contas de resultado. 2.6.1. Registro de receitas e despesas."
          },
          {
            "id": "d8a32",
            "t": "2.6.2. Ocultação de receitas."
          },
          {
            "id": "d8a40",
            "t": "2.6.3. Subavaliação de receitas."
          },
          {
            "id": "d8a33",
            "t": "2.6.3. Superavaliação de custos e despesas."
          },
          {
            "id": "d8a41",
            "t": "2.7. Distribuição disfarçada de lucros ou dividendos. 2.7.1. Distribuição in natura por valor superior ao de mercado. 2.7.2. Distribuição em contrapartida à liquidação de obrigações."
          },
          {
            "id": "d8a35",
            "t": "2.8. Auditoria em operações de importação."
          },
          {
            "id": "d8a36",
            "t": "3. Sigilo das operações de instituições financeiras (LC nº 105/2001)."
          }
        ]
      },
      {
        "id": "d14",
        "n": "Direito Tributário",
        "grupo": "específicos",
        "b": 2,
        "as": [
          {
            "id": "d14a1",
            "t": "1. Competência tributária."
          },
          {
            "id": "d14a2",
            "t": "2. Limitações constitucionais ao poder de tributar. 2.1. Imunidades. 2.2. Princípios constitucionais tributários."
          },
          {
            "id": "d14a3",
            "t": "3. Tributos: conceito, espécies, elementos e classificação."
          },
          {
            "id": "d14a4",
            "t": "4. Tributos de competência da União."
          },
          {
            "id": "d14a5",
            "t": "5. Tributos de competência dos Estados e do Distrito Federal."
          },
          {
            "id": "d14a6",
            "t": "6. Tributos de competência dos Municípios."
          },
          {
            "id": "d14a8",
            "t": "7. Legislação tributária."
          },
          {
            "id": "d14a9",
            "t": "7.1. Fontes do Direito Tributário."
          },
          {
            "id": "d14a10",
            "t": "7.2. Vigência da legislação tributária."
          },
          {
            "id": "d14a11",
            "t": "7.3. Aplicação da legislação tributária."
          },
          {
            "id": "d14a12",
            "t": "7.4. Interpretação e integração da legislação tributária."
          },
          {
            "id": "d14a13",
            "t": "8. Obrigação tributária principal e acessória."
          },
          {
            "id": "d14a14",
            "t": "9. Fato gerador da obrigação tributária."
          },
          {
            "id": "d14a15",
            "t": "10. Sujeição ativa e passiva. 10.1. Solidariedade. 10.2. Capacidade tributária."
          },
          {
            "id": "d14a16",
            "t": "11. Domicílio tributário."
          },
          {
            "id": "d14a17",
            "t": "12. Responsabilidade tributária. 12.1. Conceito. 12.2. Responsabilidade dos sucessores. 12.3. Responsabilidade de terceiros. 12.4. Responsabilidade por infrações. 12.5. Substituição tributária."
          },
          {
            "id": "d14a18",
            "t": "13. Crédito tributário. 13.1. Conceito. 13.2. Constituição do crédito tributário. 13.3. Lançamento: modalidades e hipóteses de alteração. 13.4. Suspensão da exigibilidade do crédito tributário: modalidades. 13.5. Extinção do crédito tributário: modalidades."
          },
          {
            "id": "d14a20",
            "t": "13.6. Exclusão do crédito tributário: modalidades."
          },
          {
            "id": "d14a19",
            "t": "14. Pagamento indevido, repetição do indébito e compensação."
          },
          {
            "id": "d14a21",
            "t": "15. Garantias e privilégios do crédito tributário."
          },
          {
            "id": "d14a22",
            "t": "16. Administração tributária. 16.1. Fiscalização. 16.2. Dívida ativa. 16.3. Certidões negativas."
          },
          {
            "id": "d14a23",
            "t": "17. Sigilo fiscal."
          },
          {
            "id": "d14a30",
            "t": "18. Código de Defesa do Contribuinte (Lei Complementar nº 225/2026)."
          },
          {
            "id": "d14a24",
            "t": "19. Processo Administrativo Fiscal (Decreto nº 70.235/1972)."
          },
          {
            "id": "d14a25",
            "t": "20. Ilícito tributário: ilícito administrativo tributário, ilícito penal tributário e crimes contra a ordem tributária (Lei nº 8.137/1990 e Lei nº 4.729/1965)."
          },
          {
            "id": "d14a26",
            "t": "21. Ação Cautelar Fiscal (Lei nº 8.397/1992)."
          },
          {
            "id": "d14a28",
            "t": "22. Tributação no regime falimentar."
          },
          {
            "id": "d14a29",
            "t": "23. Planejamento tributário. 23.1. Elisão e evasão tributária. 23.2. Abuso de formas. 23.3. Interpretação econômica do Direito Tributário."
          }
        ]
      },
      {
        "id": "d13",
        "n": "Direito Previdenciário",
        "grupo": "específicos",
        "b": 2,
        "as": [
          {
            "id": "d13a1",
            "t": "1. Aspectos teóricos e conceituais da Seguridade Social e Previdência Social."
          },
          {
            "id": "d13a2",
            "t": "2. Seguridade Social. 2.1. Origem e evolução legislativa no Brasil. 2.2. Conceituação e distinções: saúde, previdência e assistência. 2.3. Organização e princípios constitucionais."
          },
          {
            "id": "d13a3",
            "t": "3. Legislação previdenciária. 3.1. Conteúdo, fontes e autonomia. 3.2. Aplicação das normas previdenciárias. 3.2.1. Vigência, hierarquia, interpretação, integração e eficácia das normas. 3.2.2. Direito intertemporal, direito adquirido, expectativa de direito e proteção da confiança. 3.3. Orientação dos tribunais superiores."
          },
          {
            "id": "d13a13",
            "t": "4. Previdência Social: modelos, noções sobre Regime Geral, Regimes Próprios, Regimes Especiais e Previdência Complementar. 4.1. Problemas estruturais da Previdência Social."
          },
          {
            "id": "d13a4",
            "t": "5. Regime Geral de Previdência Social. 5.1. Princípios e objetivos. 5.2. Conselho Nacional de Previdência Social (CNPS). 5.3. Organização da Seguridade Social e Plano de Custeio (Lei nº 8.212/1991). 5.4. Relação jurídica de Previdência Social: filiação e inscrição, período de carência. 5.5. Segurados obrigatórios. 5.6. Empregado, empregado doméstico, empresário, contribuinte individual e equiparado, MEI, trabalhador avulso, segurado especial e segurado facultativo. 5.7. Qualidade de segurado: manutenção e perda, período de graça. 5.8. Dependentes."
          },
          {
            "id": "d13a5",
            "t": "6. Trabalhadores excluídos do Regime Geral."
          },
          {
            "id": "d13a6",
            "t": "7. Empresa e empregador doméstico: conceito previdenciário."
          },
          {
            "id": "d13a7",
            "t": "8. Financiamento da seguridade social. 8.1. Fontes de custeio; contribuições sociais: natureza e espécies. 8.2. Receitas da União. 8.3. Receitas das contribuições sociais: dos segurados, das empresas, do empregador doméstico, do produtor rural, do clube de futebol profissional, de concursos de prognósticos e de outras fontes. 8.4. Prescrição e decadência. 8.5. Salário de contribuição. 8.6. Arrecadação e recolhimento das contribuições: obrigações da empresa e demais contribuintes, prazo de recolhimento."
          },
          {
            "id": "d13a8",
            "t": "9. Responsabilidade solidária: conceito, natureza jurídica e características. 9.1. Aplicação na construção civil, na cessão de mão de obra e em grupo econômico."
          },
          {
            "id": "d13a9",
            "t": "10. Isenções e parcelamentos de contribuições: requisitos, manutenção e perda."
          },
          {
            "id": "d13a11",
            "t": "11. Ilícito tributário: ilícito administrativo; infrações à legislação previdenciária."
          },
          {
            "id": "d13a10",
            "t": "11. Ilícito penal previdenciário; crimes contra a seguridade social."
          }
        ]
      },
      {
        "id": "d15",
        "n": "Legislação Tributária",
        "grupo": "específicos",
        "b": 2,
        "as": [
          {
            "id": "d15a4",
            "t": "1. Imposto sobre a Renda e Proventos de Qualquer Natureza. 1.1. Princípios e regras constitucionais aplicáveis ao imposto. 1.2. Critérios orientadores: renda e proventos, disponibilidade econômica ou jurídica, acréscimo patrimonial. 1.3. Tributação das pessoas físicas: fato gerador, sujeição passiva, base de cálculo, deduções, tributação exclusiva, bases correntes, carnê-leão, tributação definitiva, ajuste anual. 1.4. Tributação das pessoas jurídicas: fato gerador, sujeição passiva, base de cálculo, despesas dedutíveis e indedutíveis, lucro real, presumido e arbitrado, lucros no exterior, preços de transferência, investimentos avaliados pelo patrimônio líquido, reorganizações societárias, tributação na fonte, regimes de caixa e de competência, apuração."
          },
          {
            "id": "d15a8",
            "t": "2. Contribuição Social sobre o Lucro Líquido. 2.1. Princípios e regras constitucionais aplicáveis à contribuição. 2.2. Fato gerador. 2.3. Sujeição passiva. 2.4. Base de cálculo. 2.5. Apuração."
          },
          {
            "id": "d15a7",
            "t": "3. Contribuições Sociais. 3.1. Princípios e regras constitucionais aplicáveis às contribuições sociais. 3.2. Contribuição para o PIS/Pasep e COFINS. 3.2.2. Regime de apuração cumulativa: fato gerador, sujeição passiva, base de cálculo, apuração. 3.2.3. Regime de apuração não cumulativa: fato gerador, sujeição passiva, créditos, base de cálculo, apuração."
          },
          {
            "id": "d15a5",
            "t": "4. Imposto sobre Produtos Industrializados. 4.1. Princípios e regras constitucionais aplicáveis ao imposto. 4.2. Fato gerador. 4.3. Sujeição passiva. 4.4. Base de cálculo. 4.5. Apuração."
          },
          {
            "id": "d15a6",
            "t": "5. Imposto sobre Operações de Crédito, Câmbio e Seguro, ou relativas a Títulos ou Valores Mobiliários. 5.1. Princípios e regras constitucionais aplicáveis ao imposto. 5.2. Fato gerador. 5.3. Sujeição passiva. 5.4. Base de cálculo. 5.5. Apuração."
          },
          {
            "id": "d15a3",
            "t": "6. Imposto sobre a Propriedade Territorial Rural. 6.1. Princípios e regras constitucionais aplicáveis ao imposto. 6.2. Fato gerador. 6.3. Sujeição passiva. 6.4. Base de cálculo. 6.5. Apuração."
          },
          {
            "id": "d15a9",
            "t": "7. Contribuição de Intervenção no Domínio Econômico incidente sobre a comercialização de petróleo e seus derivados, gás natural e seus derivados, e álcool etílico combustível. 7.1. Princípios e regras constitucionais aplicáveis à contribuição. 7.2. Fato gerador. 7.3. Sujeição passiva. 7.4. Base de cálculo. 7.5. Apuração."
          },
          {
            "id": "d15a11",
            "t": "8. Contribuição Social sobre Bens e Serviços (CBS). 8.1. Princípios e regras constitucionais. 8.2. Hipóteses de incidência. 8.3. Imunidades. 8.4. Fato gerador. 8.5. Local da operação. 8.6. Base de cálculo. 8.7. Alíquotas. 8.8. Sujeição passiva. 8.9. Modalidades de extinção dos débitos. 8.10. Pagamento indevido ou a maior. 8.11. Ressarcimento. 8.12. Regimes de apuração. 8.13. Não cumulatividade. 8.14. Devolução e cancelamento. 8.15. Correção do valor do débito. 8.16. Bens e serviços de uso ou consumo pessoal."
          },
          {
            "id": "d15a12",
            "t": "9. Imposto Seletivo. 9.1. Princípios e regras constitucionais aplicáveis ao imposto. 9.2. Fato gerador. 9.3. Sujeição passiva. 9.4. Base de cálculo. 9.5. Apuração."
          },
          {
            "id": "d14a7",
            "t": "10. Simples Nacional. 10.1. Definição de microempresa e empresa de pequeno porte. 10.2. Inscrição e baixa. 10.3. Tributos e contribuições: instituição e abrangência, vedações ao ingresso, alíquotas e base de cálculo, recolhimento, repasse da arrecadação, créditos, obrigações acessórias, exclusão, fiscalização, omissão de receita, acréscimos legais, processo administrativo e judicial."
          }
        ]
      },
      {
        "id": "d16",
        "n": "Comércio Internacional",
        "grupo": "específicos",
        "b": 2,
        "as": [
          {
            "id": "d16a1",
            "t": "1. Fundamentos econômicos do comércio internacional. 1.1. Principais teorias do comércio internacional. 1.2. Política econômica em economias abertas. 1.3. Mercados internacionais. 1.4. Balanço de pagamentos. 1.5. Evolução do Sistema Monetário Internacional."
          },
          {
            "id": "d16a2",
            "t": "2. Fundamentos normativos do comércio internacional. 2.1. Conceitos básicos: GATT, protecionismo, barreiras comerciais e desenvolvimento. 2.2. Integração econômica: zona de preferência tarifária, área de livre comércio e união aduaneira; acordos de integração na América Latina; Mercosul (estrutura, Tratado de Assunção, Protocolo de Ouro Preto, Protocolo de Olivos, Tarifa Externa Comum, regime de origem); acordo Mercosul–União Europeia."
          },
          {
            "id": "d16a7",
            "t": "2.3. Acordos no âmbito da OMC: Acordo Constitutivo, GATT 1994, barreiras técnicas, antidumping, valoração aduaneira, inspeção pré-embarque, regras de origem, licenciamento de importações, subsídios e medidas compensatórias, salvaguardas, facilitação de comércio; desafios institucionais contemporâneos da OMC."
          },
          {
            "id": "d16a6",
            "t": "2.4. Acordos e instrumentos no âmbito da OMA. 2.4.1. Classificação de mercadorias no Sistema Harmonizado. 2.4.2. Convenção de Quioto Revisada. 2.4.3. Marco SAFE."
          },
          {
            "id": "d16a3",
            "t": "3. Políticas de comércio exterior e tratamento administrativo. 3.1. Políticas de comércio exterior do Brasil. 3.2. Órgãos nacionais intervenientes do comércio exterior do Brasil. 3.3. Aspectos administrativos na exportação e importação."
          },
          {
            "id": "d16a4",
            "t": "4. Câmbio, pagamento e seguros no comércio internacional. 4.1. Pagamentos internacionais e mercado de câmbio brasileiro. 4.2. Fatores e determinação da taxa de câmbio. 4.3. Modalidades ou métodos de pagamento. 4.4. Comissão de agentes. 4.5. Disponibilidades no exterior. 4.6. Pagamentos usados na exportação e na importação. 4.7. Seguros internacionais."
          },
          {
            "id": "d16a5",
            "t": "5. Logística internacional. 5.1. Sistema de transporte internacional. 5.2. Termos comerciais internacionais – Incoterms. 5.3. Tipos de carga. 5.4. Operadores logísticos internacionais."
          }
        ]
      },
      {
        "id": "d17",
        "n": "Legislação Aduaneira",
        "grupo": "específicos",
        "b": 2,
        "as": [
          {
            "id": "d17a1",
            "t": "1. Jurisdição aduaneira. 1.1. Território aduaneiro. 1.2. Locais e recintos alfandegados. 1.3. Sujeitos de comércio exterior: administração aduaneira, órgãos públicos e pessoas intervenientes no comércio exterior, coordenação e cooperação."
          },
          {
            "id": "d17a2",
            "t": "2. Controle aduaneiro de veículos."
          },
          {
            "id": "d17a5",
            "t": "3. Controle aduaneiro de mercadorias. 3.1. Despacho aduaneiro: de importação, de exportação, Portal Único de Comércio Exterior, casos especiais, auditorias posteriores à liberação. 3.2. Normas especiais: abandono de mercadoria, mercadorias presumidas idênticas, tráfego postal, mercadoria de importação não autorizada."
          },
          {
            "id": "d17a4",
            "t": "4. Regimes aduaneiros especiais e aplicados em áreas especiais. 4.1. Regimes aduaneiros especiais: trânsito aduaneiro; admissão e exportação temporárias; entreposto aduaneiro, depósito especial, afiançado, franco, alfandegado certificado, loja franca, entreposto industrial da ZFM; drawback suspensão, Recof, aperfeiçoamento ativo e passivo; Repetro. 4.2. Áreas especiais: Zona Franca de Manaus, Áreas de Livre Comércio, ZPE."
          },
          {
            "id": "d17a3",
            "t": "5. Tributos incidentes sobre as mercadorias nas operações de comércio exterior. 5.3. Demais tributos: IPI vinculado à importação, Imposto Seletivo vinculado à importação, CBS na importação e na exportação, CIDE-Combustíveis Importação, AFRMM, Taxa de Utilização do Siscomex, Taxa de Utilização do Mercante. 5.4. Regimes de tributação diferenciada: RTE, RTS, RTU, mercadorias não identificadas. 5.5. Extravio e acréscimo. 5.6. Restituição e compensação."
          },
          {
            "id": "d15a1",
            "t": "5.1. Imposto de Importação. 5.1.1. Incidência e fato gerador. 5.1.2. Sujeição passiva. 5.1.3. Cálculo e pagamento. 5.1.4. Imunidades, isenções e reduções."
          },
          {
            "id": "d15a2",
            "t": "5.2. Imposto de Exportação. 5.2.1. Incidência e fato gerador. 5.2.2. Sujeição passiva. 5.2.3. Cálculo e pagamento. 5.2.4. Isenções e incentivos fiscais na exportação."
          },
          {
            "id": "d17a6",
            "t": "6. Infrações e penalidades aduaneiras. 6.1. Definição de infração e aplicação e graduação das penalidades. 6.2. Denúncia espontânea e autorregularização. 6.3. Penalidade de perdimento de mercadoria, de veículo e de moeda. 6.4. Multas. 6.5. Sanções administrativas. 6.6. Relevação de penalidades. 6.7. Representação fiscal para fins penais. 6.8. Infrações praticadas pelos órgãos da Administração Pública."
          },
          {
            "id": "d17a8",
            "t": "7. Decadência e prescrição em matéria aduaneira."
          },
          {
            "id": "d17a7",
            "t": "8. Processos e procedimentos administrativos específicos da área aduaneira. 8.1. Determinação e exigência de salvaguardas. 8.2. Perdimento. 8.3. Penalidade pelo transporte rodoviário de mercadoria sujeita a perdimento. 8.4. Sanções administrativas aos intervenientes. 8.5. Direitos antidumping e compensatórios. 8.6. Consulta em matéria aduaneira. 8.7. Verificação de origem não preferencial."
          },
          {
            "id": "d17a9",
            "t": "9. Atividades relacionadas aos serviços aduaneiros."
          },
          {
            "id": "d17a10",
            "t": "10. Programas de conformidade na área aduaneira. 10.1. Operador Econômico Autorizado (OEA). 10.2. Programa Remessa Conforme (PRC)."
          }
        ]
      }
    ],
    "fora": [
      {
        "id": "d2a1",
        "n": "Língua Inglesa",
        "t": "Conhecimento e uso das formas contemporâneas da linguagem inglesa."
      },
      {
        "id": "d5a1",
        "n": "Economia e Finanças públicas",
        "t": "Microeconomia. 1. Conceitos básicos: o problema econômico fundamental, mercado, fluxos econômicos em uma economia de mercado, variáveis-fluxo e variáveis-estoque."
      },
      {
        "id": "d5a2",
        "n": "Economia e Finanças públicas",
        "t": "2. Demanda e oferta, deslocamento das curvas de oferta e demanda."
      },
      {
        "id": "d5a3",
        "n": "Economia e Finanças públicas",
        "t": "3. Elasticidades da oferta e da demanda."
      },
      {
        "id": "d5a4",
        "n": "Economia e Finanças públicas",
        "t": "4. Teoria do Consumidor: restrição orçamentária, curvas de indiferença, utilidade, bens substitutos e complementares, escolha do consumidor, índices de Laspeyres e de Paasche, efeito renda e efeito substituição, demanda de mercado, excedente do consumidor."
      },
      {
        "id": "d5a5",
        "n": "Economia e Finanças públicas",
        "t": "5. Escolha sob incerteza: preferências em relação ao risco."
      },
      {
        "id": "d5a6",
        "n": "Economia e Finanças públicas",
        "t": "6. Produção: os fatores de produção, custos de produção, isoquantas, substituição entre insumos, rendimentos decrescentes, excedente do produtor."
      },
      {
        "id": "d5a7",
        "n": "Economia e Finanças públicas",
        "t": "7. Mercados competitivos: concorrência perfeita, análise de mercados competitivos, maximização de lucros, equilíbrio de mercado."
      },
      {
        "id": "d5a8",
        "n": "Economia e Finanças públicas",
        "t": "8. Poder de mercado: monopólio, monopsônio, oligopólio."
      },
      {
        "id": "d5a9",
        "n": "Economia e Finanças públicas",
        "t": "9. Noções de teoria dos jogos: dilema do prisioneiro, equilíbrio de Nash."
      },
      {
        "id": "d5a10",
        "n": "Economia e Finanças públicas",
        "t": "10. Eficiência econômica: eficiência nas trocas, livre comércio, vantagem comparativa, fronteiras de possibilidades de produção."
      },
      {
        "id": "d5a11",
        "n": "Economia e Finanças públicas",
        "t": "11. Falhas de mercado: assimetria de informação, risco moral, seleção adversa, papel do governo, bens públicos, externalidades."
      },
      {
        "id": "d5a12",
        "n": "Economia e Finanças públicas",
        "t": "12. Economia comportamental: aversão à perda, comportamento de manada."
      },
      {
        "id": "d5a13",
        "n": "Economia e Finanças públicas",
        "t": "Macroeconomia. 13. Contas Nacionais, agregados macroeconômicos, produto, renda e despesa, diferentes conceitos de produto, consumo, investimento, poupança."
      },
      {
        "id": "d5a14",
        "n": "Economia e Finanças públicas",
        "t": "14. Exportações e importações, balanço de pagamentos e taxas de câmbio."
      },
      {
        "id": "d5a15",
        "n": "Economia e Finanças públicas",
        "t": "15. Inflação, índices de preços."
      },
      {
        "id": "d5a16",
        "n": "Economia e Finanças públicas",
        "t": "16. Política monetária e taxas de juros."
      },
      {
        "id": "d5a17",
        "n": "Economia e Finanças públicas",
        "t": "17. Política fiscal: tributos e gastos do governo."
      },
      {
        "id": "d5a18",
        "n": "Economia e Finanças públicas",
        "t": "18. Ciclos econômicos, estabilização econômica, o modelo IS-LM, planos de estabilização no Brasil, Plano Real."
      },
      {
        "id": "d5a19",
        "n": "Economia e Finanças públicas",
        "t": "19. Déficit orçamentário e dívida pública, teto de gastos."
      },
      {
        "id": "d5a20",
        "n": "Economia e Finanças públicas",
        "t": "20. Globalização, G20 e o papel dos organismos internacionais na governança global."
      },
      {
        "id": "d5a21",
        "n": "Economia e Finanças públicas",
        "t": "Finanças Públicas. 21. As funções econômicas do Estado: alocativa, distributiva e estabilizadora."
      },
      {
        "id": "d5a22",
        "n": "Economia e Finanças públicas",
        "t": "22. Orçamento público e os parâmetros da política fiscal no Brasil."
      },
      {
        "id": "d5a23",
        "n": "Economia e Finanças públicas",
        "t": "23. Responsabilidade fiscal, regras fiscais."
      },
      {
        "id": "d5a24",
        "n": "Economia e Finanças públicas",
        "t": "24. Ingressos públicos: conceito, classificação, tipos."
      },
      {
        "id": "d5a25",
        "n": "Economia e Finanças públicas",
        "t": "25. Fontes de financiamento público."
      },
      {
        "id": "d5a26",
        "n": "Economia e Finanças públicas",
        "t": "26. Tributação: preços e eficiência econômica, incidência tributária, perda de peso morto."
      },
      {
        "id": "d5a27",
        "n": "Economia e Finanças públicas",
        "t": "27. Carga tributária: conceito, composição, evolução no Brasil."
      },
      {
        "id": "d5a28",
        "n": "Economia e Finanças públicas",
        "t": "28. Princípios de descentralização fiscal: transferências intergovernamentais: classificação e critérios."
      },
      {
        "id": "d6a2",
        "n": "Administração Geral",
        "t": "O processo administrativo.",
        "p": "d6a3"
      },
      {
        "id": "d6a4",
        "n": "Administração Geral",
        "t": "Papéis e habilidades do administrador."
      },
      {
        "id": "d6a8",
        "n": "Administração Geral",
        "t": "Administração por objetivos.",
        "p": "d7a5"
      },
      {
        "id": "d6a10",
        "n": "Administração Geral",
        "t": "Processo decisório: tipos de decisões; decisão racional; heurísticas; ferramentas de apoio à decisão."
      },
      {
        "id": "d6a13",
        "n": "Administração Geral",
        "t": "Balanced scorecard."
      },
      {
        "id": "d6a15",
        "n": "Administração Geral",
        "t": "Recrutamento e seleção de pessoas: visão geral e conceitos básicos; relação com os demais processos de gestão de pessoas; recrutamento interno e externo; técnicas de recrutamento e seleção."
      },
      {
        "id": "d6a16",
        "n": "Administração Geral",
        "t": "Análise e descrição de cargos."
      },
      {
        "id": "d6a17",
        "n": "Administração Geral",
        "t": "Treinamento e desenvolvimento: visão geral e conceitos básicos; relação com os demais processos de gestão de pessoas; métodos; avaliação de programas de treinamento e desenvolvimento."
      },
      {
        "id": "d6a20",
        "n": "Administração Geral",
        "t": "Gestão da qualidade e modelo de excelência gerencial: principais teóricos e suas contribuições para a gestão da qualidade; ferramentas de gestão da qualidade."
      },
      {
        "id": "d6a21",
        "n": "Administração Geral",
        "t": "Gestão de projetos: modelos, etapas, elaboração, técnicas de análise e avaliação de projetos."
      },
      {
        "id": "d6a25",
        "n": "Administração Geral",
        "t": "Noções de estatística aplicada ao controle e à melhoria de processos."
      },
      {
        "id": "d6a26",
        "n": "Administração Geral",
        "t": "BPM.",
        "p": "d6a22"
      },
      {
        "id": "d6a27",
        "n": "Administração Geral",
        "t": "Administração Financeira."
      },
      {
        "id": "d6a29",
        "n": "Administração Geral",
        "t": "Tipo."
      },
      {
        "id": "d6a30",
        "n": "Administração Geral",
        "t": "Variáveis."
      },
      {
        "id": "d6a31",
        "n": "Administração Geral",
        "t": "Princípios gerais de alavancagem operacional e financeira."
      },
      {
        "id": "d6a32",
        "n": "Administração Geral",
        "t": "Planejamento financeiro de curto e longo prazo."
      },
      {
        "id": "d6a33",
        "n": "Administração Geral",
        "t": "Conceitos básicos de análise de balanços e demonstrações financeiras."
      },
      {
        "id": "d7a1",
        "n": "Administração Pública",
        "t": "As reformas administrativas e a redefinição do papel do Estado; reforma do serviço civil (mérito, flexibilidade e responsabilização) e reforma do aparelho do Estado.",
        "p": "d7a2"
      },
      {
        "id": "d7a3",
        "n": "Administração Pública",
        "t": "Processos participativos de gestão pública: conselhos de gestão, orçamento participativo, parceria entre governo e sociedade.",
        "p": "d7a4"
      },
      {
        "id": "d7a6",
        "n": "Administração Pública",
        "t": "Comunicação na gestão pública e gestão de redes organizacionais."
      },
      {
        "id": "d7a7",
        "n": "Administração Pública",
        "t": "Administração de pessoal."
      },
      {
        "id": "d7a8",
        "n": "Administração Pública",
        "t": "Administração de compras e materiais: processos de compras governamentais e gerenciamento de materiais e estoques."
      },
      {
        "id": "d7a9",
        "n": "Administração Pública",
        "t": "Sustentabilidade das contratações."
      },
      {
        "id": "d7a10",
        "n": "Administração Pública",
        "t": "Mudanças institucionais: conselhos, organizações sociais, organização da sociedade civil de interesse público (OSCIP), agência reguladora, agência executiva, consórcios públicos."
      },
      {
        "id": "d7a11",
        "n": "Administração Pública",
        "t": "Conceitos básicos de planejamento."
      },
      {
        "id": "d7a12",
        "n": "Administração Pública",
        "t": "Aspectos administrativos, técnicos, econômicos e financeiros."
      },
      {
        "id": "d7a13",
        "n": "Administração Pública",
        "t": "Formulação de programas e projetos."
      },
      {
        "id": "d7a14",
        "n": "Administração Pública",
        "t": "Avaliação de programas e projetos."
      },
      {
        "id": "d7a15",
        "n": "Administração Pública",
        "t": "Tipos de avaliação."
      },
      {
        "id": "d7a16",
        "n": "Administração Pública",
        "t": "Análise custo benefício e análise custo-efetividade."
      },
      {
        "id": "d7a19",
        "n": "Administração Pública",
        "t": "Princípios, diretrizes e níveis de análise.",
        "p": "d7a17"
      },
      {
        "id": "d7a20",
        "n": "Administração Pública",
        "t": "Sistema de governança.",
        "p": "d7a17"
      },
      {
        "id": "d7a24",
        "n": "Administração Pública",
        "t": "Boas práticas de gestão de Riscos.",
        "p": "d7a22"
      },
      {
        "id": "d7a25",
        "n": "Administração Pública",
        "t": "Processo de formulação e desenvolvimento de políticas: construção de agendas, formulação de políticas, implementação de políticas, financiamento de políticas públicas, indicadores de desempenho de políticas públicas."
      },
      {
        "id": "d7a26",
        "n": "Administração Pública",
        "t": "As políticas públicas no Estado brasileiro contemporâneo; descentralização e democracia; participação, atores sociais e controle social; gestão local, cidadania e equidade social."
      },
      {
        "id": "d7a27",
        "n": "Administração Pública",
        "t": "Planejamento e avaliação nas políticas públicas."
      },
      {
        "id": "d7a29",
        "n": "Administração Pública",
        "t": "Lei Complementar nº 131/2009 (Lei da Transparência)."
      },
      {
        "id": "d8a9",
        "n": "Auditoria",
        "t": "9 Demonstrações contábeis sujeitas a auditoria."
      },
      {
        "id": "d8a17",
        "n": "Auditoria",
        "t": "17 Auditoria no ativo realizável a longo prazo. 17.1 Identificação de origens de recursos fictícias."
      },
      {
        "id": "d8a25",
        "n": "Auditoria",
        "t": "25 Auditoria no passivo não circulante.",
        "p": "d8a22"
      },
      {
        "id": "d8a26",
        "n": "Auditoria",
        "t": "26 Auditoria no patrimônio líquido.",
        "p": "d8a27"
      },
      {
        "id": "d8a30",
        "n": "Auditoria",
        "t": "30 Auditoria em contas de resultado.",
        "p": "d8a31"
      },
      {
        "id": "d8a34",
        "n": "Auditoria",
        "t": "34 Identificação de fraudes e erros na escrita fiscal."
      },
      {
        "id": "d9a1",
        "n": "Contabilidade Geral e Pública",
        "t": "Contabilidade Geral: 1. Contabilidade. Conceito, objeto, objetivos, campo de atuação e usuários da informação contábil.",
        "p": "d9a2"
      },
      {
        "id": "d9a3",
        "n": "Contabilidade Geral e Pública",
        "t": "3. Conceitos, forma de avaliação, evidenciação, natureza, espécie e estrutura.",
        "p": "d9a11"
      },
      {
        "id": "d9a4",
        "n": "Contabilidade Geral e Pública",
        "t": "4. Atos e fatos administrativos.",
        "p": "d9a10"
      },
      {
        "id": "d9a6",
        "n": "Contabilidade Geral e Pública",
        "t": "6. Variação do patrimônio líquido. Receita, despesa, ganhos e perdas.",
        "p": "d9a7"
      },
      {
        "id": "d9a8",
        "n": "Contabilidade Geral e Pública",
        "t": "8. Regimes de apuração. Caixa e competência.",
        "p": "d9a7"
      },
      {
        "id": "d9a13",
        "n": "Contabilidade Geral e Pública",
        "t": "13. Notas explicativas às demonstrações contábeis. Conteúdo, forma de apresentação e exigências legais de informações.",
        "p": "d9a12"
      },
      {
        "id": "d9a14",
        "n": "Contabilidade Geral e Pública",
        "t": "14. Ajustes, classificações e avaliações dos itens patrimoniais exigidos pelas novas práticas contábeis adotadas no Brasil trazidas pela Lei Federal nº 11.638/07 e suas alterações e Lei Federal nº 11.941/09 e suas alterações."
      },
      {
        "id": "d9a15",
        "n": "Contabilidade Geral e Pública",
        "t": "15. Estoques. Tipos de inventários, critérios e métodos de avaliação.",
        "p": "d9a16"
      },
      {
        "id": "d9a17",
        "n": "Contabilidade Geral e Pública",
        "t": "Contabilidade Aplicada ao Setor Público: 1 NBC TSP Estrutura Conceitual – estrutura conceitual para elaboração e divulgação de informação contábil de propósito geral pelas entidades do setor público. 1.1 Relatório Contábil de Propósito Geral das Entidades do Setor Público (RCPG): objetivos e…"
      },
      {
        "id": "d9a18",
        "n": "Contabilidade Geral e Pública",
        "t": "2 Estrutura e apresentação das Demonstrações Contábeis do Setor Público. 2.1 Definições, finalidade, componentes, estrutura e conteúdo das demonstrações: de acordo com a Lei 4320/1964; de acordo com a NBC T SP 11; de acordo com o MCASP."
      },
      {
        "id": "d9a19",
        "n": "Contabilidade Geral e Pública",
        "t": "3 Plano de Contas aplicado ao Setor Público. 3.1 Conceito de contas patrimoniais e de resultado. 3.2 Função e estrutura das contas. 3.3 Escrituração: débito, crédito, saldo, sistema de partidas dobradas."
      },
      {
        "id": "d9a20",
        "n": "Contabilidade Geral e Pública",
        "t": "4 Tópicos selecionados da Lei Complementar nº 101/2000. 4.1 Conceitos de dívida pública e restos a pagar, escrituração e consolidação das contas. 4.2 Relatório resumido da execução orçamentária: estrutura, composição. 4.3 Relatório de gestão fiscal: estrutura, composição."
      },
      {
        "id": "d9a21",
        "n": "Contabilidade Geral e Pública",
        "t": "5 Tópicos especiais da contabilidade aplicada ao setor público. 5.1 Procedimentos Contábeis Orçamentários (Regime orçamentário e Regime Contábil ou patrimonial (MCASP)). 5.2 Procedimentos Contábeis Patrimoniais conforme Manual de Contabilidade Aplicada ao Setor Público (MCASP), 9ª edição. 5.3…"
      },
      {
        "id": "d9a22",
        "n": "Contabilidade Geral e Pública",
        "t": "7 Trabalho de asseguração (NBC TA Estrutura Conceitual – Estrutura Conceitual para Trabalhos de Asseguração)."
      },
      {
        "id": "d10a14",
        "n": "Fluência em Dados",
        "t": "Ciência dos dados.",
        "p": "d10a11"
      },
      {
        "id": "d12a5",
        "n": "Direito Constitucional",
        "t": "5. Tipos de Constituição.",
        "p": "d12a3"
      },
      {
        "id": "d13a12",
        "n": "Direito Previdenciário",
        "t": "12. Questão do equilíbrio financeiro da Previdência Social.",
        "p": "d13a13"
      },
      {
        "id": "d14a27",
        "n": "Direito Tributário",
        "t": "28. A Lei de Liberdade Econômica e sua mitigação perante o Direito Tributário (Lei nº 13.874, de 20 de setembro de 2019)."
      },
      {
        "id": "d15a10",
        "n": "Legislação Tributária",
        "t": "10. Contribuição de Intervenção de Domínio Econômico destinada a financiar o Programa de Estímulo à Interação Universidade-Empresa para o Apoio à Inovação (Lei nº 10.168, de 29 de dezembro de 2000). 10.1. Princípios e regras constitucionais aplicáveis à contribuição. 10.2. Fato gerador. 10.3.…"
      }
    ]
  };
