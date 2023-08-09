/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IDemandSlice {
  id?: string | null;
  experiment?: string | null;
  institutions?: string[] | null;
  tags?: string[] | null;
  status?: string[] | null;
  sorterKey?: string | null;
  order?: string | null;
  author?: string | null;
  scripting?: string | null;
  coding?: string | null;
  modeling?: string | null;
  ualab?: string | null;
  testing?: string | null;
  designing?: string | null;
}

const initialState: IDemandSlice = {
  id: undefined,
  experiment: undefined,
  institutions: [],
  status: [],
  tags: [],
  order: undefined,
  sorterKey: undefined,
  author: undefined,
  coding: undefined,
  ualab: undefined,
  designing: undefined,
  testing: undefined,
  modeling: undefined,
  scripting: undefined,
};

const demandSlice = createSlice({
  name: 'demand',
  initialState,
  reducers: {
    setDemandFilters: (state, action: PayloadAction<{ name: string; value: string | string[] | undefined | null }>) => {
      if (action.payload.name === 'id' && !Array.isArray(action.payload.value)) {
        state.id = action.payload.value;
      }
      if (action.payload.name === 'experiment' && !Array.isArray(action.payload.value)) {
        state.experiment = action.payload.value;
      }
      if (action.payload.name === 'institutions' && typeof action.payload.value !== 'string') {
        state.institutions = action.payload.value;
      }
      if (action.payload.name === 'tags' && typeof action.payload.value !== 'string') {
        state.tags = action.payload.value;
      }
      if (action.payload.name === 'status' && typeof action.payload.value !== 'string') {
        state.status = action.payload.value;
      }
      if (action.payload.name === 'order' && !Array.isArray(action.payload.value)) {
        state.order = action.payload.value;
      }
      if (action.payload.name === 'sorterKey' && !Array.isArray(action.payload.value)) {
        state.sorterKey = action.payload.value;
      }
      if (action.payload.name === 'author' && !Array.isArray(action.payload.value)) {
        state.author = action.payload.value;
      }
      if (action.payload.name === 'scripting' && !Array.isArray(action.payload.value)) {
        state.scripting = action.payload.value;
      }
      if (action.payload.name === 'testing' && !Array.isArray(action.payload.value)) {
        state.testing = action.payload.value;
      }
      if (action.payload.name === 'ualab' && !Array.isArray(action.payload.value)) {
        state.ualab = action.payload.value;
      }
      if (action.payload.name === 'coding' && !Array.isArray(action.payload.value)) {
        state.coding = action.payload.value;
      }
      if (action.payload.name === 'modeling' && !Array.isArray(action.payload.value)) {
        state.modeling = action.payload.value;
      }
      if (action.payload.name === 'designing' && !Array.isArray(action.payload.value)) {
        state.designing = action.payload.value;
      }
    },
  },
});

const { reducer, actions } = demandSlice;
export const { setDemandFilters } = actions;

export default reducer;
