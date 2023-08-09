import '@fontsource/inter';

import { ConfigProvider } from 'antd';
import locale from 'antd/locale/pt_BR';
import dayjs from 'dayjs';
import ptBr from 'dayjs/locale/pt-br';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

dayjs.locale(ptBr);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <React.Suspense fallback="loading">
      <ConfigProvider locale={locale}>
        <App />
      </ConfigProvider>
    </React.Suspense>
  </React.StrictMode>,
);
