import { Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import type { User } from '../../../components/Login.tsx';
import type { Issue, Task } from '../pages/UsersPage.tsx';

interface UserActivityChartProps {
  user: User | null;
  issues: Issue[];
  tasks: Task[];
}

export const UserActivityChart: React.FC<UserActivityChartProps> = ({
  user,
  issues,
  tasks,
}) => {
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
          width={350}
          height={250}
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
        <Typography
          variant="body2"
          color="textSecondary"
        >
          {user
            ? 'Nessun grafico disponibile per questo utente.'
            : 'Seleziona un utente per visualizzare il grafico.'}
        </Typography>
      )}
    </>
  );
};
