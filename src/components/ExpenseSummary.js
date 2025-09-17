import React from 'react';
import { Paper, Typography, Grid, Box } from '@mui/material';
import { AccountBalanceWallet, TrendingUp, Category } from '@mui/icons-material';

const ExpenseSummary = ({ expenses }) => {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const categories = [...new Set(expenses.map(expense => expense.category))];

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Статистика
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Box sx={{ textAlign: 'center' }}>
            <AccountBalanceWallet color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h5" sx={{ mt: 1 }}>
              {total.toFixed(2)} ₽
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Общая сумма
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ textAlign: 'center' }}>
            <TrendingUp color="secondary" sx={{ fontSize: 40 }} />
            <Typography variant="h5" sx={{ mt: 1 }}>
              {expenses.length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Количество записей
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Category color="success" sx={{ fontSize: 40 }} />
            <Typography variant="h5" sx={{ mt: 1 }}>
              {categories.length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Категории
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ExpenseSummary;