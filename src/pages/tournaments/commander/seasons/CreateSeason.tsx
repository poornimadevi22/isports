import * as React from 'react';
import { useState,useRef } from 'react';
import {Box,Button, Select, Typography,MenuItem,InputLabel, Grid,styled,TextField,Radio,RadioGroup,FormControlLabel,FormControl, FormLabel} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { validateDate } from '@mui/x-date-pickers';
 import {useRouter} from "next/navigation";



export default function CreateSeason() {
  const router=useRouter();

  const [error, setError] = useState<any>({});
  const [data, setData] = useState({
    plan: "",
    date: null,
    location: "",
    type: "",
    sport: "",
    desc: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError(() => ({
      ...error,
      [name]: undefined,
    }));
  };

  // const handleDateChange = (newValue) => {
  //   setData((prevData) => ({
  //     ...prevData,
  //     date: newValue,
  //   }));
  //   setError((prevErrors) => ({
  //     ...prevErrors,
  //     date: undefined,
  //   }));
  // };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    const validationErrors:any = {};

    if (!data.plan) validationErrors.plan = "!This field is required";
    if (!data.sport) validationErrors.sport = "!This sport is required";
    if (!data.type) validationErrors.type = "!This type is required";
    if (!data.date) validationErrors.date = "!date is required";
    if (!data.location) validationErrors.location = "!This field is required";
    if (!data.desc) validationErrors.desc = "!This description is required";

    setError(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Form submitted:", data);
      // Submit form data
    }
  };

  const CustomTextField = styled(TextField)(({ theme }) => ({
    height: "40px",
    borderRadius: "4px 0px 0px 0px",
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#00875508",
      "& fieldset": {
        borderColor: "#40a377",
      },
      "&:hover fieldset": {
        borderColor: "#40a377",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#40a377",
      },
    },
    "& input": {
      fontFamily: "Roboto",
      paddingLeft: "10px",
      color: "#000000",
    },
    "& input::placeholder": {
      color: "#8D9093",
      opacity: 1,
    },
    "& .Mui-error": {
      "& fieldset": {
        borderColor: "red",
      },
    },
  }));

  return (
    <>
      <Box p={4} sx={{ borderBottom: "1px solid grey", borderRight: "1px solid grey" }}>
        <Typography variant="h5" gutterBottom>
          Create Season Plan
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} width="100%" padding={4} bgcolor="white">
          <Grid item xs={12} sm={6} md={6}>
            <Typography>
              Plan Name<span style={{ color: "red" }}>*</span>
            </Typography>
            <CustomTextField
              name="plan"
              placeholder="Enter Plan Name"
              value={data.plan}
              onChange={handleChange}
              fullWidth
              inputProps={{ maxLength: 50 }}
              error={!!error.plan}
            /><br /> <Typography variant="caption" color="red">
            {error.plan}
          </Typography>
          </Grid>
         

          <Grid item xs={12} sm={6} md={4}>
            <Typography>
              Select Sport<span className="asterisk">*</span>
            </Typography>
            <FormControl fullWidth>
              <Select
                name="sport"
                value={data.sport}
                onChange={handleChange}
                displayEmpty   inputProps={{ maxLength: 50 }}
              ><span className="asterisk">*</span>
                <MenuItem value="" disabled>Select Sport</MenuItem>
                <MenuItem value="Cycling">Cycling</MenuItem>
                <MenuItem value="Swat">Swat</MenuItem>
                <MenuItem value="Swimming">Swimming</MenuItem>
              </Select>
            </FormControl><br />
            <Typography variant="caption" color="red">
              {error.sport}
            </Typography>
          </Grid>

          {/* <Grid item xs={12} sm={6} md={6}>
            <Typography>
              Date<span className="asterisk">*</span>
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker 
                value={data.date}
                // onChange={handleDateChange}
                renderInput={(params:any) => (
                  <CustomTextField {...params} fullWidth error={!!error.date} />
                )}
              />
            </LocalizationProvider><br />
            <Typography variant="caption" color="red">
              {error.date}
            </Typography>
          </Grid> */}

          <Grid item xs={12} sm={6} md={4}>
            <Typography>
              Select Athlete Type<span className="asterisk">*</span>
            </Typography>
            <FormControl>
              <RadioGroup
                name="type"
                row
                value={data.type}
                onChange={handleChange}
              >
                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                <FormControlLabel value="Female" control={<Radio />} label="Female" />
                <FormControlLabel value="All" control={<Radio />} label="All" />
              </RadioGroup>
            </FormControl><br />
            <Typography variant="caption" color="red">
              {error.type}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <Typography>
              Location<span className="asterisk">*</span>
            </Typography>
            <CustomTextField
              name="location"
              value={data.location}
              onChange={handleChange}
              placeholder="Enter Location"
              fullWidth
              error={!!error.location}
            /><br />
            <Typography variant="caption" color="red">
              {error.location}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <Typography>
              Description<span className="asterisk">*</span>
            </Typography>
            <CustomTextField
              name="desc"
              value={data.desc}
              onChange={handleChange}
              placeholder="Enter Description Here"
              multiline
              rows={3}
              fullWidth
              error={!!error.desc}
            /><br />
            <Typography variant="caption" color="red">
              {error.desc}
            </Typography>
          </Grid>
        </Grid>

        <Box
          paddingTop="5%"
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          height="100%"
        >
          <Button
            variant="outlined"
            sx={{
              marginRight: 1,
              color: "red",
              border: "1px solid red",
            }}
          >
            Back
          </Button>
          <Button
            sx={{
              backgroundColor: "rgba(0,135,85,1)",
              color: "white",
              marginRight: 1,
            }}
          >
            Save and Add New
          </Button>
          <Button
            sx={{
              backgroundColor: "rgba(0,135,85,1)",
              color: "white",
            }}
            type="submit"
          >
            Save
          </Button>
        </Box>
      </form>
    </>
  );
}

