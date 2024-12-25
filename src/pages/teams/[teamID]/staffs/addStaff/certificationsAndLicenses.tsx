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
  Fade,
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
  FILE_FORMAT_PDF_IMAGE,
  iconMapping,
  REGEX,
} from "@/utils/constants";
import FileUpload from "@/utils/dropzone";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import { useForm } from "react-hook-form";
import moment from "moment";
import { addStaff, clearAddState } from "@/redux/slices/staff/staffAddSlice";
import theme from "../../../../../utils/theme";
import CancelIcon from "@mui/icons-material/Cancel";
import { deleteFile } from "@/redux/slices/fileupload/deleteFile";
import { editStaff } from "@/redux/slices/staff/staffEditSlice";
import { getSportsListAPI } from "@/redux/slices/sportsMenu/getSportsListSlice";
import ReactSelect from "@/components/Fields/ReactSelect";

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
}));

function getStyles(name: string, personName: string, theme: Theme) {
  const selectedNames = personName.split(",");
  return {
    fontWeight: selectedNames
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

const names = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Russian",
  "Italian",
  "Portuguese",
  "Arabic",
];

interface FormData {
  coachingCertifications: string;
  issuingOrganization: string;
  dateOfCertificate?: string | null;
  expiryDate?: string | null;
  level: string;
  levelCertificate: string;
  federationLicence: string;
  languagesSpoken: string;
  expiry?: string | null;
  sport: string;
  medicalIssues: string;
  previousSportEthicalConduct: string;
  detailedTasks: string;
}

const CertificationsAndLicenses = (props: any) => {
  const { setActiveStep, setAllData, editStaffData, filepayload, teamId, setLoading, setRouteHandel, setDisableRouting } = props;
  const { handleSubmit, control } = useForm();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    coachingCertifications: "",
    issuingOrganization: "",
    dateOfCertificate: null,
    expiryDate: null,
    expiry: null,
    level: "",
    federationLicence: "",
    languagesSpoken: "",
    sport: "",
    medicalIssues: "",
    previousSportEthicalConduct: "",
    //dout
    detailedTasks: "Manage team training",
    levelCertificate: "",
  });

  const savedData: any = getLocalStorage("addStaffData");
  const parsedData = JSON.parse(savedData);
  const dispatch: AppDispatch = useDispatch();
  const staffAddcertificateData = useSelector(
    (state: RootState) => state.staffAdd
  );
  const [showBanner, setShowBanner] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const fileCertificateRef = useRef<HTMLInputElement>(null);
  const [SportsOption, setSportsOption] = useState()
  const [SelectedSportsOption, setSelectedSportsOption] = useState('')
  const getSportList = useSelector((state: any) => {
    return state.getSportList;
  });

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

  useEffect(() => {
    const payload = {
      searchText: "",
    };
    dispatch(getSportsListAPI(payload));
  }, []);

  const onSubmit = () => {
    const newErrors: any = {};
    if (_.isEmpty(formData.sport)) {
      newErrors.sport = USER_ERROR.SPORT;
    }
    setErrors(newErrors);
    if (_.isEmpty(newErrors)) {
      const { levelCertificate, ...rest } = formData;
      const trimmedRest = trimFormData(rest);
      const data = {
        ...trimmedRest,
        expiryDate: formData && formData.expiryDate ? moment(formData.expiryDate, "DD/MM/YYYY").format("DD/MM/YYYY") : null,
        dateOfCertificate: formData && formData.dateOfCertificate ? moment(formData.dateOfCertificate, "DD/MM/YYYY").format("DD/MM/YYYY") : null,
        expiry: formData && formData.expiry ? moment(formData.expiry, "DD/MM/YYYY").format("DD/MM/YYYY") : null,
        section: "certificatedetails",
        staffID: parsedData.staffID,
        loggedUserID: 1,
      };
      dispatch(addStaff({ url: "/UpdateStaffByID", payload: data }));
    }
  };

  useEffect(() => {
    if (staffAddcertificateData && staffAddcertificateData.code === 200) {
      setAlertType("success");
      setAlertMessage("Staff member added successfully");
      dispatch(clearAddState());
      setShowBanner(true);
      removeLocalStorage("addStaffData");
      setLoading(true)
      setRouteHandel(false)
      setDisableRouting(false)
      setTimeout(() => {
        router.push(`/teams/${teamId}/staffs`);
        setLoading(false)
      }, 3000);
    } else if (
      staffAddcertificateData &&
      staffAddcertificateData.code === 500
    ) {
      setAlertType("error");
      setAlertMessage(
        `${staffAddcertificateData && staffAddcertificateData.message}`
      );
      setShowBanner(true);
      dispatch(clearAddState());
    }
  }, [staffAddcertificateData]);

  useEffect(() => {
    if (parsedData.certificatedetails) {
      const sport = parsedData.certificatedetails.sport || '';
      const selOption: any = _.filter(SportsOption, (x: any) =>
        x.value && _.includes(sport.split(","), x.value.toString())
      );
      const selectedValues = Array.isArray(selOption)
        ? selOption.map((option: any) => option.value)
        : [];
      setSelectedSportsOption(selOption);
      setFormData((formData) => ({
        ...formData,
        coachingCertifications:
          parsedData.certificatedetails.coachingCertifications || "",
        issuingOrganization:
          parsedData.certificatedetails.issuingOrganization || "",
        level: parsedData.certificatedetails.level || "",
        federationLicence:
          parsedData.certificatedetails.federationLicence || "",
        languagesSpoken: parsedData.certificatedetails.languagesSpoken || "",
        sport: selectedValues.join(","),
        medicalIssues: parsedData.certificatedetails.medicalIssues || "",
        previousSportEthicalConduct:
          parsedData.certificatedetails.previousSportEthicalConduct || "",
        detailedTasks:
          parsedData.certificatedetails.detailedTasks || "Manage team training",
        levelCertificate: parsedData.certificatedetails.levelCertificate || "",
        dateOfCertificate: formatDates(parsedData.certificatedetails.dateOfCertificate),
        expiryDate: formatDates(parsedData.certificatedetails.expiryDate),
        expiry: formatDates(parsedData.certificatedetails.expiry),
      }));
    }
  }, [getSportList]);

  const handleFileChange = (file: any, flag: any) => {
    setFormData((prevData) => ({
      ...prevData,
      levelCertificate: file?.name,
    }));
  };

  const dateChange = (data: any) => {
    setFormData({ ...formData, [data.name]: data.value });
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

  const handleClose = () => {
    setShowBanner(false);
  };


  const handleFile = () => {
    if (fileCertificateRef.current) {
      fileCertificateRef.current.click();
    }
  };

  const handleDeleteFile = async (modulename: any, moduleId: any, fileType: any) => {
    const fileID = editStaffData?.attachmentList?.find(
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
      setFormData((prev) => ({
        ...prev,
        levelCertificate: "",
      }));
    }
  }

  const handleBack = () => {
    setAllData((prevFormData: any) => ({
      ...prevFormData,
      certificatedetails: formData
    }))
    setActiveStep(3)
  };

  const handleChangeSports = (selectedOption: any | null): void => {
    if (selectedOption) {
      const selectedValues = Array.isArray(selectedOption)
        ? selectedOption.map((option: any) => option.value)
        : [selectedOption.value];
      setSelectedSportsOption(selectedOption);
      setFormData({
        ...formData,
        sport: selectedValues.join(","),
      });
      setErrors({
        ...errors,
        sport: "",
      });
    }
  };

  const teamsNames = getSportList && getSportList.data
  useEffect(() => {
    const teams: any = getDefaultOption(teamsNames)
    setSportsOption(teams)
  }, [teamsNames])

  const getDefaultOption = (teamsNames: any) => {
    const defaultOptions = []
    for (const item in teamsNames) {
      defaultOptions.push({ label: teamsNames[item].sportName, value: teamsNames[item].sportID })
    }
    return defaultOptions
  }

  useEffect(() => {
    if (getSportList?.data && teamId) {
      const sport = parsedData?.certificatedetails?.sport || '';
      if (_.isEmpty(sport)) {
        const data: any = getDefaultOption(getSportList.data);
        const selOption: any = _.filter(data, (x: any) =>
          x.value && _.includes(teamId.split(","), x.value.toString())
        );
        setSelectedSportsOption(selOption);
        const selectedValues = Array.isArray(selOption)
          ? selOption.map((option: any) => option.value)
          : [];
        setFormData({
          ...formData,
          sport: selectedValues.join(","),
        });
      }
    }
  }, [getSportList?.data, teamId]);


  return (
    <Fade in={true} timeout={1000}>
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
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Coaching Certifications
                  </Typography>
                  <CustomTextField
                    name="coachingCertifications"
                    placeholder="Enter Coaching Certifications"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.coachingCertifications}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 50 }}
                    onKeyPress={(e) => {
                      if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                        e.preventDefault()
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={5.5}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Issuing organization
                  </Typography>
                  <CustomTextField
                    name="issuingOrganization"
                    placeholder="Enter Issuing organization"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.issuingOrganization}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 50 }}
                    onKeyPress={(e) => {
                      if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                        e.preventDefault()
                      }
                    }}
                  />
                </Grid>
                <Grid container item xs={12} md={5.5} spacing={2}>
                  <Grid item xs={6}>
                    <Typography
                      gutterBottom
                      className="typography textfield-label bukra"
                    >
                      Date of Certification
                    </Typography>
                    <CustomDatePicker
                      control={control}
                      hidden={true}
                      name="dateOfCertificate"
                      label="Date of Certification"
                      boxmb={0.8}
                      required={true}
                      minDate={moment().subtract(40, "years")}
                      maxDate={moment()}
                      onChange={dateChange}
                      defaultValue={formData && formData.dateOfCertificate}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      gutterBottom
                      className="typography textfield-label bukra"
                    >
                      Expiry Date
                    </Typography>
                    <CustomDatePicker
                      control={control}
                      hidden={true}
                      name="expiryDate"
                      label="Date of Expiry Date"
                      boxmb={0.8}
                      required={true}
                      minDate={moment().subtract(40, "years")}
                      // minDate={formData.dateOfCertificate || moment().subtract(50, "years")}
                      maxDate={moment().add(10, "years")}
                      onChange={dateChange}
                      defaultValue={formData && formData.expiryDate}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} md={5.5}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Level
                  </Typography>
                  <CustomTextField
                    name="level"
                    placeholder="Enter Level"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.level}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 50 }}
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
                          formatType={FILE_FORMAT_PDF_IMAGE}
                          type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                          
                          flag={DROPZONE_IMAGE_FLAG.Level}
                          setData={setFormData}
                          formData={formData}
                          modulename="Staff"
                          moduleId={parsedData.staffID}
                          fileInputRef={fileCertificateRef}
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
                          onClick={handleFile}
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          {formData.levelCertificate ? (
                            <>{formData.levelCertificate}</>
                          ) : (
                            <>Upload certificates in PDF/JPEG format</>
                          )}
                        </Typography>
                        {formData.levelCertificate && (
                          <IconButton
                            className="deleteIconButton"
                            aria-label="delete"
                            onClick={() => { handleDeleteFile("Staff", parsedData.staffID, "level") }}
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
                    Federation License
                  </Typography>
                  <CustomTextField
                    name="federationLicence"
                    placeholder="Enter Federation License"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.federationLicence}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 100 }}
                    onKeyPress={(e) => {
                      if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                        e.preventDefault()
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={5.5}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Expiry
                  </Typography>
                  <CustomDatePicker
                    control={control}
                    hidden={true}
                    name="expiry"
                    label="Date of Expiry"
                    boxmb={0.8}
                    required={true}
                    minDate={moment().subtract(50, "years")}
                    maxDate={moment().add(10, "years")}
                    onChange={dateChange}
                    defaultValue={formData && formData.expiry}
                  />
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
                          return <Typography color="textSecondary" style={{
                            height: 27,
                            fontFamily: 'Dubai',
                            fontSize: '16px',
                            fontWeight: 500,
                            lineHeight: '25.01px',
                            textAlign: 'left',
                            marginLeft: 10
                          }}>Select Languages</Typography>;
                        }
                        return (
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {selected.map((value: string) => (
                              <Chip
                                style={{
                                  height: 23,
                                  fontFamily: 'Dubai',
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  lineHeight: '25.01px',
                                  textAlign: 'left',
                                  marginLeft: 8
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
                        )
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
                    Sport <span className="asterisk">*</span>
                  </Typography>
                  <ReactSelect
                    isMulti={true}
                    name='sport'
                    className='select2'
                    classNamePrefix='select'
                    handleChangeReactSelect={handleChangeSports}
                    options={SportsOption}
                    value={SelectedSportsOption}
                    isDisabled={!SportsOption}
                    placeholder="Select Sport"
                  />
                  {errors.sport && (
                    <Typography variant="caption" className="error-message">
                      {errors.sport}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.5}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Medical Issues
                  </Typography>
                  <FormControl component="fieldset">
                    <RadioGroup
                      name="medicalIssues"
                      value={formData.medicalIssues}
                      onChange={handleChange}
                      row
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                        className="dubai-med textfield-label"
                      />
                      <FormControlLabel
                        value="No"
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
                    Previous Sport Ethical Conduct
                  </Typography>
                  <CustomTextField
                    name="previousSportEthicalConduct"
                    placeholder="Enter Previous Sport Ethical Conduct"
                    type="text"
                    variant="outlined"
                    multiline
                    rows={5}
                    fullWidth
                    value={formData.previousSportEthicalConduct}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 200 }}
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
                  disabled={staffAddcertificateData.loading}
                >
                  {staffAddcertificateData.loading ? "Loading..." : "Finish"}
                </Button >
              </Box >
            </form >
          </Box >
        </Grid >
      </Grid >
    </Fade >
  );
};
export default CertificationsAndLicenses;
