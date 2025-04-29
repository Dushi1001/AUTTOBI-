import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userId: string | null;
  username: string;
  email: string | null;
  displayName: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  userId: null,
  username: 'GamerX',
  email: null,
  displayName: null,
  isAuthenticated: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ username: string; userId: string }>) => {
      state.username = action.payload.username;
      state.userId = action.payload.userId;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.username = 'GamerX';
      state.userId = null;
      state.email = null;
      state.displayName = null;
      state.isAuthenticated = false;
    },
    updateUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    updateProfile: (state, action: PayloadAction<{ username?: string; email?: string; displayName?: string }>) => {
      if (action.payload.username) state.username = action.payload.username;
      if (action.payload.email) state.email = action.payload.email;
      if (action.payload.displayName) state.displayName = action.payload.displayName;
    }
  }
});

export const { login, logout, updateUsername, updateProfile } = userSlice.actions;
export default userSlice.reducer;
