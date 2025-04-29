import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameType } from '@/types';

interface GamesState {
  allGames: GameType[];
  recentGames: GameType[];
  favoriteGames: string[];
  loading: boolean;
  error: string | null;
}

// Initial state with sample game data
const initialState: GamesState = {
  allGames: [
    {
      id: '1',
      title: 'Cyberpunk Arena',
      description: 'A futuristic battle arena game with advanced cybernetic augmentations and fast-paced combat.',
      price: 59.99,
      releaseDate: '2023-03-15',
      category: 'action',
      rating: 4.5,
      owned: true,
      imageUrl: '',
      publisher: 'Future Games',
      playTime: 42
    },
    {
      id: '2',
      title: 'Stellar Command',
      description: 'Command a fleet of starships and conquer the galaxy in this epic space strategy game.',
      price: 49.99,
      releaseDate: '2023-04-22',
      category: 'strategy',
      rating: 4.7,
      owned: true,
      imageUrl: '',
      publisher: 'Galaxy Studios',
      playTime: 35
    },
    {
      id: '3',
      title: 'Racing Evolution',
      description: 'Experience the thrill of high-speed racing with realistic physics and stunning visuals.',
      price: 39.99,
      releaseDate: '2023-02-10',
      category: 'simulation',
      rating: 4.3,
      owned: true,
      imageUrl: '',
      publisher: 'Speed Games',
      playTime: 22
    },
    {
      id: '4',
      title: 'Galaxy Conquest',
      description: 'Build your space empire, research advanced technologies, and dominate the galaxy.',
      price: 44.99,
      releaseDate: '2023-01-05',
      category: 'strategy',
      rating: 4.6,
      owned: false,
      imageUrl: '',
      publisher: 'Cosmic Interactive',
      playTime: 0
    },
    {
      id: '5',
      title: 'Medieval Legends',
      description: 'Embark on an epic fantasy adventure with rich storytelling and immersive RPG elements.',
      price: 54.99,
      releaseDate: '2023-05-20',
      category: 'rpg',
      rating: 4.8,
      owned: false,
      imageUrl: '',
      publisher: 'Epic Tales',
      playTime: 0
    },
    {
      id: '6',
      title: 'Crypto Tycoon',
      description: 'Build your blockchain empire in this economic simulation game with crypto mining and trading.',
      price: 29.99,
      releaseDate: '2023-06-01',
      category: 'simulation',
      rating: 4.2,
      owned: false,
      imageUrl: '',
      publisher: 'Blockchain Games',
      playTime: 0
    }
  ],
  recentGames: [
    {
      id: '1',
      title: 'Cyberpunk Arena',
      description: 'A futuristic battle arena game with advanced cybernetic augmentations and fast-paced combat.',
      price: 59.99,
      releaseDate: '2023-03-15',
      category: 'action',
      rating: 4.5,
      owned: true,
      imageUrl: '',
      publisher: 'Future Games',
      playTime: 42
    },
    {
      id: '2',
      title: 'Stellar Command',
      description: 'Command a fleet of starships and conquer the galaxy in this epic space strategy game.',
      price: 49.99,
      releaseDate: '2023-04-22',
      category: 'strategy',
      rating: 4.7,
      owned: true,
      imageUrl: '',
      publisher: 'Galaxy Studios',
      playTime: 35
    },
    {
      id: '3',
      title: 'Racing Evolution',
      description: 'Experience the thrill of high-speed racing with realistic physics and stunning visuals.',
      price: 39.99,
      releaseDate: '2023-02-10',
      category: 'simulation',
      rating: 4.3,
      owned: true,
      imageUrl: '',
      publisher: 'Speed Games',
      playTime: 22
    }
  ],
  favoriteGames: ['1', '2'],
  loading: false,
  error: null
};

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    purchaseGame: (state, action: PayloadAction<string>) => {
      const gameId = action.payload;
      const game = state.allGames.find(g => g.id === gameId);
      
      if (game && !game.owned) {
        game.owned = true;
        state.recentGames = [game, ...state.recentGames.filter(g => g.id !== gameId)].slice(0, 10);
      }
    },
    addToFavorites: (state, action: PayloadAction<string>) => {
      const gameId = action.payload;
      if (!state.favoriteGames.includes(gameId)) {
        state.favoriteGames.push(gameId);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favoriteGames = state.favoriteGames.filter(id => id !== action.payload);
    },
    updatePlayTime: (state, action: PayloadAction<{gameId: string, time: number}>) => {
      const { gameId, time } = action.payload;
      const allGame = state.allGames.find(g => g.id === gameId);
      const recentGame = state.recentGames.find(g => g.id === gameId);
      
      if (allGame) {
        allGame.playTime += time;
      }
      
      if (recentGame) {
        recentGame.playTime += time;
      }
    },
    addNewGame: (state, action: PayloadAction<GameType>) => {
      state.allGames.push(action.payload);
    },
    setGamesLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setGamesError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const {
  purchaseGame,
  addToFavorites,
  removeFromFavorites,
  updatePlayTime,
  addNewGame,
  setGamesLoading,
  setGamesError
} = gamesSlice.actions;

export default gamesSlice.reducer;
