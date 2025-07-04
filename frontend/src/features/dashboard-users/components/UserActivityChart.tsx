import { Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import type { ApiGetUser } from '../../users/types/usersTypes.ts';
import type { ApiGetIssue } from '../../issues/types/issuesTypes.ts';
import type { ApiGetTask } from '../../tasks/types/tasksTypes.ts';

interface UserActivityChartProps {
  user: ApiGetUser | null;
  issues: ApiGetIssue[];
  tasks: ApiGetTask[];
}

export const UserActivityChart: React.FC<UserActivityChartProps> = ({ user, issues, tasks }) => {
  const issueStatuses = Array.from(new Set(issues.map((i) => i.status)));
  const taskStatuses = Array.from(new Set(tasks.map((t) => t.status)));
  const allStatuses = Array.from(new Set([...issueStatuses, ...taskStatuses]));

  const series = allStatuses.map((status) => ({
    label: status,
    data: [
      issues.filter((i) => i.status === status).length,
      tasks.filter((t) => t.status === status).length,
    ],
  }));

  return (
    <>
      {user && (tasks.length > 0 || issues.length > 0) ? (
        <BarChart
          sx={{
            maxWidth: '400px',
            maxHeight: '400px',
          }}
          series={series}
          hideLegend
          borderRadius={6}
          barLabel="value"
          xAxis={[
            {
              data: ['Issues', 'Tasks'],
              scaleType: 'band',
            },
          ]}
        />
      ) : (
        <Typography variant="body2" color="textSecondary">
          {user
            ? 'Nessun grafico disponibile per questo utente.'
            : 'Seleziona un utente per visualizzare il grafico.'}
        </Typography>
      )}
    </>
  );
};
