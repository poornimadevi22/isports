"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import BasicBreadcrumbs from "@/components/breadcrumbs";
import _ from "lodash";
import SubMenuLayout from "../layout";
import LongTermGoals from "./longTermGoals";
import { usePathname } from "next/navigation";

const AddGoalsTargets = () => {
  const currentNav = usePathname();
  const teamId = currentNav?.split("/")[2];
  const breadcrumbRoutes = [
    {
      title: "Teams",
      route: `/teams/${teamId}/goalsTargets`,
      currentPage: false,
    },
    {
      title: "Goals & Targets",
      route: `/teams/${teamId}/goalsTargets/addGoalsTargets`,
      currentPage: true,
    }
  ];

  return (
    <>
      <Box p={1} className="bg-white" borderRadius={1}>
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
      </Box>
      <Grid container spacing={2} mt={0.2}>
        <Grid item xs={12}>
        <Box className="bg-white" borderRadius={1}>
          <Box p={2}>
            <Box>
              <Typography
                sx={{
                  fontFamily: "29LT Bukra",
                  fontSize: "18px",
                  fontWeight: 600,
                  lineHeight: "19.2px",
                  textAlign: "left",
                }}
              >
                Create Individual Goals
              </Typography>
            </Box>
          </Box>
          <Divider />
        </Box>
          <Box 
          className="bg-white" 
          borderRadius={1}
          sx={{ width: "100%", height: "73vh", overflow: "scroll" }}
          >
            <LongTermGoals teamId={teamId} />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
AddGoalsTargets.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default AddGoalsTargets;