// noinspection JSUnusedGlobalSymbols

import { Action, combineReducers, configureStore, ConfigureStoreOptions, ThunkAction } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { api } from './reducers/apiSlice';
import assistantReducer from './reducers/assistantSlice';
import authReducer from './reducers/authSlice';
import calendarReducer from './reducers/calendarSlice';
import cartReducer from './reducers/cartSlice';
import dashboardReducer from './reducers/dashboardSlice';
import demandReducer from './reducers/demandSlice';
import issuesReducer from './reducers/issuesSlice';
import labReducer from './reducers/labSlice';
import versionReducer from './reducers/versionSlice';

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  blacklist: [api.reducerPath],
};

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  assistant: assistantReducer,
  calendar: calendarReducer,
  dashboard: dashboardReducer,
  demand: demandReducer,
  version: versionReducer,
  issues: issuesReducer,
  lab: labReducer,
  [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const createStore = (options?: ConfigureStoreOptions['preloadedState'] | undefined) =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(api.middleware),
    devTools: true,
    ...options,
  });

export const store = createStore();

export const persist = persistStore(store);

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
export type AppStore = ReturnType<typeof createStore>;
