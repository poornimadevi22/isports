import { Box, Grid, Typography } from "@mui/material";
import CustomButton from "../buttons/CustomButton";
import SettingsSVG from "../../../public/SettingsSVG.svg";
import XlsSVG from "../../../public/XlsSVG.svg";
import ArrowDownSVG from "../../../public/ArrowDownSVG.svg";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NutritionCard from "../widgets/NutritionCard";

interface SuggestedNutritionProps {
  label: string;
  expanded: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const SuggestedNutrition: React.FC<SuggestedNutritionProps> = ({ label, expanded, onClick }) => {
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

  return (
    <Box sx={sectionContainerStyle}>
      <Box
        sx={topBarStyle}
        onClick={onClick}
        >
        <Typography variant="subtitle1" className="bukra" sx={{ padding: 1, fontWeight: 600, fontSize: 18, color: '#008755', fontFamily: '29LT Bukra' }}>
          {label}
        </Typography>
        <Box sx={topBarButtonContainerStyle}>
          <CustomButton sx={{ marginRight: 2, backgroundColor: "#0087551A" }} label='Export to Excel' variant="outlined" size='small' ButtonIcon={XlsSVG} iconPosition="start" onClick={(e:any) => {e.stopPropagation() }} />
          <CustomButton sx={{ marginRight: 2 }} label='Today' variant="contained" size='small' ButtonIcon={ArrowDownSVG} iconPosition="end" onClick={(e:any) => {e.stopPropagation() }} />
          <CustomButton sx={{ marginRight: 2 }} label='Update' variant="contained" size='small' ButtonIcon={SettingsSVG} iconPosition="start" onClick={(e:any) => {e.stopPropagation() }} />
          {expanded && <span onClick={onClick}><ExpandMoreIcon sx={{ cursor: 'pointer' }} /></span>}
        </Box>
      </Box>
      <Box sx={{ padding: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <NutritionCard title="Breakfast" time="07:00 am" />
          </Grid>
          <Grid item xs={12} md={4}>
            <NutritionCard title="Lunch" time="12:00 pm" />
          </Grid>
          <Grid item xs={12} md={4}>
            <NutritionCard title="Dinner" time="07:00 pm" />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default SuggestedNutrition;