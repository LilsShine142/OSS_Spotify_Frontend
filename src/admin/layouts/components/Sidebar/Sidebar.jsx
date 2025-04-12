import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  FiMusic,
  FiDisc,
  FiMic,
  FiList,
  FiUsers,
  FiCheckCircle,
  FiDollarSign,
  FiBarChart2,
  FiTrendingUp,
  FiMap,
  FiSettings,
  FiFileText,
  FiChevronDown,
  FiChevronRight,
  FiShield,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import CustomScrollbar from "../../../../components/Scrollbar/CustomScrollbar";
import { assets } from "@/assets/assets";

export default function AdminSidebar() {
  const [openGroup, setOpenGroup] = useState("");
  const sidebarRef = useRef(null);

  const toggleGroup = (label) => {
    setOpenGroup((prev) => (prev === label ? "" : label));
  };
  // Đóng menu nếu click ra ngoài sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setOpenGroup("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // Gắn tạm thời menu, khi nào chốt lại thì sẽ sửa lại
  const menuItems = [
    {
      group: "Quản lý nội dung",
      items: [
        {
          icon: <FiMusic />,
          label: "Bài hát",
          sub: [
            { label: "Tất cả bài hát", path: "/tracks" },
            { label: "Tạo mới", path: "/tracks/new" },
          ],
        },
        {
          icon: <FiDisc />,
          label: "Album",
          sub: [
            { label: "Tất cả album", path: "/albums" },
            { label: "Tạo album", path: "/albums/new" },
          ],
        },
        {
          icon: <FiMic />,
          label: "Nghệ sĩ",
          sub: [
            { label: "Danh sách nghệ sĩ", path: "/artists" },
            { label: "Thêm nghệ sĩ", path: "/artists/new" },
          ],
        },
        {
          icon: <FiList />,
          label: "Playlist",
          sub: [
            { label: "Tất cả playlists", path: "/playlists" },
            { label: "Tạo playlist", path: "/playlists/new" },
          ],
        },
      ],
    },
    {
      group: "Người dùng & Giao dịch",
      items: [
        {
          icon: <FiUsers />,
          label: "Người dùng",
          sub: [
            { label: "Danh sách người dùng", path: "/users" },
            { label: "Tạo người dùng", path: "/users/new" },
          ],
        },
        {
          icon: <FiCheckCircle />,
          label: "Xác thực nghệ sĩ",
          sub: [{ label: "Yêu cầu xác thực", path: "/artist-verification" }],
        },
        {
          icon: <FiDollarSign />,
          label: "Thanh toán & Premium",
          sub: [
            { label: "Đăng ký Premium", path: "/subscriptions" },
            { label: "Lịch sử giao dịch", path: "/transactions" },
          ],
        },
      ],
    },
    {
      group: "Phân tích & Báo cáo",
      items: [
        {
          icon: <FiBarChart2 />,
          label: "Thống kê người dùng",
          sub: [{ label: "Tổng quan", path: "/stats/users" }],
        },
        {
          icon: <FiTrendingUp />,
          label: "Lượt nghe & Xu hướng",
          sub: [
            { label: "Bài hát phổ biến", path: "/stats/tracks" },
            { label: "Xu hướng nghe", path: "/stats/trends" },
          ],
        },
      ],
    },
    {
      group: "Hệ thống",
      items: [
        {
          icon: <FiSettings />,
          label: "Cài đặt hệ thống",
          sub: [{ label: "Cấu hình chung", path: "/settings" }],
        },
        {
          icon: <FiShield />,
          label: "Quản lý quyền",
          sub: [{ label: "Phân quyền", path: "/permissions" }],
        },
      ],
    },
  ];

  return (
    <div
      ref={sidebarRef}
      className="w-64 h-screen bg-black text-gray-300 flex flex-col"
    >
      {/* Tiêu đề sidebar */}
      <div className="p-5 pb-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">Spotify Admin</h1>
      </div>
      {/* Danh sách menu với scroll tùy chỉnh */}
      <CustomScrollbar className="flex-1 py-4">
        {menuItems.map((group) => (
          <div key={group.group} className="mb-4">
            <h3 className="px-5 py-2 text-xs uppercase text-gray-500 tracking-wider">
              {group.group}
            </h3>
            <ul>
              {group.items.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => toggleGroup(item.label)}
                    className={`w-full flex items-center justify-between px-5 py-2.5 mx-2 rounded-md
                      transition-colors duration-200 hover:bg-gray-800 hover:text-white
                      ${
                        openGroup === item.label
                          ? "bg-gray-800 text-green-500"
                          : "text-gray-400"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 text-left">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {openGroup === item.label ? (
                      <FiChevronDown className="text-sm" />
                    ) : (
                      <FiChevronRight className="text-sm" />
                    )}
                  </button>
                  {/* Menu con (sub-menu) có hiệu ứng mở rộng */}
                  <AnimatePresence initial={false}>
                    {openGroup === item.label && (
                      <motion.ul
                        key={item.label}
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                          open: { opacity: 1, height: "auto" },
                          collapsed: { opacity: 0, height: 0 },
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="ml-12 mt-1 overflow-hidden"
                      >
                        {item.sub.map((subItem) => (
                          <li key={subItem.path}>
                            <NavLink
                              to={subItem.path}
                              className={({ isActive }) => `
                                block text-sm px-3 py-1 rounded hover:bg-gray-700 transition-colors
                                ${isActive ? "text-green-400" : "text-gray-400"}
                              `}
                            >
                              {subItem.label}
                            </NavLink>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CustomScrollbar>
      {/* Phần avatar + tên người dùng bên dưới sidebar */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center">
          {/* Lấy avatar từ tài khoản đang đăng nhập */}
          <img
            src={assets.avatar}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="ml-3 text-sm">{"Admin"}</span>
        </div>
      </div>
    </div>
  );
}
