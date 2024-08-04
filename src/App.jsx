import Home from "./pages/Home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserPage from "./pages/user/UserPage";
import LoginPage from "./pages/login/LoginPage";
import SecurityPage from "./pages/security/SecurityPage";
import Ticket from "./pages/ticket/Ticket";
import AdminRoutes from "./components/admin/AdminRoutes";
import Add from "./components/user/add/Add";
import { AuthProvider } from "./Authcontext";
import OrgPage from "./pages/org/OrgPage";
import HeadRoutes from "./components/Head/HeadRoutes";
import HoPage from "./pages/Ho/HoPage";
import HoUsersPage from "./pages/housers/HoUsersPage";
import BranchRoutes from "./components/branch/BranchRoutes";
import BmPage from "./pages/bm/BmPage";
import DeskPage from "./pages/Desk/DeskPage";
import Dashboard from "./pages/dashboard/Dashboard";
import StatPage from "./pages/hostat/StatPage";
import BmUserPage from "./pages/bm/user/BmUserPage";
import LogoutPage from "./pages/logout/LogoutPage";
import DashPage from "./pages/Ho/dashboard/DashPage";
import BmDashPage from "./pages/bm/dash/BmDashPage";
import BmStatPage from "./pages/bm/stat/BmStatPage";
import ClerkRoutes from "./components/clerk/ClerkRoutes";
import ClerkPage from "./pages/clerk/ClerkPage";
import ClerkDashPage from "./pages/clerk/dashboard/ClerkDashPage";
import DeskAssignPage from "./pages/bm/assignpage/DeskAssignPage";
import QueueMetricsPage from "./pages/bm/metricspage/QueueMetricsPage";
import QueuePage from "./pages/clerk/queue/QueuePage";
import WaitingPage from "./pages/clerk/queue/waiting/WaitingPage";
import CalledListPage from "./pages/clerk/queue/called/CalledListPage"
import RejectedListPage from "./pages/clerk/queue/rejected/RejectedListPage";
import AcceptedListPage from "./pages/clerk/queue/accepted/AcceptedListPage";
import ProcessingListPage from "./pages/clerk/queue/processing/ProcessingListPage";
import DisplayPage from "./pages/display/DisplayPage";
import Authenticator from "./Authenticator";

function App() {
  return (
    <>
      <AuthProvider>
        <Authenticator />
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/ticket-dispenser/:tenant_id" element={<SecurityPage />} />
            <Route path="/display/:tenant_id" element={<DisplayPage />} />
            <Route path="/ticket" element={<Ticket />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/admin/user" element={<UserPage />} />
            <Route path="/user/add" element={<Add />} />
            <Route path="/admin/org" element={<OrgPage />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/head-officer/*" element={<HeadRoutes />} />
            <Route
              path="/headquarters/:hqId/dashboard"
              element={<DashPage />}
            />
            <Route path="/headquarters/:hqId/branches" element={<HoPage />} />
            <Route path="/user/hq/:hqId/users" element={<HoUsersPage />} />
            <Route path="/overall-stats/:hqId" element={<StatPage />} />
            <Route path="/branch-manager/*" element={<BranchRoutes />} />
            <Route
              path="/branches/:branchId/dashboard"
              element={<BmDashPage />}
            />
            <Route path="/branches/:branchId/services" element={<BmPage />} />
            <Route path="/windows/:branchId" element={<DeskPage />} />
            <Route path="/branch/:branchId" element={<DeskAssignPage />} />
            <Route path="/branch/:branchId/users" element={<BmUserPage />} />
            <Route path="/branch/statistics" element={<BmStatPage />} />
            <Route
              path="/branch/:branchId/queuemetrics"
              element={<QueueMetricsPage />}
            />
            <Route path="/clerk/*" element={<ClerkRoutes />} />
            <Route path="/clerk/dashboard" element={<ClerkDashPage />} />
            <Route path="/clerk/:tenant_id" element={<ClerkPage />} />
            <Route path="/clerk/:tenant_id/queue" element={<QueuePage />} />
            <Route path="/waiting/:tenant_id/:window_id" element={<WaitingPage />} />
            <Route path="/called/:tenant_id/:window_id" element={<CalledListPage />} />
            <Route path="/processing/:tenant_id/:window_id" element={<ProcessingListPage />} />
            <Route path="/accepted/:tenant_id/:window_id" element={<AcceptedListPage />} />
            <Route path="/rejected/:tenant_id/:window_id" element={<RejectedListPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
