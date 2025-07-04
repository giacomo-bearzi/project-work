import { useMemo } from 'react';
import { Gauge } from '@mui/x-charts/Gauge';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CustomPaper } from '../../../../components/CustomPaper';
import { Box, Grid } from '@mui/material';

interface TemperatureChartProps {
  maxTemperature: number;
}

export const TemperatureChart = ({ maxTemperature }: TemperatureChartProps) => {
  // Generate casuale di temperature.
  const temperatureLogs = useMemo(() => {
    const logs = [];
    for (let i = 0; i < 30; i++) {
      logs.push({ value: Math.round((20 + Math.random() * (maxTemperature + 10 - 20)) * 10) / 10 });
    }
    return logs;
  }, [maxTemperature]);

  // Calcola la temperatura media.
  const avgTemperature = useMemo(() => {
    if (!temperatureLogs.length) return 0;
    return temperatureLogs.reduce((sum, log) => sum + log.value, 0) / temperatureLogs.length;
  }, [temperatureLogs]);

  return (
    <Grid size={6}>
      <CustomPaper elevation={2} sx={{ p: 2, borderRadius: 5, height: '100%' }}>
        <Stack gap={2} alignItems={'center'}>
          <Typography component={'span'} fontWeight={500}>
            Temperatura media
          </Typography>
          <Box sx={{ width: '100%', height: '100%' }}>
            <Gauge
              value={avgTemperature}
              valueMin={0}
              valueMax={maxTemperature}
              startAngle={-110}
              endAngle={110}
              text={avgTemperature ? `${avgTemperature.toFixed(1)}°C` : '--'}
              sx={{

                height: '100%',
              }}
            />
          </Box>
        </Stack>
      </CustomPaper>
    </Grid>
  );
};

export default TemperatureChart;
