import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../dashboard/layouts/DashboardLayout";
import { useProductionLine } from "../hooks/useProductionLine";
import { useAuth } from "../../log-in/context/AuthContext";
import type { NodeJS } from "node";

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
import moment from "moment";
import api from "../../../utils/axios.ts";

export interface LogPoint {
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
            curve: "monotoneX",
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

  const [allTemperatureLogs, setAllTemperatureLogs] = useState<LogPoint[]>([]);
  const [allConsumptionLogs, setAllConsumptionLogs] = useState<LogPoint[]>([]);
  const [allPowerLogs, setAllPowerLogs] = useState<LogPoint[]>([]);
  const [allCo2Logs, setAllCo2Logs] = useState<LogPoint[]>([]);

  const [temperatureLogs, setTemperatureLogs] = useState<LogPoint[]>([]);
  const [consumptionLogs, setConsumptionLogs] = useState<LogPoint[]>([]);
  const [powerLogs, setPowerLogs] = useState<LogPoint[]>([]);
  const [co2Logs, setCo2Logs] = useState<LogPoint[]>([]);

  useEffect(() => {
    let interval1: NodeJS.Timeout;
    let interval2: NodeJS.Timeout;
    let interval3: NodeJS.Timeout;
    let interval4: NodeJS.Timeout;

    const createProgressiveUpdater = (
      source: LogPoint[],
      setter: (val: LogPoint[]) => void
    ) => {
      let index = 15;
      setter(source.slice(0, 15));

      return setInterval(() => {
        setter((prev) => {
          if (index >= source.length) return prev;
          const next = [...prev, source[index]];
          index++;
          return next;
        });
      }, 5000);
    };

    if (allTemperatureLogs.length > 15)
      interval1 = createProgressiveUpdater(
        allTemperatureLogs,
        setTemperatureLogs
      );
    if (allConsumptionLogs.length > 15)
      interval2 = createProgressiveUpdater(
        allConsumptionLogs,
        setConsumptionLogs
      );
    if (allPowerLogs.length > 15)
      interval3 = createProgressiveUpdater(allPowerLogs, setPowerLogs);
    if (allCo2Logs.length > 15)
      interval4 = createProgressiveUpdater(allCo2Logs, setCo2Logs);

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
      clearInterval(interval3);
      clearInterval(interval4);
    };
  }, [allTemperatureLogs, allConsumptionLogs, allPowerLogs, allCo2Logs]);

  if (!lineaId) return <Navigate to="/overview" replace />;

  const {
    data: line,
    isLoading,
    isError,
  } = useProductionLine(lineaId, token || "");

  useEffect(() => {
    if (!token) return;

    api
      .get("/machine", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setMachines(res.data))
      .catch(() => setMachines([]));
  }, [token]);

  useEffect(() => {
    if (!line || !line.subLines?.length || !token) {
      setSubLines([]);
      return;
    }

    api
      .get("/sub-lines", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const filtered = res.data.filter((sl: any) =>
          line.subLines.includes(sl._id)
        );
        setSubLines(filtered);
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

    const selected = subLines.find((sl) => sl._id === selectedSubLineId);
    if (!selected) return;

    const machineId =
      typeof selected.machine === "string"
        ? selected.machine
        : selected.machine?._id;

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
    ]).then(([tempRes, consRes, powerRes, co2Res]) => {
      setAllTemperatureLogs(
        prepareLogPoints(tempRes.data, "temperature", machineId)
      );
      setAllConsumptionLogs(
        prepareLogPoints(consRes.data, "energyConsumed", machineId)
      );
      setAllPowerLogs(prepareLogPoints(powerRes.data, "power", machineId));
      setAllCo2Logs(prepareLogPoints(co2Res.data, "co2Emission", machineId));
    });
  }, [selectedSubLineId, subLines, token]);

  if (isLoading) return null;
  if (isError || !line) return <Navigate to="/overview" replace />;

  const selectedSubLine = subLines.find((sl) => sl._id === selectedSubLineId);
  const machineName =
    typeof selectedSubLine?.machine === "string"
      ? machines.find((m) => m._id === selectedSubLine?.machine)?.name ??
        "Macchina non trovata"
      : selectedSubLine?.machine.name;

  const selectedTabIndex = subLines.findIndex(
    (sl) => sl._id === selectedSubLineId
  );

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
              onChange={(e, newValue) =>
                setSelectedSubLineId(subLines[newValue]._id)
              }
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

        <Grid container spacing={1} mt={1}>
          {[
            { title: "Temperatura", data: temperatureLogs, y: "°C" },
            { title: "Consumo energetico", data: consumptionLogs, y: "kWh" },
            { title: "Potenza", data: powerLogs, y: "W" },
            { title: "Emissioni CO₂", data: co2Logs, y: "kg" },
          ].map(({ title, data, y }, idx) => (
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
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default LineDetails;
