import Grid from '@mui/material/Grid';
import { ChartList } from '../components/ChartList.tsx';
import { KpiList } from '../components/KpiList.tsx';
import { ProductionLineList } from '../components/ProductionLineList.tsx';

export const OverviewLayout = () => {
  return (
    <Grid
      container
      spacing={2}
    >
      <ProductionLineList />
      <Grid
        container
        size={{ sm: 12, md: 12, lg: 8 }}
        spacing={2}
      >
        <KpiList />
        <ChartList />
      </Grid>
    </Grid>
  );
};
