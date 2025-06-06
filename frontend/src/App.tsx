import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import OperatorDashboard from './pages/OperatorDashboard';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={<Login />}
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
  );
};

export default App;
