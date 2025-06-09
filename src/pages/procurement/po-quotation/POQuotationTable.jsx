import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const POQuotationTable = () => {
  const [data, setData] = useState([]);
  const { user, token } = useSelector((state) => state.auth);

  const columns = [
    { id: "id", label: "S.No." },
    { id: "purchase_quotation_id", label: "Quotation ID" },
    { id: "purchase_request_id", label: "Purchase Request ID" },
    { id: "purchase_quotation_date", label: "Quotation Date" },
    { id: "owner", label: "Owner" },
    { id: "supplier_name", label: "Supplier Name" },
    { id: "description", label: "Description" },
    { id: "po_quotation_status", label: "Status" },
  ];

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const response = await axios.get(`${API_URL}/purchase-quotation`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const formattedData = response.data.map((item, index) => ({
            id: index + 1,
            ...item,
            supplier_name: item.supplier?.supplier_name || "N/A",
          }));
          setData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching purchase quotations:", error);
      }
    };

    fetchQuotations();
  }, []);

  return (
    <div>
      <DynamicTable columns={columns} data={data} rowsPerPage={10} />
    </div>
  );
};

export default POQuotationTable;
