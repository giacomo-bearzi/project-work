import { RocketLaunchRounded } from '@mui/icons-material';
import { Grid, Stack, Typography } from '@mui/material';
import { CustomPaper } from '../../../../components/CustomPaper';
import { useGetProductionStats } from '../../../production-lines/hooks/useProductionLinesQueries';

export const KpiProductivity = () => {
  const { data: productionStats, isPending, isError } = useGetProductionStats();

  if (productionStats) {
    return (
      <Grid size={4}>
        <CustomPaper
          elevation={2}
          sx={{ p: 2, borderRadius: 5, height: '100%' }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
            height={'100%'}
          >
            <Stack
              justifyContent={'space-between'}
              height={'100%'}
            >
              <Typography
                component={'span'}
                fontWeight={500}
                fontSize={'1.1rem'}
              >
                Produzione oraria
              </Typography>
              <Typography
                component="span"
                fontSize={'1.8rem'}
                fontWeight={600}
                color={
                  productionStats?.currentProductionRate > 0
                    ? '#21BF76'
                    : '#F35858'
                }
              >
                {productionStats?.currentProductionRate || 0}
              </Typography>
              <Typography
                component={'span'}
                fontWeight={500}
                fontSize={'0.9rem'}
                sx={{ opacity: 0.9 }}
              >
                caramelle/ora
              </Typography>
            </Stack>
            <RocketLaunchRounded fontSize="large" />
          </Stack>
        </CustomPaper>
      </Grid>
    );
  }

  if (isPending) {
    return (
      <Grid size={4}>
        <CustomPaper sx={{ p: 2, borderRadius: 5 }}>
          <Stack spacing={1}>
            <Typography variant="h6">Caricamento...</Typography>
          </Stack>
        </CustomPaper>
      </Grid>
    );
  }

  if (isError) {
    return <></>;
  }
};
