import Grid from '@mui/material/Grid';
import { ProductionLineList } from '../components/production-lines/ProductionLineList';
import { ChartList } from '../components/charts/ChartList';
import { KpiList } from '../components/kpi/KpiList';

export const OverviewLayoutTablet = () => {
  return (
    <Grid container spacing={2} height={'100%'} alignContent={'start'}>
      <ProductionLineList />
      <Grid
        container
        size={{ sm: 12, md: 12, lg: 8 }}
        columnSpacing={2}
        height={'100%'}
        sx={{
          borderRadius: 5,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <KpiList />
        <ChartList />
      </Grid>
    </Grid>
  );
};
