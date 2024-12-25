import * as React from 'react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import DateSvg from '../../../public/svg/calendar.svg'; // Ensure your SVG is imported correctly
import { Controller } from 'react-hook-form';
import moment from 'moment'; // Import moment for type usage


interface CustomDatePickerProps {
  control: any; // Control prop from react-hook-form
  name: string; // Field name for react-hook-form
  label: string; // Label for the date picker
  required?: boolean; // Optional required prop
  minDate: any,
  maxDate: any,
  setErrors?:any
  rules?:any
}

const CustomDatePicker = (props: any) => {
  const {
    control,
    name,
    label,
    required,
    minDate,
    maxDate,
    onChange,
    boxmb,
    hidden,
    defaultValue,
    setErrors,
    rules
  } = props
  const [open, setOpen] = React.useState(false);
  const handleIconClick = () => {
    setOpen(true);
  };
 const parsedDefaultValue = defaultValue && defaultValue !== '-' && defaultValue !== '' ? moment(defaultValue, 'DD/MM/YYYY') : null;

  return (
    <>
      <Box mb={boxmb} hidden={hidden}>
        <Typography className='typography textfield-label bukra' >
          {label}
          {required && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
        </Typography>
      </Box>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Controller
          name={name}
          control={control}
          defaultValue={parsedDefaultValue} // Parse the date string to Moment
          rules={{
            ...rules,
            validate: (value) => {
              const selectedDate = moment(value, 'DD/MM/YYYY');
              if (setErrors && minDate && selectedDate.isBefore(minDate, 'day')) {
                console.error(`Selected date (${selectedDate.format('DD/MM/YYYY')}) is earlier than the minimum date (${moment(minDate).format('DD/MM/YYYY')})`);
                setErrors({[name]:`Invalid Date`})
                return `Date cannot be earlier than ${moment(minDate).format('DD/MM/YYYY')}`;
              }
              if (setErrors && maxDate && selectedDate.isAfter(maxDate, 'day')) {
                console.error(`Selected date (${selectedDate.format('DD/MM/YYYY')}) is later than the maximum date (${moment(maxDate).format('DD/MM/YYYY')})`);
                setErrors({[name]:`Invalid Date`})
                return `Date cannot be great than ${moment(maxDate).format('DD/MM/YYYY')}`;
              }
              return true;
            },
          }}
          render={({ field: { onChange: fieldOnChange, onBlur, value, ref, },fieldState: { error } }) => (
            <DatePicker
              format="DD/MM/YYYY"
              className='dubai-med Text-field-customise'
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '8px',
                  fontSize: '14px',
                  px: '10px',
                  py: '6px',
                  marginTop: '12px',
                  background: 'rgba(177, 228, 227, 0.2)',
                  border: "0.5px solid rgba(88, 88, 91, 0.2)",
                }
              }}
              minDate={minDate}
              maxDate={maxDate}
              value={parsedDefaultValue}
              onChange={(newValue) => {
                fieldOnChange(newValue)
                if (onChange) {
                  onChange({ name, value: newValue });
                }
              }}
              slots={{
                textField: TextField,
              }}
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: {
                    width: '100%',
                    // height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                  },
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateSvg style={{ width: 20, height: 20, cursor: 'pointer', }} onClick={handleIconClick} />
                      </InputAdornment>
                    ),
                    endAdornment: null,                  
                  },
                  helperText: error?.message, // Dynamically display error message
                  error: !!error,
                  className: 'custom-datepicker',
                },
              }}
            />
          )} />
      </LocalizationProvider>
    </>
  );
};

export default CustomDatePicker;
