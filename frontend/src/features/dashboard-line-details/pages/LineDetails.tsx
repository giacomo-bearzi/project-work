import { Navigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../dashboard/layouts/DashboardLayout";

const LineDetails = () => {
  const { lineaId } = useParams();
  const lineeValide = ["linea1", "linea2", "linea3"];

  if (!lineaId || !lineeValide.includes(lineaId)) {
    return <Navigate to="/overview" replace />;
  }

  return (
    <DashboardLayout>
      <h1 className="text-3xl">Dettagli di {lineaId.toUpperCase()}</h1>
    </DashboardLayout>
  );
};

export default LineDetails;
