import Grid from '@mui/material/Grid';

import { ErrorRounded } from '@mui/icons-material';
import { Chip } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CustomPaper } from '../../../../components/CustomPaper.tsx';
import { extractTime } from '../../../../utils/helpers.ts';
import type { ApiGetIssue } from '../../../issues/types/issuesTypes.ts';

interface PLCardIssueProps {
  lineId: 'line-1' | 'line-2' | 'line-3';
  lineName: string;
  issueCount: number;
  lastIssue?: ApiGetIssue;
  onClick?: () => void;
}

export const PLCardIssue = ({
  lineId,
  lineName,
  issueCount,
  lastIssue,
  onClick,
}: PLCardIssueProps) => {
  if (!lastIssue) return;

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
                <Typography
                  component={'span'}
                  fontWeight={500}
                  fontSize={'1.1rem'}
                  pl={1}
                  textAlign={'center'}
                >
                  {lineName}
                </Typography>
                <Chip
                  icon={<ErrorRounded color="inherit" />}
                  label={issueCount > 1 ? `${issueCount} PROBLEMI` : 'PROBLEMA'}
                  sx={{
                    backgroundColor: '#F35858',
                    fontWeight: 500,
                  }}
                />
              </Stack>
              <Stack alignItems={'center'} width={'100%'}>
                <Typography
                  component={'span'}
                  fontWeight={600}
                  textAlign={'center'}
                  sx={{ lineClamp: 1 }}
                >
                  {lastIssue?.description ?? ''}
                </Typography>
                <Stack display={'flex'} flexDirection={'row'} alignItems={'center'}>
                  <Typography component={'span'} pl={1}>
                    Segnalato alle
                  </Typography>
                  <Typography component={'span'} fontWeight={600} pl={1}>
                    {extractTime(lastIssue?.createdAt)}
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
