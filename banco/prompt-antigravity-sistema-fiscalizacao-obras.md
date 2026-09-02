# PROMPT PARA O GEMINI PRO (ANTIGRAVITY) — SISTEMA DE FISCALIZAÇÃO DE OBRAS

> **INSTRUÇÃO DE USO:** Cole este prompt inteiro no Antigravity. Ele está escrito para que você (Gemini) NÃO resuma, NÃO simplifique e NÃO pule nenhuma etapa. Cada seção abaixo é uma unidade de trabalho separada. Implemente exatamente na ordem descrita, seção por seção, e só avance para a próxima quando a anterior estiver clara. Se alguma regra parecer redundante com outra, mantenha as duas mesmo assim — elas existem porque o dono do produto (engenheiro de obras, cliente final do app) repetiu a mesma regra de formas diferentes ao explicar, e isso é proposital para reforçar o comportamento esperado.

---

## 0. CONTEXTO GERAL DO PRODUTO

Você vai construir (ou evoluir) um aplicativo de **fiscalização de obras de construção civil**. O usuário final é um engenheiro civil/fiscal de obras que caminha pela construção, registra problemas ("pendências") em pontos específicos do prédio, anexa fotos, e depois consegue emitir relatórios formais no mesmo padrão de laudos técnicos de vistoria predial (como um relatório GTEC de perícia).

O sistema tem uma hierarquia física fixa que é o coração de tudo:

```
OBRA (empreendimento/construtora + nome da obra)
  └── TORRE (ex: Torre 1, Torre 2, Torre 3...)
        └── PAVIMENTO (ex: Subsolo, Térreo, 1º Pavimento, 2º Pavimento... até o último, Cobertura)
              └── AMBIENTE (ex: Portaria, Garagem, Lobby, Loja 4, Apartamento Final 1, Banheiro, Sala de Estar, Shaft...)
                    └── PENDÊNCIA (o item de fiscalização em si, com foto, descrição, status, prazo)
```

Essa hierarquia de 4 níveis (Torre → Pavimento → Ambiente → Pendência) é chamada pelo dono do produto de **"os 5 passos"**, porque o 1º passo é a tela de Obras (antes mesmo da Torre). Ou seja:

- **1º Passo = Obras** (lista de todos os empreendimentos cadastrados)
- **2º Passo = Torres** (dentro de uma obra escolhida)
- **3º Passo = Pavimentos** (dentro de uma torre escolhida, com contagem de quantidade de pavimentos)
- **4º Passo = Ambientes do Pavimento** (dentro de um pavimento escolhido, com contagem de pendências por ambiente)
- **5º Passo = Local das Pendências** (o detalhe final: o ambiente específico, a planta/mapa, e a lista de pendências daquele ambiente)

Isso está desenhado literalmente nos rascunhos do dono do produto, com essas mesmas expressões escritas à mão: "1° Passo (Obras)", "2° Passo (Torres)", "3° Passo (Pavimentos) — quantidade de pavimentos", "4° Passo (Ambientes do Pavimento)", "5° Passo (local das pendências)".

**IMPORTANTE:** implemente esses 5 passos primeiro, com profundidade total, antes de tocar em qualquer outro módulo do app (RDO, Medição, Compras, Laudos, etc.). O próprio dono do produto disse explicitamente que essas outras áreas só devem ser refinadas DEPOIS que essa estrutura de 5 passos estiver validada, porque ela "recria o banco de dados inteiro do projeto" e as outras telas dependem dela.

---

## 1. PASSO 1 — TELA DE OBRAS (tela inicial do app)

- Esta é a tela de abertura do app (aba "Início" / "Obras").
- Lista todas as obras cadastradas na plataforma (ex.: "Diálogo - Álvaro Ramos", "Diálogo - Souza Reis", "Diálogo - Pe. Raposo").
- **Convenção de nome obrigatória:** cada obra deve ser nomeada como `NOME DA CONSTRUTORA + traço + NOME DA OBRA`. Exemplo: `Diálogo - Álvaro Ramos`. Sempre inclua o nome da construtora/cliente antes do nome da obra — isso é uma regra de negócio explícita, não uma sugestão.
- Ao clicar em uma obra (ex.: "Álvaro Ramos"), o usuário entra na tela de **Visão Geral** dessa obra (ver seção 1.1 abaixo) antes de escolher a torre.
- Cada obra tem metadados básicos que devem existir no cadastro (mesmo que não apareçam todos na tela principal): cliente, endereço da obra, coordenador responsável, projetista, data de emissão.

### 1.1 Tela de "Visão Geral" da obra (aparece assim que se clica em uma obra)

- Mostra a lista de torres da obra, uma embaixo da outra (não lado a lado, e não em formato de ícone — formato de **lista**, como uma planilha vertical). O dono do produto foi explícito: "não coloca em ícone, coloca em lista" e "Torre 1 e Torre 2, um embaixo do outro".
- Para cada torre da lista, mostrar dois números lado a lado: **quantidade de pendências ABERTAS** e **quantidade de pendências RESOLVIDAS**. Exemplo de layout textual: `Torre 1 — Aberto: 100 | Resolvido: 900` e `Torre 2 — Aberto: 50 | Resolvido: 40`.
- Essa tela serve para o usuário ter uma visão macro e decidir prioridade: ex. "tenho mil pendências abertas na Torre 2 e só 100 na Torre 1, vou focar na Torre 2".
- Não é necessário mostrar "quantidade de andares" nessa tela de visão geral — o dono do produto removeu esse campo explicitamente ("acho que andares não precisa").
- Ao clicar em uma torre dessa lista, o usuário vai para o Passo 3 (Pavimentos) dessa torre.

---

## 2. PASSO 2 — ESTRUTURA/CADASTRO DE TORRES (tela administrativa, dentro de "Estrutura da Obra")

Esta é a área de cadastro/configuração (não é a área de consulta/fiscalização — é onde o admin monta a estrutura da obra antes de qualquer fiscalização acontecer).

- Cada obra pode ter **N torres** (o exemplo trabalhado tinha Torre 1 e Torre 2, mas outra obra citada, "Padre Raposo", tinha Torre 1, 2 e 3).
- Ao cadastrar uma torre nova, o sistema deve pedir o nome/número da torre (Torre 1, Torre 2...).
- **BUG CRÍTICO A EVITAR:** no protótipo testado, ao tentar adicionar uma segunda torre com pavimentos, o sistema dava erro porque tratava os pavimentos de torres diferentes como se fossem do mesmo conjunto/lista, gerando conflito. Cada torre precisa ter seu **próprio conjunto isolado de pavimentos**, sem nenhum compartilhamento de índice ou numeração com outra torre da mesma obra. Trate cada torre como uma entidade totalmente independente na modelagem de dados (chave estrangeira torre_id em todo pavimento), mesmo que pertençam à mesma obra.

---

## 3. PASSO 3 — CADASTRO E CONSULTA DE PAVIMENTOS

### 3.1 Cadastro de pavimentos (área administrativa "Estrutura da Obra")

- Dentro de uma torre, o admin adiciona pavimentos um a um (ou em lote, ver "tipo" abaixo).
- Cada pavimento tem um **tipo/categoria**, que deve ser um campo de seleção (dropdown) com pelo menos estas opções, todas citadas explicitamente pelo dono do produto:
  - Subsolo
  - Garagem
  - Térreo
  - Mezanino
  - Área Técnica
  - Tipo (pavimento-tipo, ou seja, pavimento repetido/padrão — ver 3.2)
  - Cobertura
- Cada pavimento tem um **número/ordem** (ex: 1º pavimento, 2º pavimento, 3º pavimento etc.), sequencial dentro da torre.
- Uma torre pode ter dezenas de pavimentos "tipo" idênticos em layout — o exemplo real chegava a **26 pavimentos** em uma torre.
- **Diferença semântica importante que deve existir no sistema:** "sub" é pavimento abaixo do nível da rua (subsolo), "sobre" é pavimento acima do nível da rua. Uma torre pode não ter nenhum subsolo e começar direto no Térreo, subindo (1º, 2º, 3º pavimento...) — o sistema não pode obrigar a existência de subsolo.

### 3.2 Pavimento "Tipo" (pavimento repetido) — funcionalidade de replicação

- Quando um pavimento é marcado como "Tipo", significa que ele tem o **mesmo layout físico/planta** que vários outros pavimentos da torre (ex: do 5º ao 26º pavimento, todos com a mesma planta de apartamentos).
- **Requisito de produto explícito:** o sistema deve permitir inserir a planta/layout do pavimento **uma única vez** e replicar essa estrutura de ambientes (não as pendências, só a estrutura/layout/lista de ambientes) para todos os pavimentos marcados como do mesmo "tipo". Isso economiza o trabalho de recadastrar a mesma planta e os mesmos ambientes 20+ vezes.
- Áreas comuns (térreo, garagem, cobertura) NÃO entram nessa replicação — elas são sempre únicas e devem ser cadastradas manualmente, pavimento por pavimento, porque cada uma tem um layout diferente. O dono do produto foi explícito: "agora a área comum é mais difícil, porque são específicos, não é igual".
- Mesmo com o layout replicado entre pavimentos "tipo", as **pendências de cada pavimento são completamente independentes** — uma pendência criada no 10º pavimento não aparece no 11º, mesmo que o layout seja idêntico.

### 3.3 Tela de consulta de pavimentos (Passo 3 para o usuário fiscal, depois de escolher a torre)

- Ao clicar numa torre (vindo da tela de Visão Geral), abre a lista de pavimentos daquela torre.
- Cada pavimento da lista mostra a contagem de pendências **abertas** e **resolvidas** daquele pavimento especificamente (mesmo padrão de exibição do Passo 1.1, só que agora por pavimento em vez de por torre).
- Essa tela deve deixar claro, olhando de cima a baixo: quantidade total de pavimentos daquela torre + pendências por pavimento.
- Ao clicar em um pavimento, avança para o Passo 4 (Ambientes daquele pavimento).

---

## 4. PASSO 4 — AMBIENTES DO PAVIMENTO

### 4.1 Conceito de Ambiente

- "Ambiente" é qualquer espaço fisicamente distinto dentro de um pavimento. Exemplos reais citados pelo dono do produto, que devem servir de referência para o cadastro (não é uma lista fechada, é só para você entender a granularidade esperada):
  - Portaria
  - Garagem (com sub-detalhamento de vagas/circulação de veículos)
  - Lobby / Hall de entrada (definido como "área comum")
  - Loja (numeradas: Loja 1, Loja 2, Loja 3, Loja 4...)
  - Entrada
  - Jardim externo (o dono do produto disse que, por ser difícil de detalhar, pode entrar dentro de "Área Comum" ao invés de virar um ambiente próprio — dê essa opção de agrupamento no cadastro)
  - Mini mercado / Mini Mart
  - Elevadores
  - Sala técnica / sala de espera (com mobiliário, ex: sofá — diferente do lobby)
  - Medidores (de cada torre)
  - Sala de quadros (elétricos)
  - Depósito de manutenção
  - Escadaria
  - Reservatório inferior
  - Entrada de energia
  - Área técnica
  - Shaft
  - Sala pressurizada
  - Corredor
  - Recuo
  - Apartamento (com sub-ambientes internos: Sala de Estar, Sala de Jantar, Quarto, Suíte, Banheiro, Cozinha, Área de Serviço, Terraço — podendo ser "Terraço Íntimo", que fica ligado à suíte, ou "Terraço Social/Dormitório", que fica ligado à sala)
- Cada ambiente pertence a exatamente um pavimento, que pertence a exatamente uma torre.

### 4.2 Numeração de apartamentos por "Final"

- Em pavimentos do tipo apartamento, cada unidade é identificada por um número chamado **"Final"** (Final 1, Final 2, Final 3... até o número total de apartamentos por andar daquela torre).
- A quantidade de "finais" por andar **varia por torre e por obra**, e deve ser um campo configurável no cadastro da torre, não um valor fixo no sistema. Exemplos reais citados:
  - Obra "Álvaro Ramos", Torre 2: 12 apartamentos por andar (Final 1 a Final 12).
  - Obra "Álvaro Ramos", Torre 1: 8 apartamentos por andar.
  - Obra "Padre Raposo", Torre 1: 4 apartamentos por andar.
  - Obra "Padre Raposo", Torre 2: 2 apartamentos por andar.
  - Obra "Padre Raposo", Torre 3: 21 apartamentos por andar.
- O mesmo "Final" (ex: Final 1) se repete em todos os pavimentos-tipo daquela torre, representando sempre a mesma posição vertical na planta (o mesmo apartamento "empilhado"), mesmo que o número real do apartamento mude por pavimento (ex: apartamento 161 no 16º pavimento é "Final 1"; apartamento 171 no 17º pavimento também é "Final 1", seguindo o padrão [nº do pavimento] + [nº do final]).

### 4.3 Tela de consulta de ambientes (Passo 4 para o usuário fiscal)

- Ao clicar em um pavimento (vindo da tela de pavimentos), abre a lista de ambientes daquele pavimento específico.
- Cada ambiente da lista mostra a contagem de pendências daquele ambiente (não precisa necessariamente abrir os 12 apartamentos individualmente na tela — pode agrupar por "apartamentos" e depois detalhar por Final ao clicar).
- Layout de tela sugerido pelo próprio dono do produto: dividir a tela em **duas colunas** — de um lado a lista de ambientes/pavimentos, do outro lado, "de frente", a lista de apontamentos/pendências daquele item selecionado. Ou seja, ao selecionar um ambiente na coluna esquerda, a coluna direita atualiza mostrando as pendências daquele ambiente.
- Ao clicar em um ambiente (ou em um "Final" específico de apartamento), avança para o Passo 5 (o detalhe final, com a planta e as pendências).

---

## 5. PASSO 5 — LOCAL DAS PENDÊNCIAS (a tela final, o coração do app)

Esta é a tela mais detalhada e mais importante do fluxo. É aqui que o fiscal efetivamente registra e consulta os problemas da obra.

### 5.1 Planta/mapa do ambiente

- Cada ambiente (ou pavimento inteiro, se fizer mais sentido para o caso) deve permitir o upload de uma **imagem da planta baixa** (mapa/layout) daquele espaço.
- Sobre essa imagem, o sistema deve permitir **marcar pontos (pins) diretamente na planta**, indicando a localização exata da pendência dentro do ambiente — exatamente como no exemplo de referência (um relatório de perícia da GTEC) que o dono do produto mostrou, onde cada pendência tinha um número (ex: "42,91") com uma linha/seta apontando para o local exato na planta.
- Ao clicar em um pino/marcação na planta, deve abrir o detalhe daquela pendência específica.
- Para pavimentos-tipo, a planta pode ser reaproveitada (ver seção 3.2), mas os pinos/marcações de pendência são exclusivos de cada pavimento.

### 5.2 Estrutura de dados de uma Pendência (campos obrigatórios)

Cada pendência precisa conter, sem exceção, todos os campos abaixo:

1. **Código/identificador único** da pendência (o exemplo de referência usava um número tipo "42,91").
2. **Localização hierárquica textual**, derivada automaticamente da hierarquia Torre > Pavimento > Ambiente (ex.: "Subsolo 01 > Instalações Elétricas > Sistemas de Automação > Caixinhas e Quadros"). Isso deve ser gerado pelo sistema com base em onde a pendência foi criada, não digitado manualmente pelo usuário toda vez.
3. **Descrição do problema**, texto livre (ex.: "Luminária desligada. Ligar todas as luminárias.").
4. **Foto obrigatória no momento da criação.** Sem foto anexada, a pendência não pode ser salva/criada. Essa é uma regra dura de negócio.
5. **Status**, com no mínimo estes três estados e suas cores correspondentes:
   - **Aberta / Em aberto** — cor **amarela**, no momento da criação.
   - **Vencida / Atrasada** — cor **vermelha**, quando o prazo (ver item 7) expira sem solução.
   - **Resolvida / Concluída** — cor **verde**, quando a correção foi confirmada.
6. **Data de criação** da pendência (registrada automaticamente).
7. **Prazo de correção**: **5 dias corridos** a partir da data de criação, por padrão fixo do negócio (o dono do produto foi explícito: "sempre cinco dias, que é tempo mais do que suficiente para o encarregado conferir"). Depois desses 5 dias sem solução, o status muda automaticamente de amarelo para vermelho.
8. **Login/usuário responsável** por quem criou a pendência.
9. **Processo de baixa (fechamento) da pendência**:
   - Só pode ser fechada mediante o anexo de **nova foto comprovando a solução** ("sem foto não tem baixa").
   - O usuário precisa marcar explicitamente como "executado" ao anexar a foto de solução.
   - **Data de baixa/resolução**, registrada automaticamente no momento do fechamento.
   - **Login/usuário responsável** por quem deu baixa na pendência (pode ser diferente de quem criou).
10. Deve ser possível também que o próprio time de obra (perfil de acesso diferente, "acesso da obra") crie pendências e já suba a foto de execução, não só o fiscal que está auditando — ou seja, o sistema precisa ter pelo menos dois perfis de usuário com permissão de criar/fechar pendências: o **Fiscal/Auditor** (quem normalmente cria as pendências ao inspecionar) e a **Obra/Execução** (quem recebe a pendência e resolve, podendo também criar pendências próprias quando identifica algo).

### 5.3 Função de auditoria indireta do fiscal/estagiário

- Um objetivo explícito do dono do produto é conseguir saber, à distância, se o funcionário que deveria estar fiscalizando a obra presencialmente está realmente indo lá ou não. Se o fiscal/estagiário abrir o aplicativo, for a um pavimento específico e não houver nenhuma pendência nova ou foto registrada naquele dia/visita, o gestor consegue perceber que a visita não aconteceu de fato (porque normalmente sempre há algo a apontar).
- Não é necessário criar uma feature específica de "check-in de visita" para isso agora — apenas garanta que os timestamps de criação de pendência e de foto fiquem bem registrados e visíveis por pavimento, para permitir essa auditoria manual pelo gestor.

---

## 6. GERAÇÃO DE RELATÓRIO (exportação em PDF)

- O sistema deve permitir emitir um **relatório de vistoria em PDF**, seguindo a mesma estrutura hierárquica Torre > Pavimento > Ambiente > Pendência.
- O relatório deve ser inspirado no modelo de referência mostrado (relatório de perícia GTEC), contendo por cada pendência: número/código, localização, planta com a marcação/pino do local exato, foto do problema, descrição do apontamento.
- Deve ser possível emitir o relatório filtrando por torre, por pavimento, ou pela obra inteira.
- Essa função de exportação pode ser desenvolvida depois que a estrutura de dados dos 5 passos estiver validada e populada com dados reais — mas a modelagem de dados de pendência (seção 5.2) já precisa nascer pensando em suportar essa exportação (ou seja, guarde tudo que o relatório final vai precisar: fotos em alta resolução, coordenadas do pino na planta, texto completo da descrição).

---

## 7. MÓDULOS EXISTENTES QUE NÃO DEVEM SER ALTERADOS AGORA (mas devem ser respeitados na arquitetura)

O dono do produto foi explícito que estes módulos **já existem** no aplicativo e **não devem ser modificados neste momento** — a prioridade total agora é construir os 5 passos acima. Liste-os apenas para você (Gemini) saber que eles existem e não deve conflitar com eles ao mexer no banco de dados:

- **Medição**: módulo de planilha de medição de obra, com opção de importar planilha, limpar dados e adicionar manualmente. Não mexer.
- **RDO (Relatório Diário de Obra)** e **Relatório Semanal**: já existem. Regra de negócio importante para o futuro (não implementar agora, só ter em mente): o relatório semanal só pode ser emitido quando todos os dias da semana tiverem RDOs completos, e esses RDOs devem estar sincronizados/atualizados com o status das pendências (para also refletir se novas pendências foram criadas ou resolvidas na semana). Campos como "condição climática" foram descartados explicitamente pelo dono do produto para essa integração — não é necessário incluir esse campo na integração entre RDO e pendências.
- **Plantas e Apontamentos**: essa aba não deve ser um item de menu separado e independente — ela deve funcionar como um **gancho/atalho** que leva direto para dentro do fluxo do Passo 5 (pendências com planta e foto). Ou seja, não crie uma tela solta de "plantas"; a planta é parte do ambiente/pendência, como já descrito na seção 5.1.
- **Fotos**: não deve existir uma aba separada e solta de "fotos" com título e descrição — isso foi decidido explicitamente para ser **absorvido dentro da criação de pendência (apontamento)** e não mais existir como funcionalidade isolada. Remova/oculte qualquer tela de "Fotos" que exista solta hoje.

---

## 8. MÓDULOS FUTUROS (fora do escopo desta etapa — apenas documentar, NÃO implementar agora)

Estes módulos foram citados na conversa mas o próprio dono do produto decidiu adiá-los para depois que os 5 passos estiverem prontos. Documente-os no seu planejamento arquitetural (para não bloquear o desenho do banco de dados no futuro), mas **não construa telas ou lógica para eles nesta etapa**:

- **Setor de Compras**: vai conter a requisição de materiais (com campo de prioridade e o que precisa do material), controle de segurança do trabalho e EPI, e disponibilização de material/equipamento. Isso é um "nicho" totalmente separado do fluxo de fiscalização de obra e deve, no futuro, virar seu próprio módulo/setor dentro do app, fora da hierarquia Torre > Pavimento > Ambiente.
- **Laudos**: relatórios técnicos de perícia mais complexos, usados apenas pelo engenheiro (o próprio dono do produto, ou o engenheiro da construtora). A ideia futura é disponibilizar os laudos vinculados a cada obra, para que quem acessa aquela obra também tenha acesso aos laudos dela. Não desenvolver a lógica de criação de laudos agora, apenas prever que, no futuro, cada "Obra" (Passo 1) vai ganhar uma sub-área de "Laudos".

---

## 9. RESUMO DA ORDEM DE EXECUÇÃO (checklist para você seguir literalmente, na ordem)

1. Modelar o banco de dados com a hierarquia: Obra → Torre → Pavimento → Ambiente → Pendência, com torre_id, pavimento_id e ambiente_id como chaves estrangeiras isoladas por torre (corrigindo o bug de conflito entre torres descrito na seção 2).
2. Construir a tela "Obras" (Passo 1) como tela inicial do app, com nomenclatura "Construtora - Nome da Obra".
3. Construir a tela de "Visão Geral" da obra, com lista de torres (uma embaixo da outra) e contagem de pendências abertas/resolvidas por torre.
4. Construir o cadastro administrativo de Torres e Pavimentos (Passo 2 e 3), incluindo o campo "tipo de pavimento" (Subsolo, Garagem, Térreo, Mezanino, Área Técnica, Tipo, Cobertura) e a funcionalidade de replicação de layout para pavimentos "Tipo" (seção 3.2).
5. Construir a tela de consulta de Pavimentos por torre (Passo 3, visão do usuário fiscal), com contagem de pendências por pavimento.
6. Construir o cadastro e a tela de consulta de Ambientes por pavimento (Passo 4), incluindo a lógica de "Final" para apartamentos (com quantidade de finais configurável por torre — seção 4.2).
7. Construir a tela de Local das Pendências (Passo 5): upload de planta, marcação de pino na planta, e o CRUD completo de pendência com todos os 10 campos obrigatórios da seção 5.2 (incluindo a regra dura de foto obrigatória para criar e para fechar, o prazo de 5 dias com mudança automática de cor, e os dois perfis de usuário).
8. Só depois de tudo isso validado com dados reais de uma obra de teste, implementar a exportação de relatório em PDF (seção 6).
9. Não tocar nos módulos existentes da seção 7, exceto para absorver a aba de "Fotos" dentro do fluxo de pendências e transformar "Plantas e Apontamentos" num atalho para dentro do Passo 5.
10. Não implementar nada da seção 8 (Compras, Laudos) nesta etapa — apenas deixe a arquitetura do banco de dados aberta para que essas áreas possam ser plugadas depois sem quebrar a hierarquia de Obra/Torre/Pavimento/Ambiente/Pendência.

**Não resuma nenhuma das seções acima ao implementar. Trate cada uma como um requisito literal e obrigatório.**
