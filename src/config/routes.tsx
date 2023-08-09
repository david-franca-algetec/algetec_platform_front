import { createBrowserRouter } from 'react-router-dom';
import { SidebarWithHeader } from '../components';
import { ChecklistPage } from '../pages/Checklists';

import { ClientsPage } from '../pages/Clients';
import { CurriculumList } from '../pages/Curriculum';
import { CurriculumPracticesShow } from '../pages/Curriculum/show/practices.show';
import { Dashboard } from '../pages/Dashboard';
import { DemandPage } from '../pages/Demand';
import { CreateDemandPage } from '../pages/Demand/Create';
import { EditDemandPage } from '../pages/Demand/Edit';
import { DemandsView } from '../pages/Demand/View';

import { ErrorPage } from '../pages/Error';
import { IssueTrackerList, IssueTrackerShow } from '../pages/IssueTracker';
import { LabList, LabsShow } from '../pages/Labs';
import { LoginPage } from '../pages/Login';
import { PracticesList } from '../pages/Practices';
import { CreatePractice } from '../pages/Practices/create';
import { PracticeShow } from '../pages/Practices/show';
import { ProfilePage } from '../pages/Profile';
import { UsersPage } from '../pages/Users';
import { VersionControlPage } from '../pages/VersionControl';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <SidebarWithHeader />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'institutions',
        element: <ClientsPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
      {
        path: 'demands',
        element: <DemandPage />,
      },
      {
        path: 'demands/create',
        element: <CreateDemandPage />,
      },
      {
        path: 'demands/edit/:id',
        element: <EditDemandPage />,
      },
      {
        path: 'demands/show/:id',
        element: <DemandsView />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'releases',
        element: <VersionControlPage />,
      },
      {
        path: 'issues',
        element: <IssueTrackerList />,
      },
      {
        path: 'checklists',
        element: <ChecklistPage />,
      },
      {
        path: 'issues/show/:id',
        element: <IssueTrackerShow />,
      },
      {
        path: 'labs',
        element: <LabList />,
      },
      {
        path: 'labs/show/:id',
        element: <LabsShow />,
      },
      {
        path: 'editor/create',
        element: <CreatePractice />,
      },
      {
        path: 'editor/edit/:id',
        element: <CreatePractice />,
      },
      {
        path: 'editor/show/:id',
        element: <PracticeShow />,
      },
      {
        path: 'editor',
        element: <PracticesList />,
      },
      {
        path: 'curriculums',
        element: <CurriculumList />,
      },
      {
        path: '/curriculums/practices/show/:id',
        element: <CurriculumPracticesShow />,
      },
    ],
  },
]);
