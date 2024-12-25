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
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
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
  BLOOD_GROUPS,
  PDF_FORMAT,
} from "@/utils/constants";
import FileUpload from "@/utils/dropzone";
import {
  addAthlete,
  clearAddState,
} from "@/redux/slices/athlete/athleteAddSlice";
import { editAthlete } from "@/redux/slices/athlete/athleteEditSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import { PhysicalAndMedicalFormValidation } from "@/utils/athletes/validation";
import { deleteFile } from "@/redux/slices/fileupload/deleteFile";

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

const PhysicalAndMedical = (props: any) => {
  const {
    activeStep,
    setActiveStep,
    setAllData,
    allData,
    teamId,
    editAthleteData,
    editPayload,
  } = props;
  const savedData: any = getLocalStorage("addAthleteData");
  const parsedData = JSON.parse(savedData);
  const dispatch: AppDispatch = useDispatch();
  const athleteAddeducationData = useSelector(
    (state: RootState) => state.athleteAdd
  );
  const [formData, setFormData] = useState<any>({
    height: "",
    heightUnit: "CM",
    weight: "",
    weightUnit: "KG",
    bloodType: "",
    previousInjuries: "",
    federationLicense: "",
    sizeOfShoe: "",
    sizeOfJersey: "",
    sizeOfHelmet: "",
    sizeOfGloves: "",
    sizeOfTrousers: "",
    uploadLicense: "",
  });
  const [showBanner, setShowBanner] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const { validate } = PhysicalAndMedicalFormValidation(formData, setErrors);
  const filelicenseRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (_.isEmpty(validationErrors)) {
      const { uploadCertificate, ...rest } = formData;
      const trimmedRest = trimFormData(rest);
      const data = {
        ...trimmedRest,
        section: "physicalmedicaldetails",
        athleteID: parsedData.athleteID,
        loggedUserID: 1,
      };
      dispatch(addAthlete({ url: "/UpdateAthleteByID", payload: data }));
    }
  };

  useEffect(() => {
    if (athleteAddeducationData && athleteAddeducationData.code === 200) {
      const { uploadCertificate, ...rest } = formData;
      setAllData((prevFormData: any) => ({
        ...prevFormData,
        physicalmedicaldetails: rest,
      }));
      dispatch(editAthlete(editPayload));
      dispatch(clearAddState());
      setShowBanner(false);
      setActiveStep(4);
    } else if (
      athleteAddeducationData &&
      athleteAddeducationData.code === 500
    ) {
      setShowBanner(true);
    }
  }, [athleteAddeducationData]);

  const handleFileChange = (file: any, flag: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      uploadLicense: file?.name,
    }));
  };

  useEffect(() => {
    if (parsedData.physicalmedicaldetails) {
      setFormData((formData: any) => ({
        ...formData,
        height: parsedData.physicalmedicaldetails.height || "",
        heightUnit: parsedData.physicalmedicaldetails.heightUnit || "",
        weightUnit: parsedData.physicalmedicaldetails.weightUnit || "",
        weight: parsedData.physicalmedicaldetails.weight || "",
        bloodType: parsedData.physicalmedicaldetails.bloodType || "",
        previousInjuries:
          parsedData.physicalmedicaldetails.previousInjuries || "",
        federationLicense:
          parsedData.physicalmedicaldetails.federationLicense || "",
        sizeOfShoe: parsedData.physicalmedicaldetails.sizeOfShoe || "",
        sizeOfJersey: parsedData.physicalmedicaldetails.sizeOfJersey || "",
        sizeOfHelmet: parsedData.physicalmedicaldetails.sizeOfHelmet || "",
        sizeOfGloves: parsedData.physicalmedicaldetails.sizeOfGloves || "",
        sizeOfTrousers: parsedData.physicalmedicaldetails.sizeOfTrousers || "",
        uploadLicense: parsedData.license || "",
      }));
    }
  }, []);

  const bloodChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, bloodType: value });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleBack = () => {
    setAllData((prevFormData: any) => ({
      ...prevFormData,
      physicalmedicaldetails: formData,
    }));
    dispatch(editAthlete(editPayload));
    setActiveStep(2);
  };

  const handlicenseClick = () => {
    if (filelicenseRef.current) {
      filelicenseRef.current.click();
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
    console.log("fileID", fileID);
    console.log("editAthleteData", editAthleteData);

    if (moduleId) {
      const data = {
        moduleName: modulename,
        moduleID: moduleId,
        docSection: fileType,
        loggedUserID: 1,
        fileID: fileID,
      };
      dispatch(deleteFile(data));
      setFormData((prev: any) => ({
        ...prev,
        [fileType]: "",
      }));
    }
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
          <form onSubmit={handleSubmit}>
            {showBanner &&
              athleteAddeducationData &&
              !_.isEmpty(athleteAddeducationData.message) && (
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
                    {athleteAddeducationData && athleteAddeducationData.message}
                  </Alert>
                </Snackbar>
              )}
            <Grid container spacing={2} justifyContent={"space-between"}>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Height <span className="asterisk">*</span>
                </Typography>
                <FormControl
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <OutlinedInput
                    sx={{
                      flexGrow: 1,
                      marginRight: "8px",
                      height: "40px",
                      backgroundColor: "#00875508",
                      "& .MuiOutlinedInput-input": {
                        padding: "8px 12px",
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#00875508",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#40a377",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#40a377",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#40a377",
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
                        e.preventDefault();
                      }
                    }}
                    inputProps={{ maxLength: 5 }}
                    endAdornment={
                      <InputAdornment position="end">
                        <Select
                          // defaultValue="CM"
                          className="Text-field-customise"
                          sx={{
                            borderLeft: "1px solid grey",
                            minWidth: "10ch",
                            borderRadius: "0",
                            height: "100%",
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "& .MuiSelect-select": {
                              paddingLeft: "8px",
                              display: "flex",
                              alignItems: "center",
                            },
                          }}
                          disableUnderline
                          name="heightUnit"
                          value={formData.heightUnit}
                          onChange={(e: any) =>
                            setFormData({
                              ...formData,
                              heightUnit: e.target.value,
                            })
                          }
                        >
                          <MenuItem value="CM" className="dubai-med">CM</MenuItem>
                          <MenuItem value="MM" className="dubai-med">MM</MenuItem>
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
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Weight <span className="asterisk">*</span>
                </Typography>
                <FormControl
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <OutlinedInput
                    sx={{
                      flexGrow: 1,
                      marginRight: "8px",
                      height: "40px",
                      backgroundColor: "#00875508",
                      "& .MuiOutlinedInput-input": {
                        padding: "8px 12px",
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#00875508",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#40a377",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#40a377",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#40a377",
                      },
                    }}
                    placeholder="Enter Weight"
                    className="custom-outlined-input Text-field-customise"
                    type="text"
                    name="weight"
                    fullWidth
                    value={formData.weight}
                    onChange={handleChange}
                    onKeyPress={(e) => {
                      if (!REGEX.WEIGHT.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    inputProps={{ maxLength: 5 }}
                    endAdornment={
                      <InputAdornment position="end">
                        <Select
                          className="Text-field-customise"
                          defaultValue="KG"
                          sx={{
                            borderLeft: "1px solid grey",
                            minWidth: "10ch",
                            height: "100%",
                            borderRadius: "0",
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "& .MuiSelect-select": {
                              paddingLeft: "8px",
                              display: "flex",
                              alignItems: "center",
                            },
                          }}
                          disableUnderline
                          name="weightUnit"
                          value={formData.weightUnit}
                        >
                          <MenuItem value="KG" className="dubai-med">KG</MenuItem>
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
                  Blood Type <span className="asterisk">*</span>
                </Typography>
                <FormControl
                  variant="outlined"
                  fullWidth
                  className="selectFieldContainer"
                >
                  <Select
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={bloodChange}
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
                        Select Blood Type
                      </Typography>
                    </MenuItem>
                    {BLOOD_GROUPS.map((option) => (
                      <MenuItem key={option} value={option}>
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
                          {option}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.bloodType && (
                  <Typography variant="caption" className="error-message">
                    {errors.bloodType}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Previous Injuries
                </Typography>
                <CustomTextField
                  name="previousInjuries"
                  placeholder="Enter Previous Injuries"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.previousInjuries}
                  onChange={handleChange}
                  className="Text-field-customise"
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault();
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
                  Federation License
                </Typography>
                <CustomTextField
                  name="federationLicense"
                  placeholder="Enter Federation License"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.federationLicense}
                  onChange={handleChange}
                  className="Text-field-customise"
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  inputProps={{ maxLength: 100 }}
                />
                <Grid
                  xs={12}
                  md={12}
                  container
                  spacing={0}
                  justifyContent="start"
                  alignItems="center"
                  mt={1}
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
                        
                        flag={DROPZONE_IMAGE_FLAG.LICENSE}
                        setData={setFormData}
                        formData={formData}
                        modulename="Athlete"
                        moduleId={parsedData.athleteID}
                        fileInputRef={filelicenseRef}
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
                        onClick={handlicenseClick}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        {formData.uploadLicense ? (
                          <>{formData.uploadLicense}</>
                        ) : (
                          <>
                            Upload License Certificate: PDF format (max size 25
                            MB)
                          </>
                        )}
                      </Typography>
                      {formData.uploadLicense && (
                        <IconButton
                          className="deleteIconButton"
                          aria-label="delete"
                          onClick={() => {
                            handleDeleteFile(
                              "Athlete",
                              parsedData?.athleteID,
                              "license"
                            );
                            setFormData((prev: any) => ({
                              ...prev,
                              uploadLicense: "",
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
                  Size Of Shoe <span className="asterisk">*</span>
                </Typography>
                <FormControl
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <OutlinedInput
                    sx={{
                      flexGrow: 1,
                      marginRight: "8px",
                      height: "40px",
                      backgroundColor: "#00875508",
                      "& .MuiOutlinedInput-input": {
                        padding: "8px 12px",
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#00875508",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#40a377",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#40a377",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#40a377",
                      },
                    }}
                    placeholder="Enter Size Of Shoe"
                    className="custom-outlined-input Text-field-customise"
                    type="text"
                    name="sizeOfShoe"
                    fullWidth
                    value={formData.sizeOfShoe}
                    onChange={handleChange}
                    onKeyPress={(e) => {
                      if (!REGEX.WEIGHT.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    inputProps={{ maxLength: 5 }}
                    endAdornment={
                      <InputAdornment position="end">
                        <Select
                          className="Text-field-customise"
                          defaultValue="KG"
                          sx={{
                            borderLeft: "1px solid grey",
                            minWidth: "10ch",
                            height: "100%",
                            borderRadius: "0",
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "& .MuiSelect-select": {
                              paddingLeft: "8px",
                              display: "flex",
                              alignItems: "center",
                            },
                          }}
                          disableUnderline
                          // name="weightUnit"
                          value="EU"
                        >
                          <MenuItem value="EU" className="dubai-med">EU</MenuItem>
                        </Select>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                {errors.sizeOfShoe && (
                  <Typography variant="caption" className="error-message">
                    {errors.sizeOfShoe}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Size Of Jersey <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="sizeOfJersey"
                  placeholder="Enter Size Of Jersey"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.sizeOfJersey}
                  onChange={handleChange}
                  className="Text-field-customise"
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC_DOT.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  inputProps={{ maxLength: 100 }}
                />
                {errors.sizeOfJersey && (
                  <Typography variant="caption" className="error-message">
                    {errors.sizeOfJersey}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Size Of Helmet <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="sizeOfHelmet"
                  placeholder="Enter Size Of Helmet"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.sizeOfHelmet}
                  onChange={handleChange}
                  className="Text-field-customise"
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC_DOT.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  inputProps={{ maxLength: 100 }}
                />
                {errors.sizeOfHelmet && (
                  <Typography variant="caption" className="error-message">
                    {errors.sizeOfHelmet}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Size Of Gloves <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="sizeOfGloves"
                  placeholder="Enter Size Of Gloves"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.sizeOfGloves}
                  onChange={handleChange}
                  className="Text-field-customise"
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  inputProps={{ maxLength: 100 }}
                />
                {errors.sizeOfGloves && (
                  <Typography variant="caption" className="error-message">
                    {errors.sizeOfGloves}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.5}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Size Of Trousers <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="sizeOfTrousers"
                  placeholder="Enter Size Of Trousers"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.sizeOfTrousers}
                  onChange={handleChange}
                  className="Text-field-customise"
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC_DOT.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  inputProps={{ maxLength: 100 }}
                />
                {errors.sizeOfTrousers && (
                  <Typography variant="caption" className="error-message">
                    {errors.sizeOfTrousers}
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
                disabled={athleteAddeducationData.loading}
              >
                {athleteAddeducationData.loading
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
export default PhysicalAndMedical;