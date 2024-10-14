import React, { useEffect, useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import axios from "axios";
import { tokens } from "../theme"; // Assuming tokens for theme color management

const JokeOfTheDay = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [riddle, setRiddle] = useState("");
  const [answer, setAnswer] = useState("");
  const [revealAnswer, setRevealAnswer] = useState(false); // Controls answer visibility

  useEffect(() => {
    const fetchRiddle = async () => {
      const storedRiddle = localStorage.getItem("riddleOfTheDay");
      const storedAnswer = localStorage.getItem("riddleAnswerOfTheDay");
      const storedDate = localStorage.getItem("riddleOfTheDayDate");
      const currentDate = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format

      if (storedRiddle && storedDate === currentDate) {
        setRiddle(storedRiddle); // Use stored riddle if it's from today
        setAnswer(storedAnswer); // Use stored answer
      } else {
        try {
          const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
              model: "gpt-3.5-turbo", // You can use a different model if needed
              messages: [
                {
                  role: "system",
                  content: "You are a playful and witty riddle master. Your goal is to come up with fun and challenging riddles that make the user think, while keeping the tone light and amusing. These riddles should be tricky, clever, and enjoyable, but not too serious. Always end the riddle by explicitly stating \"Answer:\" on a new line, followed by the correct answer.",
                },
                {
                  role: "user",
                  content: "Give me a fun and complicated riddle.",
                },
              ],
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`, // Use your OpenAI API key
              },
            }
          );

          const riddleContent = response.data.choices[0].message.content.trim();
          const riddleParts = riddleContent.split("Answer:"); // Separate riddle from answer
          const newRiddle = riddleParts[0];
          const newAnswer = riddleParts[1];

          setRiddle(newRiddle);
          setAnswer(newAnswer);
          localStorage.setItem("riddleOfTheDay", newRiddle); // Store the riddle for the day
          localStorage.setItem("riddleAnswerOfTheDay", newAnswer); // Store the answer for the day
          localStorage.setItem("riddleOfTheDayDate", currentDate); // Store the date
        } catch (error) {
          console.error("Error fetching riddle from OpenAI:", error);
          setRiddle("Failed to fetch riddle.");
        }
      }
    };

    fetchRiddle();
  }, []);

  const handleRevealAnswer = () => {
    setRevealAnswer(true); // Reveal the answer when button is clicked
  };

  return (
    <Box
      gridColumn={{xs: "span 12", lg:"span 4"}}
      gridRow="span 2"
      backgroundColor={colors.primary[400]}
      p="10px"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        borderBottom={`4px solid ${colors.primary[500]}`}
        colors={colors.grey[100]}
        p="15px"
      >
        <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
          Riddle of the Day!
        </Typography>
      </Box>
      <Box p="20px">
        <Typography color={colors.grey[100]} variant="body1">
          {riddle || "Loading..."}
        </Typography>
      </Box>
      <Box p="20px">
        {!revealAnswer && answer && (
          <Button
            variant="contained"
            onClick={handleRevealAnswer}
            style={{ backgroundColor: colors.greenAccent[500] }}
          >
            Reveal Answer
          </Button>
        )}
        {revealAnswer && (
          <Typography color={colors.grey[100]} variant="body1">
            {answer}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default JokeOfTheDay;


