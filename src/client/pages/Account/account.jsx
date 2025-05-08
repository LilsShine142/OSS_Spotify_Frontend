import { assets } from "@/assets/assets";
import FooterMain from "@/client/layouts/components/Footer/FooterMain";
import React from "react";
import { useState } from "react";
import {
  Diamond,
  Menu,
  ArrowDownward,
  KeyboardArrowDown,
} from "@mui/icons-material";
import AccountHeader from "@/client/layouts/components/Account/AccountHeader";
import { useNavigate } from "react-router-dom";
function account() {
  const [isFocused, setIsFocused] = useState(false);

  const navigate = useNavigate();

  const sections = [
    {
      title: "Tài khoản",
      options: [
        { name: "Quản lý gói đăng ký", link: "/account/subscription" },
        { name: "Chỉnh sửa hồ sơ", link: "/account/profile" },
        {
          name: "Khôi phục danh sách phát",
          link: "/account/recover-playlists",
        },
      ],
    },
    {
      title: "Thanh toán",
      options: [
        { name: "Lịch sử đặt hàng", link: "/account/orders" },
        { name: "Thẻ thanh toán đã lưu", link: "/account/payment-methods" },
        { name: "Đổi", link: "/account/change" },
      ],
    },
    {
      title: "Bảo mật và quyền riêng tư",
      options: [
        { name: "Quản lý ứng dụng", link: "/account/apps" },
        { name: "Cài đặt thông báo", link: "/account/notifications" },
        { name: "Quyền riêng tư của tài khoản", link: "/account/privacy" },
        {
          name: "Chỉnh sửa các phương thức đăng nhập",
          link: "/account/login-methods",
        },
        {
          name: "Đặt mật khẩu trên thiết bị",
          link: "/account/device-password",
        },
        { name: "Đăng xuất ở mọi nơi", link: "/account/logout-everywhere" },
      ],
    },
    {
      title: "Trợ giúp",
      options: [{ name: "Nhóm hỗ trợ của Spotify", link: "/support" }],
    },
  ];

  return (
    <div className="w-full min-h-screen bg-red-500">
      {/* Header */}
      <AccountHeader />

      {/* Main Content */}
      <div className="h-auto bg-[#121212] flex flex-col items-center justify-center">
        <div className="w-full max-w-[800px] h-auto py-6 px-4 space-y-4">
          {/* Search Bar */}
          <div className="w-full flex border-2 border-gray-500 rounded-lg bg-[#2A2A2A] hover:border-white ">
            <img className="w-10 h-10 p-2" src={assets.search_icon} alt="" />
            <input
              className="w-full bg-[#2A2A2A] text-white px-2 outline-none rounded-lg"
              placeholder="Tìm kiếm tài khoản hoặc bài viết trợ giúp"
              type="text"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <img
              className={`w-10 h-10 p-2 ${
                isFocused ? "opacity-100" : "opacity-0"
              }`}
              src={assets.arrow_left}
              alt=""
            />
          </div>

          {/* Subscription Box */}
          <div className="w-full flex gap-2  text-white h-[160px]">
            <div className="relative w-full max-w-[67%] h-full bg-[#2A2A2A] rounded-lg p-3 hover:bg-[#404040]">
              <label className="text-sm">Gói của bạn</label>
              <br />
              <label className="text-3xl font-semibold">Spotify Free</label>
              <img
                className="absolute top-5 right-5 w-6 h-6"
                src={assets.spotify_logo}
                alt=""
              />
              <label className="absolute right-5 bottom-5 border-2 text-sm border-gray-400 py-1 px-2 rounded-full cursor-pointer hover:bg-gray-600">
                Tìm hiểu các gói
              </label>
            </div>
            <div className="w-[33%] h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex flex-col items-center justify-center">
              <Diamond />
              <label className="cursor-pointer ">Dùng Premium</label>
            </div>
          </div>

          {/* Các phần Account, Thanh toán, Bảo mật, Trợ giúp */}
          {sections.map((section, index) => (
            <div
              key={index}
              className="h-auto bg-[#2A2A2A] p-3 space-y-0 text-white rounded-lg"
            >
              <h2 className="text-2xl font-semibold">{section.title}</h2>
              <br />
              {section.options.map((option, i) => (
                <div
                  key={i}
                  className="flex justify-between hover:bg-[#404040] px-2 py-3 rounded-lg items-center cursor-pointer"
                  onClick={() => navigate(option.link)}
                >
                  <div className="flex items-center space-x-2 ">
                    <img
                      className="w-7 h-7 bg-gray-700 p-1 rounded-lg"
                      src={assets.search_icon}
                      alt=""
                    />
                    <label className="cursor-pointer">{option.name}</label>
                  </div>
                  <img className="w-5 h-5" src={assets.arrow_right} alt="" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Footer */}
      <div className="w-full">
        <FooterMain />
      </div>
    </div>
  );
}

export default account;
