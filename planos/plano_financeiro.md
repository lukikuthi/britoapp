# Plano do Módulo: Financeiro

## 1. Visão Geral
Coração financeiro da construtora. Focado em Contas a Pagar e Receber, visibilidade do dinheiro e fluxo de caixa.

## 2. Funcionalidades Principais
* **Contas a Pagar e Receber:** Cadastro manual ou automático (vindo do setor de Compras) de faturas, boletos e medições de empreiteiros. Controle de "Pago", "Atrasado", "Pendente".
* **Fluxo de Caixa:** Visão consolidada de quanto entra (Medições pagas pelos clientes) e quanto sai (Fornecedores, Folha).
* **Emissão de Notas Fiscais:** (Fase futura/Investigativa) - Estruturar campos para caso consigamos integrar com API de prefeitura/Sefaz, emitindo notas pelo próprio app. Inicialmente, fará apenas o anexo/gestão delas.
* **Conciliação Bancária:** Tela simples para bater o saldo do banco com o saldo do aplicativo, "ticando" o que já caiu na conta.

## 3. Estrutura de Banco de Dados (Tabelas Planejadas)
* `fin_contas`: tipo (Pagar/Receber), descricao, valor, vencimento, data_pagamento, status.
* `fin_fluxo`: Saldo diário ou mensal gerado por Views consolidadas.
* `fin_conciliacao`: Registros de extrato bancário importado/manual para bater com as contas.

## 4. Integrações e Fluxo
* Consome os "Boletos/Notas" lançados pelo módulo de **Compras**.
* Consome os "Boletins de Medição (BM)" aprovados nas **Obras** (Contas a Receber).
* Envia dados resumidos de Lucro/Prejuízo para a **Diretoria**.
