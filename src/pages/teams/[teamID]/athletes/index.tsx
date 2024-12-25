"use client";
import BasicBreadcrumbs from "@/components/breadcrumbs";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import SlideDialog from "@/components/SlideDialog";
import CardViewIcon from "@mui/icons-material/GridView";
import TableViewIcon from "../../../../../public/svg/TableView.svg";
import CardView from "@/components/CardView";
import isEmpty from "lodash/isEmpty";
import XlsSVG from "../../../../../public/XlsSVG.svg";
import { useRouter } from 'next/router';
import TeamsTable from "@/components/tables/teamsTable";
import FilterDialog from "@/components/FilterDialog";
import SubMenuLayout from "./layout";
import {
  clearGetAthletesListState,
  getAthleteListAPI,
} from "@/redux/slices/athlete/getAthleteListSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAthleteListDispatch } from "@/redux/store";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import { filterBySearchTerm, getLocalStorage } from "@/utils/helper";
import { isEqual } from "lodash";
import axios from "axios";

function Page() {
  const router = useRouter();
  const { teamID } = router.query;
  const breadcrumbRoutes = [
    {
      title: "Sports",
      route: `/teams/${teamID}/athletes`,
      currentPage: false,
    },
    {
      title: "Athletes",
      route: `/teams/${teamID}/athletes`,
      currentPage: true,
    },
  ];
  const dispatch: getAthleteListDispatch = useDispatch();
  const getAthleteList = useSelector((state: any) => {
    return state.getAthleteList;
  });
  const isEdit = useSelector((state: any) => {
    return state.ui.isUpdated;
  });

  const label: any = ["Age", "Role in Team"];
  const [isOpen, setIsOpen] = useState(false);
  const [isEditData, setisEditData] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState<"grid" | "list" | null>(
    "grid"
  );
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = useState("");
  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === 'backdropClick') {
      return;
    }
    setIsOpen(false);
  };
  const storedFilters = localStorage.getItem('athletesTargetsSelectedFilters');
  const [filterData, setFilterData] = useState<any[]>(storedFilters &&
    (JSON.parse(storedFilters))
  );
  const handleIconClick = useCallback(
    (icon: any) => {
      if (selectedIcon !== icon) {
        setSelectedIcon(icon);
      }
    },
    [selectedIcon]
  );

  useEffect(() => {
    if (selectedIcon === "grid" && teamID) {
      const payload = {
        searchText: "",
        filteredBy: !isEmpty(filterData) && filterData.length !== 3 ? Array.isArray(filterData) && filterData.join(",") : "",
        "paginationIndex": 0,
        "paginationCount": 0,
        "sportID": Number(teamID),
      };
      dispatch(getAthleteListAPI(payload));
    } else if(teamID){
      const payload = {
        searchText: "",
        filteredBy: !isEmpty(filterData) && filterData.length !== 3 ? Array.isArray(filterData) && filterData.join(",") : "",
        "paginationIndex": page,
        "paginationCount": rowsPerPage,
        "sportID": Number(teamID),
      };
      dispatch(getAthleteListAPI(payload));
    }
    return () => {
      dispatch(clearGetAthletesListState());
    };
  }, [teamID, selectedIcon, page, rowsPerPage, filterData]);

  useEffect(() => {
    const payload = {
      searchText: "",
      filteredBy: "",
      "paginationIndex": 1,
      "paginationCount": 100,
      sportID: Number(teamID),
    };
    if (isEdit) {
      dispatch(getAthleteListAPI(payload));
      dispatch(isUpdatedFunc(false));
    }
  }, [isEdit]);

  const handleEditData = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpen(isEdit);
  };

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setAnchorEl(null);

    setFilterDialogOpen(false);
  };
  const handleApplyFilters = (selectedFilters: any) => {
    // Here you can apply your filtering logic
    setFilterData(selectedFilters);
  };

  const downloadAthletesExcel = async () => {
    try {
      const response = await axios.post(
        `${process.env.API_BASE_URL}/Sports/ExportAthletesList`,
        {
          sportID: Number(teamID),
          searchText: "",
          // filteredBy: Array.isArray(filterData) && !isEqual(filterData, filterOptions) ? filterData.join(",") : "",
          filteredBy: "",
          paginationIndex: 0,
          paginationCount: 0,
        },
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "AthletesList.xlsx");
      document.body.appendChild(link);
      link.click();

      // Clean up
      if (link.parentNode) link.parentNode.removeChild(link);
    } catch (error) {
      console.error("An error occurred while downloading the Excel file:", error);
    }
  };

  interface CustomIconButtonProps {
    icon: React.ElementType; // The icon component
    isSelected: boolean; // Whether the icon is selected
    onClick: () => void; // Click handler function
  }

  // Reusable IconButton component
  const CustomIconButton: React.FC<CustomIconButtonProps> = ({
    icon: Icon,
    isSelected,
    onClick,
  }) => (
    <IconButton
      onClick={onClick}
      disableRipple // Disable the ripple effect
      sx={{
        backgroundColor: isSelected ? "rgb(0 135 85)" : "white",
        color: isSelected ? "white" : "rgb(0 135 85)",
        border: isSelected ? "none" : "2px solid #0087554D",
        width: "40px", // Set width for a square shape
        height: "40px", // Set height for a square shape
        borderRadius: "4px", // Set border radius to 2px
        transition: "none", // Disable any CSS transitions
        marginRight: 1, // Margin only for the first button
      }}
      disabled={isEmpty(filteredList)|| searchText !== '' && selectedIcon !== 'list' }
    >
      <Icon width={24} height={24} fill="#fff" color={"#fff"} />
    </IconButton>
  );
  const filteredList = filterBySearchTerm(getAthleteList.data, searchText, ['firstName','middleName', 'performanceLevel', 'personalEmail', 'role', 'rank']);
  const tableHeaders = [
    "Name",
    "Date of Birth",
    "Email",
    "Performance Level",
    "Actions",
]
  return (
    <>
      <Box p={1} className="bg-white" borderRadius={1}>
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
      </Box>
      <Box mt={0.5} className="bg-white" borderRadius={1}>
        <Box display={"flex"}>
          <Typography
            width={"15%"}
            p={2}
            className="table-list-header bukra header-border-right"
          >
            All Athlete
          </Typography>
          <Typography
            p={2}
            width={"30%"}
            className="table-count-header dubai-med header-border-right"
          >
            {!isEmpty(getAthleteList) && getAthleteList.totalRecords} Athletes
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
            <SearchIcon color="secondary" sx={{ width: '24px', height: '24px' }} />
            <InputBase
              className="dubai-med"
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search by Name, Role, etc..."
              inputProps={{ "aria-label": "Search by Name, Role, etc..." }}
              onChange={(event) => {
                setSearchText(event.target.value);
              }} // Extract value from the event
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
            options={["Beginner", "Intermediate", "Professional"]}
            open={filterDialogOpen}
            onClose={handleCloseFilterDialog}
            onApply={handleApplyFilters}
            localStorageKey="athletesTargetsSelectedFilters"
          />
          <Button
            variant="contained"
            className="dubai-med text-capitalize"
            sx={{
              width: "20%",
              borderRadius: "0",
              borderTopRightRadius: "4px",
              fontSize: '20px',
            }}
            endIcon={<AddIcon />}
            onClick={() => router.push(`/teams/${teamID}/athletes/add`)}
          >
            Add Athlete
          </Button>
          {isOpen && isEditData && (
            <SlideDialog
              open={isOpen}
              onClose={(event: any, reason: any) => handleClose(event, reason)}
              id={isEditData}
              module={"athlete"}
            />
          )}
        </Box>
        <Box
          display="flex"
          justifyContent="flex-end"
          p={1}
          py={2}
          pb={selectedIcon === "grid" ? 0 : 2}
          // alignSelf={'center'}
          flexDirection={"row"}
          alignItems={"center"}
        >
          {selectedIcon === "list" ? (
            <Button
              variant="outlined"
              className="text-capitalize dubai-med export-button"
              sx={{ mr: 2, borderRadius: "43px", height: '44px' }}
              startIcon={<XlsSVG width="25px" height="25px" />}
              disabled={searchText !== '' && selectedIcon !== 'list'} 
              // disabled={isEmpty(filteredList) || isEmpty(getAthleteList.data)} 
              onClick={downloadAthletesExcel}
            >
              Export to Excel
            </Button>
          ) : null}
          <CustomIconButton
            icon={CardViewIcon}
            isSelected={selectedIcon === "grid"}
            onClick={() => handleIconClick("grid")}
          />
          <CustomIconButton
            icon={TableViewIcon}
            isSelected={selectedIcon === "list"}
            onClick={() => handleIconClick("list")}
          />
        </Box>

        {/* {dummyData && selectedIcon === "list" ? ( */}
        {getAthleteList && getAthleteList.code !== 500 ? (
          selectedIcon === "list" ? (
            <Box p={2} pt={0}>
                 {getAthleteList && (
              <TeamsTable
                data={filteredList || []}
                isEdit={handleEditData}
                module="athlete"
                isLoading={getAthleteList.loading}
                setPage={setPage} page={page}
                setRowsPerPage={setRowsPerPage} rowsPerPage={rowsPerPage}
                isDisable={getAthleteList.totalRecords < 10 || isEmpty(getAthleteList.data) || searchText !== '' ||  filterData.length !== 0}
                dataList={getAthleteList}
                headers={tableHeaders}
              />
                 )}
            </Box>
          ) : (
            <Box>
              {/* <CardView data={dummyData} isEdit={handleEditData} isLoading={loading} /></Box> */}
              <CardView
                data={filteredList || []}
                isEdit={handleEditData}
                isLoading={getAthleteList.loading}
                label={label}
                module="athlete"
              />
            </Box>
          )
        ) : (
          <Box p={3}>
            <Alert severity="error">Something went wrong</Alert>
          </Box>
        )}
      </Box>
      {/* <CloseConfirmationDialog
        open={closeConfirmed}
        setOpen={setCloseConfirmed}
        module="athlete"
        closeConfirm={handleCloseConfirmation}
      /> */}
    </>
  );
}
Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;