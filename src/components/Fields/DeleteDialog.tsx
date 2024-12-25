"use client"
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
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import Delete from '../../../public/delete.png'
import Image from "next/image";
import { viewStaff } from "@/redux/slices/staff/staffListSlice";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import _ from "lodash";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

interface TeamsTableProps {
  data: any;
  dispatchDelete: any;
  deleteResponse: any;
  clearDelete: any;
  module: any;
  dispatchList: any;
  title: any;
  listUrl?: any;
  getCurrentSport: any
}

const DeleteDialog: React.FC<TeamsTableProps> = ({
  data,
  dispatchDelete,
  deleteResponse,
  clearDelete,
  module,
  dispatchList,
  title,
  listUrl,
  getCurrentSport
}) => {
  const [open, setOpen] = React.useState(false);
  const dispatch: AppDispatch = useDispatch();

  const handleClickOpen = (e: any) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => {
    if(deleteResponse && deleteResponse?.data && deleteResponse?.data?.responseCode === 200){
        setOpen(false);
        const payload = {
            searchText: "",
            filteredBy: '',
            paginationIndex: 1,
            paginationCount: 10,
            sportID: getCurrentSport
        }
        dispatch(dispatchList(_.isEmpty(listUrl) ? payload : {url:listUrl, payload}))
        setTimeout(() => {
          dispatch(clearDelete())
        }, 1000);
    } else {
        setOpen(false);
    }
  };

  const handleDelete = (data: any) => {
    const payload: any = {
      [module]: data[module],
      loggedUserID: "1",
    };
    dispatch(dispatchDelete(payload));
  };

  return (
    <React.Fragment>
      <IconButton
        aria-label="delete"
        color="error"
        size="small"
        onClick={(e) => handleClickOpen(e)}
        sx={{width:'16px', height:'16px'}}
      >
        <DeleteIcon sx={{color:"#05868E"}}/>
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
          Delete {title}
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
          {deleteResponse && deleteResponse?.data && deleteResponse?.data?.responseCode === 200 ? (
            <Box p={2} textAlign={"center"}>
                <Image src={Delete} alt="deleted-img" width={51} height={85} />
              <Typography className="dubai-med secondary-color deleted-text" mt={2}>
                {title} Deleted Successfully
              </Typography>
            </Box>
          ) : (
            <>
              <Box p={2} textAlign={"center"}>
                <Typography className="dubai-med secondary-color format-text">
                  Are you sure, Do you want to delete?
                </Typography>
                <Typography
                  className="bukra delete-dialog-name"
                  sx={{ color: "#E4002B" }}
                  my={2}
                >
                  {data && data?.name}
                </Typography>
                <Typography className="dubai-med secondary-color format-text">
                  Once the {title} is deleted, you cannot not revert.
                </Typography>
              </Box>
              <Box sx={{ m: 1, mx: 2, textAlign: "center" }}>
                <Button
                  autoFocus
                  onClick={() => handleDelete(data)}
                  color="error"
                  variant="outlined"
                  className="dubai-med text-capitalize"
                  sx={{ mr: 1 }}
                  disabled={deleteResponse.loading}
                >
                  {deleteResponse.loading ? <CircularProgress color="error" size="25px" /> :
                  "Yes, delete"}
                </Button>
                <Button
                  variant="contained"
                  className="dubai-med text-capitalize"
                  onClick={handleClose}
                  disabled={deleteResponse.loading}
                >
                  No, I want to Keep
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default DeleteDialog;