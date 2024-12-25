// pages/staff/edit.tsx
import React, { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { Box, Button, Fade, Grid, IconButton, SnackbarCloseReason, Typography } from "@mui/material";
import CustomTextField from "../Fields/CustomTextField";
import { clearUpdateState, UpdateStaff } from "@/redux/slices/staff/staffUpdateSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, singleFileUploadDispatch } from "@/redux/store";
import CustomSnackbar from "../CustomSnackbar";
import DropDown from "../Fields/DropDown";
import CustomRadioGroup from "../Fields/CustomRadioGroup";
import { clearAthleteUpdateState, UpdateAthleteByID } from "@/redux/slices/athlete/athleteUpdateSlice";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import FileUpload from "@/utils/dropzone";
import { DROPZONE_IMAGE_FLAG, DROPZONE_IMAGE_NAME_TYPES, FILE_FORMAT_TYPE, FILE_FORMAT_TYPE_DOCUMENT } from "@/utils/constants";
import AttachFileSharpIcon from '@mui/icons-material/AttachFileSharp';
import { clearState, singleFileUpload } from "@/redux/slices/fileupload/singleFileUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteFile } from "@/redux/slices/fileupload/deleteFile";
import { editAthlete } from "@/redux/slices/athlete/athleteEditSlice";
interface Props {
  id: number;
  onClose: any;
  editData: any;
  module?:string
}

const AdditionalDetailsInfo: React.FC<Props> = ({ id, onClose, editData,module }) => {
  const dispatch: AppDispatch = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus ,setSnackbarStatus] = useState<string>('')
  const athleteUpdateResponse = useSelector((state: any) => state.athleteUpdateByID);
  // Adding defaultValues for form fields
  const { handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      source: "",
      permissionType:'',
      permissionTime:'',
    policeIDNo: "",
    nationalTeamMember: "N",
    externalClubs: "",
    resultsAndAchievements: "",
    individualTrainingPlan: "",
    },
  });

  // Example of pre-filling data if you have existing staff data to edit
  useEffect(() => {
    
    if(editData)
    setValue("source",  editData.source);
    setValue("permissionTime",  editData.permissionTime);
    setValue("permissionType",  editData.permissionType);
    setValue("policeIDNo",  editData.policeIDNo);
    setValue("nationalTeamMember",  editData.nationalTeamMember  );
    setValue("externalClubs",  editData.externalClubs);
    setValue("resultsAndAchievements",  editData.resultsAndAchievements);
    setValue("individualTrainingPlan",  editData.individualTrainingPlan);
    const IndividualDocument = editData && editData.attachmentList.filter((item: any) => item.documentSection === "IndividaulPlans");
    const ExternalClubDocument = editData && editData.attachmentList.filter((item: any) => item.documentSection === "externalClubs");
    setFormData({
      // ...formData,
      IndividualDocument: IndividualDocument?.[0]?.fileName || "",
      externalClubs: ExternalClubDocument?.[0]?.fileName || "",
    });
  }, [editData]);


  //   {
  //     "staffID": 1,
  //     "section":"contactdetails",
  //     "residence":"Male",
  //     "personalEmail":"Coach",
  //     "nationalTeamMember":"Indian",    
  //     "phoneNo":123456789012345,
  //     "resultsAndAchievements":"emer",
  //     "emergencyContactNumber":123245,
  //     "loggedUserID":"1"
  // }

  const onSubmit: SubmitHandler<FieldValues> = (formData) => {
    const updateBody: any = {
    
      section: "additionaldetails",
      athleteID : id,
      loggedUserID: "1",
      ...formData
    };

    // dispatch(addStaff({ url: "/InsertStaff", payload: data }));

    dispatch(UpdateAthleteByID(updateBody))

  };
  useEffect(() => {    
    if (athleteUpdateResponse &&  athleteUpdateResponse.code === 200 &&  athleteUpdateResponse.status === 'succeeded') {
      dispatch(isUpdatedFunc(true));
     setSnackbarOpen(true)
      setSnackbarStatus('success')
      dispatch(clearAthleteUpdateState());
    } else if (athleteUpdateResponse &&  athleteUpdateResponse.code === 500 &&  athleteUpdateResponse.status === 'failed') {
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
}

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
const [formData, setFormData] = useState<any>({
  
});
const fileUploadDispatch: singleFileUploadDispatch = useDispatch();
const fileCertificateRef = useRef<HTMLInputElement>(null);
const externalClubCertificateRef = useRef<HTMLInputElement>(null);
const singleUpload = useSelector((state: any) => state.singleUpload);
const handleFileChange = (fileData: any, flag: any) => {
  console.log({flag,fileData});
  
  setFormData((prevData: any) => ({
    ...prevData,
    externalClubs: flag === DROPZONE_IMAGE_FLAG.EXTERNAL_CLUBS ? fileData?.name : prevData.externalClubs,
    IndividualDocument: flag === DROPZONE_IMAGE_FLAG.INDIVIDUAL_PLANS ? fileData?.name : prevData.IndividualDocument,
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
const handleIdClick = () => {
  if (fileCertificateRef.current) {
    fileCertificateRef.current.click();
  }
  
};
const handleExternalClubClick = () => {
  
  if (externalClubCertificateRef.current) {
    externalClubCertificateRef.current.click();
  }
};

const handleDeleteFile = async (modulename: any, moduleId: any, fileType: any) => {
  const fileID = editData?.attachmentList?.find(
    (item: any) => item.documentSection?.toLowerCase() === fileType.toLowerCase()
  )?.fileID;
  const data = {
    moduleName: modulename,
    moduleID: moduleId,
    docSection: fileType,
    "loggedUserID": 1,
    fileID: fileID
  }

  console.log("fileID", fileID)
  dispatch(deleteFile(data))
  setFormData((prev: any) => ({
    ...prev,
    [fileType]: "",
  }));
}

useEffect(()=>{
  if(singleUpload.code ===200){
    dispatch(clearState());
  }
},[singleUpload])

const PermissionType = [
  { value: "Hours", label: "Hours" },
  { value: "Daily", label: "Daily" },
];

const PermissionHours = [
  { label: "1 hour", value: "1 hour" },
  { label: "2 hours", value: "2 hours" },
  { label: "3 hours", value: "3 hours" },
  { label: "4 hours", value: "4 hours"},
  { label: "5 hours", value: "5 hours"},
  { label: "6 hours", value: "6 hours"},
  { label: "7 hours", value: "7 hours"},
  { label: "8 hours", value: "8 hours"},
];


  return (
    <Fade in={true} timeout={1000}>
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        // p: 3,
        // maxWidth: 400
      }}
    >
      <DropDown
        name="source"
        label="Source of recruitment"
        control={control}
        // defaultValue={formData && formData.qualification}
        options={[
          { value: 'Dubai Police Employee', label: 'Dubai Police Employee' },
          { value: 'Dubai police Acadamy', label: 'Dubai police Acadamy' },
          { value: 'External', label: 'External' },
        ]}
        variant="outlined"
        // required={true}
      />
      <CustomTextField
        name="policeIDNo"
        control={control}
        label="Police ID Number"
        rules={{ 
          // required: "Police ID Number is required" , 
          pattern: {
            value: /^[a-zA-Z0-9]*$/,
            message: "Invalid Format",
        },
        maxLength: { value: 20, message: "Police ID Number cannot exceed 20 characters" },
        }}
      />
      <CustomRadioGroup
        name="nationalTeamMember"
        control={control}
        label="National Team Member"
        options={[
          { value: "Y", label: "Yes" },
          { value: "N", label: "No" },
        ]}
        // required={true}
      />

      <CustomTextField
        name="externalClubs"
        control={control}
        label="External Clubs"
        rules={{ 
          // required: "External Clubs is required" , 
          pattern: {
            value: /^[a-zA-Z\s]+$/,
            message: "Invalid Format",
        },
        maxLength: { value: 50, message: "External Clubs cannot exceed 50 characters" },
        }}
      />
      <DropDown
        name="permissionType"
        label="Permission Type"
        control={control}
        placeholder={'Select Permission Type'}
        // defaultValue={formData && formData.qualification}
        options={PermissionType}
        variant="outlined"
        // required={true}
      />
      <DropDown
        name="permissionTime"
        label="Permission Time"
        control={control}
        placeholder={'Select Permission Hours'}
        // defaultValue={formData && formData.qualification}
        options={PermissionHours}
        variant="outlined"
        // required={true}
      />
      <Grid
          container
          spacing={1}
          justifyContent="start"
          alignItems="center"
          mt={1}
        >
   <Grid alignItems="flex-start" p={0} >
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
                 onFileChange={(file: any, flag: any) => handleFileChange(file,flag)}
                formatType={FILE_FORMAT_TYPE_DOCUMENT}
                type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                
                flag={DROPZONE_IMAGE_FLAG.EXTERNAL_CLUBS}
                setData={setFormData}
                formData={formData}
                modulename="Athlete"
                moduleId={id}
                fileInputRef={externalClubCertificateRef}
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
                {formData.externalClubs ? (
                  <>{formData.externalClubs}</>
                ) : (
                  <>Upload Contracts : PDF format(max size 25MB)</>
                )}
              </Typography>
              {formData.externalClubs && (
                <IconButton
                  className="deleteIconButton"
                  aria-label="delete"
                  onClick={() => { handleDeleteFile("Athlete", id, "externalClubs") }}
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
      <CustomTextField
        name="resultsAndAchievements"
        control={control}
        label="Results and Achievements"
        textarea={true}
        rules={{ 
          // required: "Results and Achievements is required" , 
          pattern: {
            value: /^[a-zA-Z0-9\s.-]*$/,
            message: "Invalid Format",
        },
        maxLength: { value: 300, message: "Results and Achievements cannot exceed 300 characters" },
        }}
      />
      <CustomTextField
        name="individualTrainingPlan"
        control={control}
        label="Individual Training Plan"
        textarea={true}
        // rules={{ required: "Individual Training Plan is required" }}
        rules={{ 
          required: "Individual Training Plan is required" , 
          pattern: {
            value: /^[a-zA-Z0-9\s.-]+$/,
            message: "Invalid Format",
        },
        maxLength: { value: 300, message: "Individual Training Plan cannot exceed 300 characters" },
        }}
      />
        <Grid
          container
          spacing={1}
          justifyContent="start"
          alignItems="center"
          mt={1}
        >
   <Grid alignItems="flex-start" p={0} >
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
                 onFileChange={(file: any, flag: any) => handleFileChange(file, flag)}
                formatType={FILE_FORMAT_TYPE_DOCUMENT}
                type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                
                flag={DROPZONE_IMAGE_FLAG.INDIVIDUAL_PLANS}
                setData={setFormData}
                formData={formData}
                modulename="Athlete"
                moduleId={id}
                fileInputRef={fileCertificateRef}
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
                {formData.IndividualDocument ? (
                  <>{formData.IndividualDocument}</>
                ) : (
                  <>Upload Individual Training Plan : PDF format (max size 25 MB)</>
                )}
              </Typography>
              {formData.IndividualDocument && (
                <IconButton
                  className="deleteIconButton"
                  aria-label="delete"
                  onClick={() => { handleDeleteFile("Athlete", id, "IndividualDocument") }}
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
    {snackbarStatus !== '' &&  <CustomSnackbar
        message={snackbarStatus === 'success'  ? 'Staff member updated successfully!' : 'Something went wrong'}
        severity={snackbarStatus === 'success'  ? 'success' : 'error'}
        open={snackbarOpen}
        onClose={handleClose}
      />}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 4 }}>
        <Button onClick={() => onClose(false)} variant="outlined" color="error" className="text-capitalize">
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

export default AdditionalDetailsInfo;