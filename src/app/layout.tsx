"use client";
import ThemeProviderWrapper from "../../components/ThemeProviderWrapper";
import Providers from "../../components/Providers";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import { CssBaseline } from "@mui/material";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, height: "100%", width: "100%" }}>
        <Provider store={store}>
          <ThemeProviderWrapper>
            
            <CssBaseline />
            <Providers>{children}</Providers>
          </ThemeProviderWrapper>
        </Provider>
      </body>
    </html>
  );
}
