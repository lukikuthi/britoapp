import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

// Cláusulas fixas do rodapé (padrão Brito Engenharia)
const CLAUSULAS = [
  "1 - As proposta deverão ser enviadas em arquivo PDF e assinadas, para serem consideradas validas.",
  "2 - Horario de descargas de materiais: segunda a quinta: 07h00 às 16h00; sexta: 07h00 às 15h00",
  "3 - Arquivo de xml - enviar e-mail",
  "Fornecedor: Não autorizamos a transferência de titulos em factoring's.",
  "Pedido confirmado com o Sra. Ana Maria Santana",
];

interface DataBloco {
  razao_social?: string;
  cnpj?: string;
  cno?: string;
  endereco?: string;
  bairro?: string;
  municipio?: string;
  cep?: string;
  inscricao_estadual?: string;
  telefone?: string;
  contato?: string;
}

function drawBloco(doc: any, titulo: string, data: DataBloco, startY: number): number {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 14;
  const blockW = pageW - margin * 2;
  const colR = pageW / 2 + 10; // coluna direita

  // Header do bloco
  doc.setFillColor(210, 210, 210);
  doc.rect(margin, startY, blockW, 5.5, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(titulo, pageW / 2, startY + 4, { align: "center" });

  let y = startY + 9;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);

  const line = (label: string, val: string, x: number, lineY: number) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, x, lineY);
    doc.setFont("helvetica", "normal");
    const labelW = doc.getTextWidth(label);
    doc.text(val || "", x + labelW + 1, lineY);
  };

  line("Razão Social:", data.razao_social || "", margin, y);
  if (data.cno !== undefined) line("CNO", data.cno || "", colR, y);
  y += 4.5;

  line("Endereço:", data.endereco || "", margin, y);
  line("Bairro:", data.bairro || "", colR, y);
  y += 4.5;

  line("Município:", data.municipio || "", margin, y);
  line("Cep:", data.cep || "", colR, y);
  y += 4.5;

  line("CNPJ:", data.cnpj || "", margin, y);
  line("I.Est.", data.inscricao_estadual || "", colR, y);
  y += 4.5;

  line("Telefone:", data.telefone || "", margin, y);
  line("Contato:", data.contato || "", colR, y);
  y += 6;

  return y;
}

export function gerarPdfPedidoCompra(pedido: any) {
  const doc = new (jsPDF as any)();
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 14;

  // ============ CABEÇALHO ============
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("PEDIDO DE COMPRA", pageW / 2, 18, { align: "center" });

  // Obra
  doc.setFillColor(210, 210, 210);
  doc.rect(margin, 22, pageW - margin * 2, 5.5, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`OBRA: ${(pedido.obra?.nome || "").toUpperCase()}`, pageW / 2, 26, { align: "center" });

  // Data, Pedido, Orçamento (coluna direita)
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const dataStr = format(new Date(pedido.data_pedido), "dd/MM/yyyy");
  doc.text(`Data`, pageW - 55, 14);
  doc.text(dataStr, pageW - 30, 14);
  doc.text(`Pedido`, pageW - 55, 18);
  doc.text(pedido.numero_pedido || "", pageW - 30, 18);
  doc.text(`Orç.`, pageW - 55, 22);
  doc.text(pedido.numero_orcamento || "", pageW - 30, 22);

  let y = 30;

  // ============ BLOCO 1: DADOS FORNECEDOR ============
  const f = pedido.fornecedor || {};
  y = drawBloco(doc, "DADOS FORNECEDOR", {
    razao_social: f.razao_social,
    endereco: f.endereco,
    bairro: f.bairro,
    municipio: f.municipio,
    cep: f.cep,
    cnpj: f.cnpj,
    inscricao_estadual: f.inscricao_estadual,
    telefone: f.telefone,
    contato: f.contato,
  }, y);

  // ============ BLOCO 2: DADOS PARA FATURAMENTO ============
  const ob = pedido.obra || {};
  y = drawBloco(doc, "DADOS PARA FATURAMENTO", {
    razao_social: ob.faturamento_razao_social,
    cno: ob.faturamento_cno,
    endereco: ob.faturamento_endereco,
    bairro: ob.faturamento_bairro,
    municipio: ob.faturamento_municipio,
    cep: ob.faturamento_cep,
    cnpj: ob.faturamento_cnpj,
    inscricao_estadual: ob.faturamento_inscricao_estadual,
    telefone: ob.faturamento_telefone,
    contato: ob.faturamento_contato,
  }, y);

  // ============ BLOCO 3: DADOS PARA COBRANÇA ============
  y = drawBloco(doc, "DADOS PARA COBRANÇA", {
    razao_social: ob.cobranca_razao_social,
    cno: ob.cobranca_cno,
    endereco: ob.cobranca_endereco,
    bairro: ob.cobranca_bairro,
    municipio: ob.cobranca_municipio,
    cep: ob.cobranca_cep,
    cnpj: ob.cobranca_cnpj,
    inscricao_estadual: ob.cobranca_inscricao_estadual,
    telefone: ob.cobranca_telefone,
    contato: ob.cobranca_contato,
  }, y);

  // ============ BLOCO 4: DADOS PARA ENTREGA ============
  y = drawBloco(doc, "DADOS PARA ENTREGA", {
    razao_social: ob.nome,
    cno: ob.entrega_cno || ob.faturamento_cno,
    endereco: ob.endereco,
    bairro: ob.entrega_bairro,
    municipio: ob.cidade,
    cep: ob.entrega_cep,
    telefone: ob.entrega_telefone,
    contato: ob.entrega_contato,
  }, y);

  // ============ FRETE E DESPESAS ============
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Vlr. Frete:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(pedido.valor_frete ? `R$ ${Number(pedido.valor_frete).toFixed(2)}` : "", margin + 20, y);
  doc.setFont("helvetica", "bold");
  doc.text("Outras Despesas:", 80, y);
  doc.setFont("helvetica", "normal");
  doc.text(pedido.outras_despesas ? `R$ ${Number(pedido.outras_despesas).toFixed(2)}` : "", 115, y);
  y += 5;

  // ============ TABELA DE ITENS ============
  const itens = pedido.itens || [];
  const tableBody = itens.map((i: any) => [
    i.quantidade?.toString() || "",
    i.unidade || "",
    i.descricao || "",
    `R$ ${Number(i.valor_unitario || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    `R$ ${(Number(i.quantidade || 0) * Number(i.valor_unitario || 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
  ]);

  autoTable(doc, {
    startY: y,
    head: [["QUANT.", "UNID.", "DESCRIÇÃO:", "R$ unit.", "R$ TOTAL"]],
    body: tableBody,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [66, 66, 66], textColor: 255, fontStyle: "bold" },
    columnStyles: {
      0: { halign: "center", cellWidth: 18 },
      1: { halign: "center", cellWidth: 16 },
      2: { cellWidth: "auto" },
      3: { halign: "right", cellWidth: 28 },
      4: { halign: "right", cellWidth: 30 },
    },
    margin: { left: margin, right: margin },
  });

  y = (doc as any).lastAutoTable.finalY + 2;

  // Valor Seguro e Total Geral
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Valor Seguro:", margin, y + 4);
  doc.setFont("helvetica", "normal");
  doc.text(pedido.valor_seguro ? `R$ ${Number(pedido.valor_seguro).toFixed(2)}` : "", margin + 25, y + 4);

  const totalGeral = Number(pedido.valor_total || 0) + Number(pedido.valor_frete || 0) + Number(pedido.outras_despesas || 0) + Number(pedido.valor_seguro || 0);
  doc.setFont("helvetica", "bold");
  doc.text("Total Geral:", pageW - 60, y + 4);
  doc.setFontSize(10);
  doc.text(`R$   ${totalGeral.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, pageW - 40, y + 4);

  y += 10;

  // ============ CONDIÇÕES COMERCIAIS ============
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Prazo de Entrega: ${pedido.prazo_entrega || "imediato após aprovação"}`, margin + 30, y);
  y += 4;
  doc.text(`Condições de pagamento: ${pedido.condicoes_pagamento || "28 DDL"}`, margin + 30, y);
  y += 6;

  // ============ CLÁUSULAS FIXAS ============
  doc.setFontSize(7);
  for (const c of CLAUSULAS) {
    doc.text(c, margin, y);
    y += 3.5;
  }

  // Autorização
  y += 2;
  doc.setFontSize(8);
  doc.text("Autorizo conforme condições gerais de fornecimento acima:", margin, y);
  y += 12;

  // Assinatura
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  const autorizador = pedido.autorizador || "DIALOGO ALVARO RAMOS";
  doc.text(autorizador.toUpperCase(), pageW / 2, y, { align: "center" });
  y += 5;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("(Assinatura e Carimbo)", pageW / 2, y, { align: "center" });

  // Salvar
  const nomeArquivo = `Pedido_Compra_${(pedido.numero_pedido || "").replace(/\//g, "-")}.pdf`;
  doc.save(nomeArquivo);
}
