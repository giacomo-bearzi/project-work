import { Grid, Paper, Stack } from '@mui/material';

export const DashboardOverview = () => {
  return (
    <Grid
      container
      spacing={1}
      gridRow={2}
      sx={{
        height: '100%',
      }}
    >
      <Grid size={3}>
        <Paper
          elevation={1}
          sx={{
            borderRadius: 11,
            p: 1,
            background: 'rgba(255, 255, 255, 0.07)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            height: '100%',
            display: 'flex',
          }}
        ></Paper>
      </Grid>
      <Grid size={9}>
        <Stack
          gap={1}
          sx={{ height: '100%', display: 'flex' }}
        >
          <Paper
            elevation={1}
            sx={{
              borderRadius: 11,
              p: 1,
              background: 'rgba(255, 255, 255, 0.07)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
              height: '100%',
              display: 'flex',
            }}
          ></Paper>
          <Paper
            elevation={1}
            sx={{
              borderRadius: 11,
              p: 1,
              background: 'rgba(255, 255, 255, 0.07)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
              height: '100%',
              display: 'flex',
            }}
          ></Paper>
        </Stack>
      </Grid>
    </Grid>
  );
};
