# 🔍 Plano de Polimento FINAL (v3) — Auditoria Consolidada
Resultado da varredura de 2 agentes especializados + análise manual em 30+ arquivos.

> [!CAUTION]
> Encontrados 8 problemas críticos que impedem o uso em produção. Nenhum deles causa crash visível na tela principal, mas permitem acesso indevido, perda de dados ou erros silenciosos.

## 🔴 BLOCO 1 — CRÍTICO (8 itens)
**C1. RLS do Compras 100% Aberto (`USING (true)`)**
Qualquer usuário logado (inclusive "cliente") pode ler/editar/deletar TODO o estoque, boletos e mensagens. Fix: Script SQL para dropar e recriar com `has_module_access('compras')`.

**C2. Diretoria Bloqueada pelo RLS**
O Dashboard da Diretoria faz SELECT em `rh_funcionarios` e `fin_transacoes`, mas as políticas dessas tabelas NÃO incluem diretoria. Dados voltam vazios sem erro. Fix: Separar as policies em SELECT (permitir diretoria) e INSERT/UPDATE/DELETE (só o módulo dono).

**C3. Obras com CRUD Total em `rh_funcionarios`**
A política `FOR ALL USING (rh OR obras)` dá INSERT/UPDATE/DELETE a quem tem módulo obras. Deveria ser apenas SELECT. Fix: Já coberto pelo C2 (políticas granulares por operação).

**C4. `auth-guards.ts` Usa `.single()` (Crash se 0 ou >1 roles)**
Se o user não tiver role OU tiver mais de uma, o Supabase lança `PGRST116`. Fix: Trocar por `.maybeSingle()` e tratar o error.

**C5. Admin com Registros Parciais em `user_modulos` Perde Módulos**
Se um admin tiver 1 registro em `user_modulos`, o fallback "liberar tudo" do `useModulos` não ativa. Fix: Checar `if (role === "admin")` ANTES de consultar `user_modulos`.

**C6. `ON DELETE CASCADE` em `compras_boletos` e `compras_itens`**
Deletar uma obra apaga permanentemente todos os boletos e itens de estoque vinculados. Fix: Script SQL `ALTER TABLE ... ON DELETE SET NULL`.

**C7. UUID Vazio ("") em Todos os Formulários**
Todo formulário que usa `<Select>` para escolher Funcionário, Obra ou Equipamento inicia com `funcionario_id: ""`. Se submetido sem seleção, o Supabase recebe `""` como UUID e crasha: `invalid input syntax for type uuid: ""`. Afeta: rh-exames, rh-ferias, compras-estoque, compras-certificados, compras-boletos. Fix: Validar no `handleSubmit` se os IDs obrigatórios foram preenchidos antes de chamar a mutation.

**C8. Forms Não Resetam Após Submit**
Todos os modais mantêm os dados do último cadastro ao reabrir. Fix: Resetar o state no `onOpenChange` do `<Dialog>`.

## 🟡 BLOCO 2 — IMPORTANTE (7 itens)
**I1. `onError` Faltando em 7 Mutations**
`useAdicionarCertificado`, `useAdicionarBoleto`, `useEnviarMensagem`, `useAdicionarExame`, `useAdicionarNR`, `useAgendarFerias`, `useResponderMensagem`.

**I2. Cache Cruzado de Mensagens Quebrado**
Compras invalida `["mensagens"]` mas não `["diretoria-mensagens"]`. Diretoria invalida `["diretoria-mensagens"]` mas não `["mensagens"]`. Resultado: ninguém vê a resposta do outro em tempo real. Inclui também: Mutations de Financeiro/RH não invalidam `["diretoria-kpis"]`.

**I3. Filtros de Abas no Financeiro São Mortos**
As abas "Todas" / "A Pagar" / "A Receber" no `financeiro-contas-tab` existem visualmente mas não filtram nada. A query `useTransacoes()` é chamada sem o parâmetro tipo.

**I4. KPIs Mockados na Diretoria**
Os textos "Dentro do Prazo", "Controlado" e "Atenção" são hardcoded.

**I5. `useKpisDiretoria` Ignora Erros do `Promise.all`**
Se o RLS bloquear, o hook retorna dados zerados sem exceção.

**I6. Tabelas Sem Scroll Horizontal no Mobile**
Falta `overflow-x-auto` em: rh-funcionarios, rh-ferias, compras-estoque, compras-certificados, compras-boletos, financeiro-contas.

**I7. Bug de Fuso Horário em Datas**
`new Date('2024-01-15')` é interpretado como meia-noite UTC, que no Brasil (UTC-3) vira 21h do dia 14. Todas as datas exibem 1 dia a menos. Fix: Usar `new Date(date + 'T12:00:00')` ou split manual.

## 🟢 BLOCO 3 — MELHORIAS (5 itens)
**M1. CRUD Completo** (Editar/Excluir em Todos os Módulos)
**M2. Link do Hub na Sidebar** (Usuário Fica Preso Sem Voltar)
**M3. Validação de CPF**
**M4. Upload de Documentos** (ASO, Certificados, NFs)
**M5. Imports Não Utilizados em 8 Componentes**

## Plano de Execução
| # | Tarefa | Tipo | Prioridade |
|---|--------|------|------------|
| 1 | Script SQL de correção total (RLS + ON DELETE + Índices) | SQL | 🔴 |
| 2 | Corrigir `auth-guards.ts` (C4) | Código | 🔴 |
| 3 | Corrigir `useModulos` - admin bypass (C5) | Código | 🔴 |
| 4 | Validação de UUID + Reset de forms (C7 + C8) | Código | 🔴 |
| 5 | Adicionar `onError` em todas mutations (I1) | Código | 🟡 |
| 6 | Corrigir invalidação cruzada de cache (I2) | Código | 🟡 |
| 7 | Implementar filtros de abas no Financeiro (I3) | Código | 🟡 |
| 8 | KPIs dinâmicos da Diretoria + error handling (I4 + I5) | Código | 🟡 |
| 9 | Scroll mobile em tabelas (I6) | Código | 🟡 |
| 10 | Fix de fuso horário em datas (I7) | Código | 🟡 |
| 11 | Link do Hub na sidebar (M2) | Código | 🟢 |
| 12 | Limpar imports não utilizados (M5) | Código | 🟢 |

> **NOTA PARA A PRÓXIMA I.A:**
> O script SQL de correção correspondente à Tarefa 1 já foi criado em `banco/correcao_polimento.sql`. O usuário deve rodar esse script no Supabase.
> Parte da Tarefa 2, 3 e 5 já foi executada (`auth-guards.ts`, `use-auth.tsx`, `use-compras.ts`, `use-rh.ts`), mas é necessário checar o resto.
