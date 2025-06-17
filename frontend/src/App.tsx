import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
// import NotificationPoller from './components/NotificationPoller';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './features/log-in/context/AuthContext.tsx';
import { LogInPage } from './features/log-in/pages/LoginPage.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OverviewPage } from './features/dashboard/pages/OverviewPage.tsx';
import { GestioneUtenti } from './features/dashboard/pages/GestioneUtenti.tsx';
import { Issues } from './features/dashboard/pages/Issues.tsx';
import { Planning } from './features/dashboard/pages/Planning.tsx';
import { Tasks } from './features/dashboard/pages/Tasks.tsx';
const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={<LogInPage />}
      />
      <Route
        element={
          <ProtectedRoute allowedRoles={['admin', 'manager', 'operator']} />
        }
      >
        <Route
          path="/overview"
          element={<OverviewPage />}
        />
        <Route
          path="/issues"
          element={<Issues />}
        />
        <Route
          path="/tasks"
          element={<Tasks />}
        />
        <Route
          path="/planning"
          element={<Planning />}
        />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route
          path="/gestione-utenti"
          element={<GestioneUtenti />}
        />
      </Route>
      <Route
        path="*"
        element={
          <Navigate
            to="/overview"
            replace
          />
        }
      />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <AuthProvider>
        {/* <NotificationPoller /> */}
        <AppContent />
      </AuthProvider>
    </Router>
  </QueryClientProvider>
);

export default App;
