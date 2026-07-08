import { useState } from "react";
import { useObraTorres } from "@/hooks/use-apontamentos";
import { useRdoTable, useAddRdoTableItem, useDeleteRdoTableItem } from "@/hooks/use-rdo";
import { ChevronDown, ChevronRight, Map, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface RdoPlantasProps {
  rdoId: string;
  obraId: string;
}

export function RdoPlantasSection({ rdoId, obraId }: RdoPlantasProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: torres, isLoading: isLoadingTorres } = useObraTorres(obraId);
  const { data: selecionados = [], isLoading: isLoadingSel } = useRdoTable<{ id: string; rdo_id: string; andar_id: string }>(rdoId, "rdo_andares_selecionados");
  
  const addMut = useAddRdoTableItem();
  const deleteMut = useDeleteRdoTableItem();

  const isLoading = isLoadingTorres || isLoadingSel;

  const selecionadosIds = new Set(selecionados.map(s => s.andar_id));

  const handleToggleAndar = async (andarId: string) => {
    try {
      const existente = selecionados.find(s => s.andar_id === andarId);
      if (existente) {
        await deleteMut.mutateAsync({ table: "rdo_andares_selecionados", rdoId, id: existente.id });
        toast.success("Andar removido do relatório");
      } else {
        await addMut.mutateAsync({ table: "rdo_andares_selecionados", rdoId, payload: { andar_id: andarId } });
        toast.success("Andar adicionado ao relatório");
      }
    } catch (e: any) {
      toast.error("Erro: " + e.message);
    }
  };

  const handleToggleTorre = async (torreId: string) => {
    const torre = torres?.find(t => t.id === torreId);
    if (!torre) return;
    
    const andaresDaTorre = torre.andares.map(a => a.id);
    const andaresNaoSelecionados = andaresDaTorre.filter(id => !selecionadosIds.has(id));
    
    try {
      if (andaresNaoSelecionados.length > 0) {
        for (const andarId of andaresNaoSelecionados) {
          await addMut.mutateAsync({ table: "rdo_andares_selecionados", rdoId, payload: { andar_id: andarId } });
        }
        toast.success("Torre inteira adicionada ao relatório");
      } else {
        for (const andarId of andaresDaTorre) {
          const existente = selecionados.find(s => s.andar_id === andarId);
          if (existente) {
            await deleteMut.mutateAsync({ table: "rdo_andares_selecionados", rdoId, id: existente.id });
          }
        }
        toast.success("Torre inteira removida do relatório");
      }
    } catch (e: any) {
      toast.error("Erro: " + e.message);
    }
  };

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
          <Map className="size-4 text-primary" />
          <span className="font-semibold">Plantas e Apontamentos</span>
          {selecionados.length > 0 && (
            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
              {selecionados.length} anexados
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 border-t">
          {isLoading ? (
            <div className="flex justify-center p-4"><Loader2 className="size-5 animate-spin" /></div>
          ) : !torres || torres.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground text-sm border border-dashed rounded">
              Nenhuma torre configurada nesta obra.
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Selecione os andares que você deseja anexar ao RDO. A planta baixa do andar escolhido será gerada no PDF incluindo os apontamentos atuais.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {torres.map(torre => {
                  const todosSelecionados = torre.andares.length > 0 && torre.andares.every(a => selecionadosIds.has(a.id));
                  return (
                    <div key={torre.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-muted/50 p-2 flex items-center justify-between border-b">
                        <span className="font-medium text-sm px-2">{torre.nome}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs" 
                          onClick={() => handleToggleTorre(torre.id)}
                          disabled={torre.andares.length === 0}
                        >
                          {todosSelecionados ? "Desmarcar Toda" : "Selecionar Toda"}
                        </Button>
                      </div>
                      <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto">
                        {torre.andares.length === 0 && (
                          <div className="text-xs text-muted-foreground text-center p-2">Sem andares</div>
                        )}
                        {torre.andares.map(andar => {
                          const isSelected = selecionadosIds.has(andar.id);
                          return (
                            <button
                              key={andar.id}
                              onClick={() => handleToggleAndar(andar.id)}
                              className={cn(
                                "w-full flex items-center justify-between p-2 rounded text-sm transition-colors",
                                isSelected ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                              )}
                            >
                              <span>{andar.apelido || `Andar ${andar.numero_andar}`}</span>
                              {isSelected && <Check className="size-4" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
