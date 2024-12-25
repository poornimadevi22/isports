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
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from 'next/router';
import {
  Avatar,
  Box,
  CircularProgress,
  MenuItem,
  Select,
  TablePagination,
  Typography,
} from "@mui/material";
import { getPerformanceLevel, getRoleColor } from "@/utils/constants";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PaginationComponent from "@/components/PaginationComponent";
import DeleteDialog from "@/components/Fields/DeleteDialog";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  clearDeleteState,
  deleteAthleteById,
} from "@/redux/slices/athlete/athleteDeleteSlice";
import {
  getAthleteListAPI,
} from "@/redux/slices/athlete/getAthleteListSlice";
import { getLocalStorage } from "@/utils/helper";

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
  module?: string
  setPage: any;
  page: any;
  setRowsPerPage: any;
  rowsPerPage: any;
  isLoading: any;
  isDisable?:any
}
const TeamsTable: React.FC<TeamsTableProps> = ({ data, isEdit, module, isLoading,isDisable }) => {
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const athleteDelete = useSelector((state: RootState) => state.deleteAthlete);

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

  // Calculate pagination
  const startIndex = (page - 1) * rowsPerPage + 1;
  const endIndex = startIndex + rowsPerPage - 1;
  const router = useRouter();
  const { teamID } = router.query;

  return (
    <Paper>
      {isLoading.loading ? (
        <Box
          display={"grid"}
          sx={{
            placeContent: "center",
            alignContent: "center",
            height: {
              xs: "58vh",
              xl: "65.5vh",
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
            xl: "65.5vh",
          },
          overflowX: "auto",
        }}
      >
        <Table stickyHeader aria-label="team table">
          <TableHead>
            <TableRow>
              {[
                "Name",
                "Date of Birth",
                "Email",
                "Performance Level",
                "Actions",
              ].map((header) => (
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
              data.map((row: any) => (
                <TableRow
                  key={row.name}
                  sx={{
                    "&:nth-of-type(even)": { backgroundColor: "#EDFFFC" },
                  }}
                >
                  <TableCell sx={{ display: 'flex', alignItems: 'center', p:1.25 }}>
                    <Avatar
                      alt={row.name}
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
                  className="dubai-med"
                    >
                      {/* {row.name} */}
                      {`${row.firstName} ${row.middleName} ${row.surName}`}
                    </Typography>
                  </TableCell>
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
                  <TableCell sx={{ whiteSpace: "nowrap", p:1.25 }}>
                    <IconButton
                      aria-label="view"
                      size="small"
                      sx={{ width: "16px", height: "16px", color: "#05868E" }}
                    >
                      <VisibilityIcon
                        onClick={() => {
                          router.push(`/teams/${teamID}/athletes/view/${row.athleteID}`);
                        }}
                      />
                    </IconButton>
                    <IconButton
                      aria-label="edit"
                      size="small"
                      sx={{ width: "16px", height: "16px", mx: 1, color: "#05868E" }}
                      onClick={() => isEdit(row.athleteID)}
                    >
                      <EditIcon />
                    </IconButton>
                    <DeleteDialog
                      data={row}
                      dispatchDelete={deleteAthleteById}
                      deleteResponse={athleteDelete}
                      clearDelete={clearDeleteState}
                      module={"athleteID"}
                      dispatchList={getAthleteListAPI}
                      title={"Athlete"}
                      getCurrentSport={teamID}
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
          endIndex={endIndex > isLoading?.totalRecords ? isLoading?.totalRecords: endIndex}
          totalItems={isLoading?.totalRecords}
          isDisable={isDisable}
        />
      </TableContainer>)}
    </Paper>
  );
};

export default TeamsTable;