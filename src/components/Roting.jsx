

import { Route, Routes, HashRouter } from "react-router-dom";
import { Nav } from "./Nav";


import '../App.css';
import Footer from "./footer";
import { useEffect } from "react";
import StatusListView from "./Request Status/StatusListView";
import AllSearchScreen from "./SearchAndFilterScreen/AllSearchScreen";
import SavedItemsScreen from "./SavedItemsScreen/SavedItemsScreen";

function ExternalRedirect({ url }) {
  useEffect(() => {
    window.location.href = url;
  }, [url]);
  return null;
}

export const Routing = () => {
  return (
    <HashRouter>
      <Nav/>
     
      <Routes>
        <Route path="/StatusListView" element={<StatusListView />} />
{/*         <Route path="/" element={<AllSearchScreen />} /> */}
        <Route path="/SearchAppBar" element={<AllSearchScreen />} />
        <Route path="/SavedItemsScreen" element={<SavedItemsScreen />} />
        <Route path='/ActivityLog' element={<ExternalRedirect url="https://login.foirstein.diversitech.co.il/#/ActivityLog" />} />
        <Route path='/Charts' element={<ExternalRedirect url="https://login.foirstein.diversitech.co.il/#/Charts" />} />
        <Route path='/changePermission' element={<ExternalRedirect url="https://login.foirstein.diversitech.co.il/#/changePermission" />} />
        <Route path='/UserManagementComponent' element={<ExternalRedirect url="https://login.foirstein.diversitech.co.il/#/UserManagementComponent" />} />
        <Route path='/login' element={<ExternalRedirect url="https://login.foirstein.diversitech.co.il/#/login" />} />
        <Route path='/profile' element={<ExternalRedirect url="https://login.foirstein.diversitech.co.il/#/profile" />} />
        <Route path='/profileform' element={<ExternalRedirect url="https://login.foirstein.diversitech.co.il/#/profileform" />} />
        <Route path='/ManagerDashboard' element={<ExternalRedirect url="https://login.foirstein.diversitech.co.il/#/ManagerDashboard" />} />
        <Route path='/view-reports' element={<ExternalRedirect url="https://login.foirstein.diversitech.co.il/#/view-reports" />} />
        <Route path='/report/:reportId' element={<ExternalRedirect url="https://login.foirstein.diversitech.co.il/#/report/" />} />
        <Route path='login/register' element={<ExternalRedirect url="https://login.foirstein.diversitech.co.il/#/login" />} />
        <Route path='login/security-question' element={<ExternalRedirect url="https://login.foirstein.diversitech.co.il/#/login" />} />
        <Route path='/reset-password' element={<ExternalRedirect url="https://login.foirstein.diversitech.co.il/#/login" />} />
        <Route path='/password-reset-success' element={<ExternalRedirect url="https://login.foirstein.diversitech.co.il/#/login" />} />
        <Route path='login/security-question/reset-password/password-reset-success/login' element={<ExternalRedirect url="https://login.foirstein.diversitech.co.il/#/login" />} />
        <Route path='login/security-question/reset-password/password-reset-success/login/home' element={<ExternalRedirect url="https://login.foirstein.diversitech.co.il/#/login" />} />
        <Route path='/passwordRecovery' element={<ExternalRedirect url="https://login.foirstein.diversitech.co.il/#/login" />} />
        <Route path='/items' element={<ExternalRedirect url="https://librarian.foirstein.diversitech.co.il/#/items" />} />
        <Route path='/itemsPendingApproval' element={<ExternalRedirect url="https://librarian.foirstein.diversitech.co.il/#/itemsPendingApproval" />} />
        <Route path='/studentRequest' element={<ExternalRedirect url="https://librarian.foirstein.diversitech.co.il/#/studentRequest" />} />
        <Route path='/tag-list' element={<ExternalRedirect url="https://librarian.foirstein.diversitech.co.il/#/tag-list" />} />
      </Routes>
      <Footer />
    </HashRouter>
  );
}
