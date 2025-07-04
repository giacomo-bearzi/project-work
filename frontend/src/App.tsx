import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './features/dashboard-login/context/AuthContext.tsx';
import { LogInPage } from './features/dashboard-login/pages/LoginPage.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UsersPage } from './features/dashboard-users/pages/UsersPage.tsx';
import { IssuesPage } from './features/dashboard-issues/pages/IssuesPage.tsx';
import { OverviewPage } from './features/dashboard-overview/pages/OverviewPage.tsx';
import { TasksPage } from './features/dashboard-tasks/pages/TasksPage.tsx';
import LineDetails from './features/dashboard-line-details/pages/LineDetails.tsx';
import { ProtectedLineRoute } from './components/ProtectedLineRoute.tsx';

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <Routes>
      <Route path="/login" element={<LogInPage />} />
      <Route element={<ProtectedRoute allowedRoles={['admin', 'manager', 'operator']} />}>
        <Route path="/overview" element={<OverviewPage />} />
        <Route
          path="/overview/:lineaId"
          element={
            <ProtectedLineRoute>
              <LineDetails />
            </ProtectedLineRoute>
          }
        />

        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/tasks" element={<TasksPage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/users" element={<UsersPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/overview" replace />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  </QueryClientProvider>
);

export default App;
