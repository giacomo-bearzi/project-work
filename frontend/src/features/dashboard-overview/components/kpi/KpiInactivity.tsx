import Grid from '@mui/material/Grid';
import { CustomPaper } from '../../../../components/CustomPaper';
import { useGetTotalStoppedTime } from '../../../production-lines/hooks/useProductionLinesQueries';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TimerRounded } from '@mui/icons-material';

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours} ore ${remainingMinutes} min`;
  }
  return `${remainingMinutes} min`;
};

export const KpiInactivity = () => {
  const {
    data: totalStoppedTime,
    isPending,
    isError,
  } = useGetTotalStoppedTime();

  if (totalStoppedTime?.totalStoppedTimeCurrentShift === 0) {
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
                Tempo di fermo
              </Typography>
              <Typography
                component="span"
                fontSize={'1.8rem'}
                fontWeight={600}
                color={
                  totalStoppedTime?.totalStoppedTimeCurrentShift > 0
                    ? '#F35858'
                    : '#21BF76'
                }
              >
                {formatTime(
                  totalStoppedTime?.totalStoppedTimeCurrentShift || 0
                )}
              </Typography>
              <Typography
                component={'span'}
                fontWeight={500}
                fontSize={'0.9rem'}
                sx={{ opacity: 0.9 }}
              >
                dall'inizio del turno
              </Typography>
            </Stack>
            <TimerRounded fontSize="large" />
          </Stack>
        </CustomPaper>
      </Grid>
    );
  }

  // @TODO: Aggiungere skeleton
  if (isPending) {
    return (
      <Grid size={4}>
        <CustomPaper sx={{ p: 2, borderRadius: 5 }}>
          <Typography>Caricamento...</Typography>
        </CustomPaper>
      </Grid>
    );
  }

  if (isError) {
    return <></>;
  }

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
              Tempo di fermo
            </Typography>
            <Typography
              component="span"
              fontSize={'1.8rem'}
              fontWeight={600}
              color="#21BF76"
            >
              0
            </Typography>
            <Typography
              component={'span'}
              fontWeight={500}
              fontSize={'0.9rem'}
              sx={{ opacity: 0.9 }}
            >
              dall'inizio del turno
            </Typography>
          </Stack>
          <TimerRounded fontSize="large" />
        </Stack>
      </CustomPaper>
    </Grid>
  );
};
