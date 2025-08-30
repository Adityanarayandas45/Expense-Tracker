"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  
  useEffect(() => {
    const exchangeSession = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error("Session exchange error:", error.message);
          setMessage("Invalid or expired reset link.");
        }
        setLoading(false);
        return;
      }

      
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const access_token = hashParams.get("access_token");
        const refresh_token = hashParams.get("refresh_token");

        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) {
            console.error("Set session error:", error.message);
            setMessage("Invalid or expired reset link.");
          }
        } else {
          setMessage("Invalid reset link.");
        }
      }

      setLoading(false);
    };

    exchangeSession();
  }, []);

  
  const handleUpdate = async () => {
    setMessage("");
    const { error } = await supabase.auth.updateUser({ password });
  
    if (error) {
      setMessage(error.message);
    } else {
      
      await supabase.auth.signOut();
  
      setMessage("✅ Password has been reset successfully! Please sign in again.");
      setTimeout(() => router.push("/signin"), 2000);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <Typography>Loading reset session...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" gutterBottom>
          Reset Password
        </Typography>

        <TextField
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleUpdate}
          disabled={!password}
        >
          Update Password
        </Button>

        {message && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
