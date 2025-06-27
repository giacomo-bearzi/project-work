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

import { LineChart } from "@mui/x-charts";
import { useTheme } from "@mui/material/styles";
import moment from "moment";

import api from "../../../utils/axios.ts";

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

// Component per ogni grafico con area gradient
const MuiLineChartWithGradient = ({
  data,
  yLabel,
  gradientId,
}: {
  data: LogPoint[];
  yLabel: string;
  gradientId: string;
}) => {
  const color = "#FB4376";

  return (
    <>
      <svg width="0" height="0">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>
      <LineChart
        xAxis={[
          {
            data: data.map((d) => d.timestamp),
            scaleType: "band",
            label: "Orario",
          },
        ]}
        yAxis={[{ label: yLabel }]}
        series={[
          {
            data: data.map((d) => d.value),
            showMark: false,
            area: true,
            color: `url(#${gradientId})`,
            curve: "monotoneX", // Per replicare stile smooth di Recharts
          },
        ]}
        height={250}
        margin={{ top: 10, bottom: 30, left: 60, right: 10 }}
      />
    </>
  );
};

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

  if (!lineaId) return <Navigate to="/overview" replace />;

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

  useEffect(() => {
    if (!selectedSubLineId || !token) return;

    const selectedSubLine = subLines.find((sl) => sl._id === selectedSubLineId);
    if (!selectedSubLine) return;

    let machineId = "";
    if (typeof selectedSubLine.machine === "string") {
      machineId = selectedSubLine.machine;
    } else if (selectedSubLine.machine?._id) {
      machineId = selectedSubLine.machine._id;
    }

    if (!machineId) return;

    const prepareLogPoints = (
      logs: any[],
      valueKey: string,
      machineId: string
    ): LogPoint[] =>
      logs
        .filter((log) => log.machineId._id === machineId)
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )
        .map((log) => ({
          timestamp: moment(log.timestamp).format("DD/MM/YYYY HH:mm"),
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
  }, [selectedSubLineId, subLines, token]);

  if (isLoading) return null;
  if (isError || !line) return <Navigate to="/overview" replace />;

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
      <Box display="flex" flexDirection="column" height="100vh">
        <Box
          position="sticky"
          top={0}
          bgcolor="background.paper"
          zIndex={1000}
          p={2}
        >
          <div className="flex flex-row p-1 justify-between">
            <p>
              <b>{line.name}</b>
            </p>
            <p>
              <b>{line.status}</b>
            </p>
          </div>

          <Box borderBottom={1} borderColor="divider" mt={3}>
            <Tabs
              value={selectedTabIndex === -1 ? 0 : selectedTabIndex}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              {subLines.map((sl) => (
                <Tab key={sl._id} label={sl.name} />
              ))}
            </Tabs>
          </Box>

          {selectedSubLineId && (
            <Typography variant="body1" mt={2}>
              <strong>{machineName}</strong>
            </Typography>
          )}
        </Box>

        <Box
          flex={1}
          pr={1}
          overflowY="scroll"
          sx={{
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Grid container spacing={1} mt={1}>
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
                    <MuiLineChartWithGradient
                      data={data}
                      yLabel={y}
                      gradientId={`grad-${idx}`}
                      color={color}
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
