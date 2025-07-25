import React, { useEffect, useState } from "react";
import DynamicTable from "../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../api/Api_url";

// Badge formatter for delivery status
const getStatusBadge = (status) => {
  switch (status) {
    case "Delivered":
      return <span style={{ color: "green", fontWeight: "bold" }}>Delivered</span>;
    case "Dispatched":
      return <span style={{ color: "orange", fontWeight: "bold" }}>Dispatched</span>;
    default:
      return <span style={{ color: "orange", fontWeight: "bold" }}>Pending</span>;
  }
};

const DeliveryChallanTable = () => {
  const [data, setData] = useState([]);

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "dc_id", label: "Challan ID" },
    { id: "dispatch_order_number", label: "Order Number" },
    // { id: "customer_code", label: "Customer Code" },
    { id: "dc_date", label: "Delivery Date" },
        { id: "payment_type", label: "Pyament Type" },

    { id: "shipping_name", label: "Customer Name" },
    { id: "city", label: "City" },
    { id: "vehicle_number", label: "Vehicle No." },
    { id: "delivery_person_name", label: "Delivery Person" },
        { id: "delivery_person_phone_number", label: "Delivery Person No." },

    // { id: "receiver_name", label: "Receiver" },
        { id: "dc_status", label: "Status" },

  ];

  useEffect(() => {
    const fetchDeliveryChallans = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/delivery-challans`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const formatted = response.data.map((item, index) => ({
            s_id: index + 1,
            ...item,
            dc_status: getStatusBadge(item.dc_status), // format status here
          }));
          setData(formatted);
        }
      } catch (error) {
        console.error("Error fetching delivery challans:", error);
      }
    };

    fetchDeliveryChallans();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: "10px" }}>Delivery Challans</h2>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default DeliveryChallanTable;
