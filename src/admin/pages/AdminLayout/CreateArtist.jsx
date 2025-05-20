import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateArtist() {
  const [artistName, setArtistName] = useState("");
  const [biography, setBiography] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [label, setLabel] = useState("");
  const [isFromDB, setIsFromDB] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!artistName.trim()) {
      alert("Tên nghệ sĩ không được để trống!");
      return;
    }

    const token = JSON.parse(localStorage.getItem("userData"))?.token;
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      navigate("/login");
      return;
    }

    const payload = {
      artist_name: artistName,
      biography,
      profile_img: profileImg || null, // Gửi null nếu không có ảnh
      label: label || null,
      isfromDB: isFromDB,
      isHidden: isHidden,
    };

    setLoading(true);
    try {
      await axios.post(
        "http://127.0.0.1:8000/spotify_app/artists/create",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Thêm nghệ sĩ thành công!");
      navigate("/admin/artists");
    } catch (error) {
      console.error("Error creating artist:", error.response);
      alert(error.response?.data?.message || "Thêm nghệ sĩ thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white max-w-md mx-auto">
      <h1 className="text-3xl mb-6 font-bold">Thêm Nghệ sĩ mới</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-[#121212] backdrop-blur-md p-8 rounded-lg flex flex-col gap-6"
      >
        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Tên nghệ sĩ
          <input
            type="text"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            className="p-3 rounded bg-[#282828] text-white placeholder-gray-400 border border-gray-700 focus:border-green-500 outline-none transition"
            placeholder="Nhập tên nghệ sĩ"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Mô tả
          <textarea
            rows={4}
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            className="p-3 rounded bg-[#282828] text-white placeholder-gray-400 border border-gray-700 focus:border-green-500 outline-none transition"
            placeholder="Mô tả ngắn về nghệ sĩ"
          />
        </label>

        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Ảnh đại diện (URL)
          <input
            type="url"
            value={profileImg}
            onChange={(e) => setProfileImg(e.target.value)}
            className="p-3 rounded bg-[#282828] text-white placeholder-gray-400 border border-gray-700 focus:border-green-500 outline-none transition"
            placeholder="Nhập URL ảnh đại diện"
          />
        </label>

        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Nhãn (Label)
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="p-3 rounded bg-[#282828] text-white placeholder-gray-400 border border-gray-700 focus:border-green-500 outline-none transition"
            placeholder="Nhập nhãn (ví dụ: Mun)"
          />
        </label>

        <label className="flex items-center gap-2 text-gray-300 text-sm font-medium">
          <input
            type="checkbox"
            checked={isFromDB}
            onChange={(e) => setIsFromDB(e.target.checked)}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-700 rounded"
          />
          Từ cơ sở dữ liệu
        </label>

        <label className="flex items-center gap-2 text-gray-300 text-sm font-medium">
          <input
            type="checkbox"
            checked={isHidden}
            onChange={(e) => setIsHidden(e.target.checked)}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-700 rounded"
          />
          Ẩn nghệ sĩ
        </label>

        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin/artists")}
            className="text-gray-400 hover:text-white transition"
          >
            Hủy
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-6 py-3 rounded-full font-semibold transition"
          >
            {loading ? "Đang tạo..." : "Thêm nghệ sĩ"}
          </button>
        </div>
      </form>
    </div>
  );
}