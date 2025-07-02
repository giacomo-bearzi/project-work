import Grid from '@mui/material/Grid';

import { ProductionLineList } from '../components/production-lines/ProductionLineList.tsx';
import { KpiList } from '../components/kpi/KpiList.tsx';
import { ChartList } from '../components/charts/ChartList.tsx';

export const OverviewLayoutDesktop = () => {
  return (
    <Grid
      container
      spacing={2}
      height={'100%'}
      alignContent={'start'}
    >
      <ProductionLineList />
      <Grid
        container
        size={{ sm: 12, md: 12, lg: 8 }}
        spacing={2}
        height={'100%'}
        sx={{
          borderRadius: 5,
          overflowY: { xs: 'scroll', md: 'scroll', lg: 'auto' },
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
