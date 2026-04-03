import React, { useState, useEffect } from "react";

import ProductCategories from "../dashboard_page/product-categories/ProductCategories";
import RecentRentals from "../dashboard_page/recentrentals/RecentRentals";
import RecentSales from "../dashboard_page/recentsales/RecentSales";
import RentalAndSalesTrends from "../dashboard_page/rental-sales-trends/Rental&SalesTrends";
import API_URL from "../../api/Api_url";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);

  const userToken = token;
  // Date states for filters
  const [laptopCategoriesDate, setLaptopCategoriesDate] = useState(
    new Date(2023, 5, 1)
  );
  const [trendsDate, setTrendsDate] = useState(new Date(2023, 5, 1));
  const [rentalsDate, setRentalsDate] = useState(new Date(2023, 5, 1));
  const [salesDate, setSalesDate] = useState(new Date(2023, 5, 1));

  // Data states
  const [apiCategories, setApiCategories] = useState([]);
  const [deliveryChallans, setDeliveryChallans] = useState([]);
  const [availableStock, setAvailableStock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories and delivery challans
  useEffect(() => {
    const fetchCategories = async () => {
      // Replace with your real API if available
      const categories = [
        { id: 15, category_name: "Desktop" },
        { id: 16, category_name: "Laptop" },
        { id: 18, category_name: "Monitor" },
        { id: 20, category_name: "RAM" },
        { id: 21, category_name: "Processor" },
        { id: 22, category_name: "Keyboard" },
        { id: 23, category_name: "Mouse" },
        { id: 24, category_name: "Motherboard" },
        { id: 25, category_name: "PC-Case" },
        { id: 26, category_name: "Cabinet" },
        { id: 27, category_name: "Power Supply Unit (PSU)" },
      ];
      setApiCategories(categories);
    };

    const fetchDeliveryChallans = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/delivery-challans/list`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = await response.json();
        setDeliveryChallans(data);
      } catch (e) {
        console.error("Failed to fetch delivery challans:", e);
        setError("Failed to load delivery challans.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchDeliveryChallans();
  }, []);

  // Fetch available stock data separately
  useEffect(() => {
    const fetchAvailableStock = async () => {
      try {
        const response = await fetch(
          `${API_URL}/goods-receipts/approved-receipt-products`,
          {
            headers: {
              "Authorization": `Bearer ${userToken}`,
            },
          }
        );
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = await response.json();
        if (data?.products) {
          // Sum all available_quantity from products
          const totalAvailable = data.products.reduce(
            (sum, product) => sum + (product.available_quantity || 0),
            0
          );
          setAvailableStock(totalAvailable);
        }
      } catch (e) {
        console.error("Failed to fetch available stock:", e);
      }
    };

    fetchAvailableStock();
  }, []);

  // Process delivery challans into monthly trends (Rentals and Sales)
  const processTrendsData = () => {
    if (loading || error || !deliveryChallans.length) return [];

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyData = months.map((month) => ({
      month,
      rentals: 0,
      sales: 0,
    }));

    deliveryChallans.forEach((challan) => {
      const dcDate = new Date(challan.dc_date);
      const monthIndex = dcDate.getMonth();

      const totalQty = (challan.items || []).reduce(
        (sum, i) => sum + (i.quantity || 0),
        0
      );

      if (challan.type === "Rent") {
        monthlyData[monthIndex].rentals += totalQty;
      } else if (challan.type === "Buy" || challan.type === "Sale") {
        monthlyData[monthIndex].sales += totalQty;
      }
    });

    return monthlyData;
  };

  const monthlyTrendsData = processTrendsData();

  // Generate Recent Rentals from delivery challans of type Rent
  const recentRentals = React.useMemo(() => {
    if (!deliveryChallans.length) return [];

    const rentChallans = deliveryChallans
      .filter((challan) => challan.type === "Rent")
      .sort((a, b) => new Date(b.dc_date) - new Date(a.dc_date))
      .slice(0, 5);

    let rentalsList = [];

    rentChallans.forEach((challan) => {
      (challan.items || []).forEach((item) => {
        rentalsList.push({
          id: `${challan.dc_id}-${item.id}`,
          customer: challan.receiver_name || "N/A",
          model: item.product_name,
          startDate: challan.dc_date,
          endDate: null,
          status: "Active",
        });
      });
    });

    return rentalsList.slice(0, 5);
  }, [deliveryChallans]);

  // Generate Recent Sales from delivery challans of type Sale/Buy
  const recentSales = React.useMemo(() => {
    if (!deliveryChallans.length) return [];

    const saleChallans = deliveryChallans
      .filter((challan) => challan.type === "Sale" || challan.type === "Buy")
      .sort((a, b) => new Date(b.dc_date) - new Date(a.dc_date))
      .slice(0, 5);

    let salesList = [];

    saleChallans.forEach((challan) => {
      (challan.items || []).forEach((item) => {
        salesList.push({
          id: `${challan.dc_id}-${item.id}`,
          customer: challan.receiver_name || "N/A",
          model: item.product_name,
          date: challan.dc_date,
          price: item.total_price ? `$${item.total_price}` : "N/A",
          status: "Completed",
        });
      });
    });

    return salesList.slice(0, 5);
  }, [deliveryChallans]);

  // Helper for date checking
  function isInLastDays(dateString, days) {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today - date;
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays >= 0 && diffDays <= days;
  }

  // Modern Stats Cards Data - SIMPLIFIED
  const stats = [
    {
      title: "Active Rentals",
      mainValue: deliveryChallans.filter(
        (dc) => dc.type === "Rent" && isInLastDays(dc.dc_date, 30)
      ).length,
      icon: "📅",
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981, #059669)",
      trend: "+12.5%",
      trendUp: true,
      description: "Currently active rental devices"
    },
    {
      title: "Products Sold",
      mainValue: deliveryChallans.filter(
        (dc) =>
          (dc.type === "Sale" || dc.type === "Buy") &&
          isInLastDays(dc.dc_date, 30)
      ).length,
      icon: "💰",
      color: "#8b5cf6",
      gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
      trend: "+8.3%",
      trendUp: true,
      description: "Total sales this month"
    },
    {
      title: "Available Stock",
      mainValue: availableStock,
      icon: "📦",
      color: "#3b82f6",
      gradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
      trend: "+4.1%",
      trendUp: true,
      description: "Ready to handover devices"
    },
    // {
    //   title: "Overdue Rentals",
    //   mainValue: 2,
    //   icon: "⚠️",
    //   color: "#ef4444",
    //   gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    //   trend: "-2.3%",
    //   trendUp: false,
    //   description: "Requires follow-up"
    // },
  ];

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerContainerStyle}>
        <div style={headerLeftStyle}>
          <div style={headerIconStyle}>📊</div>
          <div>
            <h1 style={headerTitleStyle}>
              Optimize Rentals, Sales & Inventory Efficiency
            </h1>
            <p style={headerSubtitleStyle}>Ready to Handover to Clients</p>
          </div>
        </div>
      </div>

      {/* Modern Stats Cards - SIMPLIFIED */}
      <div style={statsGridStyle}>
        {stats.map((stat, i) => (
          <div key={i} style={statsCardStyle}>
            <div style={statsCardTopStyle}>
              <div style={statsIconCircleStyle}>
                <div style={{...iconCircleStyle, background: stat.gradient}}>
                  <span style={iconStyle}>{stat.icon}</span>
                </div>
              </div>
              <div style={statsTitleStyle}>
                <h3 style={statTitleTextStyle}>{stat.title}</h3>
                <div style={{
                  ...trendBadgeStyle,
                  backgroundColor: stat.trendUp ? "#d1fae5" : "#fee2e2",
                  color: stat.trendUp ? "#065f46" : "#991b1b",
                }}>
                  <span style={trendArrowStyle}>
                    {stat.trendUp ? "↗" : "↘"}
                  </span>
                  {stat.trend}
                </div>
              </div>
            </div>
            
            <div style={mainValueContainerStyle}>
              <span style={mainValueNumberStyle}>{stat.mainValue}</span>
              <span style={mainValueLabelStyle}>units</span>
            </div>
            
            <div style={descriptionStyle}>
              {stat.description}
            </div>
          </div>
        ))}
      </div>

      {/* Main Dashboard Content - 2x2 Grid */}
      <div style={chartsGridStyle}>
        <ProductCategories
          apiCategories={apiCategories}
          laptopCategoriesDate={laptopCategoriesDate}
          setLaptopCategoriesDate={setLaptopCategoriesDate}
        />
        <RentalAndSalesTrends
          monthlyTrendsData={monthlyTrendsData}
          loading={loading}
          trendsDate={trendsDate}
          setTrendsDate={setTrendsDate}
        />
        <RecentRentals
          recentRentals={recentRentals}
          rentalsDate={rentalsDate}
          setRentalsDate={setRentalsDate}
        />
        <RecentSales
          recentSales={recentSales}
          salesDate={salesDate}
          setSalesDate={setSalesDate}
        />
      </div>
    </div>
  );
};

export default Dashboard;

// ----------- UPDATED STYLES -----------

const containerStyle = {
  minHeight: "100vh",
  padding: "1.5rem 2rem",
  fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  color: "#1e293b",
  backgroundColor: "#f8fafc",
};

const headerContainerStyle = {
  backgroundColor: "#ffffff",
  borderRadius: 20,
  padding: "2rem",
  marginBottom: "2rem",
  boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
  display: "flex",
  alignItems: "center",
  gap: 20,
  border: "1px solid rgba(226, 232, 240, 0.6)",
};

const headerLeftStyle = {
  display: "flex",
  alignItems: "center",
  gap: 16,
};

const headerIconStyle = {
  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
  color: "white",
  borderRadius: 14,
  padding: "0.8rem",
  fontSize: 28,
  boxShadow: "0 6px 15px rgba(99, 102, 241, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 60,
  height: 60,
};

const headerTitleStyle = {
  fontSize: 28,
  fontWeight: 700,
  margin: 0,
  background: "linear-gradient(90deg, #1e293b, #475569)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const headerSubtitleStyle = {
  fontSize: 15,
  color: "#64748b",
  margin: "4px 0 0 0",
  fontWeight: 500,
};

// Modern Stats Grid
const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 24,
  marginBottom: "2.5rem",
};

const statsCardStyle = {
  backgroundColor: "#ffffff",
  padding: "1.5rem",
  borderRadius: 20,
  boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
  border: "1px solid rgba(226, 232, 240, 0.8)",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 35px rgba(0,0,0,0.12)",
    borderColor: "rgba(99, 102, 241, 0.2)",
  },
  
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderRadius: "20px 20px 0 0",
  },
};

const statsCardTopStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "1.25rem",
  gap: 16,
};

const statsIconCircleStyle = {
  flexShrink: 0,
};

const iconCircleStyle = {
  width: 56,
  height: 56,
  borderRadius: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
};

const iconStyle = {
  fontSize: 24,
  color: "#ffffff",
};

const statsTitleStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const statTitleTextStyle = {
  fontWeight: 600,
  fontSize: 16,
  color: "#475569",
  margin: 0,
};

const trendBadgeStyle = {
  padding: "4px 10px",
  borderRadius: 20,
  fontSize: 12,
  fontWeight: 600,
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  width: "fit-content",
};

const trendArrowStyle = {
  fontSize: 14,
};

const mainValueContainerStyle = {
  display: "flex",
  alignItems: "baseline",
  gap: 8,
  marginBottom: "0.75rem",
};

const mainValueNumberStyle = {
  fontSize: 42,
  fontWeight: 700,
  color: "#1e293b",
  lineHeight: 1,
};

const mainValueLabelStyle = {
  fontSize: 16,
  color: "#64748b",
  fontWeight: 500,
};

const descriptionStyle = {
  fontSize: 14,
  color: "#94a3b8",
  fontWeight: 400,
  lineHeight: 1.4,
  paddingTop: "0.75rem",
  borderTop: "1px solid rgba(226, 232, 240, 0.8)",
};

// Main dashboard content grid 2x2 layout
const chartsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gridTemplateRows: "auto auto",
  gap: 24,
};

// Responsive styles
const responsiveStyles = {
  "@media (max-width: 1200px)": {
    chartsGridStyle: {
      gridTemplateColumns: "1fr",
      gridTemplateRows: "auto",
    },
  },
  "@media (max-width: 768px)": {
    containerStyle: {
      padding: "1rem",
    },
    statsGridStyle: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    headerContainerStyle: {
      padding: "1.5rem",
      flexDirection: "column",
      alignItems: "flex-start",
    },
    headerIconStyle: {
      width: 50,
      height: 50,
      fontSize: 22,
    },
    headerTitleStyle: {
      fontSize: 22,
    },
    mainValueNumberStyle: {
      fontSize: 36,
    },
  },
  "@media (max-width: 480px)": {
    statsGridStyle: {
      gridTemplateColumns: "1fr",
    },
    chartsGridStyle: {
      gridTemplateColumns: "1fr",
    },
    statsCardStyle: {
      padding: "1.25rem",
    },
    mainValueNumberStyle: {
      fontSize: 32,
    },
  },
};