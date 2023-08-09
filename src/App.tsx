import { Watermark } from 'antd';
import 'antd/dist/reset.css';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import { router } from './config/routes';
import { persist, store } from './config/store';
import { injectGlobalStyles } from './config/styles/stitches.config';
import { testEnvironment } from './helpers';

injectGlobalStyles();

export function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persist}>
        {['production', 'local'].includes(testEnvironment()) ? (
          <RouterProvider router={router} />
        ) : (
          <Watermark content="Desenvolvimento">
            <RouterProvider router={router} />
          </Watermark>
        )}
      </PersistGate>
    </Provider>
  );
}
