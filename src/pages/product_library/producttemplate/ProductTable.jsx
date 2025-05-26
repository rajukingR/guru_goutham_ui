import React from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";

const ProductTable = () => {
  // Define columns for the table
  const columns = [
    { id: "id", label: "ID" },
    { id: "image", label: "Product Image" },
    { id: "name", label: "Product Name" },
    { id: "category", label: "Category" },
    { id: "price", label: "Price" },
    { id: "status", label: "Status" },
  ];

  // Define dummy data
  const data = [
    { id: 1, name: "Cement Bag", category: "Construction", price: "₹350", status: "Active" },
    { id: 2, name: "Bricks", category: "Masonry", price: "₹5 per piece", status: "Inactive" },
    { id: 3, name: "Paint Bucket", category: "Finishing", price: "₹1200", status: "Active" },
    { id: 4, name: "Steel Rod", category: "Reinforcement", price: "₹80 per kg", status: "Inactive" },
    { id: 5, name: "Sand", category: "Raw Material", price: "₹600 per ton", status: "Active" },
  ];

  return (
    <div>
      <DynamicTable columns={columns} data={data} rowsPerPage={5} />
    </div>
  );
};

export default ProductTable;
