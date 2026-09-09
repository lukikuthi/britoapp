-- ==========================================
-- UPDATE ERP V7 - FECHAMENTO DE QUALIDADE E FLUXO
-- ==========================================

-- 1. Controle Tecnológico de Concretagem
ALTER TABLE public.obra_concretagem 
ADD COLUMN IF NOT EXISTS fck_7dias NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS fck_28dias NUMERIC(10,2);

-- 2. Ficha de EPI Assinada Eletronicamente
ALTER TABLE public.sesmt_epis
ADD COLUMN IF NOT EXISTS assinatura_base64 TEXT;

-- (Opcional) Tabela caso as pessoas queiram dar upload da ficha de EPI em PDF posteriormente.
-- Já temos 'anexo_url', que serve perfeitamente para arquivos físicos digitalizados.
