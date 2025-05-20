import React, { useState, useRef, useEffect, useContext } from "react";
import { assets } from "../../../../assets/assets";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaIdCard,
  FaCrown,
  FaQuestionCircle,
  FaDownload,
  FaCog,
  FaSignOutAlt,
  FaComments,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setActiveContent } from "../../../../redux/features/activeContent/activeContentSlice";
import { getUserInfo } from "@/services/userService"; // nếu nó có tồn tại trong service
import { UserContext } from "@/context/AuthContext/AuthContext";
import Cookies from "js-cookie";
import ChatSection from "../Chat/ChatSection";
import { toast } from "react-toastify";

const Header = () => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user } = useContext(UserContext); // Lấy user từ context
  const [detailedUser, setDetailedUser] = useState(null); // Thông tin chi tiết của user
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = 1; // Gắn userId tạm thời

  // Đóng dropDown khi click ra ngoài
  useEffect(() => {
    const token = Cookies.get("access_token");
    // if (!token) {
    //   navigate("/login");
    //   return;
    // }
    const userData = JSON.parse(localStorage.getItem("userData"));

    setDetailedUser(userData);
    // const fetchUserData = async (token) => {
    //   console.log("userData:", userData);
    //   if (userData && userData.user.data._id) {
    //     try {
    //       const response = await getUserInfo(user.id, token);
    //       console.log("Response from API:", response);
    //       if (response.success) {
    //         setDetailedUser(response.user);
    //         console.log("User info:", response.user);
    //         console.log("detailedUser:", detailedUser);
    //         console.log(response.user);
    //       } else {
    //         // Xử lý trường hợp lỗi khi lấy data
    //         console.error("Lấy thông tin user thất bại");
    //       }
    //     } catch (error) {
    //       console.error("Lỗi khi gọi API lấy user info:", error);
    //     }
    //   }
    // };

    // fetchUserData(token);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropDownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropDownToggle = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const handleMenuClick = (contentType) => {
    dispatch(setActiveContent(contentType)); // Lưu trạng thái nội dung được chọn
    setIsDropDownOpen(false);
    navigate(contentType); // chỉ dùng nếu `contentType` là đường dẫn hợp lệ
  };

  const handleChatToggle = () => {
    if (!detailedUser?.user?.data) {
      toast.warning("Please login to use chat feature");
      navigate("/login");
      return;
    }
    setIsChatOpen(!isChatOpen);
  };

  // Menu Bar
  const menuSections = [
    {
      title: "user-info",
      content: {
        text: detailedUser?.user.data.name,
        type: "text",
      },
    },
    {
      title: "main-menu",
      // Sửa lại link khi làm xong các trang còn thiếu trong đây
      items: [
        { title: "Tài khoản", link: "/account", icon: <FaUser /> },
        {
          title: "Hồ sơ",
          link: `/user/profile/${detailedUser?.user.data._id}`,
          icon: <FaIdCard />,
        }, // Gắn userId tạm thời
        { title: "Nâng cấp Premium", link: "/premium", icon: <FaCrown /> },
        { title: "Hỗ trợ", link: "/support", icon: <FaQuestionCircle /> },
        { title: "Tải xuống", link: "/download", icon: <FaDownload /> },
        { title: "Cài đặt", link: "/settings", icon: <FaCog /> },
      ],
    },
    {
      title: "logout-section",
      items: [{ title: "Đăng xuất", link: "/login", icon: <FaSignOutAlt /> }],
    },
  ];

  return (
    <div className="bg-[#121212] w-full h-[9%] flex items-center justify-between px-8">
      {/* Logo Spotify */}
      <div className="flex items-center gap-3 cursor-pointer w-1/6 h-full">
        <img
          className="w-8"
          src={detailedUser?.user.data.profile_pic || assets.spotify_logo}
          alt={
            detailedUser?.user.data.name
              ? `${detailedUser.user.data.name} Profile Picture`
              : "Spotify Logo"
          }
        />
      </div>
      {/* Thanh tìm kiếm */}
      <div className="flex flex-1 justify-center items-center max-w-2xl h-full gap-2 pl-[145px]">
        <div className="relative group">
          {/* Nút Home */}
          <div className="flex items-center cursor-pointer hover:bg-slate-700 rounded-full p-2 bg-gray-800 hover:scale-110 transition-transform">
            <img className="w-6" src={assets.home_icon} alt="Home" />
          </div>
          {/* Tooltip */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-12 opacity-0 scale-90 
    group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 delay-200 ease-out 
    bg-slate-800 text-white text-xs px-3 py-1 rounded-md shadow-lg whitespace-nowrap z-[999]"
          >
            Trang chủ
          </div>
        </div>

        {/* Ô tìm kiếm */}
        <div
          className="flex flex-grow max-w-xl bg-[#242424] px-5 py-2 rounded-full items-center border-transparent 
  group focus-within:ring-1 focus-within:ring-white hover:bg-gray-700 hover:ring-1 hover:ring-gray-700 transition"
        >
          <img
            className="w-5 opacity-50 group-hover:opacity-100 transition"
            src={assets.search_icon}
            alt="Search"
          />

          <input
            type="text"
            placeholder="Bạn muốn phát nội dung gì?"
            className="bg-transparent text-white text-sl font-semibold outline-none ml-2 flex-grow placeholder-gray-500 
      group-hover:placeholder-white transition"
          />

          {/* Dấu | và icon bên phải */}
          <div className="flex items-center gap-2 pl-2 border-l border-gray-500 h-5 ml-2">
            <img
              className="w-5 opacity-50 hover:opacity-100 transition cursor-pointer"
              src={assets.queue_icon}
              alt="More"
            />
          </div>
        </div>
      </div>

      {/* Nút Premium + Cài đặt + Avatar */}
      <div className="flex items-center gap-6 pr-[100px]">
        <button 
          className="bg-white text-black px-4 py-1 text-sm font-bold rounded-full hover:scale-110 transition-transform duration-200 hover:opacity-80"
          onClick={() => navigate('/premium')}
        >
          Khám phá Premium
        </button>
        <img
          className="w-4 cursor-pointer brightness-50 invert hover:invert-0 hover:brightness-100 hover:scale-110 transition-transform duration-200"
          src={assets.bell_icon}
          alt="Thông báo"
        />
        {/* Avatar với dropdown */}
        {/* Nếu đã đăng nhập */}
        {detailedUser ? (
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center cursor-pointer hover:bg-slate-700 rounded-full p-2 bg-gray-800 hover:scale-110 transition-transform"
              onClick={handleDropDownToggle}
            >
              <img
                className="w-8 h-8 rounded-full cursor-pointer"
                src={assets.avatar}
                alt="Avatar"
              />
            </div>

            {/* Dropdown menu */}
            {isDropDownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#282828] rounded-md shadow-lg py-1 z-50">
                {menuSections.map((section, sectionIndex) => (
                  <div key={`section-${sectionIndex}`}>
                    {/* Phần thông tin user */}
                    {section.title === "user-info" && (
                      <div className="px-4 py-2 relative border-b border-[#7c7c7c] border-opacity-50 mx-2">
                        <p className="text-sm font-semibold text-green-500">
                          Hello, {section.content.text}
                        </p>
                      </div>
                    )}

                    {/* Phần menu chính */}
                    {section.title === "main-menu" && (
                      <div className="py-1">
                        {section.items.map((item, itemIndex) => (
                          <div
                            key={`menu-item-${itemIndex}`}
                            onClick={() => handleMenuClick(item.link)}
                            className="flex items-center justify-between px-4 py-2 mx-2 text-sm text-white hover:bg-[#3E3E3E] hover:rounded-[2px] hover:underline transition-colors"
                          >
                            {item.title}
                            {item.icon}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Phần đăng xuất */}
                    {section.title === "logout-section" && (
                      <div className="py-1 relative border-t border-[#7c7c7c] border-opacity-50 mx-2">
                        {section.items.map((item, itemIndex) => (
                          <Link
                            key={`logout-item-${itemIndex}`}
                            to={item.link}
                            className="flex items-center justify-between px-4 py-2 text-sm text-white hover:bg-[#3E3E3E] hover:rounded-[2px] hover:underline transition-colors"
                          >
                            {item.title}
                            {item.icon}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Nếu chưa đăng nhập
          <div className="flex gap-4">
            <Link
              to="/register"
              className="text-white px-4 py-1 border border-white rounded-full text-sm hover:bg-white hover:text-black transition"
            >
              Đăng ký
            </Link>
            <Link
              to="/login"
              className="bg-white text-black px-4 py-1 text-sm font-bold rounded-full hover:scale-110 transition-transform duration-200 hover:opacity-80"
            >
              Đăng nhập
            </Link>
          </div>
        )}
        <button 
          className="text-white hover:text-green-500 transition-colors duration-200"
          onClick={handleChatToggle}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="hover:scale-110 transition-transform"
          >
            <path
              d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z"
              fill="currentColor"
            />
            <path
              d="M7 9H17V11H7V9ZM7 12H14V14H7V12Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      {/* Chat Section */}
      {isChatOpen && (
        <div className="fixed top-[9%] right-0 w-[800px] h-[91vh] bg-gradient-to-b from-[#0d1a2d] to-black shadow-lg z-50 border-l border-gray-700 overflow-y-auto overflow-x-hidden scrollbar-w-3 scrollbar scrollbar-thumb-gray-700 scrollbar-track-transparent">
      <ChatSection 
        userId={detailedUser?.user?.data?._id}
      />
        </div>
      )}
    </div>
  );
};

export default Header;
