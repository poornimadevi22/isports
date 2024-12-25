import React, { useContext, useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Tab,
  styled,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { editGoalsTargets } from "@/redux/slices/goalsTargets/goalsTargetsEditSlice";
import EditLongTermGoals from "./editLongTermGoals";
import _ from "lodash";

const StyledTab = styled(Tab)<{ selected: boolean }>(({ selected }) => ({
  flexGrow: 1,
  backgroundColor: selected ? "#008755" : "white",
  color: selected ? "#fff !important" : "#58585B99",
  fontFamily: "29LT Bukra !important",
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "20px",
  "&:hover": {
    backgroundColor: selected ? "#006b43" : "#f0f0f0",
  },
}));

interface SlideDialogProps {
  open: boolean;
  onClose: () => void;
  id: number;
  module?: string;
}

const Edit: React.FC<SlideDialogProps> = ({ open, onClose, id, module }) => {
  const dispatch: AppDispatch = useDispatch();
  const editGoalsTargetsData = useSelector((state: RootState) => state.editGoalsTargets);
  // const selectContext: any = "";

  useEffect(() => {
    if (id) {
        const payload: any = {
          goalsAndTargetsID: id,
        };
        dispatch(editGoalsTargets(payload));
    }
  }, [id]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 550,
          py: 2,
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="titleStyle" sx={{ px: 2 }} className="bukra">
          {`Edit Goal`}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box>
        <EditLongTermGoals editGoalsTargetsData={editGoalsTargetsData} id={id} onClose={onClose}/>
      </Box>
    </Drawer>
  );
};

export default Edit;