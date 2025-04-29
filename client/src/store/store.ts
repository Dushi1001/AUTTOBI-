import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';

import userReducer from './slices/userSlice';
import walletReducer from './slices/walletSlice';
import gamesReducer from './slices/gamesSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'wallet', 'games']
};

const rootReducer = combineReducers({
  user: userReducer,
  wallet: walletReducer,
  games: gamesReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
