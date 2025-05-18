// admin/layouts/AdminLayout.jsx
import Sidebar from "../../layouts/components/Sidebar/Sidebar";
import MainContent from "../../layouts/components/MainContent/MainContent";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <MainContent>
        <Outlet />
      </MainContent>
    </div>
  );
}

