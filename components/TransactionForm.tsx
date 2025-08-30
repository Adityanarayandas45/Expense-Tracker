"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useCategories } from "../hooks/useCategories";
import { useTransactions } from "../hooks/useTransactions";
import { supabase } from "../lib/supabaseClient";

export default function TransactionForm() {
  const { list: cats } = useCategories();
  const { add } = useTransactions();

  const [form, setForm] = useState<any>({
    amount: "",
    type: "expense",
    note: "",
    category_id: "",
    transaction_date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) {
      alert("You must be logged in to add a transaction.");
      return;
    }

    await add.mutateAsync({
      ...form,
      amount: Number(form.amount),
      user_id: userId,
    });

    // reset form
    setForm({
      amount: "",
      type: "expense",
      note: "",
      category_id: "",
      transaction_date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}
    >
      <Typography variant="h6">Add Transaction</Typography>

      <TextField
        label="Amount"
        type="number"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
        fullWidth
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
  {cats.data &&
  cats.data.filter((c) =>
    form.type === "income"
      ? c.name.toLowerCase() === "salary"
      : c.name.toLowerCase() !== "salary"
  ).length > 0 ? (
    cats.data
      .filter((c) =>
        form.type === "income"
          ? c.name.toLowerCase() === "salary"
          : c.name.toLowerCase() !== "salary"
      )
      .map((c) => (
        <MenuItem key={c.id} value={c.id}>
          {c.name}
        </MenuItem>
      ))
  ) : (
    <MenuItem disabled>No categories available</MenuItem>
  )}
</TextField>
      <TextField
        label="Date"
        type="date"
        value={form.transaction_date}
        onChange={(e) => setForm({ ...form, transaction_date: e.target.value })}
        fullWidth
      />

      <Button type="submit" variant="contained">
        Save
      </Button>
    </Box>
  );
}
