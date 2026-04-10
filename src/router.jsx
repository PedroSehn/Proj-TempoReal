import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { Login } from './pages/Login/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Cards } from './pages/Cards/Cards';
import { CardDetail } from './pages/CardDetail/CardDetail';
import { Simulation } from './pages/Simulation/Simulation';
import { Settings } from './pages/Settings/Settings';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/',           element: <Dashboard /> },
      { path: '/cards',      element: <Cards /> },
      { path: '/card/:cardId', element: <CardDetail /> },
      { path: '/simulation', element: <Simulation /> },
      { path: '/setup',      element: <Settings /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
