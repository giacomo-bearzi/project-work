import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import { useAuth } from '../../../log-in/context/AuthContext.tsx';
import { useGetProductionLines } from '../../../production-lines/hooks/useProductionLinesQueries.ts';
import { DynamicPLCard } from './DynamicPLCard.tsx';

export const ProductionLineList = () => {
  const { token } = useAuth();

  const { data, isPending, isError } = useGetProductionLines(token!);

  if (data) {
    return (
      <Grid
        container
        size={{ sm: 12, md: 12, lg: 4 }}
        spacing={1}
      >
        {data.map((pl) => (
          <DynamicPLCard
            productionLine={pl}
            key={pl['_id']}
          />
        ))}
      </Grid>
    );
  }

  if (isPending) {
    return (
      <Grid
        container
        size={{ sm: 12, md: 12, lg: 4 }}
        spacing={1}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <Grid
            size={{ sm: 4, md: 4, lg: 12 }}
            key={index}
          >
            <Skeleton
              variant="rounded"
              height={'100%'}
              sx={{ borderRadius: 5 }}
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (isError) {
    return <></>;
  }
};
