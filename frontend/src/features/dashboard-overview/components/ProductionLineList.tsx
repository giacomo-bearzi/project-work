import Grid from '@mui/material/Grid';
import { CustomPaper } from '../../../components/CustomPaper.tsx';

export const ProductionLineList = () => {
  return (
    <Grid
      container
      size={{ sm: 12, md: 12, lg: 4 }}
      spacing={1}
    >
      <Grid size={{ sm: 4, md: 4, lg: 12 }}>
        <CustomPaper sx={{ p: 2, borderRadius: 8 }}>
          Linea produzione 1
        </CustomPaper>
      </Grid>
      <Grid size={{ sm: 4, md: 4, lg: 12 }}>
        <CustomPaper sx={{ p: 2, borderRadius: 8 }}>
          Linea produzione 2
        </CustomPaper>
      </Grid>
      <Grid size={{ sm: 4, md: 4, lg: 12 }}>
        <CustomPaper sx={{ p: 2, borderRadius: 8 }}>
          Linea produzione 3
        </CustomPaper>
      </Grid>
    </Grid>
  );
};
