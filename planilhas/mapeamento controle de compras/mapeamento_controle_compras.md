# Mapeamento de Estrutura — Controle_de_Compras.xlsx

Pasta de trabalho com **4 abas**: `Instruções`, `Visão Geral`, `Materiais Diversos`, `Ferramentas`.

---

## Aba "Instruções"
Intervalo: `A1:J48`. Página apenas de texto (sem tabela/estrutura de dados) — um manual de uso
explicando as outras abas, como cadastrar item, o que é "Obra Atual" x "Estoque BRITO?", como
funciona o painel de manutenção e o dashboard. Não contém células de entrada de dados.

---

## Aba "Materiais Diversos"
Intervalo: `A1:O207`. Cadastro principal (1 item por linha).

- **A1:N1** (mesclada) — título "MATERIAIS DIVERSOS / EQUIPAMENTOS — ESTOQUE BRITO"
- **Linha 2** — cabeçalho das colunas:

| Col | Cabeçalho |
|---|---|
| A | Nº Patrimônio |
| B | Descrição do Item |
| C | Quntidade *(sic — sem o "a")* |
| D | Saldo |
| E | Nº do Pedido |
| F | Data da Compra |
| G | Nome da Obra (destino da compra) |
| H | Obra Atual (localização) |
| I | Data de Saída para Obra |
| J | Estoque BRITO? |
| K | Valor do Equipamento (R$) |
| L | Nº da Nota Fiscal |
| M | Fornecedor |
| N | Status |

- **Linhas 3–195** — área de lançamento de itens (linhas em branco para preencher).
  - Colunas B (linhas 56–93 e outras esparsas) têm células **mescladas B:C** em pontos
    específicos (aparentemente resíduo de formatação, não um padrão constante linha a linha).
- **Listas suspensas (validação de dados)** presentes na planilha:
  - Coluna **C** (`C3:C195`) e, por inconsistência, também `D3:D5`/`D51:D195` → lista:
    `Elétrica, Hidráulica, Alvenaria/Estrutura, Segurança (EPI), Movimentação de Carga,
    Pintura/Acabamento, Outros` (categoria — mas o cabeçalho da coluna C está como "Quntidade";
    a validação parece não bater com o cabeçalho atual — vale revisar).
  - Coluna **G** (`G1:H1048576`) e **D** (`D6:D50`) → lista de obras:
    `Dialogo Alvaro Ramos, Obra P.Raposo, JVM Casa Alba, Estoque Brito`
  - Coluna **J** (`J3:J195`) → `Sim, Não`
  - Coluna **M** (`M3:M195`) → lista de fornecedores:
    `Ferragens União, Construmax Materiais, Ferramentas Tork Distribuidora,
    Elétrica Sul Ltda, EPI Total Equipamentos, Outro`
  - Coluna **N** (`N3:N195`) → `Em uso, Em estoque, Manutenção, Baixado`
- **A199** — "Observações — Materiais Diversos" (título de bloco de notas)
- **A200:N207** (mesclada) — texto de instruções de preenchimento desta aba (mesmo conteúdo,
  resumido, da aba "Instruções").

---

## Aba "Ferramentas"
Intervalo: `A1:N118`. Mesmo conceito da aba anterior, exclusivo para ferramentas portáteis.

- **A1:M1** (mesclada) — título "FERRAMENTAS — ESTOQUE BRITO"
- **Linha 2** — cabeçalho das colunas:

| Col | Cabeçalho |
|---|---|
| A | Nº Patrimônio |
| B | Descrição do Item |
| C | Nº do Pedido |
| D | Data da Compra |
| E | Nº da Nota Fiscal |
| F | Valor do Equipamento (R$) |
| G | QUANTIDADE COMPRAD *(sic — truncado)* |
| H | Fornecedor |
| I | Obra Atual (localização) |
| J | Data de Saída para Obra |
| K | Estoque *(provavelmente "Estoque BRITO?", rótulo truncado)* |
| L | SAIDA |
| M | Obra Atual (localização) *(repete o cabeçalho da coluna I)* |
| N | (sem cabeçalho) |

  > ⚠️ Cabeçalho desta aba está desorganizado/inconsistente em relação à aba "Materiais Diversos"
  > (ordem de colunas diferente, coluna "Status" não aparece nomeada — mas as notas do rodapé e as
  > listas suspensas indicam que a coluna **M** funciona como "Status" na prática, e a **K** como
  > "Estoque BRITO?"). Vale alinhar o cabeçalho real antes de automatizar o preenchimento.

- **Linhas 3–106** — área de lançamento de ferramentas.
- **Listas suspensas**:
  - Colunas **G, H(parcial), I, M** → lista de obras: `Dialogo Alvaro Ramos, Obra P.Raposo,
    JVM Casa Alba, Estoque Brito` (aplicada de forma espalhada/inconsistente em vários ranges)
  - `G12:G15`, `J12:J15`, `K3:L106` → `Sim, Não`
  - `H3:H20` → lista de fornecedores (mesma lista da outra aba)
  - `M3:M16`, `M18:M106` → `Em uso, Em estoque, Manutenção, Baixado` (confirma M = Status)
- **A110** — "Observações — Ferramentas"
- **A111:M118** (mesclada) — texto de instruções de preenchimento desta aba.

---

## Aba "Visão Geral" (dashboard — não editável manualmente)
Intervalo: `A1:R132`. Toda alimentada por fórmulas que referenciam as duas abas de cadastro.

- **A1** — título "DASHBOARD — SETOR DE COMPRAS | ESTOQUE BRITO"
- **A2** — subtítulo explicativo
- **Linha 4** — 5 cartões de indicador (KPI), rótulo na linha 4 e valor (fórmula) na linha 5:
  - A4 "VALOR TOTAL INVESTIDO" (valor em A5)
  - D4 "ITENS CADASTRADOS" (valor em D5)
  - G4 "ITENS EM ESTOQUE BRITO" (valor em G5)
  - J4 "ITENS ALOCADOS EM OBRAS" (valor em J5)
  - M4 "ITENS EM MANUTENÇÃO" (valor em M5)
- **A7** — título "🔧 ITENS EM MANUTENÇÃO AGORA" (painel dinâmico)
  - **A8** "Materiais Diversos" / **F8** "Ferramentas" (subtítulos das duas mini-tabelas)
  - **Linha 9** — cabeçalhos: A "Nº Patrimônio", B "Descrição", C "Obra Atual", D "Data de Saída"
    (repetido em F, G, H, I para a coluna de Ferramentas)
  - **Linhas 10–24** — até 15 linhas, preenchidas automaticamente por fórmula (busca itens com
    Status = "Manutenção" nas abas de cadastro)
  - **A25** — nota explicando o limite de 15 itens por aba
- **A28** — "Tabelas de apoio aos gráficos (calculadas por fórmula — não editar manualmente)"
  - **Bloco 1 (linhas 30–36)**: A30 "Localização" / B30 "Valor Total (R$)" — 3 linhas de obras
    (A31–A33) com totais em B31–B36; D30 "Categoria (Materiais)" / E30 "Quantidade" — 6 categorias
    (D31–D36) com contagem em E31–E36
  - **Bloco 2 (linhas 39–51)**: A39 "Status" / B39 "Quantidade" — 4 status (A40–A43) com contagem
    em B40–B43; D39 "AnoMes" / E39 "Mês/Ano" / F39 "Valor de Compras (R$)" — 12 linhas (D40–D51)
    com os últimos 12 meses rolantes (mês/ano calculado + total de compras do mês)
- **A54** — "Gráficos" (área onde os 4 gráficos estão ancorados, do A54 até por volta da linha 124)
  - Gráfico 1: "Valor total investido por Obra / Estoque BRITO" (barras, eixo "Localização" x "R$")
  - Gráfico 2: "Itens de Materiais Diversos por Categoria" (provavelmente pizza/rosca)
  - Gráfico 3: "Itens por Status (Materiais + Ferramentas)" (barras, "Quantidade" x "Status")
  - Gráfico 4: "Compras nos últimos 12 meses (R$)" (linha/coluna, "Mês/Ano" x "R$")
- **A125** — "Observações — Visão Geral" + texto explicativo final (linha 126)

---

## Observações gerais para quem for automatizar o preenchimento

1. **Só duas abas recebem lançamento manual de itens**: `Materiais Diversos` e `Ferramentas`.
   `Visão Geral` é 100% fórmula/gráfico e `Instruções` é só texto — nenhuma das duas deve ser
   escrita por um sistema externo.
2. Os **cabeçalhos das duas abas de cadastro não são idênticos** (nomes de coluna diferentes,
   ordem diferente, e a aba Ferramentas tem cabeçalhos truncados/repetidos). Um sistema que
   preenche ambas as abas via um único formulário/mapa de campos vai precisar de **dois mapeamentos
   separados**, não um único genérico.
3. Várias colunas dependem de **listas suspensas (data validation)** — Categoria, Obra
   (Nome da Obra / Obra Atual), Estoque BRITO?, Fornecedor e Status. Se o sistema web gerar essas
   colunas automaticamente, o ideal é restringir os valores às mesmas opções das listas para não
   quebrar a validação existente no arquivo.
4. Há **inconsistências no arquivo original** que valem confirmação com quem mantém a planilha
   antes de automatizar: cabeçalho "Quntidade" na coluna C de Materiais Diversos com validação de
   lista de categorias aplicada por engano nessa coluna; cabeçalho "QUANTIDADE COMPRAD" truncado e
   coluna "Obra Atual" duplicada na aba Ferramentas.
