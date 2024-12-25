"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Box, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import { useEffect } from "react";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const ReusableDeleteDialog: React.FC<any> = ({
  title,
  confirmationMessage,
  successMessage,
  name,
  icon = <DeleteIcon />,
  deleteAction,
  fetchAfterDelete,
  deleteResponse,
  payload,
  revertMessage,
  clearDeleteState
}) => {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    clearDeleteState();
    fetchAfterDelete();
  };

  useEffect(() => {
    if (deleteResponse?.code === 200) {
      const timer = setTimeout(() => {
        clearDeleteState();
        setOpen(false);
        fetchAfterDelete();
      }, 3000);
  
      return () => clearTimeout(timer);
    }
  }, [deleteResponse])

  const handleDelete = () => {
    deleteAction(payload);
  };

  return (
    <>
      <IconButton
        aria-label="delete"
        size="small"
        onClick={handleClickOpen}
        sx={{ width: "16px", height: "16px", color: "#05868E"}}
      >
        {icon}
      </IconButton>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        className="dialog-width"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DialogTitle
          sx={{ m: 0, p: 2 }}
          id="customized-dialog-title"
          className="bukra dialogBox-delete-title"
        >
          {title}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          {deleteResponse?.code === 200 ? (
            <Box p={2} textAlign="center">
              <Image src="/delete.png" alt="deleted-img" width={51} height={85} />
              <Typography className="dubai-med secondary-color deleted-text" mt={2}>
                {successMessage}
              </Typography>
            </Box>
          ) : (
            <>
              <Box p={2} textAlign="center">
                <Typography className="dubai-med secondary-color format-text">
                  {confirmationMessage}
                </Typography>
                <Typography
                  className="bukra delete-dialog-name"
                  sx={{ color: "#E4002B" }}
                  my={2}
                >
                  {name}
                </Typography>
                <Typography className="dubai-med secondary-color format-text">
                  {revertMessage}
                </Typography>
              </Box>
              <Box sx={{ m: 1, mx: 2, textAlign: "center" }}>
                <Button
                  autoFocus
                  onClick={handleDelete}
                  color="error"
                  variant="outlined"
                  className="dubai-med text-capitalize"
                  sx={{ mr: 1 }}
                  disabled={deleteResponse?.loading}
                >
                  {deleteResponse?.loading ? (
                    <CircularProgress color="error" size="25px" />
                  ) : (
                    "Yes, delete"
                  )}
                </Button>
                <Button
                  variant="contained"
                  className="dubai-med text-capitalize"
                  onClick={handleClose}
                  disabled={deleteResponse?.loading}
                >
                  No, I want to Keep
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};

export default ReusableDeleteDialog;
