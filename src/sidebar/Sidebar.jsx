import React, { useState, useEffect, useRef } from "react";

import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Typography,
  useTheme,
  Divider,
  Collapse,
  Chip,
  alpha,
  Tooltip,
  IconButton,
} from "@mui/material";

import { Link, useLocation } from "react-router-dom";
import { IoMdSwap } from "react-icons/io";

import WorkIcon from "@mui/icons-material/Work";
import PeopleIcon from "@mui/icons-material/People";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ContactsIcon from "@mui/icons-material/Contacts";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PurchaseRequestsIcon from "@mui/icons-material/ShoppingCart";
import POQuotationsIcon from "@mui/icons-material/Description";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import BarChartIcon from "@mui/icons-material/BarChart";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { MdAttachMoney, MdOutlineComputer } from "react-icons/md";

// Add these new imports at the top with your other MUI icon imports
import InventoryIcon from "@mui/icons-material/Inventory";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SellIcon from "@mui/icons-material/Sell"; // or LocalOfferIcon
import CategoryIcon from "@mui/icons-material/Category";
import FactoryIcon from "@mui/icons-material/Factory";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import BuildIcon from "@mui/icons-material/Build";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import BusinessIcon from "@mui/icons-material/Business";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SettingsIcon from "@mui/icons-material/Settings";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import HandymanIcon from "@mui/icons-material/Handyman";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GroupIcon from "@mui/icons-material/Group";
import GroupsIcon from '@mui/icons-material/Groups';

// Add these new MUI icon imports to your existing list
import TimelineIcon from "@mui/icons-material/Timeline";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import VpnKeyIcon from "@mui/icons-material/VpnKey"; // For Roles
import LocationOnIcon from "@mui/icons-material/LocationOn"; // For Address
import ReceiptIcon from "@mui/icons-material/Receipt"; // For Tax List
import AccountTreeIcon from "@mui/icons-material/AccountTree"; // For Branch
import MemoryIcon from "@mui/icons-material/Memory"; // For RAM
import StorageIcon from "@mui/icons-material/Storage"; // For Hard Disc

import {
  FaUserTie,
  FaBriefcase,
  FaIndustry,
  FaChalkboardTeacher,
  FaUserMinus,
  FaMoneyCheckAlt,
} from "react-icons/fa";

import {
  MdOutlineAirlineSeatLegroomNormal,
  MdQuestionAnswer,
  MdTranslate,
  MdTravelExplore,
  MdDonutLarge,
  MdAccessTime,
} from "react-icons/md";

import { GiBrainstorm } from "react-icons/gi";
import { RiCurrencyFill } from "react-icons/ri";

const drawerWidth = 320;

const Sidebar = ({ section }) => {
  const theme = useTheme();
  const location = useLocation();
  const [hoverIndex, setHoverIndex] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const mouseTracker = useRef({ x: 0, y: 0 });

  let menuItems = [];
  let sectionTitle = "";
  let sectionIcon = null;

  switch (section) {
    case "product_library":
      sectionTitle = "Product Library";
      sectionIcon = <InventoryIcon />;
      menuItems = [
        {
          text: "Product Template",
          path: "/dashboard/product_library",
          icon: <ListAltIcon />,
          description: "Manage product templates",
        },
        {
          text: "Brands",
          path: "/dashboard/product_library/brands",
          icon: <SellIcon />,
          description: "Brand management",
        },
        {
          text: "Product Categories",
          path: "/dashboard/product_library/product_categories",
          icon: <CategoryIcon />,
          description: "Category organization",
        },
        // {
        //   text: "Stock Locations",
        //   path: "/dashboard/product_library/stock_locations",
        //   icon: <ApartmentIcon />,
        //   description: "Warehouse locations",
        // },
      ];
      break;

    case "procurement":
      sectionTitle = "Procurement";
      sectionIcon = <ShoppingCartIcon />;
      menuItems = [
        {
          text: "Supplier",
          path: "/dashboard/procurement/supplier",
          icon: <FactoryIcon />,
          description: "Supplier management",
        },
        {
          text: "Purchase Requests",
          path: "/dashboard/procurement/purchase-requests",
          icon: <AssignmentIcon />,
          description: "New purchase requests",
          // badge: "12",
        },
        {
          text: "PO Quotations",
          path: "/dashboard/procurement/po-quotations",
          icon: <DescriptionIcon />,
          description: "Purchase order quotes",
        },
        {
          text: "Purchase Orders",
          path: "/dashboard/procurement/purchase-orders",
          icon: <AssignmentTurnedInIcon />,
          description: "Active purchase orders",
        },
        {
          text: "Goods Receipt",
          path: "/dashboard/procurement/goodsreceipt",
          icon: <InventoryIcon />,
          description: "Received goods tracking",
        },
        // {
        //   text: "Asset-IDs",
        //   path: "/dashboard/procurement/asset",
        //   icon: <LocalShippingIcon />,
        //   description: "Asset-IDs",
        // },
      ];
      break;

    case "inventory":
      sectionTitle = "Inventory";
      sectionIcon = <InventoryIcon />;
      menuItems = [
        {
          text: "Product List",
          path: "/dashboard/inventory",
          icon: <PlaylistAddCheckIcon />,
          description: "All inventory items",
        },

        {
          text: "Assembled Products",
          path: "/dashboard/inventory/assembled-products",
          icon: <BuildIcon />,
          description: "All inventory items",
        },
        // {
        //   text: "Assets Modifications",
        //   path: "/dashboard/inventory/asset-modifications",
        //   icon: <GroupIcon />,
        //   description: "All inventory items",
        // },
        {
          text: "Wear House",
          path: "/dashboard/inventory/wear-house",
          icon: <HomeWorkIcon />,
          description: "Wear House",
        },
        {
          text: "Clinet Place",
          path: "/dashboard/inventory/client-place",
          icon: <BusinessIcon />,
          description: "Clinet Place",
        },
        {
          text: "Scrap",
          path: "/dashboard/inventory/swap",
          icon: <IoMdSwap />,
          description: "Clinet Place",
        },
      ];
      break;

    case "crm":
      sectionTitle = "Customer Relationship";
      sectionIcon = <GroupIcon />;
      menuItems = [
        {
          text: "Client List",
          path: "/dashboard/crm/client-list",
          icon: <ContactPhoneIcon />,
          description: "Customer database",
        },
        {
          text: "Leads",
          path: "/dashboard/crm/lead",
          icon: <StarOutlineIcon />,
          description: "Potential customers",
          // badge: "New",
        },
        {
          text: "Quotations",
          path: "/dashboard/crm/quotations",
          icon: <RequestQuoteIcon />,
          description: "Price quotations",
        },
        {
          text: "Sales Orders",
          path: "/dashboard/crm/orders",
          icon: <PointOfSaleIcon />,
          description: "Customer orders",
        },

        {
          text: "Order Preparations",
          path: "/dashboard/crm/dispatch-orders",
          icon: <ExitToAppIcon />,
          description: "Order Preparations",
        },
        //  {
        //   text: "Return Orders",
        //   path: "/dashboard/crm/credit_notes",
        //   icon: <MoneyOffIcon />,
        //   description: "Return Orders",
        // },

        //  {
        //   text: "Order Asset Modification",
        //   path: "/dashboard/crm/asset_modification_tracker",
        //   icon: <BuildCircleIcon />,
        //   description: "Track asset changes",
        // },
      ];
      break;

    case "operations":
      sectionTitle = "Operations";
      sectionIcon = <SettingsIcon />;
      menuItems = [
        {
          text: "Delivery Challan",
          path: "/dashboard/operations",
          icon: <LocalShippingIcon />,
          description: "Delivery documents",
        },
        // {
        //   text: "Assets Modifications",
        //   path: "/dashboard/operations/asset-updation",
        //   icon: <GroupIcon />,
        //   description: "All inventory items",
        // },
        {
          text: "Invoices",
          path: "/dashboard/operations/invoices",
          icon: <ReceiptIcon />,
          description: "Invoice management",
        },
        {
          text: "Credit Notes",
          path: "/dashboard/operations/credit-notes",
          icon: <AssignmentReturnIcon />,
          description: "Credit note management",
        },
        // {
        //   text: "Service",
        //   path: "/dashboard/operations/service",
        //   icon: <MiscellaneousServicesIcon />,
        //   description: "Service management",
        // },
        {
          text: "GRN",
          path: "/dashboard/operations/grn",
          icon: <MoveToInboxIcon />,
          description: "Goods return notes",
        },
        {
          text: "Plain GRN",
          path: "/dashboard/operations/plain-grn",
          icon: <MoveToInboxIcon />,
          description: "Goods return notes",
        },

        {
          text: "Service & Maintenance",
          path: "/dashboard/operations/service_maintenance",
          icon: <HandymanIcon />,
          description: "Invoice management",
        },
        {
          text: "Courier Charges",
          path: "/dashboard/operations/courier-charges",
          icon: <AttachMoneyIcon />,
          description: "Invoice management",
        },
        {
          text: "Client Journey",
          path: "/dashboard/operations/client_journey",
          icon: <TravelExploreIcon />,
          description: "Customer journey tracking",
        },

        //  {
        //   text: "Feedback",
        //   path: "/dashboard/operations/feedback",
        //   icon: <FeedbackIcon/>,
        //   description: "Customer feedback",
        // },
      ];
      break;

    case "users_performance":
      sectionTitle = "Users Performance";
      sectionIcon = <AssessmentIcon />;
      menuItems = [
        {
          text: "Performance List",
          path: "/dashboard/users_performance/user",
          icon: <TrendingUpIcon />,
          description: "User performance metrics",
        },
      ];
      break;

    case "client":
      sectionTitle = "Client";
      sectionIcon = <BusinessIcon />;
      menuItems = [
        {
          text: "Client List",
          path: "/dashboard/client/client",
          icon: <GroupIcon />,
          description: "Client management",
        },
      ];
      break;
    case "reports":
      sectionTitle = "Reports";
      sectionIcon = <AssessmentIcon />;
      menuItems = [
        {
          text: "Report Library",
          path: "/dashboard/reports",
          icon: <SummarizeIcon />,
          description: "Track overall sales metrics",
        },
        // {
        //   text: "Sales Performance Report",
        //   path: "/dashboard/reports/sales_performance_report",
        //   icon: <BarChartIcon />,
        //   description: "Track overall sales metrics",
        // },
      ];
      break;

    case "settings":
      sectionTitle = "Settings";
      sectionIcon = <SettingsIcon />;
      menuItems = [
        {
          text: "Users",
          path: "/dashboard/settings/users",
          icon: <PeopleIcon />,
          description: "User management",
        },
        {
          text: "Roles",
          path: "/dashboard/settings/roles",
          icon: <VpnKeyIcon />,
          description: "Role permissions",
        },
        // {
        //   text: "Address",
        //   path: "/dashboard/settings/address",
        //   icon: <LocationOnIcon />,
        //   description: "Address management",
        // },
        // {
        //   text: "Contact Type",
        //   path: "/dashboard/settings/contact_type",
        //   icon: <ContactPhoneIcon />,
        //   description: "Contact categorization",
        // },
        // {
        //   text: "Tax List",
        //   path: "/dashboard/settings/taxt_list",
        //   icon: <ReceiptIcon />,
        //   description: "Tax configuration",
        // },
        {
          text: "Branch",
          path: "/dashboard/settings/branches",
          icon: <AccountTreeIcon />,
          description: "Branch management",
        },
        // {
        //   text: "RAM",
        //   path: "/dashboard/settings/ram",
        //   icon: <MemoryIcon />,
        //   description: "Ram",
        // },
        // {
        //   text: "Hard Disc",
        //   path: "/dashboard/settings/hard-disc",
        //   icon: <StorageIcon />,
        //   description: "Hard Disc",
        // },
      ];
      break;

    default:
  }

  const [selected, setSelected] = useState(
    menuItems.length > 0 ? menuItems[0].path : ""
  );

  useEffect(() => {
    setSelected(location.pathname);
  }, [location.pathname]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseTracker.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          height: "calc(100vh - 65px)",
          background: `
            radial-gradient(ellipse at top left, rgba(26, 35, 126, 0.98) 0%, transparent 45%),
            radial-gradient(ellipse at bottom right, rgba(1, 87, 155, 0.95) 0%, transparent 45%),
            radial-gradient(ellipse at center, rgba(63, 81, 181, 0.1) 0%, transparent 70%),
            linear-gradient(160deg,
              #0f1419 0%,
              #1a237e 8%,
              #283593 20%,
              #1565c0 40%,
              #0d47a1 70%,
              #01579b 90%,
              #0d47a1 100%
            )
          `,
          borderRight: "1px solid rgba(100, 181, 246, 0.15)",
          backdropFilter: "blur(40px) saturate(180%)",
          boxShadow: `
            inset 0 0 0 1px rgba(100, 181, 246, 0.08),
            32px 0 80px rgba(13, 71, 161, 0.4),
            16px 0 40px rgba(1, 87, 155, 0.3),
            0 0 0 0.5px rgba(100, 181, 246, 0.12)
          `,
          paddingTop: "0",
          overflowX: "hidden",
          overflowY: "auto",
          position: "relative",
          // Enhanced scrollbar
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(255, 255, 255, 0.02)",
            borderRadius: "12px",
            margin: "12px 0",
            border: "1px solid rgba(100, 181, 246, 0.05)",
          },
          "&::-webkit-scrollbar-thumb": {
            background: `linear-gradient(180deg,
              rgba(100, 181, 246, 0.8) 0%,
              rgba(63, 81, 181, 0.6) 50%,
              rgba(25, 118, 210, 0.5) 100%
            )`,
            borderRadius: "12px",
            border: "2px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 0 12px rgba(100, 181, 246, 0.3)",
            "&:hover": {
              background: `linear-gradient(180deg,
                rgba(100, 181, 246, 1) 0%,
                rgba(63, 81, 181, 0.8) 50%,
                rgba(25, 118, 210, 0.7) 100%
              )`,
              boxShadow: "0 0 20px rgba(100, 181, 246, 0.5)",
            },
          },
          // Animated background patterns
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 20%, rgba(100, 181, 246, 0.15) 0%, transparent 40%),
              radial-gradient(circle at 80% 40%, rgba(63, 81, 181, 0.1) 0%, transparent 40%),
              radial-gradient(circle at 40% 80%, rgba(25, 118, 210, 0.08) 0%, transparent 40%),
              linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 50%, transparent 100%)
            `,
            pointerEvents: "none",
            zIndex: 0,
            animation: "backgroundShift 20s ease-in-out infinite",
          },
          // Floating particles effect
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(2px 2px at 20px 30px, rgba(100, 181, 246, 0.3), transparent),
              radial-gradient(2px 2px at 40px 70px, rgba(63, 81, 181, 0.2), transparent),
              radial-gradient(1px 1px at 90px 40px, rgba(25, 118, 210, 0.4), transparent),
              radial-gradient(1px 1px at 130px 80px, rgba(100, 181, 246, 0.2), transparent),
              radial-gradient(2px 2px at 160px 30px, rgba(63, 81, 181, 0.3), transparent)
            `,
            backgroundRepeat: "repeat",
            backgroundSize: "200px 100px",
            animation: "sparkle 15s linear infinite",
            pointerEvents: "none",
            zIndex: 0,
            opacity: 0.6,
          },
          // Add keyframes for animations
          "@keyframes backgroundShift": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-10px)" },
          },
          "@keyframes sparkle": {
            "0%": { transform: "translateY(0px)" },
            "100%": { transform: "translateY(-100px)" },
          },
        },
      }}
    >
      {/* Enhanced Section Header */}
      <Box
        sx={{
          padding: "28px 24px 20px",
          borderBottom: "1px solid rgba(100, 181, 246, 0.12)",
          marginBottom: "12px",
          position: "relative",
          zIndex: 2,
          background: `
            linear-gradient(135deg,
              rgba(255, 255, 255, 0.1) 0%,
              rgba(100, 181, 246, 0.08) 50%,
              rgba(63, 81, 181, 0.05) 100%
            )
          `,
          backdropFilter: "blur(20px) saturate(150%)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          {sectionIcon && (
            <Box
              sx={{
                mr: 2,
                p: 1.5,
                borderRadius: "12px",
                background: `
                  linear-gradient(135deg,
                    rgba(100, 181, 246, 0.2) 0%,
                    rgba(63, 81, 181, 0.15) 100%
                  )
                `,
                border: "1px solid rgba(100, 181, 246, 0.2)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(100, 181, 246, 0.2)",
                "& svg": {
                  color: "#ffffff",
                  fontSize: "24px",
                  filter: "drop-shadow(0 2px 8px rgba(100, 181, 246, 0.4))",
                },
              }}
            >
              {sectionIcon}
            </Box>
          )}
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "18px",
                letterSpacing: "0.02em",
                textShadow: "0 2px 12px rgba(0, 0, 0, 0.4)",
                fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
                lineHeight: 1.2,
              }}
            >
              {sectionTitle}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "0.75rem",
                fontWeight: 400,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                mt: 0.5,
              }}
            >
              {menuItems.length} items
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "3px",
            background: `
              linear-gradient(90deg,
                rgba(100, 181, 246, 0.8) 0%,
                rgba(63, 81, 181, 0.9) 30%,
                rgba(25, 118, 210, 1) 50%,
                rgba(63, 81, 181, 0.9) 70%,
                rgba(100, 181, 246, 0.8) 100%
              )
            `,
            borderRadius: "2px",
            boxShadow: `
              0 0 16px rgba(100, 181, 246, 0.6),
              0 2px 8px rgba(0, 0, 0, 0.2)
            `,
            position: "relative",
            overflow: "hidden",
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
              animation: "shimmer 2s infinite",
            },
            "@keyframes shimmer": {
              "0%": { left: "-100%" },
              "100%": { left: "100%" },
            },
          }}
        />
      </Box>

      <List
        sx={{
          width: "100%",
          padding: "12px 20px 32px",
          zIndex: 1,
          position: "relative",
        }}
        onMouseMove={handleMouseMove}
      >
        {menuItems.map((item, index) => {
          const isSelected = selected === item.path;
          const isHovered = hoverIndex === index;

          return (
            <Box key={index} sx={{ marginBottom: "8px" }}>
              <Tooltip
                title={item.description}
                placement="right"
                arrow
                sx={{
                  "& .MuiTooltip-tooltip": {
                    backgroundColor: "rgba(13, 71, 161, 0.95)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(100, 181, 246, 0.3)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  },
                  "& .MuiTooltip-arrow": {
                    color: "rgba(13, 71, 161, 0.95)",
                  },
                }}
              >
                <ListItem
                  component={Link}
                  to={item.path}
                  sx={{
                    padding: "16px 20px",
                    borderRadius: "16px",
                    transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    position: "relative",
                    overflow: "hidden",
                    textDecoration: "none",
                    cursor: "pointer",
                    background: isSelected
                      ? `
                          linear-gradient(135deg,
                            rgba(100, 181, 246, 0.25) 0%,
                            rgba(63, 81, 181, 0.2) 50%,
                            rgba(25, 118, 210, 0.15) 100%
                          )
                        `
                      : "transparent",
                    border: isSelected
                      ? "1px solid rgba(100, 181, 246, 0.3)"
                      : "1px solid transparent",
                    backdropFilter: isSelected
                      ? "blur(15px) saturate(130%)"
                      : "none",
                    // Enhanced active indicator
                    "&::before": isSelected
                      ? {
                          content: '""',
                          position: "absolute",
                          left: "0",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "5px",
                          height: "32px",
                          background: `linear-gradient(180deg,
                            #64b5f6 0%,
                            #42a5f5 25%,
                            #2196f3 50%,
                            #1976d2 75%,
                            #0d47a1 100%
                          )`,
                          borderRadius: "0 6px 6px 0",
                          boxShadow: `
                            0 0 20px rgba(100, 181, 246, 0.8),
                            0 0 40px rgba(100, 181, 246, 0.4),
                            inset 0 0 10px rgba(255, 255, 255, 0.2)
                          `,
                          animation: "pulse 2s ease-in-out infinite",
                        }
                      : {},
                    // Dynamic hover glow
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `
                        radial-gradient(circle at ${mouseTracker.current.x}px ${mouseTracker.current.y}px,
                          rgba(100, 181, 246, 0.15) 0%,
                          rgba(100, 181, 246, 0.08) 30%,
                          transparent 70%
                        )
                      `,
                      opacity: isHovered ? 1 : 0,
                      transition: "opacity 0.3s ease",
                      borderRadius: "16px",
                      pointerEvents: "none",
                    },
                    "&:hover": {
                      background: isSelected
                        ? `
                            linear-gradient(135deg,
                              rgba(100, 181, 246, 0.35) 0%,
                              rgba(63, 81, 181, 0.25) 50%,
                              rgba(25, 118, 210, 0.2) 100%
                            )
                          `
                        : `
                            linear-gradient(135deg,
                              rgba(255, 255, 255, 0.08) 0%,
                              rgba(100, 181, 246, 0.12) 50%,
                              rgba(63, 81, 181, 0.06) 100%
                            )
                          `,
                      border: "1px solid rgba(100, 181, 246, 0.4)",
                      transform: "translateX(6px) scale(1.02)",
                      boxShadow: isSelected
                        ? `
                            0 16px 48px rgba(100, 181, 246, 0.3),
                            0 8px 24px rgba(13, 71, 161, 0.2),
                            inset 0 1px 0 rgba(255, 255, 255, 0.15)
                          `
                        : `
                            0 12px 36px rgba(0, 0, 0, 0.15),
                            0 6px 18px rgba(100, 181, 246, 0.1),
                            inset 0 1px 0 rgba(255, 255, 255, 0.08)
                          `,
                      backdropFilter: "blur(20px) saturate(150%)",
                    },
                    "&:active": {
                      transform: "translateX(3px) scale(0.98)",
                      transition: "all 0.1s ease",
                    },
                    "@keyframes pulse": {
                      "0%, 100%": { opacity: 1 },
                      "50%": { opacity: 0.7 },
                    },
                  }}
                  onClick={() => setSelected(item.path)}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      color: isSelected
                        ? "#ffffff"
                        : "rgba(255, 255, 255, 0.9)",
                      transition: "all 0.3s ease",
                      zIndex: 1,
                      position: "relative",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: "52px",
                        color: "inherit",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "12px",
                        "& svg": {
                          fontSize: "22px",
                          filter: isSelected
                            ? `
                                drop-shadow(0 0 16px rgba(100, 181, 246, 0.8))
                                drop-shadow(0 3px 8px rgba(0, 0, 0, 0.3))
                              `
                            : `
                                drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))
                              `,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          transform: isSelected ? "scale(1.1)" : "scale(1)",
                        },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: isSelected ? 700 : 600,
                            color: "inherit",
                            fontSize: "0.95rem",
                            letterSpacing: "0.025em",
                            lineHeight: 1.4,
                            textShadow: isSelected
                              ? "0 2px 4px rgba(0, 0, 0, 0.3)"
                              : "0 1px 2px rgba(0, 0, 0, 0.15)",
                            transition: "all 0.3s ease",
                            fontFamily:
                              '"Inter", "Segoe UI", "Roboto", sans-serif',
                          }}
                        >
                          {item.text}
                        </Typography>
                      }
                    />

                    {/* Enhanced badge */}
                    {item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          height: "22px",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          backgroundColor:
                            item.badge === "New"
                              ? "rgba(76, 175, 80, 0.9)"
                              : "rgba(244, 67, 54, 0.9)",
                          color: "white",
                          border: "1px solid rgba(255, 255, 255, 0.3)",
                          boxShadow: "0 3px 12px rgba(0, 0, 0, 0.2)",
                          backdropFilter: "blur(8px)",
                          animation:
                            item.badge === "New"
                              ? "bounce 2s ease-in-out infinite"
                              : "none",
                          "& .MuiChip-label": {
                            padding: "0 8px",
                          },
                          "@keyframes bounce": {
                            "0%, 20%, 50%, 80%, 100%": {
                              transform: "translateY(0)",
                            },
                            "40%": { transform: "translateY(-4px)" },
                            "60%": { transform: "translateY(-2px)" },
                          },
                        }}
                      />
                    )}
                  </Box>
                </ListItem>
              </Tooltip>
            </Box>
          );
        })}
      </List>

      {/* Footer section */}
      <Box
        sx={{
          padding: "16px 24px",
          borderTop: "1px solid rgba(100, 181, 246, 0.12)",
          marginTop: "auto",
          position: "relative",
          zIndex: 2,
          background: "rgba(13, 71, 161, 0.08)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "0.7rem",
            display: "block",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Current version: v2.4.1
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "rgba(0, 0, 0, 0.4)",
            fontSize: "0.65rem",
            display: "block",
            textAlign: "center",
            marginTop: "4px",
          }}
        >
          © {new Date().getFullYear()} innogen
          <span style={{ color: "red" }}>X</span> All rights reserved.
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
