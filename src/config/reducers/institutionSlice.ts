/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Institution } from '../../models/institution.model';

interface CartState {
  institutions: Institution[];
}

const initialState: CartState = {
  institutions: [],
};

const cartSlice = createSlice({
  name: 'institutionCart',
  initialState,
  reducers: {
    addToInstitutionsCart: (state, action: PayloadAction<Institution>) => {
      const itemInCart = state.institutions.find((item) => item.id === action.payload.id);
      if (!itemInCart) {
        state.institutions.push({ ...action.payload });
      }
    },

    addManyToInstitutionsCart: (state, action: PayloadAction<Institution[]>) => {
      action.payload.forEach((item) => {
        const itemInCart = state.institutions.find((institutionsItem) => institutionsItem.id === item.id);
        if (!itemInCart) {
          state.institutions.push({ ...item });
        }
      });
    },

    removeFromInstitutionsCart: (state, action: PayloadAction<Institution>) => {
      const itemIndex = state.institutions.findIndex((item) => item.id === action.payload.id);
      if (itemIndex !== -1) {
        state.institutions.splice(itemIndex, 1);
      }
    },

    clearInstitutionsCart: (state) => {
      state.institutions = [];
    },
  },
});

const { reducer, actions } = cartSlice;

export const { addToInstitutionsCart, addManyToInstitutionsCart, removeFromInstitutionsCart, clearInstitutionsCart } =
  actions;

export default reducer;
