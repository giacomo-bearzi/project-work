// import { AccessTimeFilledRounded } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
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
    const date = now.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
    const time = now.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return { date, time };
  }, [now]);

  const { time } = formatted;

  return (
    <Stack display={'flex'} direction={'row'} alignItems={'center'}>
      <Typography
        component={'span'}
        fontSize={'1.15rem'}
        fontWeight={500}
        sx={{
          minWidth: 64,
        }}
      >
        {time}
      </Typography>
    </Stack>
  );
};
