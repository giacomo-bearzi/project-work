import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../dashboard/layouts/DashboardLayout";
import { useProductionLine } from "../hooks/useProductionLine";
import { useAuth } from "../../log-in/context/AuthContext";

import {
  Tabs,
  Tab,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  styled,
} from "@mui/material";

import api from "../../../utils/axios.ts";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface LogPoint {
  timestamp: string;
  value: number;
}

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


const SimpleLineChart = ({
  data,
  dataKey,
  color,
  yLabel,
}: {
  data: LogPoint[];
  dataKey: string;
  color: string;
  yLabel: string;
}) => (
  <ResponsiveContainer width="100%" height={250}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="timestamp"
        tickFormatter={(time) => new Date(time).toLocaleTimeString()}
      />
      <YAxis label={{ value: yLabel, angle: -90, position: "insideLeft" }} />
      <Tooltip labelFormatter={(time) => new Date(time).toLocaleString()} />
      <Legend />
      <Line type="monotone" dataKey={dataKey} stroke={color} dot={false} />
    </LineChart>
  </ResponsiveContainer>
);

const LineDetails = () => {
  const { lineaId } = useParams();
  const { token } = useAuth();

  const [subLines, setSubLines] = useState<SubLine[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedSubLineId, setSelectedSubLineId] = useState<string>("");

  const [temperatureLogs, setTemperatureLogs] = useState<LogPoint[]>([]);
  const [consumptionLogs, setConsumptionLogs] = useState<LogPoint[]>([]);
  const [powerLogs, setPowerLogs] = useState<LogPoint[]>([]);
  const [co2Logs, setCo2Logs] = useState<LogPoint[]>([]);

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

    api
      .get("/machine", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMachines(res.data))
      .catch(() => setMachines([]));
  }, [token]);

  useEffect(() => {
    if (!line || !line.subLines?.length || !token) {
      setSubLines([]);
      return;
    }

    api
      .get("/sub-lines", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const filteredSubs = res.data.filter((sl: any) =>
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

  // Carica i log ogni volta che cambia la selectedSubLineId
  useEffect(() => {
    if (!selectedSubLineId || !token) return;

    // Assumendo che la subline abbia una proprietà machine con id macchina
    const selectedSubLine = subLines.find((sl) => sl._id === selectedSubLineId);
    if (!selectedSubLine) return;

    // Ottieni machineId (stringa)
    let machineId = "";
    if (typeof selectedSubLine.machine === "string") {
      machineId = selectedSubLine.machine;
    } else if (selectedSubLine.machine?._id) {
      machineId = selectedSubLine.machine._id;
    }

    if (!machineId) return;

    // Funzione helper per convertire log raw in LogPoint[]
    const prepareLogPoints = (logs: any[], valueKey: string): LogPoint[] =>
      logs.map((l) => ({
        timestamp: l.timestamp,
        value: l[valueKey],
      }));

    Promise.all([
      api.get(`/temperature-logs?machineId=${machineId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      api.get(`/consumption-logs?machineId=${machineId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      api.get(`/power-logs?machineId=${machineId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      api.get(`/co2-emission-logs?machineId=${machineId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([tempRes, consRes, powerRes, co2Res]) => {
        setTemperatureLogs(prepareLogPoints(tempRes.data, "temperature"));
        setConsumptionLogs(prepareLogPoints(consRes.data, "energyConsumed"));
        setPowerLogs(prepareLogPoints(powerRes.data, "power"));
        setCo2Logs(prepareLogPoints(co2Res.data, "co2Emission"));
      })
      .catch(() => {
        setTemperatureLogs([]);
        setConsumptionLogs([]);
        setPowerLogs([]);
        setCo2Logs([]);
      });
  }, [selectedSubLineId, subLines, token]);

  if (isLoading) {
    return null;
  }

  if (isError || !line) {
    return <Navigate to="/overview" replace />;
  }

  const selectedSubLine = subLines.find((sl) => sl._id === selectedSubLineId);

  let machineName = "";
  if (selectedSubLine) {
    if (typeof selectedSubLine.machine === "string") {
      const mach = machines.find((m) => m._id === selectedSubLine.machine);
      machineName = mach ? mach.name : "Macchina non trovata";
    } else {
      machineName = selectedSubLine.machine.name;
    }
  }

  const selectedTabIndex = subLines.findIndex(
    (sl) => sl._id === selectedSubLineId
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedSubLineId(subLines[newValue]._id);
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl">Dettagli di {lineaId.toUpperCase()}</h1>
      <div>
        <p>
          <b>Nome:</b> {line.name}
        </p>
        <p>
          <b>Stato:</b> {line.status}
        </p>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 3 }}>
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
          <Typography variant="body1" sx={{ mt: 2, mb: 4 }}>
            Macchina associata: <strong>{machineName}</strong>
          </Typography>
        )}

        <Grid container spacing={1}>
          <Grid size={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Temperatura
                </Typography>
                <SimpleLineChart
                  data={temperatureLogs}
                  dataKey="value"
                  color="#FF5722"
                  yLabel="°C"
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Consumo energetico
                </Typography>
                <SimpleLineChart
                  data={consumptionLogs}
                  dataKey="value"
                  color="#2196F3"
                  yLabel="kWh"
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Potenza
                </Typography>
                <SimpleLineChart
                  data={powerLogs}
                  dataKey="value"
                  color="#4CAF50"
                  yLabel="W"
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Emissioni CO₂
                </Typography>
                <SimpleLineChart
                  data={co2Logs}
                  dataKey="value"
                  color="#9C27B0"
                  yLabel="kg"
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </DashboardLayout>
  );
};

export default LineDetails;
