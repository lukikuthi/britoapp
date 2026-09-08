import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, Loader2, Check, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export function NotificationsPopover() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [hasNew, setHasNew] = useState(false);

  // Fetch notifications
  const { data: notificacoes, isLoading } = useQuery({
    queryKey: ["notificacoes-ativas"],
    queryFn: async () => {
      // Pega notificações dos últimos 3 dias
      const tresDiasAtras = new Date();
      tresDiasAtras.setDate(tresDiasAtras.getDate() - 3);

      const { data, error } = await supabase
        .from("notificacoes")
        .select("*")
        .gte("created_at", tresDiasAtras.toISOString())
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const unreadCount = notificacoes?.filter((n: any) => !n.lida).length || 0;

  // Realtime subscription
  useEffect(() => {
    const channelName = `notificacoes-channel-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notificacoes' },
        (payload) => {
          // Quando chega notificação nova
          qc.invalidateQueries({ queryKey: ["notificacoes-ativas"] });
          setHasNew(true);
          // Opcional: tocar som de sino
          // const audio = new Audio('/notification.mp3');
          // audio.play().catch(e => console.log('Autoplay prevent', e));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notificacoes").update({ lida: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notificacoes-ativas"] });
    }
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("notificacoes").update({ lida: true }).eq("lida", false);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notificacoes-ativas"] });
    }
  });

  const handleOpenClick = (url: string | null, id: string) => {
    markAsRead.mutate(id);
    setOpen(false);
    if (url) {
      navigate({ to: url as any });
    }
  };

  return (
    <Popover open={open} onOpenChange={(v) => {
      setOpen(v);
      if (v) setHasNew(false);
    }}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className={`size-5 ${hasNew ? 'animate-bounce text-brand-gold' : ''}`} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500 shadow-sm" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 shadow-lg border-muted">
        <div className="flex items-center justify-between p-4 border-b bg-muted/30">
          <h4 className="font-semibold text-sm">Notificações</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground hover:text-primary" onClick={() => markAllAsRead.mutate()}>
              Marcar lidas
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 flex justify-center"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>
          ) : !notificacoes?.length ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Nenhuma notificação recente.</div>
          ) : (
            <ul className="divide-y">
              {notificacoes.map((n: any) => (
                <li key={n.id} className={`p-3 text-sm hover:bg-muted/50 transition-colors flex items-start gap-3 ${!n.lida ? 'bg-muted/20' : ''}`}>
                  <div className={`mt-0.5 rounded-full p-1 shrink-0 ${!n.lida ? 'bg-brand-gold/20 text-brand-gold' : 'bg-muted text-muted-foreground'}`}>
                    <Bell className="size-3" />
                  </div>
                  <div className="flex-1 cursor-pointer" onClick={() => handleOpenClick(n.link_url, n.id)}>
                    <p className={`font-medium ${!n.lida ? 'text-foreground' : 'text-muted-foreground'}`}>{n.titulo}</p>
                    <p className="text-muted-foreground text-xs mt-0.5 leading-snug">{n.mensagem}</p>
                    <p className="text-[10px] text-muted-foreground mt-2">{new Date(n.created_at).toLocaleString()}</p>
                  </div>
                  {!n.lida && (
                    <Button variant="ghost" size="icon" className="size-5 shrink-0 opacity-50 hover:opacity-100" onClick={(e) => { e.stopPropagation(); markAsRead.mutate(n.id); }}>
                      <Check className="size-3" />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
