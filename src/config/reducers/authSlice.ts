/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { Token, User } from '../../models';
import { authApi } from '../../services/auth.service';
import { RootState } from '../store';

interface AuthState {
  isLoggedIn: boolean;
  token: Token | null;
  user: Omit<User, 'department'> | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => initialState,
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
export const { logout } = authSlice.actions;
export default reducer;
export const selectCurrentUser = (state: RootState) => state.auth.user;
