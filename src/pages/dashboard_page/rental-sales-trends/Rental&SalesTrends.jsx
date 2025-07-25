import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import API_URL from "../../../api/Api_url";

const RentalAndSalesTrends = () => {
  const [trendsDate, setTrendsDate] = useState(new Date());
  const [monthlyTrendsData, setMonthlyTrendsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const chartRef = useRef(null);

  // Month names for display
  const monthNames = [
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

  useEffect(() => { 
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/delivery-challans`);
        if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const year = trendsDate.getFullYear();
        // Initialize totals per month
        const monthlyData = Array(12)
          .fill(0)
          .map((_, idx) => ({
            month: monthNames[idx],
            rentals: 0,
            sales: 0,
            year,
          }));

        // Aggregate quantities by month and type
        data.forEach((challan) => {
          const challanDate = new Date(challan.dc_date);
          if (challanDate.getFullYear() === year) {
            const m = challanDate.getMonth();
            const qty = challan.items.reduce(
              (acc, item) => acc + (item.quantity || 0),
              0
            );
            if (challan.type === "Rent") monthlyData[m].rentals += qty;
            else if (challan.type === "Buy") monthlyData[m].sales += qty;
          }
        });

        setMonthlyTrendsData(monthlyData);
      } catch (e) {
        setError("Failed to load trends data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [trendsDate]);

  const maxRental = Math.max(...monthlyTrendsData.map((d) => d.rentals), 1);
  const maxSales = Math.max(...monthlyTrendsData.map((d) => d.sales), 1);

  const handleBarHover = (e, data, index, type) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    const barRect = e.currentTarget.getBoundingClientRect();
    setHoverPosition({
      x: barRect.left + barRect.width / 2 - rect.left,
      y: barRect.top - rect.top,
    });
    setHoveredBar({ data, index, type });
  };

  return (
    <div style={chartCardStyle}>
      <div style={chartHeaderWithDateStyle}>
        <div style={chartHeaderStyle}>
          <div style={chartIconStyle}>📈</div>
          <h2 style={chartTitleStyle}>Rental & Sales Trends</h2>
        </div>
        {/* <div style={datePickerContainerStyle}>
          <span style={datePickerLabelStyle}>Select Month & Year</span>
          <DatePicker
            selected={trendsDate}
            onChange={setTrendsDate}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            showYearDropdown
            scrollableYearDropdownjuhgv
            maxDate={new Date()}
            customInput={
              <button style={datePickerButtonStyle}>
                {trendsDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </button>
            }
          />
        </div> */}
      </div>

      <div style={lineChartContainerStyle} ref={chartRef}>
        {loading ? (
          <div style={loadingStyle}>Loading trends data...</div>
        ) : error ? (
          <div style={loadingStyle}>{error}</div>
        ) : monthlyTrendsData.length === 0 ? (
          <div style={loadingStyle}>
            No data available for the selected year.
          </div>
        ) : (
          <>
            <div style={lineChartStyle}>
              {monthlyTrendsData.map((data, index) => (
                <div key={index} style={barGroupStyle}>
                  <div style={barsContainerStyle}>
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label={`${data.month} Rentals: ${data.rentals}`}
                      style={{
                        ...barStyle,
                        backgroundColor: "#3b82f6",
                        height: `${(data.rentals / maxRental) * 180}px`,
                        opacity: data.rentals > 0 ? 1 : 0.3,
                      }}
                      onMouseEnter={(e) =>
                        handleBarHover(e, data, index, "rentals")
                      }
                      onFocus={(e) => handleBarHover(e, data, index, "rentals")}
                      onMouseLeave={() => setHoveredBar(null)}
                      onBlur={() => setHoveredBar(null)}
                    />
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label={`${data.month} Sales: ${data.sales}`}
                      style={{
                        ...barStyle,
                        backgroundColor: "#ef4444",
                        height: `${(data.sales / maxSales) * 180}px`,
                        opacity: data.sales > 0 ? 1 : 0.3,
                      }}
                      onMouseEnter={(e) =>
                        handleBarHover(e, data, index, "sales")
                      }
                      onFocus={(e) => handleBarHover(e, data, index, "sales")}
                      onMouseLeave={() => setHoveredBar(null)}
                      onBlur={() => setHoveredBar(null)}
                    />
                  </div>
                  <span style={monthLabelStyle}>{data.month}</span>
                </div>
              ))}
            </div>

            <div style={chartLegendStyle}>
              <div style={legendItemStyle}>
                <div
                  style={{ ...legendColorStyle, backgroundColor: "#3b82f6" }}
                />
                <span style={legendTextStyle}>Rentals</span>
              </div>
              <div style={legendItemStyle}>
                <div
                  style={{ ...legendColorStyle, backgroundColor: "#ef4444" }}
                />
                <span style={legendTextStyle}>Sales</span>
              </div>
            </div>

            {hoveredBar && (
              <div
                style={{
                  position: "absolute",
                  left: hoverPosition.x,
                  top: hoverPosition.y - 10,
                  transform: "translate(-50%, -100%)",
                  backgroundColor: "rgba(0, 0, 0, 0.75)",
                  borderRadius: 6,
                  padding: "8px 12px",
                  color: "white",
                  fontSize: 14,
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                  zIndex: 100,
                  userSelect: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                <div style={{ fontWeight: "600", marginBottom: 4 }}>
                  {hoveredBar.data.month} {hoveredBar.data.year}
                </div>
                <div>
                  {hoveredBar.type === "rentals" ? "Rentals: " : "Sales: "}
                  <strong>
                    {hoveredBar.data[hoveredBar.type]?.toLocaleString()}
                  </strong>
                </div>
                <div style={{ fontSize: "12px", opacity: 0.8 }}>
                  {(
                    (hoveredBar.data[hoveredBar.type] /
                      (hoveredBar.type === "rentals" ? maxRental : maxSales)) *
                    100
                  ).toFixed(1)}
                  % of max
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Styles (reuse your styles or add these)

const chartCardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "1.5rem",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
};

const chartHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

const chartHeaderWithDateStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "1.5rem",
  flexWrap: "wrap",
  gap: "1rem",
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

const lineChartContainerStyle = {
  position: "relative", // for tooltip positioning
  height: "320px",
};

const lineChartStyle = {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  height: "240px",
  padding: "1rem 0",
  borderBottom: "1px solid #e2e8f0",
  gap: "6px",
  overflowX: "auto",
};

const barGroupStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.25rem",
  flex: "0 0 28px",
};

const barsContainerStyle = {
  display: "flex",
  alignItems: "flex-end",
  gap: "4px",
  width: "100%",
  justifyContent: "center",
  cursor: "default",
};

const barStyle = {
  width: "8px",
  borderRadius: "4px 4px 0 0",
  transition: "height 0.3s ease",
  outline: "none",
};

const monthLabelStyle = {
  fontSize: "0.75rem",
  color: "#64748b",
  userSelect: "none",
};

const chartLegendStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "2rem",
  marginTop: "1rem",
};

const legendItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  cursor: "default",
  transition: "all 0.2s ease",
};

const legendColorStyle = {
  width: "14px",
  height: "14px",
  borderRadius: "50%",
  flexShrink: 0,
};

const legendTextStyle = {
  fontSize: "0.875rem",
  color: "#64748b",
  userSelect: "none",
};

const loadingStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  color: "#64748b",
  fontSize: "1rem",
  userSelect: "none",
};

export default RentalAndSalesTrends;
