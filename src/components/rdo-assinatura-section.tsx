import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { SignatureCanvas } from "@/components/signature-canvas";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { MapPin, ShieldCheck, User } from "lucide-react";

export function RdoAssinaturaSection({ rdoId }: { rdoId: string }) {
  const queryClient = useQueryClient();
  const [isSigning, setIsSigning] = useState(false);
  
  const { data: assinatura, isLoading } = useQuery({
    queryKey: ["rdo-assinatura", rdoId],
    queryFn: async () => {
      const { data, error } = await supabase.from("rdo_assinatura").select("*").eq("rdo_id", rdoId).limit(1).maybeSingle();
      if (error) throw error;
      return data || null;
    }
  });

  const saveSignature = useMutation({
    mutationFn: async (payload: { base64: string, geo: any }) => {
      const authReq = await supabase.auth.getUser();
      const userId = authReq.data.user?.id;
      
      const { data: userData } = await supabase.from("usuarios").select("nome").eq("id", userId).single();
      
      // Upsert
      const insertData = {
        rdo_id: rdoId,
        nome_assinante: userData?.nome || "Usuário",
        tipo: "responsavel_tecnico",
        assinatura_png: payload.base64,
        ip_address: payload.geo.ip || "Não coletado",
        user_agent: navigator.userAgent,
        latitude: payload.geo.lat || null,
        longitude: payload.geo.lng || null,
        timestamp_geo: new Date().toISOString()
      };

      if (assinatura?.id) {
        const { error } = await supabase.from("rdo_assinatura").update(insertData).eq("id", assinatura.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("rdo_assinatura").insert(insertData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rdo-assinatura", rdoId] });
      setIsSigning(false);
      toast.success("Assinatura salva com validade jurídica!");
    },
    onError: (e: any) => {
      toast.error("Erro ao salvar assinatura: " + e.message);
    }
  });

  const handleSave = async (base64: string) => {
    toast.info("Capturando metadados de geolocalização...");
    let geo = { lat: null as number | null, lng: null as number | null, ip: "Local" };
    
    try {
      // Tenta pegar IP
      const res = await fetch("https://api.ipify.org?format=json");
      const ipData = await res.json();
      geo.ip = ipData.ip;
    } catch(e) {
      console.warn("Could not get IP", e);
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          geo.lat = pos.coords.latitude;
          geo.lng = pos.coords.longitude;
          saveSignature.mutate({ base64, geo });
        },
        (err) => {
          console.warn("Geolocalização negada/falhou", err);
          saveSignature.mutate({ base64, geo }); // Salva mesmo sem GPS
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      saveSignature.mutate({ base64, geo });
    }
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b bg-muted/30 flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary" />
          Assinatura e Conformidade Legal
        </h3>
      </div>
      <div className="p-4">
        {assinatura ? (
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="border rounded bg-white p-2 w-full md:w-[400px] flex justify-center">
              <img src={assinatura.assinatura_png} alt="Assinatura" className="max-h-[150px] object-contain" />
            </div>
            <div className="space-y-2 text-sm text-muted-foreground flex-1">
              <p className="flex items-center gap-2 text-foreground font-medium">
                <User className="size-4" /> Assinado por: {assinatura.nome_assinante} ({assinatura.tipo === 'responsavel_tecnico' ? 'Engenheiro/Responsável' : 'Cliente/Fiscal'})
              </p>
              <p><strong>Data/Hora Oficial:</strong> {assinatura.timestamp_geo ? format(new Date(assinatura.timestamp_geo), "dd/MM/yyyy HH:mm:ss") : "N/A"}</p>
              <p className="flex items-center gap-1">
                <MapPin className="size-3" /> 
                <strong>Geolocalização:</strong> {assinatura.latitude && assinatura.longitude ? `${assinatura.latitude}, ${assinatura.longitude}` : "Não fornecida"}
              </p>
              <p><strong>IP:</strong> {assinatura.ip_address || "Não rastreado"}</p>
              <p className="text-xs max-w-md break-all"><strong>Dispositivo:</strong> {assinatura.user_agent}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsSigning(true)}>
                Refazer Assinatura
              </Button>
            </div>
          </div>
        ) : isSigning ? (
          <SignatureCanvas onSave={handleSave} onCancel={() => setIsSigning(false)} />
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">O RDO ainda não foi assinado. A assinatura digital coletará dados de geolocalização e IP para garantir validade jurídica.</p>
            <Button onClick={() => setIsSigning(true)}>Assinar RDO Agora</Button>
          </div>
        )}
      </div>
    </div>
  );
}
