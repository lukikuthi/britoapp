import { useNavigate } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AndarButton } from "./andar-button";
import { cn } from "@/lib/utils";

interface Andar {
  id: string;
  numero_andar: number;
  apelido?: string;
  tipo_andar: string;
  torre_id: string;
  grupo_id: string;
}

interface Torre {
  id: string;
  nome: string;
  ordem: number;
  andares: Andar[];
}

interface TorreMapaViewProps {
  obraId: string;
  torres: Torre[];
  apontamentoCounts: Map<string, number>;
}

export function TorreMapaView({ obraId, torres, apontamentoCounts }: TorreMapaViewProps) {
  const navigate = useNavigate();

  if (!torres.length) {
    return (
      <Card>
        <CardContent className="py-12 text-center space-y-3">
          <Building2 className="size-8 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Nenhuma torre cadastrada. Configure a estrutura da obra no Menu.
          </p>
        </CardContent>
      </Card>
    );
  }

  const sortedTorres = [...torres].sort((a, b) => a.ordem - b.ordem);

  const getGroupTitle = (tipo?: string | null) => {
    if (!tipo) return "ANDAR";
    switch(tipo) {
      case "cobertura": return "Cobertura";
      case "tecnica": return "⚡ Áreas Técnicas";
      case "subestacao": return "⚠️ Casa de Força / Subestação";
      case "comercial": return "Lojas / Comercial";
      case "tipo": return "Andares Tipo";
      case "mezanino": return "Mezanino / Pilotis";
      case "terreo": return "Térreo";
      case "garagem": return "Subsolos / Garagens";
      default: return tipo.toUpperCase();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {sortedTorres.map((torre) => {
        const sortedAndares = [...torre.andares].sort(
          (a, b) => b.numero_andar - a.numero_andar,
        );

        return (
          <Card key={torre.id} className="flex flex-col">
            <CardHeader className="pb-3 pt-4 px-4 bg-muted/30">
              <CardTitle className="text-sm text-center font-bold uppercase tracking-wider">{torre.nome}</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 pt-2 flex-1">
              <div className="flex flex-col gap-1.5">
                {sortedAndares.map((andar, index) => {
                  const isNewGroup = index === 0 || sortedAndares[index - 1].tipo_andar !== andar.tipo_andar;
                  const isTop = index === 0;
                  const isGroundLine = andar.tipo_andar === "garagem" && (index === 0 || sortedAndares[index - 1].tipo_andar !== "garagem");
                  
                  return (
                    <div key={andar.id} className="flex flex-col">
                      {isNewGroup && (
                        <div className={cn(
                          "text-[10px] font-bold mt-4 mb-2 uppercase tracking-widest text-center pb-1",
                          andar.tipo_andar === "garagem" ? "text-amber-800/60 border-b-2 border-dashed border-amber-800/30" : "text-muted-foreground border-b border-muted"
                        )}>
                          {getGroupTitle(andar.tipo_andar)}
                        </div>
                      )}
                      <AndarButton
                        numero={andar.numero_andar}
                        apelido={andar.apelido}
                        tipoAndar={andar.tipo_andar}
                        apontamentosAbertos={apontamentoCounts.get(andar.id) ?? 0}
                        isTop={isTop}
                        isGroundLine={isGroundLine}
                        onClick={() =>
                          void navigate({
                            to: "/obras/$obraId/torres/$torreId/andares/$andarId",
                            params: {
                              obraId,
                              torreId: andar.torre_id,
                              andarId: andar.id,
                            },
                          })
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
            {/* Base foundation line */}
            <div className="h-4 bg-muted/80 border-t-4 border-muted w-full mt-auto rounded-b-xl" />
          </Card>
        );
      })}
    </div>
  );
}
