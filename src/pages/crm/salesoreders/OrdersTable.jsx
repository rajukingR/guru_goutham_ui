import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const OrdersTable = () => {

  const [data, setData] = useState([]);

  //------------------------------------------------
  // PAGINATION
  //------------------------------------------------

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const { token } = useSelector((state) => state.auth);

  //------------------------------------------------
  // FETCH
  //------------------------------------------------

  useEffect(() => {
    fetchOrders();
  }, [page, search]);

  const fetchOrders = async () => {
    try {

      const res = await axios.get(
        `${API_URL}/orders?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { orders, pagination } = res.data;

      setTotalPages(pagination.totalPages);

      //------------------------------------------------
      // FORMAT
      //------------------------------------------------

      const formatted = orders.map((item, index) => {

        const customerName =
          `${item.personalDetails?.first_name || ""} ${item.personalDetails?.last_name || ""}`;

        return {
          ...item,

          s_id: (page - 1) * 10 + index + 1,

          order_id: item.order_id || "-",

          customer_name: customerName,

          transaction_type:
            item.transaction_type === "Buy"
              ? "Sale"
              : item.transaction_type || "-",

          payment_type:
            item.payment_type || "Sale",

          order_date:
            item.created_at
              ? new Date(item.created_at).toLocaleDateString("en-IN")
              : "-",

          rental_start_date:
            item.rental_start_date
              ? new Date(item.rental_start_date).toLocaleDateString("en-IN")
              : "-",

          rental_end_date:
            item.rental_end_date
              ? new Date(item.rental_end_date).toLocaleDateString("en-IN")
              : "-",

          rental_duration: item.rental_duration || "-",

          owner: item.owner || "-",

          order_status: item.order_status || "-",
        };
      });

      setData(formatted);

    } catch (error) {
      console.error("Orders fetch error:", error);
    }
  };

  //------------------------------------------------
  // RESET PAGE WHEN SEARCH
  //------------------------------------------------

  useEffect(() => {
    setPage(1);
  }, [search]);

  //------------------------------------------------

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "order_id", label: "Order ID" },
    { id: "customer_name", label: "Customer Name" },
    { id: "transaction_type", label: "Purchase Type" },
    { id: "payment_type", label: "Payment Type" },
    { id: "order_date", label: "Order Date" },
    { id: "rental_start_date", label: "Rental Start" },
    { id: "rental_end_date", label: "Rental End" },
    { id: "rental_duration", label: "Duration (months)" },
    { id: "owner", label: "Owner" },
    { id: "order_status", label: "Order Status" },
  ];

  //------------------------------------------------

  return (
    <div>

      <h2 style={{ marginBottom: "10px" }}>
        Orders List
      </h2>

      <DynamicTable
        columns={columns}
        data={data}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        search={search}
        setSearch={setSearch}
        refreshData={fetchOrders}
      />

    </div>
  );
};

export default OrdersTable;
