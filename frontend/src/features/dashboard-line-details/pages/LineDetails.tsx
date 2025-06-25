import { Navigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../dashboard/layouts/DashboardLayout";
import { useProductionLine } from "../hooks/useProductionLine";
import { useAuth } from "../../log-in/context/AuthContext";

const LineDetails = () => {
  const { lineaId } = useParams();
  const { token } = useAuth();

  // Se manca il parametro, redirect subito
  if (!lineaId) {
    return <Navigate to="/overview" replace />;
  }

  const { data: line, isLoading, isError } = useProductionLine(lineaId, token || '');

  // Durante il caricamento non mostrare nulla (o uno spinner)
  if (isLoading) {
    return null;
  }

  // Se la linea non esiste o errore, redirect
  if (isError || !line) {
    return <Navigate to="/overview" replace />;
  }

  // Se la linea esiste, mostra i dettagli
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
