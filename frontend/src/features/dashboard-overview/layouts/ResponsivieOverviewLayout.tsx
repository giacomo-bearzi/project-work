import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { OverviewLayoutTablet } from './OverviewLayoutTablet';
import { OverviewLayoutDesktop } from './OverviewLayoutDesktop';

export const ResponsiveOverviewLayout = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  if (isTablet) return <OverviewLayoutTablet />;

  return <OverviewLayoutDesktop />;
};
