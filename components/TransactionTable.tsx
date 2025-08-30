"use client";

import React, { useState } from "react";
import {
  Box,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTransactions } from "../hooks/useTransactions";
import { useCategories } from "../hooks/useCategories";
import { supabase } from "../lib/supabaseClient";

export default function TransactionTable({ onEdit }: { onEdit?: (tx: any) => void }) {
  const { list } = useTransactions();
  const { list: cats } = useCategories();
  const transactions = list.data ?? [];

  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [search, setSearch] = useState("");

  
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this transaction?")) return;
    await supabase.from("transactions").delete().eq("id", id);
    list.refetch();
  };

  
  const filtered = transactions.filter((tx) => {
    if (filterType !== "all" && tx.type !== filterType) return false;
    if (filterCategory !== "all" && tx.category_id !== filterCategory) return false;
    if (filterDate && tx.transaction_date !== filterDate) return false;
    if (search && !tx.note?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        Transaction History
      </Typography>

      
      <Box sx={{ display: "flex", gap:2, mb: 2}}>
        
      
        <TextField
          select
          label="Type"
          fullWidth
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setFilterCategory("all"); 
          }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </TextField>

        
        <TextField
          select
          label="Category"
          fullWidth
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          {cats.data
            ?.filter((c) =>
              filterType === "income"
                ? c.name.toLowerCase() === "salary"
                : filterType === "expense"
                ? c.name.toLowerCase() !== "salary"
                : true 
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
          fullWidth
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        
        <TextField
          label="Search"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>
                  {tx.type === "income" ? "💰 Income" : "💸 Expense"}
                </TableCell>
                <TableCell>{tx.note}</TableCell>
                <TableCell>₹{tx.amount}</TableCell>
                <TableCell>{tx.transaction_date}</TableCell>
                <TableCell>
                  {cats.data?.find((c) => c.id === tx.category_id)?.name || "—"}
                </TableCell>
                <TableCell>
                  {onEdit && (
                    <IconButton onClick={() => onEdit(tx)} size="small" color="primary">
                      ✏️
                    </IconButton>
                  )}
                  <IconButton
                    onClick={() => handleDelete(tx.id)}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
