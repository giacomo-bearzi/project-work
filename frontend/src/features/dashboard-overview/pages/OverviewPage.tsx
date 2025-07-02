import { DashboardLayout } from '../../dashboard/layouts/DashboardLayout.tsx';
import { ResponsiveOverviewLayout } from '../layouts/ResponsivieOverviewLayout.tsx';

export const OverviewPage = () => {
  return (
    <DashboardLayout>
      <ResponsiveOverviewLayout />
    </DashboardLayout>
  );
};
