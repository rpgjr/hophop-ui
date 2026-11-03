import Applications from "../../pages/Applications";
import Home from "../../pages/Homepage";
import Settings from "../../pages/Settings";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";

export default function Layout() {
  return (
    <div className="drawer lg:drawer-open">
      <input
        id="my-drawer-4"
        type="checkbox"
        className="drawer-toggle inline"
      />
      <div className="drawer-content">
        {/* Navbar */}
        <Navbar />
        {/* Page content here */}
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/applications" element={<Navigate to="/" replace />} />
            <Route path="/applications/:date" element={<Applications />} />
          </Routes>
        </div>
      </div>

      <Sidebar />
    </div>
  );
}
