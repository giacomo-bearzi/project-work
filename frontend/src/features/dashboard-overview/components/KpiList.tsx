import Grid from '@mui/material/Grid';
import { CustomPaper } from '../../../components/CustomPaper.tsx';

export const KpiList = () => {
  return (
    <Grid
      container
      size={12}
      spacing={1}
    >
      <Grid size={4}>
        <CustomPaper sx={{ p: 2, borderRadius: 8 }}>
          Produttività oraria
        </CustomPaper>
      </Grid>
      <Grid size={4}>
        <CustomPaper sx={{ p: 2, borderRadius: 8 }}>
          Efficienza complessiva
        </CustomPaper>
      </Grid>
      <Grid size={4}>
        <CustomPaper sx={{ p: 2, borderRadius: 8 }}>
          Tempo di fermo macchine
        </CustomPaper>
      </Grid>
    </Grid>
  );
};
