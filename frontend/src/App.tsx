import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import NotificationPoller from './components/NotificationPoller';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './features/log-in/context/AuthContext.tsx';
import { LogInPage } from './features/log-in/pages/LoginPage.tsx';
import './index.css';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OperatorDashboard } from './features/dashboard/pages/OperatorDashboard.tsx';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <NotificationPoller />
          <Routes>
            <Route
              path="/login"
              element={<LogInPage />}
            />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route
                path="/admin"
                element={<AdminDashboard />}
              />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
              <Route
                path="/manager"
                element={<ManagerDashboard />}
              />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['operator']} />}>
              <Route
                path="/operator"
                element={<OperatorDashboard />}
              />
            </Route>

            {/* Redirect to login if no other route matches */}
            <Route
              path="*"
              element={
                <Navigate
                  to="/login"
                  replace
                />
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
