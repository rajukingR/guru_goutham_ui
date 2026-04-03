import React, { useState, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const ProductCategories = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [apiData, setApiData] = useState({
    summary: {},
    category_summary: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, token } = useSelector((state) => state.auth);
  const userToken = token;

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/goods-receipts/approved-receipt-products/dashboard`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        setApiData(data);
      } catch (err) {
        setError("Failed to load product categories");
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [userToken]);

  // Colors for categories
  const colors = [
    "#fb923c", "#6366f1", "#2dd4bf", "#f472b6", "#fbbf24", "#a855f7",
    "#10b981", "#3b82f6", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6",
    "#c084fc", "#f0abfc", "#e879f9", "#f43f5e", "#ef4444", "#a3e635",
    "#d946ef", "#06b6d4",
  ];

  // Generate category data from API response
  const categoryData = useMemo(() => {
    if (!apiData.category_summary || apiData.category_summary.length === 0) return [];

    return apiData.category_summary.map((category, index) => {
      // Use available_quantity as the value for the chart
      const value = category.available_quantity || 0;
      
      return {
        name: category.product_category || `Category ${index + 1}`,
        value: value,
        color: colors[index % colors.length],
        // Additional data for tooltip
        total_quantity: category.total_quantity || 0,
        used_quantity: category.used_quantity || 0,
        available_quantity: category.available_quantity || 0
      };
    });
  }, [apiData.category_summary, colors]);

  const totalValue = categoryData.reduce((sum, cat) => sum + cat.value, 0);

  // Generate SVG path data for slice
  const generatePathData = (startAngle, endAngle) => {
    const radius = 40;
    const x1 = 50 + radius * Math.cos(((startAngle - 90) * Math.PI) / 180);
    const y1 = 50 + radius * Math.sin(((startAngle - 90) * Math.PI) / 180);
    const x2 = 50 + radius * Math.cos(((endAngle - 90) * Math.PI) / 180);
    const y2 = 50 + radius * Math.sin(((endAngle - 90) * Math.PI) / 180);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  // Update mouse position for tooltip
  const handleMouseMove = (e) => {
    const svgRect = e.currentTarget
      .querySelector("svg")
      .getBoundingClientRect();
    setHoverPosition({
      x: e.clientX - svgRect.left,
      y: e.clientY - svgRect.top,
    });
  };

  // Handle legend item hover
  const handleLegendHover = (index) => {
    setHoveredCategory(index);
  };

  return (
    <div style={chartCardStyle}>
      <div style={chartHeaderWithDateStyle}>
        <div style={chartHeaderStyle}>
          <div style={chartIconStyle}>📊</div>
          <h2 style={chartTitleStyle}>Product Categories</h2>
        </div>
        <div style={summaryStatsStyle}>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{apiData.summary.total_used_quantity || 0}</div>
            <div style={statLabelStyle}>In Use</div>
          </div>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{apiData.summary.total_available_quantity || 0}</div>
            <div style={statLabelStyle}>Available</div>
          </div>
          <div style={statItemStyle}>
            <div style={statValueStyle}>{apiData.summary.total_stock_quantity || 0}</div>
            <div style={statLabelStyle}>Total Stock</div>
          </div>
        </div>
      </div>

      <div style={doughnutChartContainerStyle} onMouseMove={handleMouseMove}>
        {loading ? (
          <div style={loadingStyle}>Loading product categories...</div>
        ) : error ? (
          <div style={loadingStyle}>{error}</div>
        ) : categoryData.length > 0 && totalValue > 0 ? (
          <>
            <div style={doughnutChartStyle} data-chart-container>
              <svg style={svgStyle} viewBox="0 0 100 100">
                {
                  categoryData.reduce(
                    (acc, item, index) => {
                      const prevValue = acc.prev;
                      const percentage = item.value / totalValue;
                      const angle = percentage * 360;
                      const path = generatePathData(
                        prevValue,
                        prevValue + angle
                      );
                      acc.prev += angle;
                      acc.paths.push(
                        <path
                          key={index}
                          d={path}
                          fill={item.color}
                          stroke="white"
                          strokeWidth="0.5"
                          onMouseEnter={() => setHoveredCategory(index)}
                          onMouseLeave={() => setHoveredCategory(null)}
                          style={{
                            cursor: "pointer",
                            opacity:
                              hoveredCategory === null ||
                              hoveredCategory === index
                                ? 1
                                : 0.6,
                            transition: "opacity 0.2s ease",
                          }}
                        />
                      );
                      return acc;
                    },
                    { prev: 0, paths: [] }
                  ).paths
                }
                <circle cx="50" cy="50" r="20" fill="white" />
                {/* Center text */}
                <text 
                  x="50" 
                  y="50" 
                  textAnchor="middle" 
                  dominantBaseline="middle"
                  style={{
                    fontSize: "6px",
                    fontWeight: "bold",
                    fill: "#374151"
                  }}
                >
                  Available
                </text>
                <text 
                  x="50" 
                  y="57" 
                  textAnchor="middle" 
                  dominantBaseline="middle"
                  style={{
                    fontSize: "8px",
                    fontWeight: "bold",
                    fill: "#1f2937"
                  }}
                >
                  {apiData.summary.total_available_quantity || 0}
                </text>
              </svg>
              {hoveredCategory !== null && (
                <div
                  style={{
                    position: "absolute",
                    left: hoverPosition.x + 150,
                    top: hoverPosition.y + 10,
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "rgba(20, 20, 20, 0.85)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "12px",
                    boxShadow: `
                      0 4px 6px rgba(0, 0, 0, 0.1),
                      0 1px 3px rgba(0, 0, 0, 0.08)
                    `,
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    zIndex: 1000,
                    pointerEvents: "none",
                    minWidth: 250,
                    maxWidth: 300,
                    padding: "14px 18px",
                    color: "rgba(255, 255, 255, 0.95)",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    textAlign: "left",
                    whiteSpace: "normal",
                    transition: "all 0.2s ease-out",
                    opacity: 1,
                  }}
                >
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    marginBottom: "8px" 
                  }}>
                    <div style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: categoryData[hoveredCategory].color,
                      marginRight: "10px",
                      flexShrink: 0
                    }} />
                    <div style={{ fontWeight: 600, fontSize: "16px", opacity: 1 }}>
                      {categoryData[hoveredCategory].name}
                    </div>
                  </div>
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(2, 1fr)", 
                    gap: "8px",
                    marginTop: "8px"
                  }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "24px", fontWeight: "bold", color: "#10b981" }}>
                        {categoryData[hoveredCategory].available_quantity}
                      </div>
                      <div style={{ fontSize: "12px", opacity: 0.8 }}>Available</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "24px", fontWeight: "bold", color: "#3b82f6" }}>
                        {categoryData[hoveredCategory].used_quantity}
                      </div>
                      <div style={{ fontSize: "12px", opacity: 0.8 }}>In Use</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Legend Section */}
            <div style={legendContainerStyle}>
              {categoryData.map((category, index) => (
                <div
                  key={index}
                  style={{
                    ...legendItemStyle,
                    opacity: hoveredCategory === null || hoveredCategory === index ? 1 : 0.6,
                  }}
                  onMouseEnter={() => handleLegendHover(index)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div style={{ ...legendDotStyle, backgroundColor: category.color }} />
                  <span style={legendTextStyle} title={category.name}>
                    {category.name}
                  </span>
                  <span style={legendValueStyle}>{category.available_quantity}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={loadingStyle}>No product data available</div>
        )}
      </div>
    </div>
  );
};

// ========== Styles ==========

const chartCardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "1.5rem",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  overflow: "hidden",
};

const chartHeaderWithDateStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "1.5rem",
  flexWrap: "wrap",
  gap: "1.5rem",
};

const chartHeaderStyle = {
  display: "flex",
  alignItems: "center",
  flex: 1,
  minWidth: "200px",
};

const summaryStatsStyle = {
  display: "flex",
  gap: "1.5rem",
  flexWrap: "wrap",
};

const statItemStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "0.75rem 1rem",
  backgroundColor: "#f8fafc",
  borderRadius: "10px",
  minWidth: "80px",
};

const statValueStyle = {
  fontSize: "1.5rem",
  fontWeight: "700",
  color: "#1e293b",
  marginBottom: "0.25rem",
};

const statLabelStyle = {
  fontSize: "0.875rem",
  fontWeight: "500",
  color: "#64748b",
};

const chartIconStyle = {
  padding: "0.5rem",
  backgroundColor: "#f1f5f9",
  borderRadius: "8px",
  fontSize: "1.25rem",
  marginRight: "0.75rem",
};

const chartTitleStyle = {
  fontSize: "1.25rem",
  fontWeight: "700",
  color: "#1e293b",
  margin: 0,
};

const doughnutChartContainerStyle = {
  position: "relative",
  minHeight: "400px",
  minWidth: "150px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  overflow: "visible",
};

const doughnutChartStyle = {
  width: "min(350px, 90vw)",
  height: "min(350px, 90vw)",
  position: "relative",
  marginBottom: "2rem",
};

const svgStyle = {
  width: "100%",
  height: "100%",
};

const legendContainerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "12px",
  width: "100%",
  maxWidth: "1000px",
  margin: "0 auto",
  padding: "0 1rem",
};

const legendItemStyle = {
  display: "flex",
  alignItems: "center",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  gap: "10px",
  minHeight: "40px",
  backgroundColor: "#f8fafc",
  transition: "all 0.2s ease",
  cursor: "pointer",
  ":hover": {
    backgroundColor: "#f1f5f9",
    borderColor: "#cbd5e1",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
  },
};

const legendDotStyle = {
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  flexShrink: 0,
};

const legendTextStyle = {
  fontSize: "14px",
  fontWeight: 500,
  color: "#1e293b",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  flex: 1,
  minWidth: 0,
};

const legendValueStyle = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#10b981",
  backgroundColor: "#d1fae5",
  padding: "2px 8px",
  borderRadius: "12px",
  flexShrink: 0,
};

const loadingStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  color: "#64748b",
  fontSize: "1rem",
  textAlign: "center",
  padding: "2rem",
};

export default ProductCategories;