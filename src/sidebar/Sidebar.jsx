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
          path: "/dashboard/item_variant",
          icon: <BusinessIcon />,
        },
        {
          text: "Asset",
          path: "/dashboard/asset",
          icon: <AccountBalanceIcon />,
        },
        {
          text: "Asset Modification Tracker",
          path: "/dashboard/asset_modification_tracker",
          icon: <ReceiptIcon />,
        },
        {
          text: "Grade",
          path: "/dashboard/grade",
          icon: <ReceiptLongIcon />,
        },
        {
          text: "Stock Locations",
          path: "/dashboard/stock_locations",
          icon: <ApartmentIcon />,
        },
      ];
      break;

    case "procurement":
      menuItems = [
        {
          text: "Procurement List",
          path: "/dashboard/procurement",
          icon: <PeopleIcon />,
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
          background: 'linear-gradient(180deg, #1a237e 0%, #0d47a1 40%, #01579b 100%)',
          borderRight: "none",
          backdropFilter: "blur(20px)",
          boxShadow: '12px 0 40px rgba(13, 71, 161, 0.25), inset -1px 0 0 rgba(255, 255, 255, 0.08), inset 1px 0 0 rgba(255, 255, 255, 0.05)',
          paddingTop: "32px",
          overflowX: "hidden",
          overflowY: "auto",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "100px",
            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%)",
            pointerEvents: "none",
          },
          "&::-webkit-scrollbar": {
            width: "3px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: 'linear-gradient(180deg, rgba(100, 181, 246, 0.4) 0%, rgba(255, 255, 255, 0.2) 100%)',
            borderRadius: "10px",
            "&:hover": {
              background: 'linear-gradient(180deg, rgba(100, 181, 246, 0.6) 0%, rgba(255, 255, 255, 0.3) 100%)',
            },
          },
        },
      }}
    >

      <List sx={{ width: "100%", padding: "0" }}>
        {menuItems.map((item, index) => {
          const isSelected = selected === item.path;
          return (
            <ListItem
              key={index}
              component={Link}
              to={item.path}
              sx={{
                padding: "14px 28px",
                marginBottom: "3px",
                borderRadius: "0",
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                position: "relative",
                overflow: "hidden",
                textDecoration: "none",
                background: isSelected 
                  ? 'linear-gradient(90deg, rgba(100, 181, 246, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)'
                  : "transparent",
                borderLeft: isSelected ? "3px solid #64b5f6" : "3px solid transparent",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "100%",
                  background: "linear-gradient(90deg, rgba(255, 255, 255, 0.03) 0%, transparent 50%)",
                  opacity: 0,
                  transition: "opacity 0.4s ease",
                },
                "&::after": isSelected ? {
                  content: '""',
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "4px",
                  height: "20px",
                  background: "linear-gradient(180deg, #64b5f6 0%, #42a5f5 100%)",
                  borderRadius: "2px 0 0 2px",
                  boxShadow: "0 0 8px rgba(100, 181, 246, 0.5)",
                } : {},
                "&:hover": {
                  background: isSelected 
                    ? 'linear-gradient(90deg, rgba(100, 181, 246, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)'
                    : 'linear-gradient(90deg, rgba(255, 255, 255, 0.06) 0%, rgba(100, 181, 246, 0.04) 100%)',
                  borderLeft: isSelected 
                    ? "3px solid #64b5f6" 
                    : "3px solid rgba(100, 181, 246, 0.4)",
                  transform: "translateX(4px)",
                  "&::before": {
                    opacity: 1,
                  },
                },
                "&:active": {
                  transform: "translateX(2px) scale(0.98)",
                },
              }}
              onClick={() => setSelected(item.path)}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
                  transition: "all 0.4s ease",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: "48px",
                    color: "inherit",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "& svg": {
                      fontSize: "22px",
                      filter: isSelected 
                        ? 'drop-shadow(0 0 12px rgba(100, 181, 246, 0.6)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
                        : "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
                      transition: "all 0.4s ease",
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
                        fontSize: "0.95rem",
                        letterSpacing: "0.02em",
                        lineHeight: 1.5,
                        textShadow: isSelected 
                          ? "0 1px 2px rgba(0, 0, 0, 0.2)" 
                          : "0 1px 1px rgba(0, 0, 0, 0.1)",
                        transition: "all 0.4s ease",
                      }}
                    >
                      {item.text}
                    </Typography>
                  }
                />
              </Box>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;