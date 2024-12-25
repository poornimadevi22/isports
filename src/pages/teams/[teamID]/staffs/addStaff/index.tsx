"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Step,
  StepLabel,
  Stepper,
  Grid,
  Typography,
  StepIconProps,
  Stack,
  Divider,
  Button,
} from "@mui/material";
import PersonalInformation from "./personalInformation";
import { styled } from "@mui/material/styles";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import ContactDetails from "./contactDetails";
import EmploymentInformation from "./employmentInformation";
import EducationandExperience from "./educationandExperience";
import CertificationsAndLicenses from "./certificationsAndLicenses";
import { getLocalStorage, removeLocalStorage, setLocalStorage } from "@/utils/helper";
import BasicBreadcrumbs from "@/components/breadcrumbs";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { editStaff } from "@/redux/slices/staff/staffEditSlice";
import _ from "lodash";
import SubMenuLayout from "../layout";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { deleteCustomerById } from "@/redux/slices/staff/staffDeleteSlice";
import AlertDialog from "@/components/Allert";
import LoadingOverlay from "@/components/Loading";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  left: "calc(-50% + 16px) !important",
  right: "calc(50% + 16px) !important",
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "#008755",
      color: "#008755",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "#008755",
      color: "#008755",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
}));
const getCurrentSport = getLocalStorage('sport')
const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(() => ({
  zIndex: 1,
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active = false, completed = false, className } = props;
  const iconToDisplay = completed ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="35px"
      height="35px"
      viewBox="0 0 40 40"
      style={{ objectFit: "contain" }}
      className={className}
    >
      <circle cx="20" cy="20" r="20" fill="#008755" />
      <path
        d="M12 20l5 5 10-10"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : active ? (
    <RadioButtonCheckedIcon style={{ fontSize: "40px", color: "#9BE3BF" }} />
  ) : (
    <Brightness1Icon style={{ fontSize: "40px", color: "#9BE3BF" }} />
  );

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {iconToDisplay}
    </ColorlibStepIconRoot>
  );
}

const steps = [
  "Personal Information",
  "Contact Details",
  "Employment Information",
  "Education & Experience",
  "Certifications & Licenses",
];

const StepperForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const editStaffData = useSelector(
    (state: RootState) => state.staffEdit && state.staffEdit.data && state.staffEdit.data[0]
  );
  const [activeStep, setActiveStep] = useState(0);
  const [allData, setAllData] = useState<any>({});
  const lastStaffIDRef = useRef(null);
  const currentNav = usePathname();
  const teamId = currentNav?.split("/")[2];
  const router = useRouter();
  const [disableRouting, setDisableRouting] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [routeHandel, setRouteHandel] = useState(true);

  useEffect(() => {
    setLocalStorage("addStaffData", JSON.stringify(allData));
    if (allData.staffID && allData.staffID !== lastStaffIDRef.current) {
      const payload: any = {
        staffID: allData.staffID,
        sportID: teamId
      };
      dispatch(editStaff(payload));
      lastStaffIDRef.current = allData.staffID;
    }
  }, [allData]);

  useEffect(() => {
    if (editStaffData && !_.isEmpty(editStaffData.attachmentList)) {
      const profileImageAttachment = _.find(editStaffData.attachmentList, {
        documentSection: "ProfileImage",
      });
      const passportAttachment = _.find(editStaffData.attachmentList, {
        documentSection: "Passport",
      });
      const iDDocumentAttachment = _.find(editStaffData.attachmentList, {
        documentSection: "IDDocument",
      });
      const certificateAttachment = _.find(editStaffData.attachmentList, {
        documentSection: "Certificate",
      });
      const contractDocumentAttachment = _.find(editStaffData.attachmentList, {
        documentSection: "ContractDocument",
      });
      const uploadCertificateAttachment = _.find(editStaffData.attachmentList, {
        documentSection: "Certificate",
      });
      const heroImageAttachment = _.find(editStaffData.attachmentList, {
        documentSection: "ProfileFullImage",
      });
      setAllData((prevFormData: any) => ({
        ...prevFormData,
        iDdocumentImage: iDDocumentAttachment?.fileName || "",
        passportPdf: passportAttachment?.fileName || "",
        profileImage: profileImageAttachment?.filePath || "",
        certificate: certificateAttachment?.fileName || "",
        contract: contractDocumentAttachment?.fileName || "",
        uploadCertificate: uploadCertificateAttachment?.fileName || "",
        heroImage: heroImageAttachment?.filePath || ""
      }));
    }
  }, [editStaffData]);

  useEffect(() => {
    return () => {
      removeLocalStorage("addStaffData");
    };
  }, []);

  const deletePayload: any = {
    staffID: allData.staffID,
    loggedUserID: 1
  };

  const handleDialogAgree = () => {
    setDisableRouting(false)
    setDialogOpen(false);
    removeLocalStorage("addStaffData");
    if (allData.staffID) {
      setLoading(true)
      dispatch(deleteCustomerById(deletePayload))
      setTimeout(() => {
        router.push(`/teams/${teamId}/staffs`);
        setLoading(false)
      }, 2000);
    } else {
      router.push(`/teams/${teamId}/staffs`);
    }
  };

  const handleDialogDisagree = () => {
    setDialogOpen(false);
  };

  const handleRouteChange = (url: any) => {
    if (disableRouting) {
       setDialogOpen(true);
      return false;
    }
    return true;
  };

  useEffect(() => {
    if(routeHandel){
      const onRouteChangeStart = (url:any) => {
        if (!handleRouteChange(url)) {
          router.events.emit('routeChangeError');
          throw 'Route change aborted by user';
        }
      };
  
      if (disableRouting) {
        router.events.on('routeChangeStart', onRouteChangeStart);
      }
      return () => {
        router.events.off('routeChangeStart', onRouteChangeStart);
      };
    }
  }, [disableRouting]);

  const filepayload: any = {
    staffID: allData?.staffID || ''
  }

  const renderStepContent = (step: any) => {
    switch (step) {
      case 0:
        return (
          <PersonalInformation
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setAllData={setAllData}
            allData={allData}
            editStaffData={editStaffData}
            filepayload={filepayload}
            teamId={teamId}
            setDialogOpen={setDialogOpen}
          />
        );
      case 1:
        return (
          <ContactDetails
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setAllData={setAllData}
            allData={allData}
          />
        );
      case 2:
        return (
          <EmploymentInformation
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setAllData={setAllData}
            allData={allData}
            editStaffData={editStaffData}
            filepayload={filepayload}
          />
        );
      case 3:
        return (
          <EducationandExperience
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setAllData={setAllData}
            allData={allData}
            editStaffData={editStaffData}
            filepayload={filepayload}
          />
        );
      case 4:
        return (
          <CertificationsAndLicenses
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setAllData={setAllData}
            allData={allData}
            editStaffData={editStaffData}
            filepayload={filepayload}
            teamId={teamId}
            setLoading={setLoading}
            setRouteHandel={setRouteHandel}
            setDisableRouting={setDisableRouting}
          />
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  const breadcrumbRoutes = [
    {
      title: "Sports",
      route: "/teams/staffs",
      currentPage: false,
      disabled: true,
    },
    {
      title: "Staffs",
      route: `/teams/${getCurrentSport}/staffs`,
      currentPage: false,
      disabled: true,
    },
    {
      title: "Add Staff",
      route: "/teams/staffs/addStaff",
      currentPage: true,
    },
  ];

  const handleNext = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };


  return (
    <Grid container spacing={1}>
      <AlertDialog
        open={dialogOpen}
        onClose={handleDialogDisagree}
        title="Discard Changes"
        description="You have unsaved changes. Do you really want to leave this page?"
        onAgree={handleDialogAgree}
        onDisagree={handleDialogDisagree}
        agreeLabel="Discard"
        disagreeLabel="Cancel"
      />
       {
        loading && (
         <LoadingOverlay  loading={loading}/>
        )
      }
      <Grid item xs={12} md={12}>
        <Box p={1} className="bg-white" borderRadius={1}>
          <BasicBreadcrumbs routes={breadcrumbRoutes} setOpen={setDialogOpen} />
        </Box>
      </Grid>
      <Grid item xs={12} md={12}>
        <Box className="bg-white" borderRadius={1}>
          <Box p={2}>
            <Box>
              <Typography
                sx={{
                  fontFamily: "29LT Bukra",
                  fontSize: "18px",
                  fontWeight: 600,
                  lineHeight: "19.2px",
                  textAlign: "left",
                }}
              >
                Add Staff
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Stack
            sx={{ width: "100%", height: "73vh", overflow: "scroll" }}
            spacing={4}
            mt={2}
          >
            <Stepper
              alternativeLabel
              activeStep={activeStep}
              connector={<ColorlibConnector />}
            >
              {steps.map((label, key) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>
                    <Typography className="stepper-number dubai-med">
                      Step {key + 1}
                    </Typography>
                    <Typography
                      className={`dubai-med ${activeStep === key
                        ? "stepper-label-active"
                        : key < activeStep
                          ? "stepper-label-active"
                          : "stepper-label dubai-med"
                        }`}
                    >
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box>
              {renderStepContent(activeStep)}
            </Box>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
};

StepperForm.getLayout = (page: React.ReactNode) => <SubMenuLayout>{page}</SubMenuLayout>;
export default StepperForm;