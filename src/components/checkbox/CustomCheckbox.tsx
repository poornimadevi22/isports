import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';

const MyCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.palette.secondary.main,
  padding: 2,
  '&.Mui-checked': {
    color: theme.palette.success.main,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 26,  // Adjust the size of the icon
  },
  '& .MuiCheckbox-root': {
    borderRadius: '8px',  // Add custom border radius
  },
}));

const CustomCheckbox: React.FC = () => {
  return (
    <MyCheckbox />
  );
};

export default CustomCheckbox;
