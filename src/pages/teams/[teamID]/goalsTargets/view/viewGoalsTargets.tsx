import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  LinearProgress,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import Image from "next/image";
import leftCurve from "../../../../../../public/leftCurve.png";
import goalsView from "../../../../../../public/goalsView.png";
import upperCurve from "../../../../../../public/upperCurve.png";
import SampleAvatar from "../../../../../../public/sampleAvatar.svg";
import { LineChart } from "@mui/x-charts";
import CircleIcon from "@mui/icons-material/Circle";
import { useRouter } from "next/router";
import { clearEditState, editGoalsTargets } from "@/redux/slices/goalsTargets/goalsTargetsEditSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import Edit from "../[id]/edit";

export default function ViewCard() {
  const steps = [
    {
      label: "Initial Analysis",
      description: "Assess current possession stats and set baseline",
      color: "#00426A",
      date: "05/01/2025",
      percentage: "10%",
    },
    {
      label: "Ball Retention Drills",
      description: "Practice fundamental drills to improve ball control",
      color: "#00426A",
      date: "22/01/2025",
      percentage: "25%",
    },
    {
      label: "Positional Play Training",
      description: "Enhance possession through structured team play.",
      color: "#00426A",
      date: "10/02/2025",
      percentage: "30%",
    },
    {
      label: "Scrimmage Assessment",
      description: "Evaluate possession in game-like scenarios.",
      color: "#00426A",
      date: "15/03/2025",
      percentage: "70%",
    },
    {
      label: "Final Evaluation",
      description: "Analyze and verify the Goal",
      color: "#A2173A",
      date: "25/04/2025",
      percentage: "100%",
    },
  ];
  const data = [0, 20, 80, 40, 20, 60];
  const xData = ["Start", "Jan", "Feb", "Mar", "Apr", "End"];
  const yData = [100, 80, 60, 40, 20, 0];
  const [chartHeight, setChartHeight] = React.useState<any>(0);
  type ViewBox = {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  };
  const [isOpen, setIsOpen] = React.useState(false);
  const [isEditData, setisEditData] = React.useState(null);

  const handleEditData = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpen(true);
  };

  const viewBox: ViewBox = {
    x: 0,
    y: 0,
    height: chartHeight + 20,
  };
  const router = useRouter();
  const { id } = router.query;
  const dispatch: AppDispatch = useDispatch();
  const GoalsEditList = useSelector((state: RootState) =>
    state.editGoalsTargets.code === 200 &&
    !isEmpty(state.editGoalsTargets?.data[0])
      ? state.editGoalsTargets?.data[0]
      : null
  );
  const GoalsEditListLoading = useSelector(
    (state: RootState) => state.editGoalsTargets
  );

  React.useEffect(() => {
    const height: any = document?.getElementById("chartHeight")?.clientHeight;
    setChartHeight(height);
  }, []);

  React.useEffect(() => {
    if (id) {
      const payload: any = {
        goalsAndTargetsID: id,
      };
      dispatch(editGoalsTargets(payload));
    }
  }, [id]);

  const handleClose = () => {
    setIsOpen(false);
    setisEditData(null);
    // dispatch(clearEditState());
  };

  return (
    <>
      {GoalsEditListLoading.loading && !isOpen ? (
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
      ) : (
        <Grid container spacing={2}>
          {isOpen && isEditData && (
            <Edit open={isOpen} onClose={handleClose} id={isEditData} />
          )}
          <Grid item xs={12}>
            <Box
              borderRadius={"8px"}
              height={"384px"}
              sx={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(0, 135, 85, 1), rgba(0, 88, 68, 1))",
              }}
              p={2}
              position={"relative"}
            >
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
                src={goalsView}
                alt="Logo"
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: "20%",
                  objectFit: "cover",
                }}
              />
              <Image
                src={upperCurve}
                alt="Logo"
                style={{
                  position: "absolute",
                  top: 0,
                  right: "20%",
                  objectFit: "cover",
                }}
              />
              <Grid
                container
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Grid item md={7} p={3}>
                  <Typography className="bukra goal-target-view-head">
                    Improve Possession by 15%
                  </Typography>
                  <Typography
                    mt={2}
                    className="dubai-med goal-target-view-list"
                  >
                    This season's performance directly influences the team's
                    ability to win the championship. Qualifying for playoffs
                    keeps the long-term goal of winning the league alive.
                  </Typography>
                  <Box mt={1.5} display={"flex"}>
                    <Typography
                      px={2}
                      py={1}
                      sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                      borderRadius={"8px"}
                      width={"auto"}
                      className="dubai-med goal-target-view-list"
                    >
                      Start Date:{GoalsEditList?.startDate}&nbsp;&nbsp; End
                      Date: {GoalsEditList?.endDate}
                    </Typography>
                  </Box>
                  <Box mt={4} display={"flex"} alignItems={"center"}>
                    <Avatar
                      alt="Profile Image"
                      src={GoalsEditList?.athleteProfileImage}
                      sx={{
                        width: 72,
                        height: 72,
                        margin: "1px solid #FFFFFF",
                      }}
                    />
                    <Box ml={3}>
                      <Typography className="bukra goal-target-view-role">
                        {GoalsEditList?.goalName}
                      </Typography>
                      <Typography className="bukra goal-target-view-name">
                        {GoalsEditList?.athleteName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item md={3}>
                  <Box display="flex" gap={1} justifyContent={"end"}>
                    <Button
                      variant="contained"
                      sx={{
                        color: "#008755",
                        height: "48px",
                        backgroundColor: "#FFFFFF",
                      }}
                      startIcon={<SettingsOutlinedIcon />}
                      className="text-capitalize"
                    >
                      Update
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{ color: "#FFFFFF", borderColor: "#FFFFFF" }}
                      startIcon={<PersonAddAltOutlinedIcon />}
                      className="text-capitalize"
                      onClick={() => handleEditData(GoalsEditList?.goalsAndTargetsID)}
                    >
                      Edit Goal
                    </Button>
                  </Box>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    mt={5}
                  >
                    <Typography className="goal-target-view-status bukra">
                      Status:{" "}
                      <span className="dubai-med goal-target-view-status-list">
                        In Progress
                      </span>
                    </Typography>
                    <Typography className="dubai-med goal-target-view-status-list">
                      80%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={70}
                    sx={{ mb: 5, color: "#F1EB9C", mt: 1 }}
                    className="linear-progress"
                  />
                  <Box
                    mt={1.5}
                    px={2}
                    py={1}
                    sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                    borderRadius={"8px"}
                  >
                    <Typography className="dubai-med goal-target-view-list">
                      Create by
                      <br />{" "}
                      <span style={{ fontWeight: "600" }}>
                        Daawood Ashkir Edris
                      </span>{" "}
                      (Admin)
                      <br /> 04/01/2025 06:00pm
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={6} className="card-height" id="chartHeight">
            <Card>
              <CardHeader
                avatar={<ListOutlinedIcon />}
                title="Individual Milestones"
                className="primary-color card-header"
                action={
                  <Button
                    variant="contained"
                    size="small"
                    className="dubai=med text-capitalize"
                    startIcon={<SettingsOutlinedIcon />}
                  >
                    Update
                  </Button>
                }
              />
              <CardContent sx={{ py: 0 }}>
                <Stepper orientation="vertical" className="goal-vertical-line">
                  {steps.map((step, index) => (
                    <Step
                      key={step.label}
                      sx={{
                        display: "flex",
                        my: 1,
                        minHeight: "61px",
                      }}
                    >
                      <StepLabel
                        icon={
                          <CircleIcon
                            style={{
                              color: `${step.color}`,
                              width: 20,
                              height: 20,
                              border: `2px solid ${step.color}`,
                              borderRadius: "50%",
                            }}
                          />
                        }
                        sx={{ width: "100%", p: 0, mt: 0.25 }}
                      >
                        <Typography
                          display={"flex"}
                          className="bukra stepper-label-view primary-text-color"
                          justifyContent={"space-between"}
                        >
                          {step.label}
                          <span className="dubai-med secondary-color">
                            {step.date}
                          </span>
                        </Typography>
                        <Typography
                          className="dubai-med stepper-description-view secondary-color"
                          my={1}
                        >
                          {step.percentage}
                        </Typography>
                        <Typography className="dubai-med stepper-description-view secondary-color">
                          {step.description}
                        </Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} className="card-height">
            <Card>
              <CardHeader
                avatar={<ListOutlinedIcon />}
                title="Athlete Progress Towards Goal"
                className="primary-color card-header"
              />
              <CardContent sx={{ py: 0 }}>
                <LineChart
                  xAxis={[{ data: xData, scaleType: "point" }]}
                  yAxis={[{ data: yData, scaleType: "point" }]}
                  series={[
                    {
                      data,
                      showMark: false,
                      connectNulls: true,
                      color: "#E4002B",
                      area: true,
                    },
                  ]}
                  height={chartHeight}
                  viewBox={viewBox}
                  margin={{ top: 10, bottom: 20 }}
                  className="chart-liner-list"
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} className="card-height">
            <Card>
              <CardHeader
                avatar={<ListOutlinedIcon />}
                title="Goal Strategy"
                className="primary-color card-header"
              />
              <CardContent sx={{ py: 0 }}>
                <Typography className="dubai-med view-card-list-para">
                  {GoalsEditList?.goalStrategy}
                </Typography>
                {/* <Typography className="dubai-med view-card-list-para" my={1}>
                  Train players to improve movement off the ball for better
                  passing options.
                </Typography>
                <Typography className="dubai-med view-card-list-para">
                  Implement high pressing to regain possession quickly.
                </Typography>
                <Typography className="dubai-med view-card-list-para" my={1}>
                  Use drills that emphasize ball retention under pressure.
                </Typography>
                <Typography className="dubai-med view-card-list-para">
                  Analyze match data to identify areas where possession is lost
                  and make tactical adjustments.
                </Typography> */}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} className="card-height">
            <Card>
              <CardHeader
                avatar={<ListOutlinedIcon />}
                title="Challenges"
                className="primary-color card-header"
              />
              <CardContent sx={{ py: 0 }}>
                <Typography className="dubai-med view-card-list-para">
                  {GoalsEditList?.challenges}
                </Typography>
                {/* <Typography className="dubai-med view-card-list-para" my={1}>
                  Maintaining possession without sacrificing offensive play.
                </Typography>
                <Typography className="dubai-med view-card-list-para">
                  Player fatigue leading to loss of focus and ball control.
                </Typography>
                <Typography className="dubai-med view-card-list-para" my={1}>
                  Adapting to varying styles of play from different opponents.
                </Typography>
                <Typography className="dubai-med view-card-list-para">
                  Managing possession effectively in high-pressure situations.
                </Typography> */}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} className="card-height">
            <Card>
              <CardHeader
                avatar={<ListOutlinedIcon />}
                title="Action Steps"
                className="primary-color card-header"
              />
              <CardContent sx={{ py: 0 }}>
                <ul style={{ margin: "0px" }}>
                  <li className="dubai-med view-card-list-para">
                    {GoalsEditList?.actionSteps}
                  </li>
                  {/* <li className="dubai-med view-card-list-para">
                    Maintaining possession without sacrificing offensive play.
                  </li>
                  <li className="dubai-med view-card-list-para">
                    Player fatigue leading to loss of focus and ball control.
                  </li>
                  <li className="dubai-med view-card-list-para">
                    Adapting to varying styles of play from different opponents.
                  </li>
                  <li className="dubai-med view-card-list-para">
                    Managing possession effectively in high-pressure situations.
                  </li> */}
                </ul>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} className="card-height">
            <Card>
              <CardHeader
                avatar={<ListOutlinedIcon />}
                title="Feedback"
                className="primary-color card-header"
              />
              <CardContent sx={{ py: 0 }}>
                <Typography className="dubai-med view-card-list-para">
                  {GoalsEditList?.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                avatar={<ListOutlinedIcon />}
                title="Notes"
                className="primary-color card-header"
              />
              <CardContent sx={{ py: 0 }}>
                <Typography className="dubai-med view-card-list-para">
                  {GoalsEditList?.note}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  );
}
