import { createTheme, rgbToHex, ThemeProvider } from "@mui/material"
import { orange } from "@mui/material/colors"
import { FC, ReactNode } from "react"

import '@fontsource/roboto-condensed'
import '@fontsource/baskervville'

const defaultTheme = createTheme({})

const theme = createTheme(defaultTheme,{
    status: {
        danger: orange[500],
    },
    palette: {
        // blue
        primary: {
            dark: rgbToHex("rgb(47,87,116)"),
            main: rgbToHex("rgb(40,97,137)"),
            light: rgbToHex("rgb(96,146,200)"),
        },
        // green
        secondary: {
            dark: rgbToHex("rgb(64,99,77)"),
            main: rgbToHex("rgb(115,146,127)"),
            light: rgbToHex("rgb(174,202,184)"),
        },
    },
    components: {
      MuiFormControl: {
        styleOverrides: {
          root: {
            display: 'block',
            margin: defaultTheme.spacing(0.5, 1),
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
            root: {
                width: '100%',
                fontSize: '.9rem',
                padding: defaultTheme.spacing(0, 0.5),
            },
        },
    },
    },
    typography: {
        fontFamily: ["Baskervville", "Roboto Condensed"].join(","),

        // Überschriften

        h1: {
          fontFamily: "Baskervville",
          fontWeight: 400,
        },
        h2: {
          fontFamily: "Baskervville",
          fontWeight: 400,
        },
        h3: {
          fontFamily: "Baskervville",
          fontWeight: 400,
        },
        h4: {
          fontFamily: "Baskervville",
          fontWeight: 400,
        },
        h5: {
          fontFamily: "Baskervville",
          fontWeight: 400,
        },
        h6: {
          fontFamily: "Baskervville",
          fontWeight: 400,
        },

        subtitle1: {
          fontFamily: "Baskervville",
          fontWeight: 400,
        },
        subtitle2: {
          fontFamily: "Baskervville",
          fontWeight: 700,
        },

        // Buttons

        body1: {
          fontFamily: "Roboto Condensed",
        },
        body2: {
          fontFamily: "Roboto Condensed",
        },
        overline: {
          fontFamily: "Roboto Condensed",
        },
        button: {
          fontFamily: "Roboto Condensed",
          fontWeight: 400,
        },
        caption: {
          fontFamily: "Roboto Condensed",
          fontWeight: 400,
        },
        
    },
})

declare module "@mui/material/styles" {
    interface Theme {
        status: {
            danger: string
        }
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        status?: {
            danger?: string
        }
    }
}

const WithThemeProvider: FC<{ children: ReactNode }> = ({ children }) => (
    <ThemeProvider theme={theme}>
        <>{children}</>
    </ThemeProvider>
)

export default WithThemeProvider
