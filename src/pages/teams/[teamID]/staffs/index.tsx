"use client";
import BasicBreadcrumbs from "@/components/breadcrumbs";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Skeleton,
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
import { useRouter } from "next/router";
import TeamsTable from "@/components/tables/teamsTable";
import FilterDialog from "@/components/FilterDialog";
import SubMenuLayout from "./layout";
import { viewStaff, clearListState } from "@/redux/slices/staff/staffListSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import { filterBySearchTerm, getLocalStorage, setLocalStorage } from "@/utils/helper";
import XlsSVG from "../../../../../public/XlsSVG.svg";
import * as XLSX from 'xlsx';
import _, { isEqual } from "lodash";
import axios from "axios";

function Page() {
  const router = useRouter();
  const { teamID } = router.query; // teamID is sportID

  const breadcrumbRoutes = [
    {
      title: "Sports",
      route: `/teams/${teamID}/staffs`,
      currentPage: false,
    },
    {
      title: "Staffs",
      route: `/teams/${teamID}/staffs`,
      currentPage: true,
    },
  ];

  const label: any = ["Contract Start Date", "Contract End Date"];
  const [isOpen, setIsOpen] = useState(false);
  const [closeConfirmed, setCloseConfirmed] = useState(false);
  const [excel, setExcel] = useState(false);
  const [isEditData, setisEditData] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState<"grid" | "list" | null>(
    "grid"
  );
  const [searchText, setSearchText] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const storedFilters = localStorage.getItem('staffSelectedFilters');
  const [filterData, setFilterData] = useState<any[]>(storedFilters &&
    (JSON.parse(storedFilters))
  );
  const dispatch: AppDispatch = useDispatch();
  const staffList = useSelector((state: RootState) => state.staffList);
  const isEdit = useSelector((state: any) => {
    return state.ui.isUpdated;
  });
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  // const filterOptions = getLocalStorage('getRole') &&  JSON.parse(getLocalStorage('getRole') || '[]');
  const rolesListData = useSelector((state: RootState) => state.rolesList);
  const filterOptions = _(rolesListData.data)
    .filter({ moduleName: "Staff" })
    .map('roleName')
    .value();
  const handleCloseConfirmation = () => {
    setCloseConfirmed(false);
    setIsOpen(false);
  }

  // const handleClose = () => setIsOpen(false);
  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    // Prevent the drawer from closing when the click away or backdrop event is triggered
    if (reason === 'backdropClick') {
      return;
    }
    setIsOpen(false);
    // setCloseConfirmed(true);
  };
  const handleIconClick = useCallback(
    (icon: any) => {
      if (selectedIcon !== icon) {
        setSelectedIcon(icon);
      }
    },
    [selectedIcon]
  );

  useEffect(() => {
    if (selectedIcon === "grid") {
      const payload = {
        searchText: "",
        filteredBy: Array.isArray(filterData) && !isEqual(filterData, filterOptions) ? filterData.join(",") : "",
        "paginationIndex": 0,
        "paginationCount": 0,
        "sportID": Number(teamID),
      };
      dispatch(viewStaff({ url: "/GetStaffsList", payload }));
    } else {
      const payload = {
        searchText: "",
        filteredBy: Array.isArray(filterData) && !isEqual(filterData, filterOptions) ? filterData.join(",") : "",
        "paginationIndex": page,
        "paginationCount": rowsPerPage,
        "sportID": Number(teamID),
      };
      dispatch(viewStaff({ url: "/GetStaffsList", payload }));
    }
    return () => {
      dispatch(clearListState());
    };
  }, [filterData, page, rowsPerPage, selectedIcon, teamID]);

  useEffect(() => {
    const payload = {
      searchText: "",
      filteredBy: "",
      paginationIndex: 0,
      paginationCount: 100,
      sportID: Number(teamID),
    };
    if (isEdit) {
      dispatch(viewStaff({ url: "/GetStaffsList", payload }));
      dispatch(isUpdatedFunc(false));
    }
  }, [isEdit]);

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
  const handleApplyFilters = (selectedFilters: any) => {
    setFilterData(selectedFilters);
  };


  const downloadExcel = async () => {
    try {
      const response = await axios.post(
        `${process.env.API_BASE_URL}/Sports/ExportStaffList`,
        {
          sportID: Number(teamID),
          searchText: "",
          filteredBy: Array.isArray(filterData) && !isEqual(filterData, filterOptions) ? filterData.join(",") : "",
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
      link.setAttribute("download", "StaffList.xlsx");
      document.body.appendChild(link);
      link.click();

      // Clean up
      if (link.parentNode) link.parentNode.removeChild(link);
    } catch (error) {
      console.error("An error occurred while downloading the Excel file:", error);
      alert("Failed to download the file. Please try again later.");
    }
  };

  interface CustomIconButtonProps {
    icon: React.ElementType; // The icon component
    isSelected: boolean; // Whether the icon is selected
    onClick: () => void; // Click handler function
  }

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
    // disabled={isEmpty(filteredList) || filteredList.length < 10}
    >
      <Icon width={24} height={24} fill="#fff" color={"#fff"} />
    </IconButton>
  );
  const filteredList = filterBySearchTerm(staffList.data, searchText, ['firstName', 'role', 'personalEmail', 'rank']);
  const tableHeaders = [
                  "Name",
                  "Role",
                  "Email",
                  "Contract Start Date",
                  "Contract End Date",
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
            width={"10%"}
            p={2}
            className="table-list-header bukra header-border-right"
          >
            All Staff
          </Typography>
          <Typography
            p={2}
            width={"30%"}
            className="table-count-header dubai-med header-border-right"
          >
            {filteredList && filteredList.length !== 0 ? filteredList.length : 0} Staffs
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
          {!isEmpty(filterOptions) && <FilterDialog
            anchorEl={anchorEl}
            options={filterOptions}
            open={filterDialogOpen}
            onClose={handleCloseFilterDialog}
            onApply={handleApplyFilters}
            localStorageKey="staffSelectedFilters"
          />}
          <Button
            variant="contained"
            className="dubai-med text-capitalize"
            sx={{
              width: "15%",
              borderRadius: "0",
              borderTopRightRadius: "4px",
              fontSize: '20px',
            }}
            endIcon={<AddIcon />}
            onClick={() => router.push(`/teams/${teamID}/staffs/addStaff`)}
          >
            Add Staff
          </Button>
          {isOpen && isEditData && (
            <SlideDialog
              open={isOpen}
              onClose={(event: any, reason: any) => handleClose(event, reason)}
              id={isEditData}
              module="staff"
            />
          )}
        </Box>
        <Box
          display="flex"
          justifyContent="flex-end"
          p={1}
          py={2}
          pb={selectedIcon === "grid" ? 0 : 2}
          flexDirection={"row"}
          alignItems={"center"}
        >
          {selectedIcon === "list" ? (
            <Button variant="outlined"
              disabled={!filteredList?.length || excel}
              onClick={downloadExcel}
              className="text-capitalize dubai-med export-button"
              sx={{ mr: 2, borderRadius: "43px", height: '44px' }}
              startIcon={<XlsSVG width="25px" height="25px" />}>
              {'Export to Excel'}
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
        {staffList && staffList.code !== 500 ? (
          selectedIcon === "list" ? (
            <Box p={2} pt={0}>
              {staffList && (
                <TeamsTable data={filteredList || []} isEdit={handleEditData}
                  setPage={setPage} page={page}
                  setRowsPerPage={setRowsPerPage} rowsPerPage={rowsPerPage}
                  dataList={staffList}
                  isLoading={staffList.loading}
                  isDisable={filteredList.length < 10}
                  module="staff"
                  headers={tableHeaders}
                />
              )}
            </Box>
          ) : (
            <Box>
              <CardView
                data={filteredList || []}
                isEdit={handleEditData}
                isLoading={staffList.loading}
                label={label}
                module="staff"
                setPage={setPage}
                page={page}
                setRowsPerPage={setRowsPerPage}
                rowsPerPage={rowsPerPage}
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
        module="staff"
        closeConfirm={handleCloseConfirmation}
      /> */}
    </>
  );
}
Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;
