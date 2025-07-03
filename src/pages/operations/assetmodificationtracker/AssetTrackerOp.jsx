import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL, { IMAGE_API_URL } from "../../../api/Api_url";

const AssetModificationTrackerTable = () => {
  const [data, setData] = useState([]);

  const columns = [
    { id: "s_id", label: "S.No." },

    { id: "asset_id", label: "Asset ID" },
    { id: "product_name", label: "Product Name" },
    { id: "ram", label: "Old RAM" },
    { id: "new_ram", label: "New RAM" },
    { id: "storage", label: "Old Storage" },
    { id: "new_storage", label: "New Storage" },
    { id: "modification_type", label: "Modification Type" },
    { id: "new_ram_cost", label: "RAM Cost" },
    { id: "new_storage", label: "Storage Cost" },
    { id: "request_date", label: "Requested Date" },
    { id: "approval_date", label: "Approved Date" },
    { id: "invoice_number", label: "Invoice No." },
    { id: "invoice_date", label: "Invoice Date" },
    { id: "customer_name", label: "Customer Name" },
    { id: "approved_by", label: "Approved By" },
    { id: "remarks", label: "Remarks" },
  ];

  useEffect(() => {
    const fetchModifications = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/asset-modifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const formatted = response.data.data.map((item, index) => ({
            s_id: index + 1,
            ...item,
            invoice_date: formatDate(item.invoice_date),
            request_date: formatDate(item.request_date),
            approval_date: formatDate(item.approval_date),
            estimated_cost: formatINR(item.estimated_cost),
          }));
          setData(formatted);
        }
      } catch (error) {
        console.error("Error fetching asset modifications:", error);
      }
    };

    fetchModifications();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN");
  };

  const formatINR = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(parseFloat(value || 0));
  };

  return (
    <div>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default AssetModificationTrackerTable;
