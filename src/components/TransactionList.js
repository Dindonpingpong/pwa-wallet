import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Typography,
  Chip,
  Box
} from '@mui/material';
import { Delete as DeleteIcon, AccountBalanceWallet } from '@mui/icons-material';
import { format } from 'date-fns';

const currencies = [
  { value: 'RUB', symbol: '₽', label: 'Рубли' },
  { value: 'USD', symbol: '$', label: 'Доллары' },
  { value: 'EUR', symbol: '€', label: 'Евро' },
  { value: 'VND', symbol: 'đ', label: 'Донг' }
];

const TransactionList = ({ transactions, wallets, onDeleteTransaction }) => {
  if (transactions.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          История операций
        </Typography>
        <Typography color="textSecondary" align="center">
          Нет операций
        </Typography>
      </Paper>
    );
  }

  const getWalletName = (walletId) => {
    const wallet = wallets.find(w => w.id === walletId);
    return wallet ? wallet.name : 'Неизвестный кошелек';
  };

  const getCurrencySymbol = (walletId) => {
    const wallet = wallets.find(w => w.id === walletId);
    const currency = currencies.find(c => c.value === wallet?.currency);
    return currency ? currency.symbol : '₽';
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        История операций
      </Typography>
      <List>
        {transactions.map((transaction) => (
          <ListItem key={transaction.id} divider>
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <ListItemText
                primary={transaction.title}
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Chip
                      label={transaction.category}
                      size="small"
                      color={transaction.type === 'income' ? 'success' : 'error'}
                      variant="outlined"
                    />
                    <Chip
                      icon={<AccountBalanceWallet />}
                      label={getWalletName(transaction.walletId)}
                      size="small"
                      variant="outlined"
                    />
                    <Typography variant="body2" color="textSecondary">
                      {format(new Date(transaction.date), 'dd.MM.yyyy HH:mm')}
                    </Typography>
                  </Box>
                }
              />
            </Box>
            <ListItemText
              primary={`${transaction.amount.toFixed(2)} ${getCurrencySymbol(transaction.walletId)}`}
              sx={{ textAlign: 'right', mr: 2 }}
              primaryTypographyProps={{
                variant: 'h6',
                color: transaction.type === 'income' ? 'success.main' : 'error.main'
              }}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => onDeleteTransaction(transaction.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default TransactionList;