import {
    Box,
    Typography,
} from "@mui/material";

function Page() {

    return (
        <Box m={0.5} display={'grid'} alignItems={'center'} height={'85vh'} sx={{ backgroundColor: '#FFFFFF', borderRadius: "8px", placeContent:'center' }}>
            <Typography className="bukra table-list-header">Coming Soon....</Typography>
        </Box>
    );
}

export default Page;