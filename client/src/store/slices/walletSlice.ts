import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TransactionType } from '@/types';

interface WalletState {
  address: string;
  balance: number;
  isConnected: boolean;
  transactions: TransactionType[];
}

const initialState: WalletState = {
  address: '',
  balance: 0,
  isConnected: false,
  transactions: [
    {
      hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
      to: '0x1234567890123456789012345678901234567890',
      amount: 0.5,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      type: 'in',
      status: 'confirmed'
    },
    {
      hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      from: '0x1234567890123456789012345678901234567890',
      to: '0x9876543210987654321098765432109876543210',
      amount: 0.2,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      type: 'out',
      status: 'confirmed'
    },
    {
      hash: '0x9876543210abcdef9876543210abcdef9876543210abcdef9876543210abcdef',
      from: '0x1234567890123456789012345678901234567890',
      to: '0xabcdef1234567890abcdef1234567890abcdef12',
      amount: 0.1,
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      type: 'out',
      status: 'confirmed'
    }
  ]
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    connectWallet: (state, action: PayloadAction<{ address: string; balance: number; isConnected: boolean }>) => {
      state.address = action.payload.address;
      state.balance = action.payload.balance;
      state.isConnected = action.payload.isConnected;
    },
    disconnectWallet: (state) => {
      state.address = '';
      state.balance = 0;
      state.isConnected = false;
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
    addTransaction: (state, action: PayloadAction<TransactionType>) => {
      state.transactions.unshift(action.payload);
    }
  }
});

export const { connectWallet, disconnectWallet, updateBalance, addTransaction } = walletSlice.actions;
export default walletSlice.reducer;
