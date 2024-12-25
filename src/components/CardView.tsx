import {
  Box,
  Grid,
  Skeleton,
  useTheme,
  useMediaQuery,
  Alert,
  Grow,
} from "@mui/material";
import React from "react";
import ProfileCard from "./ProfileCard";
import { useRouter } from "next/navigation";
import moment from "moment";
import { isEmpty } from "lodash";
import { getLocalStorage } from "@/utils/helper";

// Define the interface for a single profile
interface Profile {
  profileImage: string;
  rank: string;
  name: string;
  personalEmail: string;
  role: string;
  contractStartDate: string;
  contractEndDate: string;
  staffID: string;
}

// Define the props for the CardView component
interface CardViewProps {
  data: any[]; // Array of Profile objects
  isEdit: any; // Function for editing a profile
  isLoading: boolean; // Loading state
  label?: any;
  module?: string;
  setPage?:any;
  page?:any;
  setRowsPerPage?:any;
  rowsPerPage?:any
}

const CardView: React.FC<CardViewProps> = ({
  data,
  isEdit,
  isLoading,
  label,
  module,
  setPage,
  page,
  setRowsPerPage,
  rowsPerPage
}) => {
  const router = useRouter();
  const theme = useTheme();
  const is2K = useMediaQuery(theme.breakpoints.up("xl"));
  const is4K = useMediaQuery("(min-width:2200px)");
  const is8K = useMediaQuery("(min-width:2500px)");
  const getCurrentSport = getLocalStorage('sport') 
  if (!isLoading && isEmpty(data)) {
    return <Alert severity="info">No records found</Alert>;
  }

  return (
    <Box
      p={{ xs: 2 }}
      pt={0}
      sx={{
        overflowY: "auto",
        height: {
          sm: "63vh",
          xl: "63vh",
          is2K:"69vh"
        },
      }}
    >
      <Grid container spacing={2}>
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={is8K ? 1.714285714285714 : is4K ? 2 : is2K ? 2.4 : 3}
                key={index}
              >
                <Skeleton variant="rectangular" height={200} animation="wave" />
                <Box sx={{ pt: 1 }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
              </Grid>
            ))
          : data &&
            data.length &&
            data.map((profile, index) => {
              const birthDate = moment("1991-12-12", "YYYY-MM-DD");
              const age = moment().diff(birthDate, "years").toString();
              return (
                <Grow
                  in={true}
                  style={{ transformOrigin: "0 0 0" }}
                  {...(true ? { timeout: 500 +(index*200) } : {})}
                  key={index}
                >
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={is8K ? 1.714285714285714 : is4K ? 2 : is2K ? 2.4 : 3}
                    key={index}
                  >
                    <ProfileCard
                      profileImage={profile.profileImage}
                      rank={profile.rank}
                      name={profile.firstName}
                      personalEmail={profile.personalEmail}
                      role={profile.role}
                      contractStart={profile.contractStartDate}
                      contractEnd={profile.contractEndDate}
                      onViewClick={() => {
                        if (module == "staff") {
                          router.push(`/teams/${getCurrentSport}/staffs/view/` + profile.staffID);
                        } else if (module == "athlete") {
                          router.push(
                            `/teams/${getCurrentSport}/athletes/view/` + profile.athleteID
                          );
                        }
                      }}
                      onEditClick={() =>
                        isEdit(
                          module === "staff"
                            ? profile.staffID
                            : profile.athleteID
                        )
                      }
                      label={label}
                      dob={age}
                      performanceLevel={profile.performanceLevel}
                      module={module}
                    />
                  </Grid>
                </Grow>
              );
            })}
      </Grid>
    </Box>
  );
};

export default CardView;
