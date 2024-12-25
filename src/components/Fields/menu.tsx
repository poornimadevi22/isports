import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import Cookies from 'js-cookie'; 
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box, Stack, Typography } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useRouter } from 'next/navigation';
import { unsetLocalStorage } from "@/utils/helper";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: "rgb(55, 65, 81)",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.grey[300],
    }),
  },
}));

export default function CustomizedMenus() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    router.push('/profile');
    setAnchorEl(null);
  }

  const handleSetting = () => {
    router.push('/settings');
    setAnchorEl(null);
  }

  const handleLogout = () => {
    unsetLocalStorage("token")
    router.push('/login');
  }

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="outlined"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{border:'none'}}
        className="text-capitalize"
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <AccountCircle sx={{ width: "48px", height: "48px" }} />
          <Stack direction="column" alignItems="flex-start">
            <Typography
              variant="body1"
              component="div"
              color="primary"
              sx={{ fontWeight: "bold" }}
              className="app-bar-menu-name bukra"
            >
              Dubai Police
            </Typography>
            <Typography variant="body2" component="div" color="secondary" className="app-bar-menu-role dubai-med">
              Admin
            </Typography>
          </Stack>
        </Stack>
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className="dubai-med profile-menu"
      >
        <Box position={'relative'} px={2} py={1} className='bg-primary tertiary-color'>
          {/* <Box position={'absolute'} top={'-100px'} className="ctas"></Box> */}
          Welcome!
        </Box>
        <MenuItem onClick={handleProfile} disableRipple className="menu-button dubai-med secondary-color appbar-menu-list">
          <PersonOutlineOutlinedIcon />
          My Profile
        </MenuItem>
        <MenuItem onClick={handleSetting} disableRipple className="menu-button dubai-med secondary-color appbar-menu-list">
          <SettingsOutlinedIcon />
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout} disableRipple className="menu-button dubai-med secondary-color appbar-menu-list">
          <LogoutOutlinedIcon />
          Logout
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
