"use client";

import React, { useState } from "react";
import {
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import TransactionForm from "../../../components/TransactionForm";
import TransactionTable from "../../../components/TransactionTable";
import { useTransactions } from "../../../hooks/useTransactions";
import { useCategories } from "../../../hooks/useCategories"; 
import { supabase } from "../../../lib/supabaseClient";
import * as Papa from "papaparse"; 
import { saveAs } from "file-saver"; 

export default function TransactionsPage() {
  const { list } = useTransactions();
  const { list: cats } = useCategories();
  const tx = list.data ?? [];
  const [editingTx, setEditingTx] = useState<any | null>(null);
  const [form, setForm] = useState<any>({
    amount: "",
    type: "expense",
    note: "",
    category_id: "",
    transaction_date: new Date().toISOString().split("T")[0],
  });

  
  const handleEditOpen = (transaction: any) => {
    setEditingTx(transaction);
    setForm({
      amount: transaction.amount,
      type: transaction.type,
      note: transaction.note,
      category_id: transaction.category_id,
      transaction_date: transaction.transaction_date,
    });
  };

  
  const handleEditSave = async () => {
    if (!editingTx) return;

    const { error } = await supabase
      .from("transactions")
      .update({
        amount: Number(form.amount),
        type: form.type,
        note: form.note,
        category_id: form.category_id,
        transaction_date: form.transaction_date,
      })
      .eq("id", editingTx.id);

    if (error) {
      alert(error.message);
    } else {
      setEditingTx(null);
      list.refetch();
    }
  };

  
  const exportCSV = () => {
    if (!tx.length) {
      alert("No transactions to export!");
      return;
    }

    const csvData = tx.map((t) => ({
      ID: t.id,
      Amount: t.amount,
      Type: t.type,
      Note: t.note || "",
      Category:
        cats.data?.find((c) => c.id === t.category_id)?.name || "Uncategorized",
      Date: new Date(t.transaction_date).toLocaleDateString(),
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "transactions.csv");
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Transactions
      </Typography>

    
      <TransactionForm />

      
      <Box sx={{ my: 2 }}>
        <Button variant="outlined" onClick={exportCSV}>
          Export Transactions (CSV)
        </Button>
      </Box>

      
      <TransactionTable onEdit={handleEditOpen} />

    
      <Dialog open={!!editingTx} onClose={() => setEditingTx(null)}>
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2}}>
          <TextField
            label="Amount"
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            fullWidth
            margin="normal"
          />

          <TextField
            select
            label="Type"
            value={form.type}
            onChange={(e) => {
              const newType = e.target.value;
              setForm({
                ...form,
                type: newType,
                category_id:
                  newType === "income"
                    ? cats.data?.find((c) => c.name.toLowerCase() === "salary")?.id || ""
                    : "",
              });
            }}
            fullWidth
          >
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </TextField>

          <TextField
            label="Note"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            fullWidth
          />

          <TextField
            select
            label="Category"
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            fullWidth
            
            disabled={form.type === "income"} 
          >
            {cats.data
              ?.filter((c) =>
                form.type === "income"
                  ? c.name.toLowerCase() === "salary"
                  : c.name.toLowerCase() !== "salary"
              )
              .map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
          </TextField>

          <TextField
            label="Date"
            type="date"
            value={form.transaction_date}
            onChange={(e) => setForm({ ...form, transaction_date: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingTx(null)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
