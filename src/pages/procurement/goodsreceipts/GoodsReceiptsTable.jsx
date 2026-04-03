import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const GoodsReceiptsTable = () => {

  const { token } = useSelector((state) => state.auth);

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  //-------------------------------------

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "goods_receipt_id", label: "Goods Receipt ID" },
    { id: "purchase_order_id", label: "Purchase Order ID" },
    { id: "supplier_name", label: "Supplier Name" },
    { id: "goods_receipt_date", label: "Receipt Date" },
    { id: "purchase_type", label: "Purchase Type" },
    { id: "goods_receipt_status", label: "Status" },
  ];

  //-------------------------------------

  const fetchGoodsReceipts = async () => {
    try {

      const response = await axios.get(
        `${API_URL}/goods-receipts?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //-------------------------------------

      const formatted = response.data.data.map((item, index) => {

        const productsSummary = item.selected_products
          ?.map(prod =>
            `${prod.product_name} (Qty: ${prod.quantity}, ₹${prod.total_price})`
          )
          .join("; ");

        return {
          ...item,

          s_id: (page - 1) * 10 + index + 1,
          purchase_order_id: item?.purchase_order_id || "N/A",
          supplier_name: item.supplier?.supplier_name || "N/A",
          purchase_type: item?.purchase_type || "N/A",
        };
      });

      setData(formatted);
      setTotalPages(response.data.totalPages);

    } catch (error) {
      console.error("Error fetching goods receipts:", error);
    }
  };

  //-------------------------------------

  useEffect(() => {
    fetchGoodsReceipts();
  }, [page, search]);

  //-------------------------------------

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
        refreshData={fetchGoodsReceipts}
      />
    </div>
  );
};

export default GoodsReceiptsTable;
