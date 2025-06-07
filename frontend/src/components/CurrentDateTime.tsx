import { CalendarMonthRounded } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

export const CurrentDateTime = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatted = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const time = now.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const capitalizedDate = formatter
      .format(now)
      .replace(/^\w/, (c) => c.toUpperCase());

    return `${capitalizedDate} - ${time}`;
  }, [now]);

  return (
    <Box
      display="flex"
      alignItems={'center'}
      gap={1}
    >
      <CalendarMonthRounded fontSize="small" />
      <Typography variant="body1">{formatted}</Typography>
    </Box>
  );
};
