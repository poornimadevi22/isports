"use client";
import React from "react";
import { Box, CssBaseline, Grid, List, ListItem, ListItemText } from "@mui/material";
import Link from "next/link";
import CustomCard from "@/components/CustomCard";
import { usePathname, useRouter } from "next/navigation";

const SubMenuLayout = ({ children }: { children: React.ReactNode }) => {
  const currentNav = usePathname();
  const router=useRouter()
  const moduleList = [
    { name: 'Overview', path: '/commander' },
    { name: 'Season Planner', path: '/commander/seasons' },
    { name: 'Competitions', path: '/commander/competitions' },
    { name: 'Teams/Departments', path: '/commander/departments' },
    { name: 'Reports', path: '/commander/reports' },
  ]
  const [selectedIndex, setSelectedIndex] = React.useState<string | null>("Overview");

  const handleListItemClick = (index: string, path: string) => {
    setSelectedIndex(index);
    router.push(`/tournaments/${path}`)
  };

  return (
    <Box>
      {" "}
      <CssBaseline />
      {currentNav && currentNav.includes("/view") ? (
        <Grid container>
          <Grid item xs={12} sm={12} md={12} xl={12}>
            <Box>{children}</Box>
          </Grid>
        </Grid>
      ) : (
        <Grid container >
          <Grid
            item
            xs={12}
            sm={3}
            md={2}
            xl={1.5}
            sx={{ backgroundColor: "white",borderRight:"1px solid rgba(255,255,255,1)" }}
            height={'86.5vh'}
          >
            <Box sx={{ display: "grid", width: "100%" }}>
              <List
                sx={{
                  maxHeight: "100%", // Set maxHeight to control when scrolling should occur
                  maxWidth: "100%", // Set maxHeight to control when scrolling should occur
                }}
              >
                {moduleList.map((text, index) => (
                  <ListItem
                    key={text.name}
                    onClick={() => handleListItemClick(text.name, text.path)}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#008755",
                        color: "white",
                      },
                      backgroundColor:
                        selectedIndex === text.name ? "#008755" : "inherit",
                      color: selectedIndex === text.name ? "white" : "inherit",
                      paddingTop: "5px",
                      paddingBottom: "5px",
                      cursor:'pointer'
                    }}
                  >
                    <ListItemText className="dubai-med" primary={text.name} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
          <Grid item xs={12} sm={9} md={10} xl={10.5}>
            <Box sx={{ paddingLeft: "5px" }}>{children}</Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default SubMenuLayout;