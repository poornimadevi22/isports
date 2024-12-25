"use client"

import { Box, Typography } from "@mui/material";
import CalendarSVG from "../../../public/CalendarSVG.svg";
import Department from "../../../public/department.svg";
import BriefcaseSVG from "../../../public/BriefcaseSVG.svg";
import _ from "lodash";

interface ContractDetailsCardProps {
  data: any;
  module: any;
}

const ContractDetailsCard: React.FC<ContractDetailsCardProps> = ({ data, module }) => {
  const modules:any ={
    staff: [
    // { name: "Employment Status", nodeName: "dpEmploymentStatus", icon: <CalendarSVG style={{ width: 16, height: 16 }} />},
    { name: "Contract Start Date", nodeName: "contractStartDate", icon: <CalendarSVG style={{ width: 16, height: 16 }} />},
    { name: "Contract End Date", nodeName: "contractEndDate", icon: <CalendarSVG style={{ width: 16, height: 16 }} />},
    { name: "Current Job Position", nodeName: "currentJobLocation", icon: <BriefcaseSVG style={{ width: 16, height: 16 }} />},
    { name: "Department", nodeName: "department", icon: <Department style={{ width: 16, height: 16 }} />},
    { name: "Date of Last Job Promotion", nodeName: "dateOfLastJobPromotion", icon: <CalendarSVG style={{ width: 16, height: 16 }} />},
    { name: "Dubai Police Employment Status", nodeName: "dpEmploymentStatus", icon: <CalendarSVG style={{ width: 16, height: 16 }} />},
    { name: "Rank", nodeName: "rankOrGrade", icon: <CalendarSVG style={{ width: 16, height: 16 }} />},
    { name: "Acknowledgement Date", nodeName: "acknowledgementDate", icon: <CalendarSVG style={{ width: 16, height: 16 }} />},
    { name: "Pledge Date", nodeName: "pledgeDate", icon: <CalendarSVG style={{ width: 16, height: 16 }} />},
  ],
  athlete: [
    { name: "Contract Type", nodeName: "contractType", icon: <CalendarSVG style={{ width: 16, height: 16 }} />},
    { name: "Contract Start Date", nodeName: "contractStartDate", icon: <CalendarSVG style={{ width: 16, height: 16 }} />},
    { name: "Contract End Date", nodeName: "contractEndDate", icon: <CalendarSVG style={{ width: 16, height: 16 }} />},
  ]
}

  return (
    <Box>
      {modules[module].map((item:any, index:any) => (
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
            className="dubai-med text-capitalize"
          >
            {_.isEmpty(data && data[item.nodeName]) || data && data[item.nodeName]===" " ? <>&nbsp;</> :data[item.nodeName] }
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

export default ContractDetailsCard;