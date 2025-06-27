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
import TemperatureAlertCard from "../components/TemperatureAlertCard .tsx";

export interface LogPoint {
  timestamp: string;
  value: number;
}

export interface Machine {
  _id: string;
  name: string;
  type: string;
  maxTemperature: number;
  warnTemperature: number;
}

export interface SubLine {
  _id: string;
  name: string;
  status: string;
  machine: string | Machine;
}
interface MuiLineChartWithGradientProps {
  data: LogPoint[];
  yLabel: string;
  gradientId: string;
  maxThreshold?: number;
  warnThreshold?: number;
}

const MuiLineChartWithGradient = ({
  data,
  yLabel,
  gradientId,
  maxThreshold,
  warnThreshold,
}: MuiLineChartWithGradientProps) => {
  const color = "#FB4376";
  const warnColor = "#FFA500"; // Arancione per la soglia di warning
  const maxColor = "#FF0000"; // Rosso per la soglia massima

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
          ...(warnThreshold
            ? [
                {
                  data: data.map(() => warnThreshold),
                  showMark: false,
                  color: warnColor,
                  curve: "linear",
                  label: "Warning Temperature",
                },
              ]
            : []),
          ...(maxThreshold
            ? [
                {
                  data: data.map(() => maxThreshold),
                  showMark: false,
                  color: maxColor,
                  curve: "linear",
                  label: "Max Temperature",
                },
              ]
            : []),
        ]}
        height={350}
        // margin={{ top: 10, bottom: 30, left: 60, right: 10 }}
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
    console.log(line);

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
    if (!selectedSubLineId || !token || line.status === "stopped") return;

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
          timestamp: moment(log.timestamp).format("MM/DD HH:mm"),
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
      console.log(allTemperatureLogs);

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

  // const warnThreshold =
  //   typeof selectedSubLine?.machine === "string"
  //     ? machines.find((m) => m._id === selectedSubLine?.machine)
  //         ?.warnTemperature
  //     : selectedSubLine?.machine.warnTemperature;

  const selectedTabIndex = subLines.findIndex(
    (sl) => sl._id === selectedSubLineId
  );
  const maxThreshold =
    typeof selectedSubLine?.machine === "string"
      ? machines.find((m) => m._id === selectedSubLine?.machine)?.maxTemperature
      : selectedSubLine?.machine.maxTemperature;

  const warnThreshold =
    typeof selectedSubLine?.machine === "string"
      ? machines.find((m) => m._id === selectedSubLine?.machine)
          ?.warnTemperature
      : selectedSubLine?.machine.warnTemperature;

  return (
    <DashboardLayout>
      <Box
        position="sticky"
        top={0}
        // bgcolor="background.paper"
        zIndex={1000}
        p={2}
        sx={{ borderRadius: 11 }}
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
        <Grid size={5}>
          <Card
            sx={{
              borderRadius: 11,
              p: 1,
              background: "rgba(255, 255, 255, 0.07)",
              backdropFilter: "blur(20px) saturate(180%)",
              height: "100%",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Metriche Energetiche
              </Typography>

              {/* Definizione dei gradienti SVG */}
              <svg width="0" height="0">
                <defs>
                  <linearGradient
                    id="power-gradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#4dabf5" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4dabf5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="consumption-gradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#ffa733" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ffa733" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="co2-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#51cf66" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#51cf66" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </svg>

              <LineChart
                height={350}
                series={[
                  {
                    data: powerLogs.map((d) => d.value),
                    label: "Potenza (W)",
                    color: "#4dabf5",
                    showMark: false,
                    curve: "monotoneX",
                    area: true,
                    fill: "url(#power-gradient)",
                  },
                  {
                    data: consumptionLogs.map((d) => d.value),
                    label: "Consumo (kWh)",
                    color: "#ffa733",
                    showMark: false,
                    curve: "monotoneX",
                    area: true,
                    fill: "url(#consumption-gradient)",
                  },
                  {
                    data: co2Logs.map((d) => d.value),
                    label: "CO₂ (kg)",
                    color: "#51cf66",
                    showMark: false,
                    curve: "monotoneX",
                    area: true,
                    fill: "url(#co2-gradient)",
                  },
                ]}
                xAxis={[
                  {
                    data: powerLogs.map((d) => d.timestamp),
                    scaleType: "band",
                    label: "Orario",
                  },
                ]}
                margin={{ left: 70, right: 20 }}
                sx={{
                  ".MuiAreaElement-root": {
                    fillOpacity: 0.6,
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={5}>
          <Card
            sx={{
              borderRadius: 11,
              p: 1,
              background: "rgba(255, 255, 255, 0.07)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              height: "100%",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Temperatura
                {selectedSubLine && (
                  <Typography variant="subtitle2" color="text.secondary">
                    Soglia: {warnThreshold}°C | Max: {maxThreshold}°C
                  </Typography>
                )}
              </Typography>
              <MuiLineChartWithGradient
                data={temperatureLogs}
                yLabel="°C"
                gradientId="temp-gradient"
                maxThreshold={maxThreshold}
                warnThreshold={warnThreshold}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid container spacing={2} size={2}>
          <Grid size={12}>
            {" "}
            <TemperatureAlertCard
              temperatureLogs={temperatureLogs}
              warnThreshold={warnThreshold || 0}
              machineName={machineName!}
            />
          </Grid>{" "}
          <Grid size={12}>
            <Card
              variant="outlined"
              sx={{
                p: 1.5,
                textAlign: "center",
                borderRadius: 11,
                borderLeft: "4px solid #4dabf5",
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Potenza Massima
              </Typography>
              <Typography variant="h4" color="#4dabf5">
                {powerLogs.length > 0
                  ? Math.max(...powerLogs.map((d) => d.value)).toFixed(2)
                  : "N/D"}{" "}
                W
              </Typography>
              <Typography variant="caption" display="block">
                {powerLogs.length > 0
                  ? `il ${new Date(
                      powerLogs.find(
                        (d) =>
                          d.value === Math.max(...powerLogs.map((d) => d.value))
                      )!.timestamp
                    ).toLocaleString()}`
                  : ""}
              </Typography>
            </Card>
          </Grid>
          <Grid size={12}>
            <Card
              variant="outlined"
              sx={{
                p: 1.5,
                textAlign: "center",
                borderRadius: 11,
                borderLeft: "4px solid #FFB34F",
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Consumo Massimo
              </Typography>
              <Typography variant="h4" color="#ffa733">
                {consumptionLogs.length > 0
                  ? Math.max(...consumptionLogs.map((d) => d.value)).toFixed(2)
                  : "N/D"}{" "}
                kWh
              </Typography>
              <Typography variant="caption" display="block">
                {consumptionLogs.length > 0
                  ? `il ${new Date(
                      consumptionLogs.find(
                        (d) =>
                          d.value ===
                          Math.max(...consumptionLogs.map((d) => d.value))
                      )!.timestamp
                    ).toLocaleString()}`
                  : ""}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default LineDetails;
