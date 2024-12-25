"use client";

import { Box, Typography } from "@mui/material";
import UserSVG from "../../../public/UserSVG.svg";
import HastagSVG from "../../../public/HastagSVG.svg";
import EnvelopeSVG from "../../../public/EnvelopeSVG.svg";
import PhoneCallSVG from "../../../public/PhoneCallSVG.svg";
import SirenOnSVG from "../../../public/SirenOnSVG.svg";
import EmergencyCallSVG from "../../../public/EmergencyCallSVG.svg";
import LandLayerLocationSVG from "../../../public/LandLayerLocationSVG.svg";
import MarkerSVG from "../../../public/MarkerSVG.svg";
import TranslationSVG from "../../../public/TranslationSVG.svg";
import PassportIcon from "../../../public/passportIcon.svg";
import PassportExpiry from "../../../public/passportExpiry.svg";
import Height from "../../../public/height.svg";
import Weight from "../../../public/weight.svg";
import PerformanceLevel from "../../../public/PerformanceLevel.svg";
import BloodGroup from "../../../public/BloodGroup.svg";
import _ from "lodash";

interface PersonalDetailsCardProps {
  data: any;
  module: any;
}

const PersonalDetailsCard: React.FC<PersonalDetailsCardProps> = ({ data, module }) => {
  const modules: any = {
    staff: [
      { name: "Full Name", nodeName: "firstName", icon: <UserSVG style={{ width: 16, height: 16 }} /> },
      { name: "Emirates ID", nodeName: "emiratesID", icon: <HastagSVG style={{ width: 16, height: 16 }} /> },
      { name: "Passport Number", nodeName: "passportNo", icon: <PassportIcon style={{ width: 16, height: 16 }} /> },
      { name: "Passport Expiry Date", nodeName: "passportExpirationDate", icon: <PassportExpiry style={{ width: 16, height: 16 }} /> },
      { name: "Personal Email ID", nodeName: "personalEmail", icon: <EnvelopeSVG style={{ width: 16, height: 16 }} /> },
      { name: "Dubai Police Email ID", nodeName: "dubaiPoliceEmail", icon: <EnvelopeSVG style={{ width: 16, height: 16 }} /> },
      { name: "Phone Number", nodeName: "phoneNo", icon: <PhoneCallSVG style={{ width: 16, height: 16 }} /> },
      { name: "Emergency Contact Person", nodeName: "emergencyContactName", icon: <SirenOnSVG style={{ width: 16, height: 16 }} /> },
      { name: "Emergency Contact Number", nodeName: "emergencyContactNumber", icon: <EmergencyCallSVG style={{ width: 16, height: 16 }} /> },
      { name: "Place of Birth", nodeName: "placeOfBirth", icon: <LandLayerLocationSVG style={{ width: 16, height: 16 }} /> },
      { name: "Residence", nodeName: "residence", icon: <MarkerSVG style={{ width: 16, height: 16 }} /> },
      { name: "Languages Spoken", nodeName: "languagesSpoken", icon: <TranslationSVG style={{ width: 16, height: 16 }} /> },
      { name: "Height", nodeName: "height", icon: <Height style={{ width: 16, height: 16 }} /> },
      { name: "Weight", nodeName: "weight", icon: <Weight style={{ width: 16, height: 16 }} /> },
    ],
    athlete: [
      { name: "Name", nodeName: "firstName", icon: <UserSVG style={{ width: 16, height: 16 }} /> },
      { name: "Performance Level", nodeName: "performanceLevel", icon: <PerformanceLevel style={{ width: 16, height: 16 }} /> },
      { name: "Emirates ID", nodeName: "emiratesID", icon: <HastagSVG style={{ width: 16, height: 16 }} /> },
      { name: "Passport Number", nodeName: "passportNo", icon: <PassportIcon style={{ width: 16, height: 16 }} /> },
      { name: "Passport Expiry Date", nodeName: "passportExpirationDate", icon: <PassportExpiry style={{ width: 16, height: 16 }} /> },
      { name: "Dubai Police Email ID", nodeName: "dubaiPoliceEmail", icon: <EnvelopeSVG style={{ width: 16, height: 16 }} /> },
      { name: "Personal Email ID", nodeName: "personalEmail", icon: <EnvelopeSVG style={{ width: 16, height: 16 }} /> },
      { name: "Phone Number", nodeName: "phoneNo", icon: <PhoneCallSVG style={{ width: 16, height: 16 }} /> },
      { name: "Emergency Contact Person", nodeName: "emergencyContactName", icon: <SirenOnSVG style={{ width: 16, height: 16 }} /> },
      { name: "Emergency Contact Number", nodeName: "emergencyContactNumber", icon: <EmergencyCallSVG style={{ width: 16, height: 16 }} /> },
      { name: "Place of Birth", nodeName: "placeOfBirth", icon: <LandLayerLocationSVG style={{ width: 16, height: 16 }} /> },
      { name: "Residence", nodeName: "residence", icon: <MarkerSVG style={{ width: 16, height: 16 }} /> },
      { name: "Languages Spoken", nodeName: "languagesSpoken", icon: <TranslationSVG style={{ width: 16, height: 16 }} /> },
      { name: "Height", nodeName: "height", icon: <Height style={{ width: 16, height: 16 }} /> },
      { name: "Weight", nodeName: "weight", icon: <Weight style={{ width: 16, height: 16 }} /> },
      { name: "Blood Group", nodeName: "bloodType", icon: <BloodGroup style={{ width: 16, height: 16 }} /> },
    ]
  }

  return (
    <Box>
      {modules[module].map((item: any, index: any) => (
        <Box sx={{ paddingLeft: 2, marginTop: 1 }} key={index}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {item.icon}
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                fontSize: 15,
                color: "#333333",
                paddingLeft: 1,
              }}
              className="bukra"
            >
              {item.name}
            </Typography>
          </Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 400,
              fontSize: 16,
              color: "#8D9093",
              paddingLeft: 3,
            }}
            className={item.nodeName === "personalEmail" || item.nodeName === "dubaiPoliceEmail" ? "dubai-med text-lowercase" : "dubai-med text-capitalize"}
          >
            {_.isEmpty(data && data[item.nodeName]) || data && data[item.nodeName] === " "
              ? <>&nbsp;</>
              : `${data[item.nodeName]}${item.nodeName === "height" ? " CM" : item.nodeName === "weight" ? " KG" : ""}`
            }
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default PersonalDetailsCard;