import * as React from 'react';
import { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  styled,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import moment from 'moment';
import SubMenuLayout from '../../layout';
import BasicBreadcrumbs from '@/components/breadcrumbs';
import CustomDatePicker from '@/components/Fields/CustomDatePicker';
import ReactSelect from '@/components/Fields/ReactSelect';


const breadcrumbRoutes = [
  { title: 'Dashboard', route: '/dashboard', currentPage: false },
  { title: 'Internal Races & Tournaments', route: '/tournaments', currentPage: false },
  { title: 'Season Planner', route: '/seasonplanner', currentPage: true },
];

const CustomTextField = styled(TextField)(({ theme }) => ({
  height: '40px',
  borderRadius: '4px 0px 0px 0px',
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#00875508',
    '& fieldset': { borderColor: '#40a377' },
    '&:hover fieldset': { borderColor: '#40a377' },
    '&.Mui-focused fieldset': { borderColor: '#40a377' },
  },
  '& input': {
    height: '8px',
    fontFamily: 'dubai-med',
    paddingLeft: '10px',
    color: '#000000',
  },
  '& input::placeholder': { color: '#8D9093', opacity: 1 },
  '& .Mui-error': { '& fieldset': { borderColor: 'red' } },
}));

export default function CreateSeason() {
  const router = useRouter();
  const { control } = useForm();
  const [error, setError] = useState<any>({});
  const [data, setData] = useState({
    plan: '',
    date: null,
    location: '',
    type: '',
    sport: '',
    desc: '',
  });

  const handleChange = (e: any) => {
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

  const handleDateChange = (newValue: any) => {
    setData((prevData) => ({
      ...prevData,
      date: newValue,
    }));
    setError((error: any) => ({
      ...error,
      date: undefined,
    }));
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: Record<string, string> = {};

    if (!data.plan) validationErrors.plan = 'This field is required';
    if (!data.sport) validationErrors.sport = 'This sport is required';
    if (!data.type) validationErrors.type = 'This type is required';
    if (!data.date) validationErrors.date = 'This date is required';
    if (!data.location) validationErrors.location = 'This field is required';
    if (!data.desc) validationErrors.desc = 'This description is required';

    setError(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log('Form submitted:', data);
    }
  };

  return (
    <>
      <Box pb={0.5}>
        <Box p={1} className="bg-white" borderRadius={1}>
          <BasicBreadcrumbs routes={breadcrumbRoutes} />
        </Box>
      </Box>
      <Box
        bgcolor="white"
        overflow="auto"
        sx={{ borderBottom: '2px solid rgba(222, 226, 237, 1)', borderRadius: '8px 8px 0px 0px' }}
      >
        <Typography p={2} display={'inline-flex'} sx={{ fontFamily: '29LT Bukra', fontWeight: 600, borderRight: '3px solid rgba(222, 226, 237, 1)' }}>
          Create Season Plan
        </Typography>
      </Box>
      <Box bgcolor="white" height="780px" width="100%" overflow="scroll">
        <form onSubmit={handleSubmit}>
        <Grid container spacing={3} sx={{ justifyContent: "space-between", }} padding="1rem" pl="60px" pr="60px">
            <Grid item xs={12} md={5.5} >
              <Typography className="typography textfield-label bukra">
                Plan Name<span className="asterisk">*</span>
              </Typography>
              <CustomTextField className="Text-field-customise"
                name="plan"
                placeholder="Enter Plan Name"
                value={data.plan}
                onChange={handleChange}
                fullWidth
                inputProps={{ maxLength: 50 }}
                error={!!error.plan}
              /><br />
              <Typography variant="caption" className="error-message">
                {error.plan}
              </Typography>
            </Grid>


            <Grid item xs={12} md={5.5} >
              <Typography className="typography textfield-label bukra">
                Select Sport<span className="asterisk">*</span>
              </Typography>
              <ReactSelect
                isMulti={false}
                name='sport'
                className='select2'
                classNamePrefix='select'
                // handleChangeReactSelect={handleChangeSports}
                 options="cricket"
                value={data.sport}
                // isDisabled={!SportsOption}
                placeholder="Select Sport"
              />
              <Typography variant="caption" className="error-message">
                {error.sport}
              </Typography>
            </Grid>

            <Grid item xs={12} md={5.5}>
              <Typography className="typography textfield-label bukra">
                Date<span className="asterisk">*</span>
              </Typography>
              <CustomDatePicker
                control={control}
                hidden={true}
                name="date"
                label="Date"
                boxmb={0.8}
                required={true}
                minDate={data.date || moment()}
                maxDate={moment().add(10, 'years')}
                onChange={handleDateChange}
                className="Text-field-customise"
              />
              <Typography variant="caption" className="error-message">
                {error.date}
              </Typography>
            </Grid>

            <Grid item xs={12} md={5.5}>
              <Typography className="typography textfield-label bukra">
                Select Athlete Type<span className="asterisk">*</span>
              </Typography>
              <FormControl >
                <RadioGroup
                  name="type"
                  row
                  value={data.type}
                  onChange={handleChange}>
                  <FormControlLabel className="dubai-med textfield-label" value="Male" control={<Radio />} label="Male" />
                  <FormControlLabel className="dubai-med textfield-label" value="Female" control={<Radio />} label="Female" />
                  <FormControlLabel className="dubai-med textfield-label" value="All" control={<Radio />} label="All" />
                </RadioGroup>
              </FormControl><br />
              <Typography variant="caption" className="error-message">
                {error.type}
              </Typography>
            </Grid>

            <Grid item xs={12} md={5.5}>
              <Typography className="typography textfield-label bukra">
                Location<span className="asterisk">*</span>
              </Typography>
              <CustomTextField className='Text-field-customise'
                name="location"
                value={data.location}
                onChange={handleChange}
                placeholder="Enter Location"
                fullWidth
                error={!!error.location}
              /><br />
              <Typography variant="caption" className="error-message">
                {error.location}
              </Typography>
            </Grid>

            <Grid item xs={12} md={5.5}>
              <Typography className="typography textfield-label bukra">
                Description<span className="asterisk">*</span>
              </Typography>
              <CustomTextField className='Text-field-customise'
                name="desc"
                placeholder="Enter Description about season plan  "
                type="text"
                variant="outlined"
                multiline
                rows={2}
                fullWidth
                value={data.desc}
                onChange={handleChange}
                helperText={error.desc || ''}
                sx={{
                  color: "red",
                  fontFamily: 'Dubai',
                  fontSize: "12px",
                  fontWeight: "600",
                }}
                inputProps={{ maxLength: 500 }} />
            </Grid>
          </Grid>
          <Box mr={7.7} paddingTop="9%"
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Button variant="outlined" className="text-capitalize"
              sx={{
                marginRight: 1,
                color: "red",
                border: "1px solid red",
              }}>
              Back
            </Button>
            <Button className="text-capitalize"
              sx={{
                backgroundColor: "#008755",
                color: " rgba(255,255,255,1)",
                marginRight: 1, borderRadius: "5px"
              }}
            >Save and Add New
            </Button>
            <Button className="text-capitalize"
              sx={{
                backgroundColor: "rgba(0,135,85,1)",
                color: "white",
              }} type="submit"
            > Save
            </Button>
          </Box>

        </form>
      </Box>

    </>
  );
}

CreateSeason.getLayout = (CreateSeason: React.ReactNode) => (
  <SubMenuLayout>{CreateSeason}</SubMenuLayout>
);