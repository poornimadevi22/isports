"use client";
import { useEffect, useState } from "react";
import {
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  styled,
  Alert,
  Snackbar,
  Fade,
} from "@mui/material";
import { REGEX } from "@/utils/constants";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { AppDispatch, RootState } from "@/redux/store";
import { getLocalStorage, trimFormData } from "@/utils/helper";
import { useFormValidation } from "@/utils/staffs/validation";
import { addStaff, clearAddState } from "@/redux/slices/staff/staffAddSlice";

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
  residence: string;
  personalEmail: string;
  dubaiPoliceEmail: string;
  phoneNo: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
}

type FormErrors = {
  residence?: string;
  personalEmail?: string;
  dubaiPoliceEmail?: string;
  phoneNo?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
};

const ContactDetails = (props: any) => {
  const { activeStep, setActiveStep, setAllData, allData } = props;
  const dispatch: AppDispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>({
    residence: "",
    personalEmail: "",
    dubaiPoliceEmail: "",
    phoneNo: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const { validate } = useFormValidation(formData, setErrors);
  const [showBanner, setShowBanner] = useState(false);
  const savedData: any = getLocalStorage("addStaffData");
  const parsedData = JSON.parse(savedData);
  const staffAddContactData = useSelector((state: RootState) => state.staffAdd);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    const validationErrors = validate();
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (_.isEmpty(validationErrors)) {
      const trimmedRest = trimFormData(formData);
      const data = {
        ...trimmedRest,
        section: "contactdetails",
        staffID: parsedData.staffID,
        loggedUserID: "1",
      };
      dispatch(addStaff({ url: "/UpdateStaffByID", payload: data }));
    }
  };

  useEffect(() => {
    if (staffAddContactData && staffAddContactData.code === 200) {
      setAllData((prevFormData: any) => ({
        ...prevFormData,
        contactdetails: formData,
      }));
      dispatch(clearAddState());
      setActiveStep(2);
    } else if (staffAddContactData && staffAddContactData.code === 500) {
      setShowBanner(true);
      setTimeout(() => {
        dispatch(clearAddState())
        setShowBanner(false);
      }, 2000);
    }
  }, [staffAddContactData]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowBanner(false);
  };

  useEffect(() => {
    if (parsedData.contactdetails) {
      setFormData((formData) => ({
        ...formData,
        residence: parsedData.contactdetails.residence || "",
        personalEmail: parsedData.contactdetails.personalEmail || "",
        dubaiPoliceEmail: parsedData.contactdetails.dubaiPoliceEmail || "",
        phoneNo: parsedData.contactdetails.phoneNo || "",
        emergencyContactName: parsedData.contactdetails.emergencyContactName || "",
        emergencyContactNumber:
          parsedData.contactdetails.emergencyContactNumber || "",
      }));
    }
  }, []);

  const handleBack = () => {
    setAllData((prevFormData: any) => ({
      ...prevFormData,
      contactdetails: formData,
    }));
    setActiveStep(0)
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
            <form onSubmit={handleSubmit}>
              {showBanner &&
                <Snackbar
                  open={showBanner}
                  autoHideDuration={3000}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                  <Alert onClose={handleClose} severity="error" variant="filled">
                    {staffAddContactData && staffAddContactData.error}
                  </Alert>
                </Snackbar>
              }
              <Grid container justifyContent={"space-between"} spacing={2}>
                <Grid item xs={12} md={5.5}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Residence <span className="asterisk">*</span>
                  </Typography>
                  <CustomTextField
                    name="residence"
                    placeholder="Enter residence"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.residence}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 100 }}
                    onKeyPress={(e) => {
                      if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                        e.preventDefault()
                      }
                    }}
                  />
                  {errors.residence && (
                    <Typography variant="caption" className="error-message">
                      {errors.residence}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.5}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Personal Email <span className="asterisk">*</span>
                  </Typography>
                  <CustomTextField
                    name="personalEmail"
                    placeholder="Enter personal email"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.personalEmail}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 100 }}
                  />
                  {errors.personalEmail && (
                    <Typography variant="caption" className="error-message">
                      {errors.personalEmail}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.5}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Dubai Police Email <span className="asterisk">*</span>
                  </Typography>
                  <CustomTextField
                    name="dubaiPoliceEmail"
                    placeholder="Enter Dubai police Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    value={formData.dubaiPoliceEmail}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 100 }}
                  />
                  {errors.dubaiPoliceEmail && (
                    <Typography variant="caption" className="error-message">
                      {errors.dubaiPoliceEmail}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.5}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Phone Number <span className="asterisk">*</span>
                  </Typography>
                  <CustomTextField
                    name="phoneNo"
                    placeholder="Enter phone number"
                    type="tel"
                    variant="outlined"
                    fullWidth
                    value={formData.phoneNo}
                    onChange={handleChange}
                    inputProps={{ maxLength: 15 }}
                    onKeyPress={(e) => {
                      if (!REGEX.NUMERIC.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="Text-field-customise"
                  />
                  {errors.phoneNo && (
                    <Typography variant="caption" className="error-message">
                      {errors.phoneNo}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.5}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Emergency Contact Name <span className="asterisk">*</span>
                  </Typography>
                  <CustomTextField
                    name="emergencyContactName"
                    placeholder="Enter emergency contact name"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 50 }}
                    onKeyPress={(e) => {
                      if (!REGEX.TEXT.test(e.key)) {
                        e.preventDefault()
                      }
                    }}
                  />
                  {errors.emergencyContactName && (
                    <Typography variant="caption" className="error-message">
                      {errors.emergencyContactName}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.5}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Emergency Contact Number <span className="asterisk">*</span>
                  </Typography>
                  <CustomTextField
                    name="emergencyContactNumber"
                    placeholder="Enter emergency contact number"
                    type="tel"
                    variant="outlined"
                    fullWidth
                    value={formData.emergencyContactNumber}
                    onChange={handleChange}
                    inputProps={{ maxLength: 15 }}
                    onKeyPress={(e) => {
                      if (!REGEX.NUMERIC.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="Text-field-customise"
                  />
                  {errors.emergencyContactNumber && (
                    <Typography variant="caption" className="error-message">
                      {errors.emergencyContactNumber}
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
                  disabled={staffAddContactData.loading}
                >
                  {staffAddContactData.loading ? "Loading..." : "Save & Continue"}
                </Button>
              </Box>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Fade>
  );
};
export default ContactDetails;