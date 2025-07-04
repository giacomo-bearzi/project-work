import { VisibilityOffRounded, VisibilityRounded } from '@mui/icons-material';
import { IconButton } from '@mui/material';

interface ShowPasswordButtonProps {
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
}

export const ShowPasswordButton = ({ showPassword, setShowPassword }: ShowPasswordButtonProps) => {
  // Variabile per gestire l'icona in base al valore di `showPassword`.
  const InputAdornmentIcon = showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />;

  return (
    <IconButton
      edge="end"
      aria-label="Mostra o nascondi password"
      onMouseDown={() => setShowPassword(true)}
      onMouseUp={() => setShowPassword(false)}
      onMouseLeave={() => setShowPassword(false)}
    >
      {InputAdornmentIcon}
    </IconButton>
  );
};
