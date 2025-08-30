"use client";

import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { supabase } from "../../../lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password", 
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("✅ Password reset link sent! Check your email.");
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" gutterBottom>
          Forgot Password
        </Typography>

        <form onSubmit={handleReset}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        {message && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2 }}
          >
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
