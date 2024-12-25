import React, { useEffect, useState } from "react";
import {
  Popover,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Box,
} from "@mui/material";
import CheckboxIcon from "../../public/svg/Checkbox.svg";
import CheckedIcon from '@mui/icons-material/CheckBox';
import { capitalize } from "lodash";
import _ from "lodash";
interface FilterDialogProps {
  open: boolean;
  anchorEl: null | HTMLElement;
  onClose: () => void;
  onApply: (selectedFilters: string[]) => void;
  options: string[];
  localStorageKey:string
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  anchorEl,
  onClose,
  onApply,
  options,
  localStorageKey
}) => {
  // Retrieve from localStorage or set to all options if localStorage is empty
  const [selectedFilters, setSelectedFilters] = useState<string[]>(
    []
  );
  const [reset, setReset] = useState(false);


  // Check if all options are selected
  const allSelected = options.length > 0 && selectedFilters.length === options.length;

  const handleToggle = (value: string) => {
    const currentIndex = selectedFilters.indexOf(value);
    const newSelectedFilters = [...selectedFilters];

    if (currentIndex === -1) {
      newSelectedFilters.push(value);
    } else {
      newSelectedFilters.splice(currentIndex, 1);
    }

    setSelectedFilters(newSelectedFilters);
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedFilters([]); // Deselect all
    } else {
      setSelectedFilters(options); // Select all
    }
  };

  const handleApply = () => {
    onApply(selectedFilters);
    localStorage.setItem(localStorageKey, JSON.stringify(selectedFilters));
    onClose();
  };

  useEffect(() => {
    if (reset) {
      onApply(selectedFilters);
      setReset(false);
      localStorage.setItem(localStorageKey, JSON.stringify(selectedFilters));
    }
  }, [reset, selectedFilters, onApply]);

  const handleReset = () => {
    setSelectedFilters([]);
    setReset(true);
    onClose();
  };

  // Save to localStorage whenever `selectedFilters` changes
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(selectedFilters));
  }, [selectedFilters]);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <Box p={2}>
        <FormGroup>
          <FormControlLabel
            className="dubai-med"
            control={
              <Checkbox
                checked={allSelected}
                onChange={handleSelectAll}
                icon={<CheckboxIcon sx={{ fontSize: 30 }} />}
                checkedIcon={<CheckedIcon sx={{ fontSize: 20 }} />}
              />
            }
            label="Select All"
          />
          {
            !_.isEmpty(options) &&
            options.map((role) => (
              <FormControlLabel
                key={role}
                className="dubai-med"
                control={
                  <Checkbox
                    checked={selectedFilters.indexOf(role) !== -1}
                    onChange={() => handleToggle(role)}
                    icon={<CheckboxIcon sx={{ fontSize: 30 }} />}
                    checkedIcon={<CheckedIcon sx={{ fontSize: 20 }} />}
                  />
                }
                label={capitalize(role)}
              />
            ))
          }
        </FormGroup>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            onClick={handleReset}
            variant="outlined"
            color="error"
            disabled={selectedFilters.length === 0}
            className="text-capitalize dubai-med"
          >
            Clear
          </Button>
          <Button
            onClick={handleApply}
            variant="contained"
            color="success"
            style={{ marginLeft: '8px' }}
            className="text-capitalize dubai-med"
            disabled={selectedFilters.length === 0}
          >
            Apply
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};

export default FilterDialog;
