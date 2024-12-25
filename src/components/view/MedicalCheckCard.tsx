import { Box, Grid, Typography } from "@mui/material";
import CustomButton from "../buttons/CustomButton";
import SettingsSVG from "../../../public/SettingsSVG.svg";
import XlsSVG from "../../../public/XlsSVG.svg";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FitnessTest from "../widgets/FitnessTest";
import FieldTest from "../widgets/FieldTest";
import MedicalTest from "../widgets/MedicalTest";
import PerformanceTest from "../widgets/PerformaceTest";

interface MedicalCheckCardProps {
  label: string;
  expanded: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const MedicalCheckCard: React.FC<MedicalCheckCardProps> = ({ label, expanded, onClick }) => {
  return (
    <Box sx={{
      backgroundColor: "#FFFFFF",
      marginTop: 1,
      padding: 1,
      borderRadius: "8px",
      borderBottomLeftRadius: expanded ? '8px' : '8px',
      borderBottomRightRadius: expanded ? '8px' : '8px',
    }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={onClick}
      >
        <Typography variant="subtitle1" className="bukra" sx={{ padding: 1, fontWeight: 600, fontSize: 18, color: '#008755', fontFamily: '29LT Bukra' }}>
          {label}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <CustomButton sx={{ marginRight: 2, backgroundColor: "#0087551A" }} label='Export to Excel' variant="outlined" size='small' ButtonIcon={XlsSVG} iconPosition="start" onClick={(e:any) => {e.stopPropagation() }} />
          <CustomButton sx={{ marginRight: 2 }} label='Update' variant="contained" size='small' ButtonIcon={SettingsSVG} iconPosition="start" onClick={(e:any) => {e.stopPropagation() }} />
          {expanded && <span onClick={onClick}><ExpandMoreIcon sx={{ cursor: 'pointer' }} /></span>}
        </Box>
      </Box>
      <Box sx={{ padding: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <FitnessTest />
          </Grid>
          <Grid item xs={12} md={6}>
            <PerformanceTest />
          </Grid>
          <Grid item xs={12} md={6}>
            <FieldTest />
          </Grid>
          <Grid item xs={12} md={6}>
            <MedicalTest />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default MedicalCheckCard