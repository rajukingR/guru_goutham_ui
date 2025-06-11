import React, { useState, useEffect } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const PurchaseRequestTable = () => {
  const [data, setData] = useState([]);
  const { user, token } = useSelector((state) => state.auth);

  // Change column from supplier_id to supplier_name
  const columns = [
    { id: "id", label: "S.No." },
    { id: "purchase_request_id", label: "Request ID" },
    { id: "purchase_request_date", label: "Date" },
    { id: "purchase_type", label: "Purchase Type" },
    { id: "owner", label: "Owner" },
    { id: "supplier_name", label: "Supplier Name" },
    { id: "description", label: "Description" },
    { id: "purchase_request_status", label: "Status" },
  ];

  useEffect(() => {
    const fetchPurchaseRequests = async () => {
      try {

        const response = await axios.get(`${API_URL}/purchase-requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const dataWithSno = response.data.map((item, index) => ({
            id: index + 1,
            ...item,
            supplier_name: item.supplier?.supplier_name || "N/A",
          }));
          setData(dataWithSno);
        }
      } catch (error) {
        console.error("Error fetching purchase requests:", error);
      }
    };

    fetchPurchaseRequests();
  }, []);

  return (
    <div>
      <DynamicTable columns={columns} data={data}/>
    </div>
  );
};

export default PurchaseRequestTable;
