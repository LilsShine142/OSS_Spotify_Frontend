import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { uploadToCloudinary } from "../../../services/CloudUploadService/CloudService";
import { updateArtist } from "../../../services/ArtistService/artistService";
import cookies from "js-cookie";

export default function EditArtist() {
  const [artistName, setArtistName] = useState("");
  const [biography, setBiography] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [label, setLabel] = useState("");
  const [isFromDB, setIsFromDB] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();
  const { artistId } = useParams();

  useEffect(() => {
    const fetchArtist = async () => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const token = userData?.token;
      if (!token) {
        alert("Bạn chưa đăng nhập!");
        navigate("/login");
        return;
      }

      console.log("Fetching artist with ID:", artistId);
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/spotify_app/artists/${artistId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Artist data:", res.data);
        const artist = res.data;
        setArtistName(artist.artist_name || "");
        setBiography(artist.biography || "");
        setProfileImg(artist.profile_img || "");
        setLabel(artist.label || "");
        setIsFromDB(artist.isfromDB !== false);
        setIsHidden(artist.isHidden || false);
      } catch (error) {
        const errorMsg =
          error.response?.data?.error || "Lấy dữ liệu nghệ sĩ thất bại.";
        alert(errorMsg);
        console.error("Error fetching artist:", error.response);
        navigate("/admin/artists");
      } finally {
        setFetching(false);
      }
    };

    fetchArtist();
  }, [artistId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // const token = cookies.get("access_token");
    // Tạm thời sử dụng localStorage để lấy token
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      navigate("/login");
      return;
    }
    try {
      let imageUrl = profileImg;

      // Nếu profileImg là một file mới chọn (File object)
      if (profileImg instanceof File) {
        imageUrl = await uploadToCloudinary(profileImg, (progress) => {
          console.log("Upload progress:", progress);
        });
      }

      // Payload gửi lên API của bạn (JSON)
      const payload = {
        _id: artistId,
        artist_name: artistName,
        biography: biography,
        label: label,
        isHidden: isHidden,
        isfromDB: isFromDB,
        profile_img: imageUrl,
      };

      console.log("Update payload:", payload);

      const response = await updateArtist(payload, token);
      console.log("Cập nhật thành công:", response.data);
      navigate("/admin/artists");
    } catch (error) {
      console.error("Error updating artist:", error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-6 text-white text-center">Đang tải dữ liệu...</div>
    );
  }

  return (
    <div className="p-6 text-white max-w-md mx-auto">
      <h1 className="text-3xl mb-6 font-bold">Chỉnh sửa Nghệ sĩ</h1>
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
          Ảnh đại diện (tải lên)
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setProfileImg(file); // Giữ file trong state
              }
            }}
            className="p-3 rounded bg-[#282828] text-white placeholder-gray-400 border border-gray-700 focus:border-green-500 outline-none transition"
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
            {loading ? "Đang cập nhật..." : "Cập nhật nghệ sĩ"}
          </button>
        </div>
      </form>
    </div>
  );
}
