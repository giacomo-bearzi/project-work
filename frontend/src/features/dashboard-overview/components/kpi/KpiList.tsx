import Grid from '@mui/material/Grid';
import { KpiEfficiency } from './KpiEfficiency.tsx';
import { KpiInactivity } from './KpiInactivity.tsx';
import { KpiProductivity } from './KpiProductivity.tsx';

export const KpiList = () => {
  return (
    <Grid
      container
      size={12}
      spacing={1}
      sx={{ borderRadius: 6, overflow: 'hidden' }}
    >
      <KpiEfficiency />
      <KpiProductivity />
      <KpiInactivity />
      {/* <KpiShiftInfo /> */}
    </Grid>
  );
};
