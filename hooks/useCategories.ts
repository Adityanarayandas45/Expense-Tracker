import { supabase } from "../lib/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Category } from "../types";

export function useCategories() {
  const queryClient = useQueryClient();

  const list = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) throw error;
      return data as Category[];
    },
  });

  const add = useMutation({
    mutationFn: async (cat: Omit<Category, "id">) => {
      const { data, error } = await supabase.from("categories").insert(cat).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return { list, add, remove };
}
