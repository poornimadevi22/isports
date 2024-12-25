import { Box, Paper, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

interface MedicalHistoryCardProps {
  label: string;
  expanded: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const MedicalHistoryCard: React.FC<MedicalHistoryCardProps> = ({ label, expanded, onClick }) => {
  const sectionContainerStyle = {
    backgroundColor: "#FFFFFF",
    marginTop: 1,
    padding: 1,
    borderRadius: "8px",
    borderBottomLeftRadius: expanded ? '8px' : '8px',
    borderBottomRightRadius: expanded ? '8px' : '8px',
  }

  const topBarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer'
  }

  const topBarTitleStyle = { padding: 1, fontWeight: 500, fontSize: 18, color: '#008755', fontFamily: '29LT Bukra' }

  const topBarButtonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }

  const injuries: any = [
    {
      id: 1,
      type: "Sprained Ankle",
      injuredDateTime: "11/12/2024 3:30 PM",
      expectedRecoveryDateTime: "12/30/2024",
      actualRecoveryDateTime: "12/25/2024",
      status: "Recovered"
    },
    {
      id: 2,
      type: "Torn ACL",
      injuredDateTime: "09/15/2024 10:00 AM",
      expectedRecoveryDateTime: "12/01/2024",
      actualRecoveryDateTime: "N/A",
      status: "Ongoing"
    },
    {
      id: 3,
      type: "Fractured Arm",
      injuredDateTime: "07/20/2024 1:00 PM",
      expectedRecoveryDateTime: "09/15/2024",
      actualRecoveryDateTime: "09/10/2024",
      status: "Recovered"
    },
    {
      id: 4,
      type: "Dislocated Shoulder",
      injuredDateTime: "05/10/2024 11:00 AM",
      expectedRecoveryDateTime: "08/05/2024",
      actualRecoveryDateTime: "08/01/2024	",
      status: "Pending"
    },
    {
      id: 5,
      type: "Muscle Strain",
      injuredDateTime: "03/02/2024 4:30 PM",
      expectedRecoveryDateTime: "04/20/2024",
      actualRecoveryDateTime: "N/A",
      status: "Ongoing"
    },
  ]

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 16,
      padding: 16
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: '#B1E4E333',
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  return (
    <>
      <Box sx={sectionContainerStyle}>
        <Box
          sx={topBarStyle}
          onClick={onClick}
        >
          <Typography variant="subtitle1" className="bukra" sx={{ padding: 1, fontWeight: 600, fontSize: 18, color: '#008755', fontFamily: '29LT Bukra' }}>
            {label}
          </Typography>
          <Box sx={topBarButtonContainerStyle}>
            {expanded && <span onClick={onClick}><ExpandMoreIcon sx={{ cursor: 'pointer' }} /></span>}
          </Box>
        </Box>
        <Box>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="Medical history table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: 16, padding: 2 }}>Type of Injury</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 16, padding: 2 }}>Date and Time of Injury</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 16, padding: 2 }}>Expected Recovery Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 16, padding: 2 }}>Actual Recovery Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 16, padding: 2 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {injuries.map((row: any) => (
                  <StyledTableRow
                    key={row.id}
                  >
                    <StyledTableCell component="th" scope="row">
                      {row.type}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">{row.injuredDateTime}</StyledTableCell>
                    <StyledTableCell component="th" scope="row">{row.expectedRecoveryDateTime}</StyledTableCell>
                    <StyledTableCell component="th" scope="row">{row.actualRecoveryDateTime}</StyledTableCell>
                    <StyledTableCell component="th" scope="row">{row.status}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  )
}

export default MedicalHistoryCard;