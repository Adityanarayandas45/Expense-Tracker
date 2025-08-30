"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import { supabase } from "../lib/supabaseClient";
import { useColorMode } from "./ThemeProviderWrapper";
import { useRouter } from "next/navigation";

export default function ProfileDialog({
  open,
  onClose,
  userName = "User",
  userEmail = "",
}: {
  open: boolean;
  onClose: () => void;
  userName?: string;
  userEmail?: string;
}) {
  const { toggleColorMode } = useColorMode();
  const router = useRouter();

  const onLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/"); 
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
      BackdropProps={{ sx: { backgroundColor: "rgba(0,0,0,0.6)" } }}
    >
      <DialogTitle sx={{ pb: 0 }}>
        <Box
          sx={{
            height: 90,
            borderRadius: 2,
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.9), rgba(96,165,250,0.8))",
          }}
        />
      </DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        
        <Box sx={{ mt: 3, mb: 3 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: "#7c3aed",
              color: "#fff",
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            {userName?.[0]?.toUpperCase() ?? "U"}
          </Box>
        </Box>

        <TextField label="Name" value={userName} fullWidth sx={{ mb: 2 }} disabled />
        <TextField label="Email" value={userEmail} fullWidth sx={{ mb: 2 }} disabled />

        <Typography variant="body2" sx={{ mb: 1 }}>
          Mode
        </Typography>
        <Chip
          label="Toggle Mode"
          onClick={toggleColorMode}
          sx={{
            mb: 3,
            fontWeight: 700,
            bgcolor: "primary.main",
            color: "#fff",
            cursor: "pointer",
          }}
        />

        <Button variant="outlined" color="inherit" onClick={onLogout} fullWidth>
          LOGOUT
        </Button>
      </DialogContent>
    </Dialog>
  );
}
