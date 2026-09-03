import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEstoque, useCertificados, useBoletos } from "@/hooks/use-compras";
import { PackageOpen, FileText, AlertTriangle, ShieldAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function ComprasDashboardTab() {
  const { data: estoque, isLoading: loadEst } = useEstoque();
  const { data: certificados, isLoading: loadCert } = useCertificados();
  const { data: boletos, isLoading: loadBol } = useBoletos();

  // Alertas
  const itensBaixoEstoque = estoque?.filter(item => item.quantidade_atual <= item.limite_minimo) || [];
  
  // Certificados (Alerta de 10 dias)
  const hoje = new Date();
  const limite10Dias = new Date();
  limite10Dias.setDate(hoje.getDate() + 10);
  
  const certsAVencer = certificados?.filter(c => {
    const dataVenc = new Date(c.data_vencimento);
    return dataVenc <= limite10Dias;
  }) || [];

  const boletosPendentes = boletos?.filter(b => b.status === 'pendente') || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
              <PackageOpen className="size-4" /> Estoque Crítico
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadEst ? <Skeleton className="h-8 w-16 bg-red-200" /> : <div className="text-3xl font-bold text-red-600 dark:text-red-500">{itensBaixoEstoque.length}</div>}
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-400 flex items-center gap-2">
              <ShieldAlert className="size-4" /> Certificados Críticos (10 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadCert ? <Skeleton className="h-8 w-16 bg-amber-200" /> : <div className="text-3xl font-bold text-amber-600 dark:text-amber-500">{certsAVencer.length}</div>}
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400 flex items-center gap-2">
              <FileText className="size-4" /> Boletos Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadBol ? <Skeleton className="h-8 w-16 bg-blue-200" /> : <div className="text-3xl font-bold text-blue-600 dark:text-blue-500">{boletosPendentes.length}</div>}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista Estoque Crítico */}
        <Card>
          <CardHeader>
            <CardTitle>Itens Abaixo do Limite Mínimo</CardTitle>
            <CardDescription>Necessitam de reposição imediata</CardDescription>
          </CardHeader>
          <CardContent>
            {!itensBaixoEstoque.length ? (
              <p className="text-sm text-muted-foreground">Estoque regularizado.</p>
            ) : (
              <div className="space-y-4">
                {itensBaixoEstoque.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg bg-red-50 dark:bg-red-950/30 border-red-300">
                    <div>
                      <p className="font-medium text-sm">{item.nome}</p>
                      <p className="text-xs text-muted-foreground">Obra: {item.obra?.nome || 'Matriz'}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">Atual: {item.quantidade_atual}</Badge>
                      <p className="text-[10px] text-muted-foreground mt-1">Mínimo: {item.limite_minimo}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lista Certificados Críticos */}
        <Card>
          <CardHeader>
            <CardTitle>Certificados de Calibração</CardTitle>
            <CardDescription>Vencendo em 10 dias ou já vencidos</CardDescription>
          </CardHeader>
          <CardContent>
            {!certsAVencer.length ? (
              <p className="text-sm text-muted-foreground">Nenhum certificado crítico no momento.</p>
            ) : (
              <div className="space-y-4">
                {certsAVencer.map((c) => {
                  const isVencido = new Date(c.data_vencimento) < hoje;
                  return (
                    <div key={c.id} className={`flex items-center justify-between p-3 border rounded-lg ${isVencido ? 'bg-red-50 border-red-300' : 'bg-amber-50 border-amber-300'}`}>
                      <div>
                        <p className="font-medium text-sm">{c.item?.nome}</p>
                        <p className="text-xs text-muted-foreground">Cert: {c.numero_certificado}</p>
                      </div>
                      <Badge variant={isVencido ? "destructive" : "outline"} className={!isVencido ? "text-amber-600 border-amber-300" : ""}>
                        {isVencido ? "Vencido" : `Vence em ${new Date(c.data_vencimento).toLocaleDateString()}`}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
