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
import FileUpload from "@/utils/dropzone";
import { DROPZONE_IMAGE_FLAG, DROPZONE_IMAGE_NAME_TYPES, FILE_FORMAT_PDF_IMAGE, FILE_FORMAT_TYPE_DOCUMENT } from "@/utils/constants";
import AttachFileSharpIcon from '@mui/icons-material/AttachFileSharp';
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { clearState, singleFileUpload } from "@/redux/slices/fileupload/singleFileUpload";
import { clearUpdateState, UpdateStaff } from "@/redux/slices/staff/staffUpdateSlice";
import { RootState, singleFileUploadDispatch, AppDispatch } from "@/redux/store";
import CustomSnackbar from "../CustomSnackbar";
import { formatDate, isValidField } from "@/utils/helper";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import { isEmpty } from "lodash";
import { deleteFile } from "@/redux/slices/fileupload/deleteFile";
import { editStaff } from "@/redux/slices/staff/staffEditSlice";
import _ from "lodash";
import ReactSelect from "../Fields/ReactSelect";
import { getSportsListAPI } from "@/redux/slices/sportsMenu/getSportsListSlice";
import { usePathname } from "next/navigation";
import { getLanguagesListAPI } from "@/redux/slices/language/getLanguageListSlice";

interface Props {
  id: number;
  onClose: any;
  editStaffData: any;
}

const CertificateLicense: React.FC<Props> = ({
  id,
  onClose,
  editStaffData,
}) => {
  const [formData, setFormData] = useState<any>({});
  const staffUpdateData = useSelector((state: any) => state.updateStaff);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>('')
  const { handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      coachingCertifications: "",
      issuingOrganization: "",
      dateOfCertificate: null,
      expiryDate: null,
      level: '',
      federationLicence: '',
      expiry: '',
      languagesSpoken: '',
      sport: '',
      medicalIssues: '',
      previousSportEthicalConduct: ''
    },
  });
  const fileUploadDispatch: singleFileUploadDispatch = useDispatch();
  const dispatch: AppDispatch = useDispatch();
  const fileCertificateRef = useRef<HTMLInputElement>(null);
  const [SportsOption, setSportsOption] = useState()
  const [error, setError] = useState<any>()
  const [SelectedSportsOption, setSelectedSportsOption] = useState('')
  const getSportList = useSelector((state: any) => {
    return state.getSportList;
  });
  const currentNav = usePathname();
  const teamId: any = currentNav?.split("/")[2];
  const getLanguagesList = useSelector((state: any) => {
    return state.getLanguagesList;
  });

  useEffect(() => {
    const payload = {
      searchText: "",
    };
    dispatch(getSportsListAPI(payload));
    dispatch(getLanguagesListAPI())

  }, []);
  const singleUpload = useSelector((state: any) => state.singleUpload);

  // Example of pre-filling data if you have existing staff data to edit
  useEffect(() => {
    setValue(
      "coachingCertifications",
      editStaffData && editStaffData.coachingCertifications
    );
    setValue(
      "issuingOrganization",
      editStaffData && editStaffData.issuingOrganization
    );
    setValue(
      "dateOfCertificate",
      editStaffData && editStaffData.dateOfCertificate
    );
    setValue(
      "expiryDate",
      editStaffData && editStaffData.expiryDate
    );
    setValue(
      "level",
      editStaffData && editStaffData.level
    );
    setValue(
      "federationLicence",
      editStaffData && editStaffData.federationLicence
    );
    setValue(
      "expiry",
      editStaffData && editStaffData.expiry
    );
    if (editStaffData && editStaffData.languagesSpoken) {
      const initialLanguages = editStaffData.languagesSpoken
        .split(",")
        .map((lang: any) => lang.toLowerCase())
        .filter((value: any, index: any, self: any) => self.indexOf(value) === index);
      setValue("languagesSpoken", initialLanguages);
    }
    setValue(
      "sport",
      editStaffData && editStaffData.sport
    );
    setValue(
      "previousSportEthicalConduct",
      editStaffData && editStaffData.previousSportEthicalConduct
    );
    setValue(
      "medicalIssues",
      editStaffData && editStaffData.medicalIssues
    );
    if (editStaffData && !isEmpty(editStaffData.attachmentList)) {
      const Level = editStaffData && editStaffData.attachmentList.filter((item: any) => item.documentSection === "Level")
      setFormData({
        ...formData,
        levelCertificate: Level[0]?.fileName || "",
      });
    }
  }, [editStaffData]);

  useEffect(() => {
    if (singleUpload.code === 200) {
      dispatch(clearState());
      // dispatch(isUpdatedFunc(true));
    }
  }, [singleUpload])
console.log("SelectedSportsOption", SelectedSportsOption)
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if(_.isEmpty(SelectedSportsOption)) {
      setError({...error, sport:"Please select an sport."})
    } else {
      const updateBodyObj: any = {
        ...data,
        section: "certificatedetails",
        staffID: id,
        loggedUserID: "1",
        expiry: isValidField(data, 'expiry') ? formatDate(data.expiry) : '',
        dateOfCertificate: isValidField(data, 'dateOfCertificate') ? formatDate(data.dateOfCertificate) : '',
        expiryDate: isValidField(data, 'expiryDate') ? formatDate(data.expiryDate) : '',
        languagesSpoken: data.languagesSpoken && data.languagesSpoken.join(","),
      };
      dispatch(UpdateStaff(updateBodyObj))
    }
  };
  const handleFileChange = (fileData: any, flag: any) => {
    setFormData((prevData: any) => ({
      levelCertificate: flag === DROPZONE_IMAGE_FLAG.LEVEL ? fileData?.name : prevData.Level,
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
    if (staffUpdateData && staffUpdateData.code === 200 && staffUpdateData.status === 'succeeded') {
      dispatch(isUpdatedFunc(true));
      setSnackbarOpen(true)
      setSnackbarStatus('success')
      // onClose(false)
      dispatch(clearUpdateState());
    } else if (staffUpdateData && staffUpdateData.code === 500 && staffUpdateData.status === 'failed') {
      setSnackbarOpen(true)
      setSnackbarStatus('error')
      dispatch(clearUpdateState());
    }
  }, [staffUpdateData])
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

  const handleFile = () => {
    if (fileCertificateRef.current) {
      fileCertificateRef.current.click();
    }
  };

  const handleDeleteFile = async (modulename: any, moduleId: any, fileType: any) => {
    const fileID = editStaffData?.attachmentList?.find(
      (item: any) => item.documentSection?.toLowerCase() === fileType.toLowerCase()
    )?.fileID;
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
      levelCertificate: "",
    }));
  }

  // useEffect(() => {
  //   if (!_.isEmpty(editStaffData)) {
  //     setFormData({
  //       ...formData,
  //       dateOfCertificate: editStaffData && editStaffData.dateOfCertificate,
  //       expiryDate: editStaffData && editStaffData.expiryDate,
  //       expiry: editStaffData && editStaffData.expiry,
  //     });
  //   }
  // }, [editStaffData])

  const payload: any = {
    staffID: id
  }

  const dateChange = (data: any) => {
    const value = data.value
    const name = data.name
    setValue(
      name, value,
    );
  };

  const getMinDate = () => {
    const contractStart = moment(
      formData.dateOfCertificate,
      'DD/MM/YYYY',
      true
    );
    return contractStart.isValid()
      ? contractStart
      : moment().subtract(40, "years");
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
      setError({...error, sport:""})
      setValue(
        "sport",
        selectedValues.join(",")
      );
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
    const data: any = getDefaultOption(getSportList?.data);
    const selOption: any = _.filter(data, (x: any) => {
      if (x.value && typeof x.value !== 'undefined') {
        return _.includes(!_.isEmpty(editStaffData?.sport.trim()) ? editStaffData?.sport.split(",") : teamId.split(","), x.value.toString());
      }
    });
    setSelectedSportsOption(selOption);
    const selectedValues = Array.isArray(selOption)
      ? selOption.map((option: any) => option.value)
      : [selOption.value];
    setValue(
      "sport",
      selectedValues.join(",")
    );
    setFormData({
      ...formData,
      sport: selectedValues.join(","),
    });
  }, [editStaffData])

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
          name="coachingCertifications"
          control={control}
          label="Coaching Certifications"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9\s,./-]*$/,
              message: "Only letters and spaces are allowed",
            },
            maxLength: { value: 50, message: "Rank cannot exceed 100 characters" },
          }}
        />
        <CustomTextField
          name="issuingOrganization"
          control={control}
          label="Issuing organization"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9\s,./-]*$/,
              message: "Only letters and spaces are allowed",
            },
            maxLength: { value: 50, message: "Rank cannot exceed 100 characters" },
          }}
        />
        <Grid container spacing={1} mt={1.5}>
          <Grid item xs={6} md={6} flexDirection={"column"}>
            <CustomDatePicker
              control={control}
              name="dateOfCertificate"
              label="Date of Certification"
              defaultValue={editStaffData && editStaffData.dateOfCertificate}
              boxmb={0.8}
              onChange={dateChange}
              minDate={moment().subtract(40, "years")}
              maxDate={moment()}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <CustomDatePicker
              control={control}
              name="expiryDate"
              minDate={getMinDate()}
              label="Expiry Date"
              required={false}
              defaultValue={editStaffData && editStaffData.expiryDate}
              boxmb={0.8}
              onChange={dateChange}
            />
          </Grid>
        </Grid>
        <CustomTextField
          name="level"
          control={control}
          label="Level"
          rules={{
            pattern: {
              value: /^[a-zA-Z\s]+$/,
              message: "Only letters and spaces are allowed",
            },
            maxLength: { value: 50, message: "Rank cannot exceed 20 characters" },
          }}
        />
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
                formatType={FILE_FORMAT_PDF_IMAGE}
                type={DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS}
                
                flag={DROPZONE_IMAGE_FLAG.LEVEL}
                setData={setFormData}
                formData={formData}
                modulename="Staff"
                moduleId={id.toString()}
                fileInputRef={fileCertificateRef}
              // fetchDataApi={() => dispatch(editStaff(payload))}
              />
              <AttachFileSharpIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <Box display="flex" alignItems="center">
              <Typography align="center" color="error" className="dubai-med upload-label"
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
                  onClick={() => { handleDeleteFile("Staff", id, "Level") }}
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
        <CustomTextField
          name="federationLicence"
          control={control}
          label="Federation Licence"

        />
        <Box mt={1.5}>
          <CustomDatePicker
            control={control}
            name="expiry"
            label="Expiry"
            // required={true}
            boxmb={0.8}
            defaultValue={editStaffData && editStaffData.expiry}
            onChange={dateChange}
          />
        </Box>
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
        <Box mt={1.5}>
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
          {error && error.sport ? (
            <Typography variant="caption" className="error-message">
              {error.sport}
            </Typography>
          ): null}
        </Box>

        <CustomRadioGroup
          name="medicalIssues"
          control={control}
          label="Medical Issues"
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
          ]}
        />
        <CustomTextField
          name="previousSportEthicalConduct"
          control={control}
          label="Previous Sport Ethical Conduct"
          textarea={true}
        />
        {snackbarStatus !== '' && <CustomSnackbar
          message={snackbarStatus === 'success' ? 'Staff member added successfully!' : 'Something went wrong'}
          severity={snackbarStatus === 'success' ? 'success' : 'error'}
          open={snackbarOpen}
          onClose={handleClose}
        />}
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

export default CertificateLicense;