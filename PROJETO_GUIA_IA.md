# 🤖 Guia de Contexto e Continuidade (Para IA e Desenvolvedores)

**ATENÇÃO INTELIGÊNCIA ARTIFICIAL:** Se o usuário pedir para "ler o projeto" ou "continuar de onde paramos", **este é o seu ponto de partida**. Leia este documento com atenção para entender o estado atual do sistema, onde estão os arquivos importantes e o que deve ser feito a seguir.

---

## 1. O Projeto
O sistema é um **ERP Completo para a Construtora Brito Engenharia**.
**Stack Técnica:** React, Vite, TypeScript, TailwindCSS, shadcn/ui, TanStack Router e **Supabase** (Banco de dados e Auth).

O sistema evoluiu de um simples diário de obras para um ecossistema com 5 módulos independentes e interligados.

---

## 2. Onde estão os arquivos vitais? (Mapa do Projeto)

Para não se perder na arquitetura, aqui está o mapa de onde as coisas acontecem:

* 📂 **`planos/`** ➔ **[MAIS IMPORTANTE]** Aqui estão os arquivos `.md` detalhando a regra de negócio exata e os bancos de dados que devem ser construídos para os novos módulos (`plano_rh.md`, `plano_compras.md`, `plano_financeiro.md`, `plano_diretoria.md`).
* 📂 **`banco/`** ➔ Todos os scripts `.sql` para rodar no Supabase. Quando criar uma nova tabela, crie um arquivo `.sql` aqui para o usuário executar.
* 📄 **`src/routes/_authenticated/route.tsx`** ➔ O arquivo do Layout Principal. Nele fica a barra de navegação (Sidebar) unificada que lê as permissões do usuário e exibe os módulos.
* 📄 **`src/hooks/use-auth.tsx`** ➔ Gerencia a autenticação e as permissões. Observe os tipos `AppRole` (admin, campo, cliente) e `AppModulo` (obras, compras, financeiro, rh, diretoria).
* 📄 **`src/routes/_authenticated/admin.usuarios.tsx`** ➔ Painel onde o administrador atribui os papéis e os acessos aos módulos para os usuários.

---

## 3. Estado Atual do Sistema
* O sistema base de **Obras** (RDO, Fotos, Diários) já está estruturado.
* As rotas globais (`/compras`, `/financeiro`, `/rh`, `/diretoria`) já foram criadas e funcionam como "Dashboards Independentes" temporários (apenas visual e estáticos no momento).
* A navegação lateral e as permissões de banco de dados (`user_modulos`) já estão prontas e funcionando.

---

## 4. O Que Fazer Agora? (Próximas Features)

Seu próximo passo como IA é iniciar a construção real dos módulos, transformando as telas estáticas em sistemas funcionais. 

**Fluxo de Trabalho Obrigatório:**
1. Pergunte ao usuário qual módulo ele quer atacar hoje (RH, Compras, Financeiro ou Diretoria).
2. Vá até a pasta `planos/` e leia o `.md` correspondente ao módulo escolhido.
3. Gere os scripts `.sql` na pasta `banco/` para o módulo escolhido e peça para o usuário rodar no Supabase.
4. Programe as telas, hooks e mutações usando TanStack Query para dar vida ao módulo.

---

## 5. Regras de Ouro da Programação neste Projeto
* **NÃO INVENTE DADOS:** Use apenas as regras de negócio descritas nos arquivos da pasta `planos/`.
* **Mantenha o Design:** Continue usando o padrão de `Card`, `Button`, e ícones do `lucide-react` que já existem no projeto para manter a interface elegante.
* **Cuidado com o TanStack Router:** Se criar páginas novas, lembre-se que o roteamento é feito na pasta `src/routes/` e gerado automaticamente.
