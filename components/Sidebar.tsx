"use client";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import {
  Dashboard,
  Receipt,
  Category,
  AccountBalanceWallet,
  Summarize,
} from "@mui/icons-material";
import Link from "next/link";

export const SIDEBAR_WIDTH = 320; 

const menuItems = [
  { label: "Overview", icon: <Dashboard fontSize="large" />, path: "/dashboard" },
  { label: "Transactions", icon: <Receipt fontSize="large" />, path: "/transactions" },
  { label: "Category", icon: <Category fontSize="large" />, path: "/categories" },
  { label: "Budget", icon: <AccountBalanceWallet fontSize="large" />, path: "/budget" },
  { label: "Summary", icon: <Summarize fontSize="large" />, path: "/summary" },
];

export default function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        [`& .MuiDrawer-paper`]: {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
          backgroundColor: "background.paper",
          borderRight: "1px solid #eee",
          borderColor: "divider",
        },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.path}
            passHref
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItemButton sx={{ py: 2 }}>
              <ListItemIcon sx={{ color: "#4f7cf7", minWidth: 60 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{ flexGrow:1 }} 
                primaryTypographyProps={{
                  fontSize: "1.3rem",
                  fontWeight: 600,
                }}
              />
            </ListItemButton>
          </Link>
        ))}
      </List>
    </Drawer>
  );
}
