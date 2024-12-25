import React, { useState } from "react";
import { Controller } from "react-hook-form";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Typography, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Define the option type
interface Option {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
}

// Define the props for CustomSelect
interface DropDownProps {
  name: string; // Required for use with react-hook-form
  label?: string;
  control: any; // react-hook-form control prop
  options: Option[];
  variant?: "standard" | "outlined" | "filled";
  minWidth?: number;
  defaultValue?: string | number | string[] | number[];
  icon?: boolean;
  multiple?: boolean; // New prop for enabling multiple selection
  required?:boolean;
  sx?:any;
  placeholder?:any

}

const DropDown: React.FC<DropDownProps> = ({
  name,
  control,
  options,
  variant = "standard",
  minWidth = 120,
  defaultValue = [],
  icon = false,
  label,
  multiple = false, // Default is single selection
  required,
  sx,
  placeholder
}) => {
  // State for selected values, for managing chip deletion
  const [selectedValues, setSelectedValues] = useState<(string | number)[]>(defaultValue as (string | number)[]);

  // Handle deleting selected value
  const handleDelete = (value: string | number) => {
    
    setSelectedValues((prevSelectedValues) =>
      prevSelectedValues.filter((selectedValue) => selectedValue !== value)
    );
  };

  return (
    <>
      <Typography
        variant="titleStyle"
        sx={{ fontSize: "14px", mb: 0.5, mt: 1.5 }}
        // sx={{ fontSize: "14px", mb: 0.5, mt: 1.5,...sx }}
        className="typography textfield-label bukra"
      >
        {label}
      {required &&  <span style={{ color: "red", marginLeft: "4px" }}>*</span>}
      </Typography>
      <FormControl className="selectFieldContainer">
        <Controller
          name={name}
          control={control}
          defaultValue={multiple ? [] : defaultValue} // Ensure defaultValue is an array for multiple
          render={({ field }) => (
            <Select
              {...field}
              multiple={multiple}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              IconComponent={() => <ExpandMoreIcon style={{ marginRight: "10px" }} />}
              sx={{
                maxHeight: "40px",
                color: "#000",
                background: "rgba(177, 228, 227, 0.2)",
                border: "0.5px solid rgba(88, 88, 91, 0.2)",
              }}
              className='Text-field-customise'
              value={field.value || (multiple ? [] : "")} // Ensure value is an array for multiple
              renderValue={(selected) => {
                if (!selected || (Array.isArray(selected) && selected.length === 0)) {
                  return <Typography
                  sx={{
                    color: "#000",
                    fontWeight: "500",
                    fontSize: "16px",
                  }}
                  >{placeholder ? placeholder : "Select an option"}</Typography>;
                }
                return multiple && Array.isArray(selected) ? (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected
        .filter((value) => value !== '').map((value) => (
                      <Chip
                        key={value}
                        label={options.find(option => option.value === value)?.label || value}
                        sx={{
                          padding: "0px", // Adjust padding to reduce overall size
                          fontFamily: "Dubai, sans-serif",
                          fontWeight: 400,
                          fontSize: "12px",
                          backgroundColor: "#05868E", // Set the background color based on role
                          color: "#fff",
                          lineHeight: "18px", // Adjust the font size
                          height: "24px", // Custom height to make it smaller
                          ".MuiChip-label": {
                            py: "7px",
                            px: "10px",
                          },
                        }}
                        onDelete={() => handleDelete(value)} // Delete the value when the chip is removed
                        deleteIcon={<CloseIcon style={{ color: "#fff", fontSize: "16px" }} />}
                      />
                    ))}
                  </Box>
                ) : (
                  options.find(option => option.value === selected)?.label || selected
                );
              }}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                      paddingTop: "2px",
                      paddingBottom: "2px",
                      paddingLeft: "0px",
                      paddingRight: "0px",
                    }}
                  >
                    {icon && option.icon && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: icon ? "3px" : 0,
                        }}
                      >
                        {option.icon}
                      </Box>
                    )}
                    <Typography
                      sx={{
                        color: "#000",
                        fontWeight: "500",
                        fontSize: "16px",
                      }}
                    >
                      {option.label}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>
    </>
  );
};

export default DropDown;
