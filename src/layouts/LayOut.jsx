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
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import Sidebar from "../sidebar/Sidebar";
import NavLogo from "../assets/logos/guru-los.png";
import BackwardIcon from "../assets/logos/BackwordIcon.svg";
import ForwardIcon from "../assets/logos/ForvordIcon.svg";
import SettingIcon from "../assets/logos/SettingIcon.svg";
import { useSelector } from "react-redux";
import API_URL, { IMAGE_API_URL } from "../api/Api_url";
import axios from "axios";
import DefaultImage from "../assets/logos/default.jpg";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Product Library", path: "/dashboard/product_library" },
  { label: "Procurement", path: "/dashboard/procurement/supplier" },
  { label: "Inventory", path: "/dashboard/inventory" },
  { label: "CRM", path: "/dashboard/crm/client-list" },
  { label: "Operations", path: "/dashboard/operations" },
  { label: "Reports", path: "/dashboard/reports" },
  // { label: "HR Management", path: "/dashboard/employees" },

];

const LayOut = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedTab, setSelectedTab] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [section, setSection] = useState("");

  const { user, token } = useSelector((state) => state.auth);

  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/${user?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    if (user?.id && token) {
      fetchProfile();
    }
  }, [user?.id, token]);

  const getSection = () => {
    if (location.pathname.includes("/dashboard/product_library"))
      return "product_library";
    if (location.pathname.includes("/dashboard/procurement"))
      return "procurement";
    if (location.pathname.includes("/dashboard/inventory")) return "inventory";
    if (location.pathname.includes("/dashboard/crm")) return "crm";
    if (location.pathname.includes("/dashboard/operations"))
      return "operations";
    if (location.pathname.includes("/dashboard/users_performance"))
      return "users_performance";
    if (location.pathname.includes("/dashboard/client")) return "client";
    if (location.pathname.includes("/dashboard/reports")) return "reports";
    if (location.pathname.includes("/dashboard/employees")) return "employees";
    if (location.pathname.includes("/dashboard/settings")) return "settings";
    if (location.pathname.includes("/dashboard/profile")) return "profile";

    return "dashboard";
  };

  const findCurrentTabIndex = () => {
    const currentPath = location.pathname;

    if (currentPath.includes("/dashboard/settings") ||
      currentPath.includes("/dashboard/profile")) {
      return null;
    }

    if (currentPath.includes("/dashboard/procurement")) {
      return navItems.findIndex(item => item.label === "Procurement");
    }

    if (currentPath.includes("/dashboard/product_library")) {
      return navItems.findIndex(item => item.label === "Product Library");
    }

    if (currentPath.includes("/dashboard/inventory")) {
      return navItems.findIndex(item => item.label === "Inventory");
    }

    if (currentPath.includes("/dashboard/crm")) {
      return navItems.findIndex(item => item.label === "CRM");
    }

    if (currentPath.includes("/dashboard/operations")) {
      return navItems.findIndex(item => item.label === "Operations");
    }

    if (currentPath.includes("/dashboard/reports")) {
      return navItems.findIndex(item => item.label === "Reports");
    }

    if (currentPath.includes("/dashboard/employees")) {
      return navItems.findIndex(item => item.label === "Employees");
    }

    return navItems.findIndex(item => item.label === "Dashboard");
  };

  useEffect(() => {
    const currentTabIndex = findCurrentTabIndex();

    if (currentTabIndex !== -1 && currentTabIndex !== null) {
      setSelectedTab(currentTabIndex);
    } else {
      setSelectedTab(null);
    }

    setSection(getSection());
  }, [location.pathname]);

  useEffect(() => {
    const currentSection = getSection();
    localStorage.setItem('lastActiveSection', currentSection);
    localStorage.setItem('lastActivePath', location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const lastActiveSection = localStorage.getItem('lastActiveSection');
    const lastActivePath = localStorage.getItem('lastActivePath');

    if (lastActivePath &&
      lastActivePath !== location.pathname &&
      lastActivePath !== '/dashboard' &&
      !lastActivePath.includes('/dashboard/profile') &&
      !lastActivePath.includes('/dashboard/settings')) {
      navigate(lastActivePath);
    }
  }, []);

  const handleTabChange = (_, newValue) => {
    setSelectedTab(newValue);
    navigate(navItems[newValue].path);

    localStorage.setItem('lastActiveSection', getSectionFromTabIndex(newValue));
    localStorage.setItem('lastActivePath', navItems[newValue].path);
  };

  const getSectionFromTabIndex = (index) => {
    switch (index) {
      case 0: return 'dashboard';
      case 1: return 'product_library';
      case 2: return 'procurement';
      case 3: return 'inventory';
      case 4: return 'crm';
      case 5: return 'operations';
      case 6: return 'reports';
      case 7: return 'employees';
      default: return 'dashboard';
    }
  };

  const handleSettingsClick = () => {
    setSection("settings");
    navigate("/dashboard/settings/users");
    localStorage.setItem('lastActiveSection', 'settings');
    localStorage.setItem('lastActivePath', '/dashboard/settings/users');
  };

  const handleProfileClick = () => {
    setSection("profile");
    navigate("/dashboard/profile");
  };

  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = (index) => {
    setMenuAnchor(null);
    if (index !== null) {
      navigate(navItems[index].path);
      localStorage.setItem('lastActiveSection', getSectionFromTabIndex(index));
      localStorage.setItem('lastActivePath', navItems[index].path);
    }
  };

  const toggleMobileDrawer = (open) => () => {
    setMobileDrawerOpen(open);
  };

  const mobileDrawer = (
    <Box sx={{ width: 280 }} role="presentation">
      <List>
        <ListItem>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Navigation
          </Typography>
        </ListItem>
        {navItems.map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => {
              navigate(item.path);
              setMobileDrawerOpen(false);
              localStorage.setItem('lastActiveSection', getSectionFromTabIndex(index));
              localStorage.setItem('lastActivePath', item.path);
            }}
            selected={location.pathname === item.path ||
              (item.label === "Procurement" && location.pathname.includes("/dashboard/procurement")) ||
              (item.label === "CRM" && location.pathname.includes("/dashboard/crm")) ||
              (item.label === "Reports" && location.pathname.includes("/dashboard/reports")) ||
              (item.label === "Employees" && location.pathname.includes("/dashboard/employees"))
            }
              
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <ListItem
          button
          onClick={() => {
            handleSettingsClick();
            setMobileDrawerOpen(false);
          }}
          selected={location.pathname.includes("/dashboard/settings")}
        >
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
      <Divider />
      <Box sx={{ mt: 2 }}>
        <Sidebar section={getSection()} isMobile={true} />
      </Box>
    </Box>
  );

  const shouldShowSidebar = location.pathname !== "/dashboard" &&
    !location.pathname.includes("/dashboard/profile")

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#F4F1FA",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          width: "100%",
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            padding: { xs: "0 12px", sm: "0 24px" },
            minHeight: { xs: 56, sm: 64 },
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Left Section - Logo and Navigation Controls */}
          <Box
            display="flex"
            alignItems="center"
            sx={{
              flex: { xs: 0, md: "0 0 auto" },
              gap: { xs: 0.5, sm: 1 },
            }}
          >
            <IconButton
              sx={{
                border: "1px solid #ddd",
                borderRadius: "50%",
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
                display: { xs: "none", sm: "flex" },
              }}
              onClick={() => navigate(-1)}
            >
              <Box
                component="img"
                src={BackwardIcon}
                alt="Backward"
                sx={{ width: 16, height: 16 }}
              />
            </IconButton>

            <IconButton
              sx={{
                border: "1px solid #ddd",
                borderRadius: "50%",
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
                display: { xs: "none", sm: "flex" },
                ml: 0.5,
              }}
              onClick={() => navigate(1)}
            >
              <Box
                component="img"
                src={ForwardIcon}
                alt="Forward"
                sx={{ width: 16, height: 16 }}
              />
            </IconButton>

            <IconButton
              onClick={toggleMobileDrawer(true)}
              sx={{ display: { xs: "flex", md: "none" }, ml: 0 }}
            >
              <MenuIcon />
            </IconButton>

            <Box
              component="img"
              src={NavLogo}
              alt="Logo"
              sx={{
                maxWidth: { xs: 120, sm: 180, md: 220 },
                height: "auto",
                display: { xs: "none", sm: "block" },
                ml: 1,
              }}
            />
          </Box>

          {/* Center Section - Navigation Tabs */}
          {!isMobile && (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mx: 2,
              }}
            >
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  "& .MuiTabs-flexContainer": {
                    gap: { md: 0.5, lg: 1 },
                  },
                  "& .MuiTab-root": {
                    minWidth: "auto",
                    padding: { md: "6px 12px", lg: "8px 16px" },
                    fontSize: { md: "0.8rem", lg: "0.875rem" },
                    fontWeight: 500,
                    textTransform: "none",
                    letterSpacing: "0.3px",
                    whiteSpace: "nowrap",
                    minHeight: 48,
                    color: "#555",
                    "&.Mui-selected": {
                      color: "#667eea",
                      fontWeight: 600,
                    },
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#667eea",
                    height: 3,
                    borderRadius: "3px 3px 0 0",
                  },
                }}
              >
                {navItems.map((item, index) => (
                  <Tab
                    key={index}
                    label={item.label}
                    sx={{
                      textTransform: "none",
                    }}
                  />
                ))}
              </Tabs>
            </Box>
          )}

          {/* Right Section - Settings and Profile */}
          <Box
            display="flex"
            alignItems="center"
            sx={{
              flex: { xs: 0, md: "0 0 auto" },
              gap: { xs: 0.5, sm: 1 },
            }}
          >
            <IconButton
              onClick={handleSettingsClick}
              size={isSmallMobile ? "small" : "medium"}
              sx={{
                backgroundColor: location.pathname.includes("/dashboard/settings")
                  ? "rgba(102, 126, 234, 0.08)"
                  : "transparent",
                borderRadius: "50%",
                padding: { xs: 0.5, sm: 1 },
                "&:hover": {
                  backgroundColor: "rgba(102, 126, 234, 0.08)",
                },
              }}
            >
              <Box
                component="img"
                src={SettingIcon}
                alt="Settings"
                sx={{
                  width: { xs: 22, sm: 28, md: 32 },
                  height: { xs: 22, sm: 28, md: 32 },
                }}
              />
            </IconButton>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                ml: { xs: 0.5, sm: 1 },
                padding: "4px 8px 4px 4px",
                borderRadius: "30px",
                "&:hover": {
                  backgroundColor: "rgba(102, 126, 234, 0.05)",
                },
              }}
              onClick={handleProfileClick}
            >
              <Avatar
                src={
                  profileData?.image
                    ? `${IMAGE_API_URL}/${profileData?.image}`
                    : DefaultImage
                }
                sx={{
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  border: location.pathname.includes("/dashboard/profile")
                    ? "2px solid #667eea"
                    : "2px solid transparent",
                  "&:hover": {
                    borderColor: "#667eea",
                  },
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DefaultImage;
                }}
              />
              <Typography
                sx={{
                  color: "#171719",
                  display: { xs: "none", sm: "block" },
                  fontSize: { sm: "0.85rem", md: "0.95rem" },
                  fontWeight: 500,
                  maxWidth: { sm: 100, md: 150 },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {profileData?.full_name || "User"}
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={toggleMobileDrawer(false)}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
          },
        }}
      >
        {mobileDrawer}
      </Drawer>

      <Toolbar />

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {shouldShowSidebar && (
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              position: "sticky",
              top: 64,
              height: "calc(100vh - 64px)",
              overflowY: "auto",
              flexShrink: 0,
              width: 280,
              borderRight: "1px solid #e0e0e0",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Sidebar section={getSection()} />
          </Box>
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            height: "calc(100vh - 64px)",
            overflowY: "auto",
            width: shouldShowSidebar ? "calc(100% - 280px)" : "100%",
            transition: "width 0.3s ease",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default LayOut;




// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation, Outlet } from "react-router-dom";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   IconButton,
//   Avatar,
//   Box,
//   Tabs,
//   Tab,
//   useMediaQuery,
//   Menu,
//   MenuItem,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import { useTheme } from "@mui/material/styles";
// import Sidebar from "../sidebar/Sidebar";
// import NavLogo from "../assets/logos/guru-los.png";
// import BackwardIcon from "../assets/logos/BackwordIcon.svg";
// import ForwardIcon from "../assets/logos/ForvordIcon.svg";
// import SettingIcon from "../assets/logos/SettingIcon.svg";
// import { useSelector } from "react-redux";
// import API_URL, { IMAGE_API_URL } from "../api/Api_url";
// import axios from "axios";
// import DefaultImage from "../assets/logos/default.jpg";

// const navItems = [
//   { label: "Dashboard", path: "/dashboard" },
//   { label: "Product Library", path: "/dashboard/product_library" },
//   { label: "Procurement", path: "/dashboard/procurement/supplier" },
//   { label: "Inventory", path: "/dashboard/inventory" },
//   { label: "CRM", path: "/dashboard/crm/client-list" },
// ];

// const LayOut = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));
//   const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const [selectedTab, setSelectedTab] = useState(0);
//   const [menuAnchor, setMenuAnchor] = useState(null);
//   const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
//   const [section, setSection] = useState("");

//   const { user, token } = useSelector((state) => state.auth);

//   const [profileData, setProfileData] = useState(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/users/${user?.id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setProfileData(response.data);
//       } catch (error) {
//         console.error("Failed to fetch profile:", error);
//       }
//     };

//     if (user?.id && token) {
//       fetchProfile();
//     }
//   }, [user?.id, token]);

//   // Function to determine which section the user is on
//   const getSection = () => {
//     if (location.pathname.includes("/dashboard/product_library"))
//       return "product_library";
//     if (location.pathname.includes("/dashboard/procurement"))
//       return "procurement";
//     if (location.pathname.includes("/dashboard/inventory")) return "inventory";
//     if (location.pathname.includes("/dashboard/crm")) return "crm";
//     if (location.pathname.includes("/dashboard/operations"))
//       return "operations";
//     if (location.pathname.includes("/dashboard/users_performance"))
//       return "users_performance";
//     if (location.pathname.includes("/dashboard/client")) return "client";
//     if (location.pathname.includes("/dashboard/reports")) return "reports";
//     if (location.pathname.includes("/dashboard/settings")) return "settings";

//     return "dashboard";
//   };

//   // Update selected tab on route change
//   useEffect(() => {
//     const currentIndex = navItems.findIndex(
//       (item) => item.path === location.pathname
//     );

//     if (location.pathname === "/dashboard/settings") {
//       setSelectedTab(null);
//     } else if (currentIndex !== -1) {
//       setSelectedTab(currentIndex);
//     }

//     // Update the section whenever the location changes
//     setSection(getSection());
//   }, [location.pathname]);

//   const handleTabChange = (_, newValue) => {
//     setSelectedTab(newValue);
//     navigate(navItems[newValue].path);
//   };

//   const handleMenuClick = (event) => {
//     setMenuAnchor(event.currentTarget);
//   };

//   const handleMenuClose = (index) => {
//     setMenuAnchor(null);
//     if (index !== null) {
//       navigate(navItems[index].path);
//     }
//   };

//   const toggleMobileDrawer = (open) => () => {
//     setMobileDrawerOpen(open);
//   };

//   // Mobile navigation drawer - shows both main nav and sidebar items
//   const mobileDrawer = (
//     <Box sx={{ width: 280 }} role="presentation">
//       <List>
//         <ListItem>
//           <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//             Navigation
//           </Typography>
//         </ListItem>
//         {navItems.map((item, index) => (
//           <ListItem
//             button
//             key={index}
//             onClick={() => {
//               navigate(item.path);
//               setMobileDrawerOpen(false);
//             }}
//             selected={location.pathname === item.path}
//           >
//             <ListItemText primary={item.label} />
//           </ListItem>
//         ))}
//       </List>
//       <Divider />

//       {/* Sidebar content for the current section */}
//       <Box sx={{ mt: 2 }}>
//         <Sidebar section={getSection()} isMobile={true} />
//       </Box>
//     </Box>
//   );

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         minHeight: "100vh",
//         backgroundColor: "#F4F1FA",
//       }}
//     >
//       {/* AppBar for navigation */}
//       <AppBar
//         position="fixed"
//         sx={{
//           width: "100%",
//           zIndex: theme.zIndex.drawer + 1,
//           backgroundColor: "#FFFFFF",
//           boxShadow: "none",
//           borderBottom: "1px solid #ddd",
//         }}
//       >
//         <Toolbar
//           sx={{
//             justifyContent: "space-between",
//             padding: { xs: "0 8px", sm: "0 16px" },
//           }}
//         >
//           {/* Left Navigation Buttons */}
//           <Box display="flex" alignItems="center">
//             <IconButton
//               sx={{
//                 border: "1px solid #ddd",
//                 borderRadius: "50%",
//                 width: 40,
//                 height: 40,
//                 display: { xs: "none", sm: "flex" },
//               }}
//               onClick={() => navigate(-1)}
//             >
//               <Box
//                 component="img"
//                 src={BackwardIcon}
//                 alt="Backward"
//                 sx={{ width: 18, height: 18 }}
//               />
//             </IconButton>

//             <IconButton
//               sx={{
//                 border: "1px solid #ddd",
//                 borderRadius: "50%",
//                 width: 40,
//                 height: 40,
//                 ml: 1,
//                 display: { xs: "none", sm: "flex" },
//               }}
//               onClick={() => navigate(1)}
//             >
//               <Box
//                 component="img"
//                 src={ForwardIcon}
//                 alt="Forward"
//                 sx={{ width: 18, height: 18 }}
//               />
//             </IconButton>

//             <IconButton
//               onClick={toggleMobileDrawer(true)}
//               sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
//             >
//               <MenuIcon />
//             </IconButton>

//             <IconButton sx={{ display: { xs: "none", sm: "flex" } }}>
//               <Box
//                 component="img"
//                 src={NavLogo}
//                 alt="Logo"
//                 sx={{
//                   maxWidth: { xs: 150, sm: 200, md: 250 },
//                   height: "auto",
//                   ml: { xs: 0, sm: 1 },
//                 }}
//               />
//             </IconButton>
//           </Box>

//           {/* Desktop Navigation Tabs */}
//           {!isMobile && (
//             <Tabs
//               value={selectedTab}
//               onChange={handleTabChange}
//               textColor="primary"
//               indicatorColor="primary"
//               sx={{
//                 maxWidth: { md: 500, lg: 600 },
//                 "& .MuiTab-root": {
//                   minWidth: "auto",
//                   px: 1.5,
//                   fontSize: { md: "0.8rem", lg: "0.9rem" },
//                 },
//               }}
//             >
//               {navItems.map((item, index) => (
//                 <Tab
//                   key={index}
//                   label={item.label}
//                   sx={{
//                     textTransform: "none",
//                     fontWeight: "bold",
//                   }}
//                 />
//               ))}
//             </Tabs>
//           )}

//           {/* Right Side Icons */}
//           <Box display="flex" alignItems="center">
//             {/* Settings Icon */}
//             <IconButton
//               onClick={() => {
//                 setSection("settings");
//                 navigate("/dashboard/settings/users");
//               }}
//               size={isSmallMobile ? "small" : "medium"}
//             >
//               <Box
//                 component="img"
//                 src={SettingIcon}
//                 alt="Settings"
//                 sx={{
//                   width: { xs: 25, sm: 30, md: 35 },
//                   height: { xs: 25, sm: 30, md: 35 },
//                 }}
//               />
//             </IconButton>

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 1,
//                 cursor: "pointer",
//                 ml: 1,
//               }}
//               onClick={() => navigate("/dashboard/profile")}
//             >
//               <Avatar
//                 src={
//                   profileData?.image
//                     ? `${IMAGE_API_URL}/${profileData?.image}`
//                     : "/default-avatar.png" // local fallback
//                 }
//                 sx={{
//                   width: { xs: 32, sm: 40 },
//                   height: { xs: 32, sm: 40 },
//                   border: "2px solid #667eea",
//                   "&:hover": {
//                     borderColor: "#764ba2",
//                   },
//                 }}
//                 onError={(e) => {
//                   e.target.onerror = null; // prevent infinite loop
//                   e.target.src = "/default-avatar.png"; // fallback to local image
//                 }}
//               ></Avatar>
//               <Typography
//                 sx={{
//                   color: "#171719",
//                   display: { xs: "none", sm: "block" },
//                   fontSize: { sm: "0.9rem", md: "1rem" },
//                 }}
//               >
//                 {profileData?.full_name || "Loading..."}
//               </Typography>
//             </Box>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* Mobile Navigation Drawer - Shows both main nav and sidebar items */}
//       <Drawer
//         anchor="left"
//         open={mobileDrawerOpen}
//         onClose={toggleMobileDrawer(false)}
//         sx={{
//           display: { xs: "block", md: "none" },
//           "& .MuiDrawer-paper": {
//             boxSizing: "border-box",
//             width: 280,
//           },
//         }}
//       >
//         {mobileDrawer}
//       </Drawer>

//       <Toolbar />

//       {/* Main Content with Sidebar */}
//       {/* <Box sx={{ display: "flex", flex: 1 }}>
//         {location.pathname !== "/dashboard" && (
//           <Box
//             sx={{
//               display: { xs: "none", md: "block" },
//               position: "sticky",
//               top: 0,
//               height: "100vh",
//               zIndex: 1200,
//               flexShrink: 0,
//             }}
//           >
//             <Sidebar section={getSection()} />
//           </Box>
//         )}
//         <Box
//           component="main"
//           sx={{
//             flexGrow: 1,
//             p: { xs: 2, sm: 3 },
//             minHeight: "calc(100vh - 64px)",
//             overflowY: "auto", // ✅ only Outlet scrolls
//             width: "100%",
//           }}
//         >
//           <Outlet />
//         </Box>
//       </Box> */}

//       <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
//         {/* Sidebar */}
//         {location.pathname !== "/dashboard" && (
//           <Box
//             sx={{
//               display: { xs: "none", md: "block" },
//               position: "sticky", // or fixed if you want it locked always
//               top: 64, // matches AppBar height
//               height: "calc(100vh - 64px)",
//               overflowY: "auto", // scrollable if sidebar items overflow
//               flexShrink: 0,
//               borderRight: "1px solid #ddd",
//             }}
//           >
//             <Sidebar section={getSection()} />
//           </Box>
//         )}

//         {/* Main Content */}
//         <Box
//           component="main"
//           sx={{
//             flexGrow: 1,
//             p: { xs: 2, sm: 3 },
//             height: "calc(100vh - 64px)",
//             overflowY: "auto", // ✅ only this part scrolls
//           }}
//         >
//           <Outlet />
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default LayOut;

// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation, Outlet } from "react-router-dom";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   IconButton,
//   Avatar,
//   Box,
//   Tabs,
//   Tab,
//   useMediaQuery,
//   Menu,
//   MenuItem,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import { useTheme } from "@mui/material/styles";
// import Sidebar from "../sidebar/Sidebar";
// import NavLogo from "../assets/logos/guru-los.png";
// import BackwardIcon from "../assets/logos/BackwordIcon.svg";
// import ForwardIcon from "../assets/logos/ForvordIcon.svg";
// import SettingIcon from "../assets/logos/SettingIcon.svg";
// import { useSelector } from "react-redux";
// import API_URL, { IMAGE_API_URL } from "../api/Api_url";

// const navItems = [
//   { label: "Dashboard", path: "/dashboard" },
//   { label: "Product Library", path: "/dashboard/product_library" },
//   { label: "Procurement", path: "/dashboard/procurement/supplier" },
//   { label: "Inventory", path: "/dashboard/inventory" },
//   { label: "CRM", path: "/dashboard/crm/client-list" },
//   // { label: "Reports", path: "/dashboard/reports" },
//   // { label: "Users Performance", path: "/dashboard/users_performance" },
//   // { label: "Client", path: "/dashboard/client" },
// ];

// const LayOut = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));
//   const [selectedTab, setSelectedTab] = useState(0);
//   const [menuAnchor, setMenuAnchor] = useState(null);
//   const [section, setSection] = useState(""); // Initialize empty or default section

//   const { user } = useSelector((state) => state.auth);

//   // Function to determine which section the user is on
//   const getSection = () => {
//     if (location.pathname.includes("/dashboard/product_library"))
//       return "product_library";
//     if (location.pathname.includes("/dashboard/procurement"))
//       return "procurement";
//     if (location.pathname.includes("/dashboard/inventory")) return "inventory";
//     if (location.pathname.includes("/dashboard/crm")) return "crm";
//     if (location.pathname.includes("/dashboard/operations"))
//       return "operations";
//     if (location.pathname.includes("/dashboard/users_performance"))
//       return "users_performance";
//     if (location.pathname.includes("/dashboard/client")) return "client";
//     if (location.pathname.includes("/dashboard/reports")) return "reports";
//     if (location.pathname.includes("/dashboard/settings")) return "settings";

//     return "dashboard";
//   };

//   // Update selected tab on route change

//   useEffect(() => {
//     const currentIndex = navItems.findIndex(
//       (item) => item.path === location.pathname
//     );

//     if (location.pathname === "/dashboard/settings") {
//       setSelectedTab(null);
//     } else if (currentIndex !== -1) {
//       setSelectedTab(currentIndex);
//     }
//   }, [location.pathname]);

//   const handleTabChange = (_, newValue) => {
//     setSelectedTab(newValue);
//     navigate(navItems[newValue].path);
//   };

//   const handleMenuClick = (event) => {
//     setMenuAnchor(event.currentTarget);
//   };

//   const handleMenuClose = (index) => {
//     setMenuAnchor(null);
//     if (index !== null) {
//       navigate(navItems[index].path);
//     }
//   };

//   // console.log(localStorage.getItem("user"));

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         height: "100vh",
//         backgroundColor: "#F4F1FA",
//       }}
//     >
//       {/* AppBar for navigation */}
//       <AppBar
//         position="fixed"
//         sx={{
//           width: "100%",
//           zIndex: 1300,
//           backgroundColor: "#FFFFFF",
//           boxShadow: "none",
//           borderBottom: "1px solid #ddd",
//         }}
//       >
//         <Toolbar sx={{ justifyContent: "space-between" }}>
//           {/* Left Navigation Buttons */}
//           <Box display="flex" alignItems="center">
//             <IconButton
//               sx={{
//                 border: "1px solid #ddd",
//                 borderRadius: "50%",
//                 width: 40,
//                 height: 40,
//               }}
//               onClick={() => navigate(-1)}
//             >
//               <Box
//                 component="img"
//                 src={BackwardIcon}
//                 alt="Backward"
//                 sx={{ width: 18, height: 18 }}
//               />
//             </IconButton>

//             <IconButton
//               sx={{
//                 border: "1px solid #ddd",
//                 borderRadius: "50%",
//                 width: 40,
//                 height: 40,
//                 ml: 1,
//               }}
//               onClick={() => navigate(1)}
//             >
//               <Box
//                 component="img"
//                 src={ForwardIcon}
//                 alt="Forward"
//                 sx={{ width: 18, height: 18 }}
//               />
//             </IconButton>

//             <IconButton>
//               <Box
//                 component="img"
//                 src={NavLogo}
//                 alt="Logo"
//                 sx={{ maxWidth: 250, height: "auto", ml: 1 }}
//               />
//             </IconButton>
//           </Box>

//           {/* Desktop Navigation Tabs */}
//           {!isMobile && (
//             <Tabs
//               value={selectedTab}
//               onChange={handleTabChange}
//               textColor="primary"
//               indicatorColor="primary"
//             >
//               {navItems.map((item, index) => (
//                 <Tab
//                   key={index}
//                   label={item.label}
//                   sx={{
//                     textTransform: "none",
//                     // fontWeight: selectedTab === index ? "bold" : "normal",
//                     fontWeight: "bold !important",
//                   }}
//                 />
//               ))}
//             </Tabs>
//           )}

//           {/* Right Side Icons */}
//           <Box display="flex" alignItems="left">
//             {/* Mobile Menu */}
//             {isMobile && (
//               <>
//                 <IconButton onClick={handleMenuClick}>
//                   <MenuIcon />
//                 </IconButton>
//                 <Menu
//                   anchorEl={menuAnchor}
//                   open={Boolean(menuAnchor)}
//                   onClose={() => handleMenuClose(null)}
//                 >
//                   {navItems.map((item, index) => (
//                     <MenuItem
//                       key={index}
//                       onClick={() => handleMenuClose(index)}
//                     >
//                       {item.label}
//                     </MenuItem>
//                   ))}
//                 </Menu>
//               </>
//             )}

//             {/* Settings Icon */}
//             <IconButton
//               onClick={() => {
//                 setSection("settings"); // Set section to settings
//                 navigate("/dashboard/settings/users"); // Navigate to settings page
//               }}
//             >
//               <Box
//                 component="img"
//                 src={SettingIcon}
//                 alt="Settings"
//                 sx={{ width: 35, height: 35, ml: 1 }}
//               />
//             </IconButton>

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 1,
//                 cursor: "pointer",
//               }}
//               onClick={() => navigate("/dashboard/profile")}
//             >
//               <Avatar
//                 src={
//                   user.image
//                     ? `${IMAGE_API_URL}/${user.image}`
//                     : "https://via.placeholder.com/40"
//                 }
//                 alt={user.full_name}
//                 sx={{
//                   border: "2px solid #667eea",
//                   "&:hover": {
//                     borderColor: "#764ba2",
//                   },
//                 }}
//               />{" "}
//               <Typography sx={{ color: "#171719" }}>
//                 {user.full_name}
//               </Typography>
//             </Box>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       <Toolbar />

//       {/* Main Content with Sidebar */}
//       <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
//         {location.pathname !== "/dashboard" && (
//           <Box
//             sx={{ position: "sticky", top: 0, height: "100vh", zIndex: 1200 }}
//           >
//             <Sidebar section={getSection()} />
//           </Box>
//         )}
//         <Box
//           component="main"
//           sx={{
//             flexGrow: 1,
//             p: 3,
//             height: "calc(100vh - 64px)",
//             overflowY: "auto",
//           }}
//         >
//           <Outlet />
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default LayOut;
