import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../dashboard/layouts/DashboardLayout";
import { useProductionLine } from "../hooks/useProductionLine";
import { useAuth } from "../../log-in/context/AuthContext";

import { Tabs, Tab, Typography, Box } from '@mui/material';
import api from '../../../utils/axios.ts';

export interface Machine {
  _id: string;
  name: string;
  type: string;
  maxTemperature: number;
}

export interface SubLine {
  _id: string;
  name: string;
  status: string;
  machine: string | Machine;
}

const LineDetails = () => {
  const { lineaId } = useParams();
  const { token } = useAuth();

  const [subLines, setSubLines] = useState<SubLine[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedSubLineId, setSelectedSubLineId] = useState<string>("");

  if (!lineaId) {
    return <Navigate to="/overview" replace />;
  }

  const {
    data: line,
    isLoading,
    isError,
  } = useProductionLine(lineaId, token || "");

  useEffect(() => {
    if (!token) return;

    api.get('/machine', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setMachines(res.data))
      .catch(() => setMachines([]));
  }, [token]);

  useEffect(() => {
    if (!line || !line.subLines?.length || !token) {
      setSubLines([]);
      return;
    }

    api.get('/sub-lines', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const filteredSubs: SubLine[] = res.data.filter((sl: SubLine) =>
          line.subLines.includes(sl._id)
        );
        setSubLines(filteredSubs);
      })
      .catch(() => setSubLines([]));
  }, [line, token]);

  // Seleziona di default la prima subline
  useEffect(() => {
    if (subLines.length > 0 && !selectedSubLineId) {
      setSelectedSubLineId(subLines[0]._id);
    }
  }, [subLines, selectedSubLineId]);

  if (isLoading) {
    return null;
  }

  if (isError || !line) {
    return <Navigate to="/overview" replace />;
  }

  const selectedSubLine = subLines.find(sl => sl._id === selectedSubLineId);

  let machineName = "";
  if (selectedSubLine) {
    if (typeof selectedSubLine.machine === "string") {
      const mach = machines.find(m => m._id === selectedSubLine.machine);
      machineName = mach ? mach.name : "Macchina non trovata";
    } else {
      machineName = selectedSubLine.machine.name;
    }
  }

  // Per gestire il valore dell’indice tab, converto da id a indice
  const selectedTabIndex = subLines.findIndex(sl => sl._id === selectedSubLineId);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedSubLineId(subLines[newValue]._id);
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl">Dettagli di {lineaId.toUpperCase()}</h1>
      <div>
        <p><b>Nome:</b> {line.name}</p>
        <p><b>Stato:</b> {line.status}</p>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
          <Tabs
            value={selectedTabIndex === -1 ? 0 : selectedTabIndex}
            onChange={handleTabChange}
            aria-label="Seleziona subline"
            variant="scrollable"
            scrollButtons="auto"
          >
            {subLines.map((sl) => (
              <Tab key={sl._id} label={sl.name} />
            ))}
          </Tabs>
        </Box>

        {selectedSubLineId && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            Macchina associata: <strong>{machineName}</strong>
          </Typography>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LineDetails;
