import React from "react";
import { useSelector } from "react-redux";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SignIn from "../pages/auth_page/SignIn";
import DashBoard from "../pages/dashboard_page/DashBoard";
import SignUp from "../pages/auth_page/SignUp";
import LayOut from "../layouts/LayOut.jsx"; 
import ProfilePage from "../pages/user-profile/ProfilePage.jsx"
import EditProfile from "../pages/user-profile/EditProfile.jsx"
import ProductTemplatePage from "../pages/product_library/producttemplate/ProductTable.jsx";
import ProductTable from "../pages/product_library/producttemplate/ProductTable.jsx";
import ProductCategoriesPage from "../pages/product_library/productcategories/ProductCategoriesPage.jsx";
import ItemMasterPageLayout from "../pages/product_library/itemmaster/ItemMasterPageLayout.jsx";
import ItemVarientPageLayout from "../pages/product_library/itemvarient/ItemVarientPageLayout.jsx";
import AssetPageLayout from "../pages/product_library/asset/AssetPageLayout.jsx";
import AssetmtTrackerPageLayout from "../pages/product_library/assetmodificationtracker/AssetmtTrackerPageLayout.jsx";
import GradePageLayoutPage from "../pages/product_library/grade/GradePageLayoutPage.jsx";
import StockLocationPageLayout from "../pages/product_library/stocklocations/StockLocationPageLayout.jsx";
import StockLoAddPage from "../pages/product_library/stocklocations/StockLoAddPage.jsx";
import StockLoEditPage from "../pages/product_library/stocklocations/StockLoEditPage.jsx";
import GradeAddPage from "../pages/product_library/grade/GradeAddPage.jsx";
import GradeEditPage from "../pages/product_library/grade/GradeEditPage.jsx";
import AssetmtTrackerPageLayoutAdd from "../pages/product_library/assetmodificationtracker/AssetmtTrackerPageLayoutAdd.jsx";
import AssetmtTrackerPageLayoutEdit from "../pages/product_library/assetmodificationtracker/AssetmtTrackerPageLayoutEdit.jsx";
import AssetPageLayoutAdd from "../pages/product_library/asset/AssetPageLayoutAdd.jsx";
import AssetPageLayoutEdit from "../pages/product_library/asset/AssetPageLayoutEdit.jsx";
import ItemVariantPageLayoutAdd from "../pages/product_library/itemvarient/ItemVarientPageLayoutAdd.jsx";
import ItemVariantPageLayoutEdit from "../pages/product_library/itemvarient/ItemVarientPageLayoutEdit.jsx";
import ItemMasterPageLayoutAdd from "../pages/product_library/itemmaster/ItemMasterPageLayoutAdd.jsx";
import ItemMasterPageLayoutEdit from "../pages/product_library/itemmaster/ItemMasterPageLayoutEdit.jsx";
import BrandsPageAddLayout from "../pages/product_library/brands/BrandsPageAddLayout.jsx";
import BrandsPageEditLayout from "../pages/product_library/brands/BrandsPageEditLayout.jsx";
import PurchaseRequestTableLayout from "../pages/procurement/purchaserequest/PurchaseRequestTableLayout.jsx";
import PurchaseRequestAdd from "../pages/procurement/purchaserequest/PurchaseRequestAdd.jsx";
import PurchaseRequestEdit from "../pages/procurement/purchaserequest/PurchaseRequestEdit.jsx";
import POQuotationTable from "../pages/procurement/po-quotation/POQuotationTable.jsx";
import PoOperationAddPageLayout from "../pages/procurement/po-quotation/PoOperationAddPageLayout.jsx";
import POQuotationEdit from "../pages/procurement/po-quotation/POQuotationEdit.jsx";
import PurchaseOrderTable from "../pages/procurement/purchase-orders/PurchaseOrderTable.jsx";
import PurchaseOrderAddLayout from "../pages/procurement/purchase-orders/PurchaseOrderAddLayout.jsx";
import PurchaseOrderEditLayout from "../pages/procurement/purchase-orders/PurchaseOrderEditLayout.jsx";
import GoodsReceiptsAddLayout from "../pages/procurement/goodsreceipts/GoodsReceiptsAddLayout.jsx";
import GoodsReceiptsTable from "../pages/procurement/goodsreceipts/GoodsReceiptsTable.jsx";
import GoodsReceiptsEditLayout from "../pages/procurement/goodsreceipts/GoodsReceiptsEditLayout.jsx";
import SuppliersTable from "../pages/procurement/suppliers/SuppliersTable.jsx";
import SupplierAddLayout from "../pages/procurement/suppliers/SupplierAddayout.jsx";
import SupplierEditLayout from "../pages/procurement/suppliers/SupplierEditayout.jsx";
import ContactsTable from "../pages/crm/contacts/ContactsTable.jsx";
import ContactsAddLayoutPage from "../pages/crm/contacts/ContactsAddLayoutPage.jsx";
import InventoryTable from "../pages/inventory/InventoryTable.jsx";
import LeadsLayoutAddPage from "../pages/crm/leads/LeadsLayoutAddPage.jsx";
import ContactsEditLayoutPage from "../pages/crm/contacts/ContactsEditLayoutPage.jsx";
import LeadsTable from "../pages/crm/leads/LeadsTable.jsx";
import LeadsLayoutEditPage from "../pages/crm/leads/LeadsLayoutEditPage.jsx";
import QuotationsTable from "../pages/crm/quotations/QuotationsTable.jsx";
import QuotationsAddLayoutPage from "../pages/crm/quotations/QuotationsAddLayoutPage.jsx";
import QuotationsEditLayoutPage from "../pages/crm/quotations/QuotationsEditLayoutPage.jsx";
import SalesOrdersAddLayoutPage from "../pages/crm/salesoreders/SalesOrdersAddLayoutPage.jsx";
import SalesOrdersEditLayoutPage from "../pages/crm/salesoreders/SalesOrdersEditLayoutPage.jsx";
import OrdersTable from "../pages/crm/salesoreders/OrdersTable.jsx";
import ProductsAddLayout from "../pages/product_library/producttemplate/ProductsAddLayout.jsx";
import ProductsEditLayout from "../pages/product_library/producttemplate/ProductsEditLayout.jsx";
import BrandsTablePage from "../pages/product_library/brands/BrandsTablePage.jsx";
import AddProductCategoryForm from "../pages/product_library/productcategories/ProductCategoriesAddPage.jsx";
import ProductCategoriesAddPage from "../pages/product_library/productcategories/ProductCategoriesAddPage.jsx";
import DeliveryChallanTable from "../pages/operations/DeliveryChallanTable.jsx";
import DeliveryChallanAddPage from "../pages/operations/DeliveryChallanAddPage.jsx";
import DeliveryChallanEditPage from "../pages/operations/DeliveryChallanEditPage.jsx";
import UsersTablePage from "../pages/settings/users/UsersTablePage.jsx";
import UsersAddPage from "../pages/settings/users/UsersAddPage.jsx";
import RolesTablePage from "../pages/settings/roles/RolesTablePage.jsx";
import RolesAddPage from "../pages/settings/roles/RolesAddPage.jsx";
import BranchAddPage from "../pages/settings/branches/BranchAddPage.jsx";
import BranchTablePage from "../pages/settings/branches/BranchTablePage.jsx";
import ContactTypeTable from "../pages/settings/contacttype/ContactTypeTable.jsx";
import ContactTypeAdd from "../pages/settings/contacttype/ContactTypeAdd.jsx";
import TaxListTable from "../pages/settings/taxlist/TaxListTable.jsx";
import TaxListAdd from "../pages/settings/taxlist/TaxListAdd.jsx";
import AddressTable from "../pages/settings/address/AddressTable.jsx";
import AddressAddPage from "../pages/settings/address/AddressAddPage.jsx";
import ContactTypeEdit from "../pages/settings/contacttype/ContactTypeEdit.jsx";
import TaxListEdit from "../pages/settings/taxlist/TaxListEdit.jsx";
const ProtectedRoute = ({ element }) => {
  const user = useSelector((state) => state.auth.user);
  return user ? element : <Navigate to="/signin" replace />;
};
const RoutesConfig = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Dashboard */}
          <Route path="/dashboard/*" element={<ProtectedRoute element={<LayOut />} />}>
          <Route index element={<DashBoard />} />

            
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/edit-profile/:id" element={<EditProfile />} />
            <Route path="product_library" element={<ProductTemplatePage />} />
            <Route path="product_library/add" element={<ProductsAddLayout/>} />
            <Route path="product_library/edit/:id" element={<ProductsEditLayout/>} />
            <Route path="product_library/brands" element={<BrandsTablePage />} />
            <Route path="product_library/brands/add" element={<BrandsPageAddLayout />} />
            <Route path="product_library/brands/edit/:id" element={<BrandsPageEditLayout />} />
            <Route path="product_library/product_categories" element={<ProductCategoriesPage/>} />
            <Route path="product_library/product_categories/add" element={<ProductCategoriesAddPage/>} />
            <Route path="product_library/product_categories" element={<ProductCategoriesPage/>} />

            <Route path="product_library/item_master" element={<ItemMasterPageLayout/>} />
            <Route path="product_library/item_master/add" element={<ItemMasterPageLayoutAdd/>} />
            <Route path="product_library/item_master/edit/:id" element={<ItemMasterPageLayoutEdit/>} />
            <Route path="product_library/item_variant" element={<ItemVarientPageLayout/>} />
            <Route path="product_library/item_variant/add" element={<ItemVariantPageLayoutAdd/>} />
            <Route path="product_library/item_variant/edit/:id" element={<ItemVariantPageLayoutEdit/>} />
            <Route path="product_library/asset" element={<AssetPageLayout/>} />
            <Route path="product_library/asset/add" element={<AssetPageLayoutAdd/>} />
            <Route path="product_library/asset/edit/:id" element={<AssetPageLayoutEdit/>} />
            <Route path="product_library/asset_modification_tracker" element={<AssetmtTrackerPageLayout/>} />
            <Route path="product_library/asset_modification_tracker/add" element={<AssetmtTrackerPageLayoutAdd/>} />
            <Route path="product_library/asset_modification_tracker/edit/:id" element={<AssetmtTrackerPageLayoutEdit/>} />
            <Route path="product_library/grade" element={<GradePageLayoutPage/>} />
            <Route path="product_library/grade/add" element={<GradeAddPage/>} />
            <Route path="product_library/grade/edit/:id" element={<GradeEditPage/>} />
            <Route path="product_library/stock_locations" element={<StockLocationPageLayout/>} />
            <Route path="product_library/stock_locations/add/" element={<StockLoAddPage/>} />
            <Route path="product_library/stock_locations/edit/:id" element={<StockLoEditPage/>} />
            <Route path="procurement/purchase-requests" element={<PurchaseRequestTableLayout />} />
            <Route path="procurement/purchase-requests/add" element={<PurchaseRequestAdd />} />
            <Route path="procurement/purchase-requests/edit/:id" element={<PurchaseRequestEdit />} />
            <Route path="procurement/po-quotations" element={<POQuotationTable />} />
            <Route path="procurement/po-quotations/add" element={<PoOperationAddPageLayout />} />
            <Route path="procurement/po-quotations/edit/:id" element={<POQuotationEdit />} />
            <Route path="procurement/purchase-orders" element={<PurchaseOrderTable />} />
            <Route path="procurement/purchase-orders/add" element={<PurchaseOrderAddLayout />} />
            <Route path="procurement/purchase-orders" element={<PurchaseOrderTable />} />
            <Route path="procurement/purchase-orders/edit/:id" element={<PurchaseOrderEditLayout />} />
            <Route path="procurement/goodsreceipt" element={<GoodsReceiptsTable />} />
            <Route path="procurement/goodsreceipt/add" element={<GoodsReceiptsAddLayout />} />
            <Route path="procurement/goodsreceipt/edit/:id" element={<GoodsReceiptsEditLayout />} />
            <Route path="procurement/supplier" element={<SuppliersTable />} />
            <Route path="procurement/supplier/add" element={<SupplierAddLayout />} />
            <Route path="procurement/supplier/edit/:id" element={<SupplierEditLayout />} />
            <Route path="inventory" element={<InventoryTable />} />
            <Route path="crm/client-list" element={<ContactsTable />} />
            <Route path="crm/client-list/add" element={<ContactsAddLayoutPage />} />
            <Route path="crm/client-list/edit/:id" element={<ContactsEditLayoutPage />} />
            <Route path="crm/lead" element={<LeadsTable />} />
            <Route path="crm/lead/add" element={<LeadsLayoutAddPage />} />
            <Route path="crm/lead/edit/:id" element={<LeadsLayoutEditPage />} />
            <Route path="crm/quotations" element={<QuotationsTable />} />
            <Route path="crm/quotations/add" element={<QuotationsAddLayoutPage />} />
            <Route path="crm/quotations/edit/:id" element={<QuotationsEditLayoutPage />} />
            <Route path="crm/orders" element={<OrdersTable />} />
            <Route path="crm/orders/add" element={<SalesOrdersAddLayoutPage />} />
            <Route path="crm/orders/edit/:id" element={<SalesOrdersEditLayoutPage />} />
            <Route path="operations" element={<DeliveryChallanTable />} />
            <Route path="operations/add" element={<DeliveryChallanAddPage />} />
            <Route path="operations/edit/:id" element={<DeliveryChallanEditPage />} />
                                       {/* settings */}
            <Route path="settings/users" element={<UsersTablePage/>} />
            <Route path="settings/users/add" element={<UsersAddPage/>} />
            <Route path="settings/roles" element={<RolesTablePage/>} />
            <Route path="settings/roles/add" element={<RolesAddPage/>} />
            <Route path="settings/branch" element={<BranchTablePage/>} />
            <Route path="settings/branch/add" element={<BranchAddPage/>} />
            <Route path="settings/contact_type" element={<ContactTypeTable/>} />
            <Route path="settings/contact_type/add" element={<ContactTypeAdd/>} />
            <Route path="settings/contact_type/edit/:id" element={<ContactTypeEdit/>} />
            <Route path="settings/taxt_list" element={<TaxListTable/>} />
            <Route path="settings/taxt_list/add" element={<TaxListAdd/>} />
            <Route path="settings/taxt_list/edit/:id" element={<TaxListEdit/>} />
            <Route path="settings/address" element={<AddressTable/>} />
            <Route path="settings/address/add" element={<AddressAddPage/>} />


          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default RoutesConfig;
