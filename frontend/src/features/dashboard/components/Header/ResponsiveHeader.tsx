import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { HeaderDesktop } from './HeaderDesktop.tsx';
import { HeaderTablet } from './HeaderTablet.tsx';

export const ResponsiveHeader = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  if (isTablet) return <HeaderTablet />;

  return <HeaderDesktop />;
};
