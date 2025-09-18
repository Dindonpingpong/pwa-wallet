import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  MenuItem,
  InputAdornment
} from '@mui/material';
import { Add as AddIcon, AccountBalanceWallet } from '@mui/icons-material';

const currencies = [
  { value: 'RUB', symbol: '₽', label: 'Рубли' },
  { value: 'USD', symbol: '$', label: 'Доллары' },
  { value: 'EUR', symbol: '€', label: 'Евро' },
  { value: 'VND', symbol: 'đ', label: 'Донг' }
];

const IncomeForm = ({ onAddTransaction, wallets }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Зарплата');
  const [walletId, setWalletId] = useState(wallets[0]?.id || '');

  const incomeCategories = [
    'Зарплата',
    'Фриланс',
    'Инвестиции',
    'Подарок',
    'Возврат долга',
    'Прочее'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title || !amount || !walletId) return;

    const transaction = {
      title,
      amount: parseFloat(amount),
      category,
      walletId: parseInt(walletId),
      type: 'income'
    };

    onAddTransaction(transaction);
    
    // Сброс формы
    setTitle('');
    setAmount('');
    setCategory('Зарплата');
  };

  const selectedWallet = wallets.find(w => w.id === parseInt(walletId));
  const currencySymbol = currencies.find(c => c.value === selectedWallet?.currency)?.symbol || '₽';

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom color="success.main">
        💵 Добавить доход
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Описание дохода"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Сумма"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              inputProps={{ step: "0.01", min: "0" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {currencySymbol}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Категория"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {incomeCategories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Кошелек"
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountBalanceWallet />
                  </InputAdornment>
                ),
              }}
            >
              {wallets.map((wallet) => (
                <MenuItem key={wallet.id} value={wallet.id}>
                  {wallet.name} ({wallet.balance.toFixed(2)} {currencies.find(c => c.value === wallet.currency)?.symbol})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{ height: '56px' }}
              startIcon={<AddIcon />}
            >
              Добавить доход
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default IncomeForm;