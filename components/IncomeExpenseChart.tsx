"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
} from "recharts";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

interface Props {
  income: number;
  expense: number;
}

export default function IncomeExpenseChart({ income, expense }: Props) {
  const theme = useTheme();

  const data = [
    { name: "Income", value: income, color: "#42A5F5" }, // Blue
    { name: "Expense", value: expense, color: "#EF5350" }, // Red
  ];

  const axisColor = theme.palette.text.primary;
  const gridColor =
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.1)"
      : "rgba(0,0,0,0.08)";

  return (
    <Paper
      sx={{
        p: 3,
        height: 380,
        boxShadow: 3,
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: 600, color: "text.primary", mb: 2 }}
      >
        Income vs Expense
      </Typography>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          barSize={80}
          margin={{ top: 30, right: 20, bottom: 20, left: 20 }} 
        >
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fill: axisColor, fontSize: 14 }}
            axisLine={{ stroke: axisColor }}
            tickLine={{ stroke: axisColor }}
          />
          <YAxis
            tick={{ fill: axisColor, fontSize: 14 }}
            axisLine={{ stroke: axisColor }}
            tickLine={{ stroke: axisColor }}
          />
          <Tooltip
            formatter={(value: number) => `₹${value.toLocaleString()}`}
            contentStyle={{
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "8px",
              boxShadow: theme.shadows[3],
              color: theme.palette.text.primary,
            }}
            labelStyle={{ color: theme.palette.text.secondary }}
          />
          <Legend wrapperStyle={{ color: theme.palette.text.primary }} />
          <Bar
            dataKey="value"
            radius={[8, 8, 0, 0]}
            label={{ position: "top", offset: 10 }} 
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
