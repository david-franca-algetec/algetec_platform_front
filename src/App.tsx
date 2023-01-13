import 'react-modern-drawer/dist/index.css';
import 'react-toastify/dist/ReactToastify.css';

import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';

import { router } from './config/routes';
import { persistor, store } from './config/store';
import { injectGlobalStyles } from './config/styles/stitches.config';

injectGlobalStyles();

export function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
        <ToastContainer />
      </PersistGate>
    </Provider>
  );
}
