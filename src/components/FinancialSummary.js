import React from 'react';
import { Paper, Typography, Grid, Box, Card, CardContent } from '@mui/material';
import { AccountBalanceWallet, TrendingUp, TrendingDown, AccountBalance } from '@mui/icons-material';

const FinancialSummary = ({ transactions, wallets }) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Финансовая сводка
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AccountBalanceWallet color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h5" sx={{ mt: 1 }}>
                {wallets.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Кошельки
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp color="success" sx={{ fontSize: 40 }} />
              <Typography variant="h5" sx={{ mt: 1 }} color="success.main">
                {totalIncome.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Всего доходов
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingDown color="error" sx={{ fontSize: 40 }} />
              <Typography variant="h5" sx={{ mt: 1 }} color="error.main">
                {totalExpenses.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Всего расходов
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AccountBalance color={balance >= 0 ? "success" : "error"} sx={{ fontSize: 40 }} />
              <Typography 
                variant="h5" 
                sx={{ mt: 1 }} 
                color={balance >= 0 ? "success.main" : "error.main"}
              >
                {balance.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Баланс
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Баланс по кошелькам */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Баланс по кошелькам
        </Typography>
        <Grid container spacing={2}>
          {wallets.map((wallet) => (
            <Grid item xs={12} sm={6} md={4} key={wallet.id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">{wallet.name}</Typography>
                  <Typography 
                    variant="h5" 
                    color={wallet.balance >= 0 ? "success.main" : "error.main"}
                  >
                    {wallet.balance.toFixed(2)} {wallet.currency}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Начальный баланс: {wallet.initialBalance.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default FinancialSummary;