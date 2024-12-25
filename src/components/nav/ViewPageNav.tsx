import { Box, Typography } from "@mui/material";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface ViewPageNavProps {
  label: string;
  expanded: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const ViewPageNav: React.FC<ViewPageNavProps> = ({ label, expanded, onClick }) => {
  return (
    <Box
      onClick={onClick}
      className="bg-white"
      sx={{
        marginTop: 1,
        padding: 1,
        borderRadius: "8px",
        borderBottomLeftRadius: expanded ? '0' : '8px',
        borderBottomRightRadius: expanded ? '0' : '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer'
      }}
    >
      <Typography variant="subtitle1" className="bukra" sx={{ padding: 1, fontWeight: 500, fontSize: 18, color: '#008755', fontFamily: '29LT Bukra' }}>
        {label}
      </Typography>
      {!expanded && <NavigateNextIcon sx={{ cursor: 'pointer' }} />}
      {expanded && <ExpandMoreIcon sx={{ cursor: 'pointer' }} />}
    </Box>
  )
}

export default ViewPageNav;