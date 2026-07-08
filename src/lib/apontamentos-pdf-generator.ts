import jsPDF from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  addPdfBrandedHeader,
  fetchImageAsBase64,
  getImageDimensions,
  getImageFormatFromDataUrl,
  fitImageInBox,
} from "@/lib/pdf-image-utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ApontamentoPdfPin {
  numero: number; // 1-based sequential
  descricao: string;
  status: "aberto" | "resolvido";
  posX: number; // 0-1
  posY: number; // 0-1
}

export interface ApontamentoPdfAndar {
  numero: number;
  apelido?: string;
  tipoAndar: string;
  torreNome: string;
  plantaUrl: string; // signed URL
  apontamentos: ApontamentoPdfPin[];
}

export interface ApontamentoPdfData {
  obraNome: string;
  endereco?: string;
  torres: Array<{
    nome: string;
    andares: ApontamentoPdfAndar[];
  }>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BRAND_NAVY: [number, number, number] = [0, 43, 91];
const PAGE_W = 297; // A4 landscape width mm
const PAGE_H = 210; // A4 landscape height mm
const MARGIN = 14;
const HEADER_H = 25;
const FOOTER_H = 10;
const CONTENT_TOP = HEADER_H + 10;
const CONTENT_BOTTOM = PAGE_H - FOOTER_H;
const CONTENT_H = CONTENT_BOTTOM - CONTENT_TOP;
const IMAGE_AREA_W = (PAGE_W - MARGIN * 2 - 8) * 0.60; // 60% for image
const LEGEND_AREA_W = (PAGE_W - MARGIN * 2 - 8) * 0.40; // 40% for legend
const LEGEND_X = MARGIN + IMAGE_AREA_W + 8;
const MARKER_RADIUS = 3.5;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Branded header adapted for landscape A4 */
async function addLandscapeHeader(doc: jsPDF, subtitle: string) {
  // The shared helper assumes portrait (210 wide). For landscape we draw our own.
  doc.setFillColor(...BRAND_NAVY);
  doc.rect(0, 0, PAGE_W, HEADER_H, "F");

  // Try to load logo
  let logo: string | null = null;
  try {
    logo = await fetchImageAsBase64("/brito-logo.png");
  } catch {
    /* ignore */
  }

  if (logo) {
    const { width: imgW, height: imgH } = await getImageDimensions(logo);
    const fit = fitImageInBox(imgW, imgH, 58, 17);
    const logoY = (HEADER_H - fit.height) / 2;
    doc.addImage(logo, "PNG", MARGIN, logoY, fit.width, fit.height);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(subtitle, 78, 16);
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("BRITO ENGENHARIA", MARGIN, 12);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(subtitle, MARGIN, 20);
  }

  doc.setTextColor(0, 0, 0);
}

function addFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(`Página ${pageNum} de ${totalPages}`, PAGE_W / 2, PAGE_H - 4, { align: "center" });
  doc.text("BRITO ENGENHARIA — Apontamentos Visuais", MARGIN, PAGE_H - 4);
  doc.setTextColor(0, 0, 0);
}

function drawMarker(doc: jsPDF, x: number, y: number, num: number, isResolvido: boolean) {
  // Circle background
  if (isResolvido) {
    doc.setFillColor(34, 139, 34); // green
  } else {
    doc.setFillColor(220, 53, 53); // red
  }
  doc.circle(x, y, MARKER_RADIUS, "F");

  // White border
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  doc.circle(x, y, MARKER_RADIUS, "S");

  // Number text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  const numStr = String(num);
  doc.text(numStr, x, y + 1.2, { align: "center" });

  // Reset
  doc.setDrawColor(0, 0, 0);
  doc.setTextColor(0, 0, 0);
}

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

export async function generateApontamentosPdf(data: ApontamentoPdfData): Promise<Blob> {
  const allAndares: ApontamentoPdfAndar[] = [];
  for (const torre of data.torres) {
    for (const andar of torre.andares) {
      allAndares.push(andar);
    }
  }

  if (allAndares.length === 0) {
    throw new Error("Nenhum andar com apontamentos para exportar.");
  }

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });
  const totalPages = allAndares.length;
  const hoje = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  for (let i = 0; i < allAndares.length; i++) {
    if (i > 0) doc.addPage("a4", "landscape");
    const andar = allAndares[i];
    const pageNum = i + 1;

    // Header
    await addLandscapeHeader(doc, "Apontamentos Visuais");

    // Sub-header: obra name + date
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(data.obraNome, MARGIN, CONTENT_TOP - 3);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const metaLine = [hoje, data.endereco].filter(Boolean).join(" — ");
    doc.text(metaLine, MARGIN, CONTENT_TOP + 1);

    // Floor sub-header
    const floorLabel = andar.apelido || `Andar ${andar.numero}`;
    const subHeader = `Torre ${andar.torreNome} — ${floorLabel}`;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(subHeader, MARGIN, CONTENT_TOP + 8);

    const imageTop = CONTENT_TOP + 12;
    const imageAreaH = CONTENT_H - 16; // leave room for sub-header

    // ----- Left side: floor plan image with markers -----
    let imgDrawn = false;
    let imgX = MARGIN;
    let imgY = imageTop;
    let imgW = IMAGE_AREA_W;
    let imgH = imageAreaH;

    if (andar.plantaUrl) {
      try {
        const imgData = await fetchImageAsBase64(andar.plantaUrl);
        const dims = await getImageDimensions(imgData);
        const fit = fitImageInBox(dims.width, dims.height, IMAGE_AREA_W, imageAreaH);
        const fmt = getImageFormatFromDataUrl(imgData);

        imgX = MARGIN + fit.offsetX;
        imgY = imageTop + fit.offsetY;
        imgW = fit.width;
        imgH = fit.height;

        doc.addImage(imgData, fmt, imgX, imgY, imgW, imgH);
        imgDrawn = true;

        // Draw light border around image
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.rect(imgX, imgY, imgW, imgH, "S");
        doc.setDrawColor(0, 0, 0);
      } catch {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.text("[Planta não disponível]", MARGIN + 4, imageTop + 20);
      }
    } else {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.text("[Sem planta cadastrada]", MARGIN + 4, imageTop + 20);
    }

    // Draw numbered markers on the image
    if (imgDrawn) {
      for (const ap of andar.apontamentos) {
        const mx = imgX + ap.posX * imgW;
        const my = imgY + ap.posY * imgH;
        drawMarker(doc, mx, my, ap.numero, ap.status === "resolvido");
      }
    }

    // ----- Right side: legend -----
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Legenda", LEGEND_X, imageTop);

    // Status legend icons
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setFillColor(220, 53, 53);
    doc.circle(LEGEND_X + 2, imageTop + 5, 2, "F");
    doc.setTextColor(80, 80, 80);
    doc.text("Aberto", LEGEND_X + 6, imageTop + 6);

    doc.setFillColor(34, 139, 34);
    doc.circle(LEGEND_X + 28, imageTop + 5, 2, "F");
    doc.text("Resolvido", LEGEND_X + 32, imageTop + 6);

    doc.setTextColor(0, 0, 0);

    // Separator line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(LEGEND_X, imageTop + 9, LEGEND_X + LEGEND_AREA_W, imageTop + 9);
    doc.setDrawColor(0, 0, 0);

    let legendY = imageTop + 14;
    const maxLegendY = CONTENT_BOTTOM - 4;
    const lineHeight = 4.5;
    const maxDescWidth = LEGEND_AREA_W - 12;

    for (const ap of andar.apontamentos) {
      if (legendY > maxLegendY) {
        doc.setFontSize(7);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(128, 128, 128);
        doc.text("... (lista continua)", LEGEND_X, legendY);
        doc.setTextColor(0, 0, 0);
        break;
      }

      // Marker number
      const statusColor: [number, number, number] = ap.status === "resolvido"
        ? [34, 139, 34]
        : [220, 53, 53];
      doc.setFillColor(...statusColor);
      doc.circle(LEGEND_X + 3, legendY - 1, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(6);
      doc.setFont("helvetica", "bold");
      doc.text(String(ap.numero), LEGEND_X + 3, legendY - 0.2, { align: "center" });

      // Description
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      const descLines = doc.splitTextToSize(ap.descricao, maxDescWidth);
      const linesToRender = descLines.slice(0, 3); // max 3 lines per item
      doc.text(linesToRender, LEGEND_X + 8, legendY);

      legendY += linesToRender.length * lineHeight + 2;
    }

    // Footer
    addFooter(doc, pageNum, totalPages);
  }

  return doc.output("blob");
}
