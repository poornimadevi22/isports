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
  Fade,
  FormControlLabel,
  Radio,
  RadioGroup
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { AppDispatch, RootState } from "@/redux/store";
import { EmploymentFormValidation } from "@/utils/staffs/validation";
import { useRouter } from "next/navigation";
import AttachFileSharpIcon from '@mui/icons-material/AttachFileSharp';
import { DROPZONE_IMAGE_NAME_TYPES, DROPZONE_IMAGE_FLAG, FILE_FORMAT_TYPE_DOCUMENT, PDF_FORMAT, REGEX } from "@/utils/constants";
import FileUpload from "@/utils/dropzone";
import DeleteIcon from '@mui/icons-material/Delete';
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import { useForm } from "react-hook-form";
import moment from 'moment';
import { formatDates, getLocalStorage, trimFormData } from "@/utils/helper";
import { addStaff, clearAddState } from "@/redux/slices/staff/staffAddSlice";
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

const qualificationOptions = [
  { value: 'bachelor', label: 'Bachelor’s Degree' },
  { value: 'master', label: 'Master’s Degree' },
  { value: 'phd', label: 'Ph.D.' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'highschool', label: 'High School' },
];

const employmentStatus = [
  { value: 'Permanent Contract', label: 'Permanent Contract' },
  { value: 'Collaboration Contract', label: 'Collaboration Contract' },
  { value: 'Temporary Contract', label: 'Temporary Contract' }
];

interface FormData {
  qualification: string;
  currentJobPosition: string;
  currentJobLocation: string;
  dpEmployeeNumber: string;
  rankOrGrade: string;
  dateOfLastJobPromotion: string;
  department: string;
  dpEmploymentStatus: string;
  contractStartDate: string;
  contractEndDate: string;
  contractDocument: string;
}

type FormErrors = {
  qualification?: string;
  currentJobPosition?: string;
  currentJobLocation?: string;
  dpEmployeeNumber?: string;
  department?: string;
  rankOrGrade?: string;
  dateOfLastJobPromotion?: string;
  dpEmploymentStatus?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  assignedAthletesSports?: string;
  acknowledgementDate?: string;
  pledgeDate?: string;
};


const EmploymentInformation = (props: any) => {
  const { setActiveStep, setAllData, allData, editStaffData, filepayload } = props
  const { handleSubmit, control } = useForm()
  const dispatch: AppDispatch = useDispatch();
  const [formData, setFormData] = useState<any>({
    // qualification: '',
    currentJobPosition: '',
    currentJobLocation: '',
    dpEmployeeNumber: '',
    rankOrGrade: '',
    dateOfLastJobPromotion: '',
    department: '',
    dpEmploymentStatus: '',
    contractStartDate: '',
    contractEndDate: '',
    contractDocument: '',
    assignedAthletesSports: '',
    punctualityInMeetings: '',
    availabilityOnTraining: '',
    acknowledgementDate: '',
    pledgeDate: '',
  });
  const fileCertificateRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const { validate } = EmploymentFormValidation(formData, setErrors);
  const [showBanner, setShowBanner] = useState(false);
  const savedData: any = getLocalStorage('addStaffData');
  const parsedData = JSON.parse(savedData);
  const staffAddEmployementData = useSelector((state: RootState) => state.staffAdd);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const { contractDocument, ...rest } = formData;
      const trimmedRest = trimFormData(rest);
      const data = {
        ...trimmedRest,
        dateOfLastJobPromotion: moment(formData.dateOfLastJobPromotion, 'DD/MM/YYYY').format('DD/MM/YYYY'),
        contractStartDate: moment(formData.contractStartDate, 'DD/MM/YYYY').format('DD/MM/YYYY'),
        contractEndDate: moment(formData.contractEndDate, 'DD/MM/YYYY').format('DD/MM/YYYY'),
        acknowledgementDate : moment(formData.acknowledgementDate, 'DD/MM/YYYY').format('DD/MM/YYYY'),
        pledgeDate: moment(formData.pledgeDate, 'DD/MM/YYYY').format('DD/MM/YYYY'),
        "section": "employeedetails",
        staffID: parsedData.staffID,
        "loggedUserID": "1"
      };
      dispatch(addStaff({ url: "/UpdateStaffByID", payload: data }));
    }
  };

  useEffect(() => {
    if (staffAddEmployementData && staffAddEmployementData.code === 200) {
      setAllData((prevFormData: any) => ({
        ...prevFormData,
        employeedetails: formData
      }))
      dispatch(clearAddState());
      setActiveStep(3)
    } else if (staffAddEmployementData && staffAddEmployementData.code === 500) {
      setShowBanner(true)
    }
  }, [staffAddEmployementData])

  useEffect(() => {
    if (parsedData.employeedetails) {
      setFormData((formData: any) => ({
        ...formData,
        qualification: parsedData.employeedetails.qualification || '',
        currentJobPosition: parsedData.employeedetails.currentJobPosition || '',
        currentJobLocation: parsedData.employeedetails.currentJobLocation || '',
        dpEmployeeNumber: parsedData.employeedetails.dpEmployeeNumber || '',
        rankOrGrade: parsedData.employeedetails.rankOrGrade || '',
        dateOfLastJobPromotion: formatDates(parsedData.employeedetails.dateOfLastJobPromotion),
        department: parsedData.employeedetails.department || '',
        dpEmploymentStatus: parsedData.employeedetails.dpEmploymentStatus || '',
        contractStartDate: formatDates(parsedData.employeedetails.contractStartDate),
        contractEndDate: formatDates(parsedData.employeedetails.contractEndDate),
        pledgeDate: formatDates(parsedData.employeedetails.pledgeDate),
        acknowledgementDate: formatDates(parsedData.employeedetails.acknowledgementDate),
        contractDocument: parsedData.contract || '',
        punctualityInMeetings: parsedData.employeedetails.punctualityInMeetings || '',
        assignedAthletesSports: parsedData.employeedetails.assignedAthletesSports || '',
        availabilityOnTraining: parsedData.employeedetails.availabilityOnTraining || ''
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
    setFormData({ ...formData, qualification: event.target.value });
    setErrors({
      ...errors,
      qualification: "",
    });
  };

  const policyStatusChange = (event: any) => {
    setFormData({ ...formData, dpEmploymentStatus: event.target.value });
    setErrors({
      ...errors,
      dpEmploymentStatus: "",
    });
  };

  const handleFileChange = (file: any, flag: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      contractDocument: flag === DROPZONE_IMAGE_FLAG.UPLOAD_CONTRACT ? file?.name : prevData.contractDocument,
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

  const handleIdClick = () => {
    if (fileCertificateRef.current) {
      fileCertificateRef.current.click();
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
      setFormData((prev: any) => ({
        ...prev,
        [fileType]: "",
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [fileType]: "",
      }));
    }
  }

  const handleBack = () => {
    setAllData((prevFormData: any) => ({
      ...prevFormData,
      employeedetails: formData
    }))
    setActiveStep(1)
  };

  const getMinDate = () => {
    const contractStart = moment(
      formData.contractStartDate,
      'DD/MM/YYYY',
      true
    );
    return contractStart.isValid()
      ? contractStart
      : moment().subtract(50, "years");
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
          alignItems={{ xs: 'top', md: 'center' }}
          sx={{
            padding: "2rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box width="100%" mx={{ sm: 5, md: 1, lg: 1, xl: 5 }} px={{ sm: 5, md: 2, lg: 3, xl: 5 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {showBanner && staffAddEmployementData && !_.isEmpty(staffAddEmployementData.message) && (
                <Snackbar
                  open={showBanner}
                  autoHideDuration={6000}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <Alert onClose={handleClose} severity="error" variant="filled">
                    {staffAddEmployementData && staffAddEmployementData.message}
                  </Alert>
                </Snackbar>
              )}
              <Grid container spacing={2} justifyContent={'space-between'}>
                <Grid item xs={12} md={5.5}>
                  <Typography gutterBottom className="typography textfield-label bukra">
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
                    inputProps={{ maxLength: 50 }}
                    onKeyPress={(e) => {
                      if (!REGEX.TEXT.test(e.key)) {
                        e.preventDefault()
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
                  <Typography gutterBottom className="typography textfield-label bukra">
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
                        e.preventDefault()
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
                  <Typography gutterBottom className="typography textfield-label bukra">
                    Dubai Police Employee Number <span className="asterisk">*</span>
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
                        e.preventDefault()
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
                  <Typography gutterBottom className="typography textfield-label bukra">
                    Assigned Athletes/Sports 
                  </Typography>
                  <CustomTextField
                    name="assignedAthletesSports"
                    placeholder="Enter Previous Athlete Experience"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.assignedAthletesSports}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 40 }}
                    onKeyPress={(e) => {
                      if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                        e.preventDefault()
                      }
                    }}
                  />
                  {errors.assignedAthletesSports && (
                    <Typography variant="caption" className="error-message">
                      {errors.assignedAthletesSports}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.5}>
                  <Typography gutterBottom className="typography textfield-label bukra">
                    Rank <span className="asterisk">*</span>
                  </Typography>
                  <CustomTextField
                    name="rankOrGrade"
                    placeholder="Enter Rank"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.rankOrGrade}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 50 }}
                    onKeyPress={(e) => {
                      if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                        e.preventDefault()
                      }
                    }}
                  />
                  {errors.rankOrGrade && (
                    <Typography variant="caption" className="error-message">
                      {errors.rankOrGrade}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.5}>
                  <Typography gutterBottom className="typography textfield-label bukra">
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
                    inputProps={{ maxLength: 50 }}
                    onKeyPress={(e) => {
                      if (!REGEX.TEXT.test(e.key)) {
                        e.preventDefault()
                      }
                    }}
                  />
                  {errors.department && (
                    <Typography variant="caption" className="error-message">
                      {errors.department}
                    </Typography>
                  )}
                </Grid>
                <Grid container item xs={12} md={5.5}>
                  <CustomDatePicker
                    control={control}
                    name="dateOfLastJobPromotion"
                    label="Date of Last Job Promotion"
                    boxmb={0.8}
                    required={true}
                    minDate={moment().subtract(50, 'years')}
                    maxDate={moment()}
                    onChange={dateChange}
                    defaultValue={formData && formData.dateOfLastJobPromotion}
                  />
                  {errors.dateOfLastJobPromotion && (
                    <Typography variant="caption" className="error-message">
                      {errors.dateOfLastJobPromotion}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.5}>
                  <Typography gutterBottom className="typography textfield-label bukra">
                    Dubai Police Employment Status <span className="asterisk">*</span>
                  </Typography>
                  <FormControl variant="outlined" fullWidth className="selectFieldContainer">
                    <Select
                      value={formData.dpEmploymentStatus}
                      onChange={policyStatusChange}
                      displayEmpty
                      className="Text-field-customise"
                    >
                      <MenuItem value="" disabled>
                        <Typography variant="body2" color="textSecondary">
                          Select DP Employment Status
                        </Typography>
                      </MenuItem>
                      {employmentStatus.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          <Typography variant="body1" color="textPrimary">
                            {option.label}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.dpEmploymentStatus && (
                      <Typography variant="caption" className="error-message">
                        {errors.dpEmploymentStatus}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid container item xs={12} md={5.5} spacing={2} mt={0}>
                  <Grid item xs={6}>
                    <Typography gutterBottom className="typography textfield-label bukra">
                      Contract Start Date <span className="asterisk">*</span>
                    </Typography>
                    <CustomDatePicker
                      control={control}
                      hidden={true}
                      name="contractStartDate"
                      label="Contract Start Date"
                      boxmb={0.8}
                      required={true}
                      minDate={moment().subtract(50, 'years')}
                      maxDate={moment().add(10, 'years')}
                      onChange={dateChange}
                      defaultValue={formData && formData.contractStartDate}
                    />
                    {errors.contractStartDate && (
                      <Typography variant="caption" className="error-message" mt={2}>
                        {errors.contractStartDate}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography gutterBottom className="typography textfield-label bukra">
                      Contract End Date <span className="asterisk">*</span>
                    </Typography>
                    <CustomDatePicker
                      control={control}
                      hidden={true}
                      name="contractEndDate"
                      label="Contract End Date"
                      boxmb={0.8}
                      required={true}
                      minDate={getMinDate()}
                      maxDate={moment().add(10, 'years')}
                      onChange={dateChange}
                      defaultValue={formData && formData.contractEndDate}
                    />
                    {errors.contractEndDate && (
                      <Typography variant="caption" className="error-message" mt={2}>
                        {errors.contractEndDate}
                      </Typography>
                    )}
                  </Grid>
                  <Grid container spacing={0} justifyContent="start" alignItems="center" mt={1}>
                    <Grid item alignItems="flex-start">
                      <IconButton
                        className="attachFileButton"
                        component="label"
                        aria-label="attach-file"
                        sx={{
                          color: '#ef0a0a',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 0, 0, 0.1)',
                          },
                          padding: 1,
                        }}
                      >
                        <FileUpload
                          onFileChange={(file: any, flag: any) => handleFileChange(file, flag)}
                          formatType={PDF_FORMAT}
                          type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                          
                          flag={DROPZONE_IMAGE_FLAG.UPLOAD_CONTRACT}
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
                    <Grid item>
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
                          {formData.contractDocument ? (
                            <>{formData.contractDocument}</>
                          ) : (
                            <>Upload Contract: PDF format (max size 25 MB)</>
                          )}
                        </Typography>
                        {formData.contractDocument && (
                          <IconButton
                            className="deleteIconButton"
                            aria-label="delete"
                            onClick={() => { handleDeleteFile("Staff", parsedData.staffID, "contractDocument") }}
                            sx={{
                              color: '#ef0a0a',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 0, 0, 0.1)',
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

                <Grid item xs={12} md={5.5} mt={2}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Punctuality in Meetings
                  </Typography>
                  <FormControl component="fieldset">
                    <RadioGroup
                      name="punctualityInMeetings"
                      value={formData.punctualityInMeetings}
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
                    Availability on Training
                  </Typography>
                  <CustomTextField
                    name="availabilityOnTraining"
                    placeholder="Enter Availability on Training"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.availabilityOnTraining}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 50 }}
                    onKeyPress={(e) => {
                      if (!REGEX.TEXT.test(e.key)) {
                        e.preventDefault()
                      }
                    }}
                  />
                </Grid>

                <Grid container item xs={12} md={5.5} spacing={1}>
                  <Grid item xs={6}>
                    <Typography gutterBottom className="typography textfield-label bukra">
                      Acknowledgement Date <span className="asterisk">*</span>
                    </Typography>
                    <CustomDatePicker
                      control={control}
                      hidden={true}
                      name="acknowledgementDate"
                      label="Acknowledgement Date"
                      boxmb={0.8}
                      required={true}
                      minDate={moment().subtract(60, 'years')}
                      maxDate={moment()}
                      onChange={dateChange}
                      defaultValue={formData && formData.acknowledgementDate}
                      setErrors={setErrors}
                    />
                    {errors.acknowledgementDate && (
                      <Typography variant="caption" className="error-message" mt={2}>
                        {errors.acknowledgementDate}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography gutterBottom className="typography textfield-label bukra">
                      Pledge Date <span className="asterisk">*</span>
                    </Typography>
                    <CustomDatePicker
                      control={control}
                      hidden={true}
                      name="pledgeDate"
                      label="Pledge Date"
                      boxmb={0.8}
                      required={true}
                      minDate={moment().subtract(60, 'years')}
                      maxDate={moment()}
                      onChange={dateChange}
                      defaultValue={formData && formData.pledgeDate}
                      setErrors={setErrors}
                    />
                    {errors.pledgeDate && (
                      <Typography variant="caption" className="error-message" mt={2}>
                        {errors.pledgeDate}
                      </Typography>
                    )}
                  </Grid>
                </Grid>

              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ marginRight: '1rem' }}
                  onClick={() => { handleBack() }}
                  className="text-capitalize"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  className="save-continue-button text-capitalize"
                  disabled={staffAddEmployementData.loading}
                >
                  {staffAddEmployementData.loading ? (
                    "Loading..."
                  ) : (
                    'Save & Continue'
                  )}
                </Button>
              </Box>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Fade>
  );
};
export default EmploymentInformation;