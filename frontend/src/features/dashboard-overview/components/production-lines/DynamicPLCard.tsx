import { Alert, Skeleton, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { CustomPaper } from '../../../../components/CustomPaper.tsx';
import { useAuth } from '../../../dashboard-login/context/AuthContext.tsx';
import { useGetIssueByLineId } from '../../../issues/hooks/useIssuesQueries.tsx';
import type { ApiGetIssue } from '../../../issues/types/issuesTypes.ts';
import { useGetProductionLine } from '../../../production-lines/hooks/useProductionLinesQueries.ts';
import type { ApiGetProductionLine } from '../../../production-lines/types/productionLinesTypes.ts';
import { useGetTaskByLineId } from '../../../tasks/hooks/useTasksQueries.ts';
import type { ApiGetTask } from '../../../tasks/types/tasksTypes.ts';
import { PLCardActive } from './PLCardActive.tsx';
import { PLCardIssue } from './PLCardIssue.tsx';
import { PLCardMaintenance } from './PLCardMaintenance.tsx';
import { PLCardStopped } from './PLCardStopped.tsx';

interface ProductionLineCardProps {
  productionLine: ApiGetProductionLine;
}

export const DynamicPLCard = ({ productionLine }: ProductionLineCardProps) => {
  const { token } = useAuth();
  
  const navigate = useNavigate();

  // Informazioni della singola linea produttiva.
  const { data: productionLineData, isPending, isError } = useGetProductionLine(productionLine._id);

  // Recupera le task di tipo `standard` e di stato `in corso`.
  const { data: taskStandardData } = useGetTaskByLineId(
    productionLine.lineId,
    'in_corso',
    'standard'
    
  );

  // Inizializzazione array vuoto per le task standard.
  let productionLineStandardTasks: ApiGetTask[] = [];

  // Se ci sono task, aggiorna l'array.
  if (taskStandardData && taskStandardData.length > 0) {
    productionLineStandardTasks = taskStandardData;
  }

  // Recupera le task di tipo `manutenzione` e di stato `in corso`.
  const { data: taskMaintenanceData } = useGetTaskByLineId(
    productionLine.lineId,
    token!,
    'in_corso',
    'manutenzione',
  );

  // Inizializzazione array vuoto per le task di manutenzione.
  let productionLineMaintenanceTasks: ApiGetTask[] = [];

  // Se ci sono task di manutenzione, aggiorna l'array.
  if (taskMaintenanceData && taskMaintenanceData.length > 0) {
    productionLineMaintenanceTasks = taskMaintenanceData;
  }

  // Recupera le issue di stato `aperta`.
  const { data: issueData } = useGetIssueByLineId(productionLine.lineId, token!, 'aperta');

  // Inizializzazione array vuoto per le issue.
  let productionLineIssues: ApiGetIssue[] = [];

  // Se ci sono issue, aggiorna l'array.
  if (issueData) {
    productionLineIssues = issueData;
  }

  // Linee produttive caricate correttamente.
  if (productionLineData) {
    switch (productionLineData.status) {
      case 'active':
        if (productionLineStandardTasks.length > 0) {
          return (
            <PLCardActive
              lineId={productionLineData.lineId}
              lineName={productionLineData.name}
              description={productionLineStandardTasks[0].description}
              assignedTo={productionLineStandardTasks[0].assignedTo}
              onClick={() => navigate(`/overview/${productionLineData.lineId}`)}
            />
          );
        }
        break;
      case 'maintenance':
        if (productionLineMaintenanceTasks.length > 0) {
          return (
            <PLCardMaintenance
              lineId={productionLineData.lineId}
              lineName={productionLineData.name}
              maintenanceEnd={productionLineMaintenanceTasks[0].maintenanceEnd}
              assignedTo={productionLineMaintenanceTasks[0].assignedTo}
              onClick={() => navigate(`/overview/${productionLineData.lineId}`)}
            />
          );
        }
        break;
      case 'issue':
        if (productionLineIssues.length > 0) {
          return (
            <PLCardIssue
              lineId={productionLineData.lineId}
              lineName={productionLineData.name}
              issueCount={productionLineIssues.length}
              lastIssue={productionLineIssues[0]}
              onClick={() => navigate(`/overview/${productionLineData.lineId}`)}
            />
          );
        }
        break;
      case 'stopped':
        return (
          <PLCardStopped
            lineId={productionLineData.lineId}
            lineName={productionLineData.name}
            onClick={() => navigate(`/overview/${productionLineData.lineId}`)}
          />
        );
    }
  }

  // Caricamento linee produttive in corso.
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
          <Grid container height={'100%'} width={'100%'} p={2} spacing={2}>
            <Grid size={3} sx={{ height: '100%', display: 'flex' }}>
              <Skeleton
                variant="rectangular"
                sx={{
                  borderRadius: 64,
                  height: 'auto',
                  width: '100%',
                }}
              />
            </Grid>
            <Grid size={9} alignContent={'center'}>
              <Stack gap={4} alignItems={'center'} display={'flex'}>
                <Stack alignItems={'center'} display={'flex'} width={'100%'}>
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

  // Errore durante il caricamento delle linee produttive.
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
