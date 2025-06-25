import { OverviewLayout } from '../../dashboard-overview/layouts/OverviewLayout.tsx';
import { DashboardLayout } from '../../dashboard/layouts/DashboardLayout.tsx';

export const OverviewPage = () => {
  return (
    <DashboardLayout>
      <OverviewLayout />
    </DashboardLayout>
  );
};
