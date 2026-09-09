# Auditoria Crítica: O "Advogado do Diabo" do ERP V4

Avaliando o sistema friamente, simulando um ambiente de produção pesado (múltiplas obras simultâneas, centenas de funcionários, dezenas de pedidos diários), aqui estão os **buracos, falhas operacionais e pontas soltas** atuais do projeto.

## 1. Módulo de Obras & RDO (O Coração da Construtora)
- **Sincronização Offline Incompleta (Imagens):** O banco de dados offline que criei salva textos (tarefas, clima, efetivo) quando o engenheiro está sem internet. Porém, o RDO exige FOTOS. Se ele tentar fazer upload da foto offline, o Supabase Storage vai falhar e perder a foto. Precisamos transformar imagens em `Base64` ou salvar no IndexedDB temporariamente.
- **RDO Efetivo Terceirizado:** Lançamos a aba de "Terceirizados" no RH, mas no RDO (aba Efetivo) ainda não tem como o engenheiro puxar "Empreiteira Zé do Aço - 5 pedreiros". O efetivo terceirizado ainda é lançado como texto livre ou ignorado.
- **Trigger de Sincronização:** O código do banco offline existe, mas *quem* avisa para ele tentar sincronizar? Faltou colocar um observador de rede (`window.addEventListener('online', ...)`) no `App.tsx` para rodar o `syncPendingActions()` automaticamente.
- **Gantt / Cronograma:** A tela `obra-cronograma-tab.tsx` atualmente é majoritariamente estática. Se uma atividade atrasar no RDO, o cronograma não atualiza automaticamente, matando a rastreabilidade real de prazo.

## 2. Módulo de Suprimentos & Compras
- **O Gargalo do "Gerar Boleto":** Na tela de Requisições, quando uma cotação é aprovada, há um botão "Gerar Boleto no Financeiro (Em Breve)". Hoje, a compra é aprovada, mas a conta a pagar correspondente NÃO cai automaticamente na mesa do financeiro. O compras precisa mandar uma mensagem no chat avisando.
- **Recebimento na Obra:** O Compras compra, mas como a obra dá o "Aceite"? Não há uma tela onde o almoxarife da obra diz "Recebi o Cimento Nacional, quantidade e qualidade OK". Se ele não der aceite, o financeiro não deveria pagar o boleto.
- **Estoque Cego:** O sistema avisa sobre "Estoque Crítico", mas a movimentação de estoque não está amarrada aos pedidos de compra. Ao entregar um material na obra, o estoque daquela obra deveria aumentar automaticamente.

## 3. Módulo de Patrimônio
- **Aba de Manutenção (Oficina) Fictícia:** A aba de manutenções exibe um placeholder "Em breve". Se um equipamento quebra (o que listamos na devolução), ele cai num limbo; não existe uma fila de conserto para saber quanto custou o reparo e quando ele volta à vida útil.
- **Depreciação:** Equipamentos caros perdem valor. O valor do inventário é estático, baseado apenas no valor de aquisição original. O Financeiro/Diretoria não consegue saber o valor residual da frota.

## 4. Módulo de RH & Segurança
- **Integração do Ponto com a Folha:** O apontamento de horas diárias (`obra-ponto-tab.tsx`) que fizemos foi excelente para a obra, mas o RH não tem uma tela centralizadora no painel deles (`rh.tsx`) para somar essas horas, fechar o mês e calcular as horas extras para a contabilidade.
- **Alertas de Vencimento de ASO/NR não bloqueiam:** O sistema avisa que um exame está vencido, mas não *impede* que esse funcionário seja alocado num RDO de concretagem, gerando um passivo trabalhista enorme se houver acidente.

## 5. Módulo Financeiro & Diretoria
- **Medições "Órfãs":** Quando a obra fecha uma medição, geramos um Contas a Receber simbólico (R$ 0,01) para a Diretoria dar o preço. Contudo, se a medição for reprovada pelo cliente final, não existe um fluxo de devolução para a obra refazer a medição.
- **DRE (Demonstrativo de Resultado do Exercício):** O dashboard financeiro e da diretoria mostram receitas x despesas genéricas. Não há uma visão de "Centro de Custo por Obra". A diretoria não consegue responder à pergunta mais importante: *"A Obra X está dando lucro ou prejuízo neste mês?"*
- **Aprovações Cumulativas:** Uma despesa > R$ 5.000 exige aprovação da diretoria, mas se houver 3 diretores, basta um clicar? Falta hierarquia de alçada (ex: gerente aprova até 10k, diretor até 50k).

## Resumo da Sentença
O sistema atual é um **excelente coletor de dados**, infinitamente superior a WhatsApp e planilhas. Mas ele **ainda não cruza a linha de chegada para tomar decisões sozinho**. 
As ilhas (Obras, Compras, RH, Financeiro) já se conversam via chat e algumas notificações, mas os fluxos de dinheiro, estoque e autorizações ainda dependem de "acordos de cavalheiros" (clicar em botões avulsos) em vez de restrições rígidas no banco de dados.
