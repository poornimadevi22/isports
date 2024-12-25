"use client"; // Client-side layout

import React, { ReactNode, useEffect, useState } from "react";
import { CssBaseline, CircularProgress, Box } from "@mui/material"; // Import CircularProgress for loading
import Providers from "@/redux/Providers";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import HeaderAppBar from "@/components/AppBar";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../utils/theme";
import localFont from "next/font/local";
import { getLocalStorage } from "@/utils/helper";
import { SESSION } from "@/utils/constants";
import Footer from "@/components/footer";

// Importing custom font
const myFont = localFont({ src: "./fonts/29LTBukra-Regular.woff" });

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true); // State to manage loading
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const token = getLocalStorage(SESSION.TOKEN); // Get token on component mount

  
  useEffect(() => {
    // Update authentication state
    setIsAuthenticated(!!token);

    // Debug output

    // Redirect logic
    if (pathname === "/login" && token) {
      router.push("/dashboard");
    } else if (!token && pathname !== "/login") {
      router.push("/login");
    }

    // Set loading to false after checking
    setLoading(false);
  }, [router, pathname, token]);

  // Show a loading spinner until the token check is complete
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress /> {/* Loading spinner */}
      </div>
    );
  }

  return (
    <Providers>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {isAuthenticated ? (
          <Box
            sx={{
              display: "flex",
              maxWidth: "100vw",
              overflow: "hidden",
            }}
          >
            <Sidebar />
            <Box sx={{ flexGrow: 1 }}>
              <HeaderAppBar />
              <main
                className="bg-workspace"
                style={{ padding: "2px", height: "87vh" }}
              >
                {children}
              </main>{" "}
              {/* Render child pages here */}
              <Footer />
            </Box>
          </Box>
        ) : (
          <div>{children}</div> // Prompt for login if not authenticated
        )}
      </ThemeProvider>
    </Providers>
  );
};

export default RootLayout;