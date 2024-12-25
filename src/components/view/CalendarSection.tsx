import Box from "@mui/material/Box";
import CustomCalendar from "../calendar/CustomCalendar";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CustomButton from "../buttons/CustomButton";
import PlusSVG from "../../../public/PlusSVG.svg";
import XlsSVG from "../../../public/XlsSVG.svg";
import Grid from "@mui/material/Grid";
import CustomFullCalendar from "../calendar/CustomFullCalendar";
import FormGroup from "@mui/material/FormGroup";
import CustomCheckbox from "../checkbox/CustomCheckbox";
import CustomFormControlLabel from "../Forms/CustomFormControlLabel";
import { useEffect, useState } from "react";

interface Event {
  title: string;
  date: string;
}

interface CalendarSectionProps {
  label: string;
  expanded: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const events = [
  { title: '9:45 Annual Football', date: '2024-11-17' },
  { title: '10:30 Player Performance', date: '2024-11-17', },
  { title: '16:00 Skill Training', date: '2024-11-06' },
  { title: '16:00 Strength Training', date: '2024-11-09' },
  { title: '6:30 Warm-up Routing', date: '2024-11-09' },
  { title: '7:30 Recovery', date: '2024-11-22' },
  { title: '4:30 City Foodball Tournament', date: '2024-11-25' },
]

const CalendarSection: React.FC<CalendarSectionProps> = ({ label, expanded, onClick }) => {
  const [finalEvents, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    setEvents(events);
  }, []);

  const handleCalendarFilterChange = (value: string) => {
    if (value == 'tournaments') {
      setEvents([
        { title: '4:30 City Foodball Tournament', date: '2024-11-25' },
      ])
    } else if (value == 'trainings') {
      setEvents([
        { title: '16:00 Strength Training', date: '2024-11-09' },
        { title: '6:30 Warm-up Routing', date: '2024-11-09' },
        { title: '7:30 Recovery', date: '2024-11-22' },
      ])
    } else if (value == 'events') {
      setEvents([
        { title: '9:45 Annual Football', date: '2024-11-17' },
        { title: '4:30 City Foodball Tournament', date: '2024-11-25' },
      ])
    } else if (value == 'reminders') {
      setEvents([
        { title: '16:00 Skill Training', date: '2024-11-06' },
        { title: '16:00 Strength Training', date: '2024-11-09' },
      ])
    } else if (value == 'meetings') {
      setEvents([
        { title: '10:30 Player Performance', date: '2024-11-17', },
      ])
    } else {
      setEvents(events);
    }
  }

  return (
    <Box sx={{
      backgroundColor: "#FFFFFF",
      marginTop: 1,
      padding: 1,
      borderRadius: "8px",
      borderBottomLeftRadius: expanded ? '0' : '8px',
      borderBottomRightRadius: expanded ? '0' : '8px',
    }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor:"pointer"
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
          <CustomButton sx={{ marginRight: 2 }} label='Create' variant="contained" size='small' ButtonIcon={PlusSVG} iconPosition="end" onClick={(e:any) => {e.stopPropagation() }} />
          {expanded && <span onClick={onClick}><ExpandMoreIcon sx={{ cursor: 'pointer' }} /></span>}
        </Box>
      </Box>
      <Box sx={{ padding: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <Box sx={{ maxHeight: 300 }}>
              <CustomCalendar />
            </Box>
            <Box
              sx={{
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
              <Typography variant="subtitle1" sx={{ padding: 1, fontWeight: 700, fontSize: 14, color: '#008755', fontFamily: '29LT Bukra' }}>
                {'My Calendar'}
              </Typography>
              <ExpandMoreIcon sx={{ cursor: 'pointer' }} />
            </Box>
            <Box sx={{ paddingLeft: 2, paddingRight: 2 }}>
              <FormGroup>
                <CustomFormControlLabel control={<CustomCheckbox />} label="Tournaments" onClick={() => handleCalendarFilterChange('tournaments')} />
                <CustomFormControlLabel control={<CustomCheckbox />} label="Trainings" onClick={() => handleCalendarFilterChange('trainings')} />
                <CustomFormControlLabel control={<CustomCheckbox />} label="Events" onClick={() => handleCalendarFilterChange('events')} />
                <CustomFormControlLabel control={<CustomCheckbox />} label="Reminders" onClick={() => handleCalendarFilterChange('reminders')} />
                <CustomFormControlLabel control={<CustomCheckbox />} label="Team Meetings" onClick={() => handleCalendarFilterChange('meetings')} />
                <CustomFormControlLabel control={<CustomCheckbox />} label="Meetings" onClick={() => handleCalendarFilterChange('meetings')} />
              </FormGroup>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <CustomFullCalendar events={finalEvents} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default CalendarSection;