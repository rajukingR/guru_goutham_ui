import React, { useState, useEffect } from "react";

import ProductCategories from "../dashboard_page/product-categories/ProductCategories";
import RecentRentals from "../dashboard_page/recentrentals/RecentRentals";
import RecentSales from "../dashboard_page/recentsales/RecentSales";
import RentalAndSalesTrends from "../dashboard_page/rental-sales-trends/Rental&SalesTrends";
import API_URL from "../../api/Api_url";

const Dashboard = () => {
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
        { id: 15, category_name: "Assembled Desktop" },
        { id: 16, category_name: "Laptops" },
        { id: 18, category_name: "Monitors" },
        { id: 20, category_name: "RAM" },
        { id: 21, category_name: "Processor" },
        { id: 22, category_name: "Keyboard" },
        { id: 23, category_name: "Mouse" },
        { id: 24, category_name: "Motherboard" },
        { id: 25, category_name: "PC-Case" },
        { id: 26, category_name: "Cabinet" },
        { id: 27, category_name: "Power Supply Unit (PSU)" },
        { id: 28, category_name: "PROCESSOR" },
      ];
      setApiCategories(categories);
    };

    const fetchDeliveryChallans = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_URL}/delivery-challans`
        );
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
          `${API_URL}/goods-receipts/approved-receipt-products`
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

  // Stats with dynamic available stock
  const stats = [
    {
      title: "Active Rentals",
      durations: [
        {
          label: "Last 30 days",
          value: deliveryChallans.filter(
            (dc) => dc.type === "Rent" && isInLastDays(dc.dc_date, 30)
          ).length,
        },
        {
          label: "Last 90 days",
          value: deliveryChallans.filter(
            (dc) => dc.type === "Rent" && isInLastDays(dc.dc_date, 90)
          ).length,
        },
        {
          label: "Last 1 year",
          value: deliveryChallans.filter(
            (dc) => dc.type === "Rent" && isInLastDays(dc.dc_date, 365)
          ).length,
        },
      ],
      color: "#10b981",
      bgColor: "#ecfdf5",
      icon: "💻",
      change: "+8.2%",
    },
    {
      title: "Products Sold",
      durations: [
        {
          label: "Last 30 days",
          value: deliveryChallans.filter(
            (dc) =>
              (dc.type === "Sale" || dc.type === "Buy") &&
              isInLastDays(dc.dc_date, 30)
          ).length,
        },
        {
          label: "Last 90 days",
          value: deliveryChallans.filter(
            (dc) =>
              (dc.type === "Sale" || dc.type === "Buy") &&
              isInLastDays(dc.dc_date, 90)
          ).length,
        },
        {
          label: "Last 1 year",
          value: deliveryChallans.filter(
            (dc) =>
              (dc.type === "Sale" || dc.type === "Buy") &&
              isInLastDays(dc.dc_date, 365)
          ).length,
        },
      ],
      color: "#8b5cf6",
      bgColor: "#faf5ff",
      icon: "💰",
      change: "+12.5%",
    },
    {
      title: "Available Stock",
      durations: [{ label: "Current", value: availableStock }],
      color: "#3b82f6",
      bgColor: "#eff6ff",
      icon: "📦",
      change: "+4.1%",
    },
    {
      title: "Overdue Rentals",
      durations: [
        { label: "Last 30 days", value: 0 },
        { label: "Last 90 days", value: 0 },
        { label: "Last 1 year", value: 0 },
      ],
      color: "#ef4444",
      bgColor: "#fef2f2",
      icon: "⚠️",
      change: "-2.3%",
    },
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

      {/* Stats Cards */}
      <div style={statsGridStyle}>
        {stats.map((stat, i) => (
          <div key={i} style={statsCardStyle}>
            <div style={statsCardHeaderStyle}>
              <div style={{ ...statsIconStyle, backgroundColor: stat.bgColor }}>
                <span style={{ color: stat.color }}>{stat.icon}</span>
              </div>
              <div
                style={{
                  ...changeIndicatorStyle,
                  backgroundColor: stat.change.startsWith("+")
                    ? "#dcfce7"
                    : "#fee2e2",
                  color: stat.change.startsWith("+") ? "#166534" : "#991b1b",
                }}
              >
                {stat.change}
              </div>
            </div>
            <h3 style={statsCardTitleStyle}>{stat.title}</h3>
            <div style={durationsContainerStyle}>
              {stat.durations.map((d, idx) => (
                <div key={idx} style={durationBoxStyle}>
                  <p style={durationLabelStyle}>{d.label}</p>
                  <p style={durationValueStyle}>{d.value}</p>
                </div>
              ))}
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

// ----------- STYLES -----------

const containerStyle = {
  minHeight: "100vh",
  padding: "1.5rem 2rem",
  fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  color: "#1e293b",
};

const headerContainerStyle = {
  backgroundColor: "#ffffff",
  borderRadius: 12,
  padding: "1.5rem 2rem",
  marginBottom: "2rem",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  display: "flex",
  alignItems: "center",
  gap: 16,
};

const headerLeftStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const headerIconStyle = {
  background: "linear-gradient(45deg, #3b82f6, #6366f1)",
  color: "white",
  borderRadius: 10,
  padding: "0.6rem",
  fontSize: 24,
  boxShadow: "0 4px 8px rgba(59,130,246,0.4)",
};

const headerTitleStyle = {
  fontSize: 26,
  fontWeight: 700,
  margin: 0,
};

const headerSubtitleStyle = {
  fontSize: 14,
  color: "#64748b",
  margin: 0,
};

// Stats grid with 4 cards in a row
const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 20,
  marginBottom: "2.5rem",
};

const statsCardStyle = {
  backgroundColor: "white",
  padding: "1.25rem 1.5rem",
  borderRadius: 16,
  boxShadow: "0 6px 20px rgba(0,0,0,0.07)",
  border: "1px solid #e2e8f0",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const statsCardHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 15,
};

const statsIconStyle = {
  borderRadius: 12,
  padding: "0.8rem 1rem",
  fontSize: 28,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const changeIndicatorStyle = {
  fontWeight: 600,
  padding: "0.3rem 0.7rem",
  borderRadius: 8,
  fontSize: 14,
  whiteSpace: "nowrap",
};

const statsCardTitleStyle = {
  fontWeight: 600,
  fontSize: 18,
  marginBottom: 12,
  color: "#475569",
};

const durationsContainerStyle = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
  marginTop: 10,
};

const durationBoxStyle = {
  backgroundColor: "#f0f9ff",
  borderRadius: 12,
  padding: "12px 16px",
  minWidth: 100,
  textAlign: "center",
  boxShadow: "0 1px 6px rgb(59 130 246 / 0.1)",
};

const durationLabelStyle = {
  fontSize: 12,
  color: "#3b82f6",
  fontWeight: 600,
  marginBottom: 4,
  textTransform: "uppercase",
  userSelect: "none",
};

const durationValueStyle = {
  fontSize: 20,
  fontWeight: 700,
  color: "#1e293b",
  margin: 0,
  userSelect: "none",
};

// Main dashboard content grid 2x2 layout
const chartsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gridTemplateRows: "auto auto",
  gap: 24,
};
