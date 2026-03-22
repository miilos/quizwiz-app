import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserState } from '../types';

const initialState: UserState = {
  id: null,
  username: null,
  email: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.email = action.payload.email;
    },
    clearUser(state) {
      state.id = null;
      state.username = null;
      state.email = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
