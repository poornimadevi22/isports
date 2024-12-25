import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/navigation";
import { Avatar, Box, Button, Chip, CircularProgress, Typography } from "@mui/material";
import PaginationComponent from "@/components/PaginationComponent";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  deleteGoalsTargetsById,
  clearDeleteState,
} from "@/redux/slices/goalsTargets/goalsTargetsDeleteSlice";
import { listGoalsTargets } from "@/redux/slices/goalsTargets/goalsTargetsListSlice";
import ReusableDeleteDialog from "@/components/Fields/ReusableDeleteDialog";
import AddIcon from "@mui/icons-material/Add";
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

interface GoalsTargetsProps {
  data: RowData[]; // Array of RowData objects
  isEdit: (id: string) => void; // Function type for handling edit action
  teamId?: any;
  setPage: any;
  page: any;
  setRowsPerPage: any;
  rowsPerPage: any;
  GoalsTargetslist: any;
}
const GoalsTargets: React.FC<GoalsTargetsProps> = ({
  data,
  isEdit,
  teamId,
  setPage,
  page,
  setRowsPerPage,
  rowsPerPage,
  GoalsTargetslist,
}) => {
  const getCurrentSport = getLocalStorage("sport");
  const dispatch: AppDispatch = useDispatch();
  const goalsTargetsDelete = useSelector(
    (state: RootState) => state.deleteGoalsTargets
  );

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

  return (
    <>
    {GoalsTargetslist.loading ? (
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
    ) :
    <Box
      sx={{
        mt: 2,
        borderRadius: "8px",
        border: "1px solid rgba(88, 88, 91, 0.2)",
      }}
    >
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        borderBottom={"1px solid rgba(88, 88, 91, 0.2)"}
      >
        <Typography className="bukra" p={2}>
          Individual Goals
        </Typography>
        <Button
          variant="contained"
          className="dubai-med text-capitalize"
          sx={{
            borderRadius: "0",
            borderTopRightRadius: "4px",
            height: "56px",
            fontSize:'20px',
          }}
          endIcon={<AddIcon />}
          onClick={() => {
            router.push(`/teams/${teamId}/goalsTargets/addGoalsTargets`);
          }}
        >
          Create Individual Goals
        </Button>
      </Box>
      <TableContainer>
        <Table stickyHeader aria-label="team table">
          <TableHead>
            <TableRow>
              {[
                "Name",
                "Goal",
                "Start Date",
                "End Date",
                "Status",
                "Actions",
              ].map((header) => (
                <TableCell
                  key={header}
                  align={"left"}
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontWeight: "bold",
                    width:
                        header === "Name"
                          ? "240px"
                          : header === "Status"
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
            {!_.isEmpty(data) &&
              data.map((row: any, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:nth-of-type(odd)": { backgroundColor: "#EDFFFC" },
                  }}
                >
                  <TableCell sx={{display:'flex', alignItems:'center', p:1.25}}>
                    <Avatar
                      alt={row.athleteProfileImage}
                      src={row.athleteProfileImage}
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
                        width: "240px",
                      }}
                      className="dubai-med text-capitalize"
                    >
                      {`${row.athleteFirstName} ${row.athleteMiddleName} ${row.athleteSurName}`}
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
                    className="dubai-med text-capitalize"
                    >
                      {row.goalName || "--"}
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
                      {row.startDate || "--"}
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
                      {row.endDate || "--"}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 400,
                      fontSize: "16px",
                      lineHeight: "24px",
                      color: "rgba(141, 144, 147, 1)",
                      p:1.25
                    }}
                    className="dubai-med"
                  >
                    <Chip label={row.status || "--"} sx={ row.status=== "In Progress" ? {color:'#00205B', backgroundColor:'#E5EEFF'}: row.status=== "Not Started" ? {color:'#E4002B', backgroundColor:'#FFE5EA'}: row.status==="Completed" ? {color:'#008755', backgroundColor:'#E5FFF6'}:{}}/>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap", p:1.25 }}>
                    <IconButton
                      aria-label="view"
                      size="small"
                      sx={{ width: "16px", height: "16px" }}
                    >
                      <VisibilityIcon
                        onClick={() => {
                          router.push(
                            `/teams/${getCurrentSport}/goalsTargets/view/` +
                              row.goalsAndTargetsID
                          );
                        }}
                        sx={{ color: "#05868E" }}
                      />
                    </IconButton>
                    <IconButton
                      aria-label="edit"
                      size="small"
                      onClick={() => isEdit(row.goalsAndTargetsID)}
                      sx={{
                        width: "16px",
                        height: "16px",
                        mx: 1,
                        color: "#05868E",
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <ReusableDeleteDialog
                      title={`Delete Goals & Targets`}
                      confirmationMessage="Are you sure, Do you want to delete?"
                      successMessage="Goals Deleted Successfully"
                      name={row.goalName}
                      icon={<DeleteIcon />}
                      revertMessage={`once is deleted, you can not revert.`}
                      deleteAction={(payload: any) =>
                        dispatch(deleteGoalsTargetsById(payload))
                      }
                      fetchAfterDelete={() =>
                        dispatch(
                          listGoalsTargets({
                            url: "/GetGoalsAndTargetsList",
                            payload: {
                              searchText: "",
                              filteredBy: "",
                              paginationCount: 10,
                              paginationIndex: 1,
                              sportID: +teamId,
                              goalsAndTargetsSection: "",
                            },
                          })
                        )
                      }
                      deleteResponse={goalsTargetsDelete}
                      clearDeleteState={(payload: any) =>
                        dispatch(clearDeleteState())
                      }
                      payload={{
                        goalsAndTargetsID: row.goalsAndTargetsID,
                        loggedUserID: "1",
                      }}
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
          endIndex={endIndex > GoalsTargetslist?.totalRecords ? GoalsTargetslist?.totalRecords: endIndex}
          totalItems={GoalsTargetslist?.totalRecords}
        />
      </TableContainer>
    </Box>}
    </>
  );
};

export default GoalsTargets;