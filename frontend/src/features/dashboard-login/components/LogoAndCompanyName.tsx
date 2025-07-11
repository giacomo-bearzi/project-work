import { Box, Typography } from '@mui/material';

export const LogoAndCompanyName = () => {
  return (
    <Box display="flex" gap={1} alignItems="center" alignContent="start">
      <img src="/logo.png" alt="Logo TechManufacturing S.p.A." className="max-h-6" />
      <Typography component="h1" variant="body2" sx={{ fontWeight: 600 }}>
        Tech Manufacturing S.p.A.
      </Typography>
    </Box>
  );
};
