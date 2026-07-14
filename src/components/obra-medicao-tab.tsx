import React, { useState, useMemo, useRef } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Ruler, Upload, Download, Plus, Trash2, ChevronDown, ChevronRight,
  AlertTriangle, CheckCircle2, Package, BarChart3, FileSpreadsheet, Loader2, Info,
} from "lucide-react";
import * as XLSX from "xlsx";

import {
  useMedicaoItens,
  useCreateMedicao,
  useDeleteMedicao,
  useImportItens,
  type MedicaoItemWithMedicoes,
} from "@/hooks/use-medicao";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/* ════════════════════════════════════════════════════════════
   MAIN TAB COMPONENT
   ════════════════════════════════════════════════════════════ */

interface ObraMedicaoTabProps {
  obraId: string;
  isAdmin?: boolean;
}

export function ObraMedicaoTab({ obraId, isAdmin = false }: ObraMedicaoTabProps) {
  const { data: itens, isLoading } = useMedicaoItens(obraId);
  const [selectedItem, setSelectedItem] = useState<MedicaoItemWithMedicoes | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  // Group items by grupo
  const groups = useMemo(() => {
    if (!itens?.length) return [];
    const map = new Map<string, MedicaoItemWithMedicoes[]>();
    for (const item of itens) {
      const g = item.grupo || "Sem grupo";
      const arr = map.get(g) ?? [];
      arr.push(item);
      map.set(g, arr);
    }
    return Array.from(map.entries()).map(([nome, items]) => ({ nome, items }));
  }, [itens]);

  // Summary stats
  const stats = useMemo(() => {
    if (!itens?.length) return { total: 0, completos: 0, progressoGeral: 0 };
    const total = itens.length;
    const completos = itens.filter((i) => i.saldo <= 0).length;
    const somaTotal = itens.reduce((s, i) => s + Number(i.quantidade_total), 0);
    const somaExec = itens.reduce((s, i) => s + i.total_executado, 0);
    const progressoGeral = somaTotal > 0 ? (somaExec / somaTotal) * 100 : 0;
    return { total, completos, progressoGeral };
  }, [itens]);

  function toggleGroup(nome: string) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(nome)) next.delete(nome);
      else next.add(nome);
      return next;
    });
  }

  function handleExport() {
    if (!itens?.length) {
      toast.error("Nenhum item para exportar.");
      return;
    }
    const rows = itens.map((item) => ({
      Nome: item.descricao,
      Quantidade: Number(item.total_executado.toFixed(2)),
      Saldo: Number(item.saldo.toFixed(2)),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Medição");

    // Set column widths
    ws["!cols"] = [{ wch: 50 }, { wch: 15 }, { wch: 15 }];

    XLSX.writeFile(wb, `medicao_export_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    toast.success("Planilha exportada com sucesso!");
  }

  // Refresh selectedItem when data changes
  const currentSelected = useMemo(() => {
    if (!selectedItem || !itens) return null;
    return itens.find((i) => i.id === selectedItem.id) ?? null;
  }, [selectedItem, itens]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Ruler className="size-6 text-primary" />
            Medição de Campo
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Controle de quantidades executadas por item de serviço.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setShowImport(true)}>
            <Upload className="size-4 mr-1" />
            Importar Planilha
          </Button>
          {isAdmin && (
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="size-4 mr-1" />
              Exportar XLSX
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {itens && itens.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Package className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Itens de serviço</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-success/10">
                <CheckCircle2 className="size-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completos}</p>
                <p className="text-xs text-muted-foreground">Itens concluídos</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-warning/10">
                <BarChart3 className="size-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.progressoGeral.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Progresso geral</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && (!itens || itens.length === 0) && (
        <Card>
          <CardContent className="py-16 text-center">
            <FileSpreadsheet className="size-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum item importado</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Importe a planilha de medição do escritório para começar a registrar as quantidades executadas em campo.
            </p>
            <Button onClick={() => setShowImport(true)}>
              <Upload className="size-4 mr-2" />
              Importar Planilha
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Grouped items */}
      {groups.map((group) => {
        const isCollapsed = collapsedGroups.has(group.nome);
        const groupExec = group.items.reduce((s, i) => s + i.total_executado, 0);
        const groupTotal = group.items.reduce((s, i) => s + Number(i.quantidade_total), 0);
        const groupPct = groupTotal > 0 ? (groupExec / groupTotal) * 100 : 0;

        return (
          <Card key={group.nome}>
            <CardHeader
              className="cursor-pointer hover:bg-muted/30 transition-colors py-4 px-5"
              onClick={() => toggleGroup(group.nome)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isCollapsed
                    ? <ChevronRight className="size-5 text-muted-foreground" />
                    : <ChevronDown className="size-5 text-muted-foreground" />}
                  <CardTitle className="text-base">{group.nome}</CardTitle>
                  <Badge variant="outline" className="text-xs font-normal">
                    {group.items.length} {group.items.length === 1 ? "item" : "itens"}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    {groupPct.toFixed(0)}%
                  </span>
                  <Progress value={Math.min(groupPct, 100)} className="w-24 h-2" />
                </div>
              </div>
            </CardHeader>

            {!isCollapsed && (
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/20">
                        <TableHead className="w-16">#</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="w-24 text-right">Total</TableHead>
                        <TableHead className="w-24 text-right">Executado</TableHead>
                        <TableHead className="w-24 text-right">Saldo</TableHead>
                        <TableHead className="w-32 text-center">Progresso</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.items.map((item) => {
                        const overBudget = item.saldo < 0;
                        const complete = item.saldo <= 0 && !overBudget;
                        return (
                          <TableRow
                            key={item.id}
                            className="cursor-pointer hover:bg-muted/30 transition-colors"
                            onClick={() => setSelectedItem(item)}
                          >
                            <TableCell className="font-mono text-muted-foreground">
                              {item.numero_item}
                            </TableCell>
                            <TableCell className="font-medium max-w-[300px] truncate">
                              {item.descricao}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                              {Number(item.quantidade_total).toFixed(0)}
                            </TableCell>
                            <TableCell className={`text-right tabular-nums font-medium ${overBudget ? "text-destructive" : ""}`}>
                              {item.total_executado.toFixed(2)}
                            </TableCell>
                            <TableCell className={`text-right tabular-nums font-medium ${overBudget ? "text-destructive" : complete ? "text-success" : ""}`}>
                              {item.saldo.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 justify-center">
                                <Progress
                                  value={Math.min(item.progresso_pct, 100)}
                                  className={`w-16 h-2 ${overBudget ? "[&>div]:bg-destructive" : item.progresso_pct >= 80 ? "[&>div]:bg-warning" : ""}`}
                                />
                                <span className={`text-xs tabular-nums w-10 text-right ${overBudget ? "text-destructive font-bold" : ""}`}>
                                  {item.progresso_pct.toFixed(0)}%
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}

      {/* Item detail dialog */}
      {currentSelected && (
        <ItemDetailDialog
          item={currentSelected}
          obraId={obraId}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* Import dialog */}
      <ImportDialog
        open={showImport}
        onClose={() => setShowImport(false)}
        obraId={obraId}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   ITEM DETAIL DIALOG (ver histórico + lançar medição)
   ════════════════════════════════════════════════════════════ */

function ItemDetailDialog({
  item,
  obraId,
  onClose,
}: {
  item: MedicaoItemWithMedicoes;
  obraId: string;
  onClose: () => void;
}) {
  const createMedicao = useCreateMedicao();
  const deleteMedicao = useDeleteMedicao();

  const [qtd, setQtd] = useState("");
  const [ref, setRef] = useState(`MEDIÇÃO ${item.medicoes.length + 1}`);
  const [confirmOverflow, setConfirmOverflow] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const nextNum = item.medicoes.length + 1;
  const canAddMore = nextNum <= 30;

  function handleSave(force = false) {
    const val = parseFloat(qtd.replace(",", "."));
    if (isNaN(val) || val <= 0) {
      toast.error("Informe uma quantidade válida maior que zero.");
      return;
    }
    // Validação de estouro
    const novoTotal = item.total_executado + val;
    if (novoTotal > Number(item.quantidade_total) && !force) {
      setConfirmOverflow(true);
      return;
    }

    createMedicao.mutate(
      {
        item_id: item.id,
        numero_medicao: nextNum,
        data_referencia: ref || `MEDIÇÃO ${nextNum}`,
        quantidade_executada: val,
        obraId,
      },
      {
        onSuccess: () => {
          toast.success(`Medição ${nextNum} registrada!`);
          setQtd("");
          setRef(`MEDIÇÃO ${nextNum + 1}`);
        },
        onError: (err: any) => {
          toast.error(err.message || "Erro ao salvar medição.");
        },
      },
    );
  }

  function handleDelete(id: string) {
    deleteMedicao.mutate(
      { id, obraId },
      {
        onSuccess: () => {
          toast.success("Medição removida.");
          setDeleteTarget(null);
        },
        onError: (err: any) => toast.error(err.message || "Erro ao remover."),
      },
    );
  }

  const overBudget = item.saldo < 0;

  return (
    <>
      <Dialog open onOpenChange={() => onClose()}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <span className="text-muted-foreground font-mono">#{item.numero_item}</span>
              {item.descricao}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Detalhes do item de medição
            </DialogDescription>
          </DialogHeader>

          {/* Summary row */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg bg-muted/40">
              <p className="text-xs text-muted-foreground">Total contratado</p>
              <p className="text-lg font-bold">{Number(item.quantidade_total).toFixed(0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/40">
              <p className="text-xs text-muted-foreground">Executado</p>
              <p className={`text-lg font-bold ${overBudget ? "text-destructive" : "text-primary"}`}>
                {item.total_executado.toFixed(2)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/40">
              <p className="text-xs text-muted-foreground">Saldo</p>
              <p className={`text-lg font-bold ${overBudget ? "text-destructive" : item.saldo <= 0 ? "text-success" : ""}`}>
                {item.saldo.toFixed(2)}
              </p>
            </div>
          </div>

          <Progress
            value={Math.min(item.progresso_pct, 100)}
            className={`h-3 ${overBudget ? "[&>div]:bg-destructive" : item.progresso_pct >= 80 ? "[&>div]:bg-warning" : ""}`}
          />

          {overBudget && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg">
              <AlertTriangle className="size-4 shrink-0" />
              Quantidade executada ultrapassa o total contratado!
            </div>
          )}

          {/* Medições Table */}
          <div>
            <h4 className="font-semibold text-sm mb-2">Histórico de Medições</h4>
            {item.medicoes.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Nenhuma medição lançada ainda.
              </p>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/20">
                      <TableHead className="w-10">#</TableHead>
                      <TableHead>Referência</TableHead>
                      <TableHead className="text-right">Qtd.</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {item.medicoes.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-mono">{m.numero_medicao}</TableCell>
                        <TableCell className="text-sm">
                          {m.data_referencia || `Medição ${m.numero_medicao}`}
                        </TableCell>
                        <TableCell className="text-right tabular-nums font-medium">
                          {Number(m.quantidade_executada).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-muted-foreground hover:text-destructive"
                            onClick={() => setDeleteTarget(m.id)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* New Medição Form */}
          {canAddMore && (
            <div className="border-t pt-4 space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Plus className="size-4" />
                Lançar Medição {nextNum}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Referência</Label>
                  <Input
                    value={ref}
                    onChange={(e) => setRef(e.target.value)}
                    placeholder="Ex: Jun/2026"
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Quantidade executada</Label>
                  <Input
                    value={qtd}
                    onChange={(e) => setQtd(e.target.value)}
                    placeholder="0,00"
                    inputMode="decimal"
                    className="h-9"
                    autoFocus
                  />
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => handleSave()}
                disabled={createMedicao.isPending}
              >
                {createMedicao.isPending && <Loader2 className="size-4 animate-spin" />}
                Salvar Medição
              </Button>
            </div>
          )}

          {!canAddMore && (
            <div className="flex items-center gap-2 text-warning text-sm bg-warning/10 px-3 py-2 rounded-lg">
              <Info className="size-4 shrink-0" />
              Limite de 30 medições atingido para este item.
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm overflow */}
      <AlertDialog open={confirmOverflow} onOpenChange={setConfirmOverflow}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-destructive" />
              Quantidade ultrapassa o contrato
            </AlertDialogTitle>
            <AlertDialogDescription>
              A quantidade total executada ({(item.total_executado + parseFloat((qtd || "0").replace(",", "."))).toFixed(2)})
              será maior que a quantidade contratada ({Number(item.quantidade_total).toFixed(0)}).
              Tem certeza que deseja confirmar esta medição?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => {
                setConfirmOverflow(false);
                handleSave(true);
              }}
            >
              Confirmar mesmo assim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm delete */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover medição?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. A medição será permanentemente removida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   IMPORT DIALOG (upload .xlsx → prévia → confirmar)
   ════════════════════════════════════════════════════════════ */

interface ParsedItem {
  numero_item: number;
  descricao: string;
  quantidade_total: number;
  grupo: string | null;
  ordem: number;
}

function ImportDialog({
  open,
  onClose,
  obraId,
}: {
  open: boolean;
  onClose: () => void;
  obraId: string;
}) {
  const importMutation = useImportItens();
  const [preview, setPreview] = useState<ParsedItem[] | null>(null);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = new Uint8Array(ev.target!.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

        const normalize = (str: any) =>
          String(str || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();

        let headerRowIndex = -1;
        let colItem = -1;
        let colDesc = -1;
        let colQtd = -1;

        console.log("--- INICIANDO LEITURA DO EXCEL ---");

        // Scan first 50 rows for header
        for (let i = 0; i < Math.min(rows.length, 50); i++) {
          const row = rows[i];
          console.log(`Linha ${i + 1}:`, row.map(c => String(c).substring(0, 30)));
          
          let tempItem = -1, tempDesc = -1, tempQtd = -1;
          
          for (let j = 0; j < row.length; j++) {
            const cell = normalize(row[j]);
            if (!cell) continue;
            
            // Pega apenas a PRIMEIRA ocorrência da coluna (pois "QUANT" repete nas medições)
            if (tempItem === -1 && (cell === "item" || cell.includes("item") || cell === "n" || cell === "no" || cell === "#")) tempItem = j;
            if (tempDesc === -1 && (cell.includes("descricao") || cell.includes("servico"))) tempDesc = j;
            if (tempQtd === -1 && (cell === "quant" || cell === "quant." || cell === "qtd" || cell.includes("quant") || cell === "pvto")) tempQtd = j;
          }

          if (tempDesc !== -1 && tempQtd !== -1) {
            headerRowIndex = i;
            colItem = tempItem;
            colDesc = tempDesc;
            colQtd = tempQtd;
            console.log(`=> Cabeçalho encontrado na linha ${i + 1}! Colunas: Item=${colItem}, Desc=${colDesc}, Qtd=${colQtd}`);
            // Continuamos o loop para pegar a ÚLTIMA linha de cabeçalho, caso haja linhas duplicadas no Excel
          }
        }

        if (headerRowIndex === -1) {
          toast.error("Cabeçalho não encontrado. A planilha precisa ter as colunas DESCRIÇÃO e QUANT/PVTO.");
          return;
        }

        // Se a coluna de Item estiver vazia no cabeçalho, assume que é a coluna imediatamente anterior à Descrição
        if (colItem === -1 && colDesc > 0) {
          colItem = colDesc - 1;
        }

        const parsed: ParsedItem[] = [];
        let currentGroup: string | null = null;
        let ordem = 0;
        const usedNumbers = new Set<number>();

        for (let i = headerRowIndex + 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length <= colDesc) continue;

          const rawItem = colItem !== -1 ? row[colItem] : "";
          const rawDesc = row[colDesc];
          const rawQtd = row[colQtd];

          const descStr = String(rawDesc || "").trim();
          
          // Subtítulo de grupo: tem descrição, mas não tem quantidade (ou ela está vazia/zero) e não tem item
          const hasItem = String(rawItem).trim().length > 0;
          const hasQtd = String(rawQtd).trim().length > 0 && parseFloat(String(rawQtd).replace(",", ".")) > 0;

          if (descStr.length > 0 && !hasItem && !hasQtd) {
            if (descStr.length < 100) {
               currentGroup = descStr;
               console.log(`[Grupo] ${currentGroup}`);
            }
            continue;
          }

          const num = parseInt(String(rawItem), 10);
          const qtd = parseFloat(String(rawQtd).replace(",", "."));

          let finalNum = -1;
          if (!isNaN(num) && descStr.length > 0 && !isNaN(qtd) && qtd > 0) {
            finalNum = num;
          } else if (descStr.length > 0 && !isNaN(qtd) && qtd > 0) {
            finalNum = ordem + 1;
          }

          if (finalNum !== -1) {
            // Evitar duplicações (planilhas mal preenchidas com o mesmo número de item)
            // Se já existir, joga o número para uma faixa segura (+1000) para não colidir com os próximos
            while (usedNumbers.has(finalNum)) {
              finalNum += 1000;
            }
            usedNumbers.add(finalNum);

            parsed.push({
              numero_item: finalNum,
              descricao: descStr,
              quantidade_total: qtd,
              grupo: currentGroup,
              ordem: ordem++,
            });
            console.log(`[Item] #${finalNum} | ${descStr} | Qtd: ${qtd} | Grupo: ${currentGroup}`);
          }
        }

        if (parsed.length === 0) {
          toast.error("Nenhum item válido encontrado após o cabeçalho. Olhe o console (F12) para detalhes.");
          return;
        }

        setPreview(parsed);
      } catch (err) {
        toast.error("Erro ao ler o arquivo. Verifique se é um .xlsx válido.");
        console.error(err);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function handleConfirm() {
    if (!preview) return;
    importMutation.mutate(
      { obraId, itens: preview },
      {
        onSuccess: () => {
          toast.success(`${preview.length} itens importados com sucesso!`);
          setPreview(null);
          setFileName("");
          onClose();
        },
        onError: (err: any) => {
          toast.error(err.message || "Erro ao importar itens.");
        },
      },
    );
  }

  function handleReset() {
    setPreview(null);
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <Dialog open={open} onOpenChange={() => { handleReset(); onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="size-5 text-primary" />
            Importar Planilha de Medição
          </DialogTitle>
          <DialogDescription>
            Selecione o arquivo .xlsx da planilha de medição. O sistema lerá apenas as colunas
            ITEM, DESCRIÇÃO e QUANTIDADE (valores financeiros serão ignorados).
          </DialogDescription>
        </DialogHeader>

        {!preview ? (
          <div className="space-y-4">
            <div
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="size-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm font-medium">
                {fileName || "Clique para selecionar ou arraste um arquivo .xlsx"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Formatos aceitos: .xlsx, .xls
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleFile}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-sm">
                {preview.length} itens encontrados
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                Escolher outro arquivo
              </Button>
            </div>

            {/* Preview table */}
            <div className="border rounded-lg overflow-hidden max-h-[40vh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20 sticky top-0">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="w-20 text-right">Qtd.</TableHead>
                    <TableHead>Grupo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preview.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono text-muted-foreground">
                        {item.numero_item}
                      </TableCell>
                      <TableCell className="text-sm">{item.descricao}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {item.quantidade_total}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground truncate max-w-[120px]">
                        {item.grupo || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center gap-2 text-warning text-sm bg-warning/10 px-3 py-2 rounded-lg">
              <AlertTriangle className="size-4 shrink-0" />
              A importação substituirá todos os itens e medições atuais desta obra.
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => { handleReset(); onClose(); }}>
            Cancelar
          </Button>
          {preview && (
            <Button onClick={handleConfirm} disabled={importMutation.isPending}>
              {importMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              Confirmar Importação ({preview.length} itens)
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
