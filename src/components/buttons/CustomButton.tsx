"use client"
import React from 'react';
import Button from '@mui/material/Button';
import { height, styled, SxProps, Theme, width } from '@mui/system';

interface CustomButtonProps {
  label: string;
  variant: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  ButtonIcon: React.ElementType;
  iconPosition: 'start' | 'end';
  onClick?: any;
  sx?: SxProps<Theme>;
}

const StyledButton = styled(Button)(({ theme, variant }) => ({
  textTransform: 'none',
  ...(variant === 'outlined' && {
    borderWidth: 2,
    fontWeight: 600
  }),
}));

const CustomButton: React.FC<CustomButtonProps> = ({ label, size, variant, ButtonIcon, iconPosition, onClick, sx }) => {
  return (
    <StyledButton 
      sx={{ ...sx }}
      variant={variant}
      className="dubai-med"
      size={size}
      startIcon={iconPosition == 'start' ? <ButtonIcon style={{ width: 13, height: 13 }} /> : null}
      endIcon={iconPosition == 'end' ? <ButtonIcon style={{ width: 13, height: 13 }} /> : null}
      onClick={onClick}>
      {label}
    </StyledButton>
  );
};

export default CustomButton;