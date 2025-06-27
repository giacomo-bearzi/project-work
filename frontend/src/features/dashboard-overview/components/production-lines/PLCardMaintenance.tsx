import { HandymanRounded } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CustomPaper } from '../../../../components/CustomPaper.tsx';

interface PLCardMaintenanceProps {
  lineId: 'line-1' | 'line-2' | 'line-3';
  lineName: string;
  maintenanceEnd: string;
  assignetAt: string;
  onClick?: () => void;
}

export const PLCardMaintenance = ({
  lineId,
  lineName,
  maintenanceEnd,
  assignetAt,
  onClick
}: PLCardMaintenanceProps) => {
  return (
    <Grid onClick={onClick} size={{ sm: 4, md: 4, lg: 12 }}>
      <CustomPaper
        sx={{
          p: 0,
          borderRadius: 5,
          height: "100%",
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.02)",
          },
        }}
      >
        <Grid
          container
          height={'100%'}
          width={'100%'}
          p={2}
          spacing={2}
        >
          <Grid size={3}>
            <Box
              component={'img'}
              src={`/${lineId}-background.svg`}
              sx={{
                height: '100%',
                objectFit: 'cover',
                borderRadius: 64,
              }}
            />
          </Grid>
          <Grid
            size={9}
            alignContent={'center'}
          >
            <Stack
              gap={4}
              alignItems={'center'}
              display={'flex'}
            >
              <Stack
                alignItems={'center'}
                display={'flex'}
                width={'100%'}
                gap={1}
              >
                <Typography
                  component={'span'}
                  fontWeight={500}
                  fontSize={'1.1rem'}
                  pl={1}
                >
                  {lineName}
                </Typography>
                <Chip
                  icon={
                    <HandymanRounded
                      fontSize="small"
                      color="inherit"
                    />
                  }
                  label={'MANUTENZIONE'}
                  sx={{
                    backgroundColor: '#D7730F',
                    fontWeight: 500,
                  }}
                />
              </Stack>
              <Stack
                alignItems={'center'}
                width={'100%'}
              >
                <Stack
                  display={'flex'}
                  flexDirection={'row'}
                  alignItems={'center'}
                >
                  <Typography
                    component={'span'}
                    pl={1}
                  >
                    Fine prevista
                  </Typography>
                  <Typography
                    component={'span'}
                    fontWeight={600}
                    pl={1}
                  >
                    {maintenanceEnd}
                  </Typography>
                </Stack>
                <Stack
                  display={'flex'}
                  flexDirection={'row'}
                  alignItems={'center'}
                >
                  <Typography
                    component={'span'}
                    pl={1}
                  >
                    Tecnico
                  </Typography>
                  <Typography
                    component={'span'}
                    fontWeight={600}
                    pl={1}
                  >
                    {assignetAt}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </CustomPaper>
    </Grid>
  );
};
