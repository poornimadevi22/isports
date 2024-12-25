"use client";
import BasicBreadcrumbs from "@/components/breadcrumbs";
import { Box } from "@mui/material";
import React from "react";
import { useRouter } from "next/navigation";
import SubMenuLayout from "./layout";
import CustomButton from "@/components/buttons/CustomButton";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";

function Page() {
  const router=useRouter()
  const breadcrumbRoutes = [
    {
      title: "Dashboard",
      route: `/dashboard`,
      currentPage: false,
    },
    {
      title: "Internal Races & Tournaments",
      route: `/tournaments`,
      currentPage: false,
    },
    {
      title: "Commander's Shield",
      route: `/tournaments/commander`,
      currentPage: true,
    },
  ];

  return (
    <>
      <Box
        p={1.5}
        className="bg-white"
        borderRadius={1}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={'center'}
      >
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
        <CustomButton
          sx={{
            borderRadius: "28px",
            backgroundColor: "rgba(0, 135, 85, 0.1)",
          }}
          label="Back"
          variant="outlined"
          size="small"
          ButtonIcon={KeyboardArrowLeftOutlinedIcon}
          iconPosition="start"
          onClick={() => router.back()}
        />
      </Box>
    </>
  );
}
Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;