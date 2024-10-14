import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './authprovider';  // Import your AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>  {/* Wrap the app with AuthProvider to provide authentication context */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);


