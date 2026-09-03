-- ==============================================================================
-- CORREÇÃO MASSIVA DE SEGURANÇA E INTEGRIDADE — RODAR NO SUPABASE
-- ==============================================================================

-- =====================
-- 1. CORRIGIR RLS DO MÓDULO COMPRAS (USANDO true → has_module_access)
-- =====================
DROP POLICY IF EXISTS "Acesso total aos itens" ON public.compras_itens;
DROP POLICY IF EXISTS "Acesso total as movimentacoes" ON public.compras_movimentacoes;
DROP POLICY IF EXISTS "Acesso total aos certificados" ON public.compras_certificados;
DROP POLICY IF EXISTS "Acesso total aos boletos" ON public.compras_boletos;
DROP POLICY IF EXISTS "Acesso total as mensagens" ON public.mensagens_setor;

CREATE POLICY "Acesso Compras Itens" ON public.compras_itens FOR ALL USING (public.has_module_access('compras'));
CREATE POLICY "Acesso Compras Movimentacoes" ON public.compras_movimentacoes FOR ALL USING (public.has_module_access('compras'));
CREATE POLICY "Acesso Compras Certificados" ON public.compras_certificados FOR ALL USING (public.has_module_access('compras'));
CREATE POLICY "Acesso Compras Boletos" ON public.compras_boletos FOR ALL USING (public.has_module_access('compras') OR public.has_module_access('financeiro'));
CREATE POLICY "Acesso Mensagens Setor" ON public.mensagens_setor FOR ALL USING (true);

-- =====================
-- 2. CORRIGIR RLS DO RH (Obras só pode LER funcionários, não CRUD total)
-- =====================
DROP POLICY IF EXISTS "Acesso RH Funcionarios" ON public.rh_funcionarios;
CREATE POLICY "RH Funcionarios SELECT" ON public.rh_funcionarios FOR SELECT USING (
  public.has_module_access('rh') OR public.has_module_access('obras') OR public.has_module_access('diretoria')
);
CREATE POLICY "RH Funcionarios INSERT" ON public.rh_funcionarios FOR INSERT WITH CHECK (public.has_module_access('rh'));
CREATE POLICY "RH Funcionarios UPDATE" ON public.rh_funcionarios FOR UPDATE USING (public.has_module_access('rh'));
CREATE POLICY "RH Funcionarios DELETE" ON public.rh_funcionarios FOR DELETE USING (public.has_module_access('rh'));

-- =====================
-- 3. CORRIGIR RLS DO FINANCEIRO (Diretoria precisa LER transações)
-- =====================
DROP POLICY IF EXISTS "Acesso Financeiro Transacoes" ON public.fin_transacoes;
CREATE POLICY "Fin Transacoes SELECT" ON public.fin_transacoes FOR SELECT USING (
  public.has_module_access('financeiro') OR public.has_module_access('diretoria')
);
CREATE POLICY "Fin Transacoes INSERT" ON public.fin_transacoes FOR INSERT WITH CHECK (public.has_module_access('financeiro'));
CREATE POLICY "Fin Transacoes UPDATE" ON public.fin_transacoes FOR UPDATE USING (public.has_module_access('financeiro'));
CREATE POLICY "Fin Transacoes DELETE" ON public.fin_transacoes FOR DELETE USING (public.has_module_access('financeiro'));

-- =====================
-- 4. CORRIGIR ON DELETE CASCADE → SET NULL (Impedir perda de dados)
-- =====================
ALTER TABLE public.compras_boletos DROP CONSTRAINT IF EXISTS compras_boletos_obra_id_fkey;
ALTER TABLE public.compras_boletos ADD CONSTRAINT compras_boletos_obra_id_fkey
  FOREIGN KEY (obra_id) REFERENCES public.obras(id) ON DELETE SET NULL;

ALTER TABLE public.compras_itens DROP CONSTRAINT IF EXISTS compras_itens_obra_id_fkey;
ALTER TABLE public.compras_itens ADD CONSTRAINT compras_itens_obra_id_fkey
  FOREIGN KEY (obra_id) REFERENCES public.obras(id) ON DELETE SET NULL;

-- =====================
-- 5. ÍNDICES DE PERFORMANCE
-- =====================
CREATE INDEX IF NOT EXISTS idx_rh_exames_vencimento ON public.rh_exames(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_rh_exames_funcionario ON public.rh_exames(funcionario_id);
CREATE INDEX IF NOT EXISTS idx_rh_nrs_vencimento ON public.rh_treinamentos_nr(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_rh_nrs_funcionario ON public.rh_treinamentos_nr(funcionario_id);
CREATE INDEX IF NOT EXISTS idx_rh_ferias_funcionario ON public.rh_ferias(funcionario_id);
CREATE INDEX IF NOT EXISTS idx_rh_func_status ON public.rh_funcionarios(status);
CREATE INDEX IF NOT EXISTS idx_fin_transacoes_vencimento ON public.fin_transacoes(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_fin_transacoes_status ON public.fin_transacoes(status);
CREATE INDEX IF NOT EXISTS idx_fin_transacoes_tipo ON public.fin_transacoes(tipo);
CREATE INDEX IF NOT EXISTS idx_compras_boletos_vencimento ON public.compras_boletos(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_compras_boletos_status ON public.compras_boletos(status);
CREATE INDEX IF NOT EXISTS idx_compras_cert_vencimento ON public.compras_certificados(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_mensagens_destino ON public.mensagens_setor(para_modulo);
CREATE INDEX IF NOT EXISTS idx_mensagens_created ON public.mensagens_setor(created_at);

-- =====================
-- 6. CORRIGIR has_module_access (SET search_path para segurança)
-- =====================
CREATE OR REPLACE FUNCTION public.has_module_access(check_modulo TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  has_access BOOLEAN;
  is_admin BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ) INTO is_admin;
  
  IF is_admin THEN
    RETURN true;
  END IF;
  
  SELECT EXISTS (
    SELECT 1 FROM public.user_modulos WHERE user_id = auth.uid() AND modulo = check_modulo
  ) INTO has_access;
  
  RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

NOTIFY pgrst, 'reload schema';
