import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LineChart } from '@mui/x-charts/LineChart';
import { useState, useEffect } from 'react';
import { CustomPaper } from '../../../../components/CustomPaper.tsx';

// Dati per il grafico.
const rawData = [
  { hour: '08:00', produced: 0 },
  { hour: '08:30', produced: 2700 },
  { hour: '09:00', produced: 2798 },
  { hour: '09:30', produced: 2798 },
  { hour: '10:00', produced: 1320 },
  { hour: '10:30', produced: 2798 },
  { hour: '11:00', produced: 2798 },
  { hour: '11:30', produced: 2700 },
  { hour: '12:00', produced: 0 },
  { hour: '13:00', produced: 0 },
  { hour: '13:30', produced: 2467 },
  { hour: '14:00', produced: 2798 },
  { hour: '14:30', produced: 2798 },
  { hour: '15:00', produced: 2798 },
  { hour: '15:30', produced: 2750 },
  { hour: '16:00', produced: 2798 },
  { hour: '16:30', produced: 1674 },
  { hour: '17:00', produced: 0 },
];

export const HourlyProductionChart = () => {
  const [chartData, setChartData] = useState({
    hours: [] as string[],
    produced: [] as number[],
  });

  // Funzione per formattare e filtrare i dati.
  const processData = () => {
    const now = new Date();

    // Aggiunge l'ora corrente ai dati.
    const dataWithDate = rawData.map((entry) => {
      const [h, m] = entry.hour.split(':').map(Number);
      const date = new Date();
      date.setHours(h, m, 0, 0);
      return { ...entry, date };
    });

    // Filtra i dati per includere solo quelli fino all'ora corrente.
    const filteredData = dataWithDate.filter((entry) => entry.date <= now);

    const hours = filteredData.map((h) => h.hour);
    const produced = filteredData.map((h) => h.produced);

    setChartData({ hours, produced });
  };

  // Inizializza i dati al montaggio del componente.
  useEffect(() => {
    processData();
  }, []);

  // Aggiorna i dati ogni 30 minuti per mantenere aggiornato il grafico.
  useEffect(() => {
    const interval = setInterval(() => {
      processData();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Grid size={12}>
      <CustomPaper
        elevation={2}
        sx={{ p: 2, borderRadius: 5 }}
      >
        <Stack
          gap={2}
          alignItems={'center'}
        >
          <Typography
            component={'span'}
            fontWeight={500}
          >
            Produzione oraria vs Target
          </Typography>
          <LineChart
            xAxis={[
              { scaleType: 'point', label: 'Ora', data: chartData.hours },
            ]}
            yAxis={[{ scaleType: 'linear', label: 'Produzione' }]}
            series={[
              {
                data: chartData.produced,
                label: 'Produzione',
                color: '#21BF76',
                showMark: false,
              },
              {
                data: Array.from(
                  { length: chartData.hours.length },
                  () => 2000
                ),
                label: 'Target',
                color: '#F3A658',
                showMark: false,
              },
            ]}
            sx={{
              width: '100%',
              '& .MuiLineElement-root': { strokeWidth: 2 },
            }}
          />
        </Stack>
      </CustomPaper>
    </Grid>
  );
};
