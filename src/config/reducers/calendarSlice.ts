/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

interface ICalendarSliceProps {
  tabKey: string;
  demandModeUsers: number[];
  demandModeTags: string[];
  userModeUsers: number[];
  usersDay: string;
  demandsDay: string;
}

const initialState: ICalendarSliceProps = {
  tabKey: 'demands',
  demandModeUsers: [],
  demandModeTags: [],
  userModeUsers: [],
  usersDay: dayjs().toISOString(),
  demandsDay: dayjs().toISOString(),
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    changeTabKey: (state, action: PayloadAction<{ tabKey: string }>) => {
      state.tabKey = action.payload.tabKey;
    },
    setDemandModeUsers: (state, action: PayloadAction<{ demandModeUsers: number[] }>) => {
      state.demandModeUsers = action.payload.demandModeUsers;
    },
    setDemandModeTags: (state, action: PayloadAction<{ demandModeTags: string[] }>) => {
      state.demandModeTags = action.payload.demandModeTags;
    },
    setUserModeUsers: (state, action: PayloadAction<{ userModeUsers: number[] }>) => {
      state.userModeUsers = action.payload.userModeUsers;
    },
    setDay: (state, action: PayloadAction<{ day: string; type: string }>) => {
      if (action.payload.type === 'users') {
        state.usersDay = action.payload.day;
      }
      if (action.payload.type === 'demands') {
        state.demandsDay = action.payload.day;
      }
    },
  },
});

const { reducer, actions } = calendarSlice;

export const { changeTabKey, setDemandModeUsers, setDemandModeTags, setUserModeUsers, setDay } = actions;

export default reducer;
