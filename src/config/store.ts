import { Action, combineReducers, configureStore, ConfigureStoreOptions, ThunkAction } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { api } from './reducers/apiSlice';
import authReducer from './reducers/authSlice';
import cartReducer from './reducers/cartSlice';
import institutionReducer from './reducers/institutionSlice';

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  blacklist: [api.reducerPath],
};

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  institution: institutionReducer,
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

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
export type AppStore = ReturnType<typeof createStore>;
