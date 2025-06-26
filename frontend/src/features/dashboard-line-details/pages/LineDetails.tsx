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
    const prepareLogPoints = (
      logs: any[],
      valueKey: string,
      machineId: string
    ): LogPoint[] =>
      logs
        .filter((log) => log.machineId._id === machineId) // 👈 filtro per macchina
        .map((log) => ({
          timestamp: log.timestamp,
          value: log[valueKey],
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
        console.log(tempRes.data);

        setTemperatureLogs(
          prepareLogPoints(tempRes.data, "temperature", machineId)
        );
        setConsumptionLogs(
          prepareLogPoints(consRes.data, "energyConsumed", machineId)
        );
        setPowerLogs(prepareLogPoints(powerRes.data, "power", machineId));
        setCo2Logs(prepareLogPoints(co2Res.data, "co2Emission", machineId));
      })
      .catch(() => {
        setTemperatureLogs([]);
        setConsumptionLogs([]);
        setPowerLogs([]);
        setCo2Logs([]);
      });
    console.log(temperatureLogs);
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        {/* Sticky Header */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            backgroundColor: "background.paper",
            zIndex: 1000,
            p: 2,
          }}
        >
          <div className="flex flex-row  p-1 justify-between">
            <p>
              <b>{line.name}</b>
            </p>
            <p>
              <b>{line.status}</b>
            </p>
          </div>

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
            <Typography variant="body1" sx={{ mt: 2 }}>
              <strong>{machineName}</strong>
            </Typography>
          )}
        </Box>

        {/* Scrollable content */}
        <Box
          sx={{
            flex: 1,
            pr: 1,
            overflowY: "scroll",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {[
              {
                title: "Temperatura",
                color: "#FF5722",
                data: temperatureLogs,
                y: "°C",
              },
              {
                title: "Consumo energetico",
                color: "#2196F3",
                data: consumptionLogs,
                y: "kWh",
              },
              { title: "Potenza", color: "#4CAF50", data: powerLogs, y: "W" },
              {
                title: "Emissioni CO₂",
                color: "#9C27B0",
                data: co2Logs,
                y: "kg",
              },
            ].map(({ title, color, data, y }, idx) => (
              <Grid size={6} key={idx}>
                <Card
                  sx={{
                    borderRadius: 11,
                    p: 1,
                    background: "rgba(255, 255, 255, 0.07)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {title}
                    </Typography>
                    <SimpleLineChart
                      data={data}
                      dataKey="value"
                      color={color}
                      yLabel={y}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default LineDetails;
