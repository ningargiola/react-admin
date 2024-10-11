import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      <Header title="FAQ" subtitle="Frequently Asked Questions" />

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What is a DevTag?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          A DevTag is a unique, 2D PNG image designed to reflect your personality and identity within the 
          company. These solid-colored, minimalist visuals serve as a personal signature, helping others 
          recognize and connect with you at a glance. Every employee in the company has their own distinct DevTag, 
          symbolizing their role, individuality, and creativity. Whether displayed on internal platforms, profiles, 
          or team communications, your DevTag becomes an essential part of your professional identity, fostering a 
          sense of belonging and collaboration within the company.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FAQ;