import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  TrendingUp,
  FileText,
  ShoppingCart,
  Truck,
  Clipboard,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const ClientJourneyOp = () => {
  const { user, token } = useSelector((state) => state.auth);

  const userToken = token;

  const [searchBy, setSearchBy] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    client: false,
    leads: false,
    quotation: false,
    orders: false,
    dc: false,
    grn: false,
  });
  const [clientData, setClientData] = useState([]);
  const [leadsData, setLeadsData] = useState([]);
  const [quotationData, setQuotationData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [dcData, setDcData] = useState([]);
  const [grnData, setGrnData] = useState([]);
  const [loading, setLoading] = useState({
    client: false,
    leads: false,
    quotation: false,
    orders: false,
    dc: false,
    grn: false,
  });
  const [error, setError] = useState({
    client: null,
    leads: null,
    quotation: null,
    orders: null,
    dc: null,
    grn: null,
  });

  useEffect(() => {
    // Fetch client data
    const fetchClientData = async () => {
      setLoading((prev) => ({ ...prev, client: true }));
      setError((prev) => ({ ...prev, client: null }));
      try {
        const response = await fetch(`${API_URL}/contacts/list`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch client data");
        const data = await response.json();
        setClientData(
          data.map((client) => ({
            dateOfFirstContact: client.date,
            contactCoName: client.company_name,
            clientCode: client.customer_id,
            contactPerson: `${client.first_name} ${client.last_name}`,
            mobileNumber: client.phone_number,
            email: client.email,
            clientOwner: client.owner,
          }))
        );
      } catch (err) {
        setError((prev) => ({ ...prev, client: err.message }));
      } finally {
        setLoading((prev) => ({ ...prev, client: false }));
      }
    };

    // Fetch leads data
    const fetchLeadsData = async () => {
      setLoading((prev) => ({ ...prev, leads: true }));
      setError((prev) => ({ ...prev, leads: null }));
      try {
        const response = await fetch(`${API_URL}/leads/list`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch leads data");
        const data = await response.json();
        setLeadsData(
          data.map((lead) => ({
            leadDate: lead.lead_date,
            leadCode: lead.lead_id,
            leadType: lead.transaction_type,
            leadOwner: lead.owner,
            leadTitle: lead.lead_title,
            executedBy: lead.lead_generated_by,
            leadStatus: lead.is_active ? "Active" : "Inactive",
          }))
        );
      } catch (err) {
        setError((prev) => ({ ...prev, leads: err.message }));
      } finally {
        setLoading((prev) => ({ ...prev, leads: false }));
      }
    };

    // Fetch quotation data
    const fetchQuotationData = async () => {
      setLoading((prev) => ({ ...prev, quotation: true }));
      setError((prev) => ({ ...prev, quotation: null }));
      try {
        const response = await fetch(`${API_URL}/quotations/list`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch quotation data");
        const data = await response.json();
        setQuotationData(
          data.map((quote) => ({
            quotationDate: quote.quotation_date,
            quotationCode: quote.quotation_id,
            quotationType: quote.status,
            quotationAmount: quote.items.reduce(
              (sum, item) => sum + (item.item_total_value || 0),
              0
            ),
            quotationStatus: quote.status,
            executedBy: quote.quotation_generated_by,
          }))
        );
      } catch (err) {
        setError((prev) => ({ ...prev, quotation: err.message }));
      } finally {
        setLoading((prev) => ({ ...prev, quotation: false }));
      }
    };

    // Fetch orders data
    const fetchOrdersData = async () => {
      setLoading((prev) => ({ ...prev, orders: true }));
      setError((prev) => ({ ...prev, orders: null }));
      try {
        const response = await fetch(`${API_URL}/orders/list`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch orders data");
        const data = await response.json();
        setOrdersData(
          data.map((order) => ({
            orderDate: order.order_date,
            orderCode: order.order_id,
            orderAmount: order.total_order_value,
            billingContact: `${order.personalDetails.first_name} ${order.personalDetails.last_name}`,
            shippingContact: `${order.personalDetails.first_name} ${order.personalDetails.last_name}`,
            paymentTerms: order.payment_type,
            executive: order.order_generated_by,
          }))
        );
      } catch (err) {
        setError((prev) => ({ ...prev, orders: err.message }));
      } finally {
        setLoading((prev) => ({ ...prev, orders: false }));
      }
    };

    // Fetch DC data
    const fetchDcData = async () => {
      setLoading((prev) => ({ ...prev, dc: true }));
      setError((prev) => ({ ...prev, dc: null }));
      try {
        const response = await fetch(`${API_URL}/delivery-challans/list`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch DC data");
        const data = await response.json();
        setDcData(
          data.map((dc) => ({
            dcDate: dc.dc_date,
            dcCode: dc.dc_id,
            vehicleNumber: dc.vehicle_number,
            deliveredStaff: dc.delivery_person_name,
            receiverName: dc.receiver_name,
            receiverPhNumber: dc.receiver_phone_number,
            shippingAddress: `${dc.street}, ${dc.city}, ${dc.state} - ${dc.pincode}`,
            dcStatus: dc.dc_status,
          }))
        );
      } catch (err) {
        setError((prev) => ({ ...prev, dc: err.message }));
      } finally {
        setLoading((prev) => ({ ...prev, dc: false }));
      }
    };

    // Fetch GRN data (mock data since no API provided)
    const fetchGrnData = async () => {
      setLoading((prev) => ({ ...prev, grn: true }));
      setError((prev) => ({ ...prev, grn: null }));
      try {
        // Mock data since we don't have an API for GRN
        setGrnData([
          {
            grnDate: "05-07-2024",
            grnCode: "8974",
            informedPerson: "Mr Sathish",
            contactNumber: "9123456789",
            returnedPerson: "Anand",
            contactNumber2: "9123456789",
            vehicleNumber: "KA 05 AD 9956",
          },
        ]);
      } catch (err) {
        setError((prev) => ({ ...prev, grn: err.message }));
      } finally {
        setLoading((prev) => ({ ...prev, grn: false }));
      }
    };

    fetchClientData();
    fetchLeadsData();
    fetchQuotationData();
    fetchOrdersData();
    fetchDcData();
    fetchGrnData();
  }, []);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const SectionHeader = ({ icon: Icon, title, sectionKey, color }) => (
    <div style={sectionHeaderStyle} onClick={() => toggleSection(sectionKey)}>
      <div style={{ ...iconContainerStyle, backgroundColor: color }}>
        <Icon style={iconStyle} />
      </div>
      <h3 style={sectionTitleStyle}>{title}</h3>
      <button style={toggleButtonStyle}>
        {expandedSections[sectionKey] ? (
          <ChevronUp style={chevronStyle} />
        ) : (
          <ChevronDown style={chevronStyle} />
        )}
      </button>
    </div>
  );

  const renderTable = (columns, data, sectionKey) => (
    <div style={tableContainerStyle}>
      {loading[sectionKey] ? (
        <div style={loadingStyle}>Loading data...</div>
      ) : error[sectionKey] ? (
        <div style={errorStyle}>Error: {error[sectionKey]}</div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr style={tableHeaderRowStyle}>
              {columns.map((column) => (
                <th key={column.key} style={tableHeaderCellStyle}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} style={tableRowStyle}>
                {columns.map((column) => (
                  <td key={column.key} style={tableCellStyle}>
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderSection = (sectionKey, icon, title, color, data, columns) => (
    <div style={sectionContainerStyle}>
      <div style={sectionHeaderContainerStyle}>
        <SectionHeader
          icon={icon}
          title={title}
          sectionKey={sectionKey}
          color={color}
        />
      </div>

      {expandedSections[sectionKey] && (
        <div style={sectionContentStyle}>
          {renderTable(columns, data, sectionKey)}
        </div>
      )}
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Operations / Client Journey Report</h1>
      </div>

      <div style={searchControlsStyle}>
        <div style={selectContainerStyle}>
          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            style={selectStyle}
          >
            <option value="">Search By</option>
            <option value="client">Code</option>
            <option value="code">Name</option>
          </select>
          <ChevronDown style={selectChevronStyle} />
        </div>
        <div style={searchInputContainerStyle}>
          <input
            type="text"
            placeholder="Enter Code/Name"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            style={searchInputStyle}
          />
          <Search style={searchIconStyle} />
        </div>
      </div>

      {renderSection("client", User, "Client", "#3b82f6", clientData, [
        { key: "dateOfFirstContact", label: "Date of First Contact" },
        { key: "contactCoName", label: "Contact/Co. Name" },
        { key: "clientCode", label: "Client Code" },
        { key: "contactPerson", label: "Contact Person" },
        { key: "mobileNumber", label: "Mobile Number" },
        { key: "email", label: "Email" },
        { key: "clientOwner", label: "Client Owner" },
      ])}

      {renderSection("leads", TrendingUp, "Leads", "#3b82f6", leadsData, [
        { key: "leadDate", label: "Lead Date" },
        { key: "leadCode", label: "Lead Code" },
        { key: "leadType", label: "Lead Type" },
        { key: "leadOwner", label: "Lead Owner" },
        { key: "leadTitle", label: "Lead Title" },
        { key: "executedBy", label: "Executed By" },
        { key: "leadStatus", label: "Lead Status" },
      ])}

      {renderSection(
        "quotation",
        FileText,
        "Quotation",
        "#3b82f6",
        quotationData,
        [
          { key: "quotationDate", label: "Quotation Date" },
          { key: "quotationCode", label: "Quotation Code" },
          { key: "quotationType", label: "Quotation Type" },
          { key: "quotationAmount", label: "Quotation Amount" },
          { key: "quotationStatus", label: "Quotation Status" },
          { key: "executedBy", label: "Executed By" },
        ]
      )}

      {renderSection("orders", ShoppingCart, "Orders", "#3b82f6", ordersData, [
        { key: "orderDate", label: "Order Date" },
        { key: "orderCode", label: "Order Code" },
        { key: "orderAmount", label: "Order Amount" },
        { key: "billingContact", label: "Billing Contact" },
        { key: "shippingContact", label: "Shipping Contact" },
        { key: "paymentTerms", label: "Payment Terms" },
        { key: "executive", label: "Executive" },
      ])}

      {renderSection("dc", Truck, "DC", "#3b82f6", dcData, [
        { key: "dcDate", label: "DC Date" },
        { key: "dcCode", label: "DC Code" },
        { key: "vehicleNumber", label: "Vehicle Number" },
        { key: "deliveredStaff", label: "Delivered Staff" },
        { key: "receiverName", label: "Receiver Name" },
        { key: "receiverPhNumber", label: "Receiver Ph.Number" },
        { key: "shippingAddress", label: "Shipping Address" },
        { key: "dcStatus", label: "DC Status" },
      ])}

      {renderSection("grn", Clipboard, "GRN", "#3b82f6", grnData, [
        { key: "grnDate", label: "GRN Date" },
        { key: "grnCode", label: "GRN Code" },
        { key: "informedPerson", label: "Informed Person" },
        { key: "contactNumber", label: "Contact Number" },
        { key: "returnedPerson", label: "Returned Person" },
        { key: "contactNumber2", label: "Contact Number" },
        { key: "vehicleNumber", label: "Vehicle Number" },
      ])}
    </div>
  );
};

// Styles remain the same as your original code
const containerStyle = {
  padding: "2rem",
  fontFamily:
    '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  minHeight: "100vh",
  lineHeight: 1.6,
};

const headerStyle = {
  marginBottom: "1.5rem",
};

const titleStyle = {
  fontSize: "1.5rem",
  fontWeight: "600",
  color: "#1e293b",
};

const searchControlsStyle = {
  display: "flex",
  gap: "1rem",
  marginBottom: "1.5rem",
};

const selectContainerStyle = {
  position: "relative",
};

const selectStyle = {
  appearance: "none",
  backgroundColor: "#ffffff",
  border: "1px solid #d1d5db",
  borderRadius: "0.375rem",
  padding: "0.5rem 2rem 0.5rem 1rem",
  fontSize: "0.875rem",
  outline: "none",
  width: "150px",
  cursor: "pointer",
};

const selectChevronStyle = {
  position: "absolute",
  right: "0.5rem",
  top: "0.7rem",
  width: "1rem",
  height: "1rem",
  color: "#9ca3af",
  pointerEvents: "none",
};

const searchInputContainerStyle = {
  position: "relative",
};

const searchInputStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #d1d5db",
  borderRadius: "0.375rem",
  padding: "0.5rem 2rem 0.5rem 1rem",
  fontSize: "0.875rem",
  outline: "none",
  width: "320px",
};

const searchIconStyle = {
  position: "absolute",
  right: "0.75rem",
  top: "0.6rem",
  width: "1rem",
  height: "1rem",
  color: "#9ca3af",
};

const sectionContainerStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "0.5rem",
  marginBottom: "1rem",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
  border: "1px solid #e2e8f0",
  overflow: "hidden",
};

const sectionHeaderContainerStyle = {
  padding: "1.5rem",
  paddingBottom: "1rem",
};

const sectionHeaderStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "1rem",
  cursor: "pointer",
  opacity: 1,
  transition: "opacity 0.2s ease",
};

const iconContainerStyle = {
  width: "3rem",
  height: "3rem",
  borderRadius: "0.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: "1rem",
};

const iconStyle = {
  width: "1.5rem",
  height: "1.5rem",
  color: "#ffffff",
};

const sectionTitleStyle = {
  fontSize: "1.125rem",
  fontWeight: "500",
  color: "#1e293b",
  flexGrow: 1,
};

const toggleButtonStyle = {
  padding: "0.25rem",
  background: "none",
  border: "none",
  cursor: "pointer",
};

const chevronStyle = {
  width: "1.25rem",
  height: "1.25rem",
  color: "#6b7280",
};

const sectionContentStyle = {
  padding: "0 1.5rem 1.5rem 1.5rem",
  transition: "all 0.3s ease",
};

const tableContainerStyle = {
  overflowX: "auto",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#ffffff",
  borderRadius: "0.375rem",
  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
};

const tableHeaderRowStyle = {
  backgroundColor: "#f9fafb",
};

const tableHeaderCellStyle = {
  padding: "0.75rem",
  textAlign: "left",
  fontSize: "0.875rem",
  fontWeight: "500",
  color: "#374151",
  borderBottom: "1px solid #e5e7eb",
};

const tableRowStyle = {
  transition: "background-color 0.2s ease",
  ":hover": {
    backgroundColor: "#f9fafb",
  },
};

const tableCellStyle = {
  padding: "0.75rem",
  fontSize: "0.875rem",
  color: "#6b7280",
  borderBottom: "1px solid #e5e7eb",
};

const loadingStyle = {
  padding: "1rem",
  textAlign: "center",
  color: "#64748b",
  fontStyle: "italic",
};

const errorStyle = {
  padding: "1rem",
  textAlign: "center",
  color: "#ef4444",
  fontStyle: "italic",
};

export default ClientJourneyOp;
