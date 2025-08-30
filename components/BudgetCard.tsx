import { Card, CardContent, Typography, LinearProgress } from "@mui/material";
import { currency } from "../lib/utils";

export default function BudgetCard({
  category,
  spent,
  budget,
}: {
  category: string;
  spent: number;
  budget: number;
}) {
  const percent = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6">{category}</Typography>
        <Typography>
          {currency(spent)} / {currency(budget)}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={percent}
          sx={{ mt: 1 }}
          color={percent >= 100 ? "error" : "primary"}
        />
      </CardContent>
    </Card>
  );
}
