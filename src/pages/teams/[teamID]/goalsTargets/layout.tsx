"use client";
import React from "react";
import { Box, CssBaseline, Grid } from "@mui/material";
import Link from "next/link";
import CustomCard from "@/components/CustomCard";
import { usePathname } from "next/navigation";

const SubMenuLayout = ({ children }: { children: React.ReactNode }) => {
  const currentNav = usePathname();
  return (
    <Box>
      {" "}
      <CssBaseline />
        <Grid container>
          <Grid
            item
            xs={12}
            sm={3}
            md={2}
            xl={1.75}
            sx={{ backgroundColor: "#f5f5f5" }}
          >
            {" "}
            <CustomCard path={'goalsTargets'} customSelect={"Goals & Targets"} />
          </Grid>
          <Grid item xs={12} sm={9} md={10} xl={10.25}>
            <Box sx={{ paddingLeft: "5px" }}>{children}</Box>
          </Grid>
        </Grid>
    </Box>
  );
};

export default SubMenuLayout;