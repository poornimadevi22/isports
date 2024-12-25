import { Box, Grid, Typography } from "@mui/material"
import TestPadSVG from "../../../public/TestPadSVG.svg";

const cardLeft = { fontWeight: 500, fontSize: 16, color: '#58585B' };


const MedicalTest: React.FC = ({ }) => {
  const results: any = [
    {
      id: 1,
      name: "Blood Pressure Test",
      value: "120/80 mmHg",
      status: "Normal"
    },
    {
      id: 2,
      name: "Vision Test",
      value: "20/20 Vision",
      status: "Normal"
    },
    {
      id: 3,
      name: "Body Fat Percentage",
      value: "18%",
      status: "Normal"
    },
  ]
  return (
    <>
      <Box sx={{ border: 1, borderColor: '#B1E4E3', borderRadius: 2, padding: 2 }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'start'
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1,
            backgroundColor: '#54E28E4D',
            padding: 2
          }}>
            <TestPadSVG style={{ width: 26, height: 26 }} />
          </Box>
          <Box sx={{ marginLeft: 1 }}>
            <Typography variant="subtitle1" sx={{ padding: 1, fontWeight: 500, fontSize: 18, color: '#000000', fontFamily: 'Bukra' }}>
              {'Medical Test'}
            </Typography>
          </Box>
        </Box>

        {results.map((result: any) => (
          <Grid container spacing={1} paddingTop={1} key={result.id}>
            <Grid item xs={5} md={5}>
              <Typography variant="caption" sx={cardLeft}>
                {result.name}
              </Typography>
            </Grid>
            <Grid item xs={7} md={7}>
              <Typography variant="caption" sx={{ fontWeight: 500, fontSize: 16, color: '#000000' }}>
                {result.value}
              </Typography>
              <Typography variant="caption" sx={{ marginLeft: 1, fontWeight: 500, fontSize: 12, color: '#008755' }}>
                {`(${result.status})`}
              </Typography>
            </Grid>
          </Grid>
        ))}

      </Box>
    </>
  )
}

export default MedicalTest;