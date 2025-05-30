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
import ProductTemplateAdd from "../pages/product_library/producttemplate/ProductTemplateAdd.jsx";
import PurchaseRequestTableLayoutPage from "../pages/procurement/purchaserequest/PurchaseRequestTableLayoutPage.jsx";
import PurchaseRequestAdd from "../pages/procurement/purchaserequest/PurchaseRequestAdd.jsx";
import PurchaseRequestEdit from "../pages/procurement/purchaserequest/PurchaseRequestEditPage.jsx";
import PoOperationTableLayout from "../pages/procurement/poquotation/PoOperationTableLayout.jsx";
import PurchaseOrderTableLayout from "../pages/procurement/purchaseorders/PurchaseOrderTableLayout.jsx";
import PurchaseOrderAddLayout from "../pages/procurement/purchaseorders/PurchaseOrderAddLayout.jsx";
import PurchaseOrderEditLayout from "../pages/procurement/purchaseorders/PurchaseOrderEditLayout.jsx";
import GoodsReceiptsTableLayout from "../pages/procurement/goodsreceipts/GoodsReceiptsTableLayout.jsx";
import GoodsReceiptsAddLayout from "../pages/procurement/goodsreceipts/GoodsReceiptsAddLayout.jsx";
import GoodsReceiptsEditLayout from "../pages/procurement/goodsreceipts/GoodsReceiptsEditLayout.jsx";
import SupplierTableLayout from "../pages/procurement/supplier/SupplierTableLayout.jsx";
import SupplierAddLayout from "../pages/procurement/supplier/SupplierAddayout.jsx";
import PoOperationAddPageLayout from "../pages/procurement/poquotation/PoOperationAddPageLayout.jsx";
import ProductsTableLayout from "../pages/inventory/products/productsTableLayout.jsx";
import ContactsTableLayoutPage from "../pages/crm/contacts/ContactsTableLayoutPage.jsx";
import LeadsTableLayoutPage from "../pages/crm/leads/LeadsTableLayoutPage.jsx";
import QuotationsTableLayoutPage from "../pages/crm/quotations/QuotationsTableLayoutPage.jsx";
import SalesOrdersTableLayoutPage from "../pages/crm/salesoreders/SalesOrdersTableLayoutPage.jsx";
import DispatchOrdersTableLayoutPage from "../pages/crm/dispatchorders/DispatchOrdersTableLayoutPage.jsx";
import ContactsAddLayoutPage from "../pages/crm/contacts/ContactsAddLayoutPage.jsx";
import ContactsEditLayout from "../pages/crm/contacts/ContactsEditLayout.jsx";
import LeadsLayoutAddPage from "../pages/crm/leads/LeadsLayoutAddPage.jsx";
import QuotationsAddLayoutPage from "../pages/crm/quotations/QuotationsAddLayoutPage.jsx";
import SalesOrdersAddLayoutPage from "../pages/crm/salesoreders/SalesOrdersAddLayoutPage.jsx";
import DeliveryChallanTablePage from "../pages/operations/deliverychallan/DeliveryChallanTablePage.jsx";
import InvoicesTablePage from "../pages/operations/invoices/InvoicesTablePage.jsx";
import GrmTablePageLayout from "../pages/operations/grn/GrmTablePageLayout.jsx";
import AssetModificationTrackerTableOperations from "../pages/operations/assetmodificationtracker/AssetModificationTrackerTableOperations.jsx";
import CreditNoteTablePageLayout from "../pages/operations/creditnote/CreditNoteTablePageLayout.jsx";
import ServiceTablePageOper from "../pages/operations/service/ServiceTablePageOper.jsx";
import DeliveryChallanAddPage from "../pages/operations/deliverychallan/DeliveryChallanAddPage.jsx";
import InvoicesAddPage from "../pages/operations/invoices/InvoicesAddPage.jsx";
import GrmAddPageLayoutOpe from "../pages/operations/grn/GrmAddPageLayoutOpe.jsx";
import ClinetTablePageLayoutCli from "../pages/client/ClinetTablePageLayoutCli.jsx";
import UserTablePageLayout from "../pages/settings/user/UserTablePageLayout.jsx";
import BranchesTablePageLayout from "../pages/settings/branches/BranchesTablePageLayout.jsx";
import DepartmentTablePage from "../pages/settings/department/DepartmentTablePage.jsx";
import RolesTablePage from "../pages/settings/roles/RolesTablePage.jsx";
import UserAddPageLayout from "../pages/settings/user/UserAddPageLayout.jsx";
import UserEditPageLayout from "../pages/settings/user/UserEditPageLayout.jsx";
import RolesAddPageLayout from "../pages/settings/roles/RolesAddPageLayout.jsx";
import DepartmentAddPageLayout from "../pages/settings/department/DepartmentAddPageLayout.jsx";
import DepartmentEditPageLayoutDept from "../pages/settings/department/DepartmentEditPageLayoutDept.jsx";
import BranchesAddPageLayout from "../pages/settings/branches/BranchesAddPageLayout.jsx";
import BranchesEditPageLayout from "../pages/settings/branches/BranchesEditPageLayout.jsx";
import ProductTemplateEdit from "../pages/product_library/producttemplate/ProductTemplateEdit.jsx";
import PoOperationEditPageLayout from "../pages/procurement/poquotation/PoOperationEditPageLayout.jsx";
import SupplierEditLayout from "../pages/procurement/supplier/SupplierEditayout.jsx";
import LeadsLayoutEditPage from "../pages/crm/leads/LeadsLayoutEditPage.jsx";
import QuotationsEditLayoutPage from "../pages/crm/quotations/QuotationsEditLayoutPage.jsx";
import SalesOrdersEditLayoutPage from "../pages/crm/salesoreders/SalesOrdersEditLayoutPage.jsx";
import DispatchOrdersAddLayoutPage from "../pages/crm/dispatchorders/DispatchOrdersAddLayoutPage.jsx";
import DispatchOrdersEditLayoutPageDis from "../pages/crm/dispatchorders/DispatchOrdersEditLayoutPageDis.jsx";
import DeliveryChallanEditPageDe from "../pages/operations/deliverychallan/DeliveryChallanEditPageDe.jsx";
import ServiceAddPageOper from "../pages/operations/service/ServiceAddPageOper.jsx";
import CreditNoteAddPageLayout from "../pages/operations/creditnote/CreditNoteAddPageLayout.jsx";
import ClientJourneyPageLayout from "../pages/operations/clientjourney/ClientJourneyPageLayout.jsx";
import ServiceEditPageOper from "../pages/operations/service/ServiceEditPageOper.jsx";
import GrmEditPageLayoutOpe from "../pages/operations/grn/GrmEditPageLayoutOpe.jsx";
import InvoicesEditPage from "../pages/operations/invoices/InvoicesEditPage.jsx";
import ClinetAddPageLayout from "../pages/client/ClinetAddPageLayout.jsx";
import ClinetEditPageLayout from "../pages/client/ClinetEditPageLayout.jsx";
import BrandsTablePage from "../pages/product_library/brands/BrandsTablePage.jsx";
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

            {/* product library roUts */}
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/edit-profile/:id" element={<EditProfile />} />
            <Route path="product_library/product_template" element={<ProductTemplatePage />} />
            <Route path="product_library/product_template/add" element={<ProductTemplateAdd/>} />
            <Route path="product_library/product_template/edit/:id" element={<ProductTemplateEdit/>} />
            <Route path="product_library/brands" element={<BrandsTablePage />} />
            <Route path="product_library/brands/add" element={<BrandsPageAddLayout />} />
            <Route path="product_library/brands/edit/:id" element={<BrandsPageEditLayout />} />
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
            {/* procurement library roUts */}
            <Route path="procurement/purchase-request" element={<PurchaseRequestTableLayoutPage/>}/>
            <Route path="procurement/purchase-request/add" element={<PurchaseRequestAdd/>} />
            <Route path="procurement/purchase-request/edit/:id" element={<PurchaseRequestEdit/>}/>
            <Route path="procurement/po-quotations" element={<PoOperationTableLayout/>}/>
            <Route path="procurement/po-quotations/add" element={<PoOperationAddPageLayout/>}/>
            <Route path="procurement/po-quotations/edit/:id" element={<PoOperationEditPageLayout/>}/>
            <Route path="procurement/purchase-orders/" element={<PurchaseOrderTableLayout/>}/>
            <Route path="procurement/purchase-orders/add" element={<PurchaseOrderAddLayout/>}/>
            <Route path="procurement/purchase-orders/edit/:id" element={<PurchaseOrderEditLayout/>}/>
            <Route path="procurement/goods-receipt" element={<GoodsReceiptsTableLayout/>}/>
            <Route path="procurement/goods-receipt/add" element={<GoodsReceiptsAddLayout/>}/>
            <Route path="procurement/goods-receipt/edit/:id" element={<GoodsReceiptsEditLayout/>}/>
            <Route path="procurement/supplier" element={<SupplierTableLayout/>}/>
            <Route path="procurement/supplier/add" element={<SupplierAddLayout/>}/>
            <Route path="procurement/supplier/edit/:id" element={<SupplierEditLayout/>}/>
                        {/* INVENTORY ROUTS */}
            <Route path="inventory/products" element={<ProductsTableLayout/>}/>
                        {/* CRM ROUTS */}
            <Route path="crm/contacts" element={<ContactsTableLayoutPage/>}/>
            <Route path="crm/contacts/add" element={<ContactsAddLayoutPage/>}/>
            <Route path="crm/contacts/edit/:id" element={<ContactsEditLayout/>}/>
            <Route path="crm/leads" element={<LeadsTableLayoutPage/>}/>
            <Route path="crm/leads/add" element={<LeadsLayoutAddPage/>}/>
            <Route path="crm/leads/edit/:id" element={<LeadsLayoutEditPage/>}/>
            <Route path="crm/quotations" element={<QuotationsTableLayoutPage/>}/>
            <Route path="crm/sales-orders" element={<SalesOrdersTableLayoutPage/>}/>
            <Route path="crm/dispatch-orders" element={<DispatchOrdersTableLayoutPage/>}/>
            <Route path="crm/dispatch-orders/add" element={<DispatchOrdersAddLayoutPage/>}/>
            <Route path="crm/dispatch-orders/edit/:id" element={<DispatchOrdersEditLayoutPageDis/>}/>
            <Route path="crm/quotations/add" element={<QuotationsAddLayoutPage/>}/>
            <Route path="crm/quotations/edit/:id" element={<QuotationsEditLayoutPage/>}/>
            <Route path="crm/sales-orders/add" element={<SalesOrdersAddLayoutPage/>}/>
            <Route path="crm/sales-orders/edit/:id" element={<SalesOrdersEditLayoutPage/>}/>
                        {/* OPERATIONS ROUTES */}
            <Route path="operations/delivery-challan" element={<DeliveryChallanTablePage/>}/>
            <Route path="operations/delivery-challan/add" element={<DeliveryChallanAddPage/>}/>
            <Route path="operations/delivery-challan/edit/:id" element={<DeliveryChallanEditPageDe/>}/>
            <Route path="operations/invoices" element={<InvoicesTablePage/>}/>
            <Route path="operations/invoices/add" element={<InvoicesAddPage/>}/>
            <Route path="operations/invoices/edit/:id" element={<InvoicesEditPage/>}/>
            <Route path="operations/grn" element={<GrmTablePageLayout/>}/>
            <Route path="operations/grn/add" element={<GrmAddPageLayoutOpe/>}/>
            <Route path="operations/grn/edit/:id" element={<GrmEditPageLayoutOpe/>}/>
            <Route path="operations/asset-modification-tracker" element={<AssetModificationTrackerTableOperations/>}/>
            <Route path="operations/credit-note" element={<CreditNoteTablePageLayout/>}/>
            <Route path="operations/credit-note/add" element={<CreditNoteAddPageLayout/>}/>
            <Route path="operations/service" element={<ServiceTablePageOper/>}/>
            <Route path="operations/service/add" element={<ServiceAddPageOper/>}/>
            <Route path="operations/service/edit/:id" element={<ServiceEditPageOper/>}/>
            <Route path="operations/client-journey" element={<ClientJourneyPageLayout/>}/>
                        {/* CLIENT ROUTES*/}
            <Route path="client/clients" element={<ClinetTablePageLayoutCli/>}/>
            <Route path="client/clients/add" element={<ClinetAddPageLayout/>}/>
            <Route path="client/clients/edit/:id" element={<ClinetEditPageLayout/>}/>
                        {/* settings ROUTES*/}
            <Route path="settings/user" element={<UserTablePageLayout/>}/>
            <Route path="settings/user/add" element={<UserAddPageLayout/>}/>
            <Route path="settings/user/edit/:id" element={<UserEditPageLayout/>}/>
            <Route path="settings/branches" element={<BranchesTablePageLayout/>}/>
            <Route path="settings/branches/Add" element={<BranchesAddPageLayout/>}/>
            <Route path="settings/branches/edit/:id" element={<BranchesEditPageLayout/>}/>
            <Route path="settings/department" element={<DepartmentTablePage/>}/>
            <Route path="settings/department/add" element={<DepartmentAddPageLayout/>}/>
            <Route path="settings/department/edit/:id" element={<DepartmentEditPageLayoutDept/>}/>
            <Route path="settings/Roles" element={<RolesTablePage/>}/>
            <Route path="settings/Roles/Add" element={<RolesAddPageLayout/>}/>


          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default RoutesConfig;