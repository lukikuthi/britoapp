import { useNavigate } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AndarButton } from "./andar-button";

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {sortedTorres.map((torre) => {
        const sortedAndares = [...torre.andares].sort(
          (a, b) => b.numero_andar - a.numero_andar,
        );

        return (
          <Card key={torre.id} className="flex flex-col">
            <CardHeader className="pb-3 pt-4 px-4">
              <CardTitle className="text-sm text-center">{torre.nome}</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 pt-0 flex-1">
              <div className="flex flex-col gap-1.5">
                {sortedAndares.map((andar) => (
                  <AndarButton
                    key={andar.id}
                    numero={andar.numero_andar}
                    apelido={andar.apelido}
                    tipoAndar={andar.tipo_andar}
                    apontamentosAbertos={apontamentoCounts.get(andar.id) ?? 0}
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
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
