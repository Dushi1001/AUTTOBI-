import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { apiRequest } from '@/lib/queryClient';

interface Asset {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  price: number;
  value: number;
  change24h: number;
  address?: string;
}

interface PortfolioHistory {
  labels: string[];
  data: number[];
}

interface PortfolioState {
  totalValue: number;
  totalChange24h: number;
  assets: Asset[];
  history: PortfolioHistory;
  timeframe: string;
  loading: boolean;
  error: string | null;
}

const initialState: PortfolioState = {
  totalValue: 0,
  totalChange24h: 0,
  assets: [],
  history: {
    labels: [],
    data: [],
  },
  timeframe: '7d',
  loading: false,
  error: null,
};

export const fetchPortfolio = createAsyncThunk(
  'portfolio/fetchPortfolio',
  async (timeframe: string = '7d', { rejectWithValue }) => {
    try {
      const response = await apiRequest('GET', `/api/portfolio?timeframe=${timeframe}`, undefined);
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch portfolio');
    }
  }
);

export const fetchPortfolioHistory = createAsyncThunk(
  'portfolio/fetchPortfolioHistory',
  async (timeframe: string = '7d', { rejectWithValue }) => {
    try {
      const response = await apiRequest('GET', `/api/portfolio/history?timeframe=${timeframe}`, undefined);
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch portfolio history');
    }
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setTimeframe: (state, action: PayloadAction<string>) => {
      state.timeframe = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Portfolio
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action: PayloadAction<{
        totalValue: number;
        totalChange24h: number;
        assets: Asset[];
      }>) => {
        state.loading = false;
        state.totalValue = action.payload.totalValue;
        state.totalChange24h = action.payload.totalChange24h;
        state.assets = action.payload.assets;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Portfolio History
      .addCase(fetchPortfolioHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolioHistory.fulfilled, (state, action: PayloadAction<PortfolioHistory>) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchPortfolioHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setTimeframe, clearError } = portfolioSlice.actions;

export const selectPortfolio = (state: RootState) => state.portfolio;
export const selectTotalValue = (state: RootState) => state.portfolio.totalValue;
export const selectAssets = (state: RootState) => state.portfolio.assets;
export const selectHistory = (state: RootState) => state.portfolio.history;
export const selectTimeframe = (state: RootState) => state.portfolio.timeframe;
export const selectPortfolioLoading = (state: RootState) => state.portfolio.loading;
export const selectPortfolioError = (state: RootState) => state.portfolio.error;

export default portfolioSlice.reducer;
