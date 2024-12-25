import React from "react";
import { useState, } from "react";
import "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Card from "@mui/material/Card";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";
import { Grid, Badge, Box, Typography, Button, Chip } from "@mui/material";
import FmdGoodSharpIcon from "@mui/icons-material/FmdGoodSharp";
import Maps from "./map-pin.svg";
import CreateSeason from "./CreateSeason";
import { Router, useRouter } from "next/router";

const SeasonPlanner = () => {
  const router = useRouter();

  const [events, setEvents] = useState([
    {
      month: "September 24",
      events: [
        {
          date: "25",
          day: "Wed",
          title: "Rapid Chess Tournament",
          location: (<><Maps width={20} height={15} />Dubai Police Officers Club</>),
          icons: (<><ManIcon /> <WomanIcon /></>),
        },]},
    {
      month: "October 24",
      events: [{
        date: "25",
        day: "Fri",
        title: "Football Championship",
        location: (
          <><Maps width={20} height={15} />Dubai Police Officers Club</>),
        icons: <ManIcon />,
      },
      {
        borderLeft: "6px solid #e4002b",
        date: "29",
        day: "Tue",
        title: "Karate Courses",
        location: (
          <><Maps width={20} height={15} /> Dubai Officers Club</>),
        icons: (<><WomanIcon /> <ManIcon /></>)
      },],},
    {
      month: "November 24",
      events: [
        {
          date: "28",
          day: "Thu",
          title: "Snooker Tournament",
          location: (<><Maps width={20} height={15} />Dubai Police Officers Club</>),
          icons: <ManIcon />,
        },]}, 
        {
      month: "December 24",
      events: [
        {
          date: "16", day: "Mon", title: "Basketball Tournament",
          location: (<><Maps width={20} height={15} />Dubai Police Officers Club</>),
          icons: <ManIcon />
        },
        {
          date: "20", day: "fri", title: "Heritage Game Championship", location: (
            <><Maps width={20} height={15} /> Dubai Police Officers Club</>),
          icons: <ManIcon />
        }
      ]
    },
    {
      month: (<>January 25  <Chip label="+2" color="success"
        sx={{
          fontSize: "15px",
          borderRadius: "20px",
          width: '50px',
          height: "26px",
          color: "white",
        }} /></>
      ), color: " #8BE7B9", border: " #8BE7B9",
      events: [
        {
          date: "15", day: "Wed", title: "Tennis Championship",
          location: (<><Maps width={20} height={15} /> Dubai Police Officers Club</>), 
          icons: <ManIcon />
        },
        {
          date: "18", day: "sat", title: "Super fit Program", location: (
            <>
              <Maps width={20} height={15} /> Dubai Police Officers Club
            </>), icons: <ManIcon />
        }
      ]
    },
    {
      month: "February 25",
      color: " #8BE7B9", border: " #8BE7B9",
      events: [
        {
          date: "24", day: "Mon", title: "Swimming championship", location: (
            <><Maps width={20} height={15} />Dubai Officers Club</>),
          icons: <ManIcon />
        }
      ]
    },
    {
      month: (<>March 25 <Chip label="+6" color="success" sx={{
        fontSize: "15px", borderRadius: "20px",
        width: '50px', height: "26px",
        color: "white",
      }} /></>),
      color: " #8BE7B9", border: " #8BE7B9",
      events: [
        {
          date: "28", day: "fri", title: "Swimming championship", location: (
            <>
              <Maps width={20} height={15} />Dubai Officers Club
            </>), icons: <ManIcon />
        },
        {
          borderLeft: "6px solid #e4002b",
          date: "29", day: "sat", title: "karate courses", location: (
            <>
              <Maps width={20} height={15} />Dubai Police Officers Club
            </>), icons: (<><WomanIcon /><ManIcon /></>)
        },
      ]
    },
    {
      month: "April 25",
      color: " #8BE7B9", border: " #8BE7B9",
      marginBottom: "none",
      events: [
        {
          borderLeft: "6px solid #e4002b",
          date: "22", day: "Tue", title: "Go fit program", location: (
            <>
              <Maps width={20} height={15} />Dubai Police Officers Club
            </>), icons: (<><ManIcon /><WomanIcon /></>)
        },
        {
          borderLeft: "6px solid #e4002b",
          date: "22", day: "Tue", title: "Go fit program", location: (
            <>
              <Maps width={20} height={15} /> Dubai Police Officers Club
            </>), icons: (<><ManIcon /><WomanIcon /></>)
        }
      ]
    },
    {
      month: "May 25",
      color: " #8BE7B9", border: " #8BE7B9",
      events: [{
        borderLeft: "6px solid #e4002b",
        date: "29", day: "Thu", title: "karate courses", 
        location: (<><Maps width={20} height={15} /> Dubai Police Officers Club </>), 
        icons: (<><WomanIcon /> <ManIcon /> </>),
      },
      {
        date: "29", day: "Thu", title: "Snooker Tournament",
         location: (<><Maps width={20} height={15} /> Dubai Police Officers Club</>), 
         icons: < ManIcon />
      }]},
    {
      month: "June 25",
      color: " #8BE7B9", border: " #8BE7B9", borderLeft: "6px solid #e4002b",
      events: [{
        borderLeft: "6px solid #e4002b",
        date: "15", day: "sun", title: "Stationary Bike Program",
        p: " for officers and club members",
         location: ( <><Maps width={20} height={15} /> Dubai Police Officers Club </>), 
          icons: <WomanIcon />
      },]},
    {
      month: "July 25",
      color: " #8BE7B9", border: " #8BE7B9",
      events: [{
        date: "22", day: "Tue", title: "Football Championship", 
        location: ( <><Maps width={20} height={15} /> Dubai Police Officers Club</>),
        icons: <ManIcon />
      },
      {
        date: "23", day: "Wed", title: "Rapid Chess Tournament",
         location: (<><Maps width={20} height={15} /> Dubai Police Officers Club</>), 
          icons: (<><ManIcon /> <WomanIcon /></>)
      }]},
    {month: "August 25",
      color: " #8BE7B9", border: " #8BE7B9", events: [],
      //  tag: <AddIcon />,
    }]);

  return (
    <>
    {/* {Header section} */}
    <Box className="bg-white" sx={{
      height: "58px",
      width: "auto",
      borderRadius: "10px 11px 0px 0px",
      borderBottom: "1px solid #DEE2ED",
    }}>
      <Box sx={{ borderBottom: "1px solid  #DEE2ED", }}>
        <Box display={"flex"} justifyContent={"space-between"}>
          <Typography className="table-list-header bukra" p={2}
            sx={{
              borderRight: "1px solid #DEE2ED",
              fontWeight: "500",
              fontSize: "15px",
              color: "#000000",
              fontFamily: "bukra",
            }}>Season Planner 2024-2025
          </Typography>
          <Button
            sx={{
              textTransform: "capitalize",
              color: "white",
              fontWeight: "500",
              fontSize: "18px",
              borderRadius: " 0px 11px 0px 0px",
              fontFamily: "dubai-med",
              width: "215px",
              background: "#008755",
              borderTopRightRadius: "4px",
              height: "57px",
            }} onClick={() => { router.push(`/tournaments/commander/seasons/createSeason`) }} >
            Create Season Plan <AddIcon />
          </Button>
        </Box>
      </Box>
    </Box>

     {/* {Planner} */}
      <Box className="bg-white" sx={{ height: "70vh", overflow: "scroll" }}>
        <Grid container sx={{ p: "20px" }}>
          {events.map((month, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card sx={{
                width: "100%",
                borderRadius: 2,
                padding: "5px",
                height: "220px",
                boxShadow: "none",
              }}>
                <Box sx={{
                  height: "211px",
                  borderRadius: "22px 21px 9px 9px",
                  borderColor: month.border ?? "#FFD884",
                  borderStyle: "solid",
                  borderWidth: "0px 1px 1px 1px",
                }}>
                  <Typography variant="h6"
                    sx={{
                      textAlign: "center",
                      fontFamily: "bukra",
                      background: month.color ?? "#FFD884",
                      fontSize: "18px",
                      fontWeight: "600",
                      borderRadius: "18px 18px 0px 0px",
                      padding: "10px",
                    }}> {month.month}</Typography>
                  <Box display="grid"
                    sx={{
                      height: "151px",
                      alignItems: "end",
                    }}>
                    {month.events?.map((event, Id) => (
                      <Card
                        key={Id}
                        elevation={2}
                        sx={{
                          marginLeft: "5px",
                          alignItem: "center",
                          width: "97%",
                          height: "60px",
                          padding: "3px",
                          textAlign: "start",
                          marginBottom: "2px",
                          borderLeft: event.borderLeft ?? "7px solid green",
                          borderRadius: "9px",
                          display: "flex",
                          alignItems: "center",
                          backgroundColor: "#f1f4f7",
                        }}>
                        <Box sx={{
                          textAlign: "center",
                          borderRight: "3px solid grey",
                          minWidth: 50,
                        }}>
                          <Typography variant="body1" fontWeight="bold">
                            {event.date}
                          </Typography>
                          <Typography variant="body2">
                            {event.day}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="600"
                            sx={{
                              textAlign: "start",
                              paddingLeft: "6px",
                              fontFamily: "dubai-med",
                              fontSize: "14px",
                              lineHeight: "1.5",
                            }}>{event.title}  {event.p} </Typography>
                             <Typography
                            variant="body2"
                            sx={{
                              fontSize: "14px",
                              fontFamily: "dubai-med",
                              fontWeight: "400",
                              color: "#000000",
                            }}> {event.location} </Typography>
                        </Box>
                        <Box sx={{
                          marginLeft: "auto",
                          display: "flex",
                          flexDirection: "column",
                        }}>{event.icons}
                        </Box>
                      </Card>
                    ))}
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default SeasonPlanner;
