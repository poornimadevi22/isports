"use client";
import React, { useState } from "react";
import { useRouter } from 'next/router';
import BasicBreadcrumbs from "@/components/breadcrumbs";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import GoalCard from "../reUseSelect";
import { GOALSANDTARGETS } from "@/utils/constants";
import SubMenuLayout from "../layout";
import ViewCard from "./viewGoalsTargets";
import { getLocalStorage } from "@/utils/helper";

const ViewGoalsTargets = () => {
  const getCurrentSport = getLocalStorage('sport')
  const breadcrumbRoutes = [
    {
      title: "Sports",
      route: `/teams/${getCurrentSport}/goalsTargets`,
      currentPage: false,
    },
    {
      title: "GoalsTargets",
      route: `/teams/${getCurrentSport}/goalsTargets`,
      currentPage: false,
    },
    {
      title: "View",
      route: `/teams/${getCurrentSport}/goalsTargets/view`,
      currentPage: true,
    },
  ];
  
  const router = useRouter();
  const { id } = router.query;
  const staffID = id;
  const [selectedValue, setSelectedValue] = useState("");
  const handleClick = (goalName: any) => {
    setSelectedValue(goalName);
  };


  return (
    <>
      <Grid container>
        <Grid item xs={12} md={12} sx={{ width: "100%", }} overflow={'scroll'}>
          <Box p={1.5} className="bg-white" borderRadius={1}>
            <BasicBreadcrumbs routes={breadcrumbRoutes} />
          </Box>
        </Grid>
        <Grid item xs={12} sx={{ height: "80vh", overflow: 'auto' }}>
          <ViewCard />
        </Grid>
      </Grid>
    </>
  );
};
ViewGoalsTargets.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default ViewGoalsTargets;