import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Tabs,
  Tab,
  useMediaQuery,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import Sidebar from "../sidebar/Sidebar";
import NavLogo from "../assets/logos/guru-los.png";
import BackwardIcon from "../assets/logos/BackwordIcon.svg";
import ForwardIcon from "../assets/logos/ForvordIcon.svg";
import SettingIcon from "../assets/logos/SettingIcon.svg";
import { useSelector } from "react-redux";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  {
    label: "Product Library",
    path: "/dashboard/product_library/product_template",
  }, // Fixed typ
  { label: "Procurement", path: "/dashboard/procurement/purchase-request" },
  { label: "Inventory", path: "/dashboard/inventory/products" },
  { label: "CRM", path: "/dashboard/crm" },
  { label: "Operations", path: "/dashboard/operations" },
  { label: "Users Performance", path: "/dashboard/users_performance" },
  { label: "Client", path: "/dashboard/clients" },
];

const LayOut = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedTab, setSelectedTab] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [section, setSection] = useState(""); // Initialize empty or default section

  const { user } = useSelector((state) => state.auth);

  // Function to determine which section the user is on
  const getSection = () => {
    if (location.pathname.includes("/dashboard/product_library"))
      return "product_library";
    if (location.pathname.includes("/dashboard/procurement"))
      return "procurement";
    if (location.pathname.includes("/dashboard/inventory/products")) 
      return "inventory";
    if (location.pathname.includes("/dashboard/crm")) 
      return "crm";
    if (location.pathname.includes("/dashboard/operations"))
      return "operations";
    if (location.pathname.includes("/dashboard/users_performance"))
      return "users_performance";
    if (location.pathname.includes("/dashboard/client")) 
      return "client";
    if (location.pathname.includes("/dashboard/settings"))
       return "settings"; 

    return "dashboard";
  };

  // Update selected tab on route change

  useEffect(() => {
    const currentIndex = navItems.findIndex(
      (item) => item.path === location.pathname
    );

    if (location.pathname === "/dashboard/settings") {
      setSelectedTab(null);
    } else if (currentIndex !== -1) {
      setSelectedTab(currentIndex);
    }
  }, [location.pathname]);

  const handleTabChange = (_, newValue) => {
    setSelectedTab(newValue);
    navigate(navItems[newValue].path);
  };

  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = (index) => {
    setMenuAnchor(null);
    if (index !== null) {
      navigate(navItems[index].path);
    }
  };

  // console.log(localStorage.getItem("user"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#F4F1FA",
      }}
    >
      {/* AppBar for navigation */}
      <AppBar
        position="fixed"
        sx={{
          width: "100%",
          zIndex: 1300,
          backgroundColor: "#FFFFFF",
          boxShadow: "none",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left Navigation Buttons */}
          <Box display="flex" alignItems="center">
            <IconButton
              sx={{
                border: "1px solid #ddd",
                borderRadius: "50%",
                width: 40,
                height: 40,
              }}
              onClick={() => navigate(-1)}
            >
              <Box
                component="img"
                src={BackwardIcon}
                alt="Backward"
                sx={{ width: 18, height: 18 }}
              />
            </IconButton>

            <IconButton
              sx={{
                border: "1px solid #ddd",
                borderRadius: "50%",
                width: 40,
                height: 40,
                ml: 1,
              }}
              onClick={() => navigate(1)}
            >
              <Box
                component="img"
                src={ForwardIcon}
                alt="Forward"
                sx={{ width: 18, height: 18 }}
              />
            </IconButton>

            <IconButton>
              <Box
                component="img"
                src={NavLogo}
                alt="Logo"
                sx={{ maxWidth: 250, height: "auto", ml: 1 }}
              />
            </IconButton>
          </Box>

          {/* Desktop Navigation Tabs */}
          {!isMobile && (
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
            >
              {navItems.map((item, index) => (
                <Tab
                  key={index}
                  label={item.label}
                  sx={{
                    textTransform: "none",
                    // fontWeight: selectedTab === index ? "bold" : "normal",
                    fontWeight: "bold !important",
                  }}
                />
              ))}
            </Tabs>
          )}

          {/* Right Side Icons */}
          <Box display="flex" alignItems="left">
            {/* Mobile Menu */}
            {isMobile && (
              <>
                <IconButton onClick={handleMenuClick}>
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={menuAnchor}
                  open={Boolean(menuAnchor)}
                  onClose={() => handleMenuClose(null)}
                >
                  {navItems.map((item, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => handleMenuClose(index)}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}

            {/* Settings Icon */}
            <IconButton
              onClick={() => {
                setSection("settings"); // Set section to settings
                navigate("/dashboard/settings"); // Navigate to settings page
              }}
            >
              <Box
                component="img"
                src={SettingIcon}
                alt="Settings"
                sx={{ width: 35, height: 35, ml: 1 }}
              />
            </IconButton>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
              }}
              onClick={() => navigate("/dashboard/profile")}
            >
              <Avatar src="https://via.placeholder.com/40" />
              <Typography sx={{ color: "#171719" }}>{user.name}</Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Toolbar Spacer */}
      <Toolbar />

      {/* Main Content with Sidebar */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar with dynamic section */}

        {location.pathname !== "/dashboard" && (
          <Box
            sx={{ position: "sticky", top: 0, height: "100vh", zIndex: 1200 }}
          >
            <Sidebar section={getSection()} />
          </Box>
        )}

        {/* Main Content with scroll */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,

            p: 3,

            height: "calc(100vh - 64px)", // subtract AppBar height

            overflowY: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default LayOut;
