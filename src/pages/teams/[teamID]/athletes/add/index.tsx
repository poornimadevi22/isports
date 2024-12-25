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
  Skeleton,
  CircularProgress,
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
import PhysicalAndMedical from "./physicalAndMedical";
import AdditionalDetails from "./additionalDetails";
import { getLocalStorage, removeLocalStorage, setLocalStorage } from "@/utils/helper";
import BasicBreadcrumbs from "@/components/breadcrumbs";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { editAthlete } from "@/redux/slices/athlete/athleteEditSlice";
import _ from "lodash";
import ProfessionalDetails from "./professionalDetails";
import SubMenuLayout from "../layout";
import { usePathname } from "next/navigation";
import { useRouter } from 'next/router';
import AlertDialog from "@/components/Allert";
import { deleteAthleteById } from "@/redux/slices/athlete/athleteDeleteSlice";
import LoadingOverlay from "@/components/Loading";

const getCurrentSport = getLocalStorage('sport')

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
  "Professional Details",
  "Physical & Medical Atrributes",
  "Additional Details",
];

const StepperForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const editAthleteData = useSelector((state: RootState) => state?.athleteEdit?.data?.[0]);
  const [activeStep, setActiveStep] = useState(0);
  const [allData, setAllData] = useState<any>({});
  const lastathleteIDRef = useRef(null);
  const currentNav = usePathname();
  const teamId = currentNav?.split("/")[2];
  const router = useRouter();
  const [disableRouting, setDisableRouting] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [routeHandel, setRouteHandel] = useState(true);

  const editPayload: any = {
    athleteID: allData.athleteID,
    sportID: teamId
  };

  const deletePayload: any = {
    athleteID: allData.athleteID,
    loggedUserID: 1
  };

  useEffect(() => {
    setLocalStorage("addAthleteData", JSON.stringify(allData));
    if (allData.athleteID && allData.athleteID !== lastathleteIDRef.current) {
      dispatch(editAthlete(editPayload));
      lastathleteIDRef.current = allData.athleteID;
    }
  }, [allData]);


  useEffect(() => {
    if (editAthleteData && !_.isEmpty(editAthleteData.attachmentList)) {
      const profileImageAttachment = _.find(editAthleteData.attachmentList, {
        documentSection: "ProfileImage",
      });
      const passportAttachment = _.find(editAthleteData.attachmentList, {
        documentSection: "Passport",
      });
      const iDDocumentAttachment = _.find(editAthleteData.attachmentList, {
        documentSection: "IDDocument",
      });
      const certificateAttachment = _.find(editAthleteData.attachmentList, {
        documentSection: "Certificate",
      });
      const profileFullImageAttachment = _.find(editAthleteData.attachmentList, {
        documentSection: "ProfileFullImage",
      });
      const contractDocumentAttachment = _.find(editAthleteData.attachmentList, {
        documentSection: "ContractDocument",
      });
      const licenseAttachment = _.find(editAthleteData.attachmentList, {
        documentSection: "license",
      });
      const externalClubsContractAttachment = _.find(editAthleteData.attachmentList, {
        documentSection: "externalClubsContract",
      });
      const IndividaulPlansAttachment = _.find(editAthleteData.attachmentList, {
        documentSection: "IndividaulPlans",
      });
      setAllData((prevFormData: any) => ({
        ...prevFormData,
        iDdocumentImage: iDDocumentAttachment?.fileName || "",
        passportPdf: passportAttachment?.fileName || "",
        profileImage: profileImageAttachment?.filePath || "",
        certificate: certificateAttachment?.fileName || "",
        ProfileFullImage: profileFullImageAttachment?.filePath || "",
        contractDocument: contractDocumentAttachment?.fileName || "",
        license: licenseAttachment?.fileName || "",
        externalClubsContract: externalClubsContractAttachment?.fileName || "",
        IndividaulPlans: IndividaulPlansAttachment?.fileName || "",
      }));
    }
  }, [editAthleteData]);

  useEffect(() => {
    return () => {
      removeLocalStorage("addAthleteData");
      if ([1, 2, 3].includes(activeStep)) {
        // dispatch(deleteAthleteById(deletePayload));
      }
    };
  }, []);

  const handleDialogAgree = () => {
    setDisableRouting(false)
    setDialogOpen(false);
    removeLocalStorage("addAthleteData");
    if (allData?.athleteID) {
      setLoading(true)
      dispatch(deleteAthleteById(deletePayload));
      setTimeout(() => {
        router.push(`/teams/${teamId}/athletes`);
        setLoading(false)
      }, 2000);
    } else {
      router.push(`/teams/${teamId}/athletes`);
    }
  };

  const handleDialogDisagree = () => {
    setDialogOpen(false);
  };


  const handleRouteChange = (url: any) => {
    if (disableRouting) {
      console.log('Routing is disabled.');
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

  const renderStepContent = (step: any) => {
    switch (step) {
      case 0:
        return (
          <PersonalInformation
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setAllData={setAllData}
            allData={allData}
            editAthleteData={editAthleteData}
            teamId={teamId}
            editPayload={editPayload}
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
            teamId={teamId}
            editAthleteData={editAthleteData}
            editPayload={editPayload}
          />
        );
      case 2:
        return (
          <ProfessionalDetails
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setAllData={setAllData}
            allData={allData}
            teamId={teamId}
            editAthleteData={editAthleteData}
            editPayload={editPayload}
          />
        );
      case 3:
        return (
          <PhysicalAndMedical
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setAllData={setAllData}
            allData={allData}
            teamId={teamId}
            editAthleteData={editAthleteData}
            editPayload={editPayload}
          />
        );
      case 4:
        return (
          <AdditionalDetails
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setAllData={setAllData}
            allData={allData}
            teamId={teamId}
            editAthleteData={editAthleteData}
            editPayload={editPayload}
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
      route: activeStep === 4 ? `/teams/${getCurrentSport}/athletes` : "",
      currentPage: false,
      disabled: true,
    },
    {
      title: "Athletes",
      route: activeStep === 4 ? `/teams/${getCurrentSport}/athletes` : "",
      currentPage: false,
      disabled: true
    },
    {
      title: "Add Athletes",
      route: `/teams/${getCurrentSport}/athletes/add`,
      currentPage: true,
    },
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
          <LoadingOverlay loading={loading} />
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
                Add Athlete
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
              {/* <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button disabled={activeStep === 0} onClick={handleBack} variant="contained">
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      variant="contained"
                      color="primary"
                    >
                      {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                  </Box> */}
            </Box>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
};
StepperForm.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default StepperForm;