import { createBrowserRouter } from 'react-router-dom';

import { AssetsPage } from '../pages/Assets';
import { ClientsPage } from '../pages/Clients';
import { Dashboard } from '../pages/Dashboard';
import { DemandPage } from '../pages/Demand';
import CreateDemandPage from '../pages/Demand/Create';
import { EditDemandPage } from '../pages/Demand/Edit';
import { ErrorPage } from '../pages/Error';
import { LoginPage } from '../pages/Login';
import { ProductionPage } from '../pages/Prodution';
import { UsersPage } from '../pages/Users';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'assets',
    element: <AssetsPage />,
  },
  {
    path: 'dashboard',
    element: <Dashboard />,
  },
  {
    path: 'dashboard/users',
    element: <UsersPage />,
  },
  {
    path: 'dashboard/clients',
    element: <ClientsPage />,
  },
  {
    path: 'dashboard/issues',
    element: <DemandPage />,
  },
  {
    path: 'dashboard/issues/create',
    element: <CreateDemandPage />,
  },
  {
    path: 'dashboard/issues/edit/:id',
    element: <EditDemandPage />,
  },
  {
    path: 'dashboard/production/:id',
    element: <ProductionPage />,
  },
]);
