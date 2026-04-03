import React, { useEffect, useState } from "react";
import DynamicTable from "../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../api/Api_url";
import { useSelector } from "react-redux";

const getStatusBadge = (status) => {
  switch (status) {
    case "Delivered":
      return <span style={{ color: "green", fontWeight: "bold" }}>Delivered</span>;
    case "Rejected":
      return <span style={{ color: "red", fontWeight: "bold" }}>Rejected</span>;
    default:
      return <span style={{ color: "orange", fontWeight: "bold" }}>Pending</span>;
  }
};

const DeliveryChallanTable = () => {

  const { token } = useSelector((state) => state.auth);
  const userToken = token;

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  //---------------------------------------------
  // FETCH
  //---------------------------------------------

  useEffect(() => {
    fetchDeliveryChallans();
  }, [page, search]);

  const fetchDeliveryChallans = async () => {
    try {

      const response = await axios.get(
        `${API_URL}/delivery-challans?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const { deliveryChallans, pagination } = response.data;

      setTotalPages(pagination.totalPages);

      const formatted = deliveryChallans.map((item, index) => ({

        s_id: (page - 1) * 10 + index + 1,

        ...item,

        payment_type: item.payment_type === "" ? "Buy" : item.payment_type,

        dc_status: getStatusBadge(item.dc_status),
        dc_status_raw: item.dc_status,

      }));

      setData(formatted);

    } catch (error) {
      console.error("Error fetching delivery challans:", error);
    }
  };

  //---------------------------------------------
  // RESET PAGE ON SEARCH
  //---------------------------------------------

  useEffect(() => {
    setPage(1);
  }, [search]);

  //---------------------------------------------

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "shipping_name", label: "Customer Name" },
    { id: "dc_id", label: "Challan ID" },
    { id: "dispatch_order_number", label: "Order Number" },
    { id: "dc_date", label: "Delivery Date" },
    { id: "payment_type", label: "Payment Type" },
    { id: "city", label: "City" },
    { id: "vehicle_number", label: "Vehicle No." },
    { id: "delivery_person_name", label: "Delivery Person" },
    { id: "delivery_person_phone_number", label: "Delivery Person No." },
    { id: "dc_status", label: "Status" },
  ];

  //---------------------------------------------

  return (
    <div>
      <h2 style={{ marginBottom: "10px" }}>Delivery Challans</h2>

      <DynamicTable
        columns={columns}
        data={data}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        search={search}
        setSearch={setSearch}
        refreshData={fetchDeliveryChallans}
      />
    </div>
  );
};

export default DeliveryChallanTable;
