import { useQuery } from '@tanstack/react-query';
import { CustomPaper } from '../../../../components/CustomPaper';
import { TrendingUpRounded } from '@mui/icons-material';

import { getOEEData } from '../../../production-lines/api/api';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

// Helper function to get status color
const getOeeStatusColor = (
  status: 'excellent' | 'good' | 'critical'
): string => {
  switch (status) {
    case 'excellent':
      return '#21BF76';
    case 'good':
      return '#FF8C3A';
    case 'critical':
      return '#F35865';
    default:
      return '#808080';
  }
};

interface OEELineResult {
  lineId: string;
  availability: number;
  performance: number;
  quality: number;
  oee: number;
  oeePercentage: number;
  status: 'excellent' | 'good' | 'critical';
}

interface OEEData {
  lines: OEELineResult[];
  overall: {
    oee: number;
    status: 'excellent' | 'good' | 'critical';
  };
}

export const KpiEfficiency = () => {
  const {
    data: oeeData,
    isPending,
    isError,
  } = useQuery<OEEData>({
    queryKey: ['oeeData'],
    queryFn: getOEEData,
    refetchInterval: 30000, // Update every 30 seconds
  });

  if (oeeData) {
    const overallOEE = oeeData?.overall.oee || 0;
    const overallStatus = oeeData?.overall.status || 'critical';

    return (
      <Grid size={4}>
        <CustomPaper
          elevation={2}
          sx={{ p: 2, borderRadius: 5, height: '100%' }}
        >
          <Stack
            direction="row"
            spacing={1}
            height={'100%'}
            alignItems="center"
            justifyContent="space-between"
            sx={{ overflow: 'hidden' }}
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
                Efficienza complessiva
              </Typography>
              <Typography
                component="span"
                fontSize={'1.8rem'}
                fontWeight={600}
                sx={{ color: getOeeStatusColor(overallStatus) }}
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
        <CustomPaper sx={{ p: 2, borderRadius: 5 }}>
          <Stack spacing={1}>
            <Typography
              component={'span'}
              fontWeight={500}
              fontSize={'1.1rem'}
            >
              Efficienza complessiva
            </Typography>
            <Skeleton />
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
            <Typography
              component={'span'}
              fontWeight={500}
              fontSize={'1.1rem'}
            >
              Efficienza complessiva
            </Typography>
            {/* Alert di errore */}
          </Stack>
        </CustomPaper>
      </Grid>
    );
  }
};
