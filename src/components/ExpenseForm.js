import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Grid,
  Box,
  Typography
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { format } from 'date-fns';

const ExpenseForm = ({ onAddExpense }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title || !amount || !category) return;

    const expense = {
      title,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString()
    };

    onAddExpense(expense);
    
    // Сброс формы
    setTitle('');
    setAmount('');
    setCategory('');
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Добавить расход
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Название"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Сумма"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              inputProps={{ step: "0.01" }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Категория"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ height: '100%' }}
              startIcon={<AddIcon />}
            >
              Добавить
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ExpenseForm;