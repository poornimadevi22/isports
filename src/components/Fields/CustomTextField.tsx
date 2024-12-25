// components/CustomTextField.tsx
import React from 'react';
import { TextField, TextFieldProps, Typography } from '@mui/material';
import { Controller, Control, FieldValues, RegisterOptions, Path } from 'react-hook-form';

interface CustomTextFieldProps<T extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  name: Path<T>;  // Updated to accept keys of T as name
  control?: Control<T>;  // Use the generic type T
  label?: string;
  rules?: RegisterOptions<T, Path<T>>;  // Updated to register options for T
  textarea?:boolean
  placeholder?: string
}

const CustomTextField = <T extends FieldValues>({
  name,
  control,
  label,
  rules = {},
  textarea,
  placeholder,
  ...props
}: CustomTextFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      // rules={rules}
      rules={{
        ...rules,
        validate: {
          noLeadingTrailingSpaces: (value) =>
            value.trim() === value || 'No leading or trailing spaces allowed.',
          ...rules?.validate, // Keep existing validations
        },
      }}
      render={({ field, fieldState: { error } }) => (
        <>
          <Typography variant='titleStyle' sx={{ fontSize: '14px' }} className="typography textfield-label bukra" mt={1.5} mb={0.5}>
            {label}
            {rules?.required && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
          </Typography>
          <TextField
            {...field}
            {...props}
            error={!!error}
            helperText={error ? error.message : ''}
            variant="outlined"
            fullWidth
            placeholder={placeholder}
            className='Text-field-customise'
            multiline={textarea}
            rows={textarea ? 4 : 1}
            sx={{
              '& .MuiInputBase-root': {
                background:"#00875508",
                height:!textarea ? '40px' : '120px',
                fontSize: '14px',
              },
              "& fieldset": {
                borderColor: "#40a377",
              },
              "&:hover fieldset": {
                borderColor: "#40a377",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#40a377",
              },
              "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
                borderColor:name==="longtermGoals" ?"#F1EB9C":"#40a377",
                backgroundColor:name==="longtermGoals" ?"rgba(241, 235, 156, 0.2)" :"",
              },
              "& input": {
                color: "#000000",
                paddingTop:'0px',
                paddingBottom: !textarea ? '0px' :'68px'
              },
              "& input::placeholder": {
                color: "#8D9093",
                opacity: 1,
              },
            }}
          />
        </>
      )}
    />
  );
};

export default CustomTextField;
