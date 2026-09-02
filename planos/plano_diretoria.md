# Plano do Módulo: Diretoria

## 1. Visão Geral
Módulo gerencial de alto nível. O administrador tem visão panorâmica de todos os setores e recebe os "gargalos" sem precisar entrar no detalhe do operacional (a menos que queira).

## 2. Funcionalidades Principais
* **Acesso a Tudo (Onisciente):** A barra lateral já garante que o Diretor entre em Obras, Compras, RH e Financeiro.
* **Dashboard Global:** Painel principal agregando:
  * Status físico das obras (avanço das medições).
  * Status financeiro (Lucro, Contas em atraso).
  * Status de RH (Funcionários críticos sem ASO).
* **Caixa de Decisão (Aprovações):** Tela específica onde caem as "Notificações" e "Mensagens" do setor de Compras solicitando compra de insumos grandes ou avisando de limites de estoque, permitindo dar o "De Acordo".

## 3. Estrutura de Banco de Dados (Tabelas Planejadas)
Não possui tabelas primárias pesadas. É primariamente construído através de *Queries* (consultas) e *Views* no banco de dados que varrem:
* `compras_mensagens` (Ler o que foi mandado para a diretoria).
* `fin_contas` (Agrupar totais a pagar e receber).
* `obras` (Percentual de conclusão).

## 4. Integrações e Fluxo
* É o ponto final de todos os relatórios gerados por **RH, Compras, Financeiro e Obras**.
