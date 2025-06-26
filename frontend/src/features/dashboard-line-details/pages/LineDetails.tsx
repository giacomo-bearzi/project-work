import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../dashboard/layouts/DashboardLayout";
import { useProductionLine } from "../hooks/useProductionLine";
import { useAuth } from "../../log-in/context/AuthContext";

import { Select, MenuItem, InputLabel, FormControl, Typography } from '@mui/material';
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

  // Fetch machines
  useEffect(() => {
    if (!token) return;

    api.get('/machine', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setMachines(res.data))
      .catch(() => setMachines([]));
  }, [token]);

  // Fetch sublines e filtra solo quelle della linea corrente
  useEffect(() => {
    if (!line || !line.subLines?.length || !token) {
      setSubLines([]);
      return;
    }

    api.get('/sub-lines', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        // filtra solo sublines che appartengono alla linea
        const filteredSubs: SubLine[] = res.data.filter((sl: SubLine) =>
          line.subLines.includes(sl._id)
        );
        setSubLines(filteredSubs);
      })
      .catch(() => setSubLines([]));
  }, [line, token]);

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

  // Trova la subline selezionata
  const selectedSubLine = subLines.find(sl => sl._id === selectedSubLineId);

  // Trova il nome macchina associato alla subline selezionata
  let machineName = "";
  if (selectedSubLine) {
    if (typeof selectedSubLine.machine === "string") {
      const mach = machines.find(m => m._id === selectedSubLine.machine);
      machineName = mach ? mach.name : "Macchina non trovata";
    } else {
      machineName = selectedSubLine.machine.name;
    }
  }

  return (
    <DashboardLayout>
      <h1 className="text-3xl">Dettagli di {lineaId.toUpperCase()}</h1>
      <div>
        <p><b>Nome:</b> {line.name}</p>
        <p><b>Stato:</b> {line.status}</p>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="subline-select-label">Seleziona una Subline</InputLabel>
          <Select
            labelId="subline-select-label"
            id="subline-select"
            value={selectedSubLineId}
            label="Seleziona una Subline"
            onChange={(e) => setSelectedSubLineId(e.target.value)}
          >
            <MenuItem value="">
              <em>-- Nessuna --</em>
            </MenuItem>
            {subLines.map(sl => (
              <MenuItem key={sl._id} value={sl._id}>
                {sl.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
