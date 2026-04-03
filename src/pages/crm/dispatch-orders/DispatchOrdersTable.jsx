import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const DispatchOrdersTable = () => {

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const { token } = useSelector((state) => state.auth);
  const userToken = token;

  //-----------------------------------

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

  //-----------------------------------
  // FETCH DISPATCH ORDERS
  //-----------------------------------

  const fetchDispatchOrders = async () => {
    try {

      const response = await axios.get(
        `${API_URL}/dispatch-orders?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const formatted = response.data.data.map((item, index) => ({
        ...item,

        s_no: (page - 1) * 10 + index + 1,

        dispatch_order_date:
          item.order_sale_date ?? item.dispatch_order_date,

        type: item.type === "Buy" ? "Sale" : item.type,
        payment_type: item.payment_type || "Sale",

        status:
          item.dispatch_order_status === "Approved"
            ? "Active"
            : "Inactive",
      }));

      setData(formatted);
      setTotalPages(response.data.totalPages);

    } catch (error) {
      console.error("Error fetching dispatch orders:", error);
    }
  };

  //-----------------------------------

  useEffect(() => {
    fetchDispatchOrders();
  }, [page, search]);

  //-----------------------------------

  return (
    <div>
      <h2 style={{ marginBottom: "10px" }}>
        Order Preparations List
      </h2>

      <DynamicTable
        columns={columns}
        data={data}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        search={search}
        setSearch={setSearch}
        refreshData={fetchDispatchOrders}
      />

    </div>
  );
};

export default DispatchOrdersTable;
