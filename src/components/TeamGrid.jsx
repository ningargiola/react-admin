import { Box, Typography, Grid } from '@mui/material';
import { colors } from '@mui/material'; // Assuming colors is defined somewhere
import gargDevTagWhite from '/Users/nickingargiola/react-admin/src/assets/logoWhite.png';
import gargDevTagDark from '/Users/nickingargiola/react-admin/src/assets/portfoliologo.png';
import snellDevTagWhite from '/Users/nickingargiola/react-admin/src/assets/image-2.png';
import snellDevTagDark from '/Users/nickingargiola/react-admin/src/assets/SnellDevTag1.png';
import ferryDevTagWhite from '/Users/nickingargiola/react-admin/src/assets/image.png';
import ferryDevTagDark from '/Users/nickingargiola/react-admin/src/assets/FerryDevTag2.png';
import { useTheme } from '@emotion/react';
import { tokens } from '../theme';


const TeamGrid = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const teamMembers = [
    {
      name: 'Gargoyle',
      title: 'CEO',
      image: theme.palette.mode === "light" ? gargDevTagDark : gargDevTagWhite,
    },
    {
      name: 'Snell',
      title: 'CEO',
      image: theme.palette.mode === "light" ? snellDevTagDark : snellDevTagWhite,
    },
    {
      name: 'Ferry',
      title: 'COO',
      image: theme.palette.mode === "light" ? ferryDevTagDark : ferryDevTagWhite,
    },
    // Add more team members here
  ];

  return (
    <Grid container spacing={4} justifyContent="center">
      {teamMembers.map((member, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Box marginTop="25px">
            <Box display="flex" justifyContent="center" alignItems="center">
              <img
                alt="profile-user"
                width="75px"
                height="75px"
                src={member.image}
                style={{ cursor: 'pointer', borderRadius: '50%' }}
              />
            </Box>
            <Box textAlign="center">
              <Typography
                variant="h2"
                color={colors.grey[100]}
                fontWeight="bold"
                sx={{ m: '10px 0 0 0' }}
              >
                {member.name}
              </Typography>
              <Typography variant="h5" color={colors.greenAccent[500]} fontWeight="bold">
                {member.title}
              </Typography>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default TeamGrid;
