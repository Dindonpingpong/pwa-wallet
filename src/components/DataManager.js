import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Backup as BackupIcon,
  Restore as RestoreIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const DataManager = ({ transactions, wallets, onImportData, onClearData }) => {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [importData, setImportData] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');

  const exportData = () => {
    const data = {
      transactions,
      wallets,
      version: '1.0',
      exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `financial-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(link.href);
  };

  const handleImport = () => {
    try {
      if (!importData.trim()) {
        setImportError('Пожалуйста, введите данные для импорта');
        return;
      }

      const parsedData = JSON.parse(importData);
      
      // Валидация данных
      if (!parsedData.transactions || !parsedData.wallets) {
        setImportError('Неверный формат данных. Файл должен содержать transactions и wallets');
        return;
      }

      if (!Array.isArray(parsedData.transactions) || !Array.isArray(parsedData.wallets)) {
        setImportError('Данные transactions и wallets должны быть массивами');
        return;
      }

      // Подтверждение импорта
      if (window.confirm(
        `Импортировать ${parsedData.transactions.length} транзакций и ${parsedData.wallets.length} кошельков? ` +
        'Текущие данные будут заменены.'
      )) {
        onImportData(parsedData);
        setImportSuccess('Данные успешно импортированы!');
        setImportData('');
        setImportError('');
        setTimeout(() => setIsImportDialogOpen(false), 1500);
      }

    } catch (error) {
      setImportError('Ошибка парсинга JSON: ' + error.message);
    }
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setImportData(e.target.result);
      setImportError('');
    };
    reader.onerror = () => {
      setImportError('Ошибка чтения файла');
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (window.confirm('Вы уверены, что хотите удалить ВСЕ данные? Это действие нельзя отменить.')) {
      onClearData();
      setIsClearDialogOpen(false);
    }
  };

  const getStats = () => ({
    transactions: transactions.length,
    wallets: wallets.length,
    totalIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  });

  const stats = getStats();

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        📊 Управление данными
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Текущая статистика:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary={`Транзакций: ${stats.transactions}`} />
          </ListItem>
          <ListItem>
            <ListItemText primary={`Кошельков: ${stats.wallets}`} />
          </ListItem>
          <ListItem>
            <ListItemText primary={`Общий доход: ${stats.totalIncome.toFixed(2)}`} />
          </ListItem>
          <ListItem>
            <ListItemText primary={`Общие расходы: ${stats.totalExpenses.toFixed(2)}`} />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<BackupIcon />}
          onClick={exportData}
          fullWidth
        >
          Экспорт данных
        </Button>

        <Button
          variant="outlined"
          color="primary"
          startIcon={<RestoreIcon />}
          onClick={() => setIsImportDialogOpen(true)}
          fullWidth
        >
          Импорт данных
        </Button>

        <Divider />

        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => setIsClearDialogOpen(true)}
          fullWidth
          disabled={transactions.length === 0 && wallets.length <= 1}
        >
          Очистить все данные
        </Button>
      </Box>

      {/* Диалог импорта */}
      <Dialog 
        open={isImportDialogOpen} 
        onClose={() => setIsImportDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RestoreIcon />
            Импорт данных
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Вставьте JSON данные или выберите файл для импорта
          </Typography>

          {importSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {importSuccess}
            </Alert>
          )}

          {importError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {importError}
            </Alert>
          )}

          <Box sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<BackupIcon />}
            >
              Выбрать файл
              <input
                type="file"
                accept=".json,application/json"
                hidden
                onChange={handleFileImport}
              />
            </Button>
          </Box>

          <textarea
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            placeholder="Вставьте JSON данные здесь..."
            style={{
              width: '100%',
              minHeight: '200px',
              fontFamily: 'monospace',
              fontSize: '14px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              resize: 'vertical'
            }}
          />

          <Alert severity="warning" sx={{ mt: 2 }}>
            <WarningIcon />
            Внимание: Импорт данных заменит все текущие данные!
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsImportDialogOpen(false)}>
            Отмена
          </Button>
          <Button 
            onClick={handleImport} 
            variant="contained"
            disabled={!importData.trim()}
          >
            Импортировать
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог очистки */}
      <Dialog 
        open={isClearDialogOpen} 
        onClose={() => setIsClearDialogOpen(false)}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon color="error" />
            Очистка всех данных
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            Это действие удалит ВСЕ транзакции и кошельки (кроме основного). 
            Действие нельзя отменить!
          </Alert>
          <Typography>
            Будет удалено: {stats.transactions} транзакций и {stats.wallets} кошельков
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsClearDialogOpen(false)}>
            Отмена
          </Button>
          <Button 
            onClick={handleClearData} 
            variant="contained"
            color="error"
          >
            Удалить все
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default DataManager;