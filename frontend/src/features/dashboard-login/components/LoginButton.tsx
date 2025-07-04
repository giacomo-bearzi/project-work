import { Button, CircularProgress } from '@mui/material';

interface LoginButtonProps {
  isPending: boolean;
}

export const LoginButton = ({ isPending }: LoginButtonProps) => {
  return (
    <Button
      variant="contained"
      type="submit"
      sx={{
        borderRadius: '32px',
        position: 'relative',
        height: '42px',
        justifyContent: 'center',
      }}
      size="large"
      disabled={isPending}
    >
      {isPending ? (
        <CircularProgress size={24} color="inherit" sx={{ position: 'absolute' }} />
      ) : (
        'Accedi'
      )}
    </Button>
  );
};
