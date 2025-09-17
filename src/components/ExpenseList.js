import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Typography,
  Chip
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { format } from 'date-fns';

const ExpenseList = ({ expenses, onDeleteExpense }) => {
  if (expenses.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Список расходов
        </Typography>
        <Typography color="textSecondary" align="center">
          Нет добавленных расходов
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Список расходов
      </Typography>
      <List>
        {expenses.map((expense) => (
          <ListItem key={expense.id} divider>
            <ListItemText
              primary={expense.title}
              secondary={
                <>
                  {format(new Date(expense.date), 'dd.MM.yyyy HH:mm')}
                  <Chip
                    label={expense.category}
                    size="small"
                    sx={{ ml: 1 }}
                    color="primary"
                    variant="outlined"
                  />
                </>
              }
            />
            <ListItemText
              primary={`${expense.amount.toFixed(2)} ₽`}
              sx={{ textAlign: 'right', mr: 2 }}
              primaryTypographyProps={{
                variant: 'h6',
                color: 'error.main'
              }}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => onDeleteExpense(expense.id)}
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

export default ExpenseList;