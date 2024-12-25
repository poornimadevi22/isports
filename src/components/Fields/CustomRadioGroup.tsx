// components/CustomRadioGroup.tsx
import React from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography } from '@mui/material';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';

interface CustomRadioGroupProps<T extends FieldValues> {
  name: Path<T>;  // Accept keys of T for name
  control: Control<T>;  // Use Control of type T
  label: string;  // Label for the radio group
  options: { value: string; label: string; disabled?: boolean }[];  // Options array for radio items
  required?:boolean
}

const CustomRadioGroup = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  required
}: CustomRadioGroupProps<T>) => {
  return (
    <FormControl>
        <Typography variant='titleStyle' sx={{ fontSize: '14px' }} className="typography textfield-label bukra" mt={1.5}>
            {label}
          {required && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
          </Typography>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RadioGroup row {...field}>
            {options.map((option) => (
              <FormControlLabel
                className="dubai-med textfield-label"
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
                disabled={option.disabled || false}
              />
            ))}
          </RadioGroup>
        )}
      />
    </FormControl>
  );
};

export default CustomRadioGroup;
