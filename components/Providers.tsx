"use client";

import Navbar from "./Navbar";
import Sidebar, { SIDEBAR_WIDTH } from "./Sidebar"; 
import ProfileDialog from "./ProfileDialog";
import { supabase } from "../lib/supabaseClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CircularProgress, Box } from "@mui/material";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      setSession(data.session);
      setLoading(false);

      
      if (!data.session) {
        if (
          ["/dashboard", "/transactions", "/categories", "/budget", "/summary"].includes(
            pathname
          )
        ) {
          router.replace("/signin");
        }
      } else {
        if (pathname === "/signin" || pathname === "/signup") {
          router.replace("/dashboard");
        }
      }
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);

      if (newSession) {
        if (pathname === "/signin" || pathname === "/signup") {
          router.replace("/dashboard");
        }
      } else {
        if (
          ["/dashboard", "/transactions", "/categories", "/budget", "/summary"].includes(
            pathname
          )
        ) {
          router.replace("/");
        }
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [router, pathname]);

  
  useEffect(() => {
    if (session) {
      setProfileOpen(false);
    }
  }, [session]);

  if (loading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const isPublicPage = [
    "/",
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password"
  ].includes(pathname);

  return (
    <QueryClientProvider client={queryClient}>
      {session && !isPublicPage ? (
        <>
          <Navbar
            onProfileOpen={() => setProfileOpen(true)}
            userName={
              session?.user?.user_metadata?.full_name ||
              session?.user?.email?.split("@")[0]
            }
            userEmail={session?.user?.email}
          />

          <Sidebar />
          <main
            style={{
              marginLeft: SIDEBAR_WIDTH, 
              paddingTop: "64px",
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
          >
            {children}
          </main>
          <ProfileDialog
            open={profileOpen}
            onClose={() => setProfileOpen(false)}
            userName={
              session?.user?.user_metadata?.full_name ||
              session?.user?.email?.split("@")[0]
            }
            userEmail={session?.user?.email}
          />
        </>
      ) : (
        <main>{children}</main>
      )}
    </QueryClientProvider>
  );
}
