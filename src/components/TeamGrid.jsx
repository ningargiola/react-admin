import { Box, Typography } from '@mui/material';
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
      image: theme.palette.mode === 'light' ? gargDevTagDark : gargDevTagWhite,
    },
    {
      name: 'Snell',
      title: 'CEO',
      image: theme.palette.mode === 'light' ? snellDevTagDark : snellDevTagWhite,
    },
    {
      name: 'Ferry',
      title: 'COO',
      image: theme.palette.mode === 'light' ? ferryDevTagDark : ferryDevTagWhite,
    },
    // Add more team members here
  ];

  return (
    <Box
      sx={{
        overflowX: 'auto', // Enable horizontal scroll
        display: 'flex', // Use flexbox for horizontal layout
        justifyContent: 'flex-start',
        gap: 4, // Reduced gap between grid items
        padding: '10px',
        width: '100%',
        scrollSnapType: 'x mandatory', // Enable horizontal snap scrolling
        scrollBehavior: 'smooth', // Smooth scrolling between items
        // Scrollbar styling based on theme
        '&::-webkit-scrollbar': {
          height: '8px', // Horizontal scrollbar height
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: colors.greenAccent[500], // Styled based on the theme
          borderRadius: '10px', // Rounded thumb for smoother style
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: colors.grey[700], // Track color for the scrollbar
        },
        scrollbarWidth: 'thin', // Firefox: Use thin scrollbar
        scrollbarColor: `${colors.greenAccent[500]} ${colors.grey[700]}`, // Firefox: Thumb and track color
      }}
    >
      {teamMembers.map((member, index) => (
        <Box
          key={index}
          sx={{
            minWidth: '50px', // Ensure minimum width for proper spacing
            marginRight: '20px', // Reduced space between items
            flexShrink: 0, // Prevent flex items from shrinking
            scrollSnapAlign: 'center', // Ensure each item snaps to the center when scrolling
          }}
        >
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
        </Box>
      ))}
    </Box>
  );
};

export default TeamGrid;
