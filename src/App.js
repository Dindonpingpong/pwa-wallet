import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  AppBar,
  Toolbar,
  Box,
  ThemeProvider,
  createTheme,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Backup as BackupIcon, Wallet, TrendingUp, AccountBalance
} from '@mui/icons-material';
import ExpenseForm from './components/ExpenseForm';
import IncomeForm from './components/IncomeForm';
import TransactionList from './components/TransactionList';
import FinancialSummary from './components/FinancialSummary';
import WalletManager from './components/WalletManager';
import DataManager from './components/DataManager';


function App() {
  const [transactions, setTransactions] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#2e7d32',
      },
      secondary: {
        main: '#ff6f00',
      },
      error: {
        main: '#d32f2f',
      },
      success: {
        main: '#2e7d32',
      },
    },
  });

  // В App.js добавляем новые функции
  const importData = (data) => {
    // Валидация и обработка импортируемых данных
    if (data.transactions && Array.isArray(data.transactions)) {
      setTransactions(data.transactions);
    }

    if (data.wallets && Array.isArray(data.wallets)) {
      setWallets(data.wallets);
    }
  };

  const clearAllData = () => {
    setTransactions([]);
    // Оставляем только основной кошелек
    setWallets([{
      id: 1,
      name: 'Основной кошелек',
      currency: 'RUB',
      balance: 0,
      initialBalance: 0
    }]);
  };

  // Загрузка данных из localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    const savedWallets = localStorage.getItem('wallets');

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }

    if (savedWallets) {
      setWallets(JSON.parse(savedWallets));
    } else {
      // Создаем кошелек по умолчанию
      setWallets([{
        id: 1,
        name: 'Основной кошелек',
        currency: 'RUB',
        balance: 0,
        initialBalance: 0
      }]);
    }
  }, []);

  // Сохранение данных в localStorage
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('wallets', JSON.stringify(wallets));
  }, [transactions, wallets]);

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      date: new Date().toISOString()
    };

    setTransactions([...transactions, newTransaction]);

    // Обновляем баланс кошелька
    updateWalletBalance(transaction.walletId, transaction.amount, transaction.type);
  };

  const updateWalletBalance = (walletId, amount, type) => {
    setWallets(prevWallets =>
      prevWallets.map(wallet =>
        wallet.id === walletId
          ? {
            ...wallet,
            balance: type === 'income'
              ? wallet.balance + amount
              : wallet.balance - amount
          }
          : wallet
      )
    );
  };

  const deleteTransaction = (id) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      // Восстанавливаем баланс кошелька
      setWallets(prevWallets =>
        prevWallets.map(wallet =>
          wallet.id === transaction.walletId
            ? {
              ...wallet,
              balance: transaction.type === 'income'
                ? wallet.balance - transaction.amount
                : wallet.balance + transaction.amount
            }
            : wallet
        )
      );

      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const addWallet = (wallet) => {
    setWallets([...wallets, { ...wallet, id: Date.now(), balance: wallet.initialBalance }]);
  };

  const deleteWallet = (id) => {
    // Нельзя удалить кошелек с транзакциями
    const hasTransactions = transactions.some(t => t.walletId === id);
    if (hasTransactions) {
      alert('Нельзя удалить кошелек с транзакциями');
      return;
    }
    setWallets(wallets.filter(wallet => wallet.id !== id));
  };

  const tabs = [
    { label: 'Обзор', icon: <TrendingUp /> },
    { label: 'Операции', icon: <AccountBalance /> },
    { label: 'Кошельки', icon: <Wallet /> },
    { label: 'Данные', icon: <BackupIcon /> } // Новая вкладка
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              💰 Финансовый менеджер
            </Typography>
          </Toolbar>
        </AppBar>

        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          centered
          sx={{ mb: 2 }}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>

        <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
          {activeTab === 0 && (
            <>
              <FinancialSummary
                transactions={transactions}
                wallets={wallets}
              />
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                <IncomeForm
                  onAddTransaction={addTransaction}
                  wallets={wallets}
                  sx={{ flex: 1 }}
                />
                <ExpenseForm
                  onAddTransaction={addTransaction}
                  wallets={wallets}
                  sx={{ flex: 1 }}
                />
              </Box>
            </>
          )}

          {activeTab === 1 && (
            <TransactionList
              transactions={transactions}
              wallets={wallets}
              onDeleteTransaction={deleteTransaction}
            />
          )}

          {activeTab === 2 && (
            <WalletManager
              wallets={wallets}
              onAddWallet={addWallet}
              onDeleteWallet={deleteWallet}
            />
          )}
          {activeTab === 3 && (
            <DataManager
              transactions={transactions}
              wallets={wallets}
              onImportData={importData}
              onClearData={clearAllData}
            />
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;