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
  addImageFitted,
  getPdfLogoBase64
} from "@/lib/pdf-image-utils";
import { appendApontamentosToPdf } from "@/lib/pdf-apontamentos";

export async function generateRdoPdf(rdo: any, sections: any, obraId: string, appendApontamentos: boolean = true): Promise<Blob> {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const dateStr = format(new Date(), "dd/MM/yyyy HH:mm:ss");
  
  // Buscar Obra
  const { data: obra } = await supabase.from("obras").select("nome, endereco").eq("id", obraId).single();
  const obraNome = obra?.nome || "Obra";
  
  // CAPA: Issue Reporting Style
  const logoUrl = await getPdfLogoBase64();
  if (logoUrl) {
    const { width, height } = await getImageDimensions(logoUrl);
    const fit = fitImageInBox(width, height, 40, 15);
    doc.addImage(logoUrl, "PNG", 15, 10, fit.width, fit.height);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 0);
  const rdoTitle = rdo.tipo === 'semanal' ? "RDO Semanal" : "RDO Diário";
  doc.text(rdoTitle, pageWidth - 15, 20, { align: "right" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Criado em: ${dateStr}`, pageWidth - 15, 26, { align: "right" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("General Information", 15, 45);

  autoTable(doc, {
    startY: 50,
    head: [],
    body: [
      ["ProjectName", obraNome],
      ["Date", format(new Date(rdo.data), "dd/MM/yyyy")],
      ["Sequence", `#${rdo.numero_sequencial}`],
      ["Status", rdo.status.toUpperCase()],
      ["Type", rdo.tipo.toUpperCase()]
    ],
    theme: 'plain',
    styles: { cellPadding: 3, fontSize: 10, lineColor: [200, 200, 200], lineWidth: 0.1 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 100 }
    }
  });

  let currentY = (doc as any).lastAutoTable.finalY + 15;

  const tableTheme = {
    theme: 'plain' as const,
    styles: { cellPadding: 3, fontSize: 9, lineColor: [220, 220, 220] as [number, number, number], lineWidth: 0.1 },
    headStyles: { fillColor: [240, 240, 240] as [number, number, number], textColor: [0, 0, 0] as [number, number, number], fontStyle: 'bold' as const }
  };

  // Mão de Obra
  if (sections.maoObra && sections.maoObra.length > 0) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Mão de Obra", 15, currentY);
    autoTable(doc, {
      startY: currentY + 3,
      head: [["Função", "Qtd", "Tipo", "Observação"]],
      body: sections.maoObra.map((item: any) => [
        item.funcao, 
        item.quantidade.toString(), 
        item.tipo, 
        item.observacao || ""
      ]),
      ...tableTheme
    });
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }

  // Equipamentos
  if (sections.equipamentos && sections.equipamentos.length > 0) {
    if (currentY > pageHeight - 40) { doc.addPage(); currentY = 20; }
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Equipamentos", 15, currentY);
    autoTable(doc, {
      startY: currentY + 3,
      head: [["Equipamento", "Qtd", "Status", "Horímetro", "Motivo", "Obs"]],
      body: sections.equipamentos.map((item: any) => [
        item.nome, 
        item.quantidade.toString(), 
        item.status, 
        item.horimetro || "-",
        item.motivo_parada || "-",
        item.observacao || ""
      ]),
      ...tableTheme
    });
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }

  // Atividades
  if (sections.atividades && sections.atividades.length > 0) {
    if (currentY > pageHeight - 40) { doc.addPage(); currentY = 20; }
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Atividades Realizadas", 15, currentY);
    autoTable(doc, {
      startY: currentY + 3,
      head: [["Atividade", "Local", "Status", "Avanço"]],
      body: sections.atividades.map((item: any) => [
        item.descricao, 
        item.local || "-", 
        item.status, 
        item.percentual_conclusao ? `${item.percentual_conclusao}%` : "-"
      ]),
      ...tableTheme
    });
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }

  // Comentários
  if (sections.comentarios && sections.comentarios.length > 0) {
    if (currentY > pageHeight - 40) { doc.addPage(); currentY = 20; }
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Comentários", 15, currentY);
    autoTable(doc, {
      startY: currentY + 3,
      head: [["Comentário", "Tipo"]],
      body: sections.comentarios.map((item: any) => [
        item.texto, 
        item.tipo_comentario
      ]),
      ...tableTheme
    });
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }

  // Ocorrências
  if (sections.ocorrencias && sections.ocorrencias.length > 0) {
    if (currentY > pageHeight - 40) { doc.addPage(); currentY = 20; }
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Ocorrências", 15, currentY);
    autoTable(doc, {
      startY: currentY + 3,
      head: [["Ocorrência", "Gravidade", "Impacto", "Status", "Ação"]],
      body: sections.ocorrencias.map((item: any) => [
        item.descricao, 
        item.gravidade, 
        item.impacto, 
        item.status,
        item.acao_tomada || "-"
      ]),
      ...tableTheme
    });
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }

  // FVS (Fichas de Verificação de Serviço)
  if (sections.fvs && sections.fvs.length > 0) {
    if (currentY > pageHeight - 40) { doc.addPage(); currentY = 20; }
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Checklists de Qualidade (FVS)", 15, currentY);
    autoTable(doc, {
      startY: currentY + 3,
      head: [["Ficha de Verificação", "Status"]],
      body: sections.fvs.map((item: any) => [
        item.template?.nome || "FVS", 
        item.status === 'concluido' ? 'Concluída' : 'Rascunho'
      ]),
      ...tableTheme
    });
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }

  // Assinaturas
  if (sections.assinatura && sections.assinatura.length > 0) {
    if (currentY > pageHeight - 60) { doc.addPage(); currentY = 20; }
    const ass = sections.assinatura[0]; // Relação 1:1
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Assinatura do Responsável", 15, currentY);
    
    // Draw signature image if present
    if (ass.assinatura_png) {
      try {
        const fmt = getImageFormatFromDataUrl(ass.assinatura_png) || "PNG";
        const dims = await getImageDimensions(ass.assinatura_png);
        const fit = fitImageInBox(dims.width, dims.height, 60, 25);
        doc.addImage(ass.assinatura_png, fmt, 15, currentY + 5, fit.width, fit.height);
      } catch (e) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        doc.text("[Erro ao carregar imagem da assinatura]", 15, currentY + 15);
      }
    }
    
    // Draw line
    doc.setDrawColor(200, 200, 200);
    doc.line(15, currentY + 32, 75, currentY + 32);
    
    // Name and date
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(ass.nome_assinante, 15, currentY + 37);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(format(new Date(ass.assinado_em), "dd/MM/yyyy HH:mm"), 15, currentY + 41);
    doc.setTextColor(0, 0, 0);
    
    currentY += 50;
  }
  
  // Footer on cover page
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Criado em: ${dateStr}`, 15, pageHeight - 15);
  doc.text(`Criado por: Sistema`, 15, pageHeight - 10);

  // Mídias (Galeria de Fotos do RDO)
  if (sections.midias && sections.midias.length > 0) {
    const photoBoxW = 182;
    const photoBoxH = 120;
    let photosCount = 0;

    for (const midia of sections.midias) {
      if (midia.tipo !== "imagem") continue;
      
      doc.addPage("a4", "p");
      photosCount++;
      
      // Header da página de mídia
      doc.setFillColor(216, 234, 246);
      doc.rect(0, 0, pageWidth, 25, "F");
      if (logoUrl) {
        const { width, height } = await getImageDimensions(logoUrl);
        const fit = fitImageInBox(width, height, 30, 10);
        doc.addImage(logoUrl, "PNG", 15, 7, fit.width, fit.height);
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0, 43, 91);
      doc.text("Registro Fotográfico", pageWidth - 15, 16, { align: "right" });
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(obraNome, 15, 35);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`RDO #${rdo.numero_sequencial} — ${format(new Date(rdo.data), "dd/MM/yyyy")}`, 15, 41);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(midia.legenda || `Foto ${photosCount}`, 15, 55);

      let y = 60;
      try {
        const { data: urlData } = supabase.storage.from("rdo-midias").getPublicUrl(midia.storage_path);
        const imgData = await fetchImageAsBase64(urlData.publicUrl);
        await addImageFitted(doc, imgData, 15, y, photoBoxW, photoBoxH);
      } catch {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.text("[Imagem não disponível]", 15, y);
      }
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Criado em: ${dateStr}`, 15, pageHeight - 15);
      doc.text(`Página ${doc.internal.pages.length - 1}`, pageWidth - 15, pageHeight - 10, { align: "right" });
    }
  }

  // Append Apontamentos
  if (appendApontamentos) {
    await appendApontamentosToPdf(doc, obraId, {}, "Apontamentos e Plantas", true);
  }

  return doc.output("blob");
}
