import React from "react";
import { Box, CircularProgress } from "@mui/material";

interface LoadingOverlayProps {
  loading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loading }) => {
  return (
    <>
      {loading && (
        <>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: 2,
              padding: 2,
              zIndex: 2,
            }}
          >
            <CircularProgress />
          </Box>
        </>
      )}
    </>
  );
};

export default LoadingOverlay;
