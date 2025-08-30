import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import { Transaction } from "../types";

export function useTransactions() {
  const queryClient = useQueryClient();

  
  const list = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*, categories(name)"); 
      if (error) throw new Error(error.message);
      return data as Transaction[];
    },
  });

  
  const add = useMutation({
    mutationFn: async (tx: {
      user_id: string;
      category_id: string;
      amount: number;
      type: string;
      note: string;
      transaction_date: string;
    }) => {
      const { data, error } = await supabase
        .from("transactions")
        .insert([tx])
        .select("*, categories(name)"); 
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  return { list, add, remove };
}
