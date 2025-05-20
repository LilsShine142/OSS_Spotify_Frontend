import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateTrack() {
  const [title, setTitle] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [img, setImg] = useState("");
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbums = async () => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const token = userData?.token;

      if (!token) {
        console.error("No token found");
        toast.error("Vui lòng đăng nhập với quyền admin để tạo bài hát.");
        navigate("/login");
        return;
      }

      try {
        setFetching(true);
        const res = await axios.get("http://localhost:8000/spotify_app/albums/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Albums response:", res.data);
        setAlbums(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Lỗi tải album:", error.response?.data);
        toast.error(error.response?.data?.error || "Không tải được danh sách album.");
      } finally {
        setFetching(false);
      }
    };

    fetchAlbums();
  }, [navigate]);

  const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!title.trim()) {
    toast.error("Tên bài hát không được để trống!");
    return;
  }
  if (!audioFile) {
    toast.error("Vui lòng chọn file âm thanh!");
    return;
  }
  if (audioFile && !audioFile.type.startsWith("audio/")) {
    toast.error("File âm thanh không hợp lệ. Vui lòng chọn file MP3, WAV, v.v.");
    return;
  }
  if (videoFile && !videoFile.type.startsWith("video/")) {
    toast.error("File video không hợp lệ. Vui lòng chọn file MP4, v.v.");
    return;
  }
  if (albumId && !isValidObjectId(albumId)) {
    toast.error("ID album không hợp lệ!");
    return;
  }
  if (albumId && albumId !== "") {
    const selectedAlbum = albums.find((album) => album._id === albumId);
    if (!selectedAlbum) {
      toast.error("Album đã chọn không tồn tại trong danh sách! Vui lòng chọn lại.");
      return;
    }
  }

  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = userData?.token;

  if (!token) {
    console.error("No token found for upload");
    toast.error("Vui lòng đăng nhập với quyền admin để tạo bài hát.");
    navigate("/login");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  if (albumId && albumId !== "") {
  const selectedAlbum = albums.find((album) => album._id === albumId);
  if (!selectedAlbum) {
    toast.error("Album đã chọn không tồn tại trong danh sách! Vui lòng chọn lại.");
    return;
  }
  formData.append("album_id", albumId);
}
  formData.append("audio_file", audioFile);
  if (videoFile) formData.append("video_file", videoFile);
  if (img.trim()) formData.append("img", img);

  for (let [key, value] of formData.entries()) {
    console.log(`FormData: ${key} =`, value);
  }

  setLoading(true);
  try {
    const res = await axios.post("http://localhost:8000/spotify_app/songs/upload/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Upload response:", res.data);
    toast.success("Tạo bài hát thành công!");
    navigate("/admin/tracks");
  } catch (error) {
    console.error("Error creating track:", error.response?.data);
    let errorMsg = error.response?.data?.error || "Tạo bài hát thất bại.";
    if (error.response?.status === 401) {
      errorMsg = "Bạn không có quyền admin hoặc token không hợp lệ.";
      navigate("/login");
    } else if (error.response?.status === 400) {
      if (error.response?.data?.album_id) {
        errorMsg = `Lỗi album: Album với ID ${albumId} không tồn tại. Vui lòng chọn album khác.`;
      } else {
        errorMsg = Object.entries(error.response?.data || {})
          .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`)
          .join("; ");
      }
    } else if (error.response?.status === 500) {
      errorMsg = "Lỗi server: Vui lòng kiểm tra cấu hình model hoặc serializer.";
    }
    toast.error(`Lỗi: ${errorMsg}`);
  } finally {
    setLoading(false);
  }
};

  if (fetching) {
    return (
      <div className="p-6 max-w-md mx-auto text-white">
        <h1 className="text-3xl font-bold mb-6">Tạo bài hát mới</h1>
        <p className="text-gray-500 animate-pulse">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">Tạo bài hát mới</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-[#121212] p-8 rounded-lg flex flex-col gap-6"
      >
        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Tên bài hát
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tên bài hát"
            required
            disabled={loading}
            className="p-3 rounded bg-[#282828] text-white border border-gray-700 placeholder-gray-400 focus:border-green-500 outline-none transition"
          />
        </label>

        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Album
          <select
            value={albumId}
            onChange={(e) => setAlbumId(e.target.value)}
            disabled={loading || albums.length === 0}
            className="p-3 rounded bg-[#282828] text-white border border-gray-700 focus:border-green-500 outline-none transition"
          >
            <option value="">-- Chọn album (tùy chọn) --</option>
            {albums.map((album) => (
              <option key={album._id} value={album._id}>
                {album.album_name || "Không tên"} (ID: {album._id})
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Album ID
          <input
            type="text"
            value={albumId}
            readOnly
            placeholder="Chọn album để hiển thị ID"
            className="p-3 rounded bg-[#282828] text-gray-400 border border-gray-700 outline-none cursor-not-allowed"
          />
        </label>

        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          File âm thanh (mp3, wav, ...)
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files[0])}
            required
            disabled={loading}
            className="text-white"
          />
        </label>

        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          File video (mp4, ...)
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            disabled={loading}
            className="text-white"
          />
        </label>

        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          URL ảnh bài hát (jpg, png, ...)
          <input
            type="url"
            value={img}
            onChange={(e) => setImg(e.target.value)}
            placeholder="Nhập URL ảnh bài hát (tùy chọn)"
            disabled={loading}
            className="p-3 rounded bg-[#282828] text-white border border-gray-700 placeholder-gray-400 focus:border-green-500 outline-none transition"
          />
        </label>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/tracks")}
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
            {loading ? "Đang tạo..." : "Tạo bài hát"}
          </button>
        </div>
      </form>
    </div>
  );
}