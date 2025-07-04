import { HandymanRounded } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CustomPaper } from '../../../../components/CustomPaper.tsx';
import { CustomAvatar } from '../../../dashboard/components/CustomAvatar.tsx';
import type { ApiUser } from '../../../dashboard-login/types/types.api.ts';

interface PLCardMaintenanceProps {
  lineId: 'line-1' | 'line-2' | 'line-3';
  lineName: string;
  maintenanceEnd?: string;
  assignedTo: ApiUser;
  onClick: () => void;
}

export const PLCardMaintenance = ({
  lineId,
  lineName,
  maintenanceEnd,
  assignedTo,
  onClick,
}: PLCardMaintenanceProps) => {
  let formattedMaintenanceEnd = '';

  if (maintenanceEnd) {
    formattedMaintenanceEnd = new Date(maintenanceEnd).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <Grid onClick={onClick} size={{ sm: 4, md: 4, lg: 12 }}>
      <CustomPaper
        elevation={2}
        sx={{
          p: 0,
          borderRadius: 5,
          cursor: 'pointer',
          height: '100%',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.01)',
          },
        }}
      >
        <Grid container height={'100%'} width={'100%'} p={2} spacing={2}>
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
          <Grid size={9} alignContent={'center'}>
            <Stack gap={4} alignItems={'center'} display={'flex'}>
              <Stack alignItems={'center'} display={'flex'} width={'100%'} gap={1}>
                <Typography component={'span'} fontWeight={500} fontSize={'1.1rem'} pl={1}>
                  {lineName}
                </Typography>
                <Chip
                  icon={<HandymanRounded fontSize="small" color="inherit" />}
                  label={'MANUTENZIONE'}
                  sx={{
                    backgroundColor: '#D7730F',
                    fontWeight: 500,
                  }}
                />
              </Stack>
              <Stack alignItems={'center'} width={'100%'} gap={1}>
                <Stack direction={'row'}>
                  <Typography component={'span'} pl={1}>
                    Fine prevista
                  </Typography>
                  <Typography component={'span'} fontWeight={600} pl={1}>
                    {formattedMaintenanceEnd}
                  </Typography>
                </Stack>
                <Stack direction={'row'}>
                  <CustomAvatar
                    size={'24px'}
                    role={assignedTo.role}
                    fullName={assignedTo.fullName}
                  />
                  <Typography component={'span'} fontWeight={500} pl={1}>
                    {assignedTo.fullName}
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
