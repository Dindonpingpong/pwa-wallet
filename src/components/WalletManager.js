import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Box,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const currencies = [
  { value: 'RUB', symbol: '₽', label: 'Рубли' },
  { value: 'USD', symbol: '$', label: 'Доллары' },
  { value: 'EUR', symbol: '€', label: 'Евро' },
  { value: 'VND', symbol: 'đ', label: 'Донг' }
];

const WalletManager = ({ wallets, onAddWallet, onDeleteWallet }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newWallet, setNewWallet] = useState({
    name: '',
    currency: 'RUB',
    initialBalance: 0
  });

  const handleAddWallet = () => {
    if (!newWallet.name) return;
    
    onAddWallet(newWallet);
    setNewWallet({
      name: '',
      currency: 'RUB',
      initialBalance: 0
    });
    setIsDialogOpen(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Управление кошельками</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsDialogOpen(true)}
        >
          Добавить кошелек
        </Button>
      </Box>

      <Grid container spacing={2}>
        {wallets.map((wallet) => (
          <Grid item xs={12} sm={6} md={4} key={wallet.id}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <Box>
                    <Typography variant="h6">{wallet.name}</Typography>
                    <Typography color="textSecondary">
                      {currencies.find(c => c.value === wallet.currency)?.label}
                    </Typography>
                    <Typography 
                      variant="h5" 
                      color={wallet.balance >= 0 ? "success.main" : "error.main"}
                      sx={{ mt: 1 }}
                    >
                      {wallet.balance.toFixed(2)} {currencies.find(c => c.value === wallet.currency)?.symbol}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => onDeleteWallet(wallet.id)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Добавить новый кошелек</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Название кошелька"
                value={newWallet.name}
                onChange={(e) => setNewWallet({ ...newWallet, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Валюта"
                value={newWallet.currency}
                onChange={(e) => setNewWallet({ ...newWallet, currency: e.target.value })}
              >
                {currencies.map((currency) => (
                  <MenuItem key={currency.value} value={currency.value}>
                    {currency.label} ({currency.symbol})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Начальный баланс"
                type="number"
                value={newWallet.initialBalance}
                onChange={(e) => setNewWallet({ ...newWallet, initialBalance: parseFloat(e.target.value) || 0 })}
                inputProps={{ step: "0.01" }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleAddWallet} variant="contained">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default WalletManager;