"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
} from "@mui/material";

export default function Navbar({
  onProfileOpen,
  userName,
  userEmail,
}: {
  onProfileOpen: () => void;
  userName?: string;
  userEmail?: string;
}) {
  
  const initial =
    userName?.charAt(0).toUpperCase() ||
    userEmail?.charAt(0).toUpperCase() ||
    "?";

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "var(--mui-palette-background-default)",
        boxShadow: "none",
        marginTop: 1,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
        <Typography variant="h6" color="primary">
          ExpenseSmart
        </Typography>

        
        <IconButton onClick={onProfileOpen}>
          <Avatar sx={{ bgcolor: "purple" }}>{initial}</Avatar>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
