# Mapeamento de Células — Pedido de Compra (Planilha1)

> O `.xlsx` é um ZIP com XMLs internas (`xl/worksheets/sheet1.xml`, `xl/sharedStrings.xml`,
> `xl/styles.xml` etc). Não existe "código-fonte" executável — o que importa para gerar esse
> arquivo automaticamente é a estrutura de células abaixo. Aba única: **Planilha1**, intervalo `A1:O48`.

## Cabeçalho

| Célula | Conteúdo |
|---|---|
| C1:I2 (mesclada) | Título "PEDIDO DE COMPRA" |
| D4:H4 | "OBRA: WALK BELEM" — texto fixo, editar se mudar de obra |
| **J3** | Data do pedido (preencher) |
| **J4** | Nº do Pedido (ex: "270/2026") (preencher) |
| **J5** | Nº do Orçamento (ex: "12915-BBA301") (preencher) |

## Bloco "DADOS FORNECEDOR" (linhas 6–11)

| Rótulo (fixo) | Célula do dado (preencher) |
|---|---|
| A7 Razão Social: | **B7:H7** |
| A8 Endereço: | **B8:H8** |
| I8 Bairro: | **J8** |
| A9 Município: | **B9:H9** |
| I9 Cep: | **J9** |
| A10 CNPJ: | **B10:H10** |
| I10 I.Est. | **J10** |
| A11 Telefone: | **B11:H11** |
| I11 Contato: | **J11** |

## Bloco "DADOS PARA FATURAMENTO" (linhas 12–17)
Mesmo padrão do bloco acima, deslocado 6 linhas:
Razão Social **B13**, Endereço **B14**, Município **B15**, CNPJ **B16**, Telefone **B17**;
CNO **J13**, Bairro **J14**, Cep **J15**, I.Est. **J16**, Contato **J17**.

## Bloco "DADOS PARA COBRANÇA" (linhas 18–23)
Mesmo padrão: **B19, B20, B21, B22, B23** / **J19, J20, J21, J22, J23**.

## Bloco "DADOS PARA ENTREGA" (linhas 24–28)

| Rótulo | Célula |
|---|---|
| A25 OBRA | **B25:H25** |
| I25 CNO | **J25** |
| A26 Endereço: | **B26:H26** |
| I26 Bairro: | **J26** |
| A27 Município: | **B27:H27** |
| I27 Cep: | **J27** |
| A28 Telefone: | **B28:H28** |
| I28 Contato: | **J28** |

## Tabela de Itens (linhas 30–38)

Cabeçalho fixo na linha 30: `A30=QUANT.` `B30=UNID.` `C30:H30=DESCRIÇÃO:` `I30=R$ unit.` `J30=R$ TOTAL`

**Itens são as linhas 31 a 37 (máximo 7 itens)**, cada uma com:

| Coluna | Conteúdo |
|---|---|
| A | Quantidade (número) |
| B | Unidade (ex: "CJ") |
| C:H (mesclada) | Descrição do item |
| I | Valor unitário (número) |
| J | **Fórmula**: `=I{linha}*A{linha}` (total do item — NÃO usar valor fixo) |

Linha 38:
- A38 = "Valor Seguro" (rótulo fixo)
- C29:H29 = campo "Outras Despesas:" (linha 29, ao lado de A29 "Vlr. Frete")
- I38 = "Total Geral:"
- **J38** = fórmula `=SUM(J31:J37)` — soma automática dos itens

## Rodapé (fixo, texto informativo — normalmente não muda)

- C39: Prazo de Entrega
- C40: Condições de pagamento
- A41–A45: cláusulas padrão
- A46: "Autorizo conforme condições gerais..."
- G47:J47 / G48:J48: nome do comprador e "(Assinatura e Carimbo)" — mescladas

## Observações técnicas importantes para automação

1. **Muitas células são mescladas** (merge). Ao escrever com `openpyxl`, escreva **apenas na célula
   âncora** (canto superior-esquerdo do range) — ex: escrever em `B7`, nunca em `C7` (que faz parte
   de `B7:H7`).
2. A coluna **J** (totais) contém **fórmulas**, não valores. Se o seu sistema web gerar o `.xlsx`
   programaticamente, mantenha as fórmulas (`=I31*A31`, `=SUM(J31:J37)`) em vez de gravar o resultado
   calculado — assim a planilha recalcula se algo mudar.
3. Como as fórmulas não trazem valor em cache quando escritas via biblioteca (ex: openpyxl), pode ser
   necessário recalcular o arquivo (abrir e salvar no Excel/LibreOffice) para que o valor apareça em
   leitores que só olham o cache, como o preview do próprio Excel Online às vezes exige.
4. Datas: J3 usa formato `mm-dd-yy`. Valores monetários (J31, J38) usam formato `R$ #,##0.00`.
5. Só existem 7 linhas de item (31–37). Se o pedido tiver mais itens, será necessário inserir linhas
   (o que desloca o bloco de totais/rodapé) ou usar um template com mais linhas pré-formatadas.
