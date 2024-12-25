import { Box, Grid, Typography } from "@mui/material"
import StopwatchSVG from "../../../public/StopwatchSVG.svg"

const cardLeft = { fontWeight: 500, fontSize: 16, color: '#58585B' };

const PerformanceTest: React.FC = ({ }) => {
  const results: any = [
    {
      id: 1,
      name: "Agility Test",
      value: "15.2 seconds",
      status: "Passed"
    },
    {
      id: 2,
      name: "Endurance Test",
      value: "25 minutes",
      status: "Passed"
    },
    {
      id: 3,
      name: "Strength Test",
      value: "100 KG",
      status: "Passed"
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
            backgroundColor: '#CDE8FF',
            padding: 2
          }}>
            <StopwatchSVG style={{ width: 26, height: 26 }} />
          </Box>
          <Box sx={{ marginLeft: 1 }}>
            <Typography variant="subtitle1" sx={{ padding: 1, fontWeight: 500, fontSize: 18, color: '#000000', fontFamily: 'Bukra' }}>
              {'Performance Test'}
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

export default PerformanceTest;