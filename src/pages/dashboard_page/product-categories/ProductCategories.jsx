import React, { useState, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import API_URL from "../../../api/Api_url";

const ProductCategories = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/product-categories`);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        setApiData(data);
      } catch (err) {
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Seeded random function for reproducible random values per category and date
  const seededRandom = (seed) => {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Generate category data based on selectedDate
  const categoryData = useMemo(() => {
    if (!apiData || apiData.length === 0) return [];

    const colors = [
      "#fb923c", "#6366f1", "#2dd4bf", "#f472b6", "#fbbf24",
      "#a855f7", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6",
      "#ec4899", "#14b8a6", "#c084fc", "#f0abfc", "#e879f9",
      "#f43f5e", "#ef4444", "#a3e635", "#d946ef", "#06b6d4",
    ];

    const seedBase = selectedDate.getMonth() + 1 + selectedDate.getFullYear() * 100;

    return apiData.map((category, index) => {
      const seed = seedBase + index * 13;
      const value = Math.floor(seededRandom(seed) * 100) + 5;
      return {
        name: category.category_name || `Category ${index + 1}`,
        value,
        // Always use preset colors since API doesn't have colors
        color: colors[index % colors.length],
      };
    });
  }, [apiData, selectedDate]);

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
    const svgRect = e.currentTarget.querySelector("svg").getBoundingClientRect();
    setHoverPosition({
      x: e.clientX - svgRect.left,
      y: e.clientY - svgRect.top,
    });
  };

  return (
    <div style={chartCardStyle}>
      <div style={chartHeaderWithDateStyle}>
        <div style={chartHeaderStyle}>
          <div style={chartIconStyle}>📊</div>
          <h2 style={chartTitleStyle}>Product Categories</h2>
        </div>
        <div style={datePickerContainerStyle}>
          <span style={datePickerLabelStyle}>Filter by Date</span>
          <DatePicker
            selected={selectedDate}
            onChange={setSelectedDate}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            customInput={
              <button style={datePickerButtonStyle}>
                {selectedDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </button>
            }
          />
        </div>
      </div>

      <div style={doughnutChartContainerStyle} onMouseMove={handleMouseMove}>
        {loading ? (
          <div style={loadingStyle}>Loading categories...</div>
        ) : error ? (
          <div style={loadingStyle}>{error}</div>
        ) : categoryData.length > 0 && totalValue > 0 ? (
          <>
            <div style={doughnutChartStyle} data-chart-container>
              <svg style={svgStyle} viewBox="0 0 100 100">
                {categoryData.reduce(
                  (acc, item, index) => {
                    const prevValue = acc.prev;
                    const percentage = item.value / totalValue;
                    const angle = percentage * 360;
                    const path = generatePathData(prevValue, prevValue + angle);
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
                            hoveredCategory === null || hoveredCategory === index
                              ? 1
                              : 0.6,
                          transition: "opacity 0.2s ease",
                        }}
                      />
                    );
                    return acc;
                  },
                  { prev: 0, paths: [] }
                ).paths}
                <circle cx="50" cy="50" r="20" fill="white" />
              </svg>
              {hoveredCategory !== null && (
                <div
                  style={{
                    position: "absolute",
                    left: hoverPosition.x + 150,
                    top: hoverPosition.y + 10,
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "rgba(20, 20, 20, 0.75)",
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
                    padding: "12px 16px",
                    color: "rgba(255, 255, 255, 0.95)",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s ease-out",
                    opacity: 1,
                  }}
                >
                  <div
                    style={{ fontWeight: 500, marginBottom: 4, opacity: 0.9 }}
                  >
                    {categoryData[hoveredCategory].name}
                  </div>
                  <div style={{ fontWeight: 400, opacity: 0.8 }}>
                    Value: {categoryData[hoveredCategory].value.toLocaleString()}
                  </div>
                  <div style={{ fontWeight: 400, opacity: 0.8 }}>
                    Percentage:{" "}
                    {(
                      (categoryData[hoveredCategory].value / totalValue) *
                      100
                    ).toFixed(2)}
                    %
                  </div>
                </div>
              )}
            </div>

            <div style={legendRowsContainerStyle}>
  {Array.from({ length: Math.ceil(categoryData.length / 5) }).map((_, rowIndex) => (
    <div key={rowIndex} style={legendRowStyle}>
      {categoryData
        .slice(rowIndex * 5, rowIndex * 5 + 5)
        .map((item, index) => (
          <div
            key={index}
            style={{
              ...legendItemBoxStyle,
              backgroundColor:
                hoveredCategory === rowIndex * 5 + index ? "#f1f5f9" : "#ffffff",
            }}
            onMouseEnter={() => setHoveredCategory(rowIndex * 5 + index)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div
              style={{
                ...legendDotStyle,
                backgroundColor: item.color,
              }}
            />
            <span style={legendTextStyle}>
              {item.name} (₹{item.value.toLocaleString("en-IN")})
            </span>
          </div>
        ))}
    </div>
  ))}
</div>

          </>
        ) : (
          <div style={loadingStyle}>No data available</div>
        )}
      </div>
    </div>
  );
};

// ========== Your ORIGINAL Styles ==========


const legendRowsContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginTop: "1.5rem",
};

const legendRowStyle = {
  display: "flex",
  flexDirection: "row",
  gap: "12px",
};

const legendItemBoxStyle = {
  display: "flex",
  alignItems: "center",
  padding: "6px 12px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  gap: "8px",
  minHeight: "36px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  minWidth: "200px",
};

const legendDotStyle = {
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  flexShrink: 0,
};

const legendTextStyle = {
  fontSize: "14px",
  fontWeight: 500,
  color: "#1e293b",
};

const chartCardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "1.5rem",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
};

const chartHeaderWithDateStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "1.5rem",
  flexWrap: "wrap",
};

const chartHeaderStyle = {
  display: "flex",
  alignItems: "center",
};

const chartIconStyle = {
  padding: "0.5rem",
  backgroundColor: "#f1f5f9",
  borderRadius: "8px",
  fontSize: "1.25rem",
};

const chartTitleStyle = {
  fontSize: "1.25rem",
  fontWeight: "700",
  color: "#1e293b",
  margin: 0,
};

const datePickerContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  minWidth: "200px",
};

const datePickerLabelStyle = {
  fontSize: "0.875rem",
  fontWeight: "600",
  color: "#64748b",
};

const datePickerButtonStyle = {
  padding: "0.5rem 0.75rem",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "0.875rem",
  fontWeight: "500",
  color: "#374151",
  backgroundColor: "#ffffff",
  cursor: "pointer",
  minWidth: "150px",
  textAlign: "left",
};

const doughnutChartContainerStyle = {
  position: "relative",
  height: "500px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const doughnutChartStyle = {
  width: "300px",
  height: "300px",
  position: "relative",
};

const svgStyle = {
  width: "100%",
  height: "100%",
};

const legendBelowStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "0.5rem",
  marginTop: "1.5rem",
  maxWidth: "600px",
};

const legendItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  cursor: "pointer",
};

const legendColorStyle = {
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  flexShrink: 0,
};


const legendValueStyle = {
  fontSize: "0.875rem",
  fontWeight: "600",
  color: "#1e293b",
  marginLeft: "auto",
};

const loadingStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  color: "#64748b",
  fontSize: "1rem",
};

export default ProductCategories;
