import { Card, CardContent, Typography, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { animated, useSpring } from '@react-spring/web';
import type { LogPoint } from '../pages/LineDetails';

interface TemperatureAlertCardProps {
  temperatureLogs: LogPoint[];
  warnThreshold: number;
  machineName: string;
}

const TemperatureAlertCard = ({
  temperatureLogs,
  warnThreshold,
  machineName,
}: TemperatureAlertCardProps) => {
  const [exceedCount, setExceedCount] = useState(0);
  // const [exceedHistory, setExceedHistory] = useState<{timestamp: string; value: number}[]>([]);

  // Animazione del contatore
  const springProps = useSpring({
    from: { number: 0 },
    to: { number: exceedCount },
    reset: exceedCount > 0,
  });

  useEffect(() => {
    if (!temperatureLogs.length || !warnThreshold) return;

    // Calcola i superamenti
    const exceeds = temperatureLogs.filter((log) => log.value > warnThreshold);
    setExceedCount(exceeds.length);

    // Aggiorna lo storico
    // const newExceeds = exceeds.map(log => ({
    //   timestamp: log.timestamp,
    //   value: log.value
    // }));
    // setExceedHistory(prev => [...prev, ...newExceeds]);
  }, [temperatureLogs, warnThreshold]);

  return (
    <Card
      sx={{
        borderRadius: 11,
        p: 1,
        background: 'rgba(255, 165, 0, 0.1)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '4px solid #FFA500',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: exceedCount > 0 ? 'translateY(-5px)' : 'none',
          boxShadow:
            exceedCount > 0
              ? '0 10px 20px rgba(255, 165, 0, 0.2)'
              : '0 4px 30px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">
          Allarmi Temperatura
        </Typography>
        <Typography variant="h6" gutterBottom>
          {machineName}
        </Typography>

        <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
          <animated.div
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: exceedCount > 0 ? '#ff3d00' : 'inherit',
            }}
          >
            {springProps.number.to((n) => n.toFixed(0))}
          </animated.div>
          <Typography variant="body1" ml={1}>
            {exceedCount === 1 ? 'superamento' : 'superamenti'}
          </Typography>
        </Box>

        <Typography variant="caption" display="block" mt={2} color="text.secondary">
          Soglia warning: <strong>{warnThreshold}°C</strong>
        </Typography>

        {/* {exceedCount > 0 && (
          <Typography variant="caption" display="block" color="error" mt={1}>
            Attenzione: temperatura di warning superata!
          </Typography>
        )} */}
      </CardContent>
    </Card>
  );
};

export default TemperatureAlertCard;
