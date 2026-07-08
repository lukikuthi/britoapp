# BRITO ENGENHARIA — Documentação do Projeto

Sistema de Diário de Obra (RDO) para gestão de canteiros de obras.

---

## Visão Geral

O BRITO ENGENHARIA é um sistema web para registro diário de atividades em obras de construção civil. Permite que equipes de campo registrem mão de obra, equipamentos, atividades, ocorrências, materiais, clima, fotos e assinaturas, gerando PDFs profissionais dos relatórios.

---

## Stack Tecnológica

| Tecnologia | Uso |
|------------|-----|
| **TanStack Start** | Framework full-stack React (SSR desabilitado: `ssr: false`) |
| **TanStack Router** | Roteamento file-based com params tipados |
| **TanStack Query** | Cache e estado de servidor |
| **Supabase** | PostgreSQL, Auth, Storage, RLS |
| **React 19** | UI com hooks modernos |
| **Tailwind CSS v4** | Estilização com oklch color space |
| **jsPDF + jspdf-autotable** | Geração de PDFs client-side |
| **idb** | IndexedDB para modo offline |
| **browser-image-compression** | Compressão de imagens |
| **Framer Motion** | Animações do splash screen |
| **date-fns (ptBR)** | Formatação de datas |
| **Shadcn/ui** | Componentes UI |

---

## Arquitetura de Arquivos SQL

O banco de dados é definido por três arquivos SQL que devem ser executados no SQL Editor do Supabase:

### `schema.sql` — Schema completo (autoritativo)

Contém:
- **ENUMs**: `app_role`, `obra_status`, `rdo_status`, `clima_condicao`, `atividade_status`, `ocorrencia_gravidade`, `equipamento_status`, `material_tipo`, `mao_obra_tipo`
- **Funções utilitárias**: `update_updated_at_column()`, `has_role()`, `is_admin()`, `get_user_role()`, `has_obra_access()`, `can_edit_obra()`
- **Trigger `handle_new_user()`**: Cria profile + role automaticamente ao cadastrar usuário (primeiro usuário vira admin)
- **Tabelas principais**: `profiles`, `user_roles`, `obras`, `obra_usuarios`, `rdos`
- **Tabelas filhas do RDO**: `rdo_clima`, `rdo_mao_de_obra`, `rdo_equipamentos`, `rdo_atividades`, `rdo_ocorrencias`, `rdo_materiais`, `rdo_checklist_epi`, `rdo_comentarios`, `rdo_midias`, `rdo_anexos`, `rdo_assinatura`
- **Templates**: `templates_tarefas`, `templates_mao_de_obra`, `templates_equipamentos`
- **Audit**: `audit_log` + trigger `trg_audit_rdos`
- **Storage buckets**: `obra-capas`, `rdo-midias`, `rdo-anexos`
- **RLS policies**: Todas as policies de segurança por linha

### `schema-fotografia.sql` — Galeria de fotos da obra

Adiciona a tabela `obra_fotografia_itens` para fotos gerais da obra (não do RDO):
- Campos: `id`, `obra_id`, `titulo`, `descricao`, `storage_path`, `ordem`
- Path no storage: `rdo-midias/{obra_id}/fotografia/...`
- RLS: Usa `has_obra_access()` e `can_edit_obra()`

### `schema-fixes.sql` — Correções idempotentes

Garante que:
- Buckets de Storage existam (`ON CONFLICT DO NOTHING`)
- Policies de Storage estejam corretas
- Seguro para executar múltiplas vezes

---

## Estrutura do Banco de Dados

### Diagrama de Relacionamentos

```
auth.users
    |
    +-- profiles (1:1)
    +-- user_roles (1:N)
    |
obras --------------------------------
    |                                |
    +-- obra_usuarios -- user (equipe)
    +-- obra_documentos
    +-- obra_fotografia_itens
    |
    +-- rdos (1 por dia)
            |
            +-- rdo_clima
            +-- rdo_mao_de_obra
            +-- rdo_equipamentos
            +-- rdo_atividades
            +-- rdo_ocorrencias
            +-- rdo_materiais
            +-- rdo_checklist_epi
            +-- rdo_comentarios
            +-- rdo_midias
            +-- rdo_anexos
            +-- rdo_assinatura (até 2: RT + cliente/fiscal)
            |
            +-- (trigger) ---> audit_log
```

### Todas as Tabelas

| Tabela | Propósito |
|--------|-----------|
| `profiles` | Nome, email, telefone, status ativo de cada usuário |
| `user_roles` | Papel: `admin`, `campo` ou `cliente` |
| `obras` | Canteiros: nome, endereço, coordenadas GPS, cliente, status |
| `obra_usuarios` | Vínculo entre usuários e obras |
| `obra_documentos` | Metadados de documentos gerais da obra |
| `obra_fotografia_itens` | Galeria de fotos da obra |
| `rdos` | Registro diário: data, número sequencial, status, horários |
| `rdo_clima` | Condição climática por período (manha/tarde/noite) |
| `rdo_mao_de_obra` | Função, quantidade, tipo (próprio/terceirizado) |
| `rdo_equipamentos` | Nome, quantidade, status |
| `rdo_atividades` | Descrição, status, progresso % |
| `rdo_ocorrencias` | Descrição, gravidade, resolvido |
| `rdo_materiais` | Nome, quantidade, unidade, tipo (entrada/saída) |
| `rdo_checklist_epi` | Item, presente, observação |
| `rdo_comentarios` | Texto livre |
| `rdo_midias` | Fotos e vídeos (storage_path) |
| `rdo_anexos` | Documentos anexos |
| `rdo_assinatura` | PNG em base64, tipo (RT ou cliente/fiscal) |
| `templates_mao_de_obra` | Lista padrão de funções |
| `templates_equipamentos` | Lista padrão de equipamentos |
| `templates_tarefas` | Lista padrão de atividades |
| `audit_log` | Histórico de alterações em `rdos` |

---

## Sistema de Papéis e Permissões (RBAC)

### Funções SQL SECURITY DEFINER

Definidas em `schema.sql`:

```sql
has_role(user_id, role)      -- Verifica se usuário tem papel
is_admin(user_id)            -- Verifica se é admin
get_user_role(user_id)       -- Retorna o papel prioritário
has_obra_access(user_id, obra_id)  -- Pode ver a obra?
can_edit_obra(user_id, obra_id)    -- Pode editar a obra?
```

### Matriz de Permissões

| Papel | Ver Obras | Editar Obras | Ver RDOs | Criar/Editar RDOs | Aprovar RDOs | Gerenciar Usuários |
|-------|-----------|--------------|----------|-------------------|--------------|-------------------|
| **admin** | Todas | Sim | Todos | Sim | Sim | Sim |
| **campo** | Apenas vinculadas | Não | Apenas vinculados | Sim | Não | Não |
| **cliente** | Apenas como cliente_id | Não | Apenas vinculados | Não | Não | Não |

### Lógica de Acesso

- **Admin**: Acesso total via `is_admin()`
- **Campo**: Acesso se estiver em `obra_usuarios` para aquela obra
- **Cliente**: Acesso se for `cliente_id` da obra OU estiver em `obra_usuarios`

### RLS (Row Level Security)

Todas as tabelas têm RLS habilitado. As policies usam as funções SECURITY DEFINER para verificar acesso:

```sql
-- Exemplo: policy de SELECT em rdos
CREATE POLICY "Ver RDOs de obras acessíveis" ON public.rdos
FOR SELECT TO authenticated
USING (public.has_obra_access(auth.uid(), obra_id));
```

---

## Storage Buckets

| Bucket | Uso | Path Pattern |
|--------|-----|--------------|
| `obra-capas` | Foto de capa da obra | `{obra_id}/capa.ext` |
| `rdo-midias` | Fotos e vídeos do RDO | `{obra_id}/{rdo_id}/{uuid}.ext` |
| `rdo-anexos` | Documentos do RDO e obra | `{obra_id}/{rdo_id}/...` ou `{obra_id}/documentos/...` |

Policies de Storage usam `split_part(name, '/', 1)::uuid` para extrair o `obra_id` do path.

---

## Ciclo de Vida do RDO

```
rascunho → enviado → aprovado
```

1. **rascunho**: Em preenchimento (UI exibe "Preenchendo")
2. **enviado**: Aguardando aprovação do admin
3. **aprovado**: RDO finalizado, pode gerar PDF

### Numeração Sequencial

O trigger `set_rdo_numero_sequencial()` gera automaticamente:

```sql
-- Antes do INSERT
SELECT COALESCE(MAX(numero_sequencial), 0) + 1
FROM rdos WHERE obra_id = NEW.obra_id;
```

Constraint: `UNIQUE (obra_id, data)` — um RDO por dia por obra.

---

## Modo Offline-First

### IndexedDB (`offline-db.ts`)

Database: `brito-rdo-offline` (versão 1)

**Store `pendingSync`**:
- Operações pendentes (create/update/delete)
- Key: `{table}:{rdoId}:{timestamp}`
- Indexes: `by-obra`, `by-synced`

**Store `offlineRdos`**:
- Snapshots de RDOs para edição offline
- Index: `by-obra`

### Wrappers (`supabase-offline-wrapper.ts`)

```typescript
offlineSafeInsert(table, rdoId, obraId, payload)
offlineSafeUpdate(table, rdoId, obraId, payload)
offlineSafeDelete(table, rdoId, obraId, id)
```

Se `navigator.onLine === false`:
1. Salva operação no IndexedDB
2. Retorna resposta otimística

Se online:
1. Executa diretamente no Supabase

### Sync Hook (`use-offline-sync.ts`)

```typescript
useOnlineStatus()    // Boolean
usePendingSyncCount() // { count, refresh }
useOfflineSync()      // { isOnline, syncing, sync }
```

- Auto-sync ao reconectar (`window.addEventListener("online", ...)`)
- Replay de operações na ordem original
- Invalida cache do React Query após sync
- Toast de sucesso/erro

---

## Autenticação (`use-auth.tsx`)

### AuthProvider

Context singleton que:
- Escuta `supabase.auth.onAuthStateChange`
- Usa `queueMicrotask()` para deferir state updates (React 19 safe)
- Limpa cache do React Query no `SIGNED_OUT`
- Provê: `{ session, user, loading }`

### Hooks

```typescript
useAuth()     // { session, user, loading }
useRole()     // Query para user_roles
useProfile()  // Query para profiles
```

### Auto-Criação de Profile

O trigger `handle_new_user()` em `schema.sql`:

```sql
-- Cria profile
INSERT INTO profiles (id, nome, email) VALUES (NEW.id, ...);

-- Se primeiro usuário → admin, senão → campo
INSERT INTO user_roles (user_id, role) VALUES (NEW.id, _role);
```

---

## Geração de PDF

### `pdf-generator.ts`

Gera PDF do RDO em até 4 páginas:
1. Cabeçalho + informações básicas
2. Mão de obra + equipamentos + atividades
3. Ocorrências + materiais + EPI
4. Fotos + assinaturas

Funções:
- `generateRdoPdf(rdo, obra, sections)`
- `generateConsolidatedPdf(obras, periodo)` — múltiplos RDOs em um PDF

### `fotografia-pdf-generator.ts`

Gera PDF da galeria de fotos da obra (1 foto por página).

### `pdf-image-utils.ts`

Utilitários compartilhados:
- `fetchImageAsBase64(url)` — com cache em memória
- `fitImageInBox(imgWidth, imgHeight, boxWidth, boxHeight)` — letterbox scaling
- `addImageFitted(doc, base64, x, y, w, h)`
- `addPdfBrandedHeader(doc, title)` — header azul com logo

---

## Sistema de Rotas (TanStack Router)

### Estrutura de Arquivos

```
src/routes/
├── __root.tsx                    # Layout raiz (QueryClient, AuthProvider, Splash)
├── index.tsx                     # Redirect para /dashboard
├── auth.tsx                      # Tela de login
└── _authenticated/
    ├── route.tsx                 # Layout protegido (valida sessão)
    ├── dashboard.tsx             # Listagem de obras + RDOs do dia
    ├── obras.index.tsx           # CRUD de obras (admin)
    ├── obras.$obraId.tsx         # Detalhe da obra (4 tabs)
    ├── obras.$obraId.rdos.$rdoId.tsx  # Editor de RDO
    └── obras.$obraId.filtro.$tipo.tsx # Filtro cross-RDO
    ├── admin.usuarios.tsx        # Gestão de usuários
    └── admin.audit.tsx           # Audit log
```

### Rotas Protegidas

O arquivo `_authenticated/route.tsx` usa `beforeLoad`:

```typescript
beforeLoad: async () => {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw redirect({ to: "/auth" });
  return { user: data.user };
}
```

### Rotas Dinâmicas

- `$obraId` → `useParams().obraId`
- `$rdoId` → `useParams().rdoId`
- `$tipo` → `useParams().tipo` (fotos, videos, atividades, etc.)

### Search Params

- `?tab=` em `obras.$obraId.tsx` (visao, relatorios, fotografia, menu)

---

## Componentes Principais

### `RdoSection<T>` (`rdo-sections.tsx`)

Componente genérico para seções do RDO:

```typescript
<RdoSection
  title="Mão de Obra"
  items={maoObra}
  onAdd={() => form.reset({ funcao: "", quantidade: 1 })}
  renderForm={(form) => <MaoObraForm form={form} />}
  renderItem={(item) => <MaoObraItem item={item} />}
  columns={["Função", "Qtd", "Tipo"]}
/>
```

Formulários especializados:
- `MaoObraForm`, `EquipamentoForm`, `AtividadeForm`
- `OcorrenciaForm`, `MaterialForm`, `EpiForm`, `ComentarioForm`

### `ObraFotografiaTab` (`obra-fotografia-tab.tsx`)

Galeria de fotos da obra:
- Cards com título, descrição, foto
- Upload com compressão (máx 1.2MB, 1600px)
- Ordenação por `ordem`
- Exportar para PDF

### `ObraBottomNav` (`obra-bottom-nav.tsx`)

Navegação inferior fixa (4 tabs):
- Desktop: offset de `md:left-64` para sidebar
- Mobile: full-width

### `AppLoadingScreen`

Splash screen com:
- Logo animado (Framer Motion)
- Tempo mínimo de exibição
- Controlado por `AppBoot` component

---

## Design System

### Cores (Tailwind CSS v4 com oklch)

Definidas em `src/styles.css`:

```css
--brand-navy: oklch(0.28 0.08 258);   /* Azul marinho */
--brand-gold: oklch(0.76 0.12 85);    /* Dourado */
```

Ramps completas de cores:
- `primary` (navy), `secondary`, `accent` (gold)
- `success`, `warning`, `error`
- Neutrals com múltiplos shades

### Utilitários Customizados

- `.brito-status-dot` — indicador de status colorido

---

## PWA

- Manifest em `public/manifest.json`
- Service worker ready
- Offline indicators na UI

---

## Variáveis de Ambiente

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-anon-key
```

---

## Fluxos Principais

### Fluxo de Login

1. Usuário acessa `/auth`
2. `supabase.auth.signInWithPassword()`
3. Trigger `handle_new_user()` cria profile + role
4. Redirect para `/dashboard`

### Fluxo de Criação de RDO

1. Dashboard → seleciona obra → "Novo RDO"
2. Sistema valida se já existe RDO para a data
3. Abre editor com 10 seções em accordion
4. Cada seção salva individualmente
5. Clima auto-fetch de Open-Meteo API
6. Status inicia como "rascunho"

### Fluxo de Assinatura

1. Modal de assinatura (`react-signature-canvas`)
2. Captura em PNG base64
3. Salva em `rdo_assinatura` com tipo (RT ou cliente/fiscal)
4. Limite: 2 assinaturas por RDO

### Fluxo de Aprovação

1. RDO enviado (status: "enviado")
2. Admin acessa RDO
3. Botão "Aprovar" → status "aprovado"
4. Audit log registra ator e timestamp

---

## API Externa

### Open-Meteo

Usada para preencher automaticamente `rdo_clima`:
- Endpoint: `https://api.open-meteo.com/v1/forecast`
- Parâmetros: `latitude`, `longitude`, `daily=weather_code`
- Conversão de código para ENUM `clima_condicao`

---

## Compressão de Imagens

`browser-image-compression` configurado em:

```typescript
{
  maxSizeMB: 1.2,
  maxWidthOrHeight: 1600,
  useWebWorker: true
}
```

Aplicado antes de upload para Storage.

---

## Triggers Importantes do Banco

### `handle_new_user`

- **Quando**: `AFTER INSERT ON auth.users`
- **O que faz**: Cria `profiles` + `user_roles` automaticamente
- **Lógica**: Primeiro usuário → admin, demais → campo

### `set_rdo_numero_sequencial`

- **Quando**: `BEFORE INSERT ON rdos`
- **O que faz**: Gera número sequencial único por obra

### `trg_audit_rdos`

- **Quando**: `AFTER INSERT OR UPDATE OR DELETE ON rdos`
- **O que faz**: Registra mudanças em `audit_log`

---

## Código de Terceiros

Não utilizado. Todo o código é proprietário do projeto BRITO ENGENHARIA.

---

## Execução do Projeto

```bash
npm install
npm run dev
```

O servidor de desenvolvimento inicia automaticamente. O build é validado com:

```bash
npm run build
```

---

## Referências de Arquivos

| Arquivo | Propósito |
|---------|-----------|
| `schema.sql` | Schema SQL completo e autoritativo |
| `schema-fotografia.sql` | Tabela de galeria de fotos da obra |
| `schema-fixes.sql` | Correções idempotentes de Storage |
| `BANCO.md` | Guia do banco em linguagem simples |
| `src/routes/__root.tsx` | Layout raiz com providers |
| `src/routes/_authenticated/route.tsx` | Layout protegido |
| `src/hooks/use-auth.tsx` | Contexto de autenticação |
| `src/hooks/use-offline-sync.ts` | Sincronização offline |
| `src/lib/offline-db.ts` | IndexedDB schema e funções |
| `src/lib/supabase-offline-wrapper.ts` | Wrappers para operações offline-safe |
| `src/lib/pdf-generator.ts` | Geração de PDF do RDO |
| `src/lib/fotografia-pdf-generator.ts` | PDF da galeria de fotos |
| `src/lib/pdf-image-utils.ts` | Utilitários de imagem para PDF |
| `src/components/rdo-sections.tsx` | Componentes de seções do RDO |
| `src/components/obra-fotografia-tab.tsx` | Galeria de fotos da obra |
| `src/components/obra-bottom-nav.tsx` | Navegação inferior da obra |
| `src/integrations/supabase/client.ts` | Cliente Supabase |
| `src/integrations/supabase/types.ts` | Tipos TypeScript gerados |
| `src/styles.css` | Design system Tailwind v4 |
