"use client";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Paper, Typography, useTheme } from "@mui/material";

interface Props {
  data: { name: string; value: number }[];
}

const COLORS = [
  "#42A5F5", // blue
  "#66BB6A", // green
  "#FFA726", // orange
  "#EF5350", // red
  "#AB47BC", // purple
  "#26C6DA", // teal
  "#FF7043", // deep orange
  "#9CCC65", // light green
];

const CategoryChart: React.FC<Props> = ({ data }) => {
  const theme = useTheme();

  if (!data || data.length === 0)
    return <Typography>No expenses yet</Typography>;

  return (
    <Paper
      sx={{
        p: 3,
        mb: 4,
        height: 380,
        boxShadow: 3,
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: 600, color: "text.primary", mb: 2 }}
      >
        Expense Breakdown
      </Typography>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            labelLine={false}
            label={({ name, percent, value }: any) =>
              `${name}: ₹${value} (${(percent * 100).toFixed(0)}%)`
            }
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke={theme.palette.background.paper}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `₹${value.toLocaleString()}`}
            contentStyle={{
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "8px",
              boxShadow: theme.shadows[3],
              color: theme.palette.text.primary,
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={45}
            wrapperStyle={{ color: theme.palette.text.primary }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default CategoryChart;
