"use client";

import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import Link from "next/link";
import { supabase } from "../../../lib/supabaseClient";
import styles from "../../../styles/Auth.module.css";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
      return;
    }
  };

  return (
    <div className={styles.authWrapper}>
    
      <div className={styles.authImage}></div>

      
      <div className={styles.authContent}>
        <Card sx={{ width: "100%", maxWidth: 400, p: 3, borderRadius: 2, boxShadow: 4 }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Create Your Account
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Please enter your details
            </Typography>

            <Button
              fullWidth
              variant="contained"
              startIcon={<GoogleIcon />}
              sx={{ mt: 2, mb: 2, background: "#4285F4" }}
            >
              Sign Up with Google
            </Button>

            <Divider sx={{ my: 2 }}>or</Divider>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
              />

              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, background: "#1976d2" }}>
                Submit
              </Button>
            </form>

            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Already have an account?{" "}
              <Link href="/signin" className={styles.link}>
                Sign In
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
