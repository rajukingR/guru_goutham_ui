import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const RecentRentals = () => {

    const { user, token } = useSelector((state) => state.auth);
  
    const userToken = token;

  const [fromMonth, setFromMonth] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [toMonth, setToMonth] = useState(new Date());
  const [recentRentals, setRecentRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Format date to YYYY-MM for filtering
  const formatDateYYYYMM = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${year}-${month}`;
  };

  useEffect(() => {
    const fetchRentals = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/delivery-challans`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const startMonth = formatDateYYYYMM(fromMonth);
        const endMonth = formatDateYYYYMM(toMonth);

        // Filter Rent type challans within month range
        const filtered = data.filter((challan) => {
          if (challan.type !== "Rent") return false;

          const challanMonth = challan.dc_date.substring(0, 7); // Extract YYYY-MM
          return challanMonth >= startMonth && challanMonth <= endMonth;
        });

        const rentalsForTable = filtered.map((challan) => ({
          id: challan.dc_id || challan.id,
          shipping_name: challan.shipping_name || "-",
          model: challan.items?.[0]?.product_name || "-",
          startDate: challan.dc_date,
          endDate: "-",
          status: challan.dc_status || "Unknown",
        }));

        setRecentRentals(rentalsForTable);
      } catch (err) {
        console.error("Error fetching rentals:", err);
        setError("Failed to load recent rentals.");
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [fromMonth, toMonth]);

  // Styles
  // Styles (same as before)
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

  const dateRangeContainerStyle = {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  };

  const datePickerContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    minWidth: "150px",
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return {
          backgroundColor: "#dcfce7",
          color: "#166534",
          border: "1px solid #bbf7d0",
        };
      case "Completed":
        return {
          backgroundColor: "#dbeafe",
          color: "#1e40af",
          border: "1px solid #bfdbfe",
        };
      case "Overdue":
        return {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
          border: "1px solid #fecaca",
        };
      default:
        return {
          backgroundColor: "#f3f4f6",
          color: "#374151",
          border: "1px solid #e5e7eb",
        };
    }
  };

  const tableCardStyle = {
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    marginBottom: "20px",
  };

  const tableHeaderStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const tableIconStyle = {
    fontSize: "20px",
  };

  const tableTitleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0",
  };

  const tableContainerStyle = {
    overflowX: "auto",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const tableHeaderRowStyle = {
    backgroundColor: "#f8fafc",
  };

  const tableHeaderCellStyle = {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "600",
    color: "#64748b",
    borderBottom: "1px solid #e2e8f0",
  };

  const tableRowStyle = {
    borderBottom: "1px solid #e2e8f0",
    ":hover": {
      backgroundColor: "#f8fafc",
    },
  };

  const tableCellStyle = {
    padding: "12px 16px",
    fontSize: "14px",
    color: "#334155",
  };

  const tableCellIdStyle = {
    ...tableCellStyle,
    fontWeight: "500",
    color: "#3b82f6",
  };

  const statusBadgeStyle = {
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
    display: "inline-block",
  };

  return (
    <div style={tableCardStyle}>
      <div style={chartHeaderWithDateStyle}>
        <div style={chartHeaderStyle}>
          <div style={chartIconStyle}>📈</div>
          <h2 style={chartTitleStyle}>Recent Rentals</h2>
        </div>
        <div style={dateRangeContainerStyle}>
          <div style={datePickerContainerStyle}>
            <span style={datePickerLabelStyle}>From Month</span>
            <DatePicker
              selected={fromMonth}
              onChange={setFromMonth}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              showYearDropdown
              scrollableYearDropdown
              maxDate={toMonth}
              customInput={
                <button style={datePickerButtonStyle}>
                  {fromMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </button>
              }
            />
          </div>
          <div style={datePickerContainerStyle}>
            <span style={datePickerLabelStyle}>To Month</span>
            <DatePicker
              selected={toMonth}
              onChange={setToMonth}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              showYearDropdown
              scrollableYearDropdown
              minDate={fromMonth}
              maxDate={new Date()}
              customInput={
                <button style={datePickerButtonStyle}>
                  {toMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </button>
              }
            />
          </div>
        </div>
      </div>
      <div style={tableContainerStyle}>
        {loading ? (
          <div
            style={{ padding: "1rem", color: "#64748b", textAlign: "center" }}
          >
            Loading recent rentals...
          </div>
        ) : error ? (
          <div
            style={{ padding: "1rem", color: "#ef4444", textAlign: "center" }}
          >
            {error}
          </div>
        ) : recentRentals.length === 0 ? (
          <div
            style={{ padding: "1rem", color: "#64748b", textAlign: "center" }}
          >
            No rentals found for selected month.
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr style={tableHeaderRowStyle}>
                <th style={tableHeaderCellStyle}>Rental ID</th>
                <th style={tableHeaderCellStyle}>Customer Name</th>
                <th style={tableHeaderCellStyle}>Model</th>
                <th style={tableHeaderCellStyle}>Start Date</th>
                <th style={{ ...tableHeaderCellStyle, textAlign: "right" }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentRentals.map((row, index) => (
                <tr key={index} style={tableRowStyle}>
                  <td style={tableCellIdStyle}>{row.id}</td>
                  <td style={tableCellStyle}>{row.shipping_name}</td>
                  <td style={tableCellStyle}>{row.model}</td>
                  <td style={tableCellStyle}>{row.startDate}</td>
                  <td style={{ ...tableCellStyle, textAlign: "right" }}>
                    <span
                      style={{
                        ...statusBadgeStyle,
                        ...getStatusColor(row.status),
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RecentRentals;
