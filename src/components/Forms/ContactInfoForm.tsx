// pages/staff/edit.tsx
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { Box, Button, Fade, Grid, SnackbarCloseReason, Typography } from "@mui/material";
import CustomTextField from "../Fields/CustomTextField";
import { clearUpdateState, UpdateStaff } from "@/redux/slices/staff/staffUpdateSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import CustomSnackbar from "../CustomSnackbar";
import { clearAthleteUpdateState, UpdateAthleteByID } from "@/redux/slices/athlete/athleteUpdateSlice";
import { isUpdatedFunc } from "@/redux/slices/appSplice";

interface Props {
  id: number;
  onClose: any;
  editData: any;
  module?: string
}

const ContactInfoForm: React.FC<Props> = ({ id, onClose, editData, module }) => {
  const dispatch: AppDispatch = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>('')
  const staffUpdateData = useSelector((state: any) => state.updateStaff);
  const athleteUpdateResponse = useSelector((state: any) => state.athleteUpdateByID);
  const { handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      residence: "",
      personalEmail: "",
      dubaiPoliceEmail: "",
      phoneNo: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
    },
  });

  useEffect(() => {
    setValue("residence", editData && editData.residence);
    setValue("personalEmail", editData && editData.personalEmail);
    setValue("dubaiPoliceEmail", editData && editData.dubaiPoliceEmail);
    setValue("phoneNo", editData && editData.phoneNo);
    setValue("emergencyContactName", editData && editData.emergencyContactName);
    setValue("emergencyContactNumber", editData && editData.emergencyContactNumber);
  }, [editData]);

  const onSubmit: SubmitHandler<FieldValues> = (editStaffContactData) => {
    const updateBody: any = {

      section: "contactdetails",
      [module === 'staff' ? 'staffID' : 'athleteID']: id,
      loggedUserID: "1",
      ...editStaffContactData
    };

    if (module === 'staff') {

      dispatch(UpdateStaff(updateBody))
    }
    if (module === 'athlete') {
      dispatch(UpdateAthleteByID(updateBody))
    }
  };

  useEffect(() => {
    if (staffUpdateData && staffUpdateData.status === 'succeeded'
      || module === 'athlete' && athleteUpdateResponse && athleteUpdateResponse.code === 200 && athleteUpdateResponse.status === 'succeeded'
    ) {
      dispatch(isUpdatedFunc(true));
      setSnackbarOpen(true)
      setSnackbarStatus('success')
      // onClose(false)
      dispatch(clearAthleteUpdateState());
      dispatch(clearUpdateState());
    } else if (staffUpdateData && staffUpdateData.status === 'failed' || module === 'athlete' && athleteUpdateResponse && athleteUpdateResponse.code === 500 && athleteUpdateResponse.status === 'failed'
    ) {
      setSnackbarOpen(true)
      setSnackbarStatus('error')
      dispatch(clearUpdateState());
      dispatch(clearAthleteUpdateState());
    }
  }, [staffUpdateData, athleteUpdateResponse])
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
      }, 500);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId); // Cleanup to prevent memory leaks
      }
    };
  }, [snackbarOpen]);

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
        <CustomTextField
          name="residence"
          control={control}
          label="Residence"
          rules={{
            required: "Residence is required",
            pattern: {
              value: /^[a-zA-Z\s,]*$/,
              message: "Only letters ,spaces ,comma & / are allowed",
            },
            maxLength: { value: 100, message: "Residence cannot exceed 100 characters" },
          }}
        />

        <CustomTextField
          name="personalEmail"
          control={control}
          label="Personal Email"
          rules={{
            required: "Personal Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Enter a valid email address",
            },
            maxLength: { value: 100, message: "Personal Email cannot exceed 100 characters" },
          }}
        />
        <CustomTextField
          name="dubaiPoliceEmail"
          control={control}
          label="Dubai police Email"
          rules={{
            required: `Enter the Valid Dubai police email id example: "adam@dubaipolice.gov.ae"`,
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9._%+-]+\.)?gov\.ae$/i,
              message: `Enter the Valid Dubai police email id example: "adam@dubaipolice.gov.ae"`,
            },
            maxLength: { value: 100, message: "Dubai police Email cannot exceed 100 characters" },
          }}
        />

        <CustomTextField
          name="phoneNo"
          control={control}
          label="Phone Number"
          rules={{
            required: "Phone Number is required",
            pattern: {
              value: /^[0-9]+$/,
              message: "Phone number must contain only digits (eg: 154450123).",
            },
            maxLength: { value: 15, message: "Phone number must contain only digits (eg: 154450123)." },
            validate: {
              isNumeric: (value) =>
                /^\d+$/.test(value) || "Phone number must contain only digits (eg: 154450123).",
            },
          }}
        />

        <CustomTextField
          name="emergencyContactName"
          control={control}
          label="Emergency Contact Name"
          rules={{
            required: "Emergency Contact is required",
            pattern: {
              value: /^[a-zA-Z\s]+$/,
              message: "Only letters and spaces are allowed",
            },
            maxLength: { value: 50, message: "Emergency Contact cannot exceed 50 characters" },
          }}
        />

        <CustomTextField
          name="emergencyContactNumber"
          control={control}
          label="Emergency Contact Number"
          rules={{
            required: "Emergency Contact Number is required",
            pattern: {
              value: /^[0-9]+$/,
              message: "Phone number must contain only digits (eg: 154450123).",
            },
            maxLength: { value: 15, message: "Phone number must contain only digits (eg: 154450123)." },
            validate: {
              isNumeric: (value) =>
                /^\d+$/.test(value) || "Phone number must contain only digits (eg: 154450123).",
            },
          }}
        />
        {snackbarStatus !== '' && <CustomSnackbar
          message={snackbarStatus === 'success' ? 'Staff member updated successfully!' : 'Something went wrong'}
          severity={snackbarStatus === 'success' ? 'success' : 'error'}
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

export default ContactInfoForm;
