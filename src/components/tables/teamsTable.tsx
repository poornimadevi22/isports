import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  CircularProgress,
  MenuItem,
  Select,
  TablePagination,
  useTheme,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { getPerformanceLevel, getRoleColor } from "@/utils/constants";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PaginationComponent from "@/components/PaginationComponent";
import DeleteDialog from "@/components/Fields/DeleteDialog";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCustomerById,
  clearDeleteState,
} from "@/redux/slices/staff/staffDeleteSlice";
import { viewStaff } from "@/redux/slices/staff/staffListSlice";
import { isEmpty } from "lodash";
import { getLocalStorage } from "@/utils/helper";
import { deleteAthleteById } from "@/redux/slices/athlete/athleteDeleteSlice";
import { getAthleteListAPI } from "@/redux/slices/athlete/getAthleteListSlice";

interface RowData {
  name: string;
  role: string;
  gender?: string;
  dob?: string;
  nationality?: string;
  email?: string;
  rank?: string;
  staffID: string;
  profileImage: string;
}

// Define props for the TeamsTable component
interface TeamsTableProps {
  data: RowData[]; // Array of RowData objects
  isEdit: (id: string) => void; // Function type for handling edit action
  setPage: any;
  page: any;
  setRowsPerPage: any;
  rowsPerPage: any;
  dataList: any;
  isLoading: any;
  isDisable:boolean;
  module:string;
  headers?:any

}
const TeamsTable: React.FC<TeamsTableProps> = ({
  data,
  isEdit,
  setPage,
  page,
  setRowsPerPage,
  rowsPerPage,
  dataList,
  isLoading,
  isDisable,
  module,
  headers
}) => {
  const staffDelete = useSelector((state: RootState) => state.deleteStaff);
  const theme = useTheme();
  const is2K = useMediaQuery(theme.breakpoints.up("xl"));

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };
  const startIndex = (page - 1) * rowsPerPage + 1;
  const endIndex = startIndex + rowsPerPage - 1;
  const router = useRouter();
  const getCurrentSport = getLocalStorage("sport"); 
  // const viewNav = module === 'staff' ? `/teams/${getCurrentSport}/staffs/view/${row.staffID}` : `/teams/${getCurrentSport}/athletes/view/${row.athleteID}`
  const athleteDelete = useSelector((state: RootState) => state.deleteAthlete);
  return (
    <Paper>
      {isLoading ? (
        <Box
          display={"grid"}
          sx={{
            placeContent: "center",
            alignContent: "center",
            height: {
              xs: "58vh",
              xl: "59vh",
              is2K:"65.5vh"
            },
            backgroundColor: "#FFFFFF",
          }}
        >
          <CircularProgress sx={{ color: "#008755" }} size="40px" />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            height: {
              xs: "58vh",
              xl: "59vh",
              is2K:"65.5vh"
            },
            overflowX: "auto",
          }}
        >
          <Table stickyHeader aria-label="team table">
            <TableHead>
              <TableRow>
                {headers.map((header:any) => (
                  <TableCell
                    key={header}
                    align={header === "Name" ? "center" : "left"}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontWeight: "bold",
                      width:
                        header === "Name"
                          ? "240px"
                          : header === "Role"
                          ? "97px"
                          : header === "Actions"
                          ? "60px"
                          : "164px",
                      p:1.25
                    }}
                    className="bukra"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.map((row: any, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:nth-of-type(even)": { backgroundColor: "#EDFFFC" },
                    }}
                  >
                      <TableCell sx={{ display: "flex", alignItems: "center",p:1.25 }}>
                      <Avatar
                        alt={row.firstName}
                        src={row.profileImage}
                        sx={{ width: 40, height: 40 }}
                      />
                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "24px",
                          color: "rgba(88, 88, 91, 1)",
                          ml: 2,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: "200px",
                        }}
                        className="dubai-med text-capitalize"
                      >
                        {`${row.rank} ${row.firstName} ${row.middleName} ${row.surName}`}
                      </Typography>
                    </TableCell>
                  {module === 'staff' ?  <TableCell sx={{p:1.25}}>
                      <Chip
                        label={row.role}
                        sx={{
                          fontWeight: 400,
                          fontSize: "16px",
                          color: "#fff",
                          backgroundColor: getRoleColor(row.role).color,
                          ".MuiChip-label": {
                            padding: "12px"
                          },
                        }}
                        className="dubai-med text-capitalize"
                      />
                    </TableCell>
                  :
                  <TableCell sx={{p:1.25}}>
                  <Typography
                   sx={{
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "rgba(141, 144, 147, 1)",
                  }}
                  className="dubai-med"
                  >
                    {row.dob || "--"}
                  </Typography>
                </TableCell>  
                  
                  }
                    <TableCell sx={{p:1.25}}>
                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "24px",
                          color: "rgba(141, 144, 147, 1)",
                        }}
                        className="dubai-med"
                      >
                        {row.personalEmail || "--"}
                      </Typography>
                    </TableCell>
                 {module === 'staff' &&    <TableCell sx={{p:1.25}}>
                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "24px",
                          color: "rgba(141, 144, 147, 1)",
                        }}
                        className="dubai-med"
                      >
                        {row.contractStartDate || "--"}
                      </Typography>
                    </TableCell>}
               { module === 'staff' &&    <TableCell sx={{p:1.25}}>
                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "24px",
                          color: "rgba(141, 144, 147, 1)",
                        }}
                        className="dubai-med"
                      >
                        {row.contractEndDate || "--"}
                      </Typography>
                    </TableCell>}
                    {module !== 'staff' &&   
                    <TableCell sx={{p:1.25}}>
                    <Chip
                      label={row.performanceLevel}
                      sx={{
                        fontWeight: 400,
                        fontSize: "16px",
                        color: "#fff",
                        backgroundColor: getPerformanceLevel(row.performanceLevel).color,
                        ".MuiChip-label": {
                          padding: "12px"
                        },
                      }}
                      className="dubai-med"
                    />
                  </TableCell>
}
                    <TableCell sx={{ whiteSpace: "nowrap", p:1.25 }}>
                      <IconButton
                        aria-label="view"
                        sx={{ width: "16px", height: "16px" }}
                      >
                        <VisibilityIcon
                          onClick={() => {
                            router.push(
                             module === 'staff' ? `/teams/${getCurrentSport}/staffs/view/${row.staffID}` : `/teams/${getCurrentSport}/athletes/view/${row.athleteID}`
                            );
                          }}
                          sx={{ color: "#05868E" }}
                        />
                      </IconButton>
                      <IconButton
                        aria-label="edit"
                        size="small"
                        onClick={() => isEdit(module === 'staff' ?  row.staffID : row.athleteID)}
                        sx={{
                          width: "16px",
                          height: "16px",
                          mx: 1,
                          color: "#05868E",
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <DeleteDialog
                        data={row}
                        dispatchDelete={module === 'staff' ? deleteCustomerById : deleteAthleteById}
                        deleteResponse={module === 'staff' ? staffDelete : athleteDelete}
                        clearDelete={module === 'staff' ? clearDeleteState : clearDeleteState }
                        module={module === 'staff' ? "staffID" : 'athleteID'}
                        dispatchList={module === 'staff' ? viewStaff : getAthleteListAPI}
                        title={module === 'staff' ? "Staff" : 'Athlete'}
                        listUrl={module === 'staff' && "/GetStaffsList"}
                        getCurrentSport={getCurrentSport}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <PaginationComponent
            rowsPerPage={rowsPerPage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            page={page}
            handleChangePage={handleChangePage}
            startIndex={startIndex}
            endIndex={endIndex > dataList?.totalRecords ? dataList?.totalRecords: endIndex}
            totalItems={dataList?.totalRecords}
            isDisable={isDisable}
          />
        </TableContainer>
      )}
    </Paper>
  );
};

export default TeamsTable;