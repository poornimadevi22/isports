"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Chip, Dialog, Skeleton, Stack } from "@mui/material";

import SearchField from "./Fields/SearchField";
import { useForm, Controller } from "react-hook-form";
import _, { isEmpty } from "lodash";
import { sportsIconDropData } from "@/utils/constants";
import Tooltip from "@mui/material/Tooltip";
import { useRouter } from "next/navigation";
import { setLocalStorage } from "@/utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { handleSubMenu } from "@/redux/slices/appSplice";
import { AppDispatch } from "@/redux/store";

interface RoutePath {
  path: string;
  customSelect: string;
}

const CustomCard: React.FC<RoutePath> = ({ path, customSelect }) => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const [selectedChip, setSelectedChip] = React.useState<string>("All Sports"); // Track selected chip
  const isSubOpen = useSelector((state: any) => {
    return state.ui.allSportMenu;
  });

  const getSportList = useSelector((state: any) => {
    return state.getSportList;
  });

  const { control, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const handleSport = (value: any) => {
    setLocalStorage("sport", value);
    router.push(`/teams/${value}/${path}`);
    dispatch(handleSubMenu(false));
  };
  const handleClose = () =>{
    dispatch(handleSubMenu(false))
  }
  const renderIconGrid = (data: any) => {
    return data.map((item: any) => (
      <Grid item xs={4} key={item.id}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Tooltip title={item.label}>
            <Avatar
              sx={{
                width: "60px", // Avatar size
                height: "60px",
                backgroundColor: "#EDFFFC", // Background color
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%", // Ensures circular shape
                border: "1px solid #008755", // Border styling
                cursor: "pointer", // Adds pointer cursor for clickability
              }}
              onClick={() => handleSport(item.sportID)}
            >
              {_.isEmpty(item.sportProfile) ? (
                sportsIconDropData[20].icon
              ) : (
                <img
                  src={item.sportProfile}
                  alt={item.sportName || "Team Profile"}
                  style={{ width: "35px", height: "22px" }}
                />
              )}
            </Avatar>
          </Tooltip>
          <Typography
            variant="caption"
            className="dubai-med"
            sx={{
              mt: 1,
              textAlign: "center",
              color: "#58585B",
              fontWeight: "400",
              fontSize: "18px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
            }}
          >
            {item.sportName}
          </Typography>
        </Box>
      </Grid>
    ));
  };

  const searchValue = watch("search"); // Watch for search value

  const filteredIconData = React.useMemo(() => {
    let filteredData = _.filter(getSportList.data, (item) =>
      item.sportName.toLowerCase().includes(searchValue.toLowerCase())
    );
    if (selectedChip !== "All Sports") {
      filteredData = filteredData.filter(
        (item) => item.categoryType === selectedChip[selectedChip.length - 1] // Assuming last character of chip is category, e.g., "Category A"
      );
    }

    return filteredData;
  }, [searchValue, selectedChip]); // Recalculate when searchValue changes

  const handleChipClick = (label: string) => {
    setSelectedChip(label); // Set the clicked chip as the selected one
  };

  const getChipStyles = (label: string) => ({
    color: selectedChip === label ? "#EDFFFC" : "#008755",
    background: selectedChip === label ? "#008755" : "#FFFFFF",
    "&:hover": {
      background: selectedChip === label ? "#008755" : "#FFFFFF",
    },
    fontWeight: "500",
    fontSize: "16px",
    height:'37px',
    border:"1px solid #008755",
    borderRadius:'33px',
    width:'105px'
  });

  const handleBack = () => {
    dispatch(handleSubMenu(false));
  };

  return (
    <>
      {isSubOpen ? (
        <Box sx={{ maxWidth: 420 }}>
          <Dialog
            open={isSubOpen}
            onClose={handleClose}
            sx={{
              "& .MuiDialog-paper": {
                width: 514, // Set a fixed width for the dialog
                minWidth: 300,
                // margin: "auto", // Center the dialog
                position: "absolute", // Positioning
                top: "24%", // Adjust the vertical position
                left: 73, // Adjust the vertical position
                transform: "translateY(-22%)", // Center vertically
              },
              "& .MuiPaper-root": { boxShadow: "none" },
            }}
            BackdropProps={{
              sx: {
                backdropFilter: "blur(0px)", // Apply blur effect to the backdrop
                backgroundColor: "rgba(255, 255, 255, 0)", // Semi-transparent black
              },
            }}
          >
            <Card
              variant="outlined"
              sx={{ height: "92vh", overflow: "hidden" }}
            >
              {" "}
              {/* Set a fixed height for the card */}
              <CardActions>
                <Box sx={{ display: "grid", width: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Button
                      startIcon={<ArrowBackIcon sx={{ color: "#000000" }} />}
                      size="large"
                      onClick={handleBack}
                    ></Button>
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1,
                        textAlign: "center",
                        color: "#000000",
                        fontWeight: "500",
                        fontSize: "22px",
                        fontFamily: "29LT Bukra",
                        lineHeight: "26.4px",
                      }}
                      className="bukra"
                    >
                      All Sport
                    </Typography>
                  </Box>
                  <Box sx={{ padding: "20px" }}>
                    <Controller
                      name="search"
                      control={control}
                      render={({ field }) => (
                        <SearchField
                          label="Search"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Search Sport..."
                        />
                      )}
                    />
                  </Box>
                  <Box
                    sx={{
                      px: 3,
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <Stack direction="row" spacing={1}>
                      <Chip
                        className="dubai-med"
                        label="All Sport"
                        sx={getChipStyles("All Sports")}
                        onClick={() => handleChipClick("All Sports")}
                      />
                      <Chip
                        className="dubai-med"
                        label="Category A"
                        sx={getChipStyles("Category A")}
                        onClick={() => handleChipClick("Category A")}
                      />
                      <Chip
                        className="dubai-med"
                        label="Category B"
                        sx={getChipStyles("Category B")}
                        onClick={() => handleChipClick("Category B")}
                      />
                      <Chip
                        className="dubai-med"
                        label="Category C"
                        sx={getChipStyles("Category C")}
                        onClick={() => handleChipClick("Category C")}
                      />
                    </Stack>
                  </Box>
                </Box>
              </CardActions>
              <CardContent
                sx={{
                  padding: 0,
                  height: "calc(100% - 150px)",
                  overflowY: "auto",
                }}
              >
                {" "}
                <Grid
                  container
                  spacing={0}
                  columnSpacing={0}
                  rowSpacing={3}
                  justifyContent="flex-start"
                  sx={{
                    height: "auto",
                    overflowY: "hidden",
                    "&::-webkit-scrollbar": {
                      width: "4px",
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "#f1f1f1",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#008755",
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      backgroundColor: "#555",
                    },
                    px: 2,
                  }}
                >
                  {getSportList?.loading ? (
                    Array.from({ length: 21 }).map((_, index) => (
                    <Grid item xs={4} key={index}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                      >
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton animation="wave" sx={{mt:1}} width={80}/>
                      </Box>
                    </Grid>))
                  ) : (
                    !isEmpty(getSportList.data) &&
                    renderIconGrid(
                      isEmpty(filteredIconData)
                        ? getSportList.data
                        : filteredIconData
                    )
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Dialog>
        </Box>
      ) : null}
    </>
  );
};
export default CustomCard;
