import Grid from '@mui/material/Grid';
import { HourlyProductionChart } from './HourlyProductionChart.tsx';
import { IssuesDistributionChart } from './IssuesDistributionChart.tsx';
import TemperatureChart from './TemperatureChart.tsx';

export const ChartList = () => {
  return (
    <Grid container size={12} columnSpacing={1} rowSpacing={1}>
      <HourlyProductionChart />
      <IssuesDistributionChart />
      <TemperatureChart maxTemperature={120} />
    </Grid>
  );
};

// TODO: aggiungere grafico per i consumi.
