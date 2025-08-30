"use client";

import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { supabase } from "../../../lib/supabaseClient";
import CategoryForm from "../../../components/CategoryForm";
import styles from "../../../styles/Categories.module.css"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [addOpen, setAddOpen] = useState(false); 

  
  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");
    if (!error && data) setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) alert(error.message);
    else fetchCategories();
  };

  
  const handleEditOpen = (cat: any) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditIcon(cat.icon || "");
  };

  
  const handleEditSave = async () => {
    if (!editingCategory) return;
    const { error } = await supabase
      .from("categories")
      .update({ name: editName, icon: editIcon })
      .eq("id", editingCategory.id);

    if (error) alert(error.message);
    else {
      setEditingCategory(null);
      fetchCategories();
    }
  };

  return (
    <Box
    sx={{
      flex: 1,
      height: "calc(100vh - 64px)", 
      width: "100%",
      bgcolor: "background.default",
      overflow: "hidden", 
      display: "flex",
      flexDirection: "column",
    }}
  >
  
    <Typography variant="h5" gutterBottom>
      Categories
    </Typography>

    
    <div className={styles.container}>
    
      <div className={styles.addCard} onClick={() => setAddOpen(true)}>
        <Add className={styles.addIcon} />
      </div>

      
      {categories.map((cat) => (
        <div className={styles.categoryCard} key={cat.id}>
          <div className={styles.categoryTitle}>
            {cat.icon || "📦"} {cat.name}
          </div>
          <div className={styles.actions}>
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleEditOpen(cat)}
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(cat.id)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </div>
        </div>
      ))}
    </div>

    
    <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="xs" fullWidth>
      <DialogTitle>Add Category</DialogTitle>
      <DialogContent>
        <CategoryForm
          onCategoryAdded={() => {
            fetchCategories();
            setAddOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>

    
    <Dialog open={!!editingCategory} onClose={() => setEditingCategory(null)}>
      <DialogTitle>Edit Category</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <TextField
          label="Category Name"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Icon (emoji or text)"
          value={editIcon}
          onChange={(e) => setEditIcon(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setEditingCategory(null)}>Cancel</Button>
        <Button onClick={handleEditSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
);

}
