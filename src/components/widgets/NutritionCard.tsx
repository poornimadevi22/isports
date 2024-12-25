import { Box, Grid, Typography } from "@mui/material"
import Image from "next/image";
import foulAndPizza from "../../../public/foulAndPizza.png";
import shakshuka from "../../../public/shakshuka.png";
import labnehPita from "../../../public/labnehPita.png";

const cardContainerStyle = { border: 1, borderColor: '#B1E4E3', borderRadius: 2 }

const titleTextLeftStyle = { fontWeight: 500, fontSize: 16, color: '#FFFFFF', fontFamily: '29LT Bukra' }

const titleTextRightStyle = { fontWeight: 700, fontSize: 13, color: '#FFFFFF', fontFamily: 'Dubai-med' }

const foodItemContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'start',
  paddingLeft: 2
}

const foodItemImageContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 1,
  padding: 1
}

const foodItemTextStyle = { padding: 1, fontWeight: 400, fontSize: 13, color: '#000000 ', fontFamily: 'Dubai-med' }

const NutritionText = { fontSize: 12, fontFamily: 'Dubai-med', fontWeight: 400, color: '#58585B' }

interface NutritionCardProps {
  title: string;
  time: string;
}

const NutritionCard: React.FC<NutritionCardProps> = ({ title, time }) => {
  return (
    <>
      <Box sx={cardContainerStyle}>
        <Box sx={{ backgroundColor: '#008755', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2, borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
          <Typography variant="caption" sx={titleTextLeftStyle}>
            {title}
          </Typography>
          <Typography variant="caption" sx={titleTextRightStyle}>
            {time}
          </Typography>
        </Box>
        <Box sx={{ padding: 1, paddingLeft: 3, paddingRight: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={NutritionText}>
            {'Carbs 40-50%'}
          </Typography>
          <Typography variant="subtitle2" sx={NutritionText}>
            {'Protien 25-30%'}
          </Typography>
          <Typography variant="subtitle2" sx={NutritionText}>
            {'Fat 20-25%'}
          </Typography>
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={12} md={12}>
            <Box sx={foodItemContainer}>
              <Box sx={foodItemImageContainer}>
                <Image src={foulAndPizza} alt="Foul & Pizza" width={40} height={40} />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={foodItemTextStyle}>
                  {'Foul & Pita'}
                </Typography>
              </Box>
            </Box>
            <Box sx={foodItemContainer}>
              <Box sx={foodItemImageContainer}>
                <Image src={shakshuka} alt="Foul & Pizza" width={40} height={40} />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={foodItemTextStyle}>
                  {'Shakshuka'}
                </Typography>
              </Box>
            </Box>
            <Box sx={foodItemContainer}>
              <Box sx={foodItemImageContainer}>
                <Image src={labnehPita} alt="Foul & Pizza" width={40} height={40} />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={foodItemTextStyle}>
                  {'Labneh & Pita'}
                </Typography>
              </Box>
            </Box>
            <Box sx={foodItemContainer}>
              <Box sx={foodItemImageContainer}>
                <Image src={foulAndPizza} alt="Foul & Pizza" width={40} height={40} />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={foodItemTextStyle}>
                  {'Hummus Bowl'}
                </Typography>
              </Box>
            </Box>
            <Box sx={foodItemContainer}>
              <Box sx={foodItemImageContainer}>
                <Image src={labnehPita} alt="Foul & Pizza" width={40} height={40} />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={foodItemTextStyle}>
                  {'Date Smoothie'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default NutritionCard;