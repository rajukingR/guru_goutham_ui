import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

import WorkIcon from "@mui/icons-material/Work";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import GroupIcon from "@mui/icons-material/Group";
import BusinessIcon from "@mui/icons-material/Business";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ContactsIcon from "@mui/icons-material/Contacts";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ApartmentIcon from "@mui/icons-material/Apartment";
import TimelineIcon from "@mui/icons-material/Timeline";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PurchaseRequestsIcon from '@mui/icons-material/ShoppingCart'; // or another appropriate icon
import POQuotationsIcon from '@mui/icons-material/Description';




import { MdAttachMoney, MdOutlineComputer } from "react-icons/md";
import { FaUserTie, FaBriefcase, FaIndustry, FaChalkboardTeacher, FaUserMinus, FaMoneyCheckAlt } from "react-icons/fa";
import { MdOutlineAirlineSeatLegroomNormal, MdQuestionAnswer, MdTranslate, MdTravelExplore, MdDonutLarge, MdAccessTime } from "react-icons/md";
import { GiBrainstorm } from "react-icons/gi";
import { RiCurrencyFill } from "react-icons/ri";

const drawerWidth = 280;

const Sidebar = ({ section }) => {
  const theme = useTheme();
  const location = useLocation();

  let menuItems = [];

  switch (section) {
    case "product_library":
      menuItems = [
        {
          text: "Product Template",
          path: "/dashboard/product_library/product_template",
          icon: <WorkIcon />,
        },
        {
          text: "Brands",
          path: "/dashboard/product_library/brands",
          icon: <AssignmentIcon />,
        },
        {
          text: "Product Categories",
          path: "/dashboard/product_library/product_categories",
          icon: <GroupIcon />,
        },
        {
          text: "Item Master",
          path: "/dashboard/product_library/item_master",
          icon: <PeopleIcon />,
        },
        {
          text: "Item Variant",
          path: "/dashboard/product_library/item_variant",
          icon: <BusinessIcon />,
        },
        {
          text: "Asset",
          path: "/dashboard/product_library/asset",
          icon: <AccountBalanceIcon />,
        },
        {
          text: "Asset Modification Tracker",
          path: "/dashboard/product_library/asset_modification_tracker",
          icon: <ReceiptIcon />,
        },
        {
          text: "Grade",
          path: "/dashboard/product_library/grade",
          icon: <ReceiptLongIcon />,
        },
        {
          text: "Stock Locations",
          path: "/dashboard/product_library/stock_locations",
          icon: <ApartmentIcon />,
        },
      ];
      break;

    case "procurement":
      menuItems = [
        {
          text: "Purchase Requests",
          path: "/dashboard/procurement/purchase-requests",
          icon: <PurchaseRequestsIcon />,
        },
        {
          text: "PO Quotations",
          path: "/dashboard/procurement/PO-quotations",
          icon: <POQuotationsIcon />,

        },
        {
          text: "Purchase Orders",
          path: "/dashboard/procurement/PurchaseOrders",
          icon: <ShoppingCartIcon />,
        },
        {
          text: "Goods Receipt",
          path: "/dashboard/procurement/GoodsReceipt",
          icon: <InventoryIcon />,
        },
        {
          text: "Supplier",
          path: "/dashboard/procurement/Supplier",
          icon: <LocalShippingIcon />,
        },
      ];
      break;

    case "inventory":
      menuItems = [
        {
          text: "Inventory List",
          path: "/dashboard/inventory",
          icon: <GroupIcon />,
        },
      ];
      break;

    case "crm":
      menuItems = [
        {
          text: "Client List",
          path: "/dashboard/crm",
          icon: <BusinessCenterIcon />,
        },
        {
          text: "Contacts",
          path: "/dashboard/crm/contacts",
          icon: <ContactsIcon />,
        },
        {
          text: "Quotations",
          path: "/dashboard/crm/quotations",
          icon: <ReceiptLongIcon />,
        },
        {
          text: "Orders",
          path: "/dashboard/crm/orders",
          icon: <AssignmentIcon />,
        },
      ];
      break;

    case "operations":
      menuItems = [
        {
          text: "Accounts",
          path: "/dashboard/operations",
          icon: <AccountBalanceIcon />,
        },
        {
          text: "Invoices",
          path: "/dashboard/operations/invoices",
          icon: <ReceiptIcon />,
        },
      ];
      break;

    case "users_performance":
      menuItems = [
        {
          text: "Performance List",
          path: "/dashboard/users_performance",
          icon: <BusinessIcon />,
        },
      ];
      break;

    case "client":
      menuItems = [
        {
          text: "Client List",
          path: "/dashboard/client",
          icon: <BusinessIcon />,
        },
      ];
      break;

    case "settings":
      menuItems = [
        {
          text: "Users",
          path: "/dashboard/settings",
          icon: <PeopleIcon size={24} />,
        },
        {
          text: "Roles",
          path: "/dashboard/settings/roles",
          icon: <AdminPanelSettingsIcon size={24} />,
        },
        {
          text: "Experience Range",
          path: "/dashboard/settings/experience-range",
          icon: <TimelineIcon size={24} />,
        },
        {
          text: "Department",
          path: "/dashboard/settings/department",
          icon: <BusinessIcon size={24} />,
        },
        {
          text: "Branches",
          path: "/dashboard/settings/branch",
          icon: <ApartmentIcon size={24} />,
        },
        {
          text: "Work Layout",
          path: "/dashboard/settings/WorkLayout",
          icon: <MdOutlineComputer size={24} />,
        },
        {
          text: "Candidate Status",
          path: "/dashboard/settings/CandidateStatus",
          icon: <FaUserTie size={24} />,
        },
        {
          text: "Bench Status",
          path: "/dashboard/settings/BenchStatus",
          icon: <MdOutlineAirlineSeatLegroomNormal size={24} />,
        },
        {
          text: "Revenue Model",
          path: "/dashboard/settings/RevenType",
          icon: <MdAttachMoney size={24} />,
        },
        {
          text: "Job Title",
          path: "/dashboard/settings/JobTitle",
          icon: <FaBriefcase size={24} />,
        },
        {
          text: "Skills",
          path: "/dashboard/settings/Skills",
          icon: <GiBrainstorm size={24} />,
        },
        {
          text: "Industry",
          path: "/dashboard/settings/Industry",
          icon: <FaIndustry size={24} />,
        },
        {
          text: "Interview Name",
          path: "/dashboard/settings/InterviewName",
          icon: <FaChalkboardTeacher size={24} />,
        },
        {
          text: "Interview Status",
          path: "/dashboard/settings/InterviewStatus",
          icon: <MdQuestionAnswer size={24} />,
        },
        {
          text: "Language Proficiency",
          path: "/dashboard/settings/Languageproficiency",
          icon: <MdTranslate size={24} />,
        },
        {
          text: "Source",
          path: "/dashboard/settings/SourceSe",
          icon: <MdTravelExplore size={24} />,
        },
        {
          text: "Overall Status",
          path: "/dashboard/settings/OverallStatus",
          icon: <MdDonutLarge size={24} />,
        },
        {
          text: "Availability",
          path: "/dashboard/settings/Availability",
          icon: <MdAccessTime size={24} />,
        },
        {
          text: "OffBoarding Reasons",
          path: "/dashboard/settings/OffBoardingReasons",
          icon: <FaUserMinus size={24} />,
        },
        {
          text: "Currency",
          path: "/dashboard/settings/Currency",
          icon: <RiCurrencyFill size={24} />,
        },
        {
          text: "RateType",
          path: "/dashboard/settings/RateType",
          icon: <FaMoneyCheckAlt size={24} />,
        },
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
          background: 'linear-gradient(155deg, #1a237e 0%, #283593 25%, #1565c0 50%, #0d47a1 75%, #01579b 100%)',
          borderRight: "none",
          backdropFilter: "blur(25px)",
          boxShadow: `
            20px 0 60px rgba(13, 71, 161, 0.4),
            inset -1px 0 0 rgba(255, 255, 255, 0.1),
            inset 1px 0 0 rgba(255, 255, 255, 0.05),
            0 0 0 1px rgba(255, 255, 255, 0.02)
          `,
          paddingTop: "24px",
          overflowX: "hidden",
          overflowY: "auto",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "120px",
            background: `
              radial-gradient(ellipse at center top, rgba(100, 181, 246, 0.15) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%),
              linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, transparent 100%)
            `,
            pointerEvents: "none",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 30%, rgba(100, 181, 246, 0.08) 0%, transparent 40%),
              radial-gradient(circle at 80% 70%, rgba(63, 81, 181, 0.06) 0%, transparent 40%)
            `,
            pointerEvents: "none",
          },
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(255, 255, 255, 0.02)",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: 'linear-gradient(180deg, rgba(100, 181, 246, 0.6) 0%, rgba(63, 81, 181, 0.4) 50%, rgba(25, 118, 210, 0.3) 100%)',
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            "&:hover": {
              background: 'linear-gradient(180deg, rgba(100, 181, 246, 0.8) 0%, rgba(63, 81, 181, 0.6) 50%, rgba(25, 118, 210, 0.5) 100%)',
            },
          },
        },
      }}
    >
      <List sx={{ width: "100%", padding: "0 12px", zIndex: 1, position: "relative" }}>
        {menuItems.map((item, index) => {
          const isSelected = selected === item.path;
          return (
            <Box key={index} sx={{ marginBottom: "4px" }}>
              <ListItem
                component={Link}
                to={item.path}
                sx={{
                  padding: "16px 20px",
                  borderRadius: "16px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  textDecoration: "none",
                  background: isSelected 
                    ? `
                        linear-gradient(135deg, 
                          rgba(100, 181, 246, 0.25) 0%, 
                          rgba(63, 81, 181, 0.15) 50%, 
                          rgba(25, 118, 210, 0.1) 100%
                        )
                      `
                    : "transparent",
                  border: isSelected 
                    ? "1px solid rgba(100, 181, 246, 0.3)" 
                    : "1px solid transparent",
                  backdropFilter: isSelected ? "blur(10px)" : "none",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "100%",
                    background: isSelected 
                      ? "linear-gradient(90deg, rgba(100, 181, 246, 0.1) 0%, transparent 70%)"
                      : "linear-gradient(90deg, rgba(255, 255, 255, 0.02) 0%, transparent 50%)",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    borderRadius: "16px",
                  },
                  "&::after": isSelected ? {
                    content: '""',
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "3px",
                    height: "24px",
                    background: "linear-gradient(180deg, #64b5f6 0%, #42a5f5 50%, #1976d2 100%)",
                    borderRadius: "2px",
                    boxShadow: `
                      0 0 12px rgba(100, 181, 246, 0.8),
                      0 0 24px rgba(100, 181, 246, 0.4),
                      inset 0 1px 0 rgba(255, 255, 255, 0.3)
                    `,
                  } : {},
                  "&:hover": {
                    background: isSelected 
                      ? `
                          linear-gradient(135deg, 
                            rgba(100, 181, 246, 0.35) 0%, 
                            rgba(63, 81, 181, 0.25) 50%, 
                            rgba(25, 118, 210, 0.15) 100%
                          )
                        `
                      : `
                          linear-gradient(135deg, 
                            rgba(255, 255, 255, 0.08) 0%, 
                            rgba(100, 181, 246, 0.06) 50%, 
                            rgba(63, 81, 181, 0.04) 100%
                          )
                        `,
                    border: isSelected 
                      ? "1px solid rgba(100, 181, 246, 0.5)" 
                      : "1px solid rgba(255, 255, 255, 0.1)",
                    transform: "translateX(6px) scale(1.02)",
                    boxShadow: isSelected
                      ? `
                          0 8px 32px rgba(100, 181, 246, 0.3),
                          0 4px 16px rgba(13, 71, 161, 0.2),
                          inset 0 1px 0 rgba(255, 255, 255, 0.1)
                        `
                      : `
                          0 4px 20px rgba(0, 0, 0, 0.15),
                          0 2px 8px rgba(100, 181, 246, 0.1),
                          inset 0 1px 0 rgba(255, 255, 255, 0.05)
                        `,
                    backdropFilter: "blur(15px)",
                    "&::before": {
                      opacity: 1,
                    },
                  },
                  "&:active": {
                    transform: "translateX(3px) scale(0.98)",
                    transition: "all 0.1s ease",
                  },
                }}
                onClick={() => setSelected(item.path)}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.87)',
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
                      marginRight: "4px",
                      "& svg": {
                        fontSize: "22px",
                        filter: isSelected 
                          ? `
                              drop-shadow(0 0 16px rgba(100, 181, 246, 0.8))
                              drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))
                              drop-shadow(0 1px 0 rgba(255, 255, 255, 0.2))
                            `
                          : `
                              drop-shadow(0 1px 3px rgba(0, 0, 0, 0.2))
                              drop-shadow(0 0 8px rgba(100, 181, 246, 0.1))
                            `,
                        transition: "all 0.3s ease",
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
                          fontWeight: isSelected ? 600 : 500,
                          color: "inherit",
                          fontSize: "0.92rem",
                          letterSpacing: "0.025em",
                          lineHeight: 1.4,
                          textShadow: isSelected 
                            ? `
                                0 1px 3px rgba(0, 0, 0, 0.3),
                                0 0 8px rgba(100, 181, 246, 0.2)
                              ` 
                            : "0 1px 2px rgba(0, 0, 0, 0.1)",
                          transition: "all 0.3s ease",
                          fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
                        }}
                      >
                        {item.text}
                      </Typography>
                    }
                  />
                  {isSelected && (
                    <Box
                      sx={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "linear-gradient(45deg, #64b5f6 0%, #42a5f5 100%)",
                        boxShadow: `
                          0 0 8px rgba(100, 181, 246, 0.8),
                          0 0 16px rgba(100, 181, 246, 0.4)
                        `,
                        flexShrink: 0,
                        animation: "pulse 2s infinite",
                        "@keyframes pulse": {
                          "0%": {
                            boxShadow: `
                              0 0 8px rgba(100, 181, 246, 0.8),
                              0 0 16px rgba(100, 181, 246, 0.4)
                            `,
                          },
                          "50%": {
                            boxShadow: `
                              0 0 12px rgba(100, 181, 246, 1),
                              0 0 24px rgba(100, 181, 246, 0.6)
                            `,
                          },
                          "100%": {
                            boxShadow: `
                              0 0 8px rgba(100, 181, 246, 0.8),
                              0 0 16px rgba(100, 181, 246, 0.4)
                            `,
                          },
                        },
                      }}
                    />
                  )}
                </Box>
              </ListItem>
            </Box>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;