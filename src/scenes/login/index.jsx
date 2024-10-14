import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";  // Assuming you're using a custom theme similar to your dashboard
import { useState } from "react";
import { useAuth } from "../../authprovider";  // Assuming your auth provider is set up like this

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleLogin = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <Box 
      height="100vh" 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      backgroundColor={colors.primary[400]}
    >
      <Box 
        width="400px" 
        p="20px" 
        backgroundColor={colors.primary[500]} 
        borderRadius="10px" 
        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
      >
        {/* Header */}
        <Box mb="20px">
          <Typography variant="h3" color={colors.grey[100]} fontWeight="600" align="center">
            Login
          </Typography>
          <Typography variant="h6" color={colors.greenAccent[500]} align="center">
            Welcome back! Please login to your account.
          </Typography>
        </Box>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <TextField 
            fullWidth 
            label="Email" 
            variant="outlined" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            margin="normal" 
            InputLabelProps={{
              style: { color: colors.grey[100] },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: colors.greenAccent[500],
                },
                "&:hover fieldset": {
                  borderColor: colors.greenAccent[300],
                },
                "&.Mui-focused fieldset": {
                  borderColor: colors.greenAccent[500],
                },
              },
            }}
          />
          <TextField 
            fullWidth 
            type="password" 
            label="Password" 
            variant="outlined" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            margin="normal"
            InputLabelProps={{
              style: { color: colors.grey[100] },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: colors.greenAccent[500],
                },
                "&:hover fieldset": {
                  borderColor: colors.greenAccent[300],
                },
                "&.Mui-focused fieldset": {
                  borderColor: colors.greenAccent[500],
                },
              },
            }}
          />
          <Button 
            fullWidth 
            type="submit" 
            variant="contained" 
            color="secondary" 
            sx={{ 
              mt: "20px", 
              backgroundColor: colors.greenAccent[500], 
              color: colors.grey[100],
              "&:hover": {
                backgroundColor: colors.greenAccent[400],
              }
            }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
