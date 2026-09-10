// ==========================
// V8: FORNECEDORES E PEDIDOS DE COMPRA
// ==========================

export function useFornecedores() {
  return useQuery({
    queryKey: ["compras-fornecedores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("compras_fornecedores" as any)
        .select("*")
        .order("razao_social", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useAdicionarFornecedor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (novo: any) => {
      const { data, error } = await supabase.from("compras_fornecedores" as any).insert(novo).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Fornecedor cadastrado!");
      qc.invalidateQueries({ queryKey: ["compras-fornecedores"] });
    },
    onError: (e: Error) => toast.error(`Erro: ${e.message}`)
  });
}

export function usePedidosCompra() {
  return useQuery({
    queryKey: ["compras-pedidos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("compras_pedidos" as any)
        .select("*, fornecedor:compras_fornecedores(*), obra:obras(nome, endereco, cliente_nome, cliente_cnpj)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCriarPedidoCompra() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { pedido: any, itens: any[] }) => {
      // 1. Criar pedido
      const { data: pedidoData, error: pedidoError } = await supabase
        .from("compras_pedidos" as any)
        .insert(payload.pedido)
        .select()
        .single();
      
      if (pedidoError) throw pedidoError;

      // 2. Criar itens
      if (payload.itens && payload.itens.length > 0) {
        const itensToInsert = payload.itens.map(i => ({
          pedido_id: pedidoData.id,
          descricao: i.descricao,
          quantidade: i.quantidade,
          unidade: i.unidade || 'un',
          valor_unitario: i.valor_unitario
        }));
        
        const { error: itensError } = await supabase
          .from("compras_pedidos_itens" as any)
          .insert(itensToInsert);
          
        if (itensError) throw itensError;
      }
      
      return pedidoData;
    },
    onSuccess: () => {
      toast.success("Pedido de compra gerado!");
      qc.invalidateQueries({ queryKey: ["compras-pedidos"] });
    },
    onError: (e: Error) => toast.error(`Erro: ${e.message}`)
  });
}

export function useImportarPlanilhaFerramentas() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (itens: any[]) => {
      // Itens é um array mapeado pelo frontend
      const { data, error } = await supabase
        .from("compras_itens" as any)
        .insert(itens);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Planilha importada com sucesso! Legado salvo.");
      qc.invalidateQueries({ queryKey: ["compras-estoque"] });
    },
    onError: (e: Error) => toast.error(`Erro: ${e.message}`)
  });
}
