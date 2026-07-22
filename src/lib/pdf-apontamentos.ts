import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { getPdfLogoBase64, fitImageInBox, getImageDimensions, getImageFormatFromDataUrl } from "@/lib/pdf-image-utils";

async function getImageUrl(path: string) {
  const { data } = supabase.storage.from("apontamentos").getPublicUrl(path);
  return data.publicUrl;
}

async function getBase64FromUrl(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function drawHeaderAndFooter(doc: jsPDF, obraNome: string, dateStr: string, pageNum: number, pageWidth: number, pageHeight: number) {
  // Header
  doc.setFillColor(216, 234, 246); // Light blue
  doc.rect(0, 0, pageWidth, 25, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(0, 43, 91);
  doc.text("Relatório Site com Desenhos", 50, 12);
  doc.setFont("helvetica", "normal");
  doc.text(obraNome, 50, 18);

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(dateStr, 15, pageHeight - 10);
  doc.text(pageNum.toString(), pageWidth - 15, pageHeight - 10, { align: "right" });
}

export async function generateApontamentosPdf(
  obraId: string, 
  filtros: any, 
  nomeRelatorio: string
): Promise<Blob> {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const dateStr = format(new Date(), "dd/MM/yyyy HH:mm:ss");

  // 1. Fetch Data
  const { data: obra } = await supabase.from("obras").select("nome").eq("id", obraId).single();
  const obraNome = obra?.nome || "Obra";

  // CAPA: Issue Reporting
  const logoUrl = await getPdfLogoBase64();
  if (logoUrl) {
    const { width, height } = await getImageDimensions(logoUrl);
    const fit = fitImageInBox(width, height, 40, 15);
    doc.addImage(logoUrl, "PNG", 15, 10, fit.width, fit.height);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 0);
  doc.text("Issue Reporting", pageWidth - 15, 20, { align: "right" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(dateStr, pageWidth - 15, 26, { align: "right" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("General Information", 15, 45);

  autoTable(doc, {
    startY: 50,
    head: [],
    body: [
      ["ProjectName", obraNome],
      ["Contract No", "-"],
      ["Program", "-"],
      ["Division", "-"],
      ["Region", "-"]
    ],
    theme: 'plain',
    styles: { cellPadding: 3, fontSize: 10, lineColor: [200, 200, 200], lineWidth: 0.1 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 100 }
    }
  });

  let currentY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFillColor(240, 240, 240);
  doc.rect(15, currentY, pageWidth - 30, 25, "F");
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Current Filters", 20, currentY + 8);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Desenho: Todos os Pavimentos", 20, currentY + 16);

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Created On: ${dateStr}`, 15, pageHeight - 15);
  doc.text(`Created By: Sistema`, 15, pageHeight - 10);

  // 2. Fetch Tree Data
  // To avoid deep nested select issues, let's fetch flat and group in JS.
  const { data: ambientesRaw } = await supabase
    .from("obra_ambientes")
    .select(`
      id, nome, planta_storage_path, pavimento_id,
      obra_pavimentos!inner ( id, numero_andar, torre_id, obra_torres!inner ( id, nome, obra_id ) )
    `)
    .eq("obra_pavimentos.obra_torres.obra_id", obraId)
    .not("planta_storage_path", "is", null);

  if (!ambientesRaw) return doc.output("blob");

  const ambienteIds = ambientesRaw.map(a => a.id);
  
  let pendenciasData: any[] = [];
  if (ambienteIds.length > 0) {
    const { data: pends } = await supabase
      .from("obra_pendencias")
      .select("*")
      .in("ambiente_id", ambienteIds)
      .order("created_at", { ascending: true });
    if (pends) pendenciasData = pends;
  }

  // 3. Render Pages for each Ambiente with Pendencias
  for (const ambiente of ambientesRaw) {
    const pends = pendenciasData.filter(p => p.ambiente_id === ambiente.id);
    if (pends.length === 0) continue; // Skip if no pendencies

    const regionName = `Ambiente: ${ambiente.nome}`;

    // --- Page: Planta ---
    doc.addPage();
    let pageNum = 1;
    if (logoUrl) {
        const { width, height } = await getImageDimensions(logoUrl);
        const fit = fitImageInBox(width, height, 30, 10);
        doc.addImage(logoUrl, "PNG", 15, 7, fit.width, fit.height);
    }
    drawHeaderAndFooter(doc, obraNome, dateStr, pageNum, pageWidth, pageHeight);
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Titulo Relatório:", 15, 35);
    doc.text("Drawing Region:", 15, 40);
    
    doc.setTextColor(0, 0, 0);
    doc.text(nomeRelatorio, 45, 35);
    doc.text(regionName, 45, 40);

    // Draw Floor Plan Image
    try {
      const url = await getImageUrl(ambiente.planta_storage_path!);
      const base64 = await getBase64FromUrl(url);
      const format = getImageFormatFromDataUrl(base64);
      
      const imgW = 180;
      const imgH = 200;
      const startX = 15;
      const startY = 45;
      
      const dims = await getImageDimensions(base64);
      const fit = fitImageInBox(dims.width, dims.height, imgW, imgH);
      const finalX = startX + fit.offsetX;
      const finalY = startY + fit.offsetY;

      doc.addImage(base64, format, finalX, finalY, fit.width, fit.height);

      // Draw Pins
      pends.forEach((pend) => {
        if (pend.pos_x != null && pend.pos_y != null) {
          const pinX = finalX + (pend.pos_x * fit.width);
          const pinY = finalY + (pend.pos_y * fit.height);
          
          // Pin Body
          doc.setFillColor(pend.status === 'resolvida' ? 128 : 239, 68, 68); // Red or Gray
          doc.ellipse(pinX, pinY, 5, 3, "F");
          
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(6);
          doc.setFont("helvetica", "bold");
          doc.text(pend.codigo, pinX, pinY + 1, { align: "center" });

          // Con/Empreiteira Tag
          if (pend.empreiteira) {
            doc.setFillColor(200, 0, 0); // Darker red for tag
            doc.rect(pinX - 5, pinY + 3.5, 10, 3, "F");
            doc.text(pend.empreiteira.substring(0, 3).toUpperCase(), pinX, pinY + 5.5, { align: "center" });
          }
        }
      });
    } catch (e) {
      console.error("Failed to draw planta", e);
      doc.text("[Erro ao carregar imagem da planta]", 15, 50);
    }

    // --- Pages: Detalhes ---
    doc.addPage();
    pageNum++;
    if (logoUrl) {
        const { width, height } = await getImageDimensions(logoUrl);
        const fit = fitImageInBox(width, height, 30, 10);
        doc.addImage(logoUrl, "PNG", 15, 7, fit.width, fit.height);
    }
    drawHeaderAndFooter(doc, obraNome, dateStr, pageNum, pageWidth, pageHeight);

    let listY = 35;
    for (const pend of pends) {
      if (listY > pageHeight - 60) {
        doc.addPage();
        pageNum++;
        if (logoUrl) {
            const { width, height } = await getImageDimensions(logoUrl);
            const fit = fitImageInBox(width, height, 30, 10);
            doc.addImage(logoUrl, "PNG", 15, 7, fit.width, fit.height);
        }
        drawHeaderAndFooter(doc, obraNome, dateStr, pageNum, pageWidth, pageHeight);
        listY = 35;
      }

      // Divider
      doc.setDrawColor(200, 200, 200);
      doc.line(15, listY - 5, pageWidth - 15, listY - 5);

      // Left Column: Details
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(pend.codigo, 15, listY);
      doc.setFont("helvetica", "normal");
      doc.text(`Ambiente: ${ambiente.nome}`, 30, listY);

      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(pend.categoria_taxonomia || "Categoria não definida", 30, listY + 5);
      
      doc.setTextColor(0, 0, 0);
      const splitDesc = doc.splitTextToSize(pend.descricao, 100);
      doc.text(splitDesc, 30, listY + 11);
      
      let nextLineY = listY + 11 + (splitDesc.length * 4);

      if (pend.pos_x != null && pend.pos_y != null) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(150, 150, 150);
        doc.text(`x:${Math.round(pend.pos_x * 1000)} y:${Math.round(pend.pos_y * 1000)}`, 15, listY + 8);
      }

      // Metadata line
      const prazoDate = pend.prazo ? new Date(pend.prazo) : new Date();
      const diasRestantes = differenceInDays(prazoDate, new Date());
      
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text("Realizado:", 15, nextLineY);
      doc.setTextColor(0, 0, 0);
      doc.text(format(prazoDate, "EEE, dd MMM yyyy", { locale: ptBR }), 30, nextLineY);

      doc.setTextColor(100, 100, 100);
      doc.text("Dias restantes:", 80, nextLineY);
      doc.setTextColor(diasRestantes < 0 ? 255 : 100, diasRestantes < 0 ? 0 : 100, diasRestantes < 0 ? 0 : 100);
      doc.text(diasRestantes.toString(), 105, nextLineY);

      // Status Badge
      const isResolved = pend.status === 'resolvida';
      doc.setFillColor(isResolved ? 34 : 249, isResolved ? 197 : 115, isResolved ? 94 : 22); // Green or Orange
      doc.rect(120, nextLineY - 3, 20, 5, "F");
      doc.setTextColor(255, 255, 255);
      doc.text(isResolved ? "Fixed" : "Open", 130, nextLineY + 0.5, { align: "center" });

      doc.setTextColor(100, 100, 100);
      doc.text("Con:", 15, nextLineY + 6);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text(pend.empreiteira || "-", 30, nextLineY + 6);

      // Right Column: Photo
      if (pend.foto_path) {
        try {
          const photoUrl = await getImageUrl(pend.foto_path);
          const photoB64 = await getBase64FromUrl(photoUrl);
          const format = getImageFormatFromDataUrl(photoB64);
          
          const photoW = 45;
          const photoH = 30;
          doc.addImage(photoB64, format, pageWidth - 15 - photoW, listY - 2, photoW, photoH);

          // Timestamp of photo
          doc.setFontSize(6);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(200, 0, 0);
          doc.text(format(new Date(pend.created_at), "dd MMM yyyy HH:mm"), pageWidth - 16, listY + 27, { align: "right" });
          
        } catch (e) {
          console.error("Failed to draw photo", e);
        }
      }
      
      listY = nextLineY + 15;
    }
  }

  return doc.output("blob");
}
