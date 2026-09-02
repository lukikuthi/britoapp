# Plano do Módulo: Compras e Suprimentos

## 1. Visão Geral
Sistema focado no controle absoluto de estoque físico das obras, calibração de ferramentas, alertas de contas/boletos a vencer e mensageria direta para solicitação de aprovações com a diretoria.

## 2. Funcionalidades Principais
* **Sistema Completo de Estoque:** Controle rígido de Equipamentos, EPIs e Ferramentas (com envio de fotos), linkadas a cada Obra específica.
* **Notificação de Limite de Estoque:** Alertas automáticos na tela e push de "estoque mínimo atingido" para requisição de nova compra.
* **Avisos de Certificados de Calibração:** Cadastro de certificados com validade de 1 ano. O sistema alertará a equipe exatos 10 dias antes do vencimento para evitar multas em auditorias.
* **Alertas de Envio de Notas e Boletos:** Registro de notas recebidas pelo setor, com vencimentos prévios e disparos de alerta (por e-mail ou notificação no app) para o Financeiro e para o engenheiro da Obra.
* **Sistema de Mensagens Integradas:** Um chat/caixa de entrada onde o usuário de Compras digita alertas diretos para a Diretoria (ex: "precisa comprar cabos NU para a Obra X").

## 3. Estrutura de Banco de Dados (Tabelas Planejadas)
* `compras_estoque`: Item, tipo (EPI/Ferramenta), quantidade, limite mínimo, foto do item, obra_id.
* `compras_movimentacoes`: Histórico de entrada, saída, transferências, quem retirou.
* `compras_certificados`: item_id, numero, data_emissao, data_vencimento (calcula alerta de 10 dias).
* `compras_notas_boletos`: Fornecedor, valor, data vencimento, status, arquivo da nota.
* `compras_mensagens`: de_setor, para_setor (ex: Diretoria), texto, data, status (lido/resolvido).

## 4. Integrações e Fluxo
* Alimenta a **Diretoria** via mensagens e orçamentos.
* Envia notificações para **Obras** sobre entrega de EPIs/materiais.
* Repassa as notas para o **Financeiro** organizar as contas a pagar.
