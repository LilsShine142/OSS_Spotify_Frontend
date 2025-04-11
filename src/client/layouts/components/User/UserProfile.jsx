import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal, Pencil, Copy } from "lucide-react";
import { assets, artists } from "@/assets/assets";
import PlaylistBox from "@/components/BoxCard/PlaylistBox";
import CustomScrollbar from "../../../../components/Scrollbar/CustomScrollbar";
const UserProfile = () => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const [hoverIndex, setHoverIndex] = useState(null);
  const variant = "artist"; // Gắn variant = artist tạm thời vì đang set ở bên boxcard

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <CustomScrollbar className="w-full bg-gradient-to-b from-[#af4300] to-[#121212] text-white h-[80vh] p-6 rounded-md">
      {/* Profile Header */}
      <div className="mb-10 relative">
        <div className="flex items-end gap-6">
          <div className="relative">
            <img
              src={assets.avatar}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-4 border-[#121212]"
            />
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="absolute bottom-0 right-0 bg-black/60 hover:bg-black/80 rounded-full p-1 overflow-hidden hidden sm:block"
            >
              <MoreHorizontal className="w-5 h-5 text-white" />
            </button>

            {showMenu && (
              <div
                ref={menuRef}
                className="absolute top-full left-0 mt-2 w-56 bg-[#282828] text-white rounded-md shadow-lg z-20"
              >
                <Link
                  to="/user/edit"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[#3e3e3e] cursor-pointer"
                >
                  <Pencil size={16} /> Chỉnh sửa hồ sơ
                </Link>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Đã sao chép liên kết!");
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-[#3e3e3e]"
                >
                  <Copy size={16} /> Sao chép đường liên kết đến hồ sơ
                </button>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold">Hồ sơ</p>
            <h1 className="text-5xl font-bold tracking-tight mb-2">
              Phạm Thanh Sự
            </h1>
            <div className="flex items-center gap-2 text-sm text-[#b3b3b3] font-semibold">
              <p>12 danh sách phát công khai</p>
              <span>•</span>
              <p className="text-white">1 người theo dõi</p>
              <span>•</span>
              <p className="text-white">14 đang theo dõi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Artists */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Nghệ sĩ hàng đầu tháng này</h2>
          <span className="text-sm text-[#b3b3b3] hover:text-white cursor-pointer">
            Hiện tất cả
          </span>
        </div>
        <p className="text-sm text-[#b3b3b3] mb-4 font-semibold">
          Chỉ hiển thị với bạn
        </p>
        <div className="flex gap-6">
          {artists.map((artist, index) => (
            // Ẩn icon không hiện đủ hết độ rộng, đang set cứng width cho mỗi artist
            <div className="min-w-[120px] shrink-0 mr-4">
              <PlaylistBox
                playlist={artist}
                variant={variant}
                index={index}
                hoverIndex={hoverIndex}
                setHoverIndex={setHoverIndex}
              />
            </div>
          ))}
        </div>
      </div>
    </CustomScrollbar>
  );
};

export default UserProfile;
