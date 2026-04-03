import React, { useState, useEffect } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const PurchaseOrderTable = () => {

  const { token } = useSelector((state) => state.auth);

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  //---------------------------------------

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "purchase_order_id", label: "Order ID" },
    { id: "purchase_quotation_id", label: "Quotation ID" },
    { id: "purchase_order_date", label: "Date" },
    { id: "purchase_type", label: "Purchase Type" },
    { id: "supplier_name", label: "Supplier Name" },
    { id: "po_status", label: "Status" },
  ];

  //---------------------------------------

  const fetchPurchaseOrders = async () => {
    try {

      const response = await axios.get(
        `${API_URL}/purchase-orders?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //---------------------------------------

      const formatted = response.data.data.map((item, index) => ({
        ...item,

        s_id: (page - 1) * 10 + index + 1,

        supplier_name: item.supplier?.supplier_name || "N/A",
      }));

      setData(formatted);
      setTotalPages(response.data.totalPages);

    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    }
  };

  //---------------------------------------

  useEffect(() => {
    fetchPurchaseOrders();
  }, [page, search]);

  //---------------------------------------

  return (
    <div>
      <DynamicTable
        columns={columns}
        data={data}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        search={search}
        setSearch={setSearch}
        refreshData={fetchPurchaseOrders}
      />
    </div>
  );
};

export default PurchaseOrderTable;
