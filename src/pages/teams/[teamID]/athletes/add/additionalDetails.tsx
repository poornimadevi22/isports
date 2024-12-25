"use client";
import { useEffect, useRef, useState } from "react";
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
  FormControlLabel,
  Radio,
  RadioGroup,
  IconButton,
  Chip,
  MenuItem,
  Select,
  Theme,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { RootState, AppDispatch } from "@/redux/store";
import { formatDates, getLocalStorage, removeLocalStorage, trimFormData } from "@/utils/helper";
import { useRouter } from "next/navigation";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import {
  DROPZONE_IMAGE_NAME_TYPES,
  DROPZONE_IMAGE_FLAG,
  USER_ERROR,
  PDF_FORMAT,
  iconMapping,
  REGEX,
} from "@/utils/constants";
import FileUpload from "@/utils/dropzone";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm } from "react-hook-form";
import { addAthlete, clearAddState } from "@/redux/slices/athlete/athleteAddSlice";
import { editAthlete } from "@/redux/slices/athlete/athleteEditSlice";
import { deleteFile } from "@/redux/slices/fileupload/deleteFile";
import { editStaff } from "@/redux/slices/staff/staffEditSlice";
import CustomDateTimePicker from "@/components/Fields/CustomDateTimePicker";
import moment from "moment";

const CustomTextField = styled(TextField)(({ }) => ({
  height: "40px",
  borderRadius: "4px 0px 0px 0px",
  // opacity: 0,
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
  '& .MuiFormHelperText-root': {
    color: 'red',
    fontSize: '12px',
    fontWeight: 'bold',
    marginTop: '4px',
  }
}));

const SOURCES = [
  "Dubai police Employee",
  "Dubai police Acadamy",
  "External"
];

const PerformanceType = [
  { value: "Hours", label: "Hours" },
  { value: "Daily", label: "Daily" },
];

const PerformanceHours = [
  { label: "1 hour", value: "1 hour" },
  { label: "2 hours", value: "2 hours" },
  { label: "3 hours", value: "3 hours" },
  { label: "4 hours", value: "4 hours" },
  { label: "5 hours", value: "5 hours" },
  { label: "6 hours", value: "6 hours" },
  { label: "7 hours", value: "7 hours" },
  { label: "8 hours", value: "8 hours" },
];

const AdditionalDetails = (props: any) => {
  const { activeStep, setActiveStep, setAllData, allData, editAthleteData, teamId, editPayload, setLoading, setRouteHandel, setDisableRouting } = props;
  const individualCertificateRef = useRef<HTMLInputElement>(null);
  const externalClubCertificateRef = useRef<HTMLInputElement>(null);
  const { handleSubmit, control } = useForm();
  const router = useRouter();
  const [formData, setFormData] = useState<any>({
    source: "",
    policeIDNo: "",
    nationalTeamMember: "",
    externalClubs: "",
    resultsAndAchievements: "",
    individualTrainingPlan: "",
    externalClubsContract: "",
    IndividaulPlans: "",
    permissionType: "",
    permissionTime: "",
    permissionStartDate: "",
    permissionEndDate: ""
  });

  const savedData: any = getLocalStorage("addAthleteData");
  const parsedData = JSON.parse(savedData);
  const dispatch: AppDispatch = useDispatch();
  const athleteAddcertificateData = useSelector(
    (state: RootState) => state.athleteAdd
  );
  const [showBanner, setShowBanner] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");

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

  const onSubmit = () => {
    const newErrors: any = {};
    if (!formData.individualTrainingPlan || _.trim(formData.individualTrainingPlan) === "") {
      newErrors.individualTrainingPlan = "Individual Training Plan is required";
    }
    if (!_.isEmpty(formData.permissionType)) {
      newErrors.permissionStartDate = "PermissionStartDate is required";
      newErrors.permissionEndDate = "PermissionEndDate is required";
    }
    setErrors(newErrors);
    if (_.isEmpty(newErrors)) {
      const { levelCertificate, ...rest } = formData;
      const trimmedRest = trimFormData(rest)
      const data = {
        ...trimmedRest,
        section: "additionaldetails",
        athleteID: parsedData.athleteID,
        loggedUserID: 1,
      };
      dispatch(addAthlete({ url: "/UpdateathleteByID", payload: data }));
    }
  };

  useEffect(() => {
    if (athleteAddcertificateData && athleteAddcertificateData.code === 200) {
      setAlertType("success");
      setAlertMessage("Athlete  member added successfully!");
      dispatch(clearAddState());
      setShowBanner(true);
      removeLocalStorage("addAthleteData");
      setRouteHandel(false)
      setDisableRouting(false)
      setLoading(true)
      setTimeout(() => {
        router.push(`/teams/${teamId}/athletes`);
        setLoading(false)
      }, 2000);
    } else if (
      athleteAddcertificateData &&
      athleteAddcertificateData.code === 500
    ) {
      setAlertType("error");
      setAlertMessage(
        `${athleteAddcertificateData && athleteAddcertificateData.message}`
      );
      setShowBanner(true);
      dispatch(clearAddState());
    }
  }, [athleteAddcertificateData]);

  const handleFileChange = (file: any, flag: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      [flag]: file?.name,
    }));
  };

  const handleClose = () => {
    setShowBanner(false);
  };

  const timeChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const qualifyChange = (event: any) => {
    setFormData({ ...formData, source: event.target.value });
  };


  const handleIndividualClick = () => {
    if (individualCertificateRef.current) {
      individualCertificateRef.current.click();
    }

  };
  const handleExternalClubClick = () => {
    if (externalClubCertificateRef.current) {
      externalClubCertificateRef.current.click();
    }
  };

  const handleBack = () => {
    setAllData((prevFormData: any) => ({
      ...prevFormData,
      Additional: formData,
    }));
    dispatch(editAthlete(editPayload));
    setActiveStep(3)
  }

  const handleDeleteFile = async (modulename: any, moduleId: any, fileType: any) => {
    const fileID = editAthleteData?.attachmentList?.find(
      (item: any) => item.documentSection?.toLowerCase() === fileType.toLowerCase()
    )?.fileID;
    if (fileID) {
      const data = {
        moduleName: modulename,
        moduleID: moduleId,
        docSection: fileType,
        "loggedUserID": 1,
        fileID: fileID
      }
      dispatch(deleteFile(data))
      setFormData((prev: any) => ({
        ...prev,
        [fileType]: "",
      }));
    }
  }

  useEffect(() => {
    if (!_.isEmpty(parsedData?.Additional)) {
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        source: parsedData.Additional.source || '',
        policeIDNo: parsedData.Additional.policeIDNo || '',
        nationalTeamMember: parsedData.Additional.nationalTeamMember || '',
        externalClubs: parsedData.Additional.externalClubs || '',
        resultsAndAchievements: parsedData.Additional.resultsAndAchievements || '',
        individualTrainingPlan: parsedData.Additional.individualTrainingPlan || '',
        externalClubsContract: parsedData.externalClubsContract || '',
        IndividaulPlans: parsedData.IndividaulPlans || '',
        permissionType: parsedData.Additional.permissionType || '',
        permissionTime: parsedData.Additional.permissionTime || '',
        permissionStartDate:  moment(parsedData.Additional.permissionStartDate).format("DD/MM/YYYY hh:mm:ss A"),
        permissionEndDate:  moment(parsedData.Additional.permissionEndDate).format("DD/MM/YYYY hh:mm:ss A"),
      }));
    }
  }, []);

  console.log("Additional", parsedData.Additional)

  const dateChange = (data: any) => {
    setFormData({ ...formData, [data.name]: data.value });
    setErrors({
      ...errors,
      [data.name]: "",
    });
  };


  const getMinDate = () => {
    const contractStart = moment(
      formData.permissionStartDate,
      'DD/MM/YYYY hh:mm:ss A',
      true
    );
    return contractStart.isValid()
      ? contractStart
      : moment().subtract(50, "years");
  };


  return (
    <Grid container spacing={1}>
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
          padding: "2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          width="100%"
          mx={{ sm: 5, md: 1, lg: 1, xl: 5 }}
          px={{ sm: 5, md: 2, lg: 3, xl: 5 }}
        >
          {showBanner && (
            <Snackbar
              open={showBanner}
              onClose={handleClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert
                icon={iconMapping[alertType]}
                onClose={handleClose}
                severity={alertType}
                variant="filled"
              >
                {alertMessage}
              </Alert>
            </Snackbar>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} justifyContent={"space-between"}>
              <Grid item xs={12} md={5.5}>
                <Typography gutterBottom className="typography textfield-label bukra">
                  Source Of recruitment
                </Typography>
                <FormControl variant="outlined" fullWidth className="selectFieldContainer">
                  <Select
                    value={formData.source}
                    onChange={qualifyChange}
                    displayEmpty
                    className="Text-field-customise"
                  >
                    <MenuItem value="" disabled>
                      <Typography variant="body2" color="textSecondary"
                        style={{
                          height: 27,
                          fontFamily: 'Dubai',
                          fontSize: '16px',
                          fontWeight: 500,
                          lineHeight: '25.01px',
                          textAlign: 'left',
                          marginLeft: 4
                        }}
                        className="dubai-med"
                      >
                        Source Of recruitment
                      </Typography>
                    </MenuItem>
                    {SOURCES.map((source: any, index: any) => (
                      <MenuItem key={index} value={source}>
                        <Typography variant="body1" color="textPrimary"
                          style={{
                            height: 27,
                            fontFamily: 'Dubai',
                            fontSize: '16px',
                            fontWeight: 500,
                            lineHeight: '25.01px',
                            textAlign: 'left',
                            marginLeft: 4
                          }}
                          className="dubai-med"
                        >
                          {source}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.source && (
                    <Typography variant="caption" className="error-message">
                      {errors.source}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Police ID Number
                </Typography>
                <CustomTextField
                  name="policeIDNo"
                  placeholder="Enter policeID Number"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.policeIDNo}
                  onChange={handleChange}
                  className="Text-field-customise"
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault()
                    }
                  }}
                  inputProps={{ maxLength: 20 }}
                />
              </Grid>

              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  National Team Member
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    name="nationalTeamMember"
                    value={formData.nationalTeamMember}
                    onChange={handleChange}
                    row
                  >
                    <FormControlLabel
                      value="Y"
                      control={<Radio />}
                      label="Yes"
                      className="dubai-med textfield-label"
                    />
                    <FormControlLabel
                      value="N"
                      control={<Radio />}
                      label="No"
                      className="dubai-med textfield-label"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>


              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  External Clubs
                </Typography>
                <CustomTextField
                  name="externalClubs"
                  placeholder="Enter External Clubs"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.externalClubs}
                  onChange={handleChange}
                  className="Text-field-customise"
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_CHARS_SPACE.test(e.key)) {
                      e.preventDefault()
                    }
                  }}
                  inputProps={{ maxLength: 50 }}
                />
                <Grid
                  container
                  spacing={1}
                  justifyContent="start"
                  alignItems="center"
                  mt={1}
                >
                  <Grid alignItems="flex-start">
                    <IconButton
                      className="attachFileButton"
                      component="label"
                      aria-label="attach-file"
                      sx={{
                        color: "#ef0a0a",
                        "&:hover": {
                          backgroundColor: "rgba(255, 0, 0, 0.1)",
                        },
                        padding: 1,
                      }}
                    >
                      <FileUpload
                        onFileChange={(file: any, flag: any) =>
                          handleFileChange(file, flag)
                        }
                        formatType={PDF_FORMAT}
                        type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                        flag={DROPZONE_IMAGE_FLAG.EXTERNAL_CLUBS}
                        setData={setFormData}
                        formData={formData}
                        modulename="Athlete"
                        moduleId={parsedData.athleteID}
                        fileInputRef={externalClubCertificateRef}
                        fetchDataApi={() => dispatch(editStaff(editPayload))}
                      />
                      <AttachFileSharpIcon />
                    </IconButton>
                  </Grid>
                  <Grid>
                    <Box display="flex" alignItems="center">
                      <Typography
                        align="center"
                        color="error"
                        className="dubai-med upload-label"
                        onClick={handleExternalClubClick}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        {formData.externalClubsContract ? (
                          <>{formData.externalClubsContract}</>
                        ) : (
                          <>Upload Contracts: PDF format(max size 25 MB)</>
                        )}
                      </Typography>
                      {formData.externalClubsContract && (
                        <IconButton
                          className="deleteIconButton"
                          aria-label="delete"
                          onClick={() => {
                            handleDeleteFile("Athlete", parsedData?.athleteID, "externalClubsContract");
                            setFormData((prev: any) => ({
                              ...prev,
                              externalClubsContract: "",
                            }));
                          }}
                          sx={{
                            color: "#ef0a0a",
                            "&:hover": {
                              backgroundColor: "rgba(255, 0, 0, 0.1)",
                            },
                            padding: 1,
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Permission Type
                </Typography>
                <FormControl
                  variant="outlined"
                  fullWidth
                  className="selectFieldContainer"
                >
                  <Select
                    value={formData.permissionType}
                    onChange={timeChange}
                    name="permissionType"
                    displayEmpty
                    className="Text-field-customise"
                  >
                    <MenuItem value="" disabled>
                      <Typography
                        variant="body2"
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
                        Select Permission Type
                      </Typography>
                    </MenuItem>
                    {PerformanceType.map((option) => (
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
                </FormControl>
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Permission Time
                </Typography>
                <FormControl
                  variant="outlined"
                  fullWidth
                  className="selectFieldContainer"
                >
                  <Select
                    value={formData.permissionTime}
                    onChange={timeChange}
                    name="permissionTime"
                    displayEmpty
                    className="Text-field-customise"
                  >
                    <MenuItem value="" disabled>
                      <Typography
                        variant="body2"
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
                        Select Hours
                      </Typography>
                    </MenuItem>
                    {PerformanceHours.map((option) => (
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
                </FormControl>
              </Grid>

              <Grid container item xs={12} md={5.5} spacing={2} mt={0}>
                <Grid item xs={12}>
                  <Typography gutterBottom className="typography textfield-label bukra">
                  Permission Start Date 
                  {
                    formData.permissionType ? <span className="asterisk">*</span> : null
                  }
                  </Typography>
                  <CustomDateTimePicker
                    control={control}
                    hidden={true}
                    name="permissionStartDate"
                    label="Contract Start Date"
                    boxmb={0.8}
                    required={true}
                    minDate={moment()}
                    maxDate={moment().add(10, 'years')}
                    onChange={dateChange}
                    defaultValue={formData && formData.permissionStartDate}
                  />
                  {errors.permissionStartDate && (
                    <Typography variant="caption" className="error-message" mt={2}>
                      {errors.permissionStartDate}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid container item xs={12} md={5.5} spacing={2} mt={0}>
                <Grid item xs={12}>
                  <Typography gutterBottom className="typography textfield-label bukra">
                  Permission End Date 
                  {
                    formData.permissionType ? <span className="asterisk">*</span> : null
                  }
                  </Typography>
                  <CustomDateTimePicker
                    control={control}
                    hidden={true}
                    name="permissionEndDate"
                    label="Contract End Date"
                    boxmb={0.8}
                    required={true}
                    minDate={getMinDate()}
                    maxDate={moment().add(10, 'years')}
                    onChange={dateChange}
                    defaultValue={formData && formData.permissionEndDate}
                  />
                  {errors.permissionEndDate && (
                    <Typography variant="caption" className="error-message" mt={2}>
                      {errors.permissionEndDate}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Results And Achievements
                </Typography>
                <CustomTextField
                  name="resultsAndAchievements"
                  placeholder="Enter Results And Achievements"
                  type="text"
                  variant="outlined"
                  multiline
                  rows={3}
                  fullWidth
                  value={formData.resultsAndAchievements}
                  onChange={handleChange}
                  className="Text-field-customise"
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault()
                    }
                  }}
                  inputProps={{ maxLength: 300 }}
                />
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Individual Training Plan <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="individualTrainingPlan"
                  placeholder="Enter Individual Training Plan"
                  type="text"
                  variant="outlined"
                  multiline
                  rows={3}
                  fullWidth
                  value={formData.individualTrainingPlan}
                  onChange={handleChange}
                  error={Boolean(errors.individualTrainingPlan)}
                  helperText={errors.individualTrainingPlan || ''}
                  className="Text-field-customise"
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault()
                    }
                  }}
                  inputProps={{ maxLength: 500 }}
                />
                {errors.individualTrainingPlan && (
                  <Typography variant="caption" mb={2} />
                )}
              </Grid>
              <Grid item xs={12} md={5.5} />
              <Grid item xs={12} md={5.5} >
                <Grid
                  container
                  spacing={1}
                  justifyContent="start"
                  alignItems="center"
                  mt={12}
                >
                  <Grid alignItems="flex-start">
                    <IconButton
                      className="attachFileButton"
                      component="label"
                      aria-label="attach-file"
                      sx={{
                        color: "#ef0a0a",
                        "&:hover": {
                          backgroundColor: "rgba(255, 0, 0, 0.1)",
                        },
                        padding: 1,
                      }}
                    >
                      <FileUpload
                        onFileChange={(file: any, flag: any) =>
                          handleFileChange(file, flag)
                        }
                        formatType={PDF_FORMAT}
                        type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                        flag={DROPZONE_IMAGE_FLAG.INDIVIDUAL_PLANS}
                        setData={setFormData}
                        formData={formData}
                        modulename="Athlete"
                        moduleId={parsedData.athleteID}
                        fileInputRef={individualCertificateRef}
                      />
                      <AttachFileSharpIcon />
                    </IconButton>
                  </Grid>
                  <Grid>
                    <Box display="flex" alignItems="center">
                      <Typography
                        align="center"
                        color="error"
                        className="dubai-med upload-label"
                        onClick={handleIndividualClick}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        {formData.IndividaulPlans ? (
                          <>{formData.IndividaulPlans}</>
                        ) : (
                          <>Upload Individual Training Plan: PDF format (max size 25 MB)</>
                        )}
                      </Typography>
                      {formData.IndividaulPlans && (
                        <IconButton
                          className="deleteIconButton"
                          aria-label="delete"
                          onClick={() => {
                            handleDeleteFile("Athlete", parsedData?.athleteID, "IndividaulPlans");
                            setFormData((prev: any) => ({
                              ...prev,
                              IndividaulPlans: "",
                            }));
                          }}
                          sx={{
                            color: "#ef0a0a",
                            "&:hover": {
                              backgroundColor: "rgba(255, 0, 0, 0.1)",
                            },
                            padding: 1,
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "7rem",
              }}
            >
              <Button
                variant="outlined"
                color="error"
                sx={{ marginRight: "1rem" }}
                onClick={() => { handleBack() }}
                className="text-capitalize"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                className="save-continue-button text-capitalize"
                disabled={athleteAddcertificateData.loading}
              >
                {athleteAddcertificateData.loading ? "Loading..." : "Finish"}
              </Button >
            </Box >
          </form >
        </Box >
      </Grid >
    </Grid >
  );
};
export default AdditionalDetails;