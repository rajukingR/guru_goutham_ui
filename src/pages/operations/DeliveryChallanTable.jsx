import React, { useEffect, useState } from "react";
import DynamicTable from "../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../api/Api_url";

const DeliveryChallanTable = () => {
  const [data, setData] = useState([]);

  const columns = [
    { id: "id", label: "S.No." },
    { id: "dc_id", label: "Challan ID" },
    { id: "dc_title", label: "Title" },
    { id: "order_number", label: "Order Number" },
    { id: "customer_code", label: "Customer Code" },
    { id: "dc_date", label: "Date" },
    { id: "dc_status", label: "Status" },
    { id: "shipping_name", label: "Shipped To" },
    { id: "city", label: "City" },
    { id: "vehicle_number", label: "Vehicle No." },
    { id: "delivery_person_name", label: "Delivery Person" },
    { id: "receiver_name", label: "Receiver" },
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
            id: index + 1,
            ...item,
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
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default DeliveryChallanTable;
