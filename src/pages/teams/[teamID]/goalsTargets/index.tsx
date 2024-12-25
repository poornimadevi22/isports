"use client";
import BasicBreadcrumbs from "@/components/breadcrumbs";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import { usePathname } from "next/navigation";
import TeamsTable from "./goalsTargets";
import FilterDialog from "@/components/FilterDialog";
import SubMenuLayout from "./layout";
import {
  listGoalsTargets,
  clearListState,
} from "@/redux/slices/goalsTargets/goalsTargetsListSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Edit from "./[id]/edit";
import { clearEditState } from "@/redux/slices/goalsTargets/goalsTargetsEditSlice";
import { getLocalStorage } from "@/utils/helper";
import SeasonMenu from "@/components/SeasonMenu";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import GoalsSlideDialog from "@/components/GoalandTargets/goalsSlide";
import { listSeason } from "@/redux/slices/season/SeasonListSlice";
import moment from "moment";
import { editSeason } from "@/redux/slices/season/SeasonEditSlice";
import CustomSnackbar from "@/components/CustomSnackbar";
import { clearUpdateState } from "@/redux/slices/season/SeasonUpdateSlice";
import { useRouter } from 'next/router';

function Page() {
  const router = useRouter();
  const { teamID } = router.query;
  const breadcrumbRoutes = [
    {
      title: "Sport",
      route: `/teams/${teamID}/goalsTargets`,
      currentPage: false,
    },
    {
      title: "Goals & Targets",
      route: `/teams/${teamID}/goalsTargets`,
      currentPage: true,
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [isGoalOpen, setIsGoalOpen] = useState(false);
  const [goalModule, setGoalModule] = useState('long-term');
  const [isEditData, setisEditData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [seasonDialogOpen, setSeasonDialogOpen] = useState(false);
  const [seasonAnchorEl, setSeasonAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const storedFilters = localStorage.getItem("goals&targetsSelectedFilters");
  const [filterData, setFilterData] = useState<any[]>(
    storedFilters && JSON.parse(storedFilters)
  );
  const dispatch: AppDispatch = useDispatch();
  const GoalsTargetslist = useSelector((state: RootState) => state.listGoalsTargets);
  const Seasonlist = useSelector((state: RootState) => state.listSeason);
  const editSeasonlist = useSelector((state: RootState) => state.editSeason);
  const editSeasonData = editSeasonlist && editSeasonlist?.data && editSeasonlist.data[0]
  const UpdateSeasonlist: any = useSelector((state: RootState) => state.updateSeason);
  const currentNav = usePathname();
  const teamId = currentNav?.split("/")[2];
  const [selectSeason, setSelectSeason] = useState<any | null>(null);
  const [seasonID, setSeasonID] = useState<any | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState<any>()
  const [snackbarValue, setSnackbarValue] = useState<any>()

  const handleClose = () => {
    setIsOpen(false);
    dispatch(clearEditState());
  };

  const handleGoalClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === 'backdropClick') {
      return;
    }
    setIsGoalOpen(false);
  };

  useEffect(() => {
    const payload = {
      sportID: Number(teamID),
      goalsAndTargetsSection: "",
      searchText: searchText !== "" ? searchText : "",
      filteredBy: Array.isArray(filterData) ? filterData.join(",") : "",
      paginationIndex: page === 0 ? 1 : page,
      paginationCount: rowsPerPage,
    };
    if(teamID){
      dispatch(listGoalsTargets({ url: "/GetGoalsAndTargetsList", payload }));
    }
    return () => {
      dispatch(clearListState());
    };
  }, [searchText, filterData, page, rowsPerPage, teamID]);

  useEffect(() => {
    const payload = {
      sportID: Number(teamID),
    };
    dispatch(listSeason({ url: "/GetSeasonList", payload }));
  }, [teamID]);

  const handleEditData = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpen(isEdit);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setAnchorEl(null);
    setFilterDialogOpen(false);
  };

  const handleSeasonClick = (event: React.MouseEvent<HTMLElement>) => {
    setSeasonAnchorEl(event.currentTarget);
    setSeasonDialogOpen(true);
  };

  const handleCloseSeasonDialog = (season: any) => {
    setSeasonAnchorEl(null);
    setSeasonDialogOpen(false);
    const startYear = season?.startDate ? moment(season.startDate, 'DD/MM/YYYY').year() : '';
    const endYear = season?.endDate ? moment(season.endDate, 'DD/MM/YYYY').year() : '';
    const data = {
      startYear,
      endYear
    }
    setSelectSeason(data);
    setSeasonID(season?.seasonID)
    if(season?.seasonID){
      const payload: any = { seasonID: season?.seasonID }
      dispatch(editSeason(payload))
    }
  };

  const handleApplyFilters = (selectedFilters: any) => {
    setFilterData(selectedFilters);
  };

  const handleGoalEdit = (e:any,name: any) => {
    e.stopPropagation()
    setGoalModule(name)
    setIsGoalOpen(true)
    setSnackbarValue(
      name === "Edit Long-term Goals"
        ? "Long-term" 
        : "Season's Main"
    );
  }

  const handleView = (name:any) => {
    setGoalModule(name)
    setIsGoalOpen(true)
  }

  useEffect(() => {
    const season = Seasonlist?.data?.[0];
    const startYear = season?.startDate ? moment(season.startDate, 'DD/MM/YYYY').year() : '';
    const endYear = season?.endDate ? moment(season.endDate, 'DD/MM/YYYY').year() : '';
    const data: any = {
      startYear,
      endYear
    }
    setSelectSeason(data)
    setSeasonID(season?.seasonID)
    if (season?.seasonID) {
      const payload: any = { seasonID: season?.seasonID }
      dispatch(editSeason(payload))
    }
  }, [Seasonlist])

  useEffect(() => {
    if (UpdateSeasonlist && UpdateSeasonlist.code === 200) {
      const payload: any = { seasonID: UpdateSeasonlist?.data?.goalsAndTargetsID }
      dispatch(editSeason(payload))
      setShowBanner(true);
      setSnackbarStatus(UpdateSeasonlist.code)
      setIsGoalOpen(false)
      setTimeout(() => {
        dispatch(clearUpdateState());
        setShowBanner(false);
      }, 3000);
    } else if (UpdateSeasonlist && UpdateSeasonlist.code === 500) {
      setShowBanner(true);
      setSnackbarStatus(UpdateSeasonlist.code)
      setIsGoalOpen(false)
      setTimeout(() => {
        dispatch(clearUpdateState());
        setShowBanner(false);
      }, 3000);
    }
  }, [UpdateSeasonlist]);

  return (
    <>
      {
        showBanner && (
          <CustomSnackbar
            message={snackbarStatus === 200 ? `${snackbarValue} Goals Updated successfully!` : 'Something went wrong'}
            severity={snackbarStatus === 200 ? 'success' : 'error'}
            open={showBanner}
            onClose={handleClose}
          />
        )
      }
      <GoalsSlideDialog
        open={isGoalOpen}
        onClose={(event: any, reason: any) => handleGoalClose(event, reason)}
        module={goalModule}
        selectSeason={selectSeason}
        seasonID={seasonID}
        editSeasonData={editSeasonData}
        setGoalModule={setGoalModule}
        setIsGoalOpen={setIsGoalOpen}
      />
      <Box p={1} className="bg-white" borderRadius={1}>
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
      </Box>
      <Grid container mt={1}>
        <Grid item xs={12}>
          <Box className="bg-white" borderRadius={1}>
            <Box display={"flex"}>
              <Typography
                width={"25%"}
                p={2}
                className="table-list-header bukra header-border-right"
              >
                Goals & Targets
              </Typography>
              <Typography
                p={2}
                width={"30%"}
                className="table-count-header dubai-med header-border-right"
              >
                {GoalsTargetslist && GoalsTargetslist?.totalRecords
                  ? GoalsTargetslist?.totalRecords
                  : 0}{" "}
                total
              </Typography>
              <Paper
                className="dubai-med header-border-right"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "none",
                  width: "30%",
                  borderRadius: "0",
                }}
              >
                <SearchIcon color="secondary" />
                <InputBase
                  className="dubai-med"
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search by Goal, Status.."
                  inputProps={{ "aria-label": "Search by Goal, Status.." }}
                  onChange={(event) => {
                    setSearchText(event.target.value);
                  }}
                />
              </Paper>
              <Button
                variant="text"
                className="dubai-med text-capitalize header-border-right"
                sx={{ width: "15%", borderRadius: "0" }}
                color="secondary"
                endIcon={<FilterListIcon />}
                onClick={handleFilterClick}
              >
                Filters
              </Button>
              <FilterDialog
                anchorEl={anchorEl}
                options={["In Progress", "Not Started", "Completed"]}
                open={filterDialogOpen}
                onClose={handleCloseFilterDialog}
                onApply={handleApplyFilters}
                localStorageKey="goalstargetsSelectedFilters"
              />
              <Button
                variant="text"
                className="dubai-med text-capitalize header-border-right"
                sx={{
                  width: "15%",
                  borderRadius: "0",
                  borderTopRightRadius: "4px",
                }}
                endIcon={<AddIcon />}
                onClick={handleSeasonClick}
              >
                Season {`${selectSeason?.startYear} - ${selectSeason?.endYear}`}
              </Button>
              <SeasonMenu
                seasonAnchorEl={seasonAnchorEl}
                seasonDialogOpen={seasonDialogOpen}
                handleCloseSeasonDialog={handleCloseSeasonDialog}
                Seasonlist={Seasonlist?.data}
              />
              {isOpen && isEditData && (
                <Edit open={isOpen} onClose={handleClose} id={isEditData} />
              )}
            </Box>
            {GoalsTargetslist.loading ? (
              <Box
                height={"74vh"}
                p={2}
                display={"grid"}
                sx={{ placeContent: "center", alignContent: "center" }}
              >
                <CircularProgress sx={{ color: "#008755" }} />
              </Box>
            ) : GoalsTargetslist && !GoalsTargetslist.error ? (
              <Box
                p={2}
                sx={{
                  height: {
                    xs: "71vh",
                    xl: "74.8vh",
                  },
                  overflowX: "auto",
                }}
              >
                <Grid container columnSpacing={2}>
                  <Grid item md={6}>
                    <Box
                      sx={{
                        border: "1px solid #008755",
                        borderRadius: "8px",
                        cursor:'pointer'
                      }}
                      onClick={() =>handleView("View Long-term Goals")}
                    >
                      <Box
                        px={3}
                        py={1.5}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        sx={{
                          backgroundColor: "#008755",
                          borderTopLeftRadius: "8px",
                          borderTopRightRadius: "8px",
                        }}
                      >
                        <Typography className="bukra tertiary-color">
                          Long-term Goals
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditOutlinedIcon />}
                          sx={{
                            color: "white",
                            borderColor: "white",
                            height: "32px",
                          }}
                          className="text-capitalize"
                          onClick={(e) => handleGoalEdit(e,"Edit Long-term Goals")}
                        >
                          Edit
                        </Button>
                      </Box>
                      <Box
                        p={3}
                        height={"162px"}
                        className="dubai-med"
                        sx={{
                          background: "linear-gradient(#EDFFFC, #FFFFFF)",
                          borderBottomLeftRadius: "8px",
                          borderBottomRightRadius: "8px",
                        }}
                      >
                        { editSeasonData?.longTermGoals}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item md={6}>
                    <Box
                      sx={{
                        border: "1px solid #008755",
                        borderRadius: "8px",
                        cursor:'pointer'
                      }}
                      onClick={() =>handleView("View Season's Main Goal")}
                    >
                      <Box
                        px={3}
                        py={1.5}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        sx={{
                          backgroundColor: "#008755",
                          borderTopLeftRadius: "8px",
                          borderTopRightRadius: "8px",
                        }}
                      >
                        <Typography className="bukra tertiary-color">
                          Season's Main Goal
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditOutlinedIcon />}
                          sx={{
                            color: "white",
                            borderColor: "white",
                            height: "32px",
                          }}
                          className="text-capitalize"
                          onClick={(e) => handleGoalEdit(e, "Edit Season's Main Goal")}
                        >
                          Edit
                        </Button>
                      </Box>
                      <Box
                        p={3}
                        height={"162px"}
                        className="dubai-med"
                        sx={{
                          background: "linear-gradient(#EDFFFC, #FFFFFF)",
                          borderBottomLeftRadius: "8px",
                          borderBottomRightRadius: "8px",
                        }}
                      >
                        {editSeasonData?.seasonsMainGoal}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                <TeamsTable
                  data={GoalsTargetslist.data}
                  isEdit={handleEditData}
                  teamId={teamId}
                  setPage={setPage} page={page}
                  setRowsPerPage={setRowsPerPage} rowsPerPage={rowsPerPage}
                  GoalsTargetslist={GoalsTargetslist}
                />
              </Box>
            ) : (
              <Box>
                <Alert severity="error">
                  Failed to load the data. Please try again later.
                </Alert>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;