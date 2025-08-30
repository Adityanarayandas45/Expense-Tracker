"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useTransactions } from "../../../hooks/useTransactions";
import { useCategories } from "../../../hooks/useCategories";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import dayjs from "dayjs";

export default function SummaryPage() {
  const { list: tx } = useTransactions();
  const { list: cats } = useCategories();
  const transactions = tx.data ?? [];

  
  const [month, setMonth] = useState(dayjs());
  const monthName = month.format("MMMM YYYY");

  
  const monthlyTx = transactions.filter((t) =>
    dayjs(t.transaction_date).isSame(month, "month")
  );

  const income = monthlyTx
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = monthlyTx
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;

  
  const monthlyTrend = Object.values(
    transactions.reduce(
      (
        acc: Record<string, { date: string; income: number; expense: number }>,
        t
      ) => {
        const key = dayjs(t.transaction_date).format("MMM YYYY");
        if (!acc[key]) {
          acc[key] = { date: key, income: 0, expense: 0 };
        }
        if (t.type === "income") {
          acc[key].income += t.amount;
        } else if (t.type === "expense") {
          acc[key].expense += t.amount;
        }
        return acc;
      },
      {}
    )
  );

  
  const incomeByCategory = Object.values(
    monthlyTx
      .filter((t) => t.type === "income")
      .reduce(
        (
          acc: Record<string, { category: string; amount: number }>,
          t
        ) => {
          const name =
            cats.data?.find((c) => c.id === t.category_id)?.name || "Other";
          if (!acc[name]) {
            acc[name] = { category: name, amount: 0 };
          }
          acc[name].amount += t.amount;
          return acc;
        },
        {}
      )
  );

  return (
    <Box
      sx={{
        flex: 1,
        height: "calc(100vh - 64px)",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        p: 3,
      }}
    >
    
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <IconButton onClick={() => setMonth(month.subtract(1, "month"))}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ minWidth: 150, textAlign: "center" }}>
          {monthName}
        </Typography>
        <IconButton onClick={() => setMonth(month.add(1, "month"))}>
          <ArrowForward />
        </IconButton>
      </Box>

      
      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, mb: 4 }}
      >
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Monthly Income
            </Typography>
            <Typography variant="h5">₹{income}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Monthly Expenses
            </Typography>
            <Typography variant="h5">₹{expenses}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Monthly Balance
            </Typography>
            <Typography variant="h5">₹{balance}</Typography>
          </CardContent>
        </Card>
      </Box>

      
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 3,
          flex: 1,
        }}
      >
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="income" fill="#42A5F5" name="Income" />
            <Bar dataKey="expense" fill="#EF5350" name="Expense" />
          </BarChart>
        </ResponsiveContainer>

        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={incomeByCategory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#1e88e5" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
