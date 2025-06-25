import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
// import NotificationPoller from './components/NotificationPoller';
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./features/log-in/context/AuthContext.tsx";
import { LogInPage } from "./features/log-in/pages/LoginPage.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UsersPage } from "./features/dashboard-users/pages/UsersPage.tsx";
import { IssuesPage } from "./features/dashboard-issues/pages/IssuesPage.tsx";
import NotificationPoller from "./components/NotificationPoller.tsx";
import { OverviewPage } from "./features/dashboard-overview/pages/OverviewPage.tsx";
import { TasksPage } from "./features/dashboard-tasks/pages/TasksPage.tsx";
import LineDetails from "./features/dashboard-line-details/pages/LineDetails.tsx";

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <Routes>
      <Route path="/login" element={<LogInPage />} />
      <Route
        element={
          <ProtectedRoute allowedRoles={["admin", "manager", "operator"]} />
        }
      >
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/overview/:lineaId" element={<LineDetails />} />

        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/tasks" element={<TasksPage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
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
        <NotificationPoller />
        <AppContent />
      </AuthProvider>
    </Router>
  </QueryClientProvider>
);

export default App;
