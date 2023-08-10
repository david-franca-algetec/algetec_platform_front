import { createBrowserRouter } from 'react-router-dom';
import { ChecklistPage } from '../pages/Checklists';

import { ClientsPage } from '../pages/Clients';
import { CurriculumList } from '../pages/Curriculum';
import { CurriculumPracticesShow } from '../pages/Curriculum/show/practices.show';
import { SkillsShow } from '../pages/Curriculum/show/skills.show';
import { Dashboard } from '../pages/Dashboard';
import { DemandPage } from '../pages/Demand';
import { CreateDemandPage } from '../pages/Demand/Create';
import { EditDemandPage } from '../pages/Demand/Edit';
import { DemandsShow } from '../pages/Demand/show';
import { DocumentsCreate, DocumentsList, DocumentsShow } from '../pages/Documents';

import { ErrorPage } from '../pages/Error';
import { IssuesList, IssuesShow } from '../pages/Issues';
import { LabList, LabsShow } from '../pages/Labs';
import { LoginPage } from '../pages/Login';
import { ProfilePage } from '../pages/Profile';
import { ListReleases } from '../pages/Releases';
import { UsersPage } from '../pages/Users';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
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
    element: <DemandsShow />,
  },
  {
    path: 'profile',
    element: <ProfilePage />,
  },
  {
    path: 'releases',
    element: <ListReleases />,
  },
  {
    path: 'issues',
    element: <IssuesList />,
  },
  {
    path: 'checklists',
    element: <ChecklistPage />,
  },
  {
    path: 'issues/show/:id',
    element: <IssuesShow />,
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
    path: 'documents/create',
    element: <DocumentsCreate />,
  },
  {
    path: 'documents/edit/:id',
    element: <DocumentsCreate />,
  },
  {
    path: 'documents/show/:id',
    element: <DocumentsShow />,
  },
  {
    path: 'documents',
    element: <DocumentsList />,
  },
  {
    path: 'curriculums',
    element: <CurriculumList />,
  },
  {
    path: '/curriculums/practices/show/:id',
    element: <CurriculumPracticesShow />,
  },
  {
    path: '/curriculums/skills/show/:id',
    element: <SkillsShow />,
  },
]);
