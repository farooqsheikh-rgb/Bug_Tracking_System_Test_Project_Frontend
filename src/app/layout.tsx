"use client";
import "./globals.css";
import { Poppins } from 'next/font/google';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300','400', '500', '600', '700','800','900'],
  variable: '--font-poppins',         
});

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 800,
      sm: 1000,
      md: 1200,
      lg: 1400,
      xl: 1600
    }
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    h1: {
      fontFamily: 'Poppins, sans-serif',
    },
    h2: {
      fontFamily: 'Poppins, sans-serif',
    },
    h3: {
      fontFamily: 'Poppins, sans-serif',
    },
    h4: {
      fontFamily: 'Poppins, sans-serif',
    },
    h5: {
      fontFamily: 'Poppins, sans-serif',
    },
    h6: {
      fontFamily: 'Poppins, sans-serif',
    },
    body1: {
      fontFamily: 'Poppins, sans-serif',
    },
    body2: {
      fontFamily: 'Poppins, sans-serif',
    },
    button: {
      fontFamily: 'Poppins, sans-serif',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: 'Poppins, sans-serif',
        },
      },
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </MuiThemeProvider>
      </body>
    </html>
  );
}
