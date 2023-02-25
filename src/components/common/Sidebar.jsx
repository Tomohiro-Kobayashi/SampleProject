import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import menuConfigs from "../../configs/menu.configs";
import Logo from "./Logo";
import uiConfigs from "../../configs/ui.configs";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import { setThemeMode } from "../../redux/features/themeModeSlice";
import { Stack } from "@mui/system";
import { Link } from "react-router-dom";
import { themeModes } from "../../configs/theme.configs";

const Sidebar = ({ open, toggleSidebar }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { appState } = useSelector((state) => state.appState);
  const { themeMode } = useSelector((state) => state.themeMode);

  const sidebarWidth = uiConfigs.size.sidebarWidth;

  const onSwitchTheme = () => {
    const theme =
      themeMode === themeModes.dark ? themeModes.light : themeModes.dark;
    dispatch(setThemeMode(theme));
  };

  const drawer = (
    <>
      <Toolbar sx={{ paddingY: "20px", color: "text.primary" }}>
        <Stack>
          <Logo />
        </Stack>
      </Toolbar>
      <List sx={{ paddingX: "30px" }}>
        <Typography variant="h6" marginBottom="20px">
          MENU
        </Typography>
        {menuConfigs.main.map((item, index) => (
          <ListItemButton
            key={index}
            sx={{
              borderRadius: "10px",
              marginY: 1,
              backgroundColor: appState.includes(item.state)
                ? "primary.main"
                : "unset",
            }}
            component={Link}
            to={item.path}
            onClick={() => toggleSidebar()}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText
              disableTypography
              primary={
                <Typography textTransform="uppercase">
                  {item.display}
                </Typography>
              }
            />
          </ListItemButton>
        ))}

        {user && (
          <>
            <Typography variant="h6" marginBottom="20px">
              PERSONAL
            </Typography>
            {menuConfigs.main.map((item, index) => (
              <ListItemButton
                key={index}
                sx={{
                  borderRadius: "10px",
                  marginY: 1,
                  backgroundColor: appState.includes(item.state)
                    ? "primary.main"
                    : "unset",
                }}
                component={Link}
                to={item.path}
                onClick={() => toggleSidebar()}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography textTransform="uppercase">
                      {item.display}
                    </Typography>
                  }
                />
              </ListItemButton>
            ))}
          </>
        )}
      </List>
    </>
  );
  return (
    <>
      <Drawer
        open={open}
        onClose={() => toggleSidebar(false)}
        sx={{
          "& .MuiDrawer-Paper": {
            boxSizing: "border-box",
            width: sidebarWidth,
            borderRight: "0px",
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Sidebar;
