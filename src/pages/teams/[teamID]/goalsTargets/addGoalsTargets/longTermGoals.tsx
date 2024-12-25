"use client";
import { useEffect, useState } from "react";
import {
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  styled,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import {
  RootState,
  AppDispatch,
} from "@/redux/store";
import { usePathname, useRouter } from "next/navigation";
import moment from "moment";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import { useForm } from "react-hook-form";
import { addGoalsTargets, clearAddState } from "@/redux/slices/goalsTargets/goalsTargetsAddSlice";
import { REGEX } from "@/utils/constants";
import CustomSnackbar from "@/components/CustomSnackbar";
import { getAthleteListAPI } from "@/redux/slices/athlete/getAthleteListSlice";
import ReactSelect from "@/components/Fields/ReactSelect";
import LoadingButton from '@mui/lab/LoadingButton';
import { trimFormData } from "@/utils/helper";

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

const LongTermGoals = (props: any) => {
  const { selectedValue } = props
  const { handleSubmit, control } = useForm();
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const goalsTargetsAddData = useSelector((state: RootState) => state.addGoalsTargets);
  const getAthleteList = useSelector((state: any) => state.getAthleteList);
  const [formData, setFormData] = useState<any>({
    goalName: "",
    goalType: "athlete",
    startDate: "",
    endDate: "",
    athletes: "",
    goalStrategy: "",
    challenges: "",
    actionSteps: "",
    description: "",
    note: ""
  });
  const [errors, setErrors] = useState<any>({});
  const [showBanner, setShowBanner] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState<any>()
  const [actionType, setActionType] = useState("");
  const currentNav = usePathname();
  const teamId = currentNav?.split("/")[2];
  const [AthletesOption, setAthletesOption] = useState()
  const [SelectedAthletesOption, setSelectedAthletesOption] = useState('')

  useEffect(() => {
    const payload = {
      searchText: "",
      filteredBy: "",
      paginationCount: 100,
      paginationIndex: 1,
      sportID: Number(teamId)
    };
    dispatch(getAthleteListAPI(payload));
  }, [teamId])

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
    if (_.isEmpty(formData.athletes)) {
      validationErrors.athletes = "Athlete is required";
    }
    if (!formData.goalName || _.trim(formData.goalName) === "") {
      validationErrors.goalName = "Goal Name is required";
    }
    if (_.isEmpty(formData.startDate)) {
      validationErrors.startDate = "Start Date is required";
    }
    if (_.isEmpty(formData.endDate)) {
      validationErrors.endDate = "End Date is required";
    }
    if (
      !_.isEmpty(formData.startDate) &&
      !_.isEmpty(formData.endDate) &&
      moment(formData.endDate).isBefore(moment(formData.startDate))
    ) {
      validationErrors.endDate = "End Date cannot be earlier than Start Date";
    }
    setErrors(validationErrors);
    if (_.isEmpty(validationErrors)) {
      const { athleteName, athletes, ...rest } = formData
      const trimmedRest = trimFormData(rest);
      const data = {
        ...trimmedRest,
        startDate: moment(formData.startDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
        endDate: moment(formData.endDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
        sportID: teamId,
        loggedUserID: "1",
        athlete: formData.goalType === "athlete" ? formData.athletes.split(",")[0].trim() : formData.athletes,
        goalsAndTargetsSection: "IndividualGoals",
      };
      dispatch(addGoalsTargets({ url: "/InsertGoalsAndTargets", payload: data }));
    }
  };

  const clearFormData = () => {
    setFormData({
      goalName: "",
      startDate: "",
      endDate: "",
      athletes: "",
      goalStrategy: "",
      challenges: "",
      actionSteps: "",
      description: "",
      athleteName: "",
      note: ""
    });
    setSelectedAthletesOption('')
  };


  useEffect(() => {
    if (goalsTargetsAddData && goalsTargetsAddData.code === 200) {
      setShowBanner(true);
      setSnackbarStatus(goalsTargetsAddData.code)
      clearFormData()
      setTimeout(() => {
        dispatch(clearAddState());
        setShowBanner(false);
        if (actionType === "save") {
          router.push(`/teams/${teamId}/goalsTargets`);
        }
      }, 3000);
    } else if (goalsTargetsAddData && goalsTargetsAddData.code === 500) {
      setShowBanner(true);
      setSnackbarStatus(goalsTargetsAddData.code)
      setTimeout(() => {
        dispatch(clearAddState());
        setShowBanner(false);
      }, 3000);
    }
  }, [goalsTargetsAddData]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowBanner(false);
  };

  const handleButtonClick = (type: string) => {
    setActionType(type);
  };

  const handleChangeAthletes = (selectedOption: any | null): void => {
    if (selectedOption) {
      const selectedValues = Array.isArray(selectedOption)
        ? selectedOption.map((option: any) => option.value)
        : [selectedOption.value];
      setSelectedAthletesOption(selectedOption);
      setFormData({
        ...formData,
        athletes: selectedValues.join(","),
      });
      setErrors({
        ...errors,
        athletes: "",
      });
    }
  };

  const data = getAthleteList && getAthleteList?.data
  useEffect(() => {
    const athletes: any = getDefaultOption(data)
    setAthletesOption(athletes)
  }, [data])
  const getDefaultOption = (AthleteList: any) => {
    const defaultOptions = []
    for (const item in AthleteList) {
      defaultOptions.push({ label: AthleteList[item].firstName, value: AthleteList[item].athleteID })
    }
    return defaultOptions
  }


  return (
    <Grid container
      sx={{
        padding: "2rem",
        position: "relative",
        overflow: "auto",
        maxHeight: "680px",
      }}>
      {
        showBanner && (
          <CustomSnackbar
            message={snackbarStatus === 200 ? `Individual Goals Added successfully!` : 'Something went wrong'}
            severity={snackbarStatus === 200 ? 'success' : 'error'}
            open={showBanner}
            onClose={handleClose}
          />
        )
      }
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        display="flex"
        justifyContent="center"
        alignItems={{ xs: "top", md: "center" }}
      >
        <Box
          width="100%"
          mx={{ sm: 5, md: 1, lg: 1, xl: 5 }}
          px={{ sm: 5, md: 2, lg: 3, xl: 5 }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} justifyContent={"space-between"}>
              <Grid item xs={12} md={12}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Select GoalType
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    name="goalType"
                    value={formData.goalType}
                    onChange={handleChange}
                    row
                  >
                    <FormControlLabel
                      className="dubai-med textfield-label"
                      value="team"
                      control={<Radio />}
                      label="Team"
                    />
                    <FormControlLabel
                      className="dubai-med textfield-label"
                      value="athlete"
                      control={<Radio />}
                      label="Athlete"
                      defaultChecked={true}
                    />
                  </RadioGroup>
                  {errors.gender && (
                    <Typography variant="caption" className="error-message">
                      {errors.gender}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Athletes <span className="asterisk">*</span>
                </Typography>
                <ReactSelect
                  isMulti={formData.goalType === "team" ? true : false}
                  name='athletes'
                  className='select2'
                  classNamePrefix='select'
                  handleChangeReactSelect={handleChangeAthletes}
                  options={AthletesOption}
                  value={SelectedAthletesOption}
                  isDisabled={!AthletesOption}
                  placeholder={formData.goalType === "team" ? "Select Athletes" : "Select Athlete"}
                />
                {errors.athletes && (
                  <Typography variant="caption" className="error-message">
                    {errors.athletes}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Goal Name <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="goalName"
                  placeholder="Enter Goal e.g. (Win the championship league within the season.)"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.goalName}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault()
                    }
                  }}
                />
                {errors.goalName && (
                  <Typography variant="caption" className="error-message">
                    {errors.goalName}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography gutterBottom className="typography textfield-label bukra">
                  Start Date <span className="asterisk">*</span>
                </Typography>
                <CustomDatePicker
                  control={control}
                  hidden={true}
                  name="startDate"
                  label=" Start Date"
                  boxmb={0.8}
                  required={true}
                  minDate={moment().subtract(50, 'years')}
                  maxDate={moment().add(10, 'years')}
                  onChange={dateChange}
                  defaultValue={formData && formData.startDate}
                  className="Text-field-customise"
                />
                {errors.startDate && (
                  <Typography variant="caption" className="error-message" mt={2}>
                    {errors.startDate}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography gutterBottom className="typography textfield-label bukra">
                  End Date <span className="asterisk">*</span>
                </Typography>
                <CustomDatePicker
                  control={control}
                  hidden={true}
                  name="endDate"
                  label="End Date"
                  boxmb={0.8}
                  required={true}
                  minDate={formData.startDate || moment().subtract(50, "years")}
                  maxDate={moment().add(10, 'years')}
                  onChange={dateChange}
                  defaultValue={formData && formData.endDate}
                  className="Text-field-customise"
                />
                {errors.endDate && (
                  <Typography variant="caption" className="error-message" mt={2}>
                    {errors.endDate}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.5} mb={7}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Goal Strategy
                </Typography>
                <CustomTextField
                  name="goalStrategy"
                  placeholder="e.g. (Enhance team cohesion through weekly practice matches and advanced tactics training.)"
                  type="text"
                  variant="outlined"
                  multiline
                  rows={2}
                  fullWidth
                  value={formData.goalStrategy}
                  onChange={handleChange}
                  error={Boolean(errors.goalStrategy)}
                  helperText={errors.goalStrategy || ''}
                  className="Text-field-customise"
                  sx={{ marginBottom: '30px' }}
                  inputProps={{ maxLength: 500 }}
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault()
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={5.5} mb={5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Challenges
                </Typography>
                <CustomTextField
                  name="challenges"
                  placeholder="e.g. (Key injuries to players, lack of coordination in defense, inconsistent scoring in matches.)"
                  type="text"
                  variant="outlined"
                  multiline
                  rows={2}
                  fullWidth
                  value={formData.challenges}
                  onChange={handleChange}
                  error={Boolean(errors.challenges)}
                  helperText={errors.challenges || ''}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 500 }}
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault()
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={5.5} mb={5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Description
                </Typography>
                <CustomTextField
                  name="description"
                  placeholder="Provide detailed context or background about the goal.
e.g. (This goal focuses on achieving top performance by improving physical fitness, teamwork, and strategy application.)"
                  type="text"
                  variant="outlined"
                  multiline
                  rows={2}
                  fullWidth
                  value={formData.description}
                  onChange={handleChange}
                  error={Boolean(errors.description)}
                  helperText={errors.description || ''}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 500 }}
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault()
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={5.5} mb={5} >
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Action Steps
                </Typography>
                <CustomTextField
                  name="actionSteps"
                  placeholder="List actionable tasks or steps required to achieve the goal.
e.g. (1. Conduct daily fitness sessions. 2. Schedule bi-weekly strategy meetings. 3. Introduce personalized training for key players.)"
                  type="text"
                  variant="outlined"
                  multiline
                  rows={2}
                  fullWidth
                  value={formData.actionSteps}
                  onChange={handleChange}
                  error={Boolean(errors.actionSteps)}
                  helperText={errors.actionSteps || ''}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 500 }}
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault()
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={5.5} mt={6} >
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Note
                </Typography>
                <CustomTextField
                  name="note"
                  placeholder="Strategies related to the goal to guide its achievement.
e.g. (Prioritize teamwork drills and study opponent tactics to enhance game strategy.)"
                  type="text"
                  variant="outlined"
                  multiline
                  rows={2}
                  fullWidth
                  value={formData.note}
                  onChange={handleChange}
                  error={Boolean(errors.note)}
                  helperText={errors.note || ''}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 500 }}
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault()
                    }
                  }}
                />
              </Grid>
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "6rem",
              }}
            >
              <Button
                variant="outlined"
                color="error"
                sx={{ marginRight: "1rem" }}
                onClick={() => {
                  router.back();
                }}
                className="cancel-button text-capitalize"
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                size="small"
                onClick={() => handleButtonClick("saveAndNew")}
                loading={goalsTargetsAddData.loading && actionType === "saveAndNew"}
                variant="contained"
                className="save-continue-button text-capitalize"
                sx={{
                  marginRight: "1rem",
                  color: goalsTargetsAddData.loading && actionType === "saveAndNew" ? "white" : "white",
                }}
              >
                {goalsTargetsAddData.loading && actionType === "saveAndNew" ? "" : "Save & New"}

              </LoadingButton>
              <LoadingButton
                type="submit"
                size="small"
                onClick={() => handleButtonClick("save")}
                loading={goalsTargetsAddData.loading && actionType === "save"}
                variant="contained"
                className="save-continue-button text-capitalize save"
              >
                {goalsTargetsAddData.loading && actionType === "save" ? "" : "Save"}
              </LoadingButton>

            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};
export default LongTermGoals;