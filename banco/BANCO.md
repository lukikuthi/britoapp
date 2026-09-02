# BRITO ENGENHARIA — Guia do banco de dados

Este documento explica, em linguagem simples, como o banco de dados do Diário de Obra (RDO) está organizado e como configurá-lo no **seu** projeto Supabase.

---

## O que é cada tabela

| Tabela | O que representa no mundo real |
|--------|--------------------------------|
| **profiles** | Perfil de cada pessoa que usa o sistema (nome, e-mail, telefone). |
| **user_roles** | Papel de cada usuário: admin, campo ou cliente. |
| **obras** | Cada canteiro de obras (nome, endereço, coordenadas GPS, status). |
| **obra_usuarios** | Quem da equipe está vinculado a qual obra. |
| **obra_documentos** | PDFs e arquivos gerais da obra (contratos, plantas). |
| **rdos** | **Coração do sistema** — um registro por dia de trabalho em uma obra. |
| **rdo_clima** | Condição do tempo (manhã/tarde/noite) naquele dia. |
| **rdo_mao_de_obra** | Quantos pedreiros, eletricistas etc. trabalharam. |
| **rdo_equipamentos** | Betoneiras, guindastes e outros equipamentos usados. |
| **rdo_atividades** | Tarefas do dia com progresso (%). |
| **rdo_ocorrencias** | Problemas, acidentes ou imprevistos. |
| **rdo_materiais** | Entrada/saída de materiais. |
| **rdo_checklist_epi** | Itens de segurança (capacete, bota…) presentes ou não. |
| **rdo_comentarios** | Observações em texto livre. |
| **rdo_midias** | Fotos e vídeos (caminho no Storage). |
| **rdo_anexos** | Documentos anexados ao RDO (notas fiscais etc.). |
| **rdo_assinatura** | Assinaturas manuais (RT e cliente/fiscal), PNG em base64. |
| **templates_mao_de_obra** | Lista padrão de funções para copiar nos RDOs. |
| **templates_equipamentos** | Lista padrão de equipamentos por obra. |
| **templates_tarefas** | Lista padrão de atividades (reservado para evolução). |
| **audit_log** | Histórico de quem alterou RDOs e quando. |

---

## Como as tabelas se relacionam

```
auth.users
    │
    ├── profiles (1:1)
    ├── user_roles (1:N papéis)
    │
obras ─────────────────────────────────────────┐
    │                                          │
    ├── obra_usuarios ──► user (equipe)        │
    ├── obra_documentos (arquivos da obra)     │
    │                                          │
    └── rdos (1 por dia) ◄─────────────────────┘
            │
            ├── rdo_clima, rdo_mao_de_obra, rdo_equipamentos
            ├── rdo_atividades, rdo_ocorrencias, rdo_materiais
            ├── rdo_checklist_epi, rdo_comentarios
            ├── rdo_midias, rdo_anexos, rdo_assinatura
            └── (trigger) ──► audit_log
```

---

## Papéis e permissões (RLS)

| Papel | Pode fazer | Policy que garante |
|-------|------------|-------------------|
| **admin** | Tudo: obras, usuários, RDOs, aprovação, audit log | `is_admin()` nas policies de ALL |
| **campo** | Ver e editar RDOs **somente** das obras vinculadas em `obra_usuarios` | `can_edit_obra()` para INSERT/UPDATE; `has_obra_access()` para SELECT |
| **cliente** | **Somente leitura** das obras onde é `cliente_id` ou está vinculado | SELECT via `has_obra_access()`; **nenhuma** policy de escrita para cliente |

O cliente nunca consegue INSERT/UPDATE/DELETE porque `can_edit_obra()` exige papel `campo` ou `admin`.

---

## Buckets de Storage

| Bucket | Uso | Path no código |
|--------|-----|----------------|
| **obra-capas** | Foto de capa da obra | `{obra_id}/...` |
| **rdo-midias** | Fotos e vídeos do RDO | `{obra_id}/{rdo_id}/{uuid}.ext` |
| **rdo-anexos** | Anexos do RDO + documentos da obra | `{obra_id}/{rdo_id}/...` ou `{obra_id}/documentos/...` |

Os buckets são criados pelo `schema.sql` via `INSERT INTO storage.buckets`.

---

## Passo a passo no Supabase

### 1. Criar o projeto
1. Acesse [supabase.com](https://supabase.com) e crie um projeto novo.
2. Anote a **URL** e a **anon/public key** em *Settings → API*.

### 2. Executar o schema
1. Abra **SQL Editor** no painel Supabase.
2. Cole o conteúdo completo de `schema.sql`.
3. Execute **uma vez** (pode levar alguns segundos).

### 3. Criar o primeiro usuário admin
1. Vá em **Authentication → Users → Add user**.
2. Crie um usuário com e-mail e senha.
3. Se for o **primeiro usuário** do banco, o trigger `handle_new_user` já atribui papel **admin** automaticamente.
4. Se já existirem usuários, insira manualmente:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('UUID-DO-USUARIO', 'admin');
   ```

### 4. Configurar o `.env` do frontend
No arquivo `project/.env`:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-anon-key-aqui
```

Reinicie o servidor de desenvolvimento (`npm run dev`).

### 5. Desabilitar cadastro público (recomendado)
Em **Authentication → Providers → Email**, desative **Enable sign ups** para que só o admin crie usuários pelo app (*Usuários*).

### 6. Testar
1. Faça login em `/auth`.
2. Crie uma obra (menu admin).
3. Crie um RDO e preencha as seções.
4. Verifique no Table Editor se os dados aparecem.

---

## Observações importantes

- **Numeração do RDO**: o trigger `set_rdo_numero_sequencial` preenche automaticamente; o app envia `0`.
- **Status na UI**: o enum no banco é `rascunho`, mas a interface exibe **"Preenchendo"**.
- **Assinaturas**: até duas por RDO (`responsavel_tecnico` e `cliente_fiscal`), chave única `(rdo_id, tipo)`.
- **Audit log**: alterações na tabela `rdos` são registradas automaticamente; admins veem em `/admin/audit`.
- **Modo offline**: o app enfileira operações no IndexedDB e sincroniza quando a conexão volta.

---

## Arquivos SQL no repositório

| Arquivo | Descrição |
|---------|-----------|
| `schema.sql` | **Use este** — schema completo e atualizado |
| `schema_final.sql` | Cópia anterior (legado) |
| `supabase/migrations/*.sql` | Migration antiga, conteúdo equivalente ao legado |

Se houver divergência, **`schema.sql` prevalece** — ele foi gerado após validação do código.
