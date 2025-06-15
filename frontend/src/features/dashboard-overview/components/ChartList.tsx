import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PieChart } from '@mui/x-charts/PieChart';
import { CustomPaper } from '../../../components/CustomPaper.tsx';
import { IssuesDistributionChart } from './IssuesDistributionChart.tsx';

export const ChartList = () => {
  const data = [
    { id: 0, value: 10, label: 'series A' },
    { id: 1, value: 15, label: 'series B' },
    { id: 2, value: 20, label: 'series C' },
  ];

  return (
    <Grid
      container
      size={12}
      spacing={1}
    >
      <IssuesDistributionChart />
      <Grid size={6}>
        <CustomPaper sx={{ p: 2, borderRadius: 8 }}>
          <Stack
            gap={2}
            alignItems={'center'}
          >
            <Typography
              component={'span'}
              fontWeight={500}
            >
              Tipologia di segnalazioni
            </Typography>
            <PieChart
              series={[
                {
                  arcLabel: (data) => `${data.value}%`,
                  data: data,
                  innerRadius: 48,
                  cornerRadius: 4,
                  paddingAngle: 2,
                  highlightScope: {
                    highlight: 'item',
                    fade: 'global',
                  },
                },
              ]}
              slotProps={{
                legend: {
                  sx: {
                    fontSize: 16,
                  },
                },
                pieArc: {
                  strokeOpacity: 0,
                },
                pieArcLabel: {
                  fontSize: 16,
                  fontWeight: 500,
                },
              }}
              sx={{ aspectRatio: '16/9' }}
            />
          </Stack>
        </CustomPaper>
      </Grid>
      <Grid size={6}>
        <CustomPaper sx={{ p: 2, borderRadius: 8 }}>
          <Stack
            gap={2}
            alignItems={'center'}
          >
            <Typography
              component={'span'}
              fontWeight={500}
            >
              Tipologia di segnalazioni
            </Typography>
            <PieChart
              series={[
                {
                  arcLabel: (data) => `${data.value}%`,
                  data: data,
                  innerRadius: 48,
                  cornerRadius: 4,
                  paddingAngle: 2,
                  highlightScope: {
                    highlight: 'item',
                    fade: 'global',
                  },
                },
              ]}
              slotProps={{
                legend: {
                  sx: {
                    fontSize: 16,
                  },
                },
                pieArc: {
                  strokeOpacity: 0,
                },
                pieArcLabel: {
                  fontSize: 16,
                  fontWeight: 500,
                },
              }}
              sx={{ aspectRatio: '16/9' }}
            />
          </Stack>
        </CustomPaper>
      </Grid>
      <Grid size={6}>
        <CustomPaper sx={{ p: 2, borderRadius: 8 }}>
          <Stack
            gap={2}
            alignItems={'center'}
          >
            <Typography
              component={'span'}
              fontWeight={500}
            >
              Tipologia di segnalazioni
            </Typography>
            <PieChart
              series={[
                {
                  arcLabel: (data) => `${data.value}%`,
                  data: data,
                  innerRadius: 48,
                  cornerRadius: 4,
                  paddingAngle: 2,
                  highlightScope: {
                    highlight: 'item',
                    fade: 'global',
                  },
                },
              ]}
              slotProps={{
                legend: {
                  sx: {
                    fontSize: 16,
                  },
                },
                pieArc: {
                  strokeOpacity: 0,
                },
                pieArcLabel: {
                  fontSize: 16,
                  fontWeight: 500,
                },
              }}
              sx={{ aspectRatio: '16/9' }}
            />
          </Stack>
        </CustomPaper>
      </Grid>
    </Grid>
  );
};
