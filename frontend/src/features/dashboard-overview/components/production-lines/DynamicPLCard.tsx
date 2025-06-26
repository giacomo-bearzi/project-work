import { Alert, Skeleton, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useQuery } from '@tanstack/react-query';
import { CustomPaper } from '../../../../components/CustomPaper.tsx';
import api from '../../../../utils/axios.ts';
import { useAuth } from '../../../log-in/context/AuthContext.tsx';
import { useGetProductionLine } from '../../../production-lines/hooks/useProductionLinesQueries.ts';
import { PLCardActive } from './PLCardActive.tsx';
import { PLCardStopped } from './PLCardStopped.tsx';
import { PLCardIssue } from './PLCardIssue.tsx';
import { useNavigate } from 'react-router-dom';
import type { ApiProductionLine } from '../../../production-lines/types/types.api.ts';
import { PLCardMaintenance } from './PLCardMaintenance.tsx';

interface ProductionLineCardProps {
  productionLine: ApiProductionLine;
}

// @NOTE: Attiva o Ferma in base a se c'è qualcuno assegnato nelle task o se non in orario di lavoro.
// @NOTE: Manutenzione se viene creata una task.
// @NOTE: Problema se viene creata una issue.

export const DynamicPLCard = ({ productionLine }: ProductionLineCardProps) => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const { data: lineTasks } = useQuery({
    queryKey: ['tasks', productionLine.lineId],
    queryFn: async () => {
      const response = await api.get(
        `/tasks/line/${productionLine.lineId}?status=in_corso`,
      );
      return response.data;
    },
  });

  const { data: lineIssues } = useQuery({
    queryKey: ['issues', productionLine.lineId],
    queryFn: async () => {
      const response = await api.get(
        `/issues/line/${productionLine.lineId}?status=in lavorazione`,
      );
      return response.data;
    },
  });

  const { data, isPending, isError } = useGetProductionLine(
    productionLine['_id'],
    token!,
  );

  if (data) {
    // Problema linea
    if (lineIssues) {
      const issuesCount = lineIssues.length;
      const lastIssue = lineIssues[0];

      return (
        <PLCardIssue
          lineId={data.lineId}
          lineName={data.name}
          issueCount={issuesCount}
          lastIssue={lastIssue}
          onClick={() => navigate(`/overview/${data.lineId}`)}
        />
      );
    }

    // Linea attiva
    if (lineTasks && !lineIssues) {
      const maintenanceTasks = lineTasks.filter(
        (task) => task.type === 'manutenzione',
      );

      if (maintenanceTasks.length > 0) {
        console.log(maintenanceTasks[0]);

        return (
          <PLCardMaintenance
            lineId={data.lineId}
            lineName={data.name}
            maintenanceEnd={maintenanceTasks[0].maintenanceEnd}
            assignetAt={maintenanceTasks[0].assignedTo.fullName}
          />
        );
      }

      return (
        <PLCardActive
          lineId={data.lineId}
          lineName={data.name}
          onClick={() => navigate(`/overview/${data.lineId}`)}
        />
      );
    }

    // Linea ferma
    if (!lineTasks && !lineIssues) {
      return (
        <PLCardStopped
          lineId={data.lineId}
          lineName={data.name}
          onClick={() => navigate(`/overview/${data.lineId}`)}
        />
      );
    }

    return (
      <Grid size={{ sm: 4, md: 4, lg: 12 }}>
        <CustomPaper
          sx={{
            p: 0,
            borderRadius: 5,
            height: '100%',
          }}
        >
          <Grid
            container
            height={'100%'}
            width={'100%'}
            p={2}
            spacing={2}
          >
            <Grid size={3}>
              <Box
                component={'img'}
                src={`/${productionLine.lineId}-background.svg`}
                sx={{
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 64,
                }}
              />
            </Grid>
            <Grid
              size={9}
              alignContent={'center'}
            >
              <Stack
                gap={4}
                alignItems={'center'}
                display={'flex'}
              >
                <Stack
                  alignItems={'center'}
                  display={'flex'}
                  width={'100%'}
                >
                  <Skeleton width={'75%'} />
                  <Skeleton width={'50%'} />
                </Stack>
                <Skeleton
                  variant="rectangular"
                  width={'100%'}
                  height={64}
                  sx={{ borderRadius: 3 }}
                />
              </Stack>
            </Grid>
          </Grid>
        </CustomPaper>
      </Grid>
    );
  }

  if (isPending) {
    return (
      <Grid size={{ sm: 4, md: 4, lg: 12 }}>
        <CustomPaper
          sx={{
            p: 0,
            borderRadius: 5,
            height: '100%',
            display: 'flex',
            // overflow: 'hidden',
            // position: 'relative',
          }}
        >
          <Grid
            container
            height={'100%'}
            width={'100%'}
            p={2}
            spacing={2}
          >
            <Grid
              size={3}
              sx={{ height: '100%', display: 'flex' }}
            >
              <Skeleton
                variant="rectangular"
                sx={{
                  borderRadius: 64,
                  height: 'auto',
                  width: '100%',
                }}
              />
            </Grid>
            <Grid
              size={9}
              alignContent={'center'}
            >
              <Stack
                gap={4}
                alignItems={'center'}
                display={'flex'}
              >
                <Stack
                  alignItems={'center'}
                  display={'flex'}
                  width={'100%'}
                >
                  <Skeleton width={'75%'} />
                  <Skeleton width={'50%'} />
                </Stack>
                <Skeleton
                  variant="rectangular"
                  width={'100%'}
                  height={64}
                  sx={{ borderRadius: 3 }}
                />
              </Stack>
            </Grid>
          </Grid>
        </CustomPaper>
      </Grid>
    );
  }

  if (isError) {
    return (
      <Grid size={{ sm: 4, md: 4, lg: 12 }}>
        <CustomPaper
          sx={{
            p: 2,
            borderRadius: 5,
            height: '100%',
            // overflow: 'hidden',
            // position: 'relative',
          }}
        >
          <Stack
            display={'flex'}
            justifyContent={'center'}
            alignContent={'center'}
            alignItems={'center'}
            height={'100%'}
            width={'100%'}
          >
            <Alert
              variant="filled"
              severity="error"
              sx={{ width: 'fit-content', backgroundColor: '#F35858' }}
            >
              Oops! Si è verificato un errore
            </Alert>
          </Stack>
        </CustomPaper>
      </Grid>
    );
  }
};
