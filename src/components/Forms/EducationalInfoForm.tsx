// pages/staff/edit.tsx
import React, { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import {
  Box,
  Button,
  Fade,
  Grid,
  IconButton,
  SnackbarCloseReason,
  Typography,
} from "@mui/material";
import CustomTextField from "../Fields/CustomTextField";
import CustomRadioGroup from "../Fields/CustomRadioGroup";
import {
  clearUpdateState,
  UpdateStaff,
} from "@/redux/slices/staff/staffUpdateSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import CustomSnackbar from "../CustomSnackbar";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import {
  DROPZONE_IMAGE_FLAG,
  DROPZONE_IMAGE_NAME_TYPES,
  FILE_FORMAT_TYPE_DOCUMENT,
} from "@/utils/constants";
import { isEmpty } from "lodash";
import { editStaff } from "@/redux/slices/staff/staffEditSlice";
import FileUpload from "@/utils/dropzone";
import {deleteFile} from "@/redux/slices/fileupload/deleteFile";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import { clearState } from "@/redux/slices/fileupload/singleFileUpload";
import DropDown from "../Fields/DropDown";

interface Props {
  id: number;
  onClose: any;
  editStaffData: any;
}

const EducationalInfoForm: React.FC<Props> = ({
  id,
  onClose,
  editStaffData,
}) => {
  // Adding defaultValues for form fields
  const { handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      fieldOfStudy: "",
      upload_certificate: "",
      assignedAthletesOrTeams: "",
      coachingExperience: "",
      previousAthleteExperience: "",
      organizationalSkills: "",
      leadershipSkills: "",
      availabilityOnTraining: "",
      achievementsAsCoach: "",
      computerSkills: "",
      academicQualification: "",
    },
  });
  const dispatch: AppDispatch = useDispatch();
  const staffUpdateData = useSelector((state: any) => state.updateStaff);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const uploadCertificateRef = useRef<HTMLInputElement>(null);
  const singleUpload = useSelector((state: any) => state.singleUpload);
  // Example of pre-filling data if you have existing staff data to edit
  interface FormData {
    uploadCertificate: string;
  }
  const [formData, setFormData] = useState<FormData>({
    uploadCertificate: "",
  });
  useEffect(() => {
    setValue("fieldOfStudy", editStaffData && editStaffData.fieldOfStudy);
    setValue(
      "upload_certificate",
      editStaffData && editStaffData.upload_certificate
    );
    setValue(
      "assignedAthletesOrTeams",
      editStaffData && editStaffData.assignedAthletesOrTeams
    );
    setValue(
      "coachingExperience",
      editStaffData && editStaffData.coachingExperience
    );
    setValue(
      "previousAthleteExperience",
      editStaffData && editStaffData.previousAthleteExperience
    );
    setValue(
      "organizationalSkills",
      editStaffData && editStaffData.organizationalSkills
    );
    setValue(
      "leadershipSkills",
      editStaffData && editStaffData.leadershipSkills
    );
    setValue(
      "availabilityOnTraining",
      editStaffData && editStaffData.availabilityOnTraining
    );
    setValue(
      "achievementsAsCoach",
      editStaffData && editStaffData.achievementsAsCoach
    );
    setValue(
      "computerSkills",
      editStaffData && editStaffData.computerSkills
    );
    setValue(
      "academicQualification",
      editStaffData && editStaffData.academicQualification
    );
    
    const document =
      !isEmpty(editStaffData.attachmentList) &&
      editStaffData.attachmentList.find(
        (doc: any) => doc.documentSection === "Certificate"
      );
    if (!isEmpty(document)) {
      setFormData((prevData) => ({
        ...prevData,
        uploadCertificate: document.fileName,
      }));
    }
  }, [editStaffData]);

  const onSubmit: SubmitHandler<FieldValues> = (editStaffEmployeeData) => {
    const updateBodyObj: any = {
      section: "educationdetails",
      staffID: id,
      loggedUserID: "1",
      uploadCertificate: formData.uploadCertificate,
      ...editStaffEmployeeData,
    };
    // dispatch(addStaff({ url: "/InsertStaff", payload: data }));

    dispatch(UpdateStaff(updateBodyObj));
  };

  useEffect(() => {
    if (
      staffUpdateData &&
      staffUpdateData.code === 200 &&
      staffUpdateData.status === "succeeded"
    ) {
      dispatch(isUpdatedFunc(true));
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      // onClose(false)
      dispatch(clearUpdateState());
    } else if (
      staffUpdateData &&
      staffUpdateData.code === 500 &&
      staffUpdateData.status === "failed"
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearUpdateState());
    }
  }, [staffUpdateData]);
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
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
      }, 500);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId); // Cleanup to prevent memory leaks
      }
    };
  }, [snackbarOpen]);

  const handleFileChange = (file: any, flag: any) => {
    setFormData((prevData) => ({
      ...prevData,
      uploadCertificate: file?.name,
    }));
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
        uploadCertificate: "",
      }));
    }
  }

  const handlepassClick = () => {
    if (uploadCertificateRef.current) {
      uploadCertificateRef.current.click();
    }
  };

  const payload : any = {
    staffID: id
  }

  useEffect(()=>{
    if(singleUpload.code ===200){
      dispatch(clearState());
      // dispatch(isUpdatedFunc(true));
    }
  },[singleUpload])

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
         <DropDown
        name="academicQualification"
        label="Academic Qualification"
        control={control}
        // defaultValue={formData && formData.qualification}
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
          name="fieldOfStudy"
          control={control}
          label="Field of Study"
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
                  ) => handleFileChange(file, flag)}
                  formatType={FILE_FORMAT_TYPE_DOCUMENT}
                  type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                  
                  flag={DROPZONE_IMAGE_FLAG.EMPLOYEE_CERTIFICATE}
                  modulename="Staff"
                  moduleId={id}
                  setData={setFormData}
                  formData={formData}
                  fileInputRef={uploadCertificateRef}
                  // fetchDataApi={() => dispatch(editStaff(payload))}
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
                    <>Upload Certificate (PDF, DOC, DOCX)</>
                  )}
                </Typography>
                {formData.uploadCertificate && (
                  <IconButton
                    className="deleteIconButton"
                    aria-label="delete"
                    onClick={() => { handleDeleteFile("Staff", id, "Certificate") }}
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
          name="coachingExperience"
          control={control}
          label="Coaching Experience"
        />
      
        <CustomTextField
          name="previousAthleteExperience"
          control={control}
          label="Previous Athlete Experience"
        />
        <CustomTextField
          name="achievementsAsCoach"
          control={control}
          label="Achievements as Coach"
        textarea={true}
        rules={{ 
          // required: "Achievements as Coach is required" , 
          pattern: {
            value: /^[a-zA-Z0-9\s.-]*$/,
            message: "Invalid Format",
        },
        maxLength: { value: 200, message: "Achievements as Coach cannot exceed 250 characters" },
        }}
        />
      
        
        <CustomTextField
          name="organizationalSkills"
          control={control}
          label="Organizational Skills"
        />
        <CustomTextField
          name="leadershipSkills"
          control={control}
          label="Leadership Skills"
        />
        <CustomTextField
          name="computerSkills"
          control={control}
          label="Computer Skills"
        />

       
        {snackbarStatus !== "" && (
          <CustomSnackbar
            message={
              snackbarStatus === "success"
                ? "Staff member Updated successfully!"
                : "Something went wrong"
            }
            severity={snackbarStatus === "success" ? "success" : "error"}
            open={snackbarOpen}
            onClose={handleClose}
          />
        )}
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 4 }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            color="error"
            className="text-capitalize"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="text-capitalize"
          >
            Update
          </Button>
        </Box>
      </Box>
    </Fade>
  );
};

export default EducationalInfoForm;