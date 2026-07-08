import jsPDF from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { addPdfBrandedHeader, addImageFitted, fetchImageAsBase64 } from "@/lib/pdf-image-utils";

export interface FotografiaPdfItem {
  titulo: string;
  descricao: string | null;
  url: string | null;
}

export interface FotografiaPdfData {
  obraNome: string;
  endereco?: string | null;
  itens: FotografiaPdfItem[];
}

async function addHeader(doc: jsPDF, title: string) {
  await addPdfBrandedHeader(doc, title);
}

function addFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(`Página ${pageNum} de ${totalPages}`, 105, 287, { align: "center" });
  doc.text("BRITO ENGENHARIA — Registro fotográfico", 14, 287);
  doc.setTextColor(0, 0, 0);
}

export async function generateFotografiaPdf(data: FotografiaPdfData): Promise<Blob> {
  const comFoto = data.itens.filter((i) => i.url);
  if (!comFoto.length) {
    throw new Error("Nenhuma foto para exportar.");
  }

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const totalPages = comFoto.length;
  const hoje = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const photoBoxW = 182;
  const photoBoxH = 120;

  for (let i = 0; i < comFoto.length; i++) {
    if (i > 0) doc.addPage();
    const item = comFoto[i];
    const pageNum = i + 1;

    await addHeader(doc, "Registro fotográfico da obra");

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(data.obraNome, 14, 35);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Exportado em ${hoje}`, 14, 41);
    if (data.endereco) {
      doc.text(data.endereco, 14, 47);
    }

    const titulo = item.titulo.trim() || `Foto ${pageNum}`;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(titulo, 14, 58);

    let y = 64;
    if (item.url) {
      try {
        const imgData = await fetchImageAsBase64(item.url);
        await addImageFitted(doc, imgData, 14, y, photoBoxW, photoBoxH);
        y += photoBoxH + 6;
      } catch {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.text("[Imagem não disponível]", 14, y);
        y += 10;
      }
    }

    if (item.descricao?.trim()) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Descrição:", 14, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const lines = doc.splitTextToSize(item.descricao.trim(), 182);
      doc.text(lines, 14, y);
    }

    addFooter(doc, pageNum, totalPages);
  }

  return doc.output("blob");
}
