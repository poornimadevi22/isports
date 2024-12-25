"use client";
import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Image from "next/image";
import Logo from "../../public/LogoPng.png"; // Replace with your logo path
import Stack from "@mui/material/Stack";
import StyledMenu from "./Fields/menu"; // Ensure this path is correct
import { Button, SelectChangeEvent } from "@mui/material";
import NotificationBell from '../../public/notificationBell.svg'
import Menu from '../../public/menu.svg'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const HeaderAppBar: React.FC = () => {

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "white",
        color: "black",
        boxShadow: "none", // Remove shadow
        borderBottom: "1px solid #ddd", // Add subtle border at the bottom
      }}
    >
      <Toolbar sx={{ height: "64px" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          sx={{ width: "100%" }}
          spacing={5}
        >
          <StyledMenu />
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              color="inherit"
              aria-label="notifications"
              sx={{
                width: "42px",
                height: "42px",
                borderRadius: "4px",
                color: "#008B30",
                background: "#EDFFFC",
                border: "1px solid #9BE3BF",
                "&:hover": {
                  borderColor: "#21865B",
                },
                minWidth: "unset",
              }}
            >
              <NotificationBell width='22' height='22' />
            </Button>
            <Button
              color="inherit"
              aria-label="settings"
              sx={{
                width: "42px",
                height: "42px",
                borderRadius: "4px",
                color: "#26D07C",
                background: "#EDFFFC",
                border: "1px solid #9BE3BF",
                "&:hover": {
                  borderColor: "#21865B",
                },
                minWidth: "unset",
              }}
            >
              <SearchOutlinedIcon width='24' height='24' />
            </Button>
          </Stack>
        </Stack>
        <Box sx={{ paddingTop: 1 }}>
          <Image src={Logo} alt="Logo" width={130} height={47} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderAppBar;