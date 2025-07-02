import Grid from '@mui/material/Grid';
import { CustomPaper } from '../../../../components/CustomPaper.tsx';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PieChart } from '@mui/x-charts/PieChart';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import { useGetIssues } from '../../../issues/hooks/useIssueQueries.tsx';
import type { ApiIssue } from '../../../issues/types/types.api.ts';

const transformByType = (data: ApiIssue[]) => {
  const typeMap = new Map();

  for (const item of data) {
    const type = item.type;

    if (!typeMap.has(type)) {
      typeMap.set(type, {
        id: item._id,
        label: type[0].toUpperCase() + type.slice(1),
        value: 1,
      });
    } else {
      typeMap.get(type).value += 1;
    }
  }

  return Array.from(typeMap.values());
};

export const IssuesDistributionChart = () => {
  const { data, isPending, isError } = useGetIssues();

  if (data) {
    return (
      <Grid size={6}>
        <CustomPaper
          elevation={2}
          sx={{ p: 2, borderRadius: 5 }}
        >
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
                  arcLabel: (data) => String(data.value),
                  data: transformByType(data),
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
                  fontWeight: 500,
                },
              }}
              sx={{
                aspectRatio: '16/9',
                width: '100%',
              }}
            />
          </Stack>
        </CustomPaper>
      </Grid>
    );
  }

  if (isPending) {
    return (
      <Grid size={6}>
        <CustomPaper sx={{ p: 2, borderRadius: 5 }}>
          <Stack
            gap={2}
            alignItems={'center'}
          >
            <Skeleton
              variant="text"
              width={'50%'}
            />
            <Box
              sx={{
                aspectRatio: '16/9',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Skeleton
                variant="rounded"
                width={'100%'}
                height={'100%'}
                sx={{ borderRadius: 6 }}
              />
            </Box>
          </Stack>
        </CustomPaper>
      </Grid>
    );
  }

  if (isError) {
    return (
      <Grid size={6}>
        <CustomPaper sx={{ p: 2, borderRadius: 5 }}>
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
            <Box
              sx={{
                aspectRatio: '16/9',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Alert
                severity="error"
                variant="filled"
              >
                Oops! Si è verificato un errore
              </Alert>
            </Box>
          </Stack>
        </CustomPaper>
      </Grid>
    );
  }
};
