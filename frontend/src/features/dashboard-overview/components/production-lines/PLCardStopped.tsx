import { StopRounded } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CustomPaper } from '../../../../components/CustomPaper.tsx';

interface PLCardStoppedProps {
  lineId: 'line-1' | 'line-2' | 'line-3';
  lineName: string;
  onClick?: () => void;
}

export const PLCardStopped = ({
  lineId,
  lineName,
  onClick,
}: PLCardStoppedProps) => {
  return (
    <Grid
      onClick={onClick}
      size={{ sm: 4, md: 4, lg: 12 }}
    >
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
                    <StopRounded
                      fontSize="small"
                      color="inherit"
                    />
                  }
                  label={'FERMA'}
                  sx={{
                    fontWeight: 500,
                  }}
                />
              </Stack>
              {/* <Skeleton
                variant="rectangular"
                width={'100%'}
                height={64}
                sx={{ borderRadius: 3 }}
              /> */}
            </Stack>
          </Grid>
        </Grid>
      </CustomPaper>
    </Grid>
  );
};
