# PLANO PARA AGENTE DE CÓDIGO (Antigravity + Claude)
## Substituição completa do módulo RDO por "Apontamentos Visuais em Planta"

> Este documento é um plano de execução, **não contém implementação**.
> O agente deve ler cada fase, procurar os arquivos indicados no repositório real,
> confirmar que o que está descrito aqui bate com o código, e só então executar.
> Se algo divergir do `PROJETO.md`, o agente deve parar e reportar a divergência
> antes de prosseguir.

---

## 0. Contexto (resumo do sistema atual, para o agente não perder o fio)

Stack: TanStack Start + TanStack Router + TanStack Query + Supabase (Postgres/Auth/Storage/RLS) +
React 19 + Tailwind v4 + jsPDF + idb (offline-first).

O sistema atual gira em torno do **RDO** (Relatório Diário de Obra): um registro por dia por obra,
com 10 seções filhas (clima, mão de obra, equipamentos, atividades, ocorrências, materiais, EPI,
comentários, mídias, anexos, assinaturas), aprovação por admin, PDF de até 4 páginas, e modo offline.

A nova ideia **não é um RDO diário**. É um sistema de **apontamentos espaciais**: o engenheiro/cliente
abre a planta-baixa de um andar específico de uma torre específica, e marca pontos (pins) diretamente
sobre a imagem, com descrição. O relatório final baixa todas as plantas (mesmo as sem alteração) com
os pins sobrepostos.

---

## 1. ENTENDIMENTO DO SISTEMA ATUAL — Módulo RDO e suas dependências

### 1.1 O que o agente deve procurar no repositório

Confirmar a existência e ler o conteúdo real de (baseado em `PROJETO.md`):

**Banco de dados (SQL)**
- `schema.sql` — procurar os blocos: ENUM `rdo_status`, tabela `rdos` e todas as tabelas filhas
  (`rdo_clima`, `rdo_mao_de_obra`, `rdo_equipamentos`, `rdo_atividades`, `rdo_ocorrencias`,
  `rdo_materiais`, `rdo_checklist_epi`, `rdo_comentarios`, `rdo_midias`, `rdo_anexos`,
  `rdo_assinatura`), trigger `set_rdo_numero_sequencial()`, trigger `trg_audit_rdos`,
  policies RLS de todas as tabelas `rdo_*`.
- `schema-fixes.sql` — verificar se referencia buckets/policies de `rdo-midias` ou `rdo-anexos`.
- `BANCO.md` — conferir se documenta as tabelas `rdo_*` (ajustar depois de remover).

**Frontend / rotas**
- `src/routes/_authenticated/obras.$obraId.rdos.$rdoId.tsx` (editor de RDO — provável arquivo raiz do módulo)
- `src/routes/_authenticated/obras.$obraId.filtro.$tipo.tsx` (filtro cross-RDO)
- `src/routes/_authenticated/obras.$obraId.tsx` (tabs — localizar a tab "relatorios" que lista RDOs)
- `src/routes/_authenticated/dashboard.tsx` (lista "RDOs do dia")

**Componentes**
- `src/components/rdo-sections.tsx` (`RdoSection<T>` genérico + `MaoObraForm`, `EquipamentoForm`,
  `AtividadeForm`, `OcorrenciaForm`, `MaterialForm`, `EpiForm`, `ComentarioForm`)
- Qualquer componente de assinatura (`react-signature-canvas`) usado só dentro do RDO

**Lib / geração de PDF**
- `src/lib/pdf-generator.ts` (`generateRdoPdf`, `generateConsolidatedPdf`)
- `src/lib/pdf-image-utils.ts` — **atenção**: é compartilhado com `fotografia-pdf-generator.ts`.
  Não remover, apenas parar de importar as funções específicas de RDO.

**Offline**
- `src/lib/offline-db.ts` — store `offlineRdos` e chaves `{table}:{rdoId}:{timestamp}` que
  referenciam tabelas `rdo_*`
- `src/lib/supabase-offline-wrapper.ts` — usos de `offlineSafeInsert/Update/Delete` apontando
  para tabelas `rdo_*`
- `src/hooks/use-offline-sync.ts` — verificar se tem lógica hardcoded de nomes de tabela `rdo_*`

**Hooks de dados** (prováveis, confirmar nomes reais no repo)
- `use-rdo.ts` / `use-rdos.ts` ou equivalentes com queries React Query para as tabelas `rdo_*`

**Storage**
- Bucket `rdo-midias` (fotos/vídeos do RDO) e `rdo-anexos` (documentos do RDO) — **atenção**:
  `rdo-anexos` também é usado por `obra_documentos` (path `{obra_id}/documentos/...`), então o
  bucket **não pode ser apagado inteiro**, só o subcaminho de RDO.

### 1.2 Dependências a mapear (checklist do agente)

| Dependência | Tipo | Ação de mapeamento |
|---|---|---|
| Tabelas `rdo_*` | Banco | Listar todas as FKs que apontam para `rdos.id` |
| RLS policies `rdo_*` | Banco | Listar policies antes de dropar tabelas |
| Trigger `set_rdo_numero_sequencial` | Banco | Confirmar que só afeta `rdos` |
| Trigger `trg_audit_rdos` + `audit_log` | Banco | **`audit_log` é genérico, não remover a tabela**, só o trigger específico de `rdos` |
| Storage `rdo-midias`, `rdo-anexos` | Storage | Separar uso exclusivo de RDO do uso compartilhado com `obra_documentos` |
| Rotas `obras.$obraId.rdos.$rdoId`, `.filtro.$tipo` | Frontend | Listar links/`<Link to=...>` que apontam para essas rotas em todo o app |
| Tab "relatorios" em `obras.$obraId.tsx` | Frontend | Localizar `?tab=relatorios` e o componente renderizado |
| `pdf-generator.ts` (funções RDO) | Frontend/lib | Separar do resto do arquivo (que pode ter utilidades genéricas) |
| `offline-db.ts` store `offlineRdos` | Offline | Nova versão do IndexedDB precisa migrar/limpar esse store |
| Hooks React Query de RDO | Frontend | Listar todos os `queryKey: ["rdo", ...]` para invalidar/remover |
| Dashboard — card "RDOs do dia" | Frontend | Substituir pelo novo indicador (ex: "Apontamentos pendentes") |
| RBAC (`has_role`, `can_edit_obra`, `has_obra_access`) | Banco | **Não remover.** Serão reaproveitadas pelo novo módulo |

### 1.3 Impacto esperado da remoção

- **Não afeta**: autenticação (`use-auth.tsx`), `obras`, `obra_usuarios`, `obra_documentos`,
  `obra_fotografia_itens`, RBAC, `audit_log` (tabela), Storage bucket `obra-capas`, design system,
  PWA, splash screen.
- **Afeta diretamente**: dashboard (contador/listagem), tabs de `obras.$obraId.tsx`, bottom nav
  (`obra-bottom-nav.tsx` — confirmar se uma das 4 abas é "Relatórios"/RDO), geração de PDF,
  offline sync.
- **Risco principal**: se `pdf-image-utils.ts` ou `audit_log` forem removidos por engano, quebra
  a galeria de fotos (`fotografia-pdf-generator.ts`) e o audit trail geral do sistema.

---

## 2. ENTENDIMENTO DA NOVA IDEIA — "Apontamentos Visuais em Planta"

Interpretação funcional, com base no texto e nos 3 rascunhos enviados:

1. **Estrutura física da obra é cadastrada de forma hierárquica**: Obra → Torres → Andares (pavimentos)
   → Planta-baixa (imagem). O usuário que cadastra a obra escolhe quantas torres existem e quantos
   andares cada torre tem (rascunho 2: "TORRE 1", "TORRE 2", "você escolhe quantos a torre terá").
2. **Andares podem compartilhar a mesma planta**: o rascunho 2 mostra "arquivos por pavimento" e
   "casa bloco é um banco diferente" — ou seja, cada *grupo* de andares com a mesma planta é um
   registro (linha) separado, e um grupo pode cobrir vários andares (ex: andares 5 a 12 usam a
   mesma planta-tipo).
3. **Mapa visual da obra**: ao abrir uma obra, o usuário vê um "esquema vertical" (rascunho 1) —
   dois blocos representando as torres, divididos em retângulos (andares). Cada retângulo é um
   **botão** clicável.
4. **Ao clicar num andar**, abre a planta-baixa daquele andar em tela cheia, com zoom/pan.
5. **Apontamento**: o usuário clica num ponto da planta → aparece um ícone de círculo naquele
   ponto → um formulário pede a descrição → ao salvar, o pin fica gravado com sua posição (x,y
   relativos à imagem) e a descrição.
6. **Indicadores visuais no mapa**: os círculos vermelhos no rascunho 1 sugerem que andares com
   apontamentos pendentes/recentes ficam sinalizados no mapa geral (torre → andar), permitindo
   identificar rapidamente onde há pendências sem entrar em cada andar.
7. **Relatório/Download**: ao gerar o relatório da obra, o sistema baixa (PDF ou pacote de imagens)
   **todas** as plantas de todos os andares — inclusive as que não tiveram nenhum apontamento —
   com os ícones de comentário sobrepostos e uma legenda numerada com as descrições (rascunho 3:
   layout com legenda numerada "1", "2" ao lado da planta).
8. **Cadastro da obra fica mais rico e visual**: em vez de um formulário genérico, o cadastro passa
   a ter uma seção estruturada "como um engenheiro descrevendo o prédio": número de torres,
   quantidade de andares por torre, quais andares são garagem, até onde vai a garagem, se tem
   cobertura/penthouse, etc. Essas informações alimentam diretamente o mapa visual (item 3) — ou
   seja, **não existe formulário solto**: tudo que é cadastrado vira um elemento clicável no mapa.
9. **Navegação sempre contextual**: ao clicar em um andar, o usuário só vê as informações daquele
   andar (planta, apontamentos daquele andar) — nunca uma tela com tudo misturado.

### 2.1 Componentes lógicos do novo sistema

| Componente lógico | Responsabilidade |
|---|---|
| **Cadastro Estrutural da Obra** | Wizard/formulário para definir torres, quantidade de andares por torre, tipo de cada andar (garagem, térreo, tipo, cobertura/penthouse), upload da planta por grupo de andares |
| **Mapa da Obra (visão vertical)** | Renderiza torres como colunas de retângulos (andares); cada retângulo é um botão; sinaliza andares com apontamentos pendentes |
| **Visualizador de Planta-Baixa** | Exibe a imagem da planta com zoom/pan; permite clicar para criar pin; lista os pins existentes |
| **Apontamento (Pin)** | Ponto x/y sobre a imagem + descrição + autor + data + (opcional) status |
| **Gerador de Relatório de Apontamentos** | Substitui `pdf-generator.ts`: monta PDF/pacote com todas as plantas + pins sobrepostos + legenda |
| **Indicador de pendências** | Contagem de apontamentos abertos por andar/torre/obra, exibido no dashboard e no mapa |

---

## FASE 1 — Análise do código atual (o agente executa antes de tocar em qualquer coisa)

1. Abrir `schema.sql` e extrair, na íntegra, os blocos `CREATE TABLE` de: `rdos` e todas as
   `rdo_*`; anotar todas as `FOREIGN KEY` e `CREATE POLICY` associadas.
2. Abrir `schema-fotografia.sql` e `schema-fixes.sql` e confirmar que **nenhuma** delas depende de
   tabelas `rdo_*` (se depender, registrar isso como bloqueio antes de seguir).
3. Rodar uma busca textual no repositório inteiro por `rdo` (case-insensitive) para listar:
   - todos os arquivos `.ts`/`.tsx` que importam de `rdo-sections.tsx`, `pdf-generator.ts`
   - todas as rotas que contêm `rdos` no path
   - todos os `queryKey` do React Query que começam com `"rdo"`
   - todos os `storage_path`/bucket references a `rdo-midias` e `rdo-anexos`
4. Gerar uma lista consolidada (arquivo `RELATORIO-DEPENDENCIAS-RDO.md`) com: arquivo, tipo de
   dependência, se é exclusivo do RDO ou compartilhado.
5. **Checkpoint obrigatório**: não seguir para a Fase 2 sem esse relatório revisado.

---

## FASE 2 — Remoção segura do RDO

### O que deve ser removido

**Banco (via nova migration, nunca editando `schema.sql` retroativamente em produção)**
- Tabelas: `rdo_clima`, `rdo_mao_de_obra`, `rdo_equipamentos`, `rdo_atividades`,
  `rdo_ocorrencias`, `rdo_materiais`, `rdo_checklist_epi`, `rdo_comentarios`, `rdo_midias`,
  `rdo_anexos`, `rdo_assinatura`, e por último `rdos`.
- Trigger `set_rdo_numero_sequencial` e `trg_audit_rdos`.
- ENUM `rdo_status` (só depois que a coluna que o usa for removida).
- Policies RLS específicas de cada tabela `rdo_*` (dropadas junto com a tabela).
- Templates `templates_tarefas`, `templates_mao_de_obra`, `templates_equipamentos` **somente se**
  confirmado que são usados exclusivamente pelo RDO (checar Fase 1).

**Frontend**
- `src/routes/_authenticated/obras.$obraId.rdos.$rdoId.tsx`
- `src/routes/_authenticated/obras.$obraId.filtro.$tipo.tsx`
- `src/components/rdo-sections.tsx`
- Funções `generateRdoPdf` e `generateConsolidatedPdf` em `pdf-generator.ts` (remover só essas
  funções se o arquivo tiver outras utilidades compartilhadas; caso contrário remover o arquivo)
- Tab "relatorios"/RDO dentro de `obras.$obraId.tsx`
- Item correspondente em `obra-bottom-nav.tsx`
- Card/listagem "RDOs do dia" em `dashboard.tsx`
- Hooks React Query específicos de RDO
- Store `offlineRdos` em `offline-db.ts` (remover apenas após confirmar que não há
  operações pendentes de sincronizar em produção — ver Fase 5)

### O que NÃO deve ser tocado

- `profiles`, `user_roles`, `obras`, `obra_usuarios`, `obra_documentos`, `obra_fotografia_itens`
- `audit_log` (tabela — só remover o trigger específico de `rdos`)
- Funções RBAC: `has_role`, `is_admin`, `get_user_role`, `has_obra_access`, `can_edit_obra`
- Buckets `obra-capas` inteiro; e dentro de `rdo-anexos`, o subcaminho `{obra_id}/documentos/...`
  usado por `obra_documentos`
- `pdf-image-utils.ts` (compartilhado com fotografia)
- `fotografia-pdf-generator.ts`, `obra-fotografia-tab.tsx`
- `use-auth.tsx`, `AppLoadingScreen`, design system (`styles.css`), PWA/manifest
- `use-offline-sync.ts` na sua estrutura geral (apenas remover referências pontuais a `rdo_*`)

### Ordem segura de remoção

1. Congelar criação de novos RDOs na UI (feature flag ou remover botão "Novo RDO") — sem apagar nada ainda.
2. Exportar/backup de todos os dados de `rdos` e tabelas filhas (dump SQL) antes de qualquer DROP.
3. Remover triggers (`set_rdo_numero_sequencial`, `trg_audit_rdos`) — nada depende deles fora do RDO.
4. Remover as tabelas filhas de `rdo_*` (ordem inversa das FKs: primeiro as que referenciam `rdos.id`).
5. Remover a tabela `rdos`.
6. Remover o ENUM `rdo_status` (e demais ENUMs exclusivos, se confirmado na Fase 1).
7. Remover policies de Storage exclusivas de RDO; ajustar policies de `rdo-anexos` para manter
   apenas o caminho de `obra_documentos`.
8. Remover rotas e componentes de frontend (na ordem: rotas → componentes → hooks → lib de PDF).
9. Ajustar `dashboard.tsx`, `obra-bottom-nav.tsx`, `obras.$obraId.tsx` (tabs) por último, pois
   dependem de tudo acima já estar limpo para não quebrar imports.
10. Rodar `npm run build` para garantir zero erros de import quebrado antes de seguir para a Fase 3.

---

## FASE 3 — Criação do novo sistema ("Apontamentos Visuais em Planta")

> Nomenclatura sugerida em português, seguindo o padrão já usado no projeto (`obra_*`, `rdo_*`).

### Módulos/entidades de dados necessárias (proposta, a validar com o schema real)

```
obras
  |
  +-- obra_torres              (id, obra_id, nome, ordem)
        |
        +-- torre_grupos_andar (id, torre_id, nome_grupo, andar_inicial, andar_final,
        |                       tipo_andar [garagem|terreo|tipo|cobertura|comercial...],
        |                       planta_storage_path)
        |
        +-- torre_andares       (id, torre_id, grupo_id, numero_andar, apelido)
                |
                +-- apontamentos (id, andar_id, pos_x, pos_y, descricao,
                                   autor_id, status [aberto|resolvido], created_at)
                        |
                        +-- apontamento_midias (opcional: anexos extras ao pin)
```

Racional:
- `obra_torres`: cada obra pode ter N torres (rascunho 2 mostra "você escolhe quantos a torre terá").
- `torre_grupos_andar`: representa o "banco/arquivo por pavimento" do rascunho 2 — um grupo de
  andares consecutivos que compartilham a mesma planta-baixa e o mesmo tipo. Evita subir a mesma
  imagem várias vezes.
- `torre_andares`: um registro por andar individual (permite marcar pendências andar a andar no
  mapa, mesmo que várias divisões compartilhem planta).
- `apontamentos`: os pins. Coordenadas `pos_x`/`pos_y` guardadas como **percentual (0–1)** da
  imagem, não pixel absoluto — assim funciona independente da resolução em que foi renderizada.
- `status` no apontamento permite o indicador de "pendente" visto nos círculos vermelhos do rascunho 1.

### Storage

- Novo bucket: `plantas-baixa`, path pattern `{obra_id}/{torre_id}/{grupo_id}.ext`.
- Reaproveitar o padrão de compressão já existente (`browser-image-compression`) antes do upload.

### Estrutura de pastas sugerida (frontend)

```
src/routes/_authenticated/
├── obras.$obraId.estrutura.tsx        # cadastro/edição da estrutura (torres/andares/plantas)
├── obras.$obraId.mapa.tsx             # visão vertical (torres x andares, botões)
├── obras.$obraId.torres.$torreId.andares.$andarId.tsx   # visualizador de planta + apontamentos

src/components/apontamentos/
├── torre-mapa-view.tsx                # renderiza colunas de torres com retângulos clicáveis
├── andar-button.tsx                   # botão de andar com indicador de pendência
├── planta-baixa-viewer.tsx            # zoom/pan + captura de clique para criar pin
├── apontamento-pin.tsx                # ícone do pin sobre a imagem
├── apontamento-form.tsx               # formulário de descrição ao criar/editar pin
├── apontamento-legend.tsx             # legenda numerada (usada também no PDF)
└── estrutura-obra-wizard.tsx          # formulário de cadastro estrutural (torres/andares/tipo)

src/lib/
└── apontamentos-pdf-generator.ts      # substitui pdf-generator.ts; reusa pdf-image-utils.ts
```

### Regras de UX derivadas dos rascunhos (para orientar o agente, sem prescrever pixel)

- O mapa (torre_mapa_view) deve mostrar **apenas** estrutura (torres/andares), sem dados soltos.
- Clicar num andar deve levar a uma tela **centrada só naquele andar** (planta + pins daquele
  andar) — nunca misturar dados de outros andares na mesma tela (requisito explícito do usuário).
- O cadastro estrutural deve gerar diretamente os elementos visuais do mapa — não deve existir um
  formulário cujo resultado não apareça refletido no mapa.
- O relatório final deve incluir a planta de **todo** andar, com ou sem apontamento.

---

## FASE 4 — Integração (substituir RDO pelo novo sistema sem quebrar o resto)

1. **Rotas**: no lugar de `obras.$obraId.rdos.$rdoId`, registrar `obras.$obraId.mapa` como novo
   destino padrão a partir da tela da obra. Redirecionar (ou remover) qualquer link antigo que
   apontava para RDO.
2. **Tabs de `obras.$obraId.tsx`**: substituir a tab "relatorios" (RDO) por "mapa" (novo módulo);
   manter as demais tabs (`visao`, `fotografia`, `menu`) intactas.
3. **Bottom nav** (`obra-bottom-nav.tsx`): trocar o ícone/rota da aba de RDO pela aba "Mapa".
4. **Dashboard**: trocar o card "RDOs do dia" por algo como "Apontamentos pendentes hoje/na semana",
   usando contagem de `apontamentos` com `status = 'aberto'`.
5. **RBAC**: reaproveitar `has_obra_access` (para visualizar mapa/plantas) e `can_edit_obra` (para
   quem pode criar/editar torres, andares e apontamentos). Definir se o papel `cliente` pode criar
   apontamentos ou só visualizar — **pergunta em aberto para validar com o usuário antes de codar
   as policies de RLS.**
6. **Offline-first**: seguir o mesmo padrão de `supabase-offline-wrapper.ts`
   (`offlineSafeInsert/Update/Delete`) para a tabela `apontamentos`, já que apontamento em campo é
   um caso de uso plausível para ficar sem internet dentro da obra.
7. **PDF**: `apontamentos-pdf-generator.ts` reaproveita `fitImageInBox`, `addImageFitted`,
   `addPdfBrandedHeader` de `pdf-image-utils.ts` (não recriar essas funções).
8. **Migração de dados históricos de RDO**: decidir com o usuário se o backup (Fase 2, passo 2)
   deve ficar apenas arquivado ou se algum dado (ex: fotos antigas) deve ser importado como
   apontamentos legados. **Não assumir — perguntar antes de implementar.**

---

## FASE 5 — Validação (checklist de testes)

**Regressão (nada quebrou)**
- [ ] Login/logout continuam funcionando (`use-auth.tsx` intacto)
- [ ] Dashboard carrega sem erros de import quebrado
- [ ] Tela da obra abre normalmente com as tabs restantes (`visao`, `fotografia`, `menu`, `mapa`)
- [ ] Galeria de fotos da obra (`obra_fotografia_itens`) continua funcionando e gerando PDF
- [ ] Upload/gestão de `obra_documentos` continua funcionando (bucket `rdo-anexos` não quebrou)
- [ ] Audit log geral (`audit_log`) segue registrando eventos que não são de RDO
- [ ] `npm run build` sem erros
- [ ] Nenhuma rota antiga (`/obras/:id/rdos/:rdoId`) acessível ou redirecionando corretamente

**Novo módulo — cadastro estrutural**
- [ ] Criar obra nova → cadastrar N torres → cadastrar grupos de andares com planta → aparece
      corretamente no mapa vertical
- [ ] Editar estrutura de obra existente não duplica torres/andares

**Novo módulo — mapa e planta**
- [ ] Mapa mostra torres como colunas de andares clicáveis
- [ ] Clicar em um andar abre **somente** a planta e os apontamentos daquele andar
- [ ] Zoom/pan da planta funciona em mobile e desktop
- [ ] Clicar na planta cria um pin na posição exata clicada; reabrir mantém a posição

**Novo módulo — apontamentos**
- [ ] Criar apontamento com descrição salva no banco e aparece imediatamente na tela
- [ ] Apontamento aberto reflete indicador visual no mapa (andar/torre)
- [ ] Editar/excluir apontamento funciona e respeita RBAC (`can_edit_obra`)

**Relatório**
- [ ] Gerar relatório baixa **todas** as plantas de todos os andares, inclusive sem apontamento
- [ ] Plantas com apontamento mostram os pins sobrepostos + legenda numerada com as descrições
- [ ] PDF final segue o padrão visual (`addPdfBrandedHeader`) do restante do sistema

**Offline**
- [ ] Criar apontamento offline salva no IndexedDB e sincroniza ao reconectar
- [ ] `offlineRdos` removido sem deixar operações pendentes órfãs (checar antes de apagar o store)

---

## Observações finais para o agente

- Este plano assume nomes de tabelas/entidades como **proposta**; o agente deve validar contra o
  schema real antes de gerar qualquer migration.
- Pontos marcados como "pergunta em aberto" devem ser confirmados com o usuário antes de codar —
  não assumir comportamento de RBAC para `cliente` nem decisão sobre dados legados de RDO.
- Não introduzir nenhuma tecnologia fora da stack já existente (nada de novos frameworks de
  estado, de mapas, ou de canvas além do necessário para zoom/pan de imagem, que pode ser feito
  com CSS transform + eventos de pointer, sem biblioteca nova, salvo decisão explícita em contrário).
