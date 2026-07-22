/** Utilitários compartilhados para imagens em PDFs (proporção correta, logo, etc.) */
import { assetUrl } from "@/lib/asset-url";

export async function fetchImageAsBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function getImageFormatFromDataUrl(dataUrl: string): "JPEG" | "PNG" | "WEBP" {
  if (dataUrl.startsWith("data:image/png")) return "PNG";
  if (dataUrl.startsWith("data:image/webp")) return "WEBP";
  return "JPEG";
}

export function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = dataUrl;
  });
}

/** Calcula dimensões que cabem na caixa mantendo proporção (letterbox). */
export function fitImageInBox(
  imgWidth: number,
  imgHeight: number,
  boxWidth: number,
  boxHeight: number,
): { width: number; height: number; offsetX: number; offsetY: number } {
  if (imgWidth <= 0 || imgHeight <= 0) {
    return { width: boxWidth, height: boxHeight, offsetX: 0, offsetY: 0 };
  }
  const scale = Math.min(boxWidth / imgWidth, boxHeight / imgHeight);
  const width = imgWidth * scale;
  const height = imgHeight * scale;
  return {
    width,
    height,
    offsetX: (boxWidth - width) / 2,
    offsetY: (boxHeight - height) / 2,
  };
}

export async function addImageFitted(
  doc: import("jspdf").jsPDF,
  dataUrl: string,
  x: number,
  y: number,
  boxWidth: number,
  boxHeight: number,
): Promise<void> {
  const { width: imgW, height: imgH } = await getImageDimensions(dataUrl);
  const fit = fitImageInBox(imgW, imgH, boxWidth, boxHeight);
  const format = getImageFormatFromDataUrl(dataUrl);
  doc.addImage(dataUrl, format, x + fit.offsetX, y + fit.offsetY, fit.width, fit.height);
}

let logoBase64Cache: string | null = null;

export async function getPdfLogoBase64(): Promise<string | null> {
  if (logoBase64Cache) return logoBase64Cache;
  try {
    logoBase64Cache = await fetchImageAsBase64(assetUrl("/brito-logo.png"));
    return logoBase64Cache;
  } catch {
    return null;
  }
}

export async function addPdfBrandedHeader(doc: import("jspdf").jsPDF, subtitle: string): Promise<void> {
  doc.setFillColor(0, 43, 91);
  doc.rect(0, 0, 210, 25, "F");

  const logo = await getPdfLogoBase64();
  if (logo) {
    const { width: imgW, height: imgH } = await getImageDimensions(logo);
    const maxH = 17;
    const maxW = 58;
    const fit = fitImageInBox(imgW, imgH, maxW, maxH);
    const logoY = (25 - fit.height) / 2;
    doc.addImage(logo, "PNG", 14, logoY, fit.width, fit.height);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(subtitle, 78, 16);
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("BRITO ENGENHARIA", 14, 12);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(subtitle, 14, 20);
  }

  doc.setTextColor(0, 0, 0);
}

export async function generateZoomCropBase64(dataUrl: string, relX: number, relY: number, zoomFactor: number = 5): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const cropW = img.naturalWidth / zoomFactor;
      const cropH = img.naturalHeight / zoomFactor;
      
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("No canvas context"));
      
      let sx = (img.naturalWidth * relX) - (cropW / 2);
      let sy = (img.naturalHeight * relY) - (cropH / 2);
      
      if (sx < 0) sx = 0;
      if (sy < 0) sy = 0;
      if (sx + cropW > img.naturalWidth) sx = img.naturalWidth - cropW;
      if (sy + cropH > img.naturalHeight) sy = img.naturalHeight - cropH;
      
      ctx.drawImage(img, sx, sy, cropW, cropH, 0, 0, canvas.width, canvas.height);
      
      const pinXOnCanvas = ((img.naturalWidth * relX) - sx) / cropW * canvas.width;
      const pinYOnCanvas = ((img.naturalHeight * relY) - sy) / cropH * canvas.height;
      
      ctx.beginPath();
      ctx.arc(pinXOnCanvas, pinYOnCanvas, 15, 0, 2 * Math.PI, false);
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#ef4444';
      ctx.stroke();
      
      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}
