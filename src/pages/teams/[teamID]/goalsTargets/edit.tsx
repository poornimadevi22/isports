"use client";
import { useContext, useEffect, useState } from "react";
import {
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  styled,
  Alert,
  Snackbar,
  FormControl,
  MenuItem,
  Select,
  Chip,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _, { rest } from "lodash";
import { RootState, AppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";
import moment from "moment";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import { useForm } from "react-hook-form";
import {
  UpdateGoalsTargets,
  clearUpdateState,
} from "@/redux/slices/goalsTargets/goalsTargetsUpdateSlice";
import { GoalsAndTargets, GoalsAndTargetsSection } from "@/utils/constants";
import CustomSnackbar from "@/components/CustomSnackbar";
import { getAthleteListAPI } from "@/redux/slices/athlete/getAthleteListSlice";
import CancelIcon from "@mui/icons-material/Cancel";
import { listGoalsTargets } from "@/redux/slices/goalsTargets/goalsTargetsListSlice";

const CustomTextField = styled(TextField)(({ theme }) => ({
  height: "40px",
  borderRadius: "4px 0px 0px 0px",
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#00875508",
    "& fieldset": {
      borderColor: "#40a377",
    },
    "&:hover fieldset": {
      borderColor: "#40a377",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#40a377",
    },
  },
  "& input": {
    fontFamily: "Roboto",
    paddingLeft: "10px",
    color: "#000000",
    height: "8px",
  },
  "& input::placeholder": {
    color: "#8D9093",
    opacity: 1,
  },
  "& .Mui-error": {
    "& fieldset": {
      borderColor: "red",
    },
  },
}));

const GoalType = [{ value: "Team", label: "Team" }];

const EditLongTermGoals = (props: any) => {
  const { editGoalsTargetsData, id, onClose } = props;
  const { handleSubmit, control } = useForm();
  const contextValue: any = ""
  const selectedValue: any = contextValue.selectedValue
  const dispatch: AppDispatch = useDispatch();
  const goalsTargetsUpdateData = useSelector(
    (state: any) => state.updateGoalsTargets
  );
  const getAthleteList = useSelector((state: any) => {
    return state.getAthleteList && !_.isEmpty(state.getAthleteList.data)
      ? state.getAthleteList.data
      : [];
  });
  const [formData, setFormData] = useState<any>({
    goal: "",
    goalType: "",
    startDate: "",
    endDate: "",
    team: "",
    athletes: "",
    goalStrategy: "",
    challenges: "",
    actionSteps: "",
    description: "",
    athleteName: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [showBanner, setShowBanner] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState<any>();

  useEffect(() => {
    const data =
      editGoalsTargetsData &&
      editGoalsTargetsData.data &&
      editGoalsTargetsData.data[0];
    if (!_.isEmpty(data)) {
      setFormData({
        goal: data.goal || "",
        goalType: data.goalType || "",
        startDate: data.startDate || "",
        endDate: data.endDate || "",
        team: data.team || "",
        athletes: data.athletes || "",
        goalStrategy: data.goalStrategy || "",
        challenges: data.challenges || "",
        actionSteps: data.actionSteps || "",
        description: data.description || "",
        athleteName: data.athleteName || "",
      });
    }
  }, [editGoalsTargetsData]);

  const langOnchange = (event: any) => {
    const {
      target: { value },
    } = event;
    const selectedLanguages = value as string[];
    setFormData({
      ...formData,
      athletes: selectedLanguages.join(","),
    });
  };

  const handleDelete = (language: string) => {
    const updatedLanguages = formData.athletes
      .split(",")
      .filter((item: any) => item.trim() !== language.trim())
      .join(",");
    setFormData({
      ...formData,
      athletes: updatedLanguages,
    });
  };

  useEffect(() => {
    const payload = {
      searchText: "",
      filteredBy: "",
    };
    dispatch(getAthleteListAPI({ payload }));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const dateChange = (data: any) => {
    setFormData({ ...formData, [data.name]: data.value });
    setErrors({
      ...errors,
      [data.name]: "",
    });
  };

  const onSubmit = () => {
    const validationErrors: any = {};
    if (selectedValue === "Individual Goals") {
      if (_.isEmpty(formData.athleteName)) {
        validationErrors.athleteName = "Athlete Name is required";
      }
    }
    if (_.isEmpty(formData.goal)) {
      validationErrors.goal = "Goal is required";
    }
    if (_.isEmpty(formData.startDate)) {
      validationErrors.startDate = "Start Date is required";
    }
    if (_.isEmpty(formData.endDate)) {
      validationErrors.endDate = "End Date is required";
    }
    setErrors(validationErrors);
    if (_.isEmpty(validationErrors)) {
      if (selectedValue === "Individual Goals") {
        const { goalType, team, athletes, ...rest } = formData;
        const data = {
          ...rest,
          startDate: moment(formData.startDate, "MM/DD/YYYY").isValid()
            ? moment(formData.startDate, "MM/DD/YYYY").format("MM/DD/YYYY")
            : moment(formData.startDate, "MM/DD/YYYY").format(
              "MM/DD/YYYY"
            )
          ,
          endDate:
            moment(formData.endDate, "DD/MM/YYYY", true).isValid()
              ? moment(formData.endDate, "DD/MM/YYYY").format("MM/DD/YYYY")
              : moment(formData.endDate, "MM/DD/YYYY").format(
                "MM/DD/YYYY"
              ),
          loggedUserID: 1,
          goalsAndTargetsID: id,
          goalsAndTargetsSection:
            GoalsAndTargetsSection[
            selectedValue as keyof typeof GoalsAndTargetsSection
            ],
          section:
            GoalsAndTargets[selectedValue as keyof typeof GoalsAndTargets],
        };
        dispatch(
          UpdateGoalsTargets(data)
        );
      } else {
        const { athleteName, ...rest } = formData;
        const data = {
          ...rest,
          startDate:
            moment(formData.startDate, "DD/MM/YYYY", true).isValid()
              ? moment(formData.startDate, "DD/MM/YYYY").format("MM/DD/YYYY")
              : moment(formData.startDate, "MM/DD/YYYY").format(
                "MM/DD/YYYY"
              ),
          endDate:
            moment(formData.endDate, "DD/MM/YYYY", true).isValid()
              ? moment(formData.endDate, "DD/MM/YYYY").format("MM/DD/YYYY")
              : moment(formData.endDate, "MM/DD/YYYY").format(
                "MM/DD/YYYY"
              ),
          loggedUserID: 1,
          goalsAndTargetsID: id,
          goalsAndTargetsSection:
            GoalsAndTargetsSection[
            selectedValue as keyof typeof GoalsAndTargetsSection
            ],
          section:
            GoalsAndTargets[selectedValue as keyof typeof GoalsAndTargets],
        };
        dispatch(
          UpdateGoalsTargets(data)
        );
      }
    }
  };

  const tabClose = () => {
    onClose()
  }

  useEffect(() => {
    if (goalsTargetsUpdateData && goalsTargetsUpdateData.code === 200) {
      setShowBanner(true);
      setSnackbarStatus(goalsTargetsUpdateData.code);
      setTimeout(() => {
        dispatch(clearUpdateState());
        setShowBanner(false);
        tabClose()
      }, 3000);
      const payload = {
        goalsAndTargetsSection: GoalsAndTargetsSection[selectedValue as keyof typeof GoalsAndTargetsSection],
      };
      dispatch(listGoalsTargets({ url: "/GetGoalsAndTargetsList", payload }));
    } else if (goalsTargetsUpdateData && goalsTargetsUpdateData.code === 500) {
      setShowBanner(true);
      setSnackbarStatus(goalsTargetsUpdateData.code);
      setTimeout(() => {
        dispatch(clearUpdateState());
        setShowBanner(false);
      }, 3000);
    }
  }, [goalsTargetsUpdateData]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowBanner(false);
  };

  const selectChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  console.log("formData.startDate", formData.startDate)
  console.log(
    "checkvalue",
    moment(formData.startDate, "DD/MM/YYYY", true).isValid()
      ? moment(formData.startDate, "DD/MM/YYYY").format("MM/DD/YYYY")
      : "Invalid date"
  );

  return (
    <Grid container spacing={0}>
      {showBanner && (
        <CustomSnackbar
          message={
            snackbarStatus === 200
              ? `${selectedValue} Added successfully!`
              : "Something went wrong"
          }
          severity={snackbarStatus === 200 ? "success" : "error"}
          open={showBanner}
          onClose={handleClose}
        />
      )}
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        display="flex"
        justifyContent="center"
        alignItems={{ xs: "top", md: "center" }}
        sx={{
          position: "relative",
          overflow: "hidden",
          mt: 2,
        }}
      >
        <Box
          width="100%"
          mx={{ sm: 5, md: 1, lg: 1, xl: 5 }}
          px={{ sm: 5, md: 2, lg: 3, xl: 5 }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} justifyContent={"space-between"}>
              {selectedValue === "Individual Goals" ? (
                <Grid item xs={12} md={12}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Athlete Name <span className="asterisk">*</span>
                  </Typography>
                  <CustomTextField
                    name="athleteName"
                    placeholder="Enter Athlete Name"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.athleteName}
                    onChange={handleChange}
                    className="Text-field-customise"
                  />
                  {errors.athleteName && (
                    <Typography variant="caption" className="error-message">
                      {errors.athleteName}
                    </Typography>
                  )}
                </Grid>
              ) : null}
              <Grid item xs={12} md={12}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Goal <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="goal"
                  placeholder="Enter Goal"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.goal}
                  onChange={handleChange}
                  className="Text-field-customise"
                />
                {errors.goal && (
                  <Typography variant="caption" className="error-message">
                    {errors.goal}
                  </Typography>
                )}
              </Grid>
              {selectedValue !== "Individual Goals" ? (
                <Grid item xs={12} md={12}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Goal Type
                  </Typography>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    className="selectFieldContainer"
                  >
                    <Select
                      value={formData.goalType}
                      onChange={selectChange}
                      name="goalType"
                      displayEmpty
                      className="Text-field-customise"
                      renderValue={(selected) => {
                        if (selected === "") {
                          return (
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              sx={{
                                fontFamily: "Dubai",
                                fontSize: "16px",
                                fontWeight: 500,
                              }}
                            >
                              Select Goal Type
                            </Typography>
                          );
                        }
                        return selected;
                      }}
                    >
                      {GoalType.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Typography
                            variant="body1"
                            color="textPrimary"
                            style={{
                              height: 27,
                              fontFamily: "Dubai",
                              fontSize: "16px",
                              fontWeight: 500,
                              lineHeight: "25.01px",
                              textAlign: "left",
                              marginLeft: 10,
                            }}
                          >
                            {option.label}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.goalType && (
                      <Typography variant="caption" className="error-message">
                        {errors.goalType}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
              ) : null}

              <Grid item xs={12} md={12}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Start Date <span className="asterisk">*</span>
                </Typography>
                <CustomDatePicker
                  control={control}
                  hidden={true}
                  name="startDate"
                  label=" Start Date"
                  boxmb={0.8}
                  required={true}
                  minDate={moment().subtract(50, "years")}
                  maxDate={moment().add(10, "years")}
                  onChange={dateChange}
                  defaultValue={formData && formData.startDate}
                  className="Text-field-customise"
                />
                {errors.startDate && (
                  <Typography
                    variant="caption"
                    className="error-message"
                    mt={2}
                  >
                    {errors.startDate}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  End Date <span className="asterisk">*</span>
                </Typography>
                <CustomDatePicker
                  control={control}
                  hidden={true}
                  name="endDate"
                  label="End Date"
                  boxmb={0.8}
                  required={true}
                  minDate={moment().subtract(50, "years")}
                  maxDate={moment().add(10, "years")}
                  onChange={dateChange}
                  defaultValue={formData && formData.endDate}
                  className="Text-field-customise"
                />
                {errors.endDate && (
                  <Typography
                    variant="caption"
                    className="error-message"
                    mt={2}
                  >
                    {errors.endDate}
                  </Typography>
                )}
              </Grid>
              {selectedValue !== "Individual Goals" ? (
                <>
                  <Grid item xs={12} md={12}>
                    <Typography
                      gutterBottom
                      className="typography textfield-label bukra"
                    >
                      Team
                    </Typography>
                    <CustomTextField
                      name="team"
                      placeholder="Enter Team Name"
                      type="text"
                      variant="outlined"
                      fullWidth
                      value={formData.team}
                      onChange={handleChange}
                      className="Text-field-customise"
                    />
                    {errors.team && (
                      <Typography variant="caption" className="error-message">
                        {errors.team}
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <Typography
                      gutterBottom
                      className="typography textfield-label bukra"
                    >
                      Athletes
                    </Typography>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      className="selectFieldContainer"
                    >
                      <Select
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        name="athletes"
                        multiple
                        displayEmpty
                        className="Text-field-customise"
                        value={formData.athletes
                          .split(",")
                          .map((item: any) => item.trim())
                          .filter((item: any) => item)}
                        onChange={langOnchange}
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return (
                              <Typography
                                color="textSecondary"
                                style={{
                                  height: 27,
                                  fontFamily: "Dubai",
                                  fontSize: "16px",
                                  fontWeight: 500,
                                  lineHeight: "25.01px",
                                  textAlign: "left",
                                  marginLeft: 10,
                                }}
                              >
                                Select Athletes
                              </Typography>
                            );
                          }
                          return (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {selected.map((value: string) => (
                                <Chip
                                  style={{
                                    height: 23,
                                    fontFamily: "Dubai",
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    lineHeight: "25.01px",
                                    textAlign: "left",
                                    marginLeft: 8,
                                  }}
                                  key={value}
                                  label={value}
                                  onDelete={() => handleDelete(value)}
                                  deleteIcon={
                                    <CancelIcon
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(value);
                                      }}
                                    />
                                  }
                                />
                              ))}
                            </Box>
                          );
                        }}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                              overflow: "auto",
                            },
                          },
                        }}
                        style={{
                          height: 40,
                        }}
                      >
                        {getAthleteList &&
                          getAthleteList.map((item: any) => (
                            <MenuItem
                              key={`${item.name}${item.athleteID}`}
                              value={`${item.name}${item.athleteID}`}
                            >
                              {`${item.name}${item.athleteID}`}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              ) : null}
              <Grid item xs={12} md={12} mb={7}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Goal Strategy
                </Typography>
                <CustomTextField
                  name="goalStrategy"
                  placeholder="Enter Goal Strategy"
                  type="text"
                  variant="outlined"
                  multiline
                  rows={2}
                  fullWidth
                  value={formData.goalStrategy}
                  onChange={handleChange}
                  error={Boolean(errors.goalStrategy)}
                  helperText={errors.goalStrategy || ""}
                  className="Text-field-customise height-customise"
                />
              </Grid>
              <Grid item xs={12} md={12} mb={7}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Challenges
                </Typography>
                <CustomTextField
                  name="challenges"
                  placeholder="Enter Main Challenges"
                  type="text"
                  variant="outlined"
                  multiline
                  rows={2}
                  fullWidth
                  value={formData.challenges}
                  onChange={handleChange}
                  error={Boolean(errors.challenges)}
                  helperText={errors.challenges || ""}
                  className="Text-field-customise height-customise"
                />
              </Grid>
              <Grid item xs={12} md={12} mb={7}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Description
                </Typography>
                <CustomTextField
                  name="description"
                  placeholder="Enter Description"
                  type="text"
                  variant="outlined"
                  multiline
                  rows={2}
                  fullWidth
                  value={formData.description}
                  onChange={handleChange}
                  error={Boolean(errors.description)}
                  helperText={errors.description || ""}
                  className="Text-field-customise height-customise"
                />
              </Grid>
              <Grid item xs={12} md={12} mb={7}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Action Steps
                </Typography>
                <CustomTextField
                  name="actionSteps"
                  placeholder="List the action step for this goal"
                  type="text"
                  variant="outlined"
                  multiline
                  rows={2}
                  fullWidth
                  value={formData.actionSteps}
                  onChange={handleChange}
                  error={Boolean(errors.actionSteps)}
                  helperText={errors.actionSteps || ""}
                  className="Text-field-customise height-customise"
                />
              </Grid>
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "3.5rem",
              }}
            >
              <Button
                variant="outlined"
                color="error"
                sx={{ marginRight: "1rem" }}
                onClick={() => {
                  onClose()
                }}
                className="cancel-button text-capitalize"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  color: goalsTargetsUpdateData.loading ? "white" : "white",
                }}
                className="save-continue-button text-capitalize save"
                disabled={goalsTargetsUpdateData.loading}
              >
                {goalsTargetsUpdateData.loading ? "Loading..." : "Update"}
              </Button>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};
export default EditLongTermGoals;