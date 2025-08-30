"use client";

import { useState } from "react";
import {
  Typography,
  TextField,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useBudgets } from "../../../hooks/useBudgets";
import { useCategories } from "../../../hooks/useCategories";
import { useTransactions } from "../../../hooks/useTransactions";
import { supabase } from "../../../lib/supabaseClient";
import styles from "../../../styles/Budget.module.css"; 

export default function BudgetPage() {
  const { list: budgets, add } = useBudgets();
  const { list: cats } = useCategories();
  const { list: tx } = useTransactions();

  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  
  const [editingBudget, setEditingBudget] = useState<any | null>(null);

  
  const spentByCat: Record<string, number> = {};
  (tx.data ?? [])
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      spentByCat[t.category_id] =
        (spentByCat[t.category_id] ?? 0) + t.amount;
    });

  
  const onAdd = async () => {
    if (!category || !amount) return;

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) {
      alert("You must be logged in to add a budget.");
      return;
    }

    await add.mutateAsync({
      category_id: category,
      amount: Number(amount),
      user_id: userId,
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
    } as any);

    setCategory("");
    setAmount("");
    setOpen(false);
  };

  
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this budget?")) return;
    await supabase.from("budgets").delete().eq("id", id);
    budgets.refetch();
  };

  
  const handleEditSave = async () => {
    if (!editingBudget) return;
    const { error } = await supabase
      .from("budgets")
      .update({
        category_id: category,
        amount: Number(amount),
      })
      .eq("id", editingBudget.id);

    if (!error) {
      setEditingBudget(null);
      setCategory("");
      setAmount("");
      budgets.refetch();
    }
  };

  return (
    <div
      style={{
        flex: 1,
        height: "calc(100vh - 64px)", 
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Typography variant="h5" gutterBottom style={{ padding: "16px" }}>
        Budgets
      </Typography>

      
      <div className={styles.container}>
        
        <div className={styles.addCard} onClick={() => setOpen(true)}>
          <span className={styles.addIcon}>+</span>
        </div>

        
        {budgets.data?.map((b:any) => {
          const spent = spentByCat[b.category_id] ?? 0;
          const percent = Math.min(100, (spent / b.amount) * 100);

          return (
            <div key={b.id} className={styles.budgetCard}>
            
              <Typography className={styles.budgetTitle}>
                {b.category?.name ?? ""}
              </Typography>

              
              <div className={styles.progressBar}>
              <div
  className={styles.progressFill}
  style={{
    width: `${percent}%`,
    backgroundColor: spent > b.amount ? "red" : "#1976d2", 
  }}
/>

              </div>

              
              <div className={styles.spentInfo}>
                <span>Spent: ₹{spent}</span>
                <span>Budget: ₹{b.amount}</span>
              </div>

            
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => {
                    setEditingBudget(b);
                    setCategory(b.category_id);
                    setAmount(b.amount);
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(b.id)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </div>
            </div>
          );
        })}
      </div>

      
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Budget</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as string)}
            fullWidth
          >
            {cats.data?.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={onAdd} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

    
      <Dialog open={!!editingBudget} onClose={() => setEditingBudget(null)}>
        <DialogTitle>Edit Budget</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as string)}
            fullWidth
            margin="normal"
          >
            {cats.data?.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingBudget(null)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
