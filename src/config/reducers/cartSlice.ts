/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from '../../models';
import { IDemand } from '../../models/demands.model';

interface CartState {
  demands: IDemand[];
  users: User[];
}

const initialState: CartState = {
  demands: [],
  users: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToDemandsCart: (state, action: PayloadAction<IDemand>) => {
      const itemInCart = state.demands.find((item) => item.id === action.payload.id);
      if (!itemInCart) {
        state.demands.push({ ...action.payload });
      }
    },

    addManyToDemandsCart: (state, action: PayloadAction<IDemand[]>) => {
      action.payload.forEach((item) => {
        const itemInCart = state.demands.find((demandsItem) => demandsItem.id === item.id);
        if (!itemInCart) {
          state.demands.push({ ...item });
        }
      });
    },

    removeFromDemandsCart: (state, action: PayloadAction<IDemand>) => {
      const itemIndex = state.demands.findIndex((item) => item.id === action.payload.id);
      if (itemIndex !== -1) {
        state.demands.splice(itemIndex, 1);
      }
    },

    clearDemandsCart: (state) => {
      state.demands = [];
    },

    addToUsersCart: (state, action: PayloadAction<User>) => {
      const itemInCart = state.users.find((item) => item.id === action.payload.id);
      if (!itemInCart) {
        state.users.push({ ...action.payload });
      }
    },

    addManyToUsersCart: (state, action: PayloadAction<User[]>) => {
      action.payload.forEach((item) => {
        const itemInCart = state.users.find((usersItem) => usersItem.id === item.id);
        if (!itemInCart) {
          state.users.push({ ...item });
        }
      });
    },

    removeFromUsersCart: (state, action: PayloadAction<User>) => {
      const itemIndex = state.users.findIndex((item) => item.id === action.payload.id);
      if (itemIndex !== -1) {
        state.users.splice(itemIndex, 1);
      }
    },

    clearUsersCart: (state) => {
      state.users = [];
    },
  },
});

const { reducer, actions } = cartSlice;

export const {
  addToDemandsCart,
  addManyToDemandsCart,
  removeFromDemandsCart,
  clearDemandsCart,
  addToUsersCart,
  addManyToUsersCart,
  removeFromUsersCart,
  clearUsersCart,
} = actions;

export default reducer;
