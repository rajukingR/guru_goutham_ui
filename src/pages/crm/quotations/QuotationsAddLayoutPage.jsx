import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Checkbox,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Add, Remove, Edit } from "@mui/icons-material";
import API_URL, { IMAGE_API_URL, POSTAL_API} from "../../../api/Api_url";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const generateQuotationId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `QT-${randomPart}`;
};

const QuotationsAddLayoutPage = () => {
  const navigate = useNavigate();

  const { user, token } = useSelector((state) => state.auth);

  const userToken = token;
const [postOffices, setPostOffices] = useState([]);

  const [leads, setLeads] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState({
    leads: true,
    products: true,
  });
  const [error, setError] = useState({
    leads: null,
    products: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [showProductTable, setShowProductTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [productOfferPrices, setProductOfferPrices] = useState({});
  const [productRentOfferPrices, setProductRentOfferPrices] = useState({});

  const [assetIds, setAssetIds] = useState({});
  const [assetIdErrors, setAssetIdErrors] = useState({});

  const [priceForm, setPriceForm] = useState({
    purchase_price: "",
    rent_price_per_month: "",
    offer_purchase_price: "",
    offer_rent_price_per_month: "",
  });

  const [errors, setErrors] = useState({
    selectedLead: "",
  });

  const [formData, setFormData] = useState({
    quotationId: "",
    quotationTitle: "",
    leadId: "",
    transactionType: "",
    payment_type: "",
    quotationStatus: "Pending",
    sourceOfEnquiry: "",
    owner: "",
    remarks: "",
    quotationGeneratedBy: "",
    activeStatus: true,
    customer_id: "",
    customer_first_name: "",
    customer_last_name: "",
    email: "",
    phoneNumber: "",
    rentalDurationMonths: "",
    rentalDurationDays: "",
    rentalStartDate: "",
    rentalEndDate: "",
    quotationDate: new Date().toISOString().split("T")[0],
    is_direct_invoice: false,
    industry: "",
    street: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
    country: "India",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      quotationId: generateQuotationId(),
    }));
  }, []);

  // Fetch active leads
  useEffect(() => {
    const fetchActiveLeads = async () => {
      try {
        const response = await fetch(`${API_URL}/leads/active-leads`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch active leads");
        }
        const data = await response.json();
        setLeads(data);
        setLoading((prev) => ({ ...prev, leads: false }));
      } catch (err) {
        setError((prev) => ({ ...prev, leads: err.message }));
        setLoading((prev) => ({ ...prev, leads: false }));
        setSnackbar({
          open: true,
          message: "Failed to load active leads",
          severity: "error",
        });
      }
    };

    fetchActiveLeads();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/product-templete`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
        setLoading((prev) => ({ ...prev, products: false }));
      } catch (err) {
        setError((prev) => ({ ...prev, products: err.message }));
        setLoading((prev) => ({ ...prev, products: false }));
        setSnackbar({
          open: true,
          message: "Failed to load products",
          severity: "error",
        });
      }
    };

    fetchProducts();
  }, []);

  // Handle lead selection change
  const handleLeadChange = (leadId) => {
    setSelectedLeadId(leadId);
    const selectedLead = leads.find((lead) => lead.id === parseInt(leadId));

    if (selectedLead) {
      setFormData((prev) => ({
        ...prev,
        leadId: selectedLead.lead_id,
        leadTitle: selectedLead.lead_title,
        transactionType: selectedLead.transaction_type,
        payment_type: selectedLead.payment_type,
        sourceOfEnquiry: selectedLead.source_of_enquiry,
        owner: selectedLead.owner,
        remarks: selectedLead.remarks,
        quotationGeneratedBy: selectedLead.lead_generated_by,
        activeStatus: selectedLead.is_active,
        customer_id: selectedLead.contact?.id || "",
        customer_first_name: selectedLead.contact?.first_name || "",
        customer_last_name: selectedLead.contact?.last_name || "",
        email: selectedLead.contact?.email || "",
        phoneNumber: selectedLead.contact?.phone_number || "",
        rentalDurationMonths: selectedLead.rental_duration_months || "",
        rentalDurationDays: selectedLead.rental_duration_days || "",
        rentalStartDate: selectedLead.rental_start_date || "",
        rentalEndDate: selectedLead.rental_end_date || "",
        industry: selectedLead.contact?.industry || "",
        street: selectedLead.contact?.address?.street || "",
        pincode: selectedLead.contact?.address?.pincode || "",
        city: selectedLead.contact?.address?.city || "",
        state: selectedLead.contact?.address?.state || "",
        country: selectedLead.contact?.address?.country || "India",
      }));

      // Auto-select products from the lead - UPDATED CODE
      if (selectedLead.lead_products && selectedLead.lead_products.length > 0) {
        const productIds = selectedLead.lead_products.map(
          (product) => product.product_id
        );
        setSelectedProductIds(productIds);

        const productQuantities = {};
        selectedLead.lead_products.forEach((product) => {
          productQuantities[product.product_id] = product.quantity;
        });
        setQuantities(productQuantities);
      }
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Add this function to your component
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Fetch location data when pincode changes
useEffect(() => {
  const fetchLocationData = async () => {
    const pincode = formData.pincode;

    if (pincode && pincode.length === 6) {
      try {
        const response = await fetch(`${POSTAL_API}/${pincode}`);
        const result = await response.json();

        // If API returns PostOffice array
        if (Array.isArray(result) && result.length > 0 && result[0]?.PostOffice) {
          const postOffices = result[0].PostOffice;
          setPostOffices(postOffices);

          const first = postOffices[0];
          setFormData((prev) => ({
            ...prev,
            city: first.District || "",
            state: first.State || "",
            country: first.Country || "India",
            street: first.Name || "",
          }));
        } 
        // If API returns result.data format
        else if (result?.data) {
          const info = result.data;
          setFormData((prev) => ({
            ...prev,
            city: info.district_name || "",
            state: info.state_name || "",
            country: "India",
          }));
        } else {
          setPostOffices([]);
          setSnackbar({
            open: true,
            message: "Could not find location for this pincode",
            severity: "warning",
          });
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
        setSnackbar({
          open: true,
          message:
            "Error fetching location data. Please check the pincode and try again.",
          severity: "error",
        });
      }
    }
  };

  const debounceTimer = setTimeout(() => {
    fetchLocationData();
  }, 500);

  return () => clearTimeout(debounceTimer);
}, [formData.pincode]);


  const handleOpenEditDialog = (product) => {
    setEditingProduct(product);
    setPriceForm({
      purchase_price: product.purchase_price || "",
      rent_price_per_month: product.rent_price_per_month || "",
      offer_purchase_price: product.offer_purchase_price || "",
      offer_rent_price_per_month: product.offer_rent_price_per_month || "",
    });
    setEditDialogOpen(true);
  };

  // Close edit dialog
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingProduct(null);
    setPriceForm({
      purchase_price: "",
      rent_price_per_month: "",
    });
  };

  // Handle price form change
  const handlePriceFormChange = (field, value) => {
    setPriceForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // // Submit updated prices
  // const handleUpdatePrices = async () => {
  //   if (!editingProduct) return;

  //   // Check if the product is selected
  //   if (!selectedProductIds.includes(editingProduct.id)) {
  //     setSnackbar({
  //       open: true,
  //       message:
  //         "This product is not selected. Please select it first to update prices.",
  //       severity: "warning",
  //     });
  //     return;
  //   }

  //   try {
  //     const payload = {
  //       offer_purchase_price: priceForm.offer_purchase_price
  //         ? parseFloat(priceForm.offer_purchase_price)
  //         : null,
  //       offer_rent_price_per_month: priceForm.offer_rent_price_per_month
  //         ? parseFloat(priceForm.offer_rent_price_per_month)
  //         : null,
  //     };

  //     const response = await fetch(
  //       `${API_URL}/product-templete/${editingProduct.id}`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(payload),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to update product prices");
  //     }

  //     // Update the product in local state
  //     setProducts((prevProducts) =>
  //       prevProducts.map((product) =>
  //         product.id === editingProduct.id
  //           ? { ...product, ...payload }
  //           : product
  //       )
  //     );

  //     setSnackbar({
  //       open: true,
  //       message: "Product prices updated successfully!",
  //       severity: "success",
  //     });

  //     handleCloseEditDialog();
  //   } catch (error) {
  //     console.error("Error updating product prices:", error);
  //     setSnackbar({
  //       open: true,
  //       message: "Error updating product prices. Please try again.",
  //       severity: "error",
  //     });
  //   }
  // };

  const handleUpdatePrices = () => {
    if (!editingProduct) return;

    setProductOfferPrices((prev) => ({
      ...prev,
      [editingProduct.id]: priceForm.offer_purchase_price,
    }));
    setProductRentOfferPrices((prev) => ({
      ...prev,
      [editingProduct.id]: priceForm.offer_rent_price_per_month,
    }));

    setSnackbar({
      open: true,
      message: "Offer price updated successfully!",
      severity: "success",
    });

    handleCloseEditDialog();
  };

  const filteredProducts = products.filter(
    (product) =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQtyChange = (id, value) => {
    const qty = Math.max(0, parseInt(value) || 0);
    setQuantities({ ...quantities, [id]: qty });

    // Reset asset IDs when quantity changes
    if (quantities[id] !== qty) {
      setAssetIds((prev) => ({
        ...prev,
        [id]: Array(qty).fill(""),
      }));
    }
  };

  const incrementQty = (id) => {
    const newQty = (quantities[id] || 0) + 1;
    setQuantities((prev) => ({ ...prev, [id]: newQty }));

    // Add empty asset ID field when quantity increases
    setAssetIds((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), ""],
    }));
  };

  const decrementQty = (id) => {
    const newQty = Math.max(0, (quantities[id] || 0) - 1);
    setQuantities((prev) => ({ ...prev, [id]: newQty }));

    // Remove last asset ID when quantity decreases
    if (newQty < (quantities[id] || 0)) {
      setAssetIds((prev) => ({
        ...prev,
        [id]: (prev[id] || []).slice(0, -1),
      }));
    }
  };

  const validateAssetIds = () => {
    const errors = {};
    let isValid = true;
    let globalError = "";

    if (formData.is_direct_invoice) {
      // Check if any products are selected
      if (selectedProductIds.length === 0) {
        globalError = "Please select at least one product for direct invoice";
        isValid = false;
      } else {
        for (const productId of selectedProductIds) {
          const product = products.find((p) => p.id === productId);
          const productAssetIds = assetIds[productId] || [];
          const qty = quantities[productId] || 0;

          // Skip validation if quantity is 0
          if (qty === 0) continue;

          // Check if we have the right number of asset IDs
          if (productAssetIds.length !== qty) {
            errors[productId] = `Please provide ${qty} asset ID(s) for ${
              product?.product_name || "this product"
            }`;
            isValid = false;
            continue;
          }

          // Check if all asset IDs are filled
          const emptyIndexes = [];
          for (let i = 0; i < productAssetIds.length; i++) {
            if (!productAssetIds[i] || productAssetIds[i].trim() === "") {
              emptyIndexes.push(i + 1);
            }
          }

          if (emptyIndexes.length > 0) {
            errors[productId] = `Asset ID(s) #${emptyIndexes.join(
              ", "
            )} required for ${product?.product_name || "this product"}`;
            isValid = false;
            continue;
          }

          // Check for duplicate asset IDs within the same product
          const uniqueAssetIds = new Set(productAssetIds);
          if (uniqueAssetIds.size !== productAssetIds.length) {
            const duplicates = productAssetIds.filter(
              (id, index) => productAssetIds.indexOf(id) !== index
            );
            errors[productId] = `Duplicate asset ID(s): ${[
              ...new Set(duplicates),
            ].join(", ")} found in ${product?.product_name || "this product"}`;
            isValid = false;
          }
        }
      }
    }

    setAssetIdErrors(errors);

    // Show global error message if needed
    if (globalError) {
      setSnackbar({
        open: true,
        message: globalError,
        severity: "error",
      });
    }

    return isValid;
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      selectedLead: "",
    };

    // Validate lead selection
    if (!selectedLeadId) {
      newErrors.selectedLead = "Lead selection is required";
      isValid = false;
    }

    setErrors(newErrors);

    // Validate asset IDs if it's a direct invoice
    if (formData.is_direct_invoice) {
      const assetIdValid = validateAssetIds();
      if (!assetIdValid) {
        isValid = false;

        // Show specific error message if we have product-specific errors
        const hasProductErrors = Object.keys(assetIdErrors).length > 0;
        if (hasProductErrors) {
          setSnackbar({
            open: true,
            message:
              "Please provide all required asset IDs for the selected products",
            severity: "error",
          });
        }
      }
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      if (
        !formData.is_direct_invoice ||
        Object.keys(assetIdErrors).length === 0
      ) {
        setSnackbar({
          open: true,
          message: "Please fix the errors before submitting",
          severity: "error",
        });
      }
      return;
    }

    let isValid = true;
    const newErrors = { selectedLead: "" };

    // Validate lead selection
    if (!selectedLeadId) {
      newErrors.selectedLead = "Lead selection is required";
      isValid = false;
    }

    setErrors(newErrors);

    // Validate asset IDs if it's a direct invoice
    if (formData.is_direct_invoice && !validateAssetIds()) {
      isValid = false;
      setSnackbar({
        open: true,
        message: "Please provide all required asset IDs",
        severity: "error",
      });
    }

    if (!isValid) {
      setSnackbar({
        open: true,
        message: "Please fix the errors before submitting",
        severity: "error",
      });
      return;
    }

    try {
      const quotationPayload = {
        quotation_id: formData.quotationId,
        quotation_title: formData.quotationTitle,
        transaction_type: formData.transactionType,
        payment_type: formData.payment_type,
        lead_id: selectedLeadId,
        rental_start_date: formData.rentalStartDate,
        rental_end_date: formData.rentalEndDate,
        quotation_date: formData.quotationDate,
        rental_duration: parseInt(formData.rentalDurationMonths) || 0,
        rental_duration_days: parseInt(formData.rentalDurationDays) || 0,
        is_direct_invoice: formData.is_direct_invoice,
        customer_id: formData.customer_id,
        customer_first_name: formData.customer_first_name,
        customer_last_name: formData.customer_last_name,
        remarks: formData.remarks,
        quotation_generated_by: formData.quotationGeneratedBy,
        status: formData.quotationStatus,
        items: selectedProductIds.map((productId) => {
          const product = products.find((p) => p.id === productId);
          const offerPrice = productOfferPrices[productId] || 0;
          const rentOfferPrice = productRentOfferPrices[productId] || 0;

          const leadProduct = selectedLeadId
            ? leads
                .find((lead) => lead.id === parseInt(selectedLeadId))
                ?.lead_products?.find((lp) => lp.product_id === productId)
            : null;

          const asset_ids = formData.is_direct_invoice
            ? assetIds[productId] || []
            : [];

          return {
            product_id: productId,
            requested_quantity: leadProduct?.quantity || 1,
            quotation_quantity: quantities[productId] || 0,
            product_name: product?.product_name || "",
            offer_purchase_price: offerPrice,
            offer_rent_price_per_month: rentOfferPrice,
            purchase_price: product.purchase_price,
            rent_price_per_month: product.rent_price_per_month,
            asset_ids,
          };
        }),
      };

      const response = await fetch(`${API_URL}/quotations/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify(quotationPayload),
      });

      const result = await response.json();

      if (!response.ok) {
        // ✅ Check if backend returned duplicate asset errors
        if (result?.duplicates?.length > 0) {
          const duplicateMsg = result.duplicates
            .map((d) => `Asset: ${d.asset_id} (Product: ${d.product_name})`)
            .join(", ");
          setSnackbar({
            open: true,
            message: `Duplicate Asset IDs found: ${duplicateMsg}`,
            severity: "error",
          });
        } else {
          setSnackbar({
            open: true,
            message: result.message || "Failed to create quotation",
            severity: "error",
          });
        }
        return;
      }

      console.log("Quotation created:", result);

      setSnackbar({
        open: true,
        message: "Quotation created successfully!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/dashboard/crm/quotations");
      }, 1500);

      // Reset form
      setFormData((prev) => ({ ...prev, quotationTitle: "", remarks: "" }));
      setSelectedProductIds([]);
      setQuantities({});
      setAssetIds({});
    } catch (error) {
      console.error("Submission error:", error);
      setSnackbar({
        open: true,
        message: "Error creating quotation. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <div style={containerStyle}>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Price Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogContent>
          {editingProduct && (
            <div style={formContainerStyle}>
              {/* Quotation Information Section */}
              <div style={cardStyle}>
                <div style={cardHeaderContainerStyle}>
                  <h3 style={cardHeaderStyle}>Edit Product Prices</h3>
                </div>
              </div>
              <Field
                label="Product Name"
                value={editingProduct.product_name}
                placeholder=""
                disabled={true} // properly disables the field
              />
              <div style={fieldsGridStyle}>
                {/* Product Name - Disabled */}

                {/* Disabled - Actual Prices */}
                <Field
                  label="Purchase Price (₹)"
                  type="number"
                  value={priceForm.purchase_price}
                  placeholder=""
                  disabled={true}
                />
                <Field
                  label="Monthly Rental Price (₹)"
                  type="number"
                  value={priceForm.rent_price_per_month}
                  placeholder=""
                  disabled={true}
                />

                {/* Editable - Offer Prices */}
                <Field
                  label="Offer Purchase Price (₹)"
                  type="number"
                  value={priceForm.offer_purchase_price || ""}
                  onChange={(e) =>
                    handlePriceFormChange(
                      "offer_purchase_price",
                      e.target.value
                    )
                  }
                  placeholder=""
                />
                <Field
                  label="Offer Monthly Rental Price (₹)"
                  type="number"
                  value={priceForm.offer_rent_price_per_month || ""}
                  onChange={(e) =>
                    handlePriceFormChange(
                      "offer_rent_price_per_month",
                      e.target.value
                    )
                  }
                  placeholder=""
                />
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleUpdatePrices} variant="contained">
            Update Prices
          </Button>
        </DialogActions>
      </Dialog>

      <div style={headerStyle}>
        <h1 style={titleStyle}>Create Quotation</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={formContainerStyle}>
          {/* Quotation Information Section */}
          <div style={cardStyle}>
            <div style={cardHeaderContainerStyle}>
              <div style={iconStyle}>📋</div>
              <h3 style={cardHeaderStyle}>Quotation Information</h3>
            </div>
            <div style={fieldsGridStyle}>
              <Field
                label="Quotation ID"
                placeholder="Enter Quotation ID"
                value={formData.quotationId}
                onChange={(e) =>
                  handleInputChange("quotationId", e.target.value)
                }
              />

              <Field
                label="Select Lead"
                type="select"
                placeholder="Select Lead"
                value={selectedLeadId || ""}
                onChange={(e) => {
                  handleLeadChange(e.target.value);
                  // Clear error when user selects something
                  if (errors.selectedLead) {
                    setErrors({ ...errors, selectedLead: "" });
                  }
                }}
                options={leads.map((lead) => ({
                  value: lead.id,
                  label: `${lead.lead_id} - ${lead.contact.first_name} ${lead.contact.last_name}`,
                }))}
                error={errors.selectedLead}
              />
              <Field
                label="Lead ID"
                placeholder="Enter Lead ID"
                value={formData.leadId}
                readOnly
              />
              <Field
                label="Transaction Type"
                type="select"
                placeholder="Select Type"
                value={formData.transactionType}
                onChange={(e) =>
                  handleInputChange("transactionType", e.target.value)
                }
                options={[
                  { value: "Rent", label: "Rent" },
                  { value: "Buy", label: "Sale" },
                ]}
                disabled
              />
              <Field
                label="Quotation Status"
                type="select"
                placeholder="Select Status"
                value={formData.quotationStatus}
                onChange={(e) =>
                  handleInputChange("quotationStatus", e.target.value)
                }
                options={["Pending", "Approved", "Rejected"]}
              />
              {/* <Field
                label="Source of Enquiry"
                type="select"
                placeholder="Select Source"
                value={formData.sourceOfEnquiry}
                onChange={(e) =>
                  handleInputChange("sourceOfEnquiry", e.target.value)
                }
                options={["Search Engine", "Referral", "Advertisement"]}
              /> */}
              <Field
                label="Owner"
                placeholder="Enter Owner Name"
                value={formData.owner}
                onChange={(e) => handleInputChange("owner", e.target.value)}
              />
              <Field
                label="Remarks"
                placeholder="Enter Remarks"
                type="textarea"
                value={formData.remarks}
                onChange={(e) => handleInputChange("remarks", e.target.value)}
              />
              <Field
                label="Quotation Generated By"
                placeholder="Enter Name"
                value={formData.quotationGeneratedBy}
                disabled
              />
            </div>
          </div>

          {/* Personal Details Section */}
          <div style={cardStyle}>
            <div style={cardHeaderContainerStyle}>
              <div style={iconStyle}>👤</div>
              <h3 style={cardHeaderStyle}>Personal Details</h3>
            </div>
            <div style={fieldsGridStyle}>
              <Field
                label="First Name"
                placeholder="Enter First Name"
                value={formData.customer_first_name}
                onChange={(e) =>
                  handleInputChange("customer_first_name", e.target.value)
                }
              />
              <Field
                label="Last Name"
                placeholder="Enter Last Name"
                value={formData.customer_last_name}
                onChange={(e) =>
                  handleInputChange("customer_last_name", e.target.value)
                }
              />
              <Field
                label="Email ID"
                placeholder="Enter Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              <Field
                label="Phone Number"
                placeholder="Enter Phone Number"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
              />

              <Field
                label="Quotation Date"
                type="date"
                placeholder="Select Date"
                value={formData.quotationDate}
                onChange={(e) =>
                  handleInputChange("quotationDate", e.target.value)
                }
              />
              <Field
                label="Industry"
                placeholder="Enter Industry"
                value={formData.industry}
                onChange={(e) => handleInputChange("industry", e.target.value)}
              />
              {/* <Field
                label="Active Status"
                name="activeStatus"
                type="checkbox"
                value={formData.activeStatus}
                onChange={(e) =>
                  handleInputChange("activeStatus", e.target.checked)
                }
                description="Check if this record is active"
              /> */}
              {formData.transactionType === "Buy" && (
                <Field
                  label="Direct Invoice"
                  name="is_direct_invoice"
                  type="checkbox"
                  value={formData.is_direct_invoice}
                  onChange={handleCheckboxChange}
                  description="Check if this is a direct invoice"
                />
              )}
            </div>
          </div>

          {/* Address Section */}
          <div style={cardStyle}>
            <div style={cardHeaderContainerStyle}>
              <div style={iconStyle}>🏠</div>
              <h3 style={cardHeaderStyle}>Address</h3>
            </div>
            <div style={fieldsGridStyle}>
              {/* <Field
                label="Street"
                placeholder="Enter Street"
                value={formData.street}
                onChange={(e) => handleInputChange("street", e.target.value)}
              /> */}
              <Field
                label="Landmark"
                placeholder="Enter Landmark"
                value={formData.landmark}
                onChange={(e) => handleInputChange("landmark", e.target.value)}
              />
              <Field
                label="Pincode"
                placeholder="Enter Pincode"
                type="number"
                value={formData.pincode}
                onChange={(e) => handleInputChange("pincode", e.target.value)}
              />
              <Field
                label="City"
                placeholder="Enter City"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
              />
              <Field
                label="State"
                placeholder="Enter State"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
              />
              <Field
                label="Country"
                placeholder="Enter Country"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Select Products Section */}
        <div style={cardStyle}>
          <div style={cardHeaderContainerStyle}>
            <h3 style={cardHeaderStyle}>Select Products</h3>
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <button
              type="button"
              onClick={() => setShowProductTable(!showProductTable)}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: showProductTable ? "#f3f4f6" : "#2563eb",
                color: showProductTable ? "#374151" : "white",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
                transition: "all 0.2s ease",
                outline: "none",
                marginBottom: "1rem",
              }}
            >
              {showProductTable ? "Hide Product List" : "Select Products"}
            </button>

            {showProductTable && (
              <Box p={2}>
                <Box display="flex" gap={2} mb={2} alignItems="center">
                  <TextField
                    size="small"
                    placeholder="Search products"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                  />
                </Box>

                <TableContainer
                  component={Paper}
                  sx={{
                    maxHeight: "400px", // or whatever height you prefer
                    overflow: "auto",
                    position: "relative",
                  }}
                >
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#0d47a1" }}>
                        <TableCell
                          padding="checkbox"
                          sx={{ backgroundColor: "#0d47a1" }}
                        >
                          <Checkbox
                            sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                        >
                          Product Name
                        </TableCell>
                        <TableCell
                          sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                        >
                          Product Category
                        </TableCell>
                        <TableCell
                          sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                        >
                          Specifications
                        </TableCell>
                        <TableCell
                          sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                        >
                          Price per Piece
                        </TableCell>
                        <TableCell
                          sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                        >
                          Quantity
                        </TableCell>
                        {formData.is_direct_invoice === true && (
                          <TableCell
                            sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                          >
                            Asset IDs
                          </TableCell>
                        )}

                        <TableCell
                          sx={{ backgroundColor: "#0d47a1", color: "#fff" }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedProductIds.includes(product.id)}
                              onChange={() => {
                                setSelectedProductIds((prev) =>
                                  prev.includes(product.id)
                                    ? prev.filter((id) => id !== product.id)
                                    : [...prev, product.id]
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>{product.product_name}</TableCell>
                          <TableCell>{product.product_category}</TableCell>
                          <TableCell>
                            <div>
                              <strong>Model:</strong> {product.model}
                            </div>
                            <div>
                              <strong>Processor:</strong> {product.processor}
                            </div>
                            <div>
                              <strong>RAM:</strong> {product.ram}
                            </div>
                            <div>
                              <strong>Storage:</strong> {product.storage}
                            </div>
                            <div>
                              <strong>Graphics:</strong> {product.graphics}
                            </div>
                          </TableCell>
                          <TableCell>
                            <>
                              <div>
                                <strong>Purchase Price:</strong> ₹
                                {productOfferPrices[product.id] ||
                                  product.purchase_price}
                              </div>
                              <div>
                                <strong>Month Price:</strong> ₹
                                {productRentOfferPrices[product.id] ||
                                  product.rent_price_per_month}
                              </div>
                            </>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <IconButton
                                size="small"
                                onClick={() => decrementQty(product.id)}
                              >
                                <Remove fontSize="small" />
                              </IconButton>
                              <TextField
                                type="number"
                                size="small"
                                value={quantities[product.id] || ""}
                                onChange={(e) =>
                                  handleQtyChange(product.id, e.target.value)
                                }
                                inputProps={{
                                  min: 0,
                                  style: { width: 50, textAlign: "center" },
                                }}
                              />
                              <IconButton
                                size="small"
                                onClick={() => incrementQty(product.id)}
                              >
                                <Add fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                          {formData.is_direct_invoice === true && (
                            <TableCell>
                              {quantities[product.id] > 0 && (
                                <Box
                                  display="flex"
                                  flexDirection="column"
                                  gap={1}
                                  sx={{ width: "200px" }}
                                >
                                  {/* TextFields with Errors */}
                                  <Box
                                    display="flex"
                                    flexDirection="column"
                                    gap={1}
                                  >
                                    {(assetIds[product.id] || []).map(
                                      (id, idx) => (
                                        <TextField
                                          key={idx}
                                          size="small"
                                          fullWidth
                                          placeholder={`Asset ID ${idx + 1}`}
                                          value={id}
                                          onChange={(e) => {
                                            const updated = [
                                              ...(assetIds[product.id] || []),
                                            ];
                                            updated[idx] = e.target.value;
                                            setAssetIds((prev) => ({
                                              ...prev,
                                              [product.id]: updated,
                                            }));
                                            if (assetIdErrors[product.id]) {
                                              setAssetIdErrors((prev) => {
                                                const newErrors = { ...prev };
                                                delete newErrors[product.id];
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          error={Boolean(
                                            assetIdErrors[product.id]
                                          )}
                                          helperText={
                                            idx === 0
                                              ? assetIdErrors[product.id]
                                              : ""
                                          }
                                        />
                                      )
                                    )}
                                  </Box>

                                  {/* Add Button OUTSIDE */}
                                  {(assetIds[product.id]?.length || 0) <
                                    (quantities[product.id] || 0) && (
                                    <Box mt={1}>
                                      <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() =>
                                          setAssetIds((prev) => ({
                                            ...prev,
                                            [product.id]: [
                                              ...(prev[product.id] || []),
                                              "",
                                            ],
                                          }))
                                        }
                                      >
                                        + Add Asset ID
                                      </Button>
                                    </Box>
                                  )}
                                </Box>
                              )}
                            </TableCell>
                          )}

                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenEditDialog(product)}
                              title="Edit Prices"
                              disabled={
                                !selectedProductIds.includes(product.id)
                              } // Add this line
                              style={{
                                opacity: selectedProductIds.includes(product.id)
                                  ? 1
                                  : 0.5,
                                cursor: selectedProductIds.includes(product.id)
                                  ? "pointer"
                                  : "not-allowed",
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={buttonContainerStyle}>
          <button
            type="button"
            style={cancelBtnStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#e5e7eb")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={createBtnStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
          >
            Create Quotation
          </button>
        </div>
      </form>
    </div>
  );
};

const Field = ({
  label,
  placeholder,
  type = "text",
  options = [],
  value,
  onChange,
  readOnly = false,
  required = false,
  error = "",
  disabled = false,
  description = "",
  name,
}) => (
  <div style={fieldContainerStyle}>
    <label style={labelStyle}>
      {type !== "checkbox" && label}
      {required && type !== "checkbox" && (
        <span style={{ color: "red" }}>*</span>
      )}
    </label>

    {type === "checkbox" ? (
      <div style={{ ...checkboxContainerStyle, marginTop: "0.5rem" }}>
        <label style={checkboxLabelStyle}>
          <input
            type="checkbox"
            name={name}
            checked={value}
            onChange={onChange}
            disabled={disabled}
            style={checkboxInputStyle}
          />
          <div style={checkboxCustomStyle}>
            {value && <span style={checkmarkStyle}>✓</span>}
          </div>
          <div>
            <span style={checkboxTextStyle}>
              {label}
              {required && <span style={{ color: "red" }}>*</span>}
            </span>
            {description && <div style={descriptionStyle}>{description}</div>}
          </div>
        </label>
      </div>
    ) : type === "select" ? (
      <div>
        <div style={selectWrapperStyle}>
          <select
            style={{
              ...selectStyle,
              borderColor: error ? "red" : "#d1d5db",
            }}
            value={value}
            onChange={onChange}
            disabled={disabled || readOnly}
            required={required}
            name={name}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option, idx) =>
              typeof option === "object" ? (
                <option key={idx} value={option.value}>
                  {option.label}
                </option>
              ) : (
                <option key={idx} value={option}>
                  {option}
                </option>
              )
            )}
          </select>
          <div style={selectArrowStyle}>▼</div>
        </div>
        {error && (
          <div style={{ color: "red", fontSize: "0.75rem", marginTop: "4px" }}>
            {error}
          </div>
        )}
      </div>
    ) : type === "textarea" ? (
      <textarea
        placeholder={placeholder}
        style={textareaStyle}
        rows={3}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        disabled={disabled}
        name={name}
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        style={{
          ...inputStyle,
          borderColor: error ? "red" : "#d1d5db",
        }}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        disabled={disabled}
        name={name}
      />
    )}

    {error && type !== "select" && type !== "checkbox" && (
      <div style={{ color: "red", fontSize: "0.75rem", marginTop: "4px" }}>
        {error}
      </div>
    )}

    {description && type !== "checkbox" && (
      <div style={descriptionStyle}>{description}</div>
    )}
  </div>
);

const checkboxContainerStyle = {
  display: "flex",
  alignItems: "flex-start",
};

const checkboxInputStyle = {
  position: "absolute",
  opacity: 0,
  cursor: "pointer",
  height: 0,
  width: 0,
};

const descriptionStyle = {
  fontSize: "0.75rem",
  color: "#6b7280",
  marginTop: "0.25rem",
};

// Styles (same as in your original code)
const containerStyle = {
  padding: "2rem",
  fontFamily:
    '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  minHeight: "100vh",
  lineHeight: 1.6,
};

const headerStyle = {
  marginBottom: "2rem",
  maxWidth: "1400px",
};

const titleStyle = {
  fontSize: "2rem",
  fontWeight: "700",
  color: "#1e293b",
  margin: "0 0 0.5rem 0",
  letterSpacing: "-0.025em",
};

const subtitleStyle = {
  fontSize: "1rem",
  color: "#64748b",
  margin: 0,
};

const formContainerStyle = {
  display: "grid",
  gap: "1.5rem",
  maxWidth: "1400px",
  gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
};

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "1.5rem",
  borderRadius: "12px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
  border: "1px solid #e2e8f0",
  transition: "box-shadow 0.2s ease",
};

const cardHeaderContainerStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "1.5rem",
  paddingBottom: "1rem",
  borderBottom: "1px solid #e2e8f0",
};

const iconStyle = {
  fontSize: "1.25rem",
  marginRight: "0.75rem",
  backgroundColor: "#f1f5f9",
  padding: "0.5rem",
  borderRadius: "8px",
};

const cardHeaderStyle = {
  fontSize: "1.125rem",
  fontWeight: "600",
  color: "#1e293b",
  margin: 0,
};

const fieldsGridStyle = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
};

const fieldContainerStyle = {
  display: "flex",
  flexDirection: "column",
};

const labelStyle = {
  display: "block",
  marginBottom: "0.5rem",
  fontWeight: "500",
  fontSize: "0.875rem",
  color: "#374151",
  letterSpacing: "0.025em",
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "0.875rem",
  backgroundColor: "#ffffff",
  transition: "all 0.2s ease",
  outline: "none",
  boxSizing: "border-box",
};

const selectWrapperStyle = {
  position: "relative",
  width: "100%",
};

const selectStyle = {
  width: "100%",
  padding: "0.75rem",
  paddingRight: "2.5rem",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "0.875rem",
  backgroundColor: "#ffffff",
  appearance: "none",
  transition: "all 0.2s ease",
  outline: "none",
  boxSizing: "border-box",
  cursor: "pointer",
};

const selectArrowStyle = {
  position: "absolute",
  right: "0.75rem",
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none",
  fontSize: "0.75rem",
  color: "#6b7280",
};

const textareaStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "0.875rem",
  backgroundColor: "#ffffff",
  transition: "all 0.2s ease",
  outline: "none",
  resize: "vertical",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const checkboxLabelStyle = {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  gap: "8px",
  position: "relative",
};

const checkboxStyle = {
  width: 0,
  height: 0,
  opacity: 0,
  position: "absolute",
};

const checkboxCustomStyle = {
  width: "20px",
  height: "20px",
  border: "2px solid #007bff",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#fff",
};

const checkmarkStyle = {
  color: "#007bff",
  fontSize: "16px",
  fontWeight: "bold",
};

const checkboxTextStyle = {
  fontSize: "14px",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "0.75rem",
  marginTop: "2rem",
  maxWidth: "1200px",
  margin: "2rem auto 0",
  padding: "0 1.5rem",
};

const cancelBtnStyle = {
  padding: "0.75rem 1.5rem",
  backgroundColor: "#f3f4f6",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "0.875rem",
  fontWeight: "500",
  transition: "all 0.2s ease",
  outline: "none",
};

const createBtnStyle = {
  padding: "0.75rem 1.5rem",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "0.875rem",
  fontWeight: "500",
  transition: "all 0.2s ease",
  outline: "none",
};

export default QuotationsAddLayoutPage;
