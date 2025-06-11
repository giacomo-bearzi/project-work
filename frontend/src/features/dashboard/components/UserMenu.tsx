import {
  InboxRounded,
  KeyboardArrowDownRounded,
  NotificationsRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { ToggleThemeModeButton } from "../../theme/components/ToggleThemeModeButton";

export const UserMenu = () => {
  return (
    <Box gap={2} display={"flex"} alignItems={"center"}>
      <Box gap={1}>
        <IconButton>
          <InboxRounded />
        </IconButton>
        <IconButton>
          <Badge
            badgeContent={2}
            color="primary"
            overlap="circular"
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <NotificationsRounded />
          </Badge>
        </IconButton>
        <ToggleThemeModeButton />
      </Box>
      <Paper
        sx={{
          background: "rgba(255, 255, 255, 0.07)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          borderRadius: 8,
        }}
      >
        <Box
          p={1}
          gap={4}
          display={"flex"}
          alignItems={"center"}
          flexDirection={"row"}
        >
          <Box gap={2} display={"flex"} flexDirection={"row"}>
            <Avatar>G</Avatar>
            <Box flexDirection={"column"} display={"flex"}>
              <Typography
                component="span"
                variant="body2"
                sx={{ fontWeight: 600 }}
              >
                Giacomo Bearzi
              </Typography>
              <Typography
                component="span"
                variant="body2"
                sx={{ fontWeight: 500, opacity: "80%" }}
              >
                Operatore
              </Typography>
            </Box>
          </Box>
          <KeyboardArrowDownRounded />
        </Box>
      </Paper>
    </Box>
  );
};
