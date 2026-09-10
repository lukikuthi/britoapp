import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useObras() {
  return useQuery({
    queryKey: ["todas-obras"],
    queryFn: async () => {
      const { data, error } = await supabase.from("obras").select("*").order("nome");
      if (error) throw error;
      return data || [];
    }
  });
}
