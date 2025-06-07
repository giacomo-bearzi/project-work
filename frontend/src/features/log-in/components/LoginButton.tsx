import { Button } from '@mui/material';

interface LoginButtonProps {
  isPending: boolean;
}

export const LoginButton = ({ isPending }: LoginButtonProps) => {
  if (isPending) {
    return (
      <Button
        variant="contained"
        type="submit"
        sx={{ borderRadius: '32px' }}
        loading
        size="large"
      >
        Accedi
      </Button>
    );
  }

  return (
    <Button
      variant="contained"
      type="submit"
      sx={{ borderRadius: '32px' }}
      size="large"
    >
      Accedi
    </Button>
  );
};
