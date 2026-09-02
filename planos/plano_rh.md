# Plano do Módulo: Recursos Humanos (RH) e SESMT

## 1. Visão Geral
Este módulo será responsável por todo o processo de RH e segurança do trabalho (SESMT) da construtora, substituindo planilhas e centralizando o ciclo de vida do funcionário.

## 2. Funcionalidades Principais
* **Processo Admissional e Demissional:** Cadastro completo com documentos, data de admissão, cargo, salário e histórico, além de processo formal de desligamento.
* **Controle de Férias:** Cadastro de períodos aquisitivos, agendamento de férias e alertas de férias vencendo.
* **Controle de Exames Periódicos (ASO):** Registro de exames admissionais, demissionais e periódicos, com alertas de vencimento baseado no cargo/risco.
* **Gestão de NRs (Normas Regulamentadoras):** Controle estrito dos treinamentos de NR (NR-18, NR-35, etc.), com anexos de certificados e sistema de "semáforo" (verde, amarelo, vermelho) para vencimentos de reciclagens.

## 3. Estrutura de Banco de Dados (Tabelas Planejadas)
* `rh_funcionarios`: Dados pessoais, status (ativo/inativo), cargo, obra alocada.
* `rh_historico_funcional`: Registro de admissão, demissão, promoções e transferências de obra.
* `rh_ferias`: Período aquisitivo, data de início/fim, status da solicitação.
* `rh_exames`: Tipo de exame, data realização, validade, anexo do ASO.
* `rh_treinamentos_nr`: Norma (ex: NR-35), carga horária, data realização, vencimento, anexo da lista de presença/certificado.

## 4. Integrações e Fluxo
* Funcionários cadastrados aqui ficarão disponíveis no módulo de **Obras** (para apontamento no RDO/FVS) e no módulo de **Compras** (para controle de entrega de EPIs assinados por eles).
