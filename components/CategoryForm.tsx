"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { supabase } from "../lib/supabaseClient";

export default function CategoryForm({ onCategoryAdded }: { onCategoryAdded: () => void }) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddCategory = async () => {
    if (!name.trim()) {
      alert("Please enter a category name");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert("You must be logged in to add a category");
        return;
      }

      const { error } = await supabase.from("categories").insert([
        {
          user_id: user.id,
          name,
          icon: icon || "📦", 
        },
      ]);

      if (error) throw error;

      setName("");
      setIcon("");
      onCategoryAdded(); 
    } catch (err: any) {
      alert(err.message ?? "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
      <Typography variant="h6">Add New Category</Typography>
      <TextField
        label="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
      />
      <TextField
        label="Icon (emoji or text)"
        value={icon}
        onChange={(e) => setIcon(e.target.value)}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <span style={{ fontSize: "1.5rem" }}>{icon || "📦"}</span>
            </InputAdornment>
          ),
        }}
      />
      <Button
        variant="contained"
        startIcon={<AddCircleIcon />}
        onClick={handleAddCategory}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Category"}
      </Button>
    </Box>
  );
}
