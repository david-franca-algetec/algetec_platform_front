/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Token, User } from '../../models';
import { authApi } from '../../services/auth.service';
import { RootState } from '../store';

interface AuthState {
  isLoggedIn: boolean;
  token: Token | null;
  user: User | null;
  isDarkMode: boolean;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  user: null,
  isDarkMode: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => ({
      ...initialState,
      isDarkMode: state.isDarkMode,
    }),
    setMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
      state.isLoggedIn = true;
      // eslint-disable-next-line prefer-destructuring
      state.user = payload.user[0];
      state.token = payload.token;
    });
    builder.addMatcher(authApi.endpoints.register.matchFulfilled, (state) => {
      state.isLoggedIn = false;
    });
  },
});

const { reducer } = authSlice;
export const { logout, setMode } = authSlice.actions;
export default reducer;
export const selectCurrentUser = (state: RootState) => state.auth.user;
