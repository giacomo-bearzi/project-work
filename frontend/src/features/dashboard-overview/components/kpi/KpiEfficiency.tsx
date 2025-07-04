import { TrendingUpRounded } from '@mui/icons-material';
import { CustomPaper } from '../../../../components/CustomPaper';

import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { getOEEStatusColor } from '../../../../utils/helpers';
import { useGetOEEData } from '../../../production-lines/hooks/useProductionLinesQueries';

export const KpiEfficiency = () => {
  const {
    data: oeeData,
    isPending,
    isError,
  } = useGetOEEData()

  if (oeeData) {
    const overallOEE = oeeData.overall.oee || 0;
    const overallStatus = oeeData.overall.status || 'critical';

    return (
      <Grid size={4}>
        <CustomPaper elevation={2} sx={{ p: 2, borderRadius: 5, height: '100%' }}>
          <Stack
            direction="row"
            spacing={1}
            height={'100%'}
            alignItems="center"
            justifyContent="space-between"
            sx={{ overflow: 'hidden' }}
          >
            <Stack justifyContent={'space-between'} height={'100%'}>
              <Typography component={'span'} fontWeight={500} fontSize={'1.1rem'}>
                Efficienza complessiva
              </Typography>
              <Typography
                component="span"
                fontSize={'1.8rem'}
                fontWeight={600}
                sx={{ color: getOEEStatusColor(overallStatus) }}
              >
                {overallOEE.toFixed(1)}%
              </Typography>
              <Typography
                component={'span'}
                fontWeight={500}
                fontSize={'0.9rem'}
                sx={{ opacity: 0.9 }}
              >
                OEE complessivo
              </Typography>
            </Stack>
            <TrendingUpRounded fontSize="large" />
          </Stack>
        </CustomPaper>
      </Grid>
    );
  }

  if (isPending) {
    return (
      <Grid size={4}>
        <CustomPaper elevation={2} sx={{ p: 2, borderRadius: 5, height: '100%' }}>
          <Stack
            direction="row"
            spacing={1}
            height={'100%'}
            alignItems="center"
            justifyContent="space-between"
            sx={{ overflow: 'hidden' }}
          >
            <Stack justifyContent={'space-between'} height={'100%'}>
              <Typography component={'span'} fontWeight={500} fontSize={'1.1rem'}>
                Efficienza complessiva
              </Typography>
              <Skeleton
                variant="text"
                width={64}
                sx={{ fontSize: '1.8rem', lineHeight: '1.8rem' }}
            />
              <Typography
                component={'span'}
                fontWeight={500}
                fontSize={'0.9rem'}
                sx={{ opacity: 0.9 }}
              >
                OEE complessivo
              </Typography>
            </Stack>
            <TrendingUpRounded fontSize="large" />
          </Stack>
        </CustomPaper>
      </Grid>
    );
  }
  
  if (isError) {
    return (
      <Grid size={4}>
        <CustomPaper sx={{ p: 2, borderRadius: 5 }}>
          <Stack spacing={1}>
            <Typography component={'span'} fontWeight={500} fontSize={'1.1rem'}>
              Efficienza complessiva
            </Typography>
            {/* Alert di errore */}
          </Stack>
        </CustomPaper>
      </Grid>
    );
  }
};
