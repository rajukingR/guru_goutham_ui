import React, { useState, useEffect } from "react";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";


Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const reportOptions = [
  { label: "Select Report", value: "" },
  { label: "Sales Performance Report", value: "Sales Performance Report" },
  {
    label: "Lead Source Analysis Report",
    value: "Lead Source Analysis Report",
  },
  { label: "Inventory Valuation Report", value: "Inventory Valuation Report" },
  { label: "Stock Movement Report", value: "Stock Movement Report" },
  { label: "Order Status Report", value: "Order Status Report" },
  {
    label: "Inventory Availability Report",
    value: "Inventory Availability Report",
  },
  {
    label: "Supplier Performance Report",
    value: "Supplier Performance Report",
  },
  {
    label: "Purchase Order Cycle Time Report",
    value: "Purchase Order Cycle Time Report",
  },
  { label: "Maintenance History Report", value: "Maintenance History Report" },
  { label: "Downtime Analysis Report", value: "Downtime Analysis Report" },
  { label: "Cost of Maintenance Report", value: "Cost of Maintenance Report" },
];

const AllReportsDataLayout = () => {
  const [selectedReport, setSelectedReport] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setSelectedReport(e.target.value);
    setError(null);
  };

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      setError(null);

      try {
        let url;
        switch (selectedReport) {
          case "Sales Performance Report":
            url = `${API_URL}/sales-report`;
            break;
          case "Lead Source Analysis Report":
            url = `${API_URL}/sales-report/leads-reports`;
            break;
          case "Inventory Valuation Report":
            url =
              `${API_URL}/goods-receipts/approved-receipt-products`;
            break;
          case "Stock Movement Report":
            url = `${API_URL}/orders`;
            break;
          case "Inventory Availability Report":
            url = `${API_URL}/sales-report`;
            break;
          case "Order Status Report":
            url = `${API_URL}/sales-report/orders-reports`;
            break;
          // For the remaining reports, use dummy data
          default:
            setReportData(null);
            return;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Handle different response structures
        if (
          selectedReport === "Sales Performance Report" ||
          selectedReport === "Inventory Availability Report"
        ) {
          if (Array.isArray(data)) {
            setReportData(data);
          } else if (data && Array.isArray(data.data)) {
            setReportData(data.data);
          } else if (data && data.success !== undefined) {
            setReportData(data.success ? data.data || [] : []);
          } else {
            setReportData([data]);
          }
        } else if (selectedReport === "Order Status Report") {
          // Transform the order status report data into our desired format
          const transformedData = Object.entries(data).map(
            ([status, details]) => ({
              status,
              totalOrders: details.totalOrders || 0,
              totalQuantity: details.totalQuantity || 0,
              totalAmount: details.totalAmount || 0,
            })
          );
          setReportData(transformedData);
        } else if (selectedReport === "Stock Movement Report") {
          setReportData(data);
        } else {
          setReportData(data);
        }
      } catch (err) {
        console.error(`Failed to fetch ${selectedReport}:`, err);
        setError(`Failed to load report: ${err.message}`);
        setReportData(null);
      } finally {
        setLoading(false);
      }
    };

    // For dummy reports, set dummy data directly
    if (
      [
        "Supplier Performance Report",
        "Purchase Order Cycle Time Report",
        "Maintenance History Report",
        "Downtime Analysis Report",
        "Cost of Maintenance Report",
      ].includes(selectedReport)
    ) {
      setReportData("dummy"); // Just a flag, actual data is in getCurrentReportData
      setLoading(false);
      setError(null);
      return;
    }

    if (selectedReport) {
      fetchReportData();
    }
  }, [selectedReport]);

  const formatCurrency = (amount) => {
    if (isNaN(amount)) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  const getMonthsDifference = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return (
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth()) +
        1
      );
    } catch {
      return 0;
    }
  };

  const calculateMetrics = () => {
    let leads = [];

    if (Array.isArray(reportData)) {
      leads = reportData;
    } else if (reportData && Array.isArray(reportData.data)) {
      leads = reportData.data;
    } else if (reportData) {
      leads = [reportData];
    }

    const totalLeads = leads.length;
    const totalQuotations = leads.reduce(
      (sum, lead) => sum + (lead.quotations?.length || 0),
      0
    );
    const allOrders = leads.flatMap((lead) =>
      (lead.quotations || []).flatMap((q) => q.orders || [])
    );
    const totalOrders = allOrders.length;

    const totalRevenue = allOrders.reduce((sum, order) => {
      const rentalMonths = getMonthsDifference(
        order.rental_start_date,
        order.rental_end_date
      );
      return (
        sum +
        (order.items || []).reduce((itemSum, item) => {
          const rentPrice = parseFloat(item.product?.rent_price_per_month || 0);
          return (
            itemSum + rentPrice * (item.requested_quantity || 0) * rentalMonths
          );
        }, 0)
      );
    }, 0);

    const conversionRate =
      totalLeads > 0 ? ((totalOrders / totalLeads) * 100).toFixed(1) : 0;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalLeads,
      totalQuotations,
      totalOrders,
      conversionRate,
      totalRevenue,
      avgOrderValue,
    };
  };

  const calculateInventoryMetrics = () => {
    if (!reportData)
      return {
        totalStockValue: 0,
        totalRentUsedValue: 0,
        totalBuyUsedValue: 0,
        totalQuantity: 0,
      };

    const products = Array.isArray(reportData.products)
      ? reportData.products
      : [];
    const summary = reportData.summary || {};

    const totalQuantity = products.reduce(
      (sum, item) => sum + (item.total_quantity || 0),
      0
    );

    return {
      totalStockValue: summary.grand_total_stock_value || 0,
      totalRentUsedValue: products.reduce(
        (sum, item) => sum + (item.used_rent_value || 0),
        0
      ),
      totalBuyUsedValue: products.reduce(
        (sum, item) => sum + (item.used_buy_value || 0),
        0
      ),
      totalQuantity,
    };
  };

  const calculateStockMovement = () => {
    if (!reportData || !Array.isArray(reportData)) {
      return {
        inflowQuantity: 0,
        inflowValue: 0,
        rentedQuantity: 0,
        rentedValue: 0,
        soldQuantity: 0,
        soldValue: 0,
      };
    }

    // Calculate rented items
    const rentedOrders = reportData.filter(
      (order) => order.transaction_type === "Rent"
    );
    const rentedQuantity = rentedOrders.reduce(
      (sum, order) => sum + (order.total_quantity || 0),
      0
    );
    const rentedValue = rentedOrders.reduce(
      (sum, order) => sum + (order.total_order_value || 0),
      0
    );

    // Calculate sold items
    const soldOrders = reportData.filter(
      (order) => order.transaction_type === "Sale"
    );
    const soldQuantity = soldOrders.reduce(
      (sum, order) => sum + (order.total_quantity || 0),
      0
    );
    const soldValue = soldOrders.reduce(
      (sum, order) => sum + (order.total_order_value || 0),
      0
    );

    return {
      inflowQuantity: 0,
      inflowValue: 0,
      rentedQuantity,
      rentedValue,
      soldQuantity,
      soldValue,
    };
  };

  const calculateInventoryAvailability = () => {
    if (!reportData || !Array.isArray(reportData)) {
      return {
        totalProductsTracked: 0,
        totalAvailableQuantity: 0,
        totalRentedQuantity: 0,
        totalSoldQuantity: 0,
        totalStockValue: 0,
      };
    }

    // Get all lead products
    const allLeadProducts = reportData.flatMap(
      (lead) =>
        lead.lead_products?.map((product) => ({
          productId: product.product_id,
          quantity: product.quantity || 0,
        })) || []
    );

    // Get all ordered items
    const allOrderedItems = reportData.flatMap(
      (lead) =>
        lead.quotations?.flatMap(
          (quotation) =>
            quotation.orders?.flatMap(
              (order) =>
                order.items?.map((item) => ({
                  productId: item.product_id,
                  quantity: item.requested_quantity || 0,
                  transactionType: order.transaction_type,
                  productPrice: parseFloat(item.product?.purchase_price || 0),
                  rentPrice: parseFloat(
                    item.product?.rent_price_per_month || 0
                  ),
                })) || []
            ) || []
        ) || []
    );

    // Count unique products
    const uniqueProductIds = [
      ...new Set(allLeadProducts.map((p) => p.productId)),
    ];
    const totalProductsTracked = uniqueProductIds.length;

    // Calculate total quantities
    const totalLeadQuantity = allLeadProducts.reduce(
      (sum, product) => sum + (product.quantity || 0),
      0
    );
    const totalRentedQuantity = allOrderedItems
      .filter((item) => item.transactionType === "Rent")
      .reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalSoldQuantity = allOrderedItems
      .filter((item) => item.transactionType === "Sale")
      .reduce((sum, item) => sum + (item.quantity || 0), 0);

    // Calculate stock value
    const totalStockValue = allLeadProducts.reduce((sum, product) => {
      // Find matching ordered item to get price
      const orderedItem = allOrderedItems.find(
        (item) => item.productId === product.productId
      );
      const price = orderedItem?.productPrice || 0;
      return sum + price * (product.quantity || 0);
    }, 0);

    // Calculate available quantity (assuming initial stock is sum of lead products)
    const totalAvailableQuantity =
      totalLeadQuantity - totalRentedQuantity - totalSoldQuantity;

    return {
      totalProductsTracked,
      totalAvailableQuantity: Math.max(0, totalAvailableQuantity), // Ensure not negative
      totalRentedQuantity,
      totalSoldQuantity,
      totalStockValue,
    };
  };

  const getCurrentReportData = () => {
    if (!selectedReport) return null;

    switch (selectedReport) {
      case "Sales Performance Report":
        const metrics = calculateMetrics();
        return {
          title: "Sales Performance Report",
          subtitle: "Key metrics and performance indicators",
          summary: [
            { label: "Total Leads", value: metrics.totalLeads },
            { label: "Total Quotations Sent", value: metrics.totalQuotations },
            { label: "Total Orders Confirmed", value: metrics.totalOrders },
            { label: "Conversion Rate", value: `${metrics.conversionRate}%` },
            {
              label: "Total Revenue",
              value: formatCurrency(metrics.totalRevenue),
            },
            {
              label: "Average Order Value",
              value: formatCurrency(metrics.avgOrderValue),
            },
          ],
          headers: [
            "Lead ID",
            "Lead Title",
            "Owner",
            "Quotation ID",
            "Order ID",
            "Status",
            "Items",
            "Rental Period",
            "Revenue",
          ],
          rows: Array.isArray(reportData)
            ? reportData.flatMap((lead) =>
                (lead.quotations || []).flatMap((quotation) =>
                  (quotation.orders || []).map((order) => {
                    const itemsList = (order.items || [])
                      .map(
                        (item) =>
                          `${item.product_name || "Unknown"} (${
                            item.requested_quantity || 0
                          })`
                      )
                      .join(", ");
                    const rentalMonths = getMonthsDifference(
                      order.rental_start_date,
                      order.rental_end_date
                    );
                    const revenue = (order.items || []).reduce((sum, item) => {
                      const rentPrice = parseFloat(
                        item.product?.rent_price_per_month || 0
                      );
                      return (
                        sum +
                        rentPrice *
                          (item.requested_quantity || 0) *
                          rentalMonths
                      );
                    }, 0);
                    return [
                      lead.lead_id || "-",
                      lead.lead_title || "-",
                      lead.owner || "-",
                      quotation.quotation_id || "-",
                      order.order_id || "-",
                      order.order_status || "-",
                      itemsList || "-",
                      order.rental_start_date && order.rental_end_date
                        ? `${order.rental_start_date} to ${order.rental_end_date} (${rentalMonths} months)`
                        : "-",
                      formatCurrency(revenue),
                    ];
                  })
                )
              )
            : [],
          showTable: true,
        };

      case "Lead Source Analysis Report":
        return {
          title: "Lead Source Analysis Report",
          subtitle: "Analysis of lead sources and conversions",
          summary: [],
          headers: [
            "Lead Source",
            "Source of Enquiry",
            "Total Leads",
            "Converted Leads",
            "Conversion Rate (%)",
          ],
          rows: Array.isArray(reportData)
            ? reportData.map((item) => {
                const mapping = {
                  Website: { source: "Organic Search", converted: 60 },
                  "Social Media": { source: "Instagram Ads", converted: 20 },
                  Referral: { source: "Existing Customers", converted: 50 },
                };
                const converted =
                  mapping[item.source_of_enquiry]?.converted || 0;
                const total = item.lead_count || 0;
                const rate =
                  total > 0 ? ((converted / total) * 100).toFixed(1) : 0;
                return [
                  item.source_of_enquiry || "-",
                  mapping[item.source_of_enquiry]?.source || "-",
                  total,
                  converted,
                  `${rate}%`,
                ];
              })
            : [],
          showTable: true,
        };

      case "Inventory Valuation Report":
        const inventoryMetrics = calculateInventoryMetrics();
        return {
          title: "Inventory Valuation Report",
          subtitle: "Inventory value summary based on stock and usage",
          summary: [
            {
              label: "Total Stock Value",
              value: formatCurrency(inventoryMetrics.totalStockValue),
            },
            {
              label: "Total Rent Used Value",
              value: formatCurrency(inventoryMetrics.totalRentUsedValue),
            },
            {
              label: "Total Buy Used Value",
              value: formatCurrency(inventoryMetrics.totalBuyUsedValue),
            },
            {
              label: "Total Quantity in Inventory",
              value: `${inventoryMetrics.totalQuantity} units`,
            },
          ],
          headers: [],
          rows: [],
          showTable: false,
        };

      case "Stock Movement Report":
        const stockMovement = calculateStockMovement();
        return {
          title: "Stock Movement Report",
          subtitle: "Summary of inventory inflows and outflows",
          summary: [
            {
              label: "Total Inflow Quantity",
              value: formatNumber(stockMovement.inflowQuantity),
            },
            {
              label: "Total Inflow Value",
              value: formatCurrency(stockMovement.inflowValue),
            },
            {
              label: "Total Rented Out Quantity",
              value: formatNumber(stockMovement.rentedQuantity),
            },
            {
              label: "Total Rented Out Value",
              value: formatCurrency(stockMovement.rentedValue),
            },
            {
              label: "Total Sold Quantity",
              value: formatNumber(stockMovement.soldQuantity),
            },
            {
              label: "Total Sold Value",
              value: formatCurrency(stockMovement.soldValue),
            },
          ],
          headers: ["Movement Type", "Total Quantity", "Total Value (₹)"],
          rows: [
            [
              "Inflow (Purchased)",
              formatNumber(stockMovement.inflowQuantity),
              formatCurrency(stockMovement.inflowValue),
            ],
            [
              "Outflow - Rented",
              formatNumber(stockMovement.rentedQuantity),
              formatCurrency(stockMovement.rentedValue),
            ],
            [
              "Outflow - Sold",
              formatNumber(stockMovement.soldQuantity),
              formatCurrency(stockMovement.soldValue),
            ],
          ],
          showTable: true,
        };

      case "Inventory Availability Report":
        const inventoryAvailability = calculateInventoryAvailability();
        return {
          title: "Inventory Availability Report",
          subtitle: "Current inventory status and availability",
          summary: [
            {
              label: "Total Products Tracked",
              value: `${inventoryAvailability.totalProductsTracked} items`,
            },
            {
              label: "Total Available Quantity",
              value: `${inventoryAvailability.totalAvailableQuantity} units`,
            },
            {
              label: "Total Rented Quantity",
              value: `${inventoryAvailability.totalRentedQuantity} units`,
            },
            {
              label: "Total Sold Quantity",
              value: `${inventoryAvailability.totalSoldQuantity} units`,
            },
            {
              label: "Total Stock Value",
              value: formatCurrency(inventoryAvailability.totalStockValue),
            },
          ],
          headers: ["Metric", "Value"],
          rows: [
            [
              "Total Products Tracked",
              `${inventoryAvailability.totalProductsTracked} items`,
            ],
            [
              "Total Available Quantity",
              `${inventoryAvailability.totalAvailableQuantity} units`,
            ],
            [
              "Total Rented Quantity",
              `${inventoryAvailability.totalRentedQuantity} units`,
            ],
            [
              "Total Sold Quantity",
              `${inventoryAvailability.totalSoldQuantity} units`,
            ],
            [
              "Total Stock Value (₹)",
              formatCurrency(inventoryAvailability.totalStockValue),
            ],
          ],
          showTable: true,
        };

      case "Order Status Report":
        return {
          title: "Order Status Report",
          subtitle: "Summary of orders by status",
          summary: [],
          headers: [
            "Order Status",
            "Total Orders",
            "Total Quantity",
            "Total Amount (₹)",
          ],
          rows: Array.isArray(reportData)
            ? reportData.map((item) => [
                item.status || "-",
                formatNumber(item.totalOrders || 0),
                formatNumber(item.totalQuantity || 0),
                formatCurrency(item.totalAmount || 0),
              ])
            : [],
          showTable: true,
        };

      // --- DUMMY DATA FOR REMAINING REPORTS ---
      case "Supplier Performance Report":
        return {
          title: "Supplier Performance Report",
          subtitle: "supplier performance metrics",
          summary: [
            { label: "Total Suppliers", value: 5 },
            { label: "Avg. Delivery Time (days)", value: 4.2 },
            { label: "On-Time Delivery Rate", value: "92%" },
          ],
          headers: [
            "Supplier Name",
            "Total Orders",
            "On-Time Deliveries",
            "Avg. Delivery Time (days)",
          ],
          rows: [
            ["ABC Pvt Ltd", 20, 18, 3.5],
            ["XYZ Corp", 15, 14, 4.8],
            ["SupplyCo", 10, 9, 5.2],
            ["FastTrack", 8, 8, 2.9],
            ["Reliable Inc", 12, 11, 4.6],
          ],
          showTable: true,
        };

      case "Purchase Order Cycle Time Report":
        return {
          title: "Purchase Order Cycle Time Report",
          subtitle: " PO cycle time analysis",
          summary: [
            { label: "Avg. Cycle Time (days)", value: 6.1 },
            { label: "Fastest Cycle (days)", value: 2 },
            { label: "Slowest Cycle (days)", value: 12 },
          ],
          headers: [
            "PO Number",
            "Supplier",
            "Order Date",
            "Delivery Date",
            "Cycle Time (days)",
          ],
          rows: [
            ["PO-001", "ABC Pvt Ltd", "2024-06-01", "2024-06-05", 4],
            ["PO-002", "XYZ Corp", "2024-06-02", "2024-06-08", 6],
            ["PO-003", "SupplyCo", "2024-06-03", "2024-06-15", 12],
            ["PO-004", "FastTrack", "2024-06-04", "2024-06-06", 2],
          ],
          showTable: true,
        };

      case "Maintenance History Report":
        return {
          title: "Maintenance History Report",
          subtitle: "maintenance records",
          summary: [
            { label: "Total Maintenances", value: 12 },
            { label: "Avg. Downtime (hrs)", value: 3.5 },
          ],
          headers: [
            "Asset",
            "Date",
            "Type",
            "Downtime (hrs)",
            "Remarks",
          ],
          rows: [
            ["Excavator", "2024-06-10", "Preventive", 2, "Oil change"],
            ["Bulldozer", "2024-06-12", "Corrective", 5, "Engine repair"],
            ["Crane", "2024-06-15", "Preventive", 3, "Inspection"],
            ["Loader", "2024-06-18", "Corrective", 4, "Hydraulics"],
          ],
          showTable: true,
        };

      case "Downtime Analysis Report":
        return {
          title: "Downtime Analysis Report",
          subtitle: " downtime breakdown",
          summary: [
            { label: "Total Downtime (hrs)", value: 22 },
            { label: "Avg. Downtime/Incident", value: 4.4 },
          ],
          headers: [
            "Reason",
            "Incidents",
            "Total Downtime (hrs)",
          ],
          rows: [
            ["Mechanical Failure", 3, 10],
            ["Scheduled Maintenance", 2, 6],
            ["Operator Error", 1, 2],
            ["Other", 1, 4],
          ],
          showTable: true,
        };

      case "Cost of Maintenance Report":
        return {
          title: "Cost of Maintenance Report",
          subtitle: " maintenance cost summary",
          summary: [
            { label: "Total Maintenance Cost", value: "₹1,20,000" },
            { label: "Avg. Cost/Incident", value: "₹24,000" },
          ],
          headers: [
            "Asset",
            "Date",
            "Type",
            "Cost (₹)",
          ],
          rows: [
            ["Excavator", "2024-06-10", "Preventive", "₹10,000"],
            ["Bulldozer", "2024-06-12", "Corrective", "₹40,000"],
            ["Crane", "2024-06-15", "Preventive", "₹15,000"],
            ["Loader", "2024-06-18", "Corrective", "₹55,000"],
          ],
          showTable: true,
        };

      default:
        return {
          title: selectedReport,
          subtitle: "Report structure placeholder",
          summary: [{ label: "Coming Soon", value: "-" }],
          headers: ["Column 1", "Column 2", "Column 3"],
          rows: [["-", "-", "-"]],
          showTable: true,
        };
    }
  };

  const currentData = getCurrentReportData();

  // --- Chart.js dashboards for each report ---
  let chartComponent = null;

  // Sales Performance Report: Bar Chart
  if (
    selectedReport === "Sales Performance Report" &&
    Array.isArray(reportData)
  ) {
    const leads = reportData;
    const labels = leads.map((l) => l.lead_title || l.lead_id || "-");
    const quotations = leads.map((l) => l.quotations?.length || 0);
    const orders = leads.map((l) =>
      (l.quotations || []).reduce((sum, q) => sum + (q.orders?.length || 0), 0)
    );
    chartComponent = (
      <div style={{ maxWidth: 700, margin: "2rem auto" }}>
        <Bar
          data={{
            labels,
            datasets: [
              {
                label: "Quotations",
                data: quotations,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
              },
              {
                label: "Orders",
                data: orders,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
          }}
        />
      </div>
    );
  }

  // Lead Source Analysis Report: Pie Chart
  if (
    selectedReport === "Lead Source Analysis Report" &&
    Array.isArray(reportData)
  ) {
    const labels = reportData.map((item) => item.source_of_enquiry || "-");
    const data = reportData.map((item) => item.lead_count || 0);
    chartComponent = (
      <div style={{ maxWidth: 500, margin: "2rem auto" }}>
        <Pie
          data={{
            labels,
            datasets: [
              {
                label: "Leads",
                data,
                backgroundColor: [
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                ],
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
          }}
        />
      </div>
    );
  }

  // Inventory Valuation Report: Bar Chart
  if (selectedReport === "Inventory Valuation Report" && reportData) {
    const inventory = calculateInventoryMetrics();
    chartComponent = (
      <div style={{ maxWidth: 700, margin: "2rem auto" }}>
        <Bar
          data={{
            labels: [
              "Total Stock Value",
              "Total Rent Used Value",
              "Total Buy Used Value",
              "Total Quantity",
            ],
            datasets: [
              {
                label: "Value (₹) / Quantity",
                data: [
                  inventory.totalStockValue,
                  inventory.totalRentUsedValue,
                  inventory.totalBuyUsedValue,
                  inventory.totalQuantity,
                ],
                backgroundColor: [
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                ],
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function (value, index, values) {
                    if (index < 3) {
                      return "₹" + value.toLocaleString("en-IN");
                    }
                    return value;
                  },
                },
              },
            },
          }}
        />
      </div>
    );
  }

  // Stock Movement Report: Doughnut Chart
  if (selectedReport === "Stock Movement Report" && reportData) {
    const movement = calculateStockMovement();
    chartComponent = (
      <div style={{ maxWidth: 500, margin: "2rem auto" }}>
        <Doughnut
          data={{
            labels: ["Rented Out", "Sold"],
            datasets: [
              {
                label: "Quantity",
                data: [movement.rentedQuantity, movement.soldQuantity],
                backgroundColor: [
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                ],
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
          }}
        />
      </div>
    );
  }

  // Order Status Report: Bar Chart
  if (selectedReport === "Order Status Report" && Array.isArray(reportData)) {
    const labels = reportData.map((item) => item.status || "-");
    const orders = reportData.map((item) => item.totalOrders || 0);
    chartComponent = (
      <div style={{ maxWidth: 700, margin: "2rem auto" }}>
        <Bar
          data={{
            labels,
            datasets: [
              {
                label: "Total Orders",
                data: orders,
                backgroundColor: "rgba(153, 102, 255, 0.6)",
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
          }}
        />
      </div>
    );
  }

  // Inventory Availability Report: Bar Chart
  if (selectedReport === "Inventory Availability Report" && reportData) {
    const availability = calculateInventoryAvailability();
    chartComponent = (
      <div style={{ maxWidth: 700, margin: "2rem auto" }}>
        <Bar
          data={{
            labels: ["Available", "Rented", "Sold"],
            datasets: [
              {
                label: "Quantity",
                data: [
                  availability.totalAvailableQuantity,
                  availability.totalRentedQuantity,
                  availability.totalSoldQuantity,
                ],
                backgroundColor: [
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                ],
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
          }}
        />
      </div>
    );
  }

  // Supplier Performance Report: Bar Chart
  if (
    selectedReport === "Supplier Performance Report" &&
    currentData &&
    currentData.rows.length
  ) {
    const labels = currentData.rows.map((row) => row[0]);
    const onTime = currentData.rows.map((row) => row[2]);
    chartComponent = (
      <div style={{ maxWidth: 700, margin: "2rem auto" }}>
        <Bar
          data={{
            labels,
            datasets: [
              {
                label: "On-Time Deliveries",
                data: onTime,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
          }}
        />
      </div>
    );
  }

  // Purchase Order Cycle Time Report: Bar Chart
  if (
    selectedReport === "Purchase Order Cycle Time Report" &&
    currentData &&
    currentData.rows.length
  ) {
    const labels = currentData.rows.map((row) => row[0]);
    const cycleTimes = currentData.rows.map((row) => row[4]);
    chartComponent = (
      <div style={{ maxWidth: 700, margin: "2rem auto" }}>
        <Bar
          data={{
            labels,
            datasets: [
              {
                label: "Cycle Time (days)",
                data: cycleTimes,
                backgroundColor: "rgba(255, 206, 86, 0.6)",
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
          }}
        />
      </div>
    );
  }

  // Maintenance History Report: Pie Chart (Type distribution)
  if (
    selectedReport === "Maintenance History Report" &&
    currentData &&
    currentData.rows.length
  ) {
    const typeCounts = currentData.rows.reduce(
      (acc, row) => {
        acc[row[2]] = (acc[row[2]] || 0) + 1;
        return acc;
      },
      {}
    );
    const labels = Object.keys(typeCounts);
    const data = Object.values(typeCounts);
    chartComponent = (
      <div style={{ maxWidth: 500, margin: "2rem auto" }}>
        <Pie
          data={{
            labels,
            datasets: [
              {
                label: "Maintenance Type",
                data,
                backgroundColor: [
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                ],
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
          }}
        />
      </div>
    );
  }

  // Downtime Analysis Report: Doughnut Chart
  if (
    selectedReport === "Downtime Analysis Report" &&
    currentData &&
    currentData.rows.length
  ) {
    const labels = currentData.rows.map((row) => row[0]);
    const data = currentData.rows.map((row) => row[2]);
    chartComponent = (
      <div style={{ maxWidth: 500, margin: "2rem auto" }}>
        <Doughnut
          data={{
            labels,
            datasets: [
              {
                label: "Downtime (hrs)",
                data,
                backgroundColor: [
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                ],
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
          }}
        />
      </div>
    );
  }

  // Cost of Maintenance Report: Bar Chart
  if (
    selectedReport === "Cost of Maintenance Report" &&
    currentData &&
    currentData.rows.length
  ) {
    const labels = currentData.rows.map((row) => row[0]);
    const costs = currentData.rows.map((row) =>
      Number(row[3].replace(/[^\d]/g, ""))
    );
    chartComponent = (
      <div style={{ maxWidth: 700, margin: "2rem auto" }}>
        <Bar
          data={{
            labels,
            datasets: [
              {
                label: "Cost (₹)",
                data: costs,
                backgroundColor: "rgba(255, 99, 132, 0.6)",
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "2rem" }}>
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "2rem",
            color: "white",
          }}
        >
          <h1
            style={{ margin: "0 0 1rem", fontSize: "2rem", fontWeight: "700" }}
          >
            Business Intelligence Dashboard
          </h1>
          <p style={{ margin: 0, fontSize: "1.1rem", opacity: 0.9 }}>
            Comprehensive business analytics and performance insights
          </p>
        </div>

        <div style={{ padding: "2rem", borderBottom: "1px solid #e5e7eb" }}>
          <label
            htmlFor="report-dropdown"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#374151",
              textTransform: "uppercase",
            }}
          >
            Select Report Type
          </label>
          <select
            id="report-dropdown"
            value={selectedReport}
            onChange={handleChange}
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "0.75rem 1rem",
              fontSize: "1rem",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              backgroundColor: "white",
              color: "#374151",
              cursor: "pointer",
            }}
          >
            {reportOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ padding: "2rem" }}>
          {!selectedReport ? (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                color: "#6b7280",
              }}
            >
              <div
                style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.5 }}
              >
                📊
              </div>
              <h3
                style={{
                  margin: "0 0 0.5rem",
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                Select a Report
              </h3>
              <p style={{ margin: 0, fontSize: "1rem" }}>
                Choose a report type from the dropdown above to view detailed
                analytics
              </p>
            </div>
          ) : loading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p>Loading report data...</p>
            </div>
          ) : error ? (
            <div
              style={{ textAlign: "center", padding: "2rem", color: "#ef4444" }}
            >
              <h3
                style={{
                  margin: "0 0 0.5rem",
                  fontSize: "1.25rem",
                  fontWeight: "600",
                }}
              >
                Error Loading Report
              </h3>
              <p style={{ margin: 0, fontSize: "1rem" }}>{error}</p>
            </div>
          ) : (
            currentData && (
              <>
                <div style={{ marginBottom: "2rem" }}>
                  <h2
                    style={{
                      margin: "0 0 0.5rem",
                      fontSize: "1.875rem",
                      fontWeight: "700",
                      color: "#1f2937",
                    }}
                  >
                    {currentData.title}
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "1.125rem",
                      color: "#6b7280",
                    }}
                  >
                    {currentData.subtitle}
                  </p>
                </div>

                {currentData.summary.length > 0 && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: "1rem",
                      marginBottom: "2rem",
                      backgroundColor: "#f8fafc",
                      padding: "1.5rem",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    {currentData.summary.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          padding: "1rem",
                          borderRadius: "8px",
                          backgroundColor: "white",
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: "#64748b",
                            fontWeight: "500",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {item.label}
                        </div>
                        <div
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: "600",
                            color: "#1e293b",
                          }}
                        >
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Chart.js dashboard */}
                {chartComponent}

                {currentData.showTable && (
                  <div
                    style={{
                      backgroundColor: "white",
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ overflowX: "auto" }}>
                      <table
                        style={{ width: "100%", borderCollapse: "collapse" }}
                      >
                        <thead>
                          <tr style={{ backgroundColor: "#f9fafb" }}>
                            {currentData.headers.map((header, index) => (
                              <th
                                key={index}
                                style={{
                                  padding: "1rem",
                                  textAlign: "left",
                                  fontSize: "0.875rem",
                                  fontWeight: "600",
                                  color: "#374151",
                                  textTransform: "uppercase",
                                  borderBottom: "1px solid #e5e7eb",
                                }}
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {currentData.rows.length > 0 ? (
                            currentData.rows.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                  <td
                                    key={cellIndex}
                                    style={{
                                      padding: "1rem",
                                      fontSize: "0.95rem",
                                      color: "#374151",
                                      borderBottom: "1px solid #f3f4f6",
                                    }}
                                  >
                                    {cell || "-"}
                                  </td>
                                ))}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={currentData.headers.length}
                                style={{
                                  padding: "2rem",
                                  textAlign: "center",
                                  color: "#6b7280",
                                }}
                              >
                                No data available for this report
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AllReportsDataLayout;