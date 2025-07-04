import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import { useGetProductionLines } from '../../../production-lines/hooks/useProductionLinesQueries.ts';
import type { ApiGetProductionLine } from '../../../production-lines/types/productionLinesTypes.ts';
import { DynamicPLCard } from './DynamicPLCard.tsx';

export const ProductionLineList = () => {
  const { data, isPending, isError } = useGetProductionLines();

  if (data) {
    return (
      <Grid container size={{ sm: 12, md: 12, lg: 4 }} spacing={1} alignItems={'stretch'}>
        {data.map((pl: ApiGetProductionLine) => (
          <DynamicPLCard productionLine={pl} key={pl['_id']} />
        ))}
      </Grid>
    );
  }

  if (isPending) {
    return (
      <Grid container size={{ sm: 12, md: 12, lg: 4 }} spacing={1} sx={{ height: '100%' }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Grid size={{ sm: 4, md: 4, lg: 12 }} key={index}>
            <Skeleton variant="rounded" height={'100%'} sx={{ borderRadius: 5 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (isError) {
    return <></>;
  }
};
