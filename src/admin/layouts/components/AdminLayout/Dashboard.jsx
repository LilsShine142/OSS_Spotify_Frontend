// admin/layouts/AdminLayout.jsx
import Sidebar from "../Sidebar/Sidebar";
import MainContent from "../MainContent/MainContent";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <MainContent />
    </div>
  );
}
