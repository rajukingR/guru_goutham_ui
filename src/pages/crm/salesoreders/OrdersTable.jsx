import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";

const OrdersTable = () => {
  const [data, setData] = useState([]);

  const columns = [
    { id: "id", label: "S.No." },
    { id: "order_id", label: "Order ID" },
    { id: "transaction_type", label: "Purchase Type" },
    { id: "quotation_id", label: "Quotation ID" },
    { id: "order_date", label: "Order Date" },
    { id: "rental_start_date", label: "Rental Start" },
    { id: "rental_end_date", label: "Rental End" },
    { id: "rental_duration", label: "Duration (months)" },
    { id: "owner", label: "Owner" },
    { id: "total_quantity", label: "Total Quantity" },
    { id: "total_order_value", label: "Total Amount (₹)" }, // ✅ new column
    { id: "order_status", label: "Order Status" },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const dataWithSno = response.data.map((item, index) => {
            // Format total_order_value in Indian currency
            const formattedOrderValue = new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 2,
            }).format(item.total_order_value || 0);

            return {
              id: index + 1,
              ...item,
              total_order_value: formattedOrderValue, // replace value with formatted ₹ value
            };
          });

          setData(dataWithSno);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default OrdersTable;
