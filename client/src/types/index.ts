// Basic Types
export interface UserType {
  id: string;
  username: string;
  email: string;
  displayName?: string;
}

export interface GameType {
  id: string;
  title: string;
  description: string;
  price: number;
  releaseDate: string;
  category: 'action' | 'rpg' | 'strategy' | 'simulation' | string;
  rating: number;
  owned: boolean;
  imageUrl: string;
  publisher: string;
  playTime: number;
}

export interface TransactionType {
  hash: string;
  from: string;
  to: string;
  amount: number;
  date: string;
  type: 'in' | 'out';
  status: 'pending' | 'confirmed' | 'failed';
}

// State Types
export interface UserState {
  currentUser: UserType | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface WalletState {
  address: string;
  balance: number;
  isConnected: boolean;
  transactions: TransactionType[];
}

export interface GamesState {
  allGames: GameType[];
  recentGames: GameType[];
  favoriteGames: string[];
  loading: boolean;
  error: string | null;
}

// API Request/Response Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: UserType;
  token: string;
}

export interface GamePurchaseRequest {
  gameId: string;
  paymentMethod: 'wallet' | 'card' | 'crypto';
}

export interface GamePurchaseResponse {
  success: boolean;
  transaction?: TransactionType;
  error?: string;
}

// Form Types
export interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileFormData {
  username: string;
  email: string;
  displayName: string;
}

export interface WalletFormData {
  amount: number;
  toAddress: string;
  gasPrice?: number;
}
