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
  Chip,
  alpha,
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

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import InventoryIcon from "@mui/icons-material/Inventory";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import PurchaseRequestsIcon from "@mui/icons-material/ShoppingCart";

import POQuotationsIcon from "@mui/icons-material/Description";

import WarehouseIcon from "@mui/icons-material/Warehouse";

import RequestQuoteIcon from "@mui/icons-material/RequestQuote";

import BuildCircleIcon from "@mui/icons-material/BuildCircle";

import CreditScoreIcon from "@mui/icons-material/CreditScore";

import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { MdAttachMoney, MdOutlineComputer } from "react-icons/md";

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

const drawerWidth = 300;

const Sidebar = ({ section }) => {
  const theme = useTheme();

  const location = useLocation();

  let menuItems = [];

  let sectionTitle = "";

  switch (section) {
    case "product_library":
                              sectionTitle = "Product Library";

      menuItems = [
        {
          text: "Product Template",
          path: "/dashboard/product_library",
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
        // {
        //   text: "Item Master",
        //   path: "/dashboard/product_library/item_master",
        //   icon: <PeopleIcon />,
        // },
        // {
        //   text: "Item Variant",
        //   path: "/dashboard/product_library/item_variant",
        //   icon: <BusinessIcon />,
        // },
        // {
        //   text: "Asset",
        //   path: "/dashboard/product_library/asset",
        //   icon: <AccountBalanceIcon />,
        // },
        // {
        //   text: "Asset Modification Tracker",
        //   path: "/dashboard/product_library/asset_modification_tracker",
        //   icon: <ReceiptIcon />,
        // },
        // {
        //   text: "Grade",
        //   path: "/dashboard/product_library/grade",
        //   icon: <ReceiptLongIcon />,
        // },
        {
          text: "Stock Locations",
          path: "/dashboard/product_library/stock_locations",
          icon: <ApartmentIcon />,
        },
      ];
      break;

    case "procurement":
                        sectionTitle = "Procurement";

      menuItems = [
        {
          text: "Purchase Requests",
          path: "/dashboard/procurement/purchase-requests",
          icon: <PurchaseRequestsIcon />,
        },
        {
          text: "PO Quotations",
          path: "/dashboard/procurement/po-quotations",
          icon: <POQuotationsIcon />,

        },
        {
          text: "Purchase Orders",
          path: "/dashboard/procurement/purchase-orders",
          icon: <ShoppingCartIcon />,
        },
        {
          text: "Goods Receipt",
          path: "/dashboard/procurement/goodsreceipt",
          icon: <InventoryIcon />,
        },
        {
          text: "Supplier",
          path: "/dashboard/procurement/supplier",
          icon: <LocalShippingIcon />,
        },
      ];
      break;

    case "inventory":
                        sectionTitle = "Inventory";

      menuItems = [
        {
          text: "Product List",
          path: "/dashboard/inventory",
          icon: <GroupIcon />,
        },
      ];
      break;

    case "crm":
                        sectionTitle = "Customer Relationship";

      menuItems = [
        {
          text: "Client List",
          path: "/dashboard/crm/client-list",
          icon: <BusinessCenterIcon />,
        },
        {
          text: "Leads",
          path: "/dashboard/crm/lead",
          icon: <ContactsIcon />,
        },
        {
          text: "Quotations",
          path: "/dashboard/crm/quotations",
          icon: <ReceiptLongIcon />,
        },
        {
          text: "Sales Orders",
          path: "/dashboard/crm/orders",
          icon: <AssignmentIcon />,
        },
        //  {
        //   text: "Dispatch Orders",
        //   path: "/dashboard/crm/dispatch-orders",
        //   icon: <AssignmentIcon />,
        // },
      ];
      break;

    case "operations":
                  sectionTitle = "Operations";

      menuItems = [
        {
          text: "Delivery Challan",
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
            sectionTitle = "Users Performance";

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
      sectionTitle = "Settings";

      menuItems = [
        {
          text: "Users",
          path: "/dashboard/settings/users",
          icon: <PeopleIcon size={24} />,
        },
        {
          text: "Roles",
          path: "/dashboard/settings/roles",
          icon: <AdminPanelSettingsIcon size={24} />,
        },
        {
          text: "Address",
          path: "/dashboard/settings/address",
          icon: <TimelineIcon size={24} />,
        },
        {
          text: "Contact Type",
          path: "/dashboard/settings/contact_type",
          icon: <MdOutlineComputer size={24} />,
        },
        {
          text: "Tax List",
          path: "/dashboard/settings/taxt_list",
          icon: <FaUserTie size={24} />,
        },
        // {
        //   text: "GST(Taxes)",
        //   path: "/dashboard/settings/BenchStatus",
        //   icon: <MdOutlineAirlineSeatLegroomNormal size={24} />,
        // },
        // {
        //   text: "Hsn Codes",
        //   path: "/dashboard/settings/RevenType",
        //   icon: <MdAttachMoney size={24} />,
        // },
        // {
        //   text: "Lead Checklists",
        //   path: "/dashboard/settings/JobTitle",
        //   icon: <FaBriefcase size={24} />,
        // },
        // {
        //   text: "Lead Statuses",
        //   path: "/dashboard/settings/Skills",
        //   icon: <GiBrainstorm size={24} />,
        // },
        // {
        //   text: "Oredr Checklists",
        //   path: "/dashboard/settings/Industry",
        //   icon: <FaIndustry size={24} />,
        // },
        // {
        //   text: "Service Priority",
        //   path: "/dashboard/settings/InterviewName",
        //   icon: <FaChalkboardTeacher size={24} />,
        // },
        // {
        //   text: "Service Status",
        //   path: "/dashboard/settings/InterviewStatus",
        //   icon: <MdQuestionAnswer size={24} />,
        // },
        // {
        //   text: "State",
        //   path: "/dashboard/settings/Languageproficiency",
        //   icon: <MdTranslate size={24} />,
        // },
        // {
        //   text: "Terms",
        //   path: "/dashboard/settings/SourceSe",
        //   icon: <MdTravelExplore size={24} />,
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

            radial-gradient(ellipse at top left, rgba(26, 35, 126, 0.95) 0%, transparent 50%),

            radial-gradient(ellipse at bottom right, rgba(1, 87, 155, 0.9) 0%, transparent 50%),

            linear-gradient(155deg,

              #1a237e 0%,

              #283593 15%,

              #1565c0 35%,

              #0d47a1 65%,

              #01579b 85%,

              #0d47a1 100%

            )

          `,

          borderRight: "1px solid rgba(255, 255, 255, 0.08)",

          backdropFilter: "blur(30px) saturate(150%)",

          boxShadow: `

            0 0 0 1px rgba(255, 255, 255, 0.05),

            24px 0 64px rgba(13, 71, 161, 0.35),

            12px 0 32px rgba(1, 87, 155, 0.25),

            0 0 0 0.5px rgba(100, 181, 246, 0.1)

          `,

          paddingTop: "0",

          overflowX: "hidden",

          overflowY: "auto",

          position: "relative",

          // Enhanced scrollbar

          "&::-webkit-scrollbar": {
            width: "6px",
          },

          "&::-webkit-scrollbar-track": {
            background: "rgba(255, 255, 255, 0.03)",

            borderRadius: "12px",

            margin: "8px 0",
          },

          "&::-webkit-scrollbar-thumb": {
            background: `linear-gradient(180deg,

              rgba(100, 181, 246, 0.7) 0%,

              rgba(63, 81, 181, 0.5) 50%,

              rgba(25, 118, 210, 0.4) 100%

            )`,

            borderRadius: "12px",

            border: "1px solid rgba(255, 255, 255, 0.1)",

            "&:hover": {
              background: `linear-gradient(180deg,

                rgba(100, 181, 246, 0.9) 0%,

                rgba(63, 81, 181, 0.7) 50%,

                rgba(25, 118, 210, 0.6) 100%

              )`,
            },
          },

          // Glass morphism overlay

          "&::before": {
            content: '""',

            position: "absolute",

            top: 0,

            left: 0,

            right: 0,

            bottom: 0,

            background: `

              radial-gradient(circle at 25% 25%, rgba(100, 181, 246, 0.12) 0%, transparent 50%),

              radial-gradient(circle at 75% 75%, rgba(63, 81, 181, 0.08) 0%, transparent 50%),

              linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 50%, transparent 100%)

            `,

            pointerEvents: "none",

            zIndex: 0,
          },
        },
      }}
    >
      {/* Section Header */}

      <Box
        sx={{
          padding: "24px 20px 16px",

          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",

          marginBottom: "8px",

          position: "relative",

          zIndex: 2,

          background: `

            linear-gradient(135deg,

              rgba(255, 255, 255, 0.08) 0%,

              rgba(100, 181, 246, 0.05) 100%

            )

          `,

          backdropFilter: "blur(10px)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#ffffff",

            fontWeight: 600,

            fontSize: "1.1rem",

            letterSpacing: "0.02em",

            textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",

            fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
          }}
        >
          {sectionTitle}
        </Typography>

        <Box
          sx={{
            width: "32px",

            height: "2px",

            background: "linear-gradient(90deg, #64b5f6 0%, #42a5f5 100%)",

            borderRadius: "1px",

            marginTop: "8px",

            boxShadow: "0 0 8px rgba(100, 181, 246, 0.6)",
          }}
        />
      </Box>

      <List
        sx={{
          width: "100%",

          padding: "8px 16px 24px",

          zIndex: 1,

          position: "relative",
        }}
      >
        {menuItems.map((item, index) => {
          const isSelected = selected === item.path;

          return (
            <Box key={index} sx={{ marginBottom: "6px" }}>
              <ListItem
                component={Link}
                to={item.path}
                sx={{
                  padding: "14px 18px",

                  borderRadius: "14px",

                  transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",

                  position: "relative",

                  overflow: "hidden",

                  textDecoration: "none",

                  cursor: "pointer",

                  background: isSelected
                    ? `

                        linear-gradient(135deg,

                          rgba(100, 181, 246, 0.2) 0%,

                          rgba(63, 81, 181, 0.15) 50%,

                          rgba(25, 118, 210, 0.1) 100%

                        )

                      `
                    : "transparent",

                  border: isSelected
                    ? "1px solid rgba(100, 181, 246, 0.25)"
                    : "1px solid transparent",

                  backdropFilter: isSelected
                    ? "blur(12px) saturate(120%)"
                    : "none",

                  // Active indicator line

                  "&::before": isSelected
                    ? {
                        content: '""',

                        position: "absolute",

                        left: "0",

                        top: "50%",

                        transform: "translateY(-50%)",

                        width: "4px",

                        height: "28px",

                        background: `linear-gradient(180deg,

                      #64b5f6 0%,

                      #42a5f5 50%,

                      #1976d2 100%

                    )`,

                        borderRadius: "0 4px 4px 0",

                        boxShadow: `

                      0 0 16px rgba(100, 181, 246, 0.8),

                      0 0 32px rgba(100, 181, 246, 0.4)

                    `,
                      }
                    : {},

                  // Hover glow effect

                  "&::after": {
                    content: '""',

                    position: "absolute",

                    top: 0,

                    left: 0,

                    right: 0,

                    bottom: 0,

                    background: `

                      radial-gradient(circle at center,

                        rgba(100, 181, 246, 0.1) 0%,

                        transparent 70%

                      )

                    `,

                    opacity: 0,

                    transition: "opacity 0.3s ease",

                    borderRadius: "14px",

                    pointerEvents: "none",
                  },

                  "&:hover": {
                    background: isSelected
                      ? `

                          linear-gradient(135deg,

                            rgba(100, 181, 246, 0.3) 0%,

                            rgba(63, 81, 181, 0.2) 50%,

                            rgba(25, 118, 210, 0.15) 100%

                          )

                        `
                      : `

                          linear-gradient(135deg,

                            rgba(255, 255, 255, 0.06) 0%,

                            rgba(100, 181, 246, 0.08) 50%,

                            rgba(63, 81, 181, 0.04) 100%

                          )

                        `,

                    border: "1px solid rgba(100, 181, 246, 0.3)",

                    transform: "translateX(4px) scale(1.01)",

                    boxShadow: isSelected
                      ? `

                          0 12px 40px rgba(100, 181, 246, 0.25),

                          0 6px 20px rgba(13, 71, 161, 0.15),

                          inset 0 1px 0 rgba(255, 255, 255, 0.1)

                        `
                      : `

                          0 8px 28px rgba(0, 0, 0, 0.12),

                          0 4px 12px rgba(100, 181, 246, 0.08),

                          inset 0 1px 0 rgba(255, 255, 255, 0.05)

                        `,

                    backdropFilter: "blur(16px) saturate(140%)",

                    "&::after": {
                      opacity: 1,
                    },
                  },

                  "&:active": {
                    transform: "translateX(2px) scale(0.99)",

                    transition: "all 0.15s ease",
                  },
                }}
                onClick={() => setSelected(item.path)}
              >
                <Box
                  sx={{
                    display: "flex",

                    alignItems: "center",

                    width: "100%",

                    color: isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.85)",

                    transition: "all 0.3s ease",

                    zIndex: 1,

                    position: "relative",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: "48px",

                      color: "inherit",

                      display: "flex",

                      alignItems: "center",

                      justifyContent: "center",

                      marginRight: "8px",

                      "& svg": {
                        fontSize: "20px",

                        filter: isSelected
                          ? `

                              drop-shadow(0 0 12px rgba(100, 181, 246, 0.7))

                              drop-shadow(0 2px 6px rgba(0, 0, 0, 0.25))

                            `
                          : `

                              drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15))

                            `,

                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

                        transform: isSelected ? "scale(1.05)" : "scale(1)",
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

                          fontSize: "0.9rem",

                          letterSpacing: "0.02em",

                          lineHeight: 1.3,

                          textShadow: isSelected
                            ? "0 1px 3px rgba(0, 0, 0, 0.25)"
                            : "0 1px 2px rgba(0, 0, 0, 0.1)",

                          transition: "all 0.3s ease",

                          fontFamily:
                            '"Inter", "Segoe UI", "Roboto", sans-serif',
                        }}
                      >
                        {item.text}
                      </Typography>
                    }
                  />

                  {/* Badge for notifications or counts */}

                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      sx={{
                        height: "20px",

                        fontSize: "0.7rem",

                        fontWeight: 600,

                        backgroundColor:
                          item.badge === "New"
                            ? "rgba(76, 175, 80, 0.9)"
                            : "rgba(244, 67, 54, 0.9)",

                        color: "white",

                        border: "1px solid rgba(255, 255, 255, 0.2)",

                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",

                        "& .MuiChip-label": {
                          padding: "0 6px",
                        },
                      }}
                    />
                  )}

                  {/* Arrow indicator for selected items */}

                  {isSelected && (
                    <ChevronRightIcon
                      sx={{
                        fontSize: "18px",

                        marginLeft: "auto",

                        color: "rgba(100, 181, 246, 0.8)",

                        filter: "drop-shadow(0 0 8px rgba(100, 181, 246, 0.6))",
                      }}
                    />
                  )}
                </Box>
              </ListItem>
            </Box>
          );
        })}
      </List>

      {/* Footer accent */}

      <Box
        sx={{
          position: "absolute",

          bottom: 0,

          left: 0,

          right: 0,

          height: "4px",

          background: `

            linear-gradient(90deg,

              transparent 0%,

              rgba(100, 181, 246, 0.6) 20%,

              rgba(63, 81, 181, 0.8) 50%,

              rgba(100, 181, 246, 0.6) 80%,

              transparent 100%

            )

          `,

          boxShadow: "0 0 16px rgba(100, 181, 246, 0.4)",
        }}
      />
    </Drawer>
  );
};

export default Sidebar;
