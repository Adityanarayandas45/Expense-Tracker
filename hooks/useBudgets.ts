import { supabase } from "../lib/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Budget } from "../types";

export function useBudgets() {
  const queryClient = useQueryClient();

  
  const list = useQuery<Budget[]>({
    queryKey: ["budgets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("budgets")
        .select("*, category:categories(*)");
      if (error) throw error;
      return data as Budget[];
    },
  });

  
  const add = useMutation({
    mutationFn: async (budget: Omit<Budget, "id">) => {
      const { data, error } = await supabase
        .from("budgets")
        .insert(budget)
        .select("*, category:categories(*)")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });

  
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("budgets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });

  return { list, add, remove };
}
