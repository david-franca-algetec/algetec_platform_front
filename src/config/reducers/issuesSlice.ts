/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IssuesSliceProps {
  problem?: string;
  priority?: number[];
  status?: string[];
  approved?: boolean;
  creator?: number[];
  responsible?: number[];
  experimentId?: string;
  version?: string;
}

const initialState: IssuesSliceProps = {
  approved: undefined,
  creator: undefined,
  priority: [],
  status: [],
  problem: undefined,
  responsible: undefined,
  experimentId: undefined,
  version: undefined,
};

const issueSlice = createSlice({
  name: 'issue',
  initialState,
  reducers: {
    setIssueFilters: (state, action: PayloadAction<IssuesSliceProps>) => {
      state.creator = action.payload.creator;
      state.responsible = action.payload.responsible;
      state.priority = action.payload.priority;
      state.status = action.payload.status;
      state.approved = action.payload.approved;
      state.problem = action.payload.problem;
      state.experimentId = action.payload.experimentId;
      state.version = action.payload.version;
    },
  },
});

const { reducer, actions } = issueSlice;
export const { setIssueFilters } = actions;

export default reducer;
