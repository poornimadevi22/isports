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
  Avatar,
  Stack,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { RootState, AppDispatch } from "@/redux/store";
import { formatDates, getLocalStorage, trimFormData } from "@/utils/helper";
import FileUpload from "@/utils/dropzone";
import { useRouter } from "next/navigation";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import moment from "moment";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import { useForm } from "react-hook-form";
import {
  addAthlete,
  clearAddState,
} from "@/redux/slices/athlete/athleteAddSlice";
import { singleFileUpload } from "@/redux/slices/fileupload/singleFileUpload";
import { editAthlete } from "@/redux/slices/athlete/athleteEditSlice";
import {
  DROPZONE_IMAGE_FLAG,
  DROPZONE_IMAGE_NAME_TYPES,
  FILE_FORMAT_TYPE,
  FILE_FORMAT_TYPE_DOCUMENT,
  REGEX,
} from "@/utils/constants";
import { PersonalFormValidation } from "@/utils/athletes/validation";
import { deleteFile } from "@/redux/slices/fileupload/deleteFile";
import { editStaff } from "@/redux/slices/staff/staffEditSlice";

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
  profileImage: string;
  // name: string;
  firstName: string;
  middleName: string;
  surname: string;
  gender: string;
  nationality: string;
  dob: string;
  placeOfBirth: string;
  passportNo: string;
  emiratesID: string;
  age: number | null; // Allow `age` to be either a number or null
  iDdocumentImage: string;
  passportPdf: string;
  passportExpirationDate: string;
  ProfileFullImage: string;
}

type FormErrors = {
  firstName?: string;
  middleName?: string;
  // name?: string;
  surname?: string;
  gender?: string;
  nationality?: string;
  dob?: string;
  placeOfBirth?: string;
  passportNo?: string;
  emiratesID?: string;
  passportExpirationDate?: string;
};

const PersonalInformation = (props: any) => {
  const { handleSubmit, control } = useForm();
  const {
    activeStep,
    setActiveStep,
    setAllData,
    allData,
    editAthleteData,
    teamId,
    editPayload,
    setDialogOpen,
  } = props;
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const athleteAddData = useSelector((state: RootState) => state.athleteAdd);
  const [formData, setFormData] = useState<FormData>({
    profileImage: "",
    ProfileFullImage: "",
    firstName: "",
    middleName: "",
    // name: "",
    surname: "",
    gender: "",
    nationality: "",
    dob: "",
    placeOfBirth: "",
    passportNo: "",
    passportPdf: "",
    emiratesID: "",
    iDdocumentImage: "",
    passportExpirationDate: "",
    age: 0,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const { validate } = PersonalFormValidation(formData, setErrors);
  const [showBanner, setShowBanner] = useState(false);
  const savedData: any = getLocalStorage("addAthleteData");
  const parsedData = JSON.parse(savedData);
  const [birthDate, setBirthDate] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<any>(null);
  const [imageData, setImageData] = useState<any>(null);
  const filepassRef = useRef<HTMLInputElement>(null);
  const fileIDRef = useRef<HTMLInputElement>(null);
  const getSportID = getLocalStorage("sport");
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({
      ...errors,
      [name]: "",
    });
    if (name === "gender" && value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        gender: "",
      }));
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = moment(dob);
    const today = moment();
    return today.diff(birthDate, "years");
  };

  const dateChange = (data: any) => {
    const dob = data.value ? moment(data.value).toISOString() : null;
    if (dob) {
      const age = calculateAge(dob);
      setFormData((prevData) => ({
        ...prevData,
        dob: data.value,
        age: age,
      }));
    }
    const validationErrors = validate();
    setErrors({
      ...errors,
      [data.name]: validationErrors[data.name] && "",
    });
  };
  const passportExpireChange = (data: any) => {
    const passportExpirationDate = data.value
      ? moment(data.value).toISOString()
      : "";
    if (passportExpirationDate) {
      setFormData((prevData) => ({
        ...prevData,
        passportExpirationDate: data.value,
      }));
    }
    const validationErrors = validate();
    setErrors({
      ...errors,
      [data.name]: validationErrors[data.name] && "",
    });
  };

  const onSubmit = async () => {
    const validationErrors = validate();
    if (_.isEmpty(validationErrors)) {
      const {
        iDdocumentImage,
        passportPdf,
        profileImage,
        ProfileFullImage,
        ...rest
      } = formData;
      const trimmedRest = trimFormData(rest);
      if (parsedData && parsedData.athleteID) {
        const data = {
          ...trimmedRest,
          dob:
            moment(birthDate, "DD/MM/YYYY").format("DD/MM/YYYY") ===
            editAthleteData?.dob
              ? moment(editAthleteData?.dob, "DD/MM/YYYY").format("DD/MM/YYYY")
              : moment(formData.dob, "DD/MM/YYYY").format("DD/MM/YYYY"),
          passportExpirationDate: moment(
            formData.passportExpirationDate,
            "DD/MM/YYYY"
          ).format("DD/MM/YYYY"),
          age: Number(formData.age) || 0,
          sportID: +getSportID,
          loggedUserID: "1",
          athleteID: parsedData.athleteID,
          section: "personaldetails",
        };
        dispatch(addAthlete({ url: "/UpdateAthleteByID", payload: data }));
        const payload: any = {
          athleteID: parsedData.athleteID,
        };
        dispatch(editAthlete(payload));
      } else {
        const data = {
          ...trimmedRest,
          dob: moment(formData.dob, "DD/MM/YYYY").format("DD/MM/YYYY"),
          passportExpirationDate: formData.passportExpirationDate
            ? moment(formData.passportExpirationDate, "DD/MM/YYYY").format(
                "DD/MM/YYYY"
              )
            : "",
          age: Number(formData.age) || 0,
          sportID: +getSportID,
          loggedUserID: "1",
        };
        dispatch(addAthlete({ url: "/InsertAthlete", payload: data }));
      }
    }
  };

  useEffect(() => {
    if (athleteAddData && athleteAddData.code === 200) {
      setShowBanner(false);
      const {
        iDdocumentImage,
        passportPdf,
        profileImage,
        ProfileFullImage,
        ...rest
      } = formData;
      setAllData((prevFormData: any) => ({
        ...prevFormData,
        PersonalInformation: rest,
        athleteID: athleteAddData.data.athleteID,
      }));
      if (!_.isEmpty(imageData)) {
        const fileFlags = [
          "ProfileImage",
          "IDDocument",
          "Passport",
          "ProfileFullImage",
        ];
        fileFlags.forEach((flag) => {
          const fileData = imageData?.[flag as keyof typeof imageData];
          if (fileData && fileData.file) {
            const formData = new FormData();
            formData.append("file", fileData.file);
            formData.append("modulename", fileData.modulename);
            formData.append("moduleid", athleteAddData.data.athleteID);
            formData.append("section", fileData.section);
            formData.append("loggedUserID", fileData.loggedUserID);
            dispatch(singleFileUpload(formData));
          }
        });
      }
      setActiveStep(1);
      dispatch(clearAddState());
      dispatch(editAthlete(editPayload));
    } else if (athleteAddData && athleteAddData.code === 500) {
      setShowBanner(true);
      setTimeout(() => {
        dispatch(clearAddState());
        setShowBanner(false);
      }, 3000);
    } else if (athleteAddData && athleteAddData.code === 409) {
      setShowBanner(true);
      setTimeout(() => {
        dispatch(clearAddState());
        setShowBanner(false);
      }, 3000);
    }
  }, [athleteAddData]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowBanner(false);
  };

  const handleFileChange = (
    file: any,
    flag: any,
    modulename: any,
    moduleId: any
  ) => {
    if (file) {
      setImageData((prevData: any) => ({
        ...prevData,
        [flag]: {
          file,
          modulename,
          moduleId,
          section: flag,
          loggedUserID: "1",
        },
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData((prevData) => ({
          ...prevData,
          profileImage:
            flag === DROPZONE_IMAGE_FLAG.PROFILES
              ? result
              : prevData.profileImage,
          ProfileFullImage:
            flag === DROPZONE_IMAGE_FLAG.HEROIMAGE
              ? result
              : prevData.profileImage,
          iDdocumentImage:
            flag === DROPZONE_IMAGE_FLAG.ID_DOCUMENT
              ? file.name
              : prevData.iDdocumentImage,
          passportPdf:
            flag === DROPZONE_IMAGE_FLAG.PASSPORT
              ? file.name
              : prevData.passportPdf,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (parsedData.PersonalInformation) {
      setFormData((formData) => ({
        ...formData,
        firstName: parsedData.PersonalInformation.firstName || "",
        middleName: parsedData.PersonalInformation.middleName || "",
        surname: parsedData.PersonalInformation.surname || "",
        gender: parsedData.PersonalInformation.gender || "",
        nationality: parsedData.PersonalInformation.nationality || "",
        placeOfBirth: parsedData.PersonalInformation.placeOfBirth || "",
        passportNo: parsedData.PersonalInformation.passportNo || "",
        passportPdf: parsedData.passportPdf || "",
        emiratesID: parsedData.PersonalInformation.emiratesID || "",
        iDdocumentImage: parsedData.iDdocumentImage || "",
        age: parsedData.PersonalInformation.age || "",
        passportExpirationDate: formatDates(
          parsedData.PersonalInformation.passportExpirationDate
        ),
        dob: formatDates(parsedData.PersonalInformation.dob),
        profileImage: parsedData.profileImage || "",
        ProfileFullImage: parsedData.ProfileFullImage || "",
      }));
      setBirthDate(editAthleteData?.dob);
    }
  }, []);

  console.log("formdata", formData);

  const handlepassClick = () => {
    if (filepassRef.current) {
      filepassRef.current.click();
    }
  };

  const handleIdClick = () => {
    if (fileIDRef.current) {
      fileIDRef.current.click();
    }
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

  const closeAdd = () => {
    setDialogOpen(true);
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
            {previewUrl && (
              <div>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ width: "200px", height: "auto" }}
                />
                <button>Remove Image</button>
              </div>
            )}
            {showBanner &&
              athleteAddData &&
              !_.isEmpty(athleteAddData.message) && (
                <Snackbar
                  open={showBanner}
                  autoHideDuration={3000}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="filled"
                  >
                    {athleteAddData && athleteAddData.message}
                  </Alert>
                </Snackbar>
              )}
            <Grid container spacing={2} justifyContent={"space-between"}>
              <Grid
                container
                spacing={1}
                justifyContent="start"
                alignItems="center"
                item
                xs={12}
                md={5.5}
              >
                <Grid item>
                  <Stack alignItems="flex-start">
                    <div className="avatarContainer">
                      <Avatar
                        src={formData.profileImage || "/broken-image.jpg"}
                        className="avatar"
                      />
                      <IconButton className="iconButton" component="label">
                        <CameraAltIcon className="cameraIcon" />
                        <FileUpload
                          onFileChange={(
                            file: any,
                            flag: any,
                            modulename: any,
                            moduleId: any
                          ) =>
                            handleFileChange(file, flag, modulename, moduleId)
                          }
                          formatType={FILE_FORMAT_TYPE}
                          type={DROPZONE_IMAGE_NAME_TYPES.IMAGE}
                          flag={DROPZONE_IMAGE_FLAG.PROFILES}
                          moduleId={parsedData && parsedData.athleteID}
                          modulename="Athlete"
                          setData={setFormData}
                          formData={formData}
                          fetchDataApi={() => dispatch(editStaff(editPayload))}
                        />
                      </IconButton>
                    </div>
                  </Stack>
                </Grid>
                <Grid item>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Typography
                      gutterBottom
                      align="center"
                      className="typography-profileImage textfield-label bukra"
                    >
                      Upload Profile Picture
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    {formData.profileImage && (
                      <>
                        <Typography
                          gutterBottom
                          align="center"
                          className="typography-profileImage"
                          sx={{
                            color: "#ef0a0a",
                            fontWeight: 500,
                            fontSize: "14px",
                            mr: 1,
                          }}
                        >
                          Delete
                        </Typography>
                        <IconButton
                          className="deleteIconButton"
                          onClick={() => {
                            handleDeleteFile(
                              "Athlete",
                              parsedData?.athleteID,
                              "profileImage"
                            );
                          }}
                          aria-label="delete"
                          sx={{
                            color: "#ef0a0a",
                            "&:hover": {
                              backgroundColor: "rgba(255, 0, 0, 0.1)",
                            },
                            p: 1,
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </Box>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={1}
                justifyContent="start"
                alignItems="center"
                item
                xs={12}
                md={5.5}
                mb={2}
              >
                <Grid item>
                  <Stack alignItems="flex-start">
                    <div className="hero-avatarContainer">
                      <Avatar
                        src={formData.ProfileFullImage || "/broken-image.jpg"}
                        className="avatar"
                        // style={{ borderRadius: '8px'}}
                      />
                      <IconButton className="iconButton" component="label">
                        <CameraAltIcon className="cameraIcon" />
                        <FileUpload
                          onFileChange={(
                            file: any,
                            flag: any,
                            modulename: any,
                            moduleId: any
                          ) =>
                            handleFileChange(file, flag, modulename, moduleId)
                          }
                          formatType={FILE_FORMAT_TYPE}
                          type={DROPZONE_IMAGE_NAME_TYPES.IMAGE}
                          flag={DROPZONE_IMAGE_FLAG.HEROIMAGE}
                          moduleId={parsedData && parsedData.athleteID}
                          modulename="Athlete"
                          setData={setFormData}
                          formData={formData}
                        />
                      </IconButton>
                    </div>
                  </Stack>
                </Grid>
                <Grid item>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Typography
                      gutterBottom
                      align="center"
                      className="typography-profileImage textfield-label bukra"
                    >
                      Upload Hero Picture
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Typography
                      gutterBottom
                      align="center"
                      className="bukra"
                      sx={{ fontSize: "11px", color: "#d32f2f" }}
                    >
                      Recommended: 363x630 PNG.
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    {formData.ProfileFullImage && (
                      <>
                        <Typography
                          gutterBottom
                          align="center"
                          className="typography-profileImage"
                          sx={{
                            color: "#ef0a0a",
                            fontWeight: 500,
                            fontSize: "14px",
                            mr: 1,
                          }}
                        >
                          Delete
                        </Typography>
                        <IconButton
                          className="deleteIconButton"
                          onClick={() => {
                            handleDeleteFile(
                              "Athlete",
                              parsedData?.athleteID,
                              "ProfileFullImage"
                            );
                          }}
                          aria-label="delete"
                          sx={{
                            color: "#ef0a0a",
                            "&:hover": {
                              backgroundColor: "rgba(255, 0, 0, 0.1)",
                            },
                            p: 1,
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </Box>
                </Grid>
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  First Name <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="firstName"
                  placeholder="Enter First Name"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.firstName}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 100 }}
                  onKeyPress={(e) => {
                    if (!REGEX.TEXT.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.firstName && (
                  <Typography variant="caption" className="error-message">
                    {errors.firstName}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Middle Name <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="middleName"
                  placeholder="Enter First Name"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.middleName}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 100 }}
                  onKeyPress={(e) => {
                    if (!REGEX.TEXT.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.middleName && (
                  <Typography variant="caption" className="error-message">
                    {errors.middleName}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Surname <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="surname"
                  placeholder="Enter surname"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.surname}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                  onKeyPress={(e) => {
                    if (!REGEX.TEXT.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.surname && (
                  <Typography variant="caption" className="error-message">
                    {errors.surname}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Select Gender <span className="asterisk">*</span>
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    row
                  >
                    <FormControlLabel
                      className="dubai-med textfield-label"
                      value="Male"
                      control={<Radio />}
                      label="Male"
                    />
                    <FormControlLabel
                      className="dubai-med textfield-label"
                      value="Female"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      className="dubai-med textfield-label"
                      value="other"
                      control={<Radio />}
                      label="Other"
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
                  Nationality <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="nationality"
                  placeholder="Enter Nationality"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.nationality}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                  onKeyPress={(e) => {
                    if (!REGEX.TEXT.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.nationality && (
                  <Typography variant="caption" className="error-message">
                    {errors.nationality}
                  </Typography>
                )}
              </Grid>
              <Grid container item xs={12} md={5.5} spacing={1}>
                <Grid item xs={10}>
                  <Box>
                    <CustomDatePicker
                      control={control}
                      name="dob"
                      label="Date of Birth"
                      defaultValue={birthDate && birthDate}
                      boxmb={0.8}
                      required={true}
                      minDate={moment().subtract(50, "years")}
                      maxDate={moment().subtract(18, "years")}
                      onChange={dateChange}
                      className="Text-field-customise"
                    />
                  </Box>
                  {errors.dob && (
                    <Typography variant="caption" className="error-message">
                      {errors.dob}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={2}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Age
                  </Typography>
                  <CustomTextField
                    name="age"
                    placeholder="Enter Age"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.age}
                    disabled
                    className="Text-field-customise"
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Place of Birth
                </Typography>
                <CustomTextField
                  name="placeOfBirth"
                  placeholder="Enter Place of Birth"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.placeOfBirth}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 100 }}
                  onKeyPress={(e) => {
                    if (!REGEX.TEXT.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.placeOfBirth && (
                  <Typography variant="caption" className="error-message">
                    {errors.placeOfBirth}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Emirates ID Number
                </Typography>
                <CustomTextField
                  name="emiratesID"
                  placeholder="Enter Emirates ID Number"
                  type="tel"
                  variant="outlined"
                  fullWidth
                  value={formData.emiratesID}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 20 }}
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
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
                          modulename: any,
                          moduleId: any
                        ) => handleFileChange(file, flag, modulename, moduleId)}
                        formatType={FILE_FORMAT_TYPE}
                        type={DROPZONE_IMAGE_NAME_TYPES.IMAGE}
                        flag={DROPZONE_IMAGE_FLAG.ID_DOCUMENT}
                        modulename="Athlete"
                        moduleId={parsedData.athleteID}
                        setData={setFormData}
                        formData={formData}
                        fileInputRef={fileIDRef}
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
                        onClick={handleIdClick}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        {formData.iDdocumentImage ? (
                          <>{formData.iDdocumentImage}</>
                        ) : (
                          <>Upload Emirates ID Document (JPEG, PNG)</>
                        )}
                      </Typography>
                      {formData.iDdocumentImage && (
                        <IconButton
                          className="deleteIconButton"
                          aria-label="delete"
                          onClick={() => {
                            handleDeleteFile(
                              "Athlete",
                              parsedData?.athleteID,
                              "IDDocument"
                            );
                            setFormData((prev) => ({
                              ...prev,
                              iDdocumentImage: "",
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
                  Passport Number
                </Typography>
                <CustomTextField
                  name="passportNo"
                  placeholder="Enter Passport Number"
                  type="tel"
                  variant="outlined"
                  fullWidth
                  value={formData.passportNo}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 20 }}
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
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
                          modulename: any,
                          moduleId: any
                        ) => handleFileChange(file, flag, modulename, moduleId)}
                        formatType={FILE_FORMAT_TYPE_DOCUMENT}
                        type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                        flag={DROPZONE_IMAGE_FLAG.PASSPORT}
                        setData={setFormData}
                        formData={formData}
                        modulename="Athlete"
                        moduleId={parsedData.athleteID}
                        fileInputRef={filepassRef}
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
                        {formData.passportPdf ? (
                          <>{formData.passportPdf}</>
                        ) : (
                          <>Upload Passport (PDF)</>
                        )}
                      </Typography>
                      {formData.passportPdf && (
                        <IconButton
                          className="deleteIconButton"
                          aria-label="delete"
                          onClick={() => {
                            handleDeleteFile(
                              "Athlete",
                              parsedData?.athleteID,
                              "Passport"
                            );
                            setFormData((prev) => ({
                              ...prev,
                              passportPdf: "",
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
                <CustomDatePicker
                  control={control}
                  name="passportExpirationDate"
                  label="Passport Expiry Date"
                  defaultValue={formData && formData.passportExpirationDate}
                  boxmb={0.8}
                  required={false}
                  minDate={moment()}
                  maxDate={moment().add(10, "years")}
                  onChange={passportExpireChange}
                  className="Text-field-customise"
                />
                {errors.passportExpirationDate && (
                  <Typography variant="caption" className="error-message">
                    {errors.passportExpirationDate}
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
                onClick={() => {
                  closeAdd();
                }}
                className="cancel-button text-capitalize"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                className="save-continue-button text-capitalize"
                disabled={athleteAddData.loading}
              >
                {athleteAddData.loading ? "Loading..." : "Save & Continue"}
              </Button>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};
export default PersonalInformation;