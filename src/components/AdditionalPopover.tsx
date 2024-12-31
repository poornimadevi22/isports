import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Gym from '../pages/tournaments/commander/seasons/gym.svg'
import Poll from '../pages/tournaments/commander/seasons/Poll.svg'
import Vector from '../pages/tournaments/commander/seasons/Vector.svg'


export default function SimplePopover(props: any) {
  const { id, anchorEl, setAnchorEl, open, handleClose } = props

  return (
    <>
      <Popover    
      sx={{
        "& .MuiPaper-root": {
          boxShadow: "none", 
          border: "1px solid #ddd", 
          bottom:"0",
        },
      }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorReference="anchorPosition"
        anchorPosition={{ bottom:"0", left:"100"}}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: 'left',
        }}>
        <Box width="350px" height="317px" sx={{ boxShadow: "none" }}>
          <Box pt={1.75} textAlign="center" borderBottom="2px solid #e6e6e6">
            <Typography p={1} variant="body1" textAlign="start" borderBottom="2px solid #e6e6e6" mb={3} fontFamily="dubai-med">More options</Typography>
            <Gym fontSize="30px" p={2} marginTop="5%" sx={{
              // backgroundColor: "#b1e4e3",
              padding: "2px",
              background: "#EDFFFC",
              marginLeft: " 30px",
            }} />
            <Typography variant="body1" p={2} fontFamily="dubai-med" color="#58585b">Fitness and Nutrition</Typography>
          </Box>
          <Box display="flex" height="139px">
            <Box width="170px" sx={{
              borderRight: "2px solid #e6e6e6",
              textAlign: "center",
              justifyContent: " space-evenly",
              paddingTop: "10%"
            }}>
              <Poll fontSize="28px" color="#b1e4e3" sx={{
               background: "#EDFFFC",
                height: "120px",
                padding: "2px",
                marginLeft: " 30px",
              }} />
              <Typography variant="body1" fontFamily="dubai-med" color="#58585b">Suggestions and Polls</Typography>
            </Box>
            <Box textAlign="center" pt={5} width="170px" >
              <Vector fontSize="28px" background="#b1e4e3" sx={{
                background: "#b1e4e3",
                padding: "2px",
                marginLeft: " 30px",
              }} />
              <Typography variant="body1" fontFamily="dubai-med" color="#58585b">Research Facility</Typography>
            </Box>
          </Box>
        </Box>
      </Popover>
    </>
  );
}