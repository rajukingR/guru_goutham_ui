import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const DispatchOrdersTable = () => {
  const [data, setData] = useState([]);

    const { user, token } = useSelector((state) => state.auth);
  
    const userToken = token;
  const columns = [
    { id: "s_no", label: "S.No." },
    { id: "dispatch_order_id", label: "Dispatch ID" },
    { id: "dispatch_order_date", label: "Dispatch Date" },
    { id: "shipping_name", label: "Shipping Name" },
    { id: "shipping_phone_number", label: "Phone" },
    { id: "order_number", label: "Order No." },
    { id: "type", label: "Transaction Type" },
    { id: "payment_type", label: "Payment Type" },

    { id: "city", label: "City" },
    { id: "state", label: "State" },
  ];

  useEffect(() => {
    const fetchDispatchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/dispatch-orders`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });

        if (response.status === 200) {
          const formattedData = response.data.map((item, index) => ({
            s_no: index + 1,
            ...item,
            dispatch_order_date:
              item.order_sale_date === null
                ? item.dispatch_order_date
                : item.order_sale_date,
            type: item.type === "Buy" ? "Sale" : item.type,
            payment_type: item.payment_type === "" ? "Sale" : item.payment_type,

            status:
              item.dispatch_order_status === "Approved" ? "Active" : "Inactive",
          }));
          setData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching dispatch orders:", error);
      }
    };

    fetchDispatchOrders();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: "10px" }}>Order Preparations List</h2>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default DispatchOrdersTable;
