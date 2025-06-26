import { Navigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../dashboard/layouts/DashboardLayout";
import { useProductionLine } from "../hooks/useProductionLine";
import { useAuth } from "../../log-in/context/AuthContext";

const LineDetails = () => {
  const { lineaId } = useParams();
  const { token } = useAuth();

  if (!lineaId) {
    return <Navigate to="/overview" replace />;
  }

  const { data: line, isLoading, isError } = useProductionLine(lineaId, token || '');

  if (isLoading) {
    return null;
  }

  if (isError || !line) {
    return <Navigate to="/overview" replace />;
  }

  return (
    <DashboardLayout>
      <h1 className="text-3xl">Dettagli di {lineaId.toUpperCase()}</h1>
      <div>
        <p><b>Nome:</b> {line.name}</p>
        <p><b>Stato:</b> {line.status}</p>
        {/* Altri dettagli della linea */}
      </div>
    </DashboardLayout>
  );
};

export default LineDetails;
