import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import EditIcon from "../../public/EditSVG.svg";
import VisibilityIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CardBg from "../../public/CardBg.png"; // Adjust the path if necessary
import { getPerformanceLevel, getRoleColor } from "@/utils/constants";
import { capitalizeFirstLetter } from "@/utils/helper";
import { isString, trim } from "lodash";

// Define the props interface
interface ProfileCardProps {
  profileImage?:string
  rank?:string
  name?:string
  personalEmail?:string
  role?:string
  contractStart?:string
  contractEnd?:string
  onViewClick: () => void; // Callback for View button
  onEditClick: () => void; // Callback for Edit button
  label?:any
  dob?:string
  performanceLevel?:string,
  module?:string
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profileImage,
  rank,
  name,
  personalEmail,
  role,
  contractStart,
  contractEnd,
  onViewClick,
  onEditClick,
  label,
  dob,
  performanceLevel,
  module
}) => {  
  const getColor = module ==='staff' ? getRoleColor(role) : getPerformanceLevel(performanceLevel)
  const isStringEmpty = (str:any) => isString(str) && trim(str).length === 0;

  return (
    <Card
      sx={{
        bgcolor: getColor.backgroundColor ,
        maxWidth: "100%",
        maxHeight: 375,
        // minWidth: '249px',
        // minHeight: '365px',
        border: `0.5px solid ${getColor.color}`,
        borderRadius: "20px",
        textAlign: "center",
        boxShadow: "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${CardBg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.2,
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          marginLeft: "-8px",
        }}
      >
        <Avatar
          alt="Profile Image"
          src={profileImage}
          sx={{
            width: 100,
            height: 100,
            margin: "0 auto",
            borderRadius: "50%",
            marginTop: "15px",
          }}
        />
        <CardContent className="pb-2">
          <Typography
            sx={{
              fontFamily: "29LT Bukra",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "24px",
              color: "#000",
            }}
            fontWeight="bold"
            className="bukra"
          >
            {!isStringEmpty(rank) ? rank :'-'}
          </Typography>
          <Tooltip title={name}>
            <Typography
              sx={{
                fontFamily: "29LT Bukra",
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "24px",
                color: "#000",
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "1",
                WebkitBoxOrient: "vertical",
              }}
              className="bukra"
            >
                  {!isStringEmpty(name) ? name :'-'}
            </Typography>
          </Tooltip>
          <Typography
            sx={{
              fontFamily: "29LT Bukra",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "24px",
              color: "rgba(122, 122, 122, 1)",
            }}
            className="dubai-med"
          >
            {!isStringEmpty(personalEmail) ? personalEmail :'-'}
            {/* {personalEmail} */}
          </Typography>
          <Box display="flex" justifyContent="center" mt={1} mb={2}>
            <Chip
              label={module ==='staff' ? capitalizeFirstLetter(role) : module ==='athlete' && capitalizeFirstLetter(performanceLevel)}
              sx={{
                padding: "0px",
                fontFamily: "Dubai, sans-serif",
                fontWeight: 400,
                fontSize: "16px",
                backgroundColor: getColor.color, // Set the background color based on role
                color: "#fff",
                lineHeight: "18px", // Adjust the font size
                height: "24px", // Custom height to make it smaller
                ".MuiChip-label": {
                  py: "7px",
                  px: "10px",
                },
              }}
              className="dubai-med"
            />
          </Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start !important"
            spacing={2}
            my={0}
            sx={{ flexWrap: "nowrap", marginY: "5px" }} // Prevents wrapping to the next line
          >
            <Box sx={{ width: "50%", flexShrink: 0 }}>
              <Typography
                sx={{
                  fontFamily: "Dubai, sans-serif",
                  fontWeight: 600,
                  fontSize: "12px",
                  color: "rgba(141, 144, 147, 1)",
                  whiteSpace: "nowrap",
                }}
                className="dubai-med"
              >
                {label[0]}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "29LT Bukra",
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "24px",
                  color: "#000",
                  whiteSpace:'nowrap',
                  overflow:'hidden', 
                  textOverflow:'ellipsis', 
                }}
                className="bukra"
              >
                {module ==='staff' ? contractStart : module ==='athlete' && dob }
              </Typography>
            </Box>
            <Box
              sx={{
                borderLeft: "1px solid #7A7A7A", // Customize color as needed
                height: "40px", // Adjust height as needed
                alignSelf: "center", // Aligns the line vertically in the center
                marginLeft: "5px !important",
              }}
            />
            <Box
              sx={{ width: "50%", flexShrink: 0, marginLeft: "5px !important" }}
            >
              <Typography
                sx={{
                  fontFamily: "Dubai, sans-serif",
                  fontWeight: 600,
                  fontSize: "12px",
                  color: "rgba(141, 144, 147, 1)",
                  whiteSpace: "nowrap",
                }}
                className="dubai-med"
              >
                {label[1]}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "29LT Bukra",
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "24px",
                  color: "#000",
                  whiteSpace:'nowrap',
                  overflow:'hidden', 
                  textOverflow:'ellipsis', 
                }}
                className="bukra"
              >
                  {module ==='staff' ? contractEnd : module ==='athlete' && role }
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" justifyContent="space-between" spacing={1} px={1}>
            <IconButton
              sx={{
                backgroundColor: "#008755",
                color: "white",
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "darkgreen",
                },
                width: "50%",
                padding: "4px 8px", // Adjust padding top/bottom and left/right
                minHeight: "39px", // Reduce the height of the button
              }}
              onClick={onViewClick} // Use prop for click action
            >
              <VisibilityIcon />
              <Typography
                sx={{
                  fontFamily: "29LT Bukra",
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "24px",
                }}
                ml={1}
                className="dubai-med"
              >
                View
              </Typography>
            </IconButton>
            <IconButton
              sx={{
                backgroundColor: "transparent",
                color: "#008755",
                border: "1px solid #008755",
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "#fff",
                },
                width: "50%",
                padding: "4px 8px", // Adjust padding top/bottom and left/right
                minHeight: "39px", // Reduce the height of the button
              }}
              className="dubai-med"
              onClick={onEditClick} // Use prop for click action
            >
              <EditIcon width={"18px"} height={"18px"} />
              <Typography
                sx={{
                  fontFamily: "29LT Bukra",
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "24px",
                }}
                ml={1}
                className="dubai-med"
              >
                Edit
              </Typography>
            </IconButton>
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
};

export default ProfileCard;