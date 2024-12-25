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
  Fade,
  MenuItem,
  Select,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import {
  DROPZONE_IMAGE_FLAG,
  DROPZONE_IMAGE_NAME_TYPES,
  FILE_FORMAT_TYPE,
  FILE_FORMAT_TYPE_DOCUMENT,
  PDF_FORMAT,
  REGEX,
} from "@/utils/constants";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import {
  RootState,
  AppDispatch,
} from "@/redux/store";
import { formatDate, formatDates, getLocalStorage, trimFormData } from "@/utils/helper";
import { PersonalFormValidation } from "@/utils/staffs/validation";
import FileUpload from "@/utils/dropzone";
import { usePathname, useRouter } from "next/navigation";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import moment from "moment";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import { useForm } from "react-hook-form";
import { addStaff, clearAddState } from "@/redux/slices/staff/staffAddSlice";
import { singleFileUpload } from "@/redux/slices/fileupload/singleFileUpload";
import { editStaff } from "@/redux/slices/staff/staffEditSlice";
import { deleteFile } from "@/redux/slices/fileupload/deleteFile";
import { fetchRoles } from "@/redux/slices/settingSlice/roleSlice/roleSlice";
import HeroPicture from "../../../../../../public/HeroPicture.png"
import Image from "next/image";

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
    fontFamily: "Dubai",
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
  firstName: string;
  surname: string;
  gender: string;
  role: string;
  nationality: string;
  dob: string;
  placeOfBirth: string;
  passportNo: string;
  emiratesID: string;
  age: number | null;
  iDdocumentImage: string;
  passportPdf: string;
  middleName: string;
  height: string,
  weight: string,
  passportExpirationDate: string,
  heroImage: string
}

const PersonalInformation = (props: any) => {
  const { handleSubmit, control } = useForm();
  const { activeStep, setActiveStep, setAllData, allData, editStaffData, filepayload, teamId, setDialogOpen } = props;
  const router: any = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const staffAddData = useSelector((state: RootState) => state.staffAdd);
  const rolesListData = useSelector((state: RootState) => state.rolesList);

  const [formData, setFormData] = useState<FormData>({
    profileImage: "",
    firstName: "",
    surname: "",
    gender: "",
    role: "",
    nationality: "",
    dob: "",
    placeOfBirth: "",
    passportNo: "",
    passportPdf: "",
    emiratesID: "",
    iDdocumentImage: "",
    age: null,
    middleName: "",
    height: '',
    weight: '',
    passportExpirationDate: '',
    heroImage: ""
  });
  const [errors, setErrors] = useState<any>({});
  const { validate } = PersonalFormValidation(formData, setErrors);
  const [showBanner, setShowBanner] = useState(false);
  const savedData: any = getLocalStorage("addStaffData");
  const parsedData = JSON.parse(savedData);
  const [birthDate, setBirthDate] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<any>(null);
  const [imageData, setImageData] = useState<any>(null);
  const filepassRef = useRef<HTMLInputElement>(null);
  const fileIDRef = useRef<HTMLInputElement>(null);
  const getSportID = getLocalStorage("sport");

  // useEffect(() => {
  //   const param: any = {
  //     moduleName: "staff"
  //   }
  //   dispatch(fetchRoles(param));
  // }, [])

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
      setErrors((prevErrors: any) => ({
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
    setBirthDate(data.value);
    const validationErrors = validate();
    setErrors({
      ...errors,
      [data.name]: validationErrors[data.name] && "",
      age: validationErrors[data.age] || "",
    });
  };


  const datePickerChange = (data: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [data.name]: data.value,
    }));
    setErrors({
      ...errors,
      [data.name]: "",
    });
  };

  const onSubmit = async (data: any) => {
    const validationErrors = validate();
    if (_.isEmpty(validationErrors)) {
      const { iDdocumentImage, passportPdf, profileImage, emiratesID, heroImage, ...rest } = formData;
      const trimmedRest = trimFormData(rest);
      if (parsedData && parsedData.staffID) {
        const data = {
          ...trimmedRest,
          emiratesID: formData.emiratesID,
          passportExpirationDate: formatDate(formData.passportExpirationDate),
          dob: moment(birthDate, "DD/MM/YYYY").format("DD/MM/YYYY") === editStaffData?.dob
            ? moment(editStaffData?.dob, "DD/MM/YYYY").format("DD/MM/YYYY")
            : moment(formData.dob, "DD/MM/YYYY").format("DD/MM/YYYY"),
          age: Number(formData.age) || 0,
          height: Number(formData.height),
          weight: Number(formData.weight),
          loggedUserID: "1",
          staffID: parsedData.staffID,
          section: "personaldetails",
        };
        dispatch(addStaff({ url: "/UpdateStaffByID", payload: data }));
        const payload: any = {
          staffID: parsedData.staffID,
          sportID: teamId
        };
        dispatch(editStaff(payload));
      } else {
        const data = {
          ...trimmedRest,
          emiratesID: formData.emiratesID,
          passportExpirationDate: formatDate(formData.passportExpirationDate),
          dob: formData && formData.dob ? moment(formData.dob).format("DD/MM/YYYY") : null,
          age: Number(formData.age) || 0,
          height: Number(formData.height),
          weight: Number(formData.weight),
          sportID: +getSportID,
          loggedUserID: "1",
        };
        dispatch(addStaff({ url: "/InsertStaff", payload: data }));
      }
    }
  };

  useEffect(() => {
    if (staffAddData && staffAddData.code === 200) {
      setShowBanner(false);
      const { iDdocumentImage, passportPdf, profileImage, heroImage, ...rest } = formData;
      setAllData((prevFormData: any) => ({
        ...prevFormData,
        PersonalInformation: rest,
        staffID: staffAddData.data.staffID,
      }));
      const payload: any = {
        staffID: staffAddData.data.staffID,
        sportID: teamId
      };
      dispatch(editStaff(payload));
      if (!_.isEmpty(imageData)) {
        const fileFlags = ["ProfileImage", "IDDocument", "Passport", "ProfileFullImage"];
        fileFlags.forEach((flag) => {
          const fileData = imageData?.[flag as keyof typeof imageData];
          if (fileData && fileData.file) {
            const formData = new FormData();
            formData.append("file", fileData.file);
            formData.append("modulename", fileData.modulename);
            formData.append("moduleid", staffAddData.data.staffID);
            formData.append("section", fileData.section);
            formData.append("loggedUserID", fileData.loggedUserID);
            dispatch(singleFileUpload(formData))
          }
        });
      }
      setActiveStep(1);
      dispatch(clearAddState());
    } else if (staffAddData && staffAddData.code === 500) {
      setShowBanner(true);
      setTimeout(() => {
        dispatch(clearAddState());
        setShowBanner(false);
      }, 3000);
    } else if (staffAddData && staffAddData.code === 409) {
      setShowBanner(true);
      setTimeout(() => {
        dispatch(clearAddState());
        setShowBanner(false);
      }, 3000);
    }
  }, [staffAddData]);

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
          iDdocumentImage:
            flag === DROPZONE_IMAGE_FLAG.ID_DOCUMENT
              ? file.name
              : prevData.iDdocumentImage,
          passportPdf:
            flag === DROPZONE_IMAGE_FLAG.PASSPORT
              ? file.name
              : prevData.passportPdf,
          heroImage:
            flag === DROPZONE_IMAGE_FLAG.HERO_PROFILE
              ? result
              : prevData.heroImage,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (parsedData.PersonalInformation) {
      setFormData((formData) => ({
        ...formData,
        profileImage: parsedData.profileImage,
        heroImage: parsedData.heroImage,
        firstName: parsedData.PersonalInformation.firstName || "",
        surname: parsedData.PersonalInformation.surname || "",
        gender: parsedData.PersonalInformation.gender || "",
        role: parsedData.PersonalInformation.role || "",
        nationality: parsedData.PersonalInformation.nationality || "",
        dob: formatDates(parsedData.PersonalInformation.dob),
        placeOfBirth: parsedData.PersonalInformation.placeOfBirth || "",
        passportNo: parsedData.PersonalInformation.passportNo || "",
        passportPdf: parsedData.passportPdf || "",
        emiratesID: parsedData.PersonalInformation.emiratesID || "",
        iDdocumentImage: parsedData.iDdocumentImage || "",
        age: parsedData.PersonalInformation.age || "",
        middleName: parsedData.PersonalInformation.middleName || "",
        height: parsedData.PersonalInformation.height || "",
        weight: parsedData.PersonalInformation.weight || "",
        passportExpirationDate: formatDates(parsedData.PersonalInformation.passportExpirationDate),
      }));
    }
  }, []);

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
  }

  const rolesChange = (event: any) => {
    setFormData({ ...formData, role: event.target.value });
    setErrors({
      ...errors,
      role: "",
    });
  };

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
              {showBanner && staffAddData && !_.isEmpty(staffAddData.message) && (
                <Snackbar
                  open={showBanner}
                  autoHideDuration={3000}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <Alert onClose={handleClose} severity="error" variant="filled">
                    {staffAddData && staffAddData.message}
                  </Alert>
                </Snackbar>
              )}
              <Grid container spacing={2} justifyContent={"space-between"}>
                <Grid item xs={12} md={5.5}>
                  <Grid
                    container
                    spacing={1}
                    justifyContent="start"
                    alignItems="center"
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
                              moduleId={parsedData && parsedData.staffID}
                              modulename="Staff"
                              setData={setFormData}
                              formData={formData}
                              fetchDataApi={() => dispatch(editStaff(filepayload))}
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
                          Upload Photo
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
                              onClick={() => { handleDeleteFile("Staff", parsedData.staffID, "profileImage") }}
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
                </Grid>
                <Grid item xs={12} md={5.5}>
                  <Grid
                    container
                    spacing={1}
                    justifyContent="start"
                    alignItems="center"
                  >
                    <Grid item>
                      <Stack alignItems="flex-start">
                        <div className="avatarContainer">
                          <Avatar
                            src={formData.heroImage || "/broken-image.jpg"}
                            className="avatar-hero"
                          />
                          {/* <Avatar src={formData.heroImage || HeroPicture} alt="HeroPicture" width={81} height={81} style={{width:'81px', height:'81px'}} /> */}
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
                              
                              flag={DROPZONE_IMAGE_FLAG.HERO_PROFILE}
                              moduleId={parsedData && parsedData.staffID}
                              modulename="Staff"
                              setData={setFormData}
                              formData={formData}
                              fetchDataApi={() => dispatch(editStaff(filepayload))}
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
                          sx={{fontSize:'11px', color:'#d32f2f'}}
                        >
                          Recommended: 363x630 PNG.
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        {formData.heroImage && (
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
                              onClick={() => { handleDeleteFile("Staff", parsedData.staffID, "heroImage") }}
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
                    inputProps={{ maxLength: 50 }}
                    onKeyPress={(e) => {
                      if (!REGEX.TEXT.test(e.key)) {
                        e.preventDefault()
                      }
                    }} />
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
                    placeholder="Enter Middle name"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.middleName}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 50 }}
                    onKeyPress={(e) => {
                      if (!REGEX.TEXT.test(e.key)) {
                        e.preventDefault()
                      }
                    }} />
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
                        e.preventDefault()
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
                  <Typography gutterBottom className="typography textfield-label bukra">
                    Role <span className="asterisk">*</span>
                  </Typography>
                  <FormControl variant="outlined" fullWidth className="selectFieldContainer">
                    <Select
                      value={formData.role}
                      name="role"
                      onChange={rolesChange}
                      displayEmpty
                      className="Text-field-customise"
                    >
                      <MenuItem value="" disabled>
                        <Typography variant="body2" color="textSecondary">
                          Select Role
                        </Typography>
                      </MenuItem>
                      {rolesListData && rolesListData?.data?.map((option: any) => (
                        <MenuItem key={option.value} value={option.roleName}>
                          <Typography variant="body1" color="textPrimary">
                            {option.roleName}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                        e.preventDefault()
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
                  <Grid item xs={9}>
                    <Box>
                      <CustomDatePicker
                        control={control}
                        name="dob"
                        label="Date of Birth"
                        defaultValue={formData && formData.dob}
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
                  <Grid item xs={3}>
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
                    {errors.age && (
                      <Typography variant="caption" className="error-message">
                        {errors.age}
                      </Typography>
                    )}
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
                    type="tel"
                    variant="outlined"
                    fullWidth
                    value={formData.placeOfBirth}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 20 }}
                    onKeyPress={(e) => {
                      if (!REGEX.TEXT.test(e.key)) {
                        e.preventDefault()
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
                  <Typography gutterBottom className="typography textfield-label bukra">
                    Height <span className="asterisk">*</span>
                  </Typography>
                  <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <OutlinedInput
                      sx={{
                        flexGrow: 1,
                        height: '40px',
                        backgroundColor: "#00875508",
                        '& .MuiOutlinedInput-input': {
                          padding: '8px 12px',
                        },
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#00875508',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#40a377',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#40a377',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#40a377',
                        },
                      }}
                      placeholder="Enter Height"
                      className="custom-outlined-input Text-field-customise"
                      type="text"
                      fullWidth
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      onKeyPress={(e) => {
                        if (!REGEX.WEIGHT.test(e.key)) {
                          e.preventDefault()
                        }
                      }}
                      inputProps={{ maxLength: 6 }}
                      endAdornment={
                        <InputAdornment position="end">
                          <Select
                            defaultValue="CM"
                            className="Text-field-customise"
                            sx={{
                              borderLeft: '1px solid grey',
                              minWidth: '10ch',
                              borderRadius: '0',
                              height: '100%',
                              '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                              },
                              '& .MuiSelect-select': {
                                display: 'flex',
                                alignItems: 'center',
                                marginLeft: '0px',
                              },
                            }}
                            disableUnderline
                          >
                            <MenuItem value="CM">CM</MenuItem>
                            <MenuItem value="MM">MM</MenuItem>
                          </Select>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  {errors.height && (
                    <Typography variant="caption" className="error-message">
                      {errors.height}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} md={5.5}>
                  <Typography gutterBottom className="typography textfield-label bukra">
                    Weight <span className="asterisk">*</span>
                  </Typography>
                  <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <OutlinedInput
                      sx={{
                        flexGrow: 1,
                        height: '40px',
                        backgroundColor: "#00875508",
                        '& .MuiOutlinedInput-input': {
                          padding: '8px 12px',
                        },
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#00875508',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#40a377',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#40a377',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#40a377',
                        },
                      }}
                      placeholder="Enter Weight"
                      className="custom-outlined-input Text-field-customise"
                      type="text"
                      name="weight"
                      fullWidth
                      value={formData.weight}
                      onChange={handleChange}
                      onKeyPress={(e: any) => {
                        if (!REGEX.WEIGHT.test(e.key)) {
                          e.preventDefault()
                        }
                      }}
                      inputProps={{ maxLength: 6 }}
                      endAdornment={
                        <InputAdornment position="end">
                          <Select
                            className="Text-field-customise"
                            defaultValue="KG"
                            sx={{
                              borderLeft: '1px solid grey',
                              minWidth: '10ch',
                              height: '100%',
                              borderRadius: '0',
                              '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                              },
                              '& .MuiSelect-select': {
                                display: 'flex',
                                alignItems: 'center',
                              },
                            }}
                            disableUnderline
                          >
                            <MenuItem value="KG">KG</MenuItem>
                          </Select>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  {errors.weight && (
                    <Typography variant="caption" className="error-message">
                      {errors.weight}
                    </Typography>
                  )}
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
                        e.preventDefault()
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
                          formatType={PDF_FORMAT}
                          type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                          
                          flag={DROPZONE_IMAGE_FLAG.PASSPORT}
                          setData={setFormData}
                          formData={formData}
                          modulename="Staff"
                          moduleId={parsedData.staffID}
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
                            onClick={() => { handleDeleteFile("Staff", parsedData.staffID, "passportPdf") }}
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
                    onChange={datePickerChange}
                    className="Text-field-customise"
                  />
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
                        e.preventDefault()
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
                          modulename="Staff"
                          moduleId={parsedData.staffID}
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
                            onClick={() => { handleDeleteFile("Staff", parsedData.staffID, "iDdocumentImage") }}
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
                  marginTop: "1.5rem",
                }}
              >
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ marginRight: "1rem" }}
                  onClick={() => {
                    setDialogOpen(true)
                  }}
                  className="cancel-button text-capitalize"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  className="save-continue-button text-capitalize"
                  disabled={staffAddData.loading}
                >
                  {staffAddData.loading ? "Loading..." : "Save & Continue"}
                </Button>
              </Box>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Fade>
  );
};
export default PersonalInformation;