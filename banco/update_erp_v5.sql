-- ==========================================
-- UPDATE V5 - ERP CORPORATIVO
-- Resolvendo pontas soltas operacionais
-- ==========================================

-- 1. Efetivo Terceirizado no RDO
CREATE TABLE IF NOT EXISTS public.rdo_efetivo_terceiro (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rdo_id UUID REFERENCES public.rdos(id) ON DELETE CASCADE,
    empreiteira_id UUID REFERENCES public.cad_terceiros(id) ON DELETE CASCADE,
    quantidade_profissionais INTEGER NOT NULL DEFAULT 1,
    especialidade_atividade TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- 2. Manutenções de Patrimônio
CREATE TABLE IF NOT EXISTS public.patrimonio_manutencoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    equipamento_id UUID REFERENCES public.cad_equipamentos(id) ON DELETE CASCADE,
    data_ida DATE NOT NULL DEFAULT CURRENT_DATE,
    data_retorno DATE,
    motivo TEXT NOT NULL,
    custo_reparo DECIMAL(15,2) DEFAULT 0.00,
    status TEXT CHECK (status IN ('na_oficina', 'consertado', 'sucata')) DEFAULT 'na_oficina',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- 3. Melhorias em Compras e Financeiro
-- Adicionando Fornecedor genérico ou ID na transação financeira para rastreio
ALTER TABLE public.fin_transacoes 
ADD COLUMN IF NOT EXISTS fornecedor TEXT;

-- Adicionando controle de recebimento na requisição de compra original
ALTER TABLE public.compras_requisicoes 
ADD COLUMN IF NOT EXISTS status_recebimento TEXT CHECK (status_recebimento IN ('pendente', 'parcial', 'recebido')) DEFAULT 'pendente',
ADD COLUMN IF NOT EXISTS data_recebimento TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS recebido_por UUID REFERENCES public.profiles(id);

-- Para evitar que exames ASO vencidos passem despercebidos, vamos garantir que a coluna status_aso exista no rh_funcionarios (já devia existir, confirmando)
-- (Já mapeada no projeto original)

-- Habilitando RLS para novas tabelas
ALTER TABLE public.rdo_efetivo_terceiro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patrimonio_manutencoes ENABLE ROW LEVEL SECURITY;

-- Políticas super permissivas para ambiente de construtora (onde o Auth já filtra o acesso ao modulo via App)
CREATE POLICY "Permitir leitura total efetivo terceiro" ON public.rdo_efetivo_terceiro FOR SELECT USING (true);
CREATE POLICY "Permitir insercao efetivo terceiro" ON public.rdo_efetivo_terceiro FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir update efetivo terceiro" ON public.rdo_efetivo_terceiro FOR UPDATE USING (true);
CREATE POLICY "Permitir delete efetivo terceiro" ON public.rdo_efetivo_terceiro FOR DELETE USING (true);

CREATE POLICY "Permitir leitura total manutencoes" ON public.patrimonio_manutencoes FOR SELECT USING (true);
CREATE POLICY "Permitir insercao manutencoes" ON public.patrimonio_manutencoes FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir update manutencoes" ON public.patrimonio_manutencoes FOR UPDATE USING (true);
CREATE POLICY "Permitir delete manutencoes" ON public.patrimonio_manutencoes FOR DELETE USING (true);
