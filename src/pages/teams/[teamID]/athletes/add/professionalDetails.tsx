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
  IconButton,
  FormControl,
  MenuItem,
  Select,
  Theme,
  Chip,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import {
  DROPZONE_IMAGE_NAME_TYPES,
  DROPZONE_IMAGE_FLAG,
  REGEX,
  PDF_FORMAT,
} from "@/utils/constants";
import FileUpload from "@/utils/dropzone";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import { useForm } from "react-hook-form";
import moment from "moment";
import { formatDates, getLocalStorage, trimFormData } from "@/utils/helper";
import {
  addAthlete,
  clearAddState,
} from "@/redux/slices/athlete/athleteAddSlice";
import CancelIcon from "@mui/icons-material/Cancel";
import { ProfessionalFormValidation } from "@/utils/athletes/validation";
import { editAthlete } from "@/redux/slices/athlete/athleteEditSlice";
import { deleteFile } from "@/redux/slices/fileupload/deleteFile";
import theme from "../../../../../utils/theme";

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

const names = [
  "Arabic",
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Russian",
  "Italian",
  "Portuguese",
];

const qualificationOptions = [
  { value: "bachelor", label: "Bachelor’s Degree" },
  { value: "master", label: "Master’s Degree" },
  { value: "phd", label: "Ph.D." },
  { value: "diploma", label: "Diploma" },
  { value: "highschool", label: "High School" },
];

const employmentStatus = [
  { value: "Permanent Contract", label: "Permanent Contract" },
  { value: "Collaboration Contract", label: "Collaboration Contract" },
  { value: "Temporary Contract", label: "Temporary Contract" },
];

const Performance = [
  { value: "beginner", label: "Beginner" },
  { value: "professional", label: "Professional" },
  { value: "intermediate", label: "Intermediate" },
];

const Contract = [
  { value: "Full-time", label: "Full-time" },
  { value: "Temprorary", label: "Temprorary" },
  { value: "Collabrative", label: "Collabrative" },
];

const SportCategory = [
  { value: "elite", label: "Elite" },
  { value: "amature", label: "Amature" },
  { value: "junior", label: "Junior" },
];

interface FormData {
  academicQualification: string;
  currentJobPosition: string;
  currentJobLocation: string;
  dpEmployeeNumber: string;
  rank: string;
  dateOfLastJobPromotion: string;
  department: string;
  dpEmploymentStatus: string;
  contractStartDate: string;
  contractEndDate: string;
  uploadContract: string;
  role: string;
  uploadDegree: string;
  languagesSpoken: string;
  performanceLevel: string;
  sportsCategory: string;
  pledgeDate: string;
  acknowledgementDate: string;
  disciplinePracticed: string;
  contractType: string;
}

type FormErrors = {
  academicQualification?: string;
  currentJobPosition?: string;
  currentJobLocation?: string;
  dpEmployeeNumber?: string;
  department?: string;
  rank?: string;
  dateOfLastJobPromotion?: string;
  dpEmploymentStatus?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  role?: string;
  uploadDegree?: string;
  performanceLevel?: string;
  sportsCategory?: string;
  acknowledgementDate?: string;
  pledgeDate?: string;
  disciplinePracticed?: string;
  contractType?: string;
};

const ProfessionalDetails = (props: any) => {
  const { setActiveStep, setAllData, teamId, editAthleteData, editPayload } =
    props;
  const { handleSubmit, control } = useForm();
  const dispatch: AppDispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>({
    academicQualification: "",
    currentJobPosition: "",
    currentJobLocation: "",
    dpEmployeeNumber: "",
    rank: "",
    dateOfLastJobPromotion: "",
    department: "",
    dpEmploymentStatus: "",
    contractStartDate: "",
    contractEndDate: "",
    uploadContract: "",
    role: "",
    uploadDegree: "",
    languagesSpoken: "",
    performanceLevel: "",
    sportsCategory: "",
    pledgeDate: "",
    acknowledgementDate: "",
    disciplinePracticed: "",
    contractType: ""
  });

  function getStyles(name: string, personName: string, theme: Theme) {
    const selectedNames = personName.split(",");
    return {
      fontWeight: selectedNames
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
    };
  }

  const [errors, setErrors] = useState<FormErrors>({});
  const { validate } = ProfessionalFormValidation(formData, setErrors);
  const [showBanner, setShowBanner] = useState(false);
  const savedData: any = getLocalStorage("addAthleteData");
  const parsedData = JSON.parse(savedData);
  const athleteAddEmployementData = useSelector(
    (state: RootState) => state.athleteAdd
  );
  const filecertificateRef = useRef<HTMLInputElement>(null);
  const fileContractDocumentRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({
      ...errors,
      [name]: "",
    });
    if (name === "dateOfLastJobPromotion" && value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        dateOfLastJobPromotion: "",
      }));
    }
  };

  const onSubmit = async () => {
    const validationErrors = validate();
    if (_.isEmpty(validationErrors)) {
      const { uploadContract, ...rest } = formData;
      const trimmedRest = trimFormData(rest);
      const data = {
        ...trimmedRest,
        dateOfLastJobPromotion: moment(
          formData.dateOfLastJobPromotion,
          "DD/MM/YYYY"
        ).format("DD/MM/YYYY"),
        contractStartDate: moment(
          formData.contractStartDate,
          "DD/MM/YYYY"
        ).format("DD/MM/YYYY"),
        contractEndDate: moment(formData.contractEndDate, "DD/MM/YYYY").format(
          "DD/MM/YYYY"
        ),
        acknowledgementDate: moment(
          formData.acknowledgementDate,
          "DD/MM/YYYY"
        ).format("DD/MM/YYYY"),
        pledgeDate: moment(formData.pledgeDate, "DD/MM/YYYY").format(
          "DD/MM/YYYY"
        ),
        section: "professionaldetails",
        athleteID: parsedData.athleteID,
        loggedUserID: "1",
      };
      dispatch(addAthlete({ url: "/UpdateathleteByID", payload: data }));
    }
  };

  useEffect(() => {
    if (athleteAddEmployementData && athleteAddEmployementData.code === 200) {
      setAllData((prevFormData: any) => ({
        ...prevFormData,
        professionaldetails: formData,
      }));
      dispatch(clearAddState());
      setActiveStep(3);
      dispatch(editAthlete(editPayload));
    } else if (
      athleteAddEmployementData &&
      athleteAddEmployementData.code === 500
    ) {
      setShowBanner(true);
    }
  }, [athleteAddEmployementData]);

  function formatDatesWithCheck(date: any): string {
    console.log("date:", date);
    if (!date || date === "Invalid date format") {
      return "";
    }
    return formatDates(date);
  }

  useEffect(() => {
    if (!_.isEmpty(parsedData?.professionaldetails)) {
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        academicQualification:
          parsedData.professionaldetails.academicQualification || "",
        currentJobPosition:
          parsedData.professionaldetails.currentJobPosition || "",
        currentJobLocation:
          parsedData.professionaldetails.currentJobLocation || "",
        dpEmployeeNumber: parsedData.professionaldetails.dpEmployeeNumber || "",
        rank: parsedData.professionaldetails.rank || "",
        department: parsedData.professionaldetails.department || "",
        dpEmploymentStatus:
          parsedData.professionaldetails.dpEmploymentStatus || "",
        role: parsedData.professionaldetails.role || "",
        languagesSpoken: parsedData.professionaldetails.languagesSpoken || "",
        performanceLevel: parsedData.professionaldetails.performanceLevel || "",
        sportsCategory: parsedData.professionaldetails.sportsCategory || "",
        disciplinePracticed:
          parsedData.professionaldetails.disciplinePracticed || "",
        dateOfLastJobPromotion: formatDatesWithCheck(
          parsedData.professionaldetails.dateOfLastJobPromotion
        ),
        contractStartDate: formatDatesWithCheck(
          parsedData.professionaldetails.contractStartDate
        ),
        contractEndDate: formatDatesWithCheck(
          parsedData.professionaldetails.contractEndDate
        ),
        pledgeDate: formatDatesWithCheck(
          parsedData.professionaldetails.pledgeDate
        ),
        acknowledgementDate: formatDatesWithCheck(
          parsedData.professionaldetails.acknowledgementDate
        ),
        uploadDegree: parsedData.certificate || "",
        uploadContract: parsedData.contractDocument || "",
        contractType: parsedData.professionaldetails.contractType || "",
      }));
    }
  }, []);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowBanner(false);
  };

  const qualifyChange = (event: any) => {
    setFormData({ ...formData, academicQualification: event.target.value });
    setErrors({
      ...errors,
      academicQualification: "",
    });
  };

  const policyStatusChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleFileChange = (file: any, flag: any) => {
    setFormData((prevData) => ({
      ...prevData,
      uploadContract:
        flag === DROPZONE_IMAGE_FLAG.UPLOAD_CONTRACT
          ? file?.name
          : prevData.uploadContract,
      uploadDegree:
        flag === DROPZONE_IMAGE_FLAG.EMPLOYEE_CERTIFICATE
          ? file?.name
          : prevData.uploadDegree,
    }));
  };

  const dateChange = (data: any) => {
    setFormData({ ...formData, [data.name]: data.value });
    const validationErrors = validate();
    setErrors({
      ...errors,
      [data.name]: validationErrors[data.name] && "",
    });
  };

  const handleBack = () => {
    setAllData((prevFormData: any) => ({
      ...prevFormData,
      professionaldetails: formData,
    }));
    const payload: any = {
      athleteID: parsedData.athleteID,
      sportID: teamId,
    };
    dispatch(editAthlete(payload));
    setActiveStep(1);
  };

  const getMinDate = () => {
    const contractStart = moment(
      formData.contractStartDate,
      "DD/MM/YYYY",
      true
    );
    return contractStart.isValid()
      ? contractStart
      : moment().subtract(50, "years");
  };

  const handleDeleteFile = async (
    modulename: any,
    moduleId: any,
    fileType: any
  ) => {
    const fileID = editAthleteData?.attachmentList?.find(
      (item: any) =>
        item.documentSection?.toLowerCase() === fileType.toLowerCase()
    )?.fileID;
    if (fileID) {
      const data = {
        moduleName: modulename,
        moduleID: moduleId,
        docSection: fileType,
        loggedUserID: 1,
        fileID: fileID,
      };
      dispatch(deleteFile(data));
      setFormData((prev) => ({
        ...prev,
        [fileType]: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [fileType]: "",
      }));
    }
  };

  const handlecertificateClick = () => {
    if (filecertificateRef.current) {
      filecertificateRef.current.click();
    }
  };

  const handleContractDocumentClick = () => {
    if (fileContractDocumentRef.current) {
      fileContractDocumentRef.current.click();
    }
  };

  const langOnchange = (event: any) => {
    const {
      target: { value },
    } = event;
    const selectedLanguages = value as string[];
    setFormData({
      ...formData,
      languagesSpoken: selectedLanguages.join(","),
    });
  };

  const handleDelete = (language: string) => {
    const updatedLanguages = formData.languagesSpoken
      .split(",")
      .filter((item) => item.trim() !== language.trim())
      .join(",");
    setFormData({
      ...formData,
      languagesSpoken: updatedLanguages,
    });
  };

  return (
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
          <form onSubmit={handleSubmit(onSubmit)}>
            {showBanner &&
              athleteAddEmployementData &&
              !_.isEmpty(athleteAddEmployementData.message) && (
                <Snackbar
                  open={showBanner}
                  autoHideDuration={6000}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="filled"
                  >
                    {athleteAddEmployementData &&
                      athleteAddEmployementData.message}
                  </Alert>
                </Snackbar>
              )}
            <Grid container spacing={2} justifyContent={"space-between"}>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Role on Team <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="role"
                  placeholder="Enter Role"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.role}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                  onKeyPress={(e) => {
                    if (!REGEX.TEXT.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.role && (
                  <Typography variant="caption" className="error-message">
                    {errors.role}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Academic Qualification <span className="asterisk">*</span>
                </Typography>
                <FormControl
                  variant="outlined"
                  fullWidth
                  className="selectFieldContainer"
                >
                  <Select
                    value={formData.academicQualification}
                    onChange={qualifyChange}
                    displayEmpty
                    className="Text-field-customise"
                  >
                    <MenuItem value="" disabled>
                      <Typography variant="body2" color="textSecondary" className="dubai-med">
                        Select current job location Qualification
                      </Typography>
                    </MenuItem>
                    {qualificationOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Typography variant="body1" color="textPrimary" className="dubai-med">
                          {option.label}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.academicQualification && (
                  <Typography
                    variant="caption"
                    className="error-message"
                    mb={2}
                  >
                    {errors.academicQualification}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={0} md={5.5} />
              <Grid
                xs={12}
                md={5.5}
                container
                spacing={0}
                justifyContent="start"
                alignItems="center"
              >
                <Grid item alignItems="flex-start">
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
                      flag={DROPZONE_IMAGE_FLAG.EMPLOYEE_CERTIFICATE}
                      setData={setFormData}
                      formData={formData}
                      modulename="Athlete"
                      moduleId={parsedData.athleteID}
                      fileInputRef={filecertificateRef}
                      fetchDataApi={() => dispatch(editAthlete(editPayload))}
                    />
                    <AttachFileSharpIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <Box display="flex" alignItems="center">
                    <Typography
                      align="center"
                      color="error"
                      className="dubai-med upload-label"
                      onClick={handlecertificateClick}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      {formData.uploadDegree ? (
                        <>{formData.uploadDegree}</>
                      ) : (
                        <>
                          Upload Degree Certificate: PDF format (max size 25 MB)
                        </>
                      )}
                    </Typography>
                    {formData.uploadDegree && (
                      <IconButton
                        className="deleteIconButton"
                        aria-label="delete"
                        onClick={() => {
                          handleDeleteFile(
                            "Athlete",
                            parsedData?.athleteID,
                            "Certificate"
                          );
                          setFormData((prev) => ({
                            ...prev,
                            uploadDegree: "",
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
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Current Job Position <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="currentJobPosition"
                  placeholder="Enter Current Job Position"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.currentJobPosition}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 200 }}
                  onKeyPress={(e) => {
                    if (!REGEX.TEXT.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.currentJobPosition && (
                  <Typography variant="caption" className="error-message">
                    {errors.currentJobPosition}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Current Job Location <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="currentJobLocation"
                  placeholder="Enter Current Job Location"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.currentJobLocation}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                  onKeyPress={(e) => {
                    if (!REGEX.TEXT.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.currentJobLocation && (
                  <Typography variant="caption" className="error-message">
                    {errors.currentJobLocation}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Dubai Police Employee Number{" "}
                  <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="dpEmployeeNumber"
                  placeholder="Enter Dubai Police Employee Number"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.dpEmployeeNumber}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 20 }}
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.dpEmployeeNumber && (
                  <Typography variant="caption" className="error-message">
                    {errors.dpEmployeeNumber}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Rank <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="rank"
                  placeholder="Enter Rank"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.rank}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.rank && (
                  <Typography variant="caption" className="error-message">
                    {errors.rank}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Department <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="department"
                  placeholder="Enter Department"
                  type="tel"
                  variant="outlined"
                  fullWidth
                  value={formData.department}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 100 }}
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_CHARS_SPACE.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.department && (
                  <Typography variant="caption" className="error-message">
                    {errors.department}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Sports Category <span className="asterisk">*</span>
                </Typography>
                <FormControl
                  variant="outlined"
                  fullWidth
                  className="selectFieldContainer"
                >
                  <Select
                    value={formData.sportsCategory}
                    onChange={policyStatusChange}
                    name="sportsCategory"
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
                          marginLeft: 4,
                        }}
                        className="dubai-med"
                      >
                        Select Sports Category
                      </Typography>
                    </MenuItem>
                    {SportCategory.map((option) => (
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
                            marginLeft: 4,
                          }}
                          className="dubai-med"
                        >
                          {option.label}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.sportsCategory && (
                  <Typography
                    variant="caption"
                    className="error-message"
                    mb={1}
                  >
                    {errors.sportsCategory}
                  </Typography>
                )}
              </Grid>
              <Grid container item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Date of Last Job Promotion
                </Typography>
                <CustomDatePicker
                  control={control}
                  name="dateOfLastJobPromotion"
                  // label="Date of Last Job Promotion"
                  boxmb={0.8}
                  required={false}
                  minDate={moment().subtract(50, "years")}
                  maxDate={moment()}
                  onChange={dateChange}
                  hidden={true}
                  defaultValue={formData && formData.dateOfLastJobPromotion}
                  className="Text-field-customise"
                />
                {errors.dateOfLastJobPromotion && (
                  <Typography variant="caption" className="error-message">
                    {errors.dateOfLastJobPromotion}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Dubai Police Employment Status{" "}
                  <span className="asterisk">*</span>
                </Typography>
                <FormControl
                  variant="outlined"
                  fullWidth
                  className="selectFieldContainer"
                >
                  <Select
                    value={formData.dpEmploymentStatus}
                    onChange={policyStatusChange}
                    name="dpEmploymentStatus"
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
                          marginLeft: 4,
                        }}
                        className="dubai-med"
                      >
                        Select DP Employment Status
                      </Typography>
                    </MenuItem>
                    {employmentStatus.map((option) => (
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
                            marginLeft: 4,
                          }}
                          className="dubai-med"
                        >
                          {option.label}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.dpEmploymentStatus && (
                  <Typography
                    variant="caption"
                    className="error-message"
                    mb={1}
                  >
                    {errors.dpEmploymentStatus}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Languages Spoken
                </Typography>
                <FormControl
                  variant="outlined"
                  fullWidth
                  className="selectFieldContainer"
                >
                  <Select
                    className="Text-field-customise"
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    displayEmpty
                    value={formData.languagesSpoken
                      .split(",")
                      .map((item) => item.trim())
                      .filter((item) => item)}
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
                              marginLeft: 4,
                            }}
                            className="dubai-med"
                          >
                            Select Languages
                          </Typography>
                        );
                      }
                      return (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
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
                                marginLeft: 4,
                              }}
                              className="dubai-med"
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
                  >
                    {names.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                        style={getStyles(name, formData.languagesSpoken, theme)}
                        className="dubai-med"
                      >
                        {name}
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
                  Performance Level <span className="asterisk">*</span>
                </Typography>
                <FormControl
                  variant="outlined"
                  fullWidth
                  className="selectFieldContainer"
                >
                  <Select
                    value={formData.performanceLevel}
                    onChange={policyStatusChange}
                    name="performanceLevel"
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
                          marginLeft: 4,
                        }}
                        className="dubai-med"
                      >
                        Select Performance Level
                      </Typography>
                    </MenuItem>
                    {Performance.map((option) => (
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
                            marginLeft: 4,
                          }}
                          className="dubai-med"
                        >
                          {option.label}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.performanceLevel && (
                  <Typography
                    variant="caption"
                    className="error-message"
                    mb={1}
                  >
                    {errors.performanceLevel}
                  </Typography>
                )}
              </Grid>
              
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Contract Type <span className="asterisk">*</span>
                </Typography>
                <FormControl
                  variant="outlined"
                  fullWidth
                  className="selectFieldContainer"
                >
                  <Select
                    value={formData.contractType}
                    onChange={policyStatusChange}
                    name="contractType"
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
                        Select Contract Type
                      </Typography>
                    </MenuItem>
                    {Contract.map((option) => (
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
                
                {errors.contractType && (
                  <Typography variant="caption" className="error-message">
                    {errors.contractType}
                  </Typography>
                )}
              </Grid>

              <Grid container item xs={12} md={5.5} spacing={2} pt={0}>
                <Grid item xs={6}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Contract Start Date
                  </Typography>
                  <CustomDatePicker
                    control={control}
                    hidden={true}
                    name="contractStartDate"
                    label="Contract Start Date"
                    boxmb={0.8}
                    required={true}
                    minDate={moment().subtract(50, "years")}
                    maxDate={moment().add(10, "years")}
                    onChange={dateChange}
                    defaultValue={formData && formData.contractStartDate}
                    className="Text-field-customise"
                  />
                  {errors.contractStartDate && (
                    <Typography
                      variant="caption"
                      className="error-message"
                      mt={2}
                    >
                      {errors.contractStartDate}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Contract End Date
                  </Typography>
                  <CustomDatePicker
                    control={control}
                    hidden={true}
                    name="contractEndDate"
                    label="Contract End Date"
                    boxmb={0.8}
                    required={true}
                    minDate={getMinDate()}
                    maxDate={moment().add(10, "years")}
                    onChange={dateChange}
                    defaultValue={formData && formData.contractEndDate}
                    className="Text-field-customise"
                  />
                  {errors.contractEndDate && (
                    <Typography
                      variant="caption"
                      className="error-message"
                      mt={2}
                    >
                      {errors.contractEndDate}
                    </Typography>
                  )}
                </Grid>
                <Grid
                  container
                  spacing={0}
                  justifyContent="start"
                  alignItems="center"
                >
                  <Grid item alignItems="flex-start">
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
                        flag={DROPZONE_IMAGE_FLAG.UPLOAD_CONTRACT}
                        setData={setFormData}
                        formData={formData}
                        modulename="Athlete"
                        moduleId={parsedData.athleteID}
                        fileInputRef={fileContractDocumentRef}
                      />
                      <AttachFileSharpIcon />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <Box display="flex" alignItems="center">
                      <Typography
                        align="center"
                        color="error"
                        className="dubai-med upload-label"
                        onClick={handleContractDocumentClick}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        {formData.uploadContract ? (
                          <>{formData.uploadContract}</>
                        ) : (
                          <>Upload Contract: PDF format (max size 25 MB)</>
                        )}
                      </Typography>
                      {formData.uploadContract && (
                        <IconButton
                          className="deleteIconButton"
                          aria-label="delete"
                          onClick={() => {
                            handleDeleteFile(
                              "Athlete",
                              parsedData?.athleteID,
                              "ContractDocument"
                            );
                            setFormData((prev) => ({
                              ...prev,
                              uploadContract: "",
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
                  Discipline Practiced <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="disciplinePracticed"
                  placeholder="Enter Discipline Practiced"
                  type="tel"
                  variant="outlined"
                  fullWidth
                  value={formData.disciplinePracticed}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 100 }}
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_CHARS_SPACE.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.disciplinePracticed && (
                  <Typography variant="caption" className="error-message">
                    {errors.disciplinePracticed}
                  </Typography>
                )}
              </Grid>
              <Grid container item xs={12} md={5.5} spacing={2} pt={0}>
                <Grid item xs={6}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Acknowledgement Date <span className="asterisk">*</span>
                  </Typography>
                  <CustomDatePicker
                    control={control}
                    hidden={true}
                    name="acknowledgementDate"
                    label="Acknowledgement Date"
                    boxmb={0.8}
                    required={true}
                    minDate={moment().subtract(60, "years")}
                    maxDate={moment()}
                    onChange={dateChange}
                    defaultValue={formData && formData.acknowledgementDate}
                    className="Text-field-customise"
                    setErrors={setErrors}
                  />
                  {errors.acknowledgementDate && (
                    <Typography
                      variant="caption"
                      className="error-message"
                      mt={2}
                    >
                      {errors.acknowledgementDate}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Pledge Date <span className="asterisk">*</span>
                  </Typography>
                  <CustomDatePicker
                    control={control}
                    hidden={true}
                    name="pledgeDate"
                    label="Pledge Date"
                    boxmb={0.8}
                    required={true}
                    minDate={moment().subtract(60, "years")}
                    maxDate={moment()}
                    onChange={dateChange}
                    defaultValue={formData && formData.pledgeDate}
                    className="Text-field-customise"
                    setErrors={setErrors}
                  />
                  {errors.pledgeDate && (
                    <Typography
                      variant="caption"
                      className="error-message"
                      mt={2}
                    >
                      {errors.pledgeDate}
                    </Typography>
                  )}
                </Grid>
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
                onClick={() => {
                  handleBack();
                }}
                className="text-capitalize"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                className="save-continue-button text-capitalize"
                disabled={athleteAddEmployementData.loading}
              >
                {athleteAddEmployementData.loading
                  ? "Loading..."
                  : "Save & Continue"}
              </Button>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};
export default ProfessionalDetails;