import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, Upload, Loader2, AlertTriangle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { exportFullBackup, importFullBackup } from "@/lib/backup-service";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/admin/backup")({
  head: () => ({ meta: [{ title: "Backup e Restauração — BRITO ENGENHARIA" }] }),
  component: BackupPage,
});

function BackupPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // -- EXPORT MUTATION --
  const exportMutation = useMutation({
    mutationFn: async () => {
      return await exportFullBackup();
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `brito_backup_${format(new Date(), "yyyy-MM-dd_HH-mm")}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Backup gerado com sucesso! Arquivo JSON baixado.");
    },
    onError: (e: Error) => {
      console.error(e);
      toast.error("Erro ao gerar backup: " + e.message);
    }
  });

  // -- IMPORT MUTATION --
  const importMutation = useMutation({
    mutationFn: async (file: File) => {
      const content = await file.text();
      await importFullBackup(content);
    },
    onSuccess: () => {
      toast.success("Dados restaurados com excelência!");
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: (e: Error) => {
      console.error(e);
      toast.error("Erro ao importar dados: " + e.message);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      toast.error("Por favor, selecione um arquivo JSON válido gerado por este sistema.");
      e.target.value = "";
      return;
    }
    
    // Confirmação antes de importar
    if (confirm("ATENÇÃO: Você está prestes a restaurar dados. Isso pode sobrescrever informações existentes com as do arquivo. Tem certeza absoluta?")) {
      importMutation.mutate(file);
    } else {
      e.target.value = "";
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Centro de Segurança de Dados</h1>
        <p className="text-sm text-muted-foreground mt-1">Gere backups estruturais em JSON e restaure obras em caso de necessidade.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* EXPORT CARD */}
        <Card className="border-[var(--brand-gold)] border-opacity-50">
          <CardHeader className="pb-3">
            <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <Download className="size-5 text-primary" />
            </div>
            <CardTitle>Exportar Backup (Download)</CardTitle>
            <CardDescription>
              Baixe todas as tabelas (Obras, Andares, Apontamentos, RDOs) em um arquivo JSON. As fotos no storage não são baixadas, mas os links de referência delas sim.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => exportMutation.mutate()}
              disabled={exportMutation.isPending}
            >
              {exportMutation.isPending ? (
                <><Loader2 className="mr-2 size-4 animate-spin" /> Processando...</>
              ) : (
                <><Download className="mr-2 size-4" /> Gerar Arquivo .JSON</>
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-3 flex items-start gap-1.5">
              <ShieldCheck className="size-4 shrink-0 text-green-600" />
              Garante que você tenha 100% dos dados textuais guardados localmente com segurança.
            </p>
          </CardContent>
        </Card>

        {/* IMPORT CARD */}
        <Card className="border-destructive/30">
          <CardHeader className="pb-3">
            <div className="size-10 bg-destructive/10 rounded-full flex items-center justify-center mb-2">
              <Upload className="size-5 text-destructive" />
            </div>
            <CardTitle>Restaurar Backup (Importar)</CardTitle>
            <CardDescription>
              Envie um arquivo JSON previamente gerado para restaurar ou migrar obras. Arquivos com o mesmo ID farão "upsert" (atualização mesclada).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input 
              type="file" 
              accept=".json"
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <Button 
              variant="destructive"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={importMutation.isPending}
            >
              {importMutation.isPending ? (
                <><Loader2 className="mr-2 size-4 animate-spin" /> Restaurando dados...</>
              ) : (
                <><Upload className="mr-2 size-4" /> Selecionar Arquivo .JSON</>
              )}
            </Button>
            <p className="text-xs text-destructive/80 mt-3 flex items-start gap-1.5 font-medium">
              <AlertTriangle className="size-4 shrink-0" />
              Cuidado: Restaurar um arquivo antigo pode sobrescrever modificações mais recentes feitas na obra.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
