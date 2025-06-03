import React, { useState, useEffect } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";

const PurchaseOrderTable = () => {
  const [data, setData] = useState([]);

  const columns = [
    { id: "id", label: "S.No." },
    { id: "purchase_order_id", label: "Order ID" },
    { id: "purchase_quotation_id", label: "Quotation ID" },
    { id: "purchase_order_date", label: "Date" },
    { id: "purchase_type", label: "Purchase Type" },
    { id: "owner", label: "Owner" },
    { id: "supplier_name", label: "Supplier Name" }, // showing name not ID
    { id: "description", label: "Description" },
    { id: "po_status", label: "Status" },
  ];

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/purchase-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const ordersWithSno = response.data.map((item, index) => ({
            id: index + 1,
            ...item,
            supplier_name: item.supplier?.supplier_name || "N/A",
          }));
          setData(ordersWithSno);
        }
      } catch (error) {
        console.error("Error fetching purchase orders:", error);
      }
    };

    fetchPurchaseOrders();
  }, []);

  return (
    <div>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default PurchaseOrderTable;
