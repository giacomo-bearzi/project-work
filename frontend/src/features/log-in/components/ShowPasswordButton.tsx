import { VisibilityOffRounded, VisibilityRounded } from '@mui/icons-material';
import { IconButton } from '@mui/material';

interface ShowPasswordButtonProps {
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
}

export const ShowPasswordButton = ({
  showPassword,
  setShowPassword,
}: ShowPasswordButtonProps) => {
  // Variabile per gestire l'icona in base al valore di `showPassword`.
  const InputAdornmentIcon = showPassword ? (
    <VisibilityOffRounded />
  ) : (
    <VisibilityRounded />
  );

  const handleTogglePassword = () => {
    setShowPassword(true);
    setTimeout(() => setShowPassword(false), 5000);
  };

  return (
    <IconButton
      edge="end"
      aria-label="Mostra o nascondi password"
      onClick={handleTogglePassword}
    >
      {InputAdornmentIcon}
    </IconButton>
  );
};
