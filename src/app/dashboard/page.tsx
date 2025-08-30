"use client";

import { Typography, Card, CardContent, IconButton } from "@mui/material";
import { AttachMoney, ArrowDownward, EmojiEmotions } from "@mui/icons-material";
import CategoryChart from "../../../components/CategoryChart";
import { useTransactions } from "../../../hooks/useTransactions";
import { useCategories } from "../../../hooks/useCategories";
import { currency } from "../../../lib/utils";
import IncomeExpenseChart from "../../../components/IncomeExpenseChart";
import styles from "../../../styles/Dashboard.module.css";

export default function DashboardPage() {
  const { list: txList } = useTransactions();
  const { list: catList } = useCategories();

  const tx = txList.data ?? [];
  const cats = catList.data ?? [];

  const income = tx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = tx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  
  const expenseData =
    tx.filter((t) => t.type === "expense").reduce((acc: { name: string; value: number }[], t) => {
      const categoryName = cats.find((c) => c.id === t.category_id)?.name || "Other";
      const existing = acc.find((a) => a.name === categoryName);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: categoryName, value: t.amount });
      }
      return acc;
    }, []);

  return (
    <div className={styles.container}>
    
      <div className={styles.cards}>
        <Card className={styles.card}>
          <CardContent>
            <Typography className={styles.cardTitle}>Income</Typography>
            <Typography className={styles.cardValue}>{currency(income)}</Typography>
            <div className={styles.cardIcon}>
              <IconButton color="success">
                <AttachMoney />
              </IconButton>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.card}>
          <CardContent>
            <Typography className={styles.cardTitle}>Expenses</Typography>
            <Typography className={styles.cardValue}>{currency(expense)}</Typography>
            <div className={styles.cardIcon}>
              <IconButton color="error">
                <ArrowDownward />
              </IconButton>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.card}>
          <CardContent>
            <Typography className={styles.cardTitle}>Balance</Typography>
            <Typography className={styles.cardValue}>{currency(balance)}</Typography>
            <div className={styles.cardIcon}>
              <IconButton color="primary">
                <EmojiEmotions />
              </IconButton>
            </div>
          </CardContent>
        </Card>
      </div>

    
      <div className={styles.charts}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Expense Breakdown
            </Typography>
            <CategoryChart data={expenseData} />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Income vs Expense
            </Typography>
            <IncomeExpenseChart income={income} expense={expense} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
