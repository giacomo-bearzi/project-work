import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "../features/log-in/context/AuthContext";
import { useProductionLine } from "../features/dashboard-line-details/hooks/useProductionLine";
import { Box, CircularProgress } from "@mui/material";

const validLineIds = ["line-1", "line-2", "line-3"];

export const ProtectedLineRoute = ({ children }: { children: React.ReactNode }) => {
  const { lineaId } = useParams();
  const { token } = useAuth();

  if (!lineaId || !validLineIds.includes(lineaId)) {
    return <Navigate to="/overview" replace />;
  }

  const { data: line, isLoading } = useProductionLine(lineaId, token || '');

  if (isLoading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="60vh">
        <CircularProgress size={50} color="inherit" />
      </Box>
    );
  }

  if (!line) {
    return <Navigate to="/overview" replace />;
  }

  return <>{children}</>;
};