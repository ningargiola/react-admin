import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Dashboard from './scenes/dashboard';
import Sidebar from "./scenes/global/Sidebar";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Form from "./scenes/form";
import FAQ from "./scenes/faq";
import Calendar from "./scenes/calendar/calendar";
import LoginPage from './scenes/login';  // Import your login page
import PrivateRoute from './PrivateRoute'; // Import your PrivateRoute component
import { useAuth } from './authprovider';  // Import the authentication hook

function App() {
  const [theme, colorMode] = useMode();
  const { user } = useAuth();  // Destructure the user from your auth context

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {user && <Sidebar />}  {/* Show sidebar only if user is authenticated */}
          <main className='content'>
            {user && <Topbar />}  {/* Show topbar only if user is authenticated */}
            <Routes>
              <Route path="/login" element={<LoginPage />} /> {/* Public route for login */}

              {/* Protect routes with PrivateRoute */}
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
              <Route path="/team" element={<PrivateRoute><Team /></PrivateRoute>} />
              <Route path="/form" element={<PrivateRoute><Form /></PrivateRoute>} />
              <Route path="/faq" element={<PrivateRoute><FAQ /></PrivateRoute>} />
              <Route path="/contacts" element={<PrivateRoute><Contacts /></PrivateRoute>} />
              <Route path="/invoices" element={<PrivateRoute><Invoices /></PrivateRoute>} />

            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

