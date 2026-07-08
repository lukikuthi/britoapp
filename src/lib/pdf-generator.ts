import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { 
  addPdfBrandedHeader, 
  fetchImageAsBase64, 
  getImageDimensions, 
  getImageFormatFromDataUrl, 
  fitImageInBox,
  addImageFitted
} from "@/lib/pdf-image-utils";

export async function generateRdoPdf(rdo: any, sections: any, obraId: string): Promise<Blob> {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.width;
  
  // Buscar Obra
  const { data: obra } = await supabase.from("obras").select("nome, endereco").eq("id", obraId).single();
  const obraNome = obra?.nome || "Obra Não Encontrada";
  
  // Header
  doc.setFillColor(41, 128, 185); // Blue
  doc.rect(0, 0, pageWidth, 25, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text("Relatório Diário de Obra", 15, 16);
  
  doc.setFontSize(10);
  doc.text(`RDO #${rdo.numero_sequencial}`, pageWidth - 15, 16, { align: "right" });

  // Info base
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.text(`Data: ${format(new Date(rdo.data), "dd/MM/yyyy")}`, 15, 35);
  doc.text(`Status: ${rdo.status.toUpperCase()}`, 15, 42);

  // Clima
  if (sections.clima && sections.clima.length > 0) {
    doc.setFontSize(12);
    doc.text("Condições Climáticas", 15, currentY);
    autoTable(doc, {
      startY: currentY + 5,
      head: [["Período", "Condição", "Praticável", "Impacta Prazo?"]],
      body: sections.clima.map((item: any) => [
        item.periodo.toUpperCase(), 
        item.condicao.toUpperCase(), 
        item.praticavel ? "Sim" : "Não", 
        item.impacta_prazo ? "SIM" : "Não"
      ]),
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      didParseCell: function(data) {
        if (data.section === 'body' && data.column.index === 3 && data.cell.raw === 'SIM') {
          data.cell.styles.textColor = [220, 53, 53];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }

  // Mão de Obra
  if (sections.maoObra && sections.maoObra.length > 0) {
    doc.setFontSize(12);
    doc.text("Mão de Obra", 15, currentY);
    autoTable(doc, {
      startY: currentY + 5,
      head: [["Função", "Quantidade", "Tipo", "Observação"]],
      body: sections.maoObra.map((item: any) => [
        item.funcao, 
        item.quantidade.toString(), 
        item.tipo, 
        item.observacao || ""
      ]),
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] }
    });
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }

  // Equipamentos
  if (sections.equipamentos && sections.equipamentos.length > 0) {
    doc.setFontSize(12);
    doc.text("Equipamentos", 15, currentY);
    autoTable(doc, {
      startY: currentY + 5,
      head: [["Equipamento", "Qtd", "Status", "Horímetro", "Motivo Parada", "Obs"]],
      body: sections.equipamentos.map((item: any) => [
        item.nome, 
        item.quantidade.toString(), 
        item.status, 
        item.horimetro || "-",
        item.motivo_parada || "-",
        item.observacao || ""
      ]),
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] }
    });
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }

  // Atividades / EAP
  if (sections.atividades && sections.atividades.length > 0) {
    doc.setFontSize(12);
    doc.text("Atividades (Avanço Físico - EAP)", 15, currentY);
    autoTable(doc, {
      startY: currentY + 5,
      head: [["Descrição", "Progresso", "Status", "Observação"]],
      body: sections.atividades.map((item: any) => [
        item.descricao, 
        `${item.progresso_pct}%`, 
        item.status, 
        item.observacao || ""
      ]),
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] }
    });
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }

  // Ocorrências
  if (sections.ocorrencias && sections.ocorrencias.length > 0) {
    doc.setFontSize(12);
    doc.text("Ocorrências e Interferências", 15, currentY);
    autoTable(doc, {
      startY: currentY + 5,
      head: [["Descrição", "Gravidade", "Resolvido?", "Impacta Prazo?"]],
      body: sections.ocorrencias.map((item: any) => [
        item.descricao, 
        item.gravidade.toUpperCase(), 
        item.resolvido ? "Sim" : "Não", 
        item.impacta_prazo ? "SIM (CRÍTICO)" : "Não"
      ]),
      theme: 'grid',
      headStyles: { fillColor: [220, 53, 53] }, // Red header for occurrences
      didParseCell: function(data) {
        if (data.section === 'body' && data.column.index === 3 && data.cell.raw === 'SIM (CRÍTICO)') {
          data.cell.styles.textColor = [220, 53, 53];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }

  // Checklists de Qualidade (FVS)
  if (sections.fvs && sections.fvs.length > 0) {
    doc.setFontSize(12);
    doc.text("Checklists de Qualidade (FVS)", 15, currentY);
    autoTable(doc, {
      startY: currentY + 5,
      head: [["Ficha de Verificação", "Status"]],
      body: sections.fvs.map((item: any) => [
        item.template?.nome || "FVS", 
        item.status === 'concluido' ? 'Concluída' : 'Rascunho'
      ]),
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] }
    });
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }

  // ==========================================
  // Fotografias
  // ==========================================
  if (sections.midias && sections.midias.length > 0) {
    const photoBoxW = 182;
    const photoBoxH = 120;
    let photosCount = 0;

    for (const midia of sections.midias) {
      if (midia.tipo !== "imagem") continue;
      
      doc.addPage("a4", "p");
      photosCount++;
      
      await addPdfBrandedHeader(doc, "Registro fotográfico do RDO");

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(obraNome, 14, 35);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`RDO #${rdo.numero_sequencial} — ${format(new Date(rdo.data), "dd/MM/yyyy")}`, 14, 41);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(midia.legenda || `Foto ${photosCount}`, 14, 58);

      let y = 64;
      try {
        const { data: urlData } = supabase.storage.from("rdo-midias").getPublicUrl(midia.storage_path);
        const imgData = await fetchImageAsBase64(urlData.publicUrl);
        await addImageFitted(doc, imgData, 14, y, photoBoxW, photoBoxH);
      } catch {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.text("[Imagem não disponível]", 14, y);
      }
    }
  }

  // ==========================================
  // Plantas e Apontamentos
  // ==========================================
  if (sections.andaresSelecionados && sections.andaresSelecionados.length > 0) {
    // Buscar todos os andares selecionados com dados da torre
    const andarIds = sections.andaresSelecionados.map((s: any) => s.andar_id);
    
    // Precisamos de torre_andares -> obra_torres e torre_grupos_andar
    const { data: andaresData } = await supabase
      .from("torre_andares" as any)
      .select(`
        id, numero_andar, apelido,
        obra_torres!inner ( nome ),
        torre_grupos_andar!inner ( planta_storage_path )
      `)
      .in("id", andarIds);

    if (andaresData && andaresData.length > 0) {
      // Buscar apontamentos para esses andares
      const { data: apontamentosData } = await supabase
        .from("apontamentos" as any)
        .select("*")
        .in("andar_id", andarIds);

      const PAGE_W = 297; // A4 landscape
      const PAGE_H = 210;
      const MARGIN = 14;
      const IMAGE_AREA_W = (PAGE_W - MARGIN * 2 - 8) * 0.60;
      const LEGEND_X = MARGIN + IMAGE_AREA_W + 8;
      
      for (const andar of andaresData) {
        doc.addPage("a4", "landscape");

        // Header
        doc.setFillColor(0, 43, 91);
        doc.rect(0, 0, PAGE_W, 25, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("BRITO ENGENHARIA", MARGIN, 12);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Apontamentos Visuais — Anexo RDO", MARGIN, 20);
        doc.setTextColor(0, 0, 0);

        // Sub-header
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(obraNome, MARGIN, 32);
        
        const floorLabel = andar.apelido || `Andar ${andar.numero_andar}`;
        const torreNome = andar.obra_torres?.nome || "Torre";
        doc.setFontSize(10);
        doc.text(`${torreNome} — ${floorLabel}`, MARGIN, 40);

        const plantaPath = andar.torre_grupos_andar?.planta_storage_path;
        let imgX = MARGIN;
        let imgY = 44;
        let imgW = IMAGE_AREA_W;
        let imgH = PAGE_H - 10 - imgY;
        let imgDrawn = false;

        if (plantaPath) {
          try {
            const { data: urlData } = await supabase.storage.from("plantas-baixa").createSignedUrl(plantaPath, 60);
            if (urlData?.signedUrl) {
              const imgData = await fetchImageAsBase64(urlData.signedUrl);
              const dims = await getImageDimensions(imgData);
              const fit = fitImageInBox(dims.width, dims.height, IMAGE_AREA_W, imgH);
              const fmt = getImageFormatFromDataUrl(imgData);

              imgX = MARGIN + fit.offsetX;
              imgY = 44 + fit.offsetY;
              imgW = fit.width;
              imgH = fit.height;

              doc.addImage(imgData, fmt, imgX, imgY, imgW, imgH);
              imgDrawn = true;
              
              doc.setDrawColor(200, 200, 200);
              doc.setLineWidth(0.3);
              doc.rect(imgX, imgY, imgW, imgH, "S");
            }
          } catch (err) {
            doc.setFont("helvetica", "italic");
            doc.setFontSize(9);
            doc.text("[Erro ao carregar planta]", MARGIN + 4, 50);
          }
        } else {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(9);
          doc.text("[Sem planta cadastrada]", MARGIN + 4, 50);
        }

        const aptsAndar = (apontamentosData || []).filter((a: any) => a.andar_id === andar.id);
        
        // Draw markers
        if (imgDrawn) {
          aptsAndar.forEach((ap: any, idx: number) => {
            const num = idx + 1;
            const mx = imgX + ap.pos_x * imgW;
            const my = imgY + ap.pos_y * imgH;
            
            if (ap.status === "resolvido") doc.setFillColor(34, 139, 34);
            else doc.setFillColor(220, 53, 53);
            doc.circle(mx, my, 3.5, "F");
            
            doc.setDrawColor(255, 255, 255);
            doc.setLineWidth(0.5);
            doc.circle(mx, my, 3.5, "S");
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(7);
            doc.setFont("helvetica", "bold");
            doc.text(String(num), mx, my + 1.2, { align: "center" });
            doc.setTextColor(0, 0, 0);
          });
        }

        // Legend
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("Legenda", LEGEND_X, 44);
        
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setFillColor(220, 53, 53);
        doc.circle(LEGEND_X + 2, 49, 2, "F");
        doc.text("Aberto", LEGEND_X + 6, 50);
        
        doc.setFillColor(34, 139, 34);
        doc.circle(LEGEND_X + 28, 49, 2, "F");
        doc.text("Resolvido", LEGEND_X + 32, 50);

        doc.setDrawColor(200, 200, 200);
        doc.line(LEGEND_X, 53, PAGE_W - MARGIN, 53);

        let legY = 58;
        aptsAndar.forEach((ap: any, idx: number) => {
          if (legY > PAGE_H - 15) return; // Prevent overflow
          const num = idx + 1;
          
          if (ap.status === "resolvido") doc.setFillColor(34, 139, 34);
          else doc.setFillColor(220, 53, 53);
          
          doc.circle(LEGEND_X + 2, legY - 1, 2.5, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(6);
          doc.setFont("helvetica", "bold");
          doc.text(String(num), LEGEND_X + 2, legY - 0.2, { align: "center" });
          
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          
          const maxW = PAGE_W - MARGIN - LEGEND_X - 8;
          const textLines = doc.splitTextToSize(ap.descricao, maxW);
          doc.text(textLines, LEGEND_X + 6, legY);
          
          legY += 2 + (textLines.length * 3.5);
        });
      }
    }
  }

  return doc.output("blob");
}
