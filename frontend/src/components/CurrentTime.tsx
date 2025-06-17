import { AccessTimeRounded } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

export const CurrentTime = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatted = useMemo(() => {
    const time = now.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return time;
  }, [now]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <AccessTimeRounded sx={{ fontSize: '1.3rem' }} />
      <Typography
        component={'span'}
        variant="h6"
        fontWeight={500}
      >
        {formatted}
      </Typography>
    </Box>
  );
};
