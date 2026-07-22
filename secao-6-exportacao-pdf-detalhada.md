## 6. GERAÇÃO DE RELATÓRIO (exportação em PDF) — ESPECIFICAÇÃO DETALHADA

> Esta seção **substitui integralmente** a seção 6 original do prompt. O dono do produto anexou um relatório real gerado pela plataforma Even ("Issue Reporting" / "Relatório Site com Desenhos", obra "Altto e Hub - Harmonia - CARRICERO - RES 3440") como **modelo literal de referência**. Não interprete livremente — reproduza a estrutura abaixo exatamente como descrita, porque cada elemento foi extraído diretamente desse PDF real, campo por campo, página por página. Onde houver uma regra marcada como "ambígua/inferida", implemente como descrito mas deixe o campo configurável, porque não temos 100% de certeza sobre a codificação de cores usada no PDF original.

### 6.1 Estrutura geral do PDF (ordem das páginas)

O relatório final é composto, nesta ordem exata:

1. **Página de capa** ("Issue Reporting") — uma única vez, no início do documento.
2. Para **cada "Região de Desenho"** (ver 6.2 abaixo), dentro do escopo filtrado (obra inteira, uma torre, ou um pavimento):
   - Uma **página de planta** com os pinos das pendências daquela região.
   - Uma ou mais **páginas de detalhe** (lista), com um bloco por pendência daquela região, na ordem em que os pinos aparecem na planta (ordem crescente de código/id).
3. As regiões se repetem sequencialmente até cobrir toda a obra/torre/pavimento selecionado no filtro de emissão.

Cada página tem cabeçalho e rodapé fixos (ver 6.6).

### 6.2 Capa do relatório ("Issue Reporting")

A primeira página do PDF é uma capa de identificação, distinta das páginas de conteúdo. Deve conter, na ordem:

- **Logo da construtora/plataforma** no canto superior esquerdo.
- **Título "Issue Reporting"** no canto superior direito, com a **data/hora de geração do relatório** logo abaixo do título (formato `DD/MM/AAAA HH:MM:SS`).
- Um bloco **"General Information"** (tabela com bordas pontilhadas, uma linha por campo, label à esquerda e valor à direita):
  - `ProjectName`: nome completo da obra (formato `Construtora - Nome da Obra`, seguindo a convenção da seção 1).
  - `Contract No`: número de contrato (pode ficar vazio).
  - `Program`: campo livre (pode ser "-").
  - `Division`: campo livre (pode ser "-").
  - `Region`: campo livre (pode ser "-").
- Um bloco **"Current Filters"** (caixa cinza, ocupando a largura da página), mostrando **quais filtros foram aplicados** na emissão deste relatório específico — por exemplo, se o usuário filtrou por tipo de planta/desenho, categoria de pendência, torre, pavimento, status, responsável, etc. Cada filtro ativo aparece como um label seguido dos valores escolhidos (no modelo de referência aparece `Desenho:` como único filtro usado, mas o campo deve ser dinâmico e listar **todos** os filtros que o usuário aplicou na tela de emissão, e ficar em branco/omitido se nenhum filtro daquele tipo foi usado).
- No rodapé da capa, dois campos finais:
  - `Created On`: data/hora de geração (mesma da linha do título, repetida).
  - `Created By`: nome do usuário que gerou o relatório (não confundir com quem criou as pendências).

### 6.3 Regiões de Desenho (fatiamento da planta)

- Diferente de mostrar a planta inteira de um pavimento numa página só, o sistema deve **fatiar a planta em retângulos ("Drawing Regions")** definidos por faixas de coordenadas x/y, de forma que cada fatia caiba legível numa página A4/Letter.
- Isso é necessário porque plantas de pavimentos curvos, muito largos, ou com múltiplos blocos (ex.: Torre A + Torre B do mesmo pavimento) não cabem em uma imagem única sem perder legibilidade dos pinos e números.
- Cada região é identificada, no cabeçalho da sua página de planta, por uma string no formato:
  `[Nome do Pavimento] -- (x_min-x_max, y_min-y_max)`
  Exemplo real do PDF de referência: `Pav 02 -- (1033-2323, 0-808)` e, na página seguinte da mesma torre/pavimento, `Pav 02 -- (0-1032, 809-1572)` — ou seja, o mesmo pavimento pode gerar várias regiões/páginas diferentes cobrindo áreas distintas do mesmo andar.
- Regra de geração automática: o sistema deve calcular o bounding box de todos os pinos de pendências de um pavimento e, se a densidade/área for grande demais para uma página legível, dividir automaticamente em múltiplas regiões (grade), preservando a granularidade mínima necessária para que os números dos pinos não se sobreponham.
- Uma região que não tem nenhuma pendência **não gera página** — só entram no relatório regiões que possuem ao menos 1 pendência dentro do filtro aplicado (torre/pavimento/status escolhidos na emissão).

### 6.4 Página de planta (uma por região)

Cabeçalho da página (igual em todas as páginas de conteúdo, ver 6.6), seguido de:

- `Título Relatório:` — nome do relatório sendo emitido (ex.: "Lista Defeitos"). Deve ser configurável na tela de emissão (o usuário pode nomear o relatório antes de gerar).
- `Drawing Region:` — a string de região descrita em 6.3.
- Abaixo, a **imagem da planta recortada** (o crop daquela região específica), ocupando a maior parte útil da página, com os **pinos das pendências** sobrepostos na posição x/y exata onde foram marcados (mesma lógica de marcação de pino descrita na seção 5.1).

#### 6.4.1 Estilo visual do pino de pendência

Reproduza exatamente este padrão visual observado no PDF de referência:

- **Corpo do pino**: uma bolha oval com o **código numérico da pendência em negrito, branco**, centralizado.
  - Cor do corpo do pino = **vermelho** quando a pendência está **aberta ou vencida** (status "Open" no momento da emissão do relatório).
  - Cor do corpo do pino = **cinza** quando a pendência está **fechada** ("Closed"/"Fixed").
  - *(Regra inferida do PDF de referência — implemente como descrito, mas deixe a paleta de cores configurável em tela de admin, pois pode haver mais estados no futuro.)*
- **Tag do responsável**: logo abaixo do número, dentro da mesma bolha (ou em uma extensão dela), uma abreviação de texto branco identificando a empresa/subempreiteira responsável (no exemplo real: `mcj`, abreviação de "MCJ Elétrica"). Esse texto deve vir do campo "Con:" (contratada responsável) da pendência (ver 6.5).
- **Indicador de prioridade**: um pequeno círculo/ponto colorido "pendurado" abaixo da bolha do pino, ligado por uma haste fina, indicando a prioridade da pendência:
  - Azul = prioridade **Alta**.
  - Amarelo = prioridade **Baixa**.
  - *(Padrão inferido — no PDF de referência não há exemplo suficiente de prioridade "Média" para confirmar a cor; trate como campo de legenda configurável, com uma terceira cor livre para "Média".)*
- O pino deve ter uma pequena seta/linha guia conectando-o ao ponto exato x/y clicado na planta, para casos em que o texto do pino precise ficar deslocado da marcação exata (evitar sobreposição de números quando pinos estão muito próximos).

### 6.5 Página(s) de detalhe (lista de pendências da região)

Após a página de planta de uma região, seguem uma ou mais páginas listando, **em ordem crescente de código**, cada pendência daquela região. Cada pendência ocupa um bloco horizontal, com uma **linha divisória fina** entre um bloco e o próximo. Cada bloco contém, à esquerda um bloco de texto e à direita a foto:

**Coluna de texto (esquerda), de cima para baixo:**
1. **Código da pendência** em negrito (ex.: `4668`).
2. **Localização hierárquica curta**: `[Pavimento] - [Pavimento]` (repetição do nome do pavimento, refletindo o padrão "Torre - Pavimento" do sistema real, ex.: `Pav 01 - Pav 01`, `Subsolo 01 - Subsolo 01`, `Terreo - Térreo`).
3. **Trilha de categoria** (breadcrumb), em texto normal, no formato `Categoria / Subcategoria / Subcategoria - Subcategoria - Subcategoria`, usando " / " e " - " como no exemplo real:
   `Instal Elétrica / Sistemas / Automação - Caixinhas - Quadros - Fiação / Arame Guia`
   Este campo deve ser gerado a partir de uma **árvore de categorias de defeito cadastrável pelo admin** (disciplina → sistema → elemento → tipo de problema), não texto livre digitado pelo fiscal — precisa existir um cadastro de taxonomia de defeitos por trás disso, com pelo menos as disciplinas observadas no exemplo real: "Instal Elétrica / Sistemas / Automação", "Alvenaria convencional", "Revestimentos Internos", "Estrutura", "Equipamentos".
4. **Descrição livre do apontamento** (texto digitado pelo fiscal), ex.: `acabamento de ponto de chuveiro`.
5. Logo abaixo/ao lado da localização, em itálico e fonte menor: as **coordenadas x/y** exatas do pino na planta (ex.: `x:2297`, `y:534`) — usadas internamente para reposicionar o pino se a planta for reprocessada, e exibidas no relatório para rastreabilidade.
6. Uma linha com três informações lado a lado:
   - `Realizado:` — a **data-limite de correção** (prazo), calculada automaticamente como data de criação + 5 dias corridos (regra da seção 5.2, item 7), no formato `Dia-da-semana abreviado, DD Mês AAAA` (ex.: `Wed, 28 Apr 2021`).
   - **Prioridade** da pendência (`Baixa`, `Média` ou `Alta`), texto simples.
   - `Dias restantes:` — número de dias entre a data de emissão do relatório e o prazo. Se **negativo** (prazo já vencido), exibir em **vermelho** com o sinal de menos (ex.: `-12`). Se zero ou positivo, exibir em cor neutra/cinza.
7. Um **badge de status** (retângulo colorido com texto centralizado), com no mínimo estes três valores possíveis:
   - `Open` — fundo **laranja**, texto branco (pendência aberta, ainda não resolvida).
   - `Closed` — fundo **cinza**, texto cinza-escuro (pendência com baixa dada, mas sem foto de confirmação "fixada" — estado intermediário).
   - `Fixed` — fundo **verde**, texto branco (pendência resolvida e confirmada com foto de solução).
   *(Nota: isso implica que o modelo de status da seção 5.2 item 5 precisa, na prática, comportar um quarto estado visual/relatório — "Closed" como estado intermediário entre "baixa dada pelo executor" e "Fixed" como confirmação final auditada pelo fiscal. Avalie se isso deve virar um 4º status real no banco de dados ou apenas um rótulo de exibição no relatório — mas o relatório de referência claramente distingue os dois.)*
8. `Con:` — nome da empresa/subempreiteira responsável pela execução (ex.: `MCJ ELÉTRICA`). Este é o mesmo dado usado na tag do pino (6.4.1).

**Coluna de foto (direita):**
- Uma **miniatura da foto do problema** (a foto obrigatória de criação, seção 5.2 item 4), em tamanho pequeno (aprox. 150×100px equivalente), com:
  - Uma **anotação visual desenhada sobre a foto** (círculo ou seta vermelha, feita à mão/digitalmente pelo fiscal no momento da criação) apontando exatamente para o defeito dentro da imagem. **Esta é uma funcionalidade que precisa existir na criação da pendência** (ferramenta simples de desenho livre/caneta vermelha sobre a foto), não apenas no relatório — o relatório apenas exibe a foto já anotada.
  - Um **timestamp sobreposto no canto inferior direito da própria foto** (estilo "marca d'água de câmera", ex.: `27 Apr 2021 09:00`), gerado automaticamente no momento do upload da foto (não editável pelo usuário).
- Abaixo da foto, em itálico e fonte pequena, entre parênteses: `(Nome do Autor - DD/MM/AAAA HH:MM)` — nome de quem tirou/anexou a foto e o timestamp exato do upload (pode ser diferente do timestamp "queimado" na foto, que é o timestamp da câmera do celular; este é o timestamp de upload no sistema).

### 6.6 Cabeçalho e rodapé (todas as páginas de conteúdo, exceto a capa)

- **Cabeçalho**: logo à esquerda + título fixo **"Relatório Site com Desenhos"** ao lado do logo, e abaixo dele, em destaque, o **nome completo da obra** (`ProjectName`, mesmo formato da capa: `Construtora - Nome da Obra`). Fundo em azul claro atrás do bloco de título, como uma faixa.
- **Rodapé**: data/hora de geração do relatório (repetida em todas as páginas, canto inferior esquerdo) + **número sequencial da página, reiniciado a cada região de desenho** (ou seja, a página de planta de uma região é "página 1" daquela região, e as páginas de detalhe seguintes são "página 2", "página 3" etc., recomeçando em "1" na próxima região) — é assim que o modelo de referência numera (`10/05/2021 16:00:56 1`, depois `10/05/2021 16:00:56 2` na página seguinte da mesma região, e ao mudar de região o contador volta pra `1`).

### 6.7 Filtros de emissão do relatório

Na tela onde o usuário emite o relatório, deve ser possível filtrar por, no mínimo (cada filtro escolhido aparece depois no bloco "Current Filters" da capa, seção 6.2):

- Obra (obrigatório, sempre um só valor).
- Torre (uma, várias, ou todas).
- Pavimento (um, vários, ou todos dentro da(s) torre(s) escolhida(s)).
- Status da pendência (Aberta / Vencida / Fechada / Fixed / todas).
- Categoria/disciplina da pendência (usando a árvore de taxonomia da seção 6.5, item 3).
- Responsável/empresa executora (`Con:`).
- Nome do relatório (`Título Relatório:`, campo de texto livre digitado na hora da emissão).

### 6.8 Dependências de modelagem de dados (o que precisa já existir para isto funcionar)

Para que esta exportação seja possível sem retrabalho, a modelagem de dados da pendência (seção 5.2) precisa, desde já, prever:

- Campo de **anotação/desenho sobre a foto** (não apenas a foto crua) — armazenar a foto original **e** a versão anotada (ou os metadados vetoriais da anotação, se for regenerável).
- **Timestamp de captura da foto** (extraído do EXIF/câmera) separado do **timestamp de upload no sistema** — são dois campos distintos, como visto em 6.5.
- Uma **tabela de taxonomia de categorias de defeito** (árvore hierárquica), vinculável a cada pendência, para gerar a trilha de breadcrumb da seção 6.5, item 3.
- Um campo de **empresa/contratada responsável** (`Con:`) na pendência, distinto do "responsável que criou" (login/usuário, seção 5.2 item 8) — no exemplo real, `Con: MCJ ELÉTRICA` é a empresa, enquanto o autor da foto é uma pessoa física (ex.: "Fabio Andrade de Farias").
- Suporte a um estado intermediário de status (`Closed` vs `Fixed`, ver nota em 6.5, item 7) caso o time de produto confirme que são estados distintos e não apenas rótulos de exibição.
