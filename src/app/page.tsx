"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Dashboard,
  Receipt,
  AccountBalanceWallet,
  Summarize,
} from "@mui/icons-material";

export default function LandingPage() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setLoggedIn(!!data.session);
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((_evt, session) =>
      setLoggedIn(!!session)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  
  const goDashboard = () => {
    if (loggedIn) {
      router.push("/dashboard");
      return;
    }
    Swal.fire({
      icon: "info",
      title: "Please sign in",
      text: "Create an account or sign in to access your Dashboard.",
      confirmButtonText: "Go to Sign In",
      confirmButtonColor: "#4f7cf7",
      showCancelButton: true,
      reverseButtons: true,
    }).then((res) => {
      if (res.isConfirmed) router.push("/signin");
    });
  };


  const getStarted = () => {
    if (loggedIn) {
      router.push("/dashboard");
    } else {
      router.push("/signup");
    }
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
    
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          py: 2,
          position: "sticky",
          top: 0,
          bgcolor: "background.paper",
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0.2 }}>
              <Box
                component="span"
                sx={{
                  mr: 1,
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                }}
              />
              ExpenseSmart
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={goDashboard}>
                Dashboard
              </Button>
              <Button variant="contained" onClick={getStarted}>
                Get Started
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Manage your Money with Personal
        </Typography>
        <Typography
          variant="h1"
          sx={{
            fontWeight: 900,
            fontSize: { xs: 44, sm: 64, md: 88 },
            color: "primary.main",
            mb: 5,
          }}
        >
          Expense Tracker
        </Typography>

        
        <Paper
          elevation={4}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            display: "flex",
            minHeight: 400,
            maxWidth: 900,
            mx: "auto",
          }}
        >
          
          <Box sx={{ width: 200, bgcolor: "black", borderRight: "1px solid #ddd", p: 2,color:"white", }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "primary.main" }}>
              ExpenseSmart
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Dashboard color="primary" />
                </ListItemIcon>
                <ListItemText primary="Overview" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Receipt color="primary" />
                </ListItemIcon>
                <ListItemText primary="Transactions" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AccountBalanceWallet color="primary" />
                </ListItemIcon>
                <ListItemText primary="Categories" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Summarize color="primary" />
                </ListItemIcon>
                <ListItemText primary="Budget" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Dashboard color="primary" />
                </ListItemIcon>
                <ListItemText primary="Summary" />
              </ListItem>
            </List>
          </Box>

          
          <Box sx={{ flex: 1, p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Hi,👋
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Here’s what’s happening with your money. Let’s manage your expense.
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              ExpenseSmart suggests saving a significant portion of your income
              while reducing unnecessary expenses. Invest wisely and manage your
              budget effectively.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
