import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// MUI Components & Icons
import { AppBar, Toolbar, Typography, Box, Avatar, Chip, Button, Stack } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: "#1e293b", borderBottom: "1px solid #334155" }}>
      <Toolbar className="container-fluid px-4 py-2" sx={{ justifyContent: "space-between" }}>
        {/* Crisp Campus Brand Title */}
        <Box
          onClick={() => navigate("/")}
          sx={{ display: "flex", alignItems: "center", gap: 1.2, cursor: "pointer", userSelect: "none" }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "8px",
              backgroundColor: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AccountBalanceIcon sx={{ color: "#ffffff", fontSize: 20 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1rem", color: "#f8fafc", letterSpacing: "-0.2px" }}>
            Campus Research &amp; IP Hub
          </Typography>
        </Box>

        {/* User Identity & Actions */}
        {user && (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Chip
              icon={user.role === "FACULTY" ? <VerifiedUserIcon style={{ color: "#34d399", fontSize: 15 }} /> : <SchoolIcon style={{ color: "#60a5fa", fontSize: 15 }} />}
              label={`${user.role} • ${user.department}`}
              size="small"
              className="d-none d-md-inline-flex"
              sx={{
                backgroundColor: "#0f172a",
                color: "#cbd5e1",
                fontWeight: 600,
                fontSize: "0.75rem",
                px: 0.8,
                py: 0.4,
                border: "1px solid #334155",
              }}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, backgroundColor: "#0f172a", py: 0.4, px: 1.2, borderRadius: "20px", border: "1px solid #334155" }}>
              <Avatar sx={{ width: 26, height: 26, bgcolor: user.role === "FACULTY" ? "#059669" : "#2563eb", fontSize: "0.78rem", fontWeight: 700 }}>
                {user.name ? user.name.charAt(0) : "U"}
              </Avatar>
              <Typography variant="body2" sx={{ color: "#f8fafc", fontWeight: 600, fontSize: "0.8rem" }}>
                {user.name}
              </Typography>
            </Box>

            <Button
              variant="outlined"
              size="small"
              startIcon={<LogoutIcon sx={{ fontSize: 15 }} />}
              onClick={handleLogout}
              sx={{
                color: "#cbd5e1",
                borderColor: "#334155",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.76rem",
                px: 1.5,
                borderRadius: "6px",
                "&:hover": {
                  backgroundColor: "#334155",
                  color: "#ffffff",
                  borderColor: "#475569",
                },
              }}
            >
              Sign Out
            </Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}
