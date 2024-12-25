"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
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
  Fade,
  Select,
  MenuItem,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { AppDispatch, RootState } from "@/redux/store";
import { getLocalStorage, trimFormData } from "@/utils/helper";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import {
  DROPZONE_IMAGE_NAME_TYPES,
  DROPZONE_IMAGE_FLAG,
  FILE_FORMAT_TYPE_DOCUMENT,
  REGEX,
} from "@/utils/constants";
import FileUpload from "@/utils/dropzone";
import { addStaff, clearAddState } from "@/redux/slices/staff/staffAddSlice";
import { editStaff } from "@/redux/slices/staff/staffEditSlice";
import { deleteFile } from "@/redux/slices/fileupload/deleteFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { EducationFormValidation } from "@/utils/staffs/validation";

const CustomTextField = styled(TextField)(({ theme }) => ({
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
}));

interface FormData {
  fieldOfStudy: string;
  assignedAthletesOrTeams: string;
  coachingExperience: string;
  previousAthleteExperience: string;
  achievementsAsCoach: string;
  organizationalSkills: string;
  leadershipSkills: string;
  punctualityInMeetings: string;
  availabilityOnTraining: string;
  uploadCertificate: string;
  notesAdditionalInfo: string;
  computerSkills: string;
}

const EducationandExperience = (props: any) => {
  const router = useRouter();
  const { teamID } = router.query;
  const { activeStep, setActiveStep, setAllData, allData, editStaffData, filepayload } = props;
  const savedData: any = getLocalStorage("addStaffData");
  const parsedData = JSON.parse(savedData);
  const dispatch: AppDispatch = useDispatch();
  const staffAddeducationData = useSelector(
    (state: RootState) => state.staffAdd
  );
  const uploadCertificateRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<any>({
    academicQualification: '',
    fieldOfStudy: '',
    coachingExperience: '',
    previousAthleteExperience: '',
    achievementsAsCoach: '',
    organizationalSkills: '',
    leadershipSkills: '',
    computerSkills: '',
  });

  type FormErrors = {
    academicQualification?: string;
    fieldOfStudy: string;
    coachingExperience: string;
    previousAthleteExperience: string;
    achievementsAsCoach: string;
    organizationalSkills: string;
    leadershipSkills: string;
    computerSkills: string;
  };


  const [errors, setErrors] = useState<any>({});
  const [showBanner, setShowBanner] = useState(false);
  const { validate } = EducationFormValidation(formData, setErrors);
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

  const handlepassClick = () => {
    if (uploadCertificateRef.current) {
      uploadCertificateRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { uploadCertificate, ...rest } = formData;
    const trimmedRest = trimFormData(rest);
    const validationErrors = validate();
    if (_.isEmpty(validationErrors)) {
      const data = {
        ...trimmedRest,
        section: "educationdetails",
        staffID: parsedData.staffID,
        loggedUserID: 1,
      };
      dispatch(addStaff({ url: "/UpdateStaffByID", payload: data }));
    }
  };



  useEffect(() => {
    if (staffAddeducationData && staffAddeducationData.code === 200) {
      const { uploadCertificate, ...rest } = formData;
      setAllData((prevFormData: any) => ({
        ...prevFormData,
        educationdetails: rest,
      }));
      const payload: any = {
        staffID: parsedData.staffID,
        sportID: teamID
      };
      dispatch(editStaff(payload));
      dispatch(clearAddState());
      setShowBanner(false);
      setActiveStep(4);
    } else if (staffAddeducationData && staffAddeducationData.code === 500) {
      setShowBanner(true);
    }
  }, [staffAddeducationData]);

  const handleFileChange = (file: any, flag: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      uploadCertificate: file?.name,
    }));
  };

  useEffect(() => {
    if (parsedData.educationdetails) {
      setFormData((formData: any) => ({
        ...formData,
        fieldOfStudy: parsedData.educationdetails.fieldOfStudy || "",
        assignedAthletesOrTeams:
          parsedData.educationdetails.assignedAthletesOrTeams || "",
        coachingExperience:
          parsedData.educationdetails.coachingExperience || "",
        previousAthleteExperience:
          parsedData.educationdetails.previousAthleteExperience || "",
        achievementsAsCoach:
          parsedData.educationdetails.achievementsAsCoach || "",
        organizationalSkills:
          parsedData.educationdetails.organizationalSkills || "",
        leadershipSkills: parsedData.educationdetails.leadershipSkills || "",
        punctualityInMeetings:
          parsedData.educationdetails.punctualityInMeetings || "",
        availabilityOnTraining:
          parsedData.educationdetails.availabilityOnTraining || "",
        notesAdditionalInfo:
          parsedData.educationdetails.notesAdditionalInfo || "test",
        computerSkills: parsedData.educationdetails.computerSkills || "test",
        uploadCertificate: parsedData.uploadCertificate || "",
        employeeCertificate: parsedData.educationdetails.employeeCertificate || "",
        academicQualification: parsedData.educationdetails.academicQualification || "",
      }));
    }
  }, []);

  const handleDeleteFile = async (modulename: any, moduleId: any, fileType: any) => {
    const fileID = editStaffData?.attachmentList?.find(
      (item: any) => item.documentSection?.toLowerCase() === fileType.toLowerCase()
    )?.fileID;
    if (moduleId) {
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
        uploadCertificate: "",
      }));
    }
  }

  const handleBack = () => {
    setAllData((prevFormData: any) => ({
      ...prevFormData,
      educationdetails: formData
    }))
    setActiveStep(2)
  };
  const qualifyChange = (event: any) => {
    setFormData({ ...formData, academicQualification: event.target.value });
  };

  const qualificationOptions = [
    { value: 'bachelor', label: 'Bachelor’s Degree' },
    { value: 'master', label: 'Master’s Degree' },
    { value: 'phd', label: 'Ph.D.' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'highschool', label: 'High School' },
  ];

  return (
    <Fade in={true} timeout={1000}>
      <Grid container spacing={0}>
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
            <form onSubmit={handleSubmit}>
              {showBanner &&
                staffAddeducationData &&
                !_.isEmpty(staffAddeducationData.message) && (
                  <Snackbar
                    open={showBanner}
                    autoHideDuration={3000}
                    onClose={() => setShowBanner(false)}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <Alert
                      onClose={() => setShowBanner(false)}
                      severity="error"
                      variant="filled"
                    >
                      {staffAddeducationData && staffAddeducationData.message}
                    </Alert>
                  </Snackbar>
                )}
              <Grid container spacing={2} justifyContent={"space-between"}>
                <Grid item xs={12} md={5.5}>
                  <Typography gutterBottom className="typography textfield-label bukra">
                    Academic Qualification
                    <span className="asterisk">*</span>
                  </Typography>
                  <FormControl variant="outlined" fullWidth className="selectFieldContainer">
                    <Select
                      value={formData.academicQualification}
                      onChange={qualifyChange}
                      displayEmpty
                      className="Text-field-customise"
                    >
                      <MenuItem value="" disabled>
                        <Typography variant="body2" color="textSecondary">
                          Select Academic Qualification
                        </Typography>
                      </MenuItem>
                      {qualificationOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          <Typography variant="body1" color="textPrimary">
                            {option.label}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.academicQualification && (
                      <Typography variant="caption" className="error-message">
                        {errors.academicQualification}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={5.5}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Field of Study
                  </Typography>
                  <CustomTextField
                    name="fieldOfStudy"
                    placeholder="Enter Field of Study"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.fieldOfStudy}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 50 }}
                    onKeyPress={(e) => {
                      if (!REGEX.TEXT.test(e.key)) {
                        e.preventDefault()
                      }
                    }}
                  />
                  {errors.fieldOfStudy && (
                    <Typography variant="caption" className="error-message">
                      {errors.fieldOfStudy}
                    </Typography>
                  )}
                  <Grid
                    container
                    spacing={1}
                    justifyContent="start"
                    alignItems="center"
                    mt={1}
                  >
                    <Grid alignItems="flex-start" p={0}>
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
                          onFileChange={(
                            file: any,
                            flag: any,
                          ) => handleFileChange(file, flag)}
                          formatType={FILE_FORMAT_TYPE_DOCUMENT}
                          type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                          
                          flag={DROPZONE_IMAGE_FLAG.EMPLOYEE_CERTIFICATE}
                          modulename="Staff"
                          moduleId={parsedData.staffID}
                          setData={setFormData}
                          formData={formData}
                          fileInputRef={uploadCertificateRef}
                          fetchDataApi={() => dispatch(editStaff(filepayload))}
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
                          onClick={handlepassClick}
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          {formData.uploadCertificate ? (
                            <>{formData.uploadCertificate}</>
                          ) : (
                            <>Upload Certificate: Upload (PDF, DOC, DOCX)</>
                          )}
                        </Typography>
                        {formData.uploadCertificate && (
                          <IconButton
                            className="deleteIconButton"
                            aria-label="delete"
                            onClick={() => { handleDeleteFile("Staff", parsedData.staffID, "Certificate") }}
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
                    Coaching Experience
                  </Typography>
                  <CustomTextField
                    name="coachingExperience"
                    placeholder="Enter Coaching Experience"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.coachingExperience}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 200 }}
                    onKeyPress={(e) => {
                      if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                        e.preventDefault()
                      }
                    }}
                  />
                  {errors.coachingExperience && (
                    <Typography variant="caption" className="error-message">
                      {errors.coachingExperience}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.5}

                >
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Previous Athlete Experience
                  </Typography>
                  <CustomTextField
                    name="previousAthleteExperience"
                    placeholder="Enter Previous Athlete Experience"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.previousAthleteExperience}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 200 }}
                    onKeyPress={(e) => {
                      if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                        e.preventDefault()
                      }
                    }}
                  // sx={{marginBottom:'20px'}}
                  />
                  {errors.previousAthleteExperience && (
                    <Typography variant="caption" className="error-message">
                      {errors.previousAthleteExperience}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.5}

                >
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Achievements as Coach
                  </Typography>
                  <CustomTextField
                    name="achievementsAsCoach"
                    placeholder="Enter Achievements as Coach"
                    variant="outlined"
                    multiline
                    rows={5}
                    fullWidth
                    value={formData.achievementsAsCoach}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 200 }}
                    onKeyPress={(e) => {
                      if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                        e.preventDefault()
                      }
                    }}
                    sx={{ marginBottom: '100px' }}
                  />
                  {errors.achievementsAsCoach && (
                    <Typography variant="caption" className="error-message">
                      {errors.achievementsAsCoach}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.5}

                >
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Organizational Skills
                  </Typography>
                  <CustomTextField
                    name="organizationalSkills"
                    placeholder="Enter Organizational Skills"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.organizationalSkills}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 200 }}
                    onKeyPress={(e) => {
                      if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                        e.preventDefault()
                      }
                    }}
                  />
                  {errors.organizationalSkills && (
                    <Typography variant="caption" className="error-message">
                      {errors.organizationalSkills}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} md={5.5}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Leadership Skills
                  </Typography>
                  <CustomTextField
                    name="leadershipSkills"
                    placeholder="Enter Leadership Skills"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.leadershipSkills}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 200 }}
                    onKeyPress={(e) => {
                      if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                        e.preventDefault()
                      }
                    }}
                  />
                  {errors.leadershipSkills && (
                    <Typography variant="caption" className="error-message">
                      {errors.leadershipSkills}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.5}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Computer Skills
                  </Typography>
                  <CustomTextField
                    name="computerSkills"
                    placeholder="Enter Leadership Skills"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.computerSkills}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 200 }}
                    onKeyPress={(e) => {
                      if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                        e.preventDefault()
                      }
                    }}
                  />
                  {errors.computerSkills && (
                    <Typography variant="caption" className="error-message">
                      {errors.computerSkills}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "1.5rem",
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
                  disabled={staffAddeducationData.loading}
                >
                  {staffAddeducationData.loading
                    ? "Loading..."
                    : "Save & Continue"}
                </Button>
              </Box>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Fade>
  );
};
export default EducationandExperience;