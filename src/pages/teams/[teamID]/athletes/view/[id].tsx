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
import MedicalCheckCard from "@/components/view/MedicalCheckCard";
import SuggestedNutrition from "@/components/view/SuggestedNutrition";
import Attachment from "@/interfaces/Attachment";
import SlideDialog from "@/components/SlideDialog";
import CustomButton from "@/components/buttons/CustomButton";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import Image from "next/image";
import rightCurve from "../../../../../../public/rightCurve.png";
import leftCurve from "../../../../../../public/leftCurve.png";
import ViewBgImage from "../../../../../../public/viewBGImage.png";
import Totalcompetition from "../../../../../../public/Totalcompetition.svg";
import TotalMedals from "../../../../../../public/TotalMedals.svg";
import TrainingAvailability from "../../../../../../public/TrainingAvailability.svg";
import TrainingHours from "../../../../../../public/TrainingHours.svg";
import TopScorer from "../../../../../../public/TopScorer.svg";
import EditSVG from "../../../../../../public/EditSVG.svg";
import maleHero from "../../../../../../public/maleHero.png";
import femaleHero from "../../../../../../public/femaleHero.png";
import { Avatar, LinearProgress, Tooltip, Typography } from "@mui/material";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import _, { isEmpty } from "lodash";
import { editAthlete } from "@/redux/slices/athlete/athleteEditSlice";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MedicalHistoryCard from "@/components/view/MedicalHistoryCard";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import { getHeroImage } from "@/utils/helper";

const ViewStaffs: React.FC = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const athleteData = useSelector((state: RootState) =>
    state.athleteEdit.code === 200 && !isEmpty(state.athleteEdit?.data[0])
      ? state.athleteEdit?.data[0]
      : null
  );
  const { id, teamID } = router.query;
  const athleteID = id;
  const isEdit = useSelector((state: any) => {
    return state.ui.isUpdated;
  });
  const [section, setSection] = useState(0);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const breadcrumbRoutes = [
    {
      title: "Sports",
      route: `/teams/${teamID}/athletes`,
      currentPage: false,
    },
    {
      title: "Athletes",
      route: `/teams/${teamID}/athletes`,
      currentPage: false,
    },
    {
      title: "View Athlete",
      route: `/teams/${teamID}/athletes/view/${athleteID}`,
      currentPage: true,
    },
  ];

  const postData = async () => {
    const payload: any = {
      athleteID: athleteID,
      sportID: teamID,
    };
    dispatch(editAthlete(payload));
  };

  useEffect(() => {
    if (router.query.id) {
      postData();
    }
  }, [router.query.id]);

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

  const toggleSection = (value: number) => {
    if (section == value) {
      setSection(0);
    } else {
      setSection(value);
    }
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    setShowEditDialog(false);
  };

  const getAthleteHeroImage = () => {
    return getHeroImage(athleteData);
  };

  return (
    <>
      {showEditDialog && (
        <SlideDialog
          open={showEditDialog}
          id={Number(athleteID)}
          onClose={(event: any, reason: any) => handleClose(event, reason)}
          module={"athlete"}
        />
      )}
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
            <Grid
              container
              alignItems={"end"}
              justifyContent={"space-between"}
              position={"absolute"}
              bottom={0}
            >
              <Grid item xs={4.5} px={3}>
                <Typography className="bukra view-overview tertiary-color">
                  Overview
                </Typography>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  mt={2}
                >
                  <Box width={"48%"} display={"flex"}>
                    <Box width={"44px"} height={"44px"}>
                      <Totalcompetition width={"100%"} height={"100%"} />
                    </Box>
                    <Box ml={2}>
                      <Typography className="bukra overview-title tertiary-color">
                        0
                      </Typography>
                      <Typography className="dubai-med overview-subtitle tertiary-color">
                        Total competition
                      </Typography>
                    </Box>
                  </Box>
                  <Box width={"48%"} display={"flex"}>
                    <Box width={"44px"} height={"44px"}>
                      <TotalMedals width={"100%"} height={"100%"} />
                    </Box>
                    <Box ml={2}>
                      <Typography className="bukra overview-title tertiary-color">
                        0
                      </Typography>
                      <Typography className="dubai-med overview-subtitle tertiary-color">
                        Total Medals
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
                      <TrainingAvailability width={"100%"} height={"100%"} />
                    </Box>
                    <Box ml={2}>
                      <Typography className="bukra overview-title tertiary-color">
                        0
                      </Typography>
                      <Typography className="dubai-med overview-subtitle tertiary-color">
                        Training Availability
                      </Typography>
                    </Box>
                  </Box>
                  <Box width={"48%"} display={"flex"}>
                    <Box width={"44px"} height={"44px"}>
                      <TrainingHours width={"100%"} height={"100%"} />
                    </Box>
                    <Box ml={2}>
                      <Typography className="bukra overview-title tertiary-color">
                        0
                      </Typography>
                      <Typography className="dubai-med overview-subtitle tertiary-color">
                        Training Hours
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
                  display={"flex"}
                  alignItems={"center"}
                >
                  <TopScorer width={"24px"} height={"24px"} />
                  <Typography
                    className="bukra overview-title tertiary-color"
                    sx={{ ml: 1 }}
                  >
                    “{athleteData?.resultsAndAchievements}”
                  </Typography>
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
                      Strength
                    </Typography>
                    <Typography>1</Typography>
                  </Box>
                  <Box m={1.5} display={"flex"} gap={0.5}>
                    {[1, 2, 3].map((header, value) => (
                      <LinearProgress
                        key={header}
                        variant="determinate"
                        value={value < 1 ? 100 : 0}
                        sx={{
                          color: "#F1EB9C",
                          height: "8px",
                          width: "33.3%",
                          borderTopRightRadius: header === 3 ? "3px" : 0,
                          borderBottomRightRadius: header === 3 ? "3px" : 0,
                          borderTopLeftRadius: header === 1 ? "3px" : 0,
                          borderBottomLeftRadius: header === 1 ? "3px" : 0,
                        }}
                        className="linear-progress"
                      />
                    ))}
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
                      Endurance
                    </Typography>
                    <Typography>3</Typography>
                  </Box>
                  <Box m={1.5} display={"flex"} gap={0.5}>
                    {[1, 2, 3].map((header, value) => (
                      <LinearProgress
                        key={header}
                        variant="determinate"
                        value={value < 3 ? 100 : 0}
                        sx={{
                          color: "#F1EB9C",
                          height: "8px",
                          width: "33.3%",
                          borderTopRightRadius: header === 3 ? "3px" : 0,
                          borderBottomRightRadius: header === 3 ? "3px" : 0,
                          borderTopLeftRadius: header === 1 ? "3px" : 0,
                          borderBottomLeftRadius: header === 1 ? "3px" : 0,
                        }}
                        className="linear-progress"
                      />
                    ))}
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
                      Speed
                    </Typography>
                    <Typography>2</Typography>
                  </Box>
                  <Box m={1.5} display={"flex"} gap={0.5}>
                    {[1, 2, 3].map((header, value) => (
                      <LinearProgress
                        key={header}
                        variant="determinate"
                        value={value < 2 ? 100 : 0}
                        sx={{
                          color: "#F1EB9C",
                          height: "8px",
                          width: "33.3%",
                          borderTopRightRadius: header === 3 ? "3px" : 0,
                          borderBottomRightRadius: header === 3 ? "3px" : 0,
                          borderTopLeftRadius: header === 1 ? "3px" : 0,
                          borderBottomLeftRadius: header === 1 ? "3px" : 0,
                        }}
                        className="linear-progress"
                      />
                    ))}
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
                      Tactical
                    </Typography>
                    <Typography>1</Typography>
                  </Box>
                  <Box m={1.5} display={"flex"} gap={0.5}>
                    {[1, 2, 3].map((header, value) => (
                      <LinearProgress
                        key={header}
                        variant="determinate"
                        value={value < 1 ? 100 : 0}
                        sx={{
                          color: "#F1EB9C",
                          height: "8px",
                          width: "33.3%",
                          borderTopRightRadius: header === 3 ? "3px" : 0,
                          borderBottomRightRadius: header === 3 ? "3px" : 0,
                          borderTopLeftRadius: header === 1 ? "3px" : 0,
                          borderBottomLeftRadius: header === 1 ? "3px" : 0,
                        }}
                        className="linear-progress"
                      />
                    ))}
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
                      Psycho-social and motivation
                    </Typography>
                    <Typography>2</Typography>
                  </Box>
                  <Box m={1.5} display={"flex"} gap={0.5}>
                    {[1, 2, 3].map((header, value) => (
                      <LinearProgress
                        key={header}
                        variant="determinate"
                        value={value < 2 ? 100 : 0}
                        sx={{
                          color: "#F1EB9C",
                          height: "8px",
                          width: "33.3%",
                          borderTopRightRadius: header === 3 ? "3px" : 0,
                          borderBottomRightRadius: header === 3 ? "3px" : 0,
                          borderTopLeftRadius: header === 1 ? "3px" : 0,
                          borderBottomLeftRadius: header === 1 ? "3px" : 0,
                        }}
                        className="linear-progress"
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box textAlign={"start"} display={"grid"}>
                  {getAthleteHeroImage() !== "" ? (
                    <Image
                      src={getAthleteHeroImage()}
                      alt={""}
                      width={363}
                      height={630}
                    />
                  ) : athleteData?.gender ? (
                    <Image
                      src={
                        athleteData?.gender === "female" ? femaleHero : maleHero
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
                    src={athleteData?.profileImage}
                    style={{
                      width: 136,
                      height: 136,
                      border: "2px solid #FFFFFF",
                    }}
                  />
                  <CustomButton
                    sx={{
                      ml: 2,
                      color: "#FFFFFF",
                      borderColor: "#FFFFFF",
                    }}
                    label="Edit"
                    variant="outlined"
                    size="small"
                    ButtonIcon={EditOutlinedIcon}
                    iconPosition="start"
                    onClick={() => setShowEditDialog(true)}
                  />
                </Box>
                <Typography mt={2} className="bukra tertiary-color view-rank">
                  {athleteData?.rank}
                </Typography>
                <Tooltip title={athleteData?.firstName}>
                  <Typography
                    mt={0.5}
                    className="bukra tertiary-color view-name"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      cursor: "context-menu",
                    }}
                  >
                    {athleteData?.firstName}
                  </Typography>
                </Tooltip>
                <Box display={"flex"} gap={1}>
                  {_.isEmpty(athleteData?.sportsCategory) ||
                    athleteData?.sportsCategory === "[]" ||
                    athleteData?.sportsCategory === " " ? null : (
                    <>
                      <Box
                        sx={{
                          backgroundColor: "#F1EB9C",
                          fontSize: "16px",
                          fontWeight: "700",
                          borderRadius: "8px",
                          px: 2,
                          py: 0.5,
                          textAlign: "center",
                        }}
                        className="dubai-med text-capitalize"
                      >
                        {athleteData?.sportsCategory}
                      </Box>
                    </>
                  )}
                  {_.isEmpty(athleteData?.nationalTeamMember) ||
                  athleteData?.nationalTeamMember === " " || athleteData?.nationalTeamMember === "N" || athleteData?.nationalTeamMember === "No"  ? null : (
                    <>
                      <Box
                        sx={{
                          backgroundColor: "#F1EB9C",
                          fontSize: "16px",
                          fontWeight: "700",
                          borderRadius: "8px",
                          px: 2,
                          py: 0.5,
                          textAlign: "center",
                        }}
                        className="dubai-med text-capitalize"
                      >
                        {athleteData?.nationalTeamMember === "Y" ? "National Team Player" : null}
                      </Box>
                    </>
                  )}
                </Box>
                <Box
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                    fontSize: "18px",
                    fontWeight: "500",
                    color: "#FFFFFF",
                    borderRadius: "8px",
                    minWidth: "256px",
                    maxWidth: "80%",
                    mt: 2,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography px={2} py={1} sx={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                    {athleteData?.sportName}
                  </Typography>
                  <Typography py={1}>|</Typography>          
                  <Typography px={2} py={1} sx={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                    {athleteData?.role}
                  </Typography>
                </Box>
                <Box
                  sx={{ border: "1px solid #FFFFFF", borderRadius: "15px" }}
                  p={1.5}
                  mt={2}
                >
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    className="dubai-med"
                    mt={2}
                    width={"100%"}
                  >
                    <Box
                      width={"48%"}
                      display={"flex"}
                      className="tertiary-color"
                    >
                      <Typography className="view-table-list-head">
                        DOB:
                      </Typography>
                      <Typography
                        className="view-table-list-data text-capitalize"
                        ml={1}
                      >
                        {athleteData?.dob}
                      </Typography>
                    </Box>
                    <Box
                      width={"48%"}
                      display={"flex"}
                      className="tertiary-color"
                    >
                      <Typography className="view-table-list-head">
                        Age:
                      </Typography>
                      <Typography
                        className="view-table-list-data text-capitalize"
                        ml={1}
                      >
                        {athleteData?.age}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    className="dubai-med"
                    mt={1}
                    width={"100%"}
                  >
                    <Box
                      width={"48%"}
                      display={"flex"}
                      className="tertiary-color"
                    >
                      <Typography className="view-table-list-head">
                        Gender:
                      </Typography>
                      <Typography
                        className="view-table-list-data text-capitalize"
                        ml={1}
                      >
                        {athleteData?.gender}
                      </Typography>
                    </Box>
                    <Box
                      width={"48%"}
                      display={"flex"}
                      className="tertiary-color"
                    >
                      <Typography className="view-table-list-head">
                        Nationality:
                      </Typography>
                      <Typography
                        className="view-table-list-data text-capitalize"
                        ml={1}
                        sx={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}
                      >
                        {athleteData?.nationality}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    className="dubai-med"
                    mt={1}
                    width={"100%"}
                  >
                    <Box
                      width={"100%"}
                      display={"flex"}
                      className="tertiary-color"
                    >
                      <Typography className="view-table-list-head">
                        Discipline Practiced:
                      </Typography>
                      <Typography
                        className="view-table-list-data text-capitalize"
                        ml={1}
                        sx={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}
                      >
                        {athleteData?.disciplinePracticed}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    className="dubai-med"
                    mt={1}
                    width={"100%"}
                  >
                    <Box
                      width={"100%"}
                      display={"flex"}
                      className="tertiary-color"
                    >
                      <Typography className="view-table-list-head">
                        Federation License:
                      </Typography>
                      <Typography
                        className="view-table-list-data text-capitalize"
                        ml={1}
                        sx={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}
                      >
                        {athleteData?.federationLicense}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    className="dubai-med"
                    mt={1}
                    width={"100%"}
                  >
                    <Box
                      width={"100%"}
                      display={"flex"}
                      className="tertiary-color"
                    >
                      <Typography className="view-table-list-head">
                        Department:
                      </Typography>
                      <Typography
                        className="view-table-list-data text-capitalize"
                        ml={1}
                        sx={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}
                      >
                        {athleteData?.department}
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
                      <Typography className="view-table-list-head tertiary-color">
                        Score
                      </Typography>
                      <Typography className="view-table-list-data tertiary-color">
                        80
                      </Typography>
                    </Box>
                    <Box textAlign={"center"} width={"50%"}>
                      <Typography className="view-table-list-head tertiary-color">
                        Source
                      </Typography>
                      <Typography className="view-table-list-data tertiary-color" sx={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                        {athleteData && athleteData?.source ? athleteData?.source : "---"}
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
                    label="Medical, Rehab & Wellness"
                    expanded={section == 3}
                    onClick={() => toggleSection(3)}
                  />
                )}
                {section == 3 && (
                  <MedicalCheckCard
                    label="Medical, Rehab & Wellness"
                    expanded={section == 3}
                    onClick={() => toggleSection(3)}
                  />
                )}
                {section !== 4 && (
                  <ViewPageNav
                    label="Nutrition Plan"
                    expanded={section == 4}
                    onClick={() => toggleSection(4)}
                  />
                )}
                {section == 4 && (
                  <SuggestedNutrition
                    label="Nutrition Plan"
                    expanded={section == 4}
                    onClick={() => toggleSection(4)}
                  />
                )}
                {section !== 5 && (
                  <ViewPageNav
                    label="Medical & Injuries History"
                    expanded={section == 5}
                    onClick={() => toggleSection(5)}
                  />
                )}
                {section == 5 && (
                  <MedicalHistoryCard
                    label="Medical & Injuries History"
                    expanded={section == 5}
                    onClick={() => toggleSection(5)}
                  />
                )}
                {section !== 6 && (
                  <ViewPageNav
                    label="Uploaded Documents"
                    expanded={section == 6}
                    onClick={() => toggleSection(6)}
                  />
                )}
                {section == 6 ? (
                  <UploadDocuments
                    module="athlete"
                    label="Uploaded Documents"
                    expanded={section == 6}
                    attachmentList={
                      athleteData && athleteData.attachmentList
                        ? athleteData.attachmentList
                        : []
                    }
                    onClick={() => toggleSection(6)}
                    onFileChange={() => postData()}
                  />
                ) : null}
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <ProfileCard data={athleteData} module="athlete" id={athleteID} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ViewStaffs;