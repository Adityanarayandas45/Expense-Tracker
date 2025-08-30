import { Card, CardContent, Typography } from "@mui/material";

export default function SummaryCard({
  title,
  amount,
}: {
  title: string;
  amount: string;
}) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1">{title}</Typography>
        <div className="bigNumber">{amount}</div>
      </CardContent>
    </Card>
  );
}
