import { supabase } from "@/integrations/supabase/client";

export interface BackupData {
  version: string;
  timestamp: string;
  obras: any[];
  obra_torres: any[];
  torre_andares: any[];
  obra_pavimentos: any[];
  obra_ambientes: any[];
  apontamentos: any[];
  apontamento_fotos: any[];
  apontamento_comentarios: any[];
  obra_pendencias: any[];
  rdos: any[];
  // Tabelas associadas ao RDO
  rdo_atividades: any[];
  rdo_checklist_epi: any[];
  rdo_clima: any[];
  rdo_comentarios: any[];
  rdo_equipamentos: any[];
  rdo_mao_de_obra: any[];
  rdo_materiais: any[];
  rdo_midias: any[];
  rdo_ocorrencias: any[];
  rdo_assinatura: any[];
  rdo_anexos: any[];
  // Outros módulos
  obra_fotografia_itens: any[];
  obra_documentos: any[];
}

/**
 * Realiza o download completo (Full Dump) estrutural de todas as obras
 * em formato JSON para garantir 100% de retenção de dados.
 */
export async function exportFullBackup(): Promise<Blob> {
  const backup: Partial<BackupData> = {
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  };

  // 1. Obras base
  const { data: obras } = await supabase.from("obras").select("*");
  backup.obras = obras || [];

  if (!backup.obras.length) {
    return new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  }

  const obraIds = backup.obras.map(o => o.id);

  // 2. Torres e Pavimentos
  const { data: torres } = await supabase.from("obra_torres").select("*").in("obra_id", obraIds);
  backup.obra_torres = torres || [];
  
  const { data: pavimentos } = await supabase.from("obra_pavimentos").select("*").in("torre_id", (torres||[]).map(t => t.id));
  backup.obra_pavimentos = pavimentos || [];

  const { data: andares } = await supabase.from("torre_andares").select("*").in("torre_id", (torres||[]).map(t => t.id));
  backup.torre_andares = andares || [];

  const { data: ambientes } = await supabase.from("obra_ambientes").select("*").in("pavimento_id", (pavimentos||[]).map(p => p.id));
  backup.obra_ambientes = ambientes || [];

  // 3. Apontamentos
  const { data: apontamentos } = await supabase.from("apontamentos").select("*").in("andar_id", (andares||[]).map(a => a.id));
  backup.apontamentos = apontamentos || [];

  if (backup.apontamentos.length > 0) {
    const apIds = backup.apontamentos.map(a => a.id);
    const { data: fotos } = await supabase.from("apontamento_fotos").select("*").in("apontamento_id", apIds);
    backup.apontamento_fotos = fotos || [];

    const { data: coms } = await supabase.from("apontamento_comentarios").select("*").in("apontamento_id", apIds);
    backup.apontamento_comentarios = coms || [];
  } else {
    backup.apontamento_fotos = [];
    backup.apontamento_comentarios = [];
  }

  // 4. Pendencias (FVS)
  const { data: pendencias } = await supabase.from("obra_pendencias").select("*").in("ambiente_id", (ambientes||[]).map(a => a.id));
  backup.obra_pendencias = pendencias || [];

  // 5. RDOs
  const { data: rdos } = await supabase.from("rdos").select("*").in("obra_id", obraIds);
  backup.rdos = rdos || [];

  if (backup.rdos.length > 0) {
    const rdoIds = backup.rdos.map(r => r.id);
    
    const [
      atividades, epi, clima, rComs, equip, mao, mat, mid, ocor, ass, anex
    ] = await Promise.all([
      supabase.from("rdo_atividades").select("*").in("rdo_id", rdoIds),
      supabase.from("rdo_checklist_epi").select("*").in("rdo_id", rdoIds),
      supabase.from("rdo_clima").select("*").in("rdo_id", rdoIds),
      supabase.from("rdo_comentarios").select("*").in("rdo_id", rdoIds),
      supabase.from("rdo_equipamentos").select("*").in("rdo_id", rdoIds),
      supabase.from("rdo_mao_de_obra").select("*").in("rdo_id", rdoIds),
      supabase.from("rdo_materiais").select("*").in("rdo_id", rdoIds),
      supabase.from("rdo_midias").select("*").in("rdo_id", rdoIds),
      supabase.from("rdo_ocorrencias").select("*").in("rdo_id", rdoIds),
      supabase.from("rdo_assinatura").select("*").in("rdo_id", rdoIds),
      supabase.from("rdo_anexos").select("*").in("rdo_id", rdoIds),
    ]);

    backup.rdo_atividades = atividades.data || [];
    backup.rdo_checklist_epi = epi.data || [];
    backup.rdo_clima = clima.data || [];
    backup.rdo_comentarios = rComs.data || [];
    backup.rdo_equipamentos = equip.data || [];
    backup.rdo_mao_de_obra = mao.data || [];
    backup.rdo_materiais = mat.data || [];
    backup.rdo_midias = mid.data || [];
    backup.rdo_ocorrencias = ocor.data || [];
    backup.rdo_assinatura = ass.data || [];
    backup.rdo_anexos = anex.data || [];
  } else {
    backup.rdo_atividades = [];
    backup.rdo_checklist_epi = [];
    backup.rdo_clima = [];
    backup.rdo_comentarios = [];
    backup.rdo_equipamentos = [];
    backup.rdo_mao_de_obra = [];
    backup.rdo_materiais = [];
    backup.rdo_midias = [];
    backup.rdo_ocorrencias = [];
    backup.rdo_assinatura = [];
    backup.rdo_anexos = [];
  }

  // 6. Outros
  const { data: fotosObra } = await supabase.from("obra_fotografia_itens").select("*").in("obra_id", obraIds);
  backup.obra_fotografia_itens = fotosObra || [];
  
  const { data: docs } = await supabase.from("obra_documentos").select("*").in("obra_id", obraIds);
  backup.obra_documentos = docs || [];

  return new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
}

/**
 * Restaura dados a partir de um backup em JSON.
 * Como as tabelas tem chaves estrangeiras, a ordem de inserção importa.
 */
export async function importFullBackup(jsonContent: string): Promise<void> {
  const data: BackupData = JSON.parse(jsonContent);

  if (!data.obras || !data.version) {
    throw new Error("Arquivo de backup inválido ou corrompido.");
  }

  // 1. Obras base (Fazemos upsert para não quebrar em IDs já existentes)
  if (data.obras.length) {
      const { error } = await supabase.from("obras").upsert(data.obras);
      if (error) throw error;
  }

  // 2. Estruturas da Obra
  if (data.obra_torres?.length) await supabase.from("obra_torres").upsert(data.obra_torres);
  if (data.obra_pavimentos?.length) await supabase.from("obra_pavimentos").upsert(data.obra_pavimentos);
  if (data.torre_andares?.length) await supabase.from("torre_andares").upsert(data.torre_andares);
  if (data.obra_ambientes?.length) await supabase.from("obra_ambientes").upsert(data.obra_ambientes);

  // 3. Apontamentos e Pendencias
  if (data.apontamentos?.length) await supabase.from("apontamentos").upsert(data.apontamentos);
  if (data.apontamento_fotos?.length) await supabase.from("apontamento_fotos").upsert(data.apontamento_fotos);
  if (data.apontamento_comentarios?.length) await supabase.from("apontamento_comentarios").upsert(data.apontamento_comentarios);
  if (data.obra_pendencias?.length) await supabase.from("obra_pendencias").upsert(data.obra_pendencias);

  // 4. RDOs e Subtabelas
  if (data.rdos?.length) await supabase.from("rdos").upsert(data.rdos);
  
  if (data.rdo_atividades?.length) await supabase.from("rdo_atividades").upsert(data.rdo_atividades);
  if (data.rdo_checklist_epi?.length) await supabase.from("rdo_checklist_epi").upsert(data.rdo_checklist_epi);
  if (data.rdo_clima?.length) await supabase.from("rdo_clima").upsert(data.rdo_clima);
  if (data.rdo_comentarios?.length) await supabase.from("rdo_comentarios").upsert(data.rdo_comentarios);
  if (data.rdo_equipamentos?.length) await supabase.from("rdo_equipamentos").upsert(data.rdo_equipamentos);
  if (data.rdo_mao_de_obra?.length) await supabase.from("rdo_mao_de_obra").upsert(data.rdo_mao_de_obra);
  if (data.rdo_materiais?.length) await supabase.from("rdo_materiais").upsert(data.rdo_materiais);
  if (data.rdo_midias?.length) await supabase.from("rdo_midias").upsert(data.rdo_midias);
  if (data.rdo_ocorrencias?.length) await supabase.from("rdo_ocorrencias").upsert(data.rdo_ocorrencias);
  if (data.rdo_assinatura?.length) await supabase.from("rdo_assinatura").upsert(data.rdo_assinatura);
  if (data.rdo_anexos?.length) await supabase.from("rdo_anexos").upsert(data.rdo_anexos);

  // 5. Outros
  if (data.obra_fotografia_itens?.length) await supabase.from("obra_fotografia_itens").upsert(data.obra_fotografia_itens);
  if (data.obra_documentos?.length) await supabase.from("obra_documentos").upsert(data.obra_documentos);
}
