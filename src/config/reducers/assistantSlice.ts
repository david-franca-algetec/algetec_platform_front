/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AssistantState {
  coding_activity?: boolean;
  coding_range?: [number, number];
  coding_responsible?: number;
  daysCount?: number;
  designing_activity?: boolean;
  designing_range?: [number, number];
  designing_responsible?: number;
  finished_at?: string;
  modeling_activity?: boolean;
  modeling_range?: [number, number];
  modeling_responsible?: number;
  scripting_activity?: boolean;
  scripting_range?: [number, number];
  scripting_responsible?: number;
  testing_activity?: boolean;
  testing_range?: [number, number];
  testing_responsible?: number;
  ualab_activity?: boolean;
  ualab_range?: [number, number];
  ualab_responsible?: number;
}

const initialState: AssistantState = {
  coding_activity: false,
  coding_range: [0, 0],
  daysCount: 30,
  designing_activity: false,
  designing_range: [0, 0],
  modeling_activity: false,
  modeling_range: [0, 0],
  scripting_activity: false,
  scripting_range: [0, 0],
  testing_activity: false,
  testing_range: [0, 0],
  ualab_activity: false,
  ualab_range: [0, 0],
};

const assistantSlice = createSlice({
  name: 'assistant',
  initialState,
  reducers: {
    updateAssistant: (state, action: PayloadAction<AssistantState>) => {
      state.coding_range = action.payload.coding_range;
      state.ualab_range = action.payload.ualab_range;
      state.testing_range = action.payload.testing_range;
      state.modeling_range = action.payload.modeling_range;
      state.scripting_range = action.payload.scripting_range;
      state.designing_range = action.payload.designing_range;
      state.daysCount = action.payload.daysCount;
      state.coding_activity = action.payload.coding_activity;
      state.ualab_activity = action.payload.ualab_activity;
      state.testing_activity = action.payload.testing_activity;
      state.modeling_activity = action.payload.modeling_activity;
      state.scripting_activity = action.payload.scripting_activity;
      state.designing_activity = action.payload.designing_activity;
      state.finished_at = action.payload.finished_at;
      state.coding_responsible = action.payload.coding_responsible;
      state.ualab_responsible = action.payload.ualab_responsible;
      state.testing_responsible = action.payload.testing_responsible;
      state.modeling_responsible = action.payload.modeling_responsible;
      state.scripting_responsible = action.payload.scripting_responsible;
      state.designing_responsible = action.payload.designing_responsible;
    },
  },
});

const { reducer, actions } = assistantSlice;

export const { updateAssistant } = actions;

export default reducer;
