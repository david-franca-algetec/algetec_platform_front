/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IDashboardSlice {
  select1: string;
  select2?: string;
  select3?: string;
}

const initialState: IDashboardSlice = {
  select1: 'demands',
  select2: undefined,
  select3: undefined,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSelect1: (state, action: PayloadAction<string>) => {
      state.select1 = action.payload;
    },
    setSelect2: (state, action: PayloadAction<string>) => {
      state.select2 = action.payload;
    },
    setSelect3: (state, action: PayloadAction<string>) => {
      state.select3 = action.payload;
    },
  },
});

const { actions, reducer } = dashboardSlice;
export const { setSelect1, setSelect2, setSelect3 } = actions;

export default reducer;
