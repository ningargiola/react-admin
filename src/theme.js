import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";


// color design tokens
export const tokens = (mode) => ({
    ...(mode === "dark"
      ? {
          grey: {
            100: "#e0e0e0",
            200: "#c2c2c2",
            300: "#a3a3a3",
            400: "#858585",
            500: "#666666",
            600: "#525252",
            700: "#3d3d3d",
            800: "#292929",
            900: "#141414",
          },
          pink: {
            100: "#fdd3e8",
            200: "#fca6d1",
            300: "#fa7aba",
            400: "#f94da3",
            500: "#f7218c",
            600: "#c61a70",
            700: "#941454",
            800: "#630d38",
            900: "#31071c"
        },
          primary: {
            100: "#d0d1d5",
            200: "#a1a4ab",
            300: "#727681",
            400: "#1F2A40",
            500: "#141b2d",
            600: "#101624",
            700: "#0c101b",
            800: "#080b12",
            900: "#040509",
          },
          greenAccent: {
            100: "#d2f0ee",
            200: "#a6e0dd",
            300: "#79d1cc",
            400: "#4dc1bb",
            500: "#20b2aa",
            600: "#1a8e88",
            700: "#136b66",
            800: "#0d4744",
            900: "#062422"
        },
          redAccent: {
            100: "#f8dcdb",
            200: "#f1b9b7",
            300: "#e99592",
            400: "#e2726e",
            500: "#db4f4a",
            600: "#af3f3b",
            700: "#832f2c",
            800: "#58201e",
            900: "#2c100f",
          },
          blueAccent: {
            100: "#e1e2fe",
            200: "#c3c6fd",
            300: "#a4a9fc",
            400: "#868dfb",
            500: "#6870fa",
            600: "#535ac8",
            700: "#3e4396",
            800: "#2a2d64",
            900: "#151632",
          },
        }
      : {
          grey: {
            100: "#141414",
            200: "#292929",
            300: "#3d3d3d",
            400: "#525252",
            500: "#666666",
            600: "#858585",
            700: "#a3a3a3",
            800: "#c2c2c2",
            900: "#e0e0e0",
          },
          pink: {
            100: "#31071c",
            200: "#630d38",
            300: "#941454",
            400: "#c61a70",
            500: "#f7218c",
            600: "#f94da3",
            700: "#fa7aba",
            800: "#fca6d1",
            900: "#fdd3e8",
        },
          primary: {
            100: "#040509",
            200: "#080b12",
            300: "#0c101b",
            400: "#f2f0f0", // manually changed
            500: "#141b2d",
            600: "#1F2A40",
            700: "#727681",
            800: "#a1a4ab",
            900: "#d0d1d5",
          },
          greenAccent: {
            100: "#062422",
            200: "#0d4744",
            300: "#136b66",
            400: "#1a8e88",
            500: "#20b2aa",
            600: "#4dc1bb",
            700: "#79d1cc",
            800: "#a6e0dd",
            900: "#d2f0ee",
          },
          redAccent: {
            100: "#2c100f",
            200: "#58201e",
            300: "#832f2c",
            400: "#af3f3b",
            500: "#db4f4a",
            600: "#e2726e",
            700: "#e99592",
            800: "#f1b9b7",
            900: "#f8dcdb",
          },
          blueAccent: {
            100: "#151632",
            200: "#2a2d64",
            300: "#3e4396",
            400: "#535ac8",
            500: "#6870fa",
            600: "#868dfb",
            700: "#a4a9fc",
            800: "#c3c6fd",
            900: "#e1e2fe",
          },
        }),
  });

// mui theme settings
export const themeSettings = (mode) => {
    const colors = tokens(mode);

    return {
        palette: {
            mode: mode,
            ...(mode === "dark" 
            ? {
                primary: {
                    main: colors.primary[500],
                },
                secondary: {
                    main: colors.greenAccent[500],
                },
                neutral: {
                    dark: colors.grey[700],
                    main:colors.grey[500],
                    light: colors.grey[100],
                },
                background: {
                    default: colors.primary[500],
                },
             } : {
                primary: {
                    main: colors.primary[100],
                },
                secondary: {
                    main: colors.greenAccent[500],
                },
                neutral: {
                    dark: colors.grey[700],
                    main:colors.grey[500],
                    light: colors.grey[100],
                },
                background: {
                    default: "#fcfcfc",
                },
            }),
        },
        typography: {
            fontFamily:["Source Sans 3", "sans-serif"].join(","),
            fontSize: 12,
            h1: {
                fontFamily:["Source Sans 3", "sans-serif"].join(","),
                fontSize: 40,
            },
            h2: {
                fontFamily:["Source Sans 3", "sans-serif"].join(","),
                fontSize: 32,
            },
            h3: {
                fontFamily:["Source Sans 3", "sans-serif"].join(","),
                fontSize: 24,
            },
            h4: {
                fontFamily:["Source Sans 3", "sans-serif"].join(","),
                fontSize: 20,
            },
            h5: {
                fontFamily:["Source Sans 3", "sans-serif"].join(","),
                fontSize: 16,
            },
            h6: {
                fontFamily:["Source Sans 3", "sans-serif"].join(","),
                fontSize: 14,
            },
        },
    };
};

// context for color mode
export const ColorModeContext = createContext ({
    toggleColorMode: () => {},
});

export const useMode = () => {
    const [mode, setMode] = useState("dark");

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () =>
                setMode((prev) => (prev === "light" ? "dark" : "light")),
        }),
        []
    );
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])

    return [theme, colorMode];
};