"use client";
import React, { useEffect, useState } from "react";
import SubMenuLayout from "./layout";
import Box from "@mui/material/Box";
import BasicBreadcrumbs from "@/components/breadcrumbs";
import { useRouter } from "next/router";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CustomFullCalendar from "@/components/calendar/CustomFullCalendar";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import { Dialog, DialogContent, FormGroup } from "@mui/material";
import Competition from "../../../../../public/Competition.svg";
import Training from "../../../../../public/Training.svg";
import Events from "../../../../../public/Events.svg";
import Remainder from "../../../../../public/Remainder.svg";
import Meetings from "../../../../../public/Meetings.svg";
import CustomCalendar from "@/components/calendar/CustomCalendar";
import CustomCheckbox from "@/components/checkbox/CustomCheckbox";
import CustomFormControlLabel from "@/components/Forms/CustomFormControlLabel";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Event {
    title: string;
    date: string;
}

const events = [
    { title: '9:45 Annual Football', date: '2024-12-17' },
    { title: '10:30 Player Performance', date: '2024-12-17', },
    { title: '16:00 Skill Training', date: '2024-12-06' },
    { title: '16:00 Strength Training', date: '2024-12-09' },
    { title: '6:30 Warm-up Routing', date: '2024-12-09' },
    { title: '7:30 Recovery', date: '2024-12-22' },
    { title: '4:30 City Foodball Tournament', date: '2024-12-25' },
]

function Page() {
    const router = useRouter();
    const { teamID } = router.query;
    const breadcrumbRoutes = [
        {
            title: "Sports",
            route: `/teams/${teamID}/raceCalendar`,
            currentPage: false,
        },
        {
            title: "Race Calendar",
            route: `/teams/${teamID}/raceCalendar`,
            currentPage: true,
        },
    ];
    const [searchText, setSearchText] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [finalEvents, setEvents] = useState<Event[]>([]);

    useEffect(() => {
      setEvents(events);
    }, []);

    const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {

    };

    const handleCreateClick = () => {
        setOpenDialog(true); 
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleCalendarFilterChange = (value: string) => {
        if (value == 'tournaments') {
            setEvents([
                { title: '4:30 City Foodball Tournament', date: '2024-12-25' },
            ])
        } else if (value == 'trainings') {
            setEvents([
                { title: '16:00 Strength Training', date: '2024-12-09' },
                { title: '6:30 Warm-up Routing', date: '2024-12-09' },
                { title: '7:30 Recovery', date: '2024-12-22' },
            ])
        } else if (value == 'events') {
            setEvents([
                { title: '9:45 Annual Football', date: '2024-12-17' },
                { title: '4:30 City Foodball Tournament', date: '2024-12-25' },
            ])
        } else if (value == 'reminders') {
            setEvents([
                { title: '16:00 Skill Training', date: '2024-12-06' },
                { title: '16:00 Strength Training', date: '2024-12-09' },
            ])
        } else if (value == 'meetings') {
            setEvents([
                { title: '10:30 Player Performance', date: '2024-12-17', },
            ])
        } else {
            setEvents(events);
        }
    }

    return (
        <>
            <Box p={1} className="bg-white" borderRadius={1}>
                <BasicBreadcrumbs routes={breadcrumbRoutes} />
            </Box>
            <Grid container spacing={0.5} mt={0.1} pr={0.5}>
                <Grid item xs={4}>
                    <Box p={2} className="bg-white" borderRadius={1}>
                        <Box sx={{ maxHeight: 300 }}>
                            <CustomCalendar />
                        </Box>
                        <Box
                            sx={{
                                padding: 1,
                                borderRadius: "8px",
                                background: "white",
                                display: "flex",
                                flexDirection: "column",
                                gap: 1, 
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: 14,
                                        color: "#008755",
                                        fontFamily: "29LT Bukra",
                                    }}
                                >
                                    My Calendar
                                </Typography>
                                <ExpandMoreIcon sx={{ cursor: "pointer" }} />
                            </Box>
                            <FormGroup sx={{ paddingX: 2 }}>
                                <CustomFormControlLabel
                                    control={<CustomCheckbox />}
                                    label="Tournaments"
                                    onClick={() => handleCalendarFilterChange("tournaments")}
                                />
                                <CustomFormControlLabel
                                    control={<CustomCheckbox />}
                                    label="Trainings"
                                    onClick={() => handleCalendarFilterChange("trainings")}
                                />
                                <CustomFormControlLabel
                                    control={<CustomCheckbox />}
                                    label="Events"
                                    onClick={() => handleCalendarFilterChange("events")}
                                />
                                <CustomFormControlLabel
                                    control={<CustomCheckbox />}
                                    label="Reminders"
                                    onClick={() => handleCalendarFilterChange("reminders")}
                                />
                                <CustomFormControlLabel
                                    control={<CustomCheckbox />}
                                    label="Team Meetings"
                                    onClick={() => handleCalendarFilterChange("meetings")}
                                />
                                <CustomFormControlLabel
                                    control={<CustomCheckbox />}
                                    label="Meetings"
                                    onClick={() => handleCalendarFilterChange("meetings")}
                                />
                            </FormGroup>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={8}>
                    <Box className="bg-white" borderRadius={1}>
                        <Box display={"flex"}>
                            <Typography
                                width={"41%"}
                                p={2}
                                className="table-list-header bukra header-border-right"
                            >
                            </Typography>
                            <Paper
                                className="dubai-med header-border-right"
                                sx={{
                                    p: "11px 4px",
                                    display: "flex",
                                    alignItems: "center",
                                    boxShadow: "none",
                                    width: "30%",
                                    borderRadius: "0",
                                }}
                            >
                                <SearchIcon color="secondary" />
                                <InputBase
                                    className="dubai-med"
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="Search.."
                                    inputProps={{ "aria-label": "Search by Goal, Status.." }}
                                    onChange={(event) => {
                                        setSearchText(event.target.value);
                                    }}
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
                            <Button
                                variant="contained"
                                className="dubai-med text-capitalize"
                                sx={{
                                    width: "15%",
                                    borderRadius: "0",
                                    borderTopRightRadius: "4px",
                                }}
                                endIcon={<AddIcon />}
                                onClick={handleCreateClick}
                            >
                                Create
                            </Button>
                        </Box>
                    </Box>

                    <Box p={2} className="bg-white" borderRadius={1}>
                        <CustomFullCalendar events={finalEvents} />
                    </Box>
                </Grid>
            </Grid>

            <Dialog open={openDialog} onClose={handleClose}
                sx={{
                    borderRadius: '8px'
                }}
                
                >
                <DialogContent>
                    <Box display="flex" flexDirection="column" mt={2} mb={2} alignItems="center">
                        {/* First row */}
                        <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1}>
                            <Button
                                variant="contained"
                                className="dubai-med text-capitalize"
                                startIcon={<Competition />}
                                sx={{
                                    width: "166px",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                    height: "80px",
                                    padding: "10px",
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: "8px",
                                    textAlign: 'center',
                                }}
                            >
                                Tournament / Competition
                            </Button>
                            <Button
                                variant="contained"
                                className="dubai-med text-capitalize"
                                startIcon={<Training />}
                                sx={{
                                    width: "166px",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                    height: "80px",
                                    padding: "16px",
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: "8px",
                                    "& .MuiButton-startIcon": {
                                        margin: 0, 
                                    },
                                }}
                            >
                                Training
                            </Button>
                            <Button
                                variant="contained"
                                className="dubai-med text-capitalize"
                                startIcon={<Events />}
                                sx={{
                                    width: "166px",
                                    height: "80px",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                    padding: "12px",
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: "8px",
                                    "& .MuiButton-startIcon": {
                                        margin: 0, 
                                    },
                                }}
                            >
                                Events
                            </Button>

                        </Box>
                        <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1} mt={2}>
                            <Button
                                variant="contained"
                                className="dubai-med text-capitalize"
                                startIcon={<Remainder />}
                                sx={{
                                    width: "166px",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                    height: "80px",
                                    padding: "12px",
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: "8px",
                                    "& .MuiButton-startIcon": {
                                        margin: 0, 
                                    }
                                }}
                            >
                                Reminders
                            </Button>
                            <Button
                                variant="contained"
                                className="dubai-med text-capitalize"
                                startIcon={<Meetings />}
                                sx={{
                                    width: "166px",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                    height: "80px",
                                    padding: "12px",
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: "8px",
                                    "& .MuiButton-startIcon": {
                                        margin: 0, 
                                    },
                                }}
                            >
                                Meetings
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}
Page.getLayout = (page: React.ReactNode) => (
    <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;