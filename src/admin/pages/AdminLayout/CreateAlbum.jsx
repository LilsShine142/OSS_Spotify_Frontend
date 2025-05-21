import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadToCloudinary } from "../../../services/CloudUploadService/CloudService";

export default function CreateAlbum() {
  const [albumName, setAlbumName] = useState("");
  const [artistId, setArtistId] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [totalTracks, setTotalTracks] = useState("");
  const [isfromDB, setIsfromDB] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingArtists, setFetchingArtists] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchArtists() {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const token = userData?.token;
      if (!token) {
        toast.error("Bạn chưa đăng nhập!");
        navigate("/login");
        return;
      }
      try {
        setFetchingArtists(true);
        const res = await axios.get("http://localhost:8000/spotify_app/artists", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.results || res.data || [];
        setArtists(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi tải nghệ sĩ:", error.response?.data);
        toast.error("Không thể tải danh sách nghệ sĩ. Vui lòng thử lại.");
      } finally {
        setFetchingArtists(false);
      }
    }
    fetchArtists();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra dữ liệu đầu vào
    if (!albumName.trim()) {
      toast.error("Tên album không được để trống!");
      return;
    }
    if (!artistId) {
      toast.error("Vui lòng chọn nghệ sĩ cho album!");
      return;
    }
    if (!releaseDate) {
      toast.error("Ngày phát hành không được để trống!");
      return;
    }
    if (totalTracks && totalTracks < 0) {
      toast.error("Số lượng bài hát không thể âm!");
      return;
    }
    if (coverFile && !coverFile.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh (jpg, png, ...)");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
    if (!token) {
      toast.error("Bạn chưa đăng nhập!");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("album_name", albumName);
    formData.append("artist", artistId);
    formData.append("release_date", releaseDate);
    formData.append("total_tracks", totalTracks || "0");
    formData.append("isfromDB", isfromDB);
    formData.append("isHidden", isHidden);

    // Xử lý ảnh bìa
    if (coverFile) {
      try {
        console.log("Uploading cover image to Cloudinary...");
        const imageUrl = await uploadToCloudinary(coverFile, (progress) => {
          console.log("Upload progress:", progress);
        });
        if (!imageUrl) {
          throw new Error("Upload ảnh thất bại: Không nhận được URL từ Cloudinary.");
        }
        console.log("Uploaded image URL:", imageUrl);
        formData.append("cover_img", imageUrl);
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        toast.error("Không thể upload ảnh bìa. Vui lòng thử lại.");
        setLoading(false);
        return;
      }
    }

    // Debug FormData
    for (let [key, value] of formData.entries()) {
      console.log(`FormData: ${key} =`, value);
    }

    setLoading(true);
    try {
      console.log("Sending request to create album...");
      const res = await axios.post(
        "http://localhost:8000/spotify_app/albums/create/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Không cần set Content-Type, axios tự động xử lý cho FormData
          },
        }
      );
      console.log("Create album response:", res.data);
      toast.success("Tạo album thành công!");
      navigate("/admin/albums");
    } catch (error) {
      let errorMsg = "Tạo album thất bại.";
      if (error.response?.data) {
        if (error.response.data.error) {
          errorMsg = error.response.data.error;
        } else if (error.response.data.details) {
          errorMsg = Object.entries(error.response.data.details)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`)
            .join("; ");
        }
      }
      console.error("Error creating album:", error.response?.data);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">Tạo Album mới</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-[#121212] p-8 rounded-lg flex flex-col gap-6"
      >
        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Tên album
          <input
            type="text"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            placeholder="Nhập tên album"
            required
            disabled={loading}
            className="p-3 rounded bg-[#282828] text-white border border-gray-700 placeholder-gray-400 focus:border-green-500 outline-none transition"
          />
        </label>

        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Nghệ sĩ
          <select
            value={artistId}
            onChange={(e) => setArtistId(e.target.value)}
            required
            disabled={loading || fetchingArtists}
            className="p-3 rounded bg-[#282828] text-white border border-gray-700 focus:border-green-500 outline-none transition"
          >
            <option value="">-- Chọn nghệ sĩ --</option>
            {fetchingArtists ? (
              <option disabled>Đang tải...</option>
            ) : artists.length > 0 ? (
              artists.map((artist) => (
                <option key={artist._id} value={artist._id}>
                  {artist.artist_name || "Không tên"}
                </option>
              ))
            ) : (
              <option disabled>Không có nghệ sĩ</option>
            )}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Ngày phát hành
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            required
            disabled={loading}
            className="p-3 rounded bg-[#282828] text-white border border-gray-700 focus:border-green-500 outline-none transition"
          />
        </label>

        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Số lượng bài hát
          <input
            type="number"
            value={totalTracks}
            onChange={(e) => setTotalTracks(e.target.value)}
            placeholder="Nhập số lượng bài hát"
            min="0"
            disabled={loading}
            className="p-3 rounded bg-[#282828] text-white border border-gray-700 focus:border-green-500 outline-none transition"
          />
        </label>

        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Từ cơ sở dữ liệu
          <input
            type="checkbox"
            checked={isfromDB}
            onChange={(e) => setIsfromDB(e.target.checked)}
            disabled={loading}
            className="h-5 w-5 text-green-600"
          />
        </label>

        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Ẩn album
          <input
            type="checkbox"
            checked={isHidden}
            onChange={(e) => setIsHidden(e.target.checked)}
            disabled={loading}
            className="h-5 w-5 text-green-600"
          />
        </label>

        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Ảnh bìa (jpg, png, ...)
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files[0])}
            disabled={loading}
            className="text-white"
          />
        </label>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/albums")}
            disabled={loading}
            className="text-gray-400 hover:text-white transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-6 py-3 rounded-full font-semibold transition"
          >
            {loading ? "Đang tạo..." : "Tạo album"}
          </button>
        </div>
      </form>
    </div>
  );
}