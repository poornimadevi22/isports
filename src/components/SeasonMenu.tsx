import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import moment from "moment";

interface SeasonMenuProps {
  seasonAnchorEl: null | HTMLElement;
  seasonDialogOpen: boolean;
  handleCloseSeasonDialog: any
  Seasonlist: any[] | null;
}

const SeasonMenu: React.FC<SeasonMenuProps> = ({
  seasonAnchorEl,
  seasonDialogOpen,
  handleCloseSeasonDialog,
  Seasonlist,
}) => {
  const safeSeasonList = Array.isArray(Seasonlist) ? Seasonlist : [];
  const handleSeasonSelect = (season: any) => {
    handleCloseSeasonDialog(season);
  }

  return (
    <Menu
      id="basic-menu"
      anchorEl={seasonAnchorEl}
      open={seasonDialogOpen}
      onClose={handleCloseSeasonDialog}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
      sx={{ p: 0 }}
    >
      {safeSeasonList?.map((season, index) => {
        const startYear = season.startDate
          ? new Date(season.startDate.split("/").reverse().join("-")).getFullYear()
          : "Unknown";
        const endYear = season.endDate
          ? new Date(season.endDate.split("/").reverse().join("-")).getFullYear()
          : "Unknown";
        return (
          <MenuItem
            key={index}
            onClick={() => handleSeasonSelect(season)} // Pass season data on click
            className="dubai-med"
            sx={{
              "&:hover": {
                backgroundColor: "#008755",
                color: "white",
              },
              borderBottom: "1px solid rgba(88, 88, 91, 0.2)",
            }}
          >
            {`Season ${startYear} - ${endYear}`}
          </MenuItem>
        );
      })}
      <MenuItem
        sx={{
          "&:hover": {
            backgroundColor: "#008755",
            color: "white",
          },
          borderBottom: "1px solid rgba(88, 88, 91, 0.2)",
        }}
        className="add-season"
      >
        <ListItemIcon className="season-submenu">
          <AddIcon fontSize="small" color="inherit" />
        </ListItemIcon>
        <ListItemText
          className="dubai-med"
          sx={{
            ml: 0.5,
            mr: 4,
          }}
        >
          Add Season
        </ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default SeasonMenu;
