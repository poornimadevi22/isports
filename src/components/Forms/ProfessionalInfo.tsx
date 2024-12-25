// pages/staff/edit.tsx
import React, { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { Box, Button, Fade, Grid, IconButton, SnackbarCloseReason, Typography } from "@mui/material";
import CustomTextField from "../Fields/CustomTextField";
import CustomRadioGroup from "../Fields/CustomRadioGroup";
import CustomDatePicker from "../Fields/CustomDatePicker";
import CustomAgeField from "../Fields/CustomAgeField";
import moment from "moment";
import CustomSelect from "../Fields/CustomSelect";
import DropDown from "../Fields/DropDown";
import { useDispatch, useSelector } from "react-redux";
import { clearUpdateState, UpdateStaff } from "@/redux/slices/staff/staffUpdateSlice";
import FileUpload from "@/utils/dropzone";
import { DROPZONE_IMAGE_FLAG, DROPZONE_IMAGE_NAME_TYPES, FILE_FORMAT_TYPE, FILE_FORMAT_TYPE_DOCUMENT, PDF_FORMAT } from "@/utils/constants";
import AttachFileSharpIcon from '@mui/icons-material/AttachFileSharp';
import DeleteIcon from "@mui/icons-material/Delete";
import { singleFileUpload } from "@/redux/slices/fileupload/singleFileUpload";
import { RootState, singleFileUploadDispatch, AppDispatch } from "@/redux/store";
import CustomSnackbar from "../CustomSnackbar";
import { formatDate, isValidField, validateString } from "@/utils/helper";
import { clearAthleteUpdateState, UpdateAthleteByID } from "@/redux/slices/athlete/athleteUpdateSlice";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import { deleteFile } from "@/redux/slices/fileupload/deleteFile";
import { editAthlete } from "@/redux/slices/athlete/athleteEditSlice";

interface Props {
  id: number;
  onClose: any;
  editData: any;
  module: string
}

const ProfessionalInfo: React.FC<Props> = ({
  id,
  onClose,
  editData,
  module
}) => {
  const [formData, setFormData] = useState<any>({});
  const dispatch: AppDispatch = useDispatch();
  const athleteUpdateResponse = useSelector((state: any) => state.athleteUpdateByID);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>('')
  const fileUploadDispatch: singleFileUploadDispatch = useDispatch();
  const [error, setDateError] = useState({});
  const { handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      role: '',
      academicQualification: "",
      performanceLevel: "",
      contractType: "",
      currentJobPosition: "",
      currentJobLocation: "",
      dpEmployeeNumber: "",
      rank: "",
      department: "",
      dateOfLastJobPromotion: null,
      dpEmploymentStatus: "",
      disciplinePracticed: '',
      languagesSpoken: '',
      sportsCategory: '',
      contractEndDate: null,
      contractStartDate: null,
      acknowledgementDate: null,
      pledgeDate: null,
    },
  });

  const [minEndDate, setMinEndDate] = useState(moment());
  const contractStartDate = watch('contractStartDate');

  const handleDeleteFile = async (modulename: any, moduleId: any, fileType: any) => {
    const fileID = editData?.attachmentList?.find(
      (item: any) => item.documentSection?.toLowerCase() === fileType.toLowerCase()
    )?.fileID;
    console.log({ moduleId });

    if (moduleId) {
      const data = {
        moduleName: modulename,
        moduleID: moduleId,
        docSection: fileType,
        "loggedUserID": 1,
        fileID: fileID
      }
      dispatch(deleteFile(data))
      setFormData({});
    }
  }

  // Example of pre-filling data if you have existing staff data to edit
  useEffect(() => {
    const defaultPerformanceLevelValue = editData && editData.performanceLevel !== '' && editData.performanceLevel !== '-' ? editData.performanceLevel : 'beginner'
    setValue("role", editData && editData.role);
    setValue("academicQualification", editData && validateString(editData.academicQualification));
    setValue("performanceLevel", defaultPerformanceLevelValue);
    setValue("contractType",  editData && editData.contractType);
    setValue(
      "currentJobPosition",
      editData && editData.currentJobPosition
    );
    setValue(
      "currentJobLocation",
      editData && editData.currentJobLocation
    );
    setValue(
      "dpEmployeeNumber",
      editData && editData.dpEmployeeNumber
    );
    setValue("rank", editData && editData.rank);
    setValue("department", editData && editData.department);
    setValue(
      "dateOfLastJobPromotion",
      // editData && editData.dateOfLastJobPromotion
      editData && editData.dateOfLastJobPromotion !== '-' && editData.dateOfLastJobPromotion ? editData.dateOfLastJobPromotion : null
    );

    setValue(
      "dpEmploymentStatus",
      editData && editData.dpEmploymentStatus
    );
    setValue(
      "sportsCategory",
      editData && editData.sportsCategory
    );
    setValue(
      "disciplinePracticed",
      editData && editData.disciplinePracticed
    );
    setValue("contractEndDate", editData && editData.contractEndDate !== '-' && editData.contractEndDate ? editData.contractEndDate : null);
    setValue("pledgeDate", editData && editData.pledgeDate !== '-' && editData.pledgeDate ? editData.pledgeDate : null);
    setValue("acknowledgementDate", editData && editData.acknowledgementDate !== '-' && editData.acknowledgementDate ? editData.acknowledgementDate : null);
    setValue(
      "contractStartDate",
      editData && editData.contractStartDate && editData.contractStartDate !== '-' ? editData.contractStartDate : null
    );
    setValue("languagesSpoken", editData && editData.languagesSpoken.split(','));
    const contractDoc = editData && editData.attachmentList.filter((item: any) => item.documentSection === "ContractDocument")
    setFormData({
      ...formData,
      uploadContract: contractDoc[0]?.fileName || ""
    });
  }, [editData]);



  const onSubmit: SubmitHandler<FieldValues> = (formData) => {
    const updateBody: any = {
      ...formData,
      dateOfLastJobPromotion: isValidField(formData, 'dateOfLastJobPromotion') ? formatDate(formData.dateOfLastJobPromotion) : '',
      contractStartDate: isValidField(formData, 'contractStartDate') ? formatDate(formData.contractStartDate) : '',
      acknowledgementDate: isValidField(formData, 'acknowledgementDate') ? formatDate(formData.acknowledgementDate) : '',
      pledgeDate: isValidField(formData, 'pledgeDate') ? formatDate(formData.pledgeDate) : '',
      contractEndDate: isValidField(formData, 'contractEndDate') ? formatDate(formData.contractEndDate) : '',
      languagesSpoken: formData.languagesSpoken.join(","),
      section: "professionaldetails",
      athleteID: id,
      loggedUserID: "1",
    };
    // dispatch(addStaff({ url: "/InsertStaff", payload: data }));
    console.log({ updateBody });

    dispatch(UpdateAthleteByID(updateBody))
  };

  const handleFileChange = (fileData: any, flag: any, modulename: any,
    moduleId: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      uploadContract: flag === DROPZONE_IMAGE_FLAG.UPLOAD_CONTRACT ? fileData?.name : prevData.uploadContract,
    }));

    if (fileData && fileData.file) {
      const formData = new FormData();
      formData.append("file", fileData.file);
      formData.append("modulename", fileData.modulename);
      formData.append("moduleid", id.toString());
      formData.append("loggedUserID", fileData.loggedUserID);
      fileUploadDispatch(singleFileUpload(formData))
    }
  };

  useEffect(() => {
    if (athleteUpdateResponse && athleteUpdateResponse.code === 200 && athleteUpdateResponse.status === 'succeeded') {
      dispatch(isUpdatedFunc(true));
      setSnackbarOpen(true)
      setSnackbarStatus('success')
      dispatch(clearAthleteUpdateState());
    } else if (athleteUpdateResponse && athleteUpdateResponse.code === 500 && athleteUpdateResponse.status === 'failed') {
      setSnackbarOpen(true)
      setSnackbarStatus('error')
      dispatch(clearAthleteUpdateState());
    }
  }, [athleteUpdateResponse])
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (snackbarOpen) {
      timeoutId = setTimeout(() => {
        onClose(false);
        setSnackbarOpen(false);
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId); // Cleanup to prevent memory leaks
      }
    };
  }, [snackbarOpen]);
  const fileIDRef = useRef<HTMLInputElement>(null);

  const handleIdClick = () => {
    if (fileIDRef.current) {
      fileIDRef.current.click();
    }
  };

  useEffect(() => {
    const newMinDate = moment(contractStartDate, 'YYYY-MM-DD').add(1, 'months');

    setMinEndDate(newMinDate)
  }, [contractStartDate])

  return (
    <Fade in={true} timeout={1000}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CustomTextField
          name="role"
          control={control}
          label="Role On Team"
          rules={{
            required: "Role On Team is required",
            pattern: {
              value: /^[a-zA-Z\s]+$/,
              message: "Only letters and spaces are allowed",
            },
            maxLength: { value: 50, message: "Role On Team cannot exceed 50 characters" },
          }}
        />
        <DropDown
          name="academicQualification"
          label="Academic Qualification"
          control={control}
          // defaultValue={formData && formData.academicQualification}
          options={[
            { value: 'bachelor', label: 'Bachelor’s Degree' },
            { value: 'master', label: 'Master’s Degree' },
            { value: 'phd', label: 'Ph.D.' },
            { value: 'diploma', label: 'Diploma' },
            { value: 'highschool', label: 'High School' },
          ]}
          variant="outlined"
          required={true}
        />
        <CustomTextField
          name="currentJobPosition"
          control={control}
          label="Current Job Position"
          rules={{
            required: "Current Job Position",
            pattern: {
              value: /^[a-zA-Z\s]+$/,
              message: "Only letters and spaces are allowed",
            },
            maxLength: { value: 50, message: "Current Job Position cannot exceed 50 characters" },
          }}
        />
        <CustomTextField
          name="currentJobLocation"
          control={control}
          label="Current Job Location"
          // rules={{ required: "Current Job Location is required" }}
          rules={{
            required: "Current Job Location",
            pattern: {
              value: /^[a-zA-Z\s,]+$/,
              message: "Invalid Format",
            },
            maxLength: { value: 50, message: "Current Job Location cannot exceed 100 characters" },
          }}
        />

        <CustomTextField
          name="dpEmployeeNumber"
          control={control}
          label="Dubai Police Employee Number"
          rules={{
            required: "Dubai Police Employee Number",
            pattern: {
              value: /^[a-zA-Z0-9/-]*$/,
              message: "Invalid Format",
            },
            maxLength: { value: 20, message: "Dubai Police Employee Number cannot exceed 20 characters" },
          }}
        />
        <CustomTextField
          name="rank"
          control={control}
          label="Rank"
          rules={{
            required: "Rank",
            pattern: {
              value: /^[a-zA-Z0-9\s]+$/,
              message: "Invalid Format",
            },
            maxLength: { value: 50, message: "Rank cannot exceed 50 characters" },
          }}
        />
        <CustomTextField
          name="department"
          control={control}
          label="Department"
          rules={{
            required: "Department",
            pattern: {
              value: /^[a-zA-Z\s]+$/,
              message: "Invalid Format",
            },
            maxLength: { value: 50, message: "Department cannot exceed 50 characters" },
          }}
        />
        <DropDown
          name="sportsCategory"
          label="Sports Category"
          control={control}
          defaultValue={editData && editData.sportsCategory}
          options={[
            { value: 'elite', label: 'Elite' },
            { value: 'amature', label: 'Amature' },
            { value: 'junior', label: 'Junior' },

          ]}
          variant="outlined"
          required={true}
        />
        <Box mt={1.5}>
          <CustomDatePicker
            control={control}
            name="dateOfLastJobPromotion"
            label="Date of Last Job Promotion"
            // required={true}
            boxmb={0.8}
            defaultValue={editData && editData.dateOfLastJobPromotion}
          />
        </Box>
        <DropDown
          name="dpEmploymentStatus"
          label="Dubai Police Employment Status"
          control={control}
          defaultValue={formData && formData.dpEmploymentStatus}
          options={[
            { value: 'Permanent Contract', label: 'Permanent Contract' },
            { value: 'Collaboration Contract', label: 'Collaboration Contract' },
            { value: 'Temporary Contract', label: 'Temporary Contract' }
          ]}
          required={true}
          variant="outlined"
        />
        <DropDown
          name="languagesSpoken"
          label="Languages Spoken"
          control={control}
          // defaultValue={formData && formData.dpEmploymentStatus}
          options={[
            { value: "Arabic", label: "Arabic" },
            { value: "Japanese", label: "Japanese" },
            { label: "English", value: "English" },
            { label: "Spanish", value: "Spanish" },
            { label: "French", value: "French" },
            { label: "German", value: "German" },
            { label: "Chinese", value: "Chinese" },
            { label: "Russian", value: "Russian" },
            { label: "Italian", value: "Italian" },
            { label: "Portuguese", value: "Portuguese" },
          ]}
          multiple={true}
          variant="outlined"
        />
        <DropDown
          name="performanceLevel"
          label="Performance Level"
          control={control}
          // defaultValue={formData && formData.academicQualification}
          options={[
            { value: 'beginner', label: 'Beginner' },
            { value: 'professional', label: 'Professional' },
            { value: 'intermediate', label: 'Intermediate' },
          ]}
          variant="outlined"
          required={true}
        />
        <CustomTextField
          name="disciplinePracticed"
          control={control}
          label="Discipline Practiced"
          rules={{
            required: "Discipline Practiced",
            pattern: {
              value: /^[a-zA-Z\s]+$/,
              message: "Invalid Format",
            },
            maxLength: { value: 50, message: "Discipline Practiced cannot exceed 50 characters" },
          }}
        />
        <DropDown
        name="contractType"
        label="Contract Type"
        control={control}
        // defaultValue={formData && formData.qualification}
        options={[
          { value: 'Full-time', label: 'Full-time' },
          { value: 'Temprorary', label: 'Temprorary' },
          { value: 'Collabrative', label: 'Collabrative' },
        ]}
        variant="outlined"
        required={true}
      />
        <Grid container spacing={1} mt={1.5}>
          <Grid item xs={12} md={6} flexDirection={"column"}>
            <CustomDatePicker
              control={control}
              name="contractStartDate"
              label=" Contract Start Date"
              // required={false}
              defaultValue={editData && editData.contractStartDate}
              boxmb={0.8}
              minDate={moment().subtract(50, 'years')}
              maxDate={moment().add(10, 'years')}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <CustomDatePicker
              control={control}
              name="contractEndDate"
              label=" Contract End Date"
              // required={false}
              defaultValue={editData && editData.contractEndDate}
              boxmb={0.8}

              minDate={minEndDate}
              maxDate={moment().add(10, 'years')}
            />
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
                  onFileChange={(
                    file: any,
                    flag: any,
                    modulename: any,
                    moduleId: any
                  ) => handleFileChange(file, flag, modulename, moduleId)}
                  formatType={PDF_FORMAT}
                  type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                  
                  flag={DROPZONE_IMAGE_FLAG.UPLOAD_CONTRACT}
                  setData={setFormData}
                  formData={formData}
                  modulename="Athlete"
                  moduleId={id}
                  fileInputRef={fileIDRef}
                />
                <AttachFileSharpIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <Box display="flex" alignItems="center">
                <Typography align="center" color="error" className="dubai-med upload-label"
                  onClick={handleIdClick}
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
                    onClick={() => { handleDeleteFile("Athlete", id, DROPZONE_IMAGE_FLAG.UPLOAD_CONTRACT) }}
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
          {snackbarStatus !== '' && <CustomSnackbar
            message={snackbarStatus === 'success' ? 'Staff member added successfully!' : 'Something went wrong'}
            severity={snackbarStatus === 'success' ? 'success' : 'error'}
            open={snackbarOpen}
            onClose={handleClose}
          />}
        </Grid>
        <Grid container spacing={1} mt={1.5}>
          <Grid item xs={12} md={6}
          //  flexDirection={"column"}
          >

            <CustomDatePicker
              control={control}
              name="acknowledgementDate"
              label="Acknowledgement Date"
              defaultValue={editData && editData.acknowledgementDate}
              boxmb={0.8}
              minDate={moment().subtract(60, 'years')}
              maxDate={moment()}
              setErrors={setDateError}
              rules={{ required: "Acknowledgement Date is required" }}
              required={true}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <CustomDatePicker
              control={control}
              name="pledgeDate"
              label="Pledge Date"
              minDate={moment().subtract(60, 'years')}
              maxDate={moment()}
              defaultValue={editData && editData.pledgeDate}
              boxmb={0.8}
              setErrors={setDateError}
              rules={{ required: "Pledge Date is required" }}
              required={true}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 4 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="error"
            className="text-capitalize"
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" className="text-capitalize">
            Update
          </Button>
        </Box>
      </Box>
    </Fade>
  );
};

export default ProfessionalInfo;