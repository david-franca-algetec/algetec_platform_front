import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LabSliceProps {
  tab: string;
}

const initialState: LabSliceProps = {
  tab: 'details',
};

const labSlice = createSlice({
  name: 'lab',
  initialState,
  reducers: {
    setTab: (state, action: PayloadAction<string>) => {
      // eslint-disable-next-line no-param-reassign
      state.tab = action.payload;
    },
  },
});

const { reducer, actions } = labSlice;

export const { setTab } = actions;
export default reducer;
