/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IVersionSliceProps {
  id?: string;
  name?: string;
  author?: string;
  pendency?: string;
}

const initialState: IVersionSliceProps = {
  author: undefined,
  id: undefined,
  name: undefined,
  pendency: undefined,
};

const versionSlice = createSlice({
  name: 'version',
  initialState,
  reducers: {
    setVersionFilters: (state, action: PayloadAction<{ name: string; value: string }>) => {
      if (action.payload.name === 'id') {
        state.id = action.payload.value;
      }
      if (action.payload.name === 'name') {
        state.name = action.payload.value;
      }
      if (action.payload.name === 'author') {
        state.author = action.payload.value;
      }
      if (action.payload.name === 'pendency') {
        state.pendency = action.payload.value;
      }
    },
  },
});

const { reducer, actions } = versionSlice;

export const { setVersionFilters } = actions;

export default reducer;
