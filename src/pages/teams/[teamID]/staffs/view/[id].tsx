"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import BasicBreadcrumbs from "@/components/breadcrumbs";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ViewPageNav from "@/components/nav/ViewPageNav";
import ProfileCard from "@/components/view/ProfileCard";
import axios from "axios";
import UploadDocuments from "@/components/view/UploadDocuments";
import ResultsAndAchievements from "@/components/view/ResultsAndAchievements";
import CalendarSection from "@/components/view/CalendarSection";
import Attachment from "@/interfaces/Attachment";
import CustomButton from "@/components/buttons/CustomButton";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import Image from "next/image";
import ViewBgImage from "../../../../../../public/viewBGImage.png";
import rightCurve from "../../../../../../public/rightCurve.png";
import leftCurve from "../../../../../../public/leftCurve.png";
import AssignedAthlete from "../../../../../../public/assignedAthlete.svg";
import NationalTeamAthletes from "../../../../../../public/nationalTeamAthletes.svg";
import FemaleAthletes from "../../../../../../public/femaleAthletes.svg";
import maleHero from "../../../../../../public/maleHero.png";
import femaleHero from "../../../../../../public/femaleHero.png";
import EditSVG from "../../../../../../public/EditSVG.svg";
import {
  Avatar,
  Button,
  CircularProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import SlideDialog from "@/components/SlideDialog";
import { editStaff } from "@/redux/slices/staff/staffEditSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getHeroImage, getLocalStorage } from "@/utils/helper";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import { isEmpty } from "lodash";
import _ from "lodash";
import { getSportsListAPI } from "@/redux/slices/sportsMenu/getSportsListSlice";

const ViewStaffs: React.FC = () => {
  const getSportID = getLocalStorage("sport");
  const breadcrumbRoutes = [
    {
      title: "Sports",
      route: `/teams/${getSportID}/staffs`,
      currentPage: false,
    },
    {
      title: "Staffs",
      route: `/teams/${getSportID}/staffs`,
      currentPage: false,
    },
    {
      title: "View",
      route: `/teams/${getSportID}/staffs/view`,
      currentPage: true,
    },
  ];
  const router = useRouter();
  const { id, teamID } = router.query;
  const staffID = id;
  const [section, setSection] = useState(0);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const staffEditList = useSelector((state: RootState) =>
    state.staffEdit.code === 200 && !isEmpty(state.staffEdit?.data[0])
      ? state.staffEdit?.data[0]
      : null
  );
  const staffEditLoading = useSelector((state: RootState) => state.staffEdit);
  const isEdit = useSelector((state: any) => {
    return state.ui.isUpdated;
  });
  const getSportList = useSelector((state: any) => {
    return state.getSportList;
  });

  useEffect(() => {
    const payload = {
      searchText: "",
    };
    dispatch(getSportsListAPI(payload));
  }, []);

  const postData = () => {
    const payload: any = {
      staffID: staffID,
      sportID: teamID,
    };
    dispatch(editStaff(payload));
  };

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (isEdit) {
      timeoutId = setTimeout(() => {
        postData();
        dispatch(isUpdatedFunc(false));
        setShowEditDialog(false);
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId); // Cleanup to prevent memory leaks
      }
    };
  }, [isEdit]);

  useEffect(() => {
    if (router.query.id) {
      postData();
    }
  }, [router.query.id]);

  useEffect(() => {
    if (!_.isEmpty(staffEditList)) {
      setAttachments(staffEditList?.attachmentList);
    }
  }, [staffEditList]);

  const toggleSection = (value: number) => {
    if (section == value) {
      setSection(0);
    } else {
      setSection(value);
    }
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    // Prevent the drawer from closing when the click away or backdrop event is triggered
    if (reason === "backdropClick") {
      return;
    }
    setShowEditDialog(false);
  };

  const teamsNames = getSportList && getSportList.data;
  const selOption: any = _.filter(teamsNames, (sport: any) => {
    if (sport.sportID && typeof sport.sportID !== "undefined") {
      const selectedSports = staffEditList?.sport
        ? staffEditList.sport.split(",").map((id: string) => id.trim())
        : [];
      return selectedSports.includes(sport.sportID.toString());
    }
  });

  const getStaffHeroImage = () => {
    return getHeroImage(staffEditList);
  };

  return (
    <>
      {showEditDialog && (
        <SlideDialog
          open={showEditDialog}
          id={staffEditList?.staffID}
          onClose={(event: any, reason: any) => handleClose(event, reason)}
          module={"staff"}
        // isView={isView}
        />
      )}
      {/* {staffEditLoading.loading ? (
        <Box
          display={"grid"}
          sx={{
            placeContent: "center",
            alignContent: "center",
            height: "78vh",
            backgroundColor: "#FFFFFF",
          }}
        >
          <CircularProgress sx={{ color: "#008755" }} size="40px" />
        </Box>
      ) : ( */}
      <Grid container spacing={2} p={1} paddingTop={1}>
        <Grid item xs={12} md={12}>
          <Box
            p={1.5}
            className="bg-white"
            borderRadius={1}
            display={"flex"}
            justifyContent={"space-between"}
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
        </Grid>
        <Grid item xs={12} md={12} height={"79vh"} overflow={"scroll"} pb={5}>
          <Grid
            item
            xs={12}
            md={12}
            position={"relative"}
            borderRadius={"10px"}
            sx={{
              backgroundImage:
                "linear-gradient(180deg, rgba(0, 135, 85, 1), rgba(0, 88, 68, 1))",
            }}
            height={"735px"}
          >
            <Image
              src={rightCurve}
              alt="Logo"
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                objectFit: "cover",
              }}
            />
            <Image
              src={leftCurve}
              alt="Logo"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                objectFit: "cover",
              }}
            />
            <Image
              src={ViewBgImage}
              alt="Logo"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <Typography
              variant="h1"
              position={"absolute"}
              top={"30px"}
              left={"196px"}
              color="#EBE8E3"
              className="dubai-med"
              sx={{
                fontSize: "169px",
                fontWeight: 500,
                opacity: "0.5",
              }}
            >
              {staffEditList?.role}
            </Typography>
            <Grid
              container
              alignItems={"end"}
              justifyContent={"space-between"}
              position={"absolute"}
              bottom={0}
            >
              <Grid item xs={4.5} px={3}>
                <Typography className="bukra view-overview tertiary-color">
                  2024 - 2025{" "}
                  <span style={{ fontSize: "20px" }}>(Current Season)</span>
                </Typography>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  mt={2}
                >
                  <Box width={"48%"} display={"flex"}>
                    <Box width={"44px"} height={"44px"}>
                      <AssignedAthlete width={"100%"} height={"100%"} />
                    </Box>
                    <Box ml={2}>
                      <Typography className="bukra overview-title tertiary-color">
                        0
                      </Typography>
                      <Typography className="dubai-med overview-subtitle tertiary-color">
                        Assigned Athletes
                      </Typography>
                    </Box>
                  </Box>
                  <Box width={"48%"} display={"flex"}>
                    <Box width={"44px"} height={"44px"}>
                      <NationalTeamAthletes width={"100%"} height={"100%"} />
                    </Box>
                    <Box ml={2}>
                      <Typography className="bukra overview-title tertiary-color">
                        0
                      </Typography>
                      <Typography className="dubai-med overview-subtitle tertiary-color">
                        National Team Athletes
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  mt={2}
                >
                  <Box width={"48%"} display={"flex"}>
                    <Box width={"44px"} height={"44px"}>
                      <AssignedAthlete width={"100%"} height={"100%"} />
                    </Box>
                    <Box ml={2}>
                      <Typography className="bukra overview-title tertiary-color">
                        0
                      </Typography>
                      <Typography className="dubai-med overview-subtitle tertiary-color">
                        Male Athletes
                      </Typography>
                    </Box>
                  </Box>
                  <Box width={"48%"} display={"flex"}>
                    <Box width={"44px"} height={"44px"}>
                      <FemaleAthletes width={"100%"} height={"100%"} />
                    </Box>
                    <Box ml={2}>
                      <Typography className="bukra overview-title tertiary-color">
                        0
                      </Typography>
                      <Typography className="dubai-med overview-subtitle tertiary-color">
                        Female Athletes
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box
                  p={2}
                  my={3}
                  borderRadius={"15px"}
                  width={"90%"}
                  sx={{
                    backgroundColor: "#009671",
                  }}
                >
                  <Typography
                    className="overview-table-head bukra"
                    color="#EBE8E3"
                  >
                    KPIs
                  </Typography>
                  <Box
                    mt={1}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    className="overview-table-head dubai-med"
                    color="#EBE8E3"
                  >
                    <Typography className="dubai-med overview-table-list">
                      Total Competitions
                    </Typography>
                    <Typography>0</Typography>
                  </Box>
                  <Box
                    mt={1}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    className="overview-table-head dubai-med"
                    color="#EBE8E3"
                  >
                    <Typography className="dubai-med overview-table-list">
                      Total Medals
                    </Typography>
                    <Typography>0</Typography>
                  </Box>
                  <Box
                    mt={1}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    className="overview-table-head dubai-med"
                    color="#EBE8E3"
                  >
                    <Typography className="dubai-med overview-table-list">
                      Training Session Conducted
                    </Typography>
                    <Typography>0</Typography>
                  </Box>
                  <Box
                    mt={1}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    className="overview-table-head dubai-med"
                    color="#EBE8E3"
                  >
                    <Typography className="dubai-med overview-table-list">
                      Training Session Availability
                    </Typography>
                    <Typography>0</Typography>
                  </Box>
                  <Box
                    mt={1}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    className="overview-table-head dubai-med"
                    color="#EBE8E3"
                  >
                    <Typography className="dubai-med overview-table-list">
                      Training Session Hours
                    </Typography>
                    <Typography>0</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box textAlign={"start"} display={"grid"}>
                  {getStaffHeroImage() !== "" ? (
                    <Image
                      src={getStaffHeroImage()}
                      alt={""}
                      width={363}
                      height={630}
                    />
                  ) : staffEditList?.gender ? (
                    <Image
                      src={
                        staffEditList?.gender === "female"
                          ? femaleHero
                          : maleHero
                      }
                      alt={""}
                      width={363}
                      height={630}
                    />
                  ) : (
                    ""
                  )}
                </Box>
              </Grid>
              <Grid item xs={4} px={3}>
                <Box display={"flex"} alignItems={"center"}>
                  <Avatar
                    alt="Avatar"
                    src={staffEditList?.profileImage}
                    style={{
                      width: 136,
                      height: 136,
                      border: "2px solid #FFFFFF",
                    }}
                  />
                  <CustomButton
                    sx={{
                      ml: 2,
                      backgroundColor: "#FFFFFF",
                      borderColor: "#FFFFFF",
                    }}
                    label="Edit"
                    variant="outlined"
                    size="small"
                    ButtonIcon={EditSVG}
                    iconPosition="start"
                    onClick={() => setShowEditDialog(true)}
                  />
                </Box>
                <Typography
                  mt={2}
                  className="bukra tertiary-color view-rank text-capitalize"
                >
                  {staffEditList?.rankOrGrade}
                </Typography>
                <Typography
                  mt={0.5}
                  className="bukra tertiary-color view-name text-capitalize"
                >
                  {staffEditList
                    ? `${staffEditList?.firstName} ${staffEditList?.middleName} ${staffEditList?.surname}`
                    : ""}
                </Typography>
                {!_.isEmpty(selOption) ? (
                  <Tooltip
                    title={
                      selOption &&
                      Array.isArray(selOption) &&
                      selOption?.map((item: any, index: any) => {
                        return (
                          <>
                            {item.sportName}
                            {index !== selOption.length - 1 && ", "}
                          </>
                        );
                      })
                    }
                    sx={{ fontSize: '9px' }}
                  >
                    <Box
                      // component={'span'}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.12)",
                        fontSize: "18px",
                        fontWeight: "500",
                        color: "#FFFFFF",
                        borderRadius: "8px",
                        p: 1,
                        px: 2,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        cursor: 'pointer'
                      }}
                      className="bukra text-capitalize"
                    >
                      {selOption &&
                        Array.isArray(selOption) &&
                        selOption?.map((item: any, index: any) => {
                          return (
                            <>
                              {item.sportName}
                              {index !== selOption.length - 1 && ", "}
                            </>
                          );
                        })}
                    </Box>
                  </Tooltip>
                ) : (
                  <>&nbsp;</>
                )}
                <Box
                  sx={{ border: "1px solid #FFFFFF", borderRadius: "15px" }}
                  p={1.5}
                  mt={2}
                >
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    mt={2}
                    width={"100%"}
                  >
                    <Box
                      width={"48%"}
                      display={"flex"}
                      className="tertiary-color"
                    >
                      <Typography className="view-table-list-head dubai-med">
                        Gender:
                      </Typography>
                      <Typography
                        className="view-table-list-data text-capitalize dubai-med text-capitalize"
                        ml={1}
                      >
                        {staffEditList?.gender}
                      </Typography>
                    </Box>
                    <Box
                      width={"48%"}
                      display={"flex"}
                      className="tertiary-color"
                    >
                      <Typography className="view-table-list-head dubai-med">
                        Age:
                      </Typography>
                      <Typography
                        className="view-table-list-data text-capitalize dubai-med"
                        ml={1}
                      >
                        {staffEditList?.age}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    mt={1}
                    width={"100%"}
                  >
                    <Box
                      width={"48%"}
                      display={"flex"}
                      className="tertiary-color"
                    >
                      <Typography className="view-table-list-head dubai-med">
                        DOB:
                      </Typography>
                      <Typography
                        className="view-table-list-data text-capitalize dubai-med"
                        ml={1}
                      >
                        {staffEditList?.dob}
                      </Typography>
                    </Box>
                    <Box
                      width={"48%"}
                      display={"flex"}
                      className="tertiary-color"
                    >
                      <Typography className="view-table-list-head dubai-med">
                        Nationality:
                      </Typography>
                      <Typography
                        className="view-table-list-data text-capitalize dubai-med text-capitalize"
                        ml={1}
                      >
                        {staffEditList?.nationality}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    mt={1}
                    width={"100%"}
                  >
                    <Box
                      width={"100%"}
                      display={"flex"}
                      className="tertiary-color"
                    >
                      <Typography className="view-table-list-head dubai-med">
                        Federation License:
                      </Typography>
                      <Typography
                        className="view-table-list-data text-capitalize dubai-med text-capitalize"
                        ml={1}
                      >
                        {staffEditList?.federationLicence}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    mt={1}
                    width={"100%"}
                  >
                    <Box
                      width={"100%"}
                      display={"flex"}
                      className="tertiary-color"
                    >
                      <Typography className="view-table-list-head dubai-med">
                        Department:
                      </Typography>
                      <Typography
                        className="view-table-list-data text-capitalize dubai-med text-capitalize
                        "
                        ml={1}
                      >
                        {staffEditList?.department}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box
                  p={1.5}
                  my={3}
                  borderRadius={"15px"}
                  width={"100%"}
                  sx={{
                    backgroundColor: "#009671",
                  }}
                >
                  <Box
                    mt={1}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    className="overview-table-head dubai-med"
                    color="#EBE8E3"
                  >
                    <Box
                      textAlign={"center"}
                      borderRight={"1px solid #FFFFFF"}
                      width={"50%"}
                    >
                      <Typography className="view-table-list-head tertiary-color dubai-med">
                        Highest Certification
                      </Typography>
                      <Typography className="view-table-list-data tertiary-color dubai-med">
                        {staffEditList?.coachingCertifications
                          ? staffEditList?.coachingCertifications
                          : "---"}
                      </Typography>
                    </Box>
                    <Box textAlign={"center"} width={"50%"}>
                      <Typography className="view-table-list-head tertiary-color dubai-med">
                        Source
                      </Typography>
                      <Typography className="view-table-list-data tertiary-color dubai-med">
                        Dubai Police
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={9}>
              <Box width={"100%"}>
                {section !== 1 && (
                  <ViewPageNav
                    label="Results & Achievements"
                    expanded={section == 1}
                    onClick={() => toggleSection(1)}
                  />
                )}
                {section == 1 ? (
                  <ResultsAndAchievements
                    label="Results & Achievements"
                    expanded={section == 1}
                    onClick={() => toggleSection(1)}
                  />
                ) : null}
                {section !== 2 && (
                  <ViewPageNav
                    label="Training & Competition Calendar"
                    expanded={section == 2}
                    onClick={() => toggleSection(2)}
                  />
                )}
                {section == 2 && (
                  <CalendarSection
                    label="Training & Competition Calendar"
                    expanded={section == 2}
                    onClick={() => toggleSection(2)}
                  />
                )}
                {section !== 3 && (
                  <ViewPageNav
                    label="Uploaded Documents"
                    expanded={section == 3}
                    onClick={() => toggleSection(3)}
                  />
                )}
                {section == 3 ? (
                  <UploadDocuments
                    module="staff"
                    label="Uploaded Documents"
                    expanded={section == 3}
                    attachmentList={attachments}
                    onClick={() => toggleSection(3)}
                    onFileChange={() => postData()}
                  />
                ) : null}
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <ProfileCard data={staffEditList} module="staff" id={id} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* )} */}
    </>
  );
};

export default ViewStaffs;