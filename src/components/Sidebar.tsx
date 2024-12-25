"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import Dashboard from "../../public/dashboard.svg";
import Results from "../../public/results.svg";
import Calendar from "../../public/calendar.svg";
import Tournment from "../../public/tournment.svg";
import Program from "../../public/program.svg";
import News from "../../public/news.svg";
import Teams from "../../public/teams.svg";
import Rules from "../../public/rules.svg";
import Menu from "../../public/menu.svg";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { handleSubMenu } from "@/redux/slices/appSplice";
import { fetchRoles } from "@/redux/slices/settingSlice/roleSlice/roleSlice";
import { getLocalStorage, removeLocalStorage } from "@/utils/helper";
import { getSportsListAPI } from "@/redux/slices/sportsMenu/getSportsListSlice";
import CustomCard from "./SubMenuOpen";

const drawerWidth = 105; // Width based on icon size

interface MenuItem {
  text: string;
  icon: any;
  path: string;
}

const Sidebar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const getSportID = getLocalStorage("sport");
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(true);

  const handleMenu = (menu:any) =>{
    if(menu.text !== 'Sports'){
      router.push(menu.path)
    }
    // router.push(`/teams/${getSportID}/staffs`)
    if(menu.text === 'Sports'){
  dispatch(handleSubMenu(true));
}
  }
  useEffect(()=>{
if(pathname !== `/teams/${getSportID}/staffs`){
removeLocalStorage('staffSelectedFilters');
}
  },[pathname])

  useEffect(() => {
    const param: any = {
      moduleName: "staff",
    };
    const getSportpayload = {
      searchText: "",
    };
    dispatch(getSportsListAPI(getSportpayload));
    dispatch(fetchRoles(param));
  }, []);

  const menuItems: MenuItem[] = [
    { text: "Dashboard", icon: Dashboard, path: "/dashboard" },
    { text: "Sports", icon: Teams, path: `/teams/${getSportID}/staffs` },
    { text: "Latest Results", icon: Results, path: "/latest-results" },
    {
      text: "Competition Calendar",
      icon: Calendar,
      path: "/competition-calendar",
    },
    {
      text: "Internal Races & Tournaments",
      icon: Tournment,
      path: "/tournaments",
    },
    { text: "Programs", icon: Program, path: "/programs" },
    { text: "Rules & Agreements", icon: Rules, path: "/rules" },
    { text: "News", icon: News, path: "/news" },
    { text: "Others", icon: Menu, path: "/others" },
  ];

  const toggleDrawer = (): void => {
    setDrawerOpen((prev) => !prev);
  };


  return (
    <Box sx={{ display: "flex" }}>
      <CustomCard path={'staffs'} customSelect={"Staffs"} />
      <Drawer
        variant="permanent"
        anchor="left"
        open={isDrawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "background.default",
            transition: "width 0.3s",
          },
        }}
      >
        <List sx={{ py: 0 }}>
          <ListItem
            // button
            onClick={toggleDrawer}
            sx={{ justifyContent: "center", flexDirection: "column" }}
          >
            <ListItemIcon
              sx={{
                minWidth: "unset",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                color: "#008B30",
                background: "#EDFFFC",
                border: "1px solid #EEEEEE",
                marginBottom: "15px",
                "&:hover": {
                  background: "#21865B",
                  color: "#fff",
                },
              }}
            >
              <MenuIcon />
            </ListItemIcon>
          </ListItem>
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              onClick={()=>handleMenu(item)}
              // onClick={() => router.push(item.path)}
              sx={{
                justifyContent: "center",
                flexDirection: "column",
                cursor: "pointer",
                px: 0.5,
                borderTop: item.text==="Others" ? "1px solid #D1D1D1" : '0'
              }}
              component="div" // Specify the component prop here
            >
              <ListItemIcon
                className={
                  pathname === item?.path
                    ? "icon-path"
                    : item?.path?.includes("/teams") &&
                      pathname?.includes("/teams")
                    ? "icon-path"
                    : ""
                }
                sx={{
                  minWidth: "unset",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "46px",
                  height: "46px",
                  borderRadius: "4px",
                  mt: item.text==="Others" ? 1 : 0,
                  color:
                    pathname === item?.path
                      ? "#fff"
                      : item?.path.includes("/teams") &&
                        pathname?.includes("/teams")
                      ? "#fff"
                      : "#008755",
                  background:
                    pathname === item?.path
                      ? "#008755"
                      : item?.path.includes("/teams") &&
                        pathname?.includes("/teams")
                      ? "#008755"
                      : "#EDFFFC",
                  border:
                    pathname === item?.path
                      ? "1px solid #21865B"
                      : item?.path?.includes("/teams") &&
                        pathname?.includes("/teams")
                      ? "1px solid #21865B"
                      : "1px solid #fff",
                  "&:hover": {
                    borderColor: "#008755",
                  },
                }}
              >
                <item.icon width={22} height={22} />
              </ListItemIcon>
              <Typography
                sx={{
                  mt: 1,
                  color: pathname === item.path ? "#008755" : "#58585B",
                  textAlign: "center",
                  "&:hover": {
                    color: "#008755",
                  },
                }}
                className="side-menu-name dubai-med"
              >
                {item.text}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;