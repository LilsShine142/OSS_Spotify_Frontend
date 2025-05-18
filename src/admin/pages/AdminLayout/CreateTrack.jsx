import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateTrack() {
  const [title, setTitle] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [duration, setDuration] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const res = await axios.get("http://localhost:8000/albums/");
        setAlbums(res.data);
      } catch (error) {
        console.error("Lỗi tải album:", error);
      }
    }
    fetchAlbums();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Tên bài hát không được để trống!");
      return;
    }
    if (!albumId) {
      alert("Vui lòng chọn album!");
      return;
    }
    if (!audioFile) {
      alert("Vui lòng chọn file âm thanh!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("album_id", albumId);
    formData.append("duration", duration);
    formData.append("audio_file", audioFile);

    try {
      await axios.post("http://localhost:8000/tracks/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Tạo bài hát thành công!");
      navigate("/tracks");
    } catch (error) {
      console.error(error);
      alert("Tạo bài hát thất bại.");
    } finally {
      setLoading(false);
    }
  };

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
            className="p-3 rounded bg-[#282828] text-white border border-gray-700 placeholder-gray-400 focus:border-green-500 outline-none transition"
          />
        </label>

        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Album
          <select
            value={albumId}
            onChange={(e) => setAlbumId(e.target.value)}
            required
            className="p-3 rounded bg-[#282828] text-white border border-gray-700 focus:border-green-500 outline-none transition"
          >
            <option value="">-- Chọn album --</option>
            {albums.map((album) => (
              <option key={album._id} value={album._id}>
                {album.title}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Thời lượng (giây)
          <input
            type="number"
            min={1}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Nhập thời lượng bài hát"
            className="p-3 rounded bg-[#282828] text-white border border-gray-700 placeholder-gray-400 focus:border-green-500 outline-none transition"
          />
        </label>

        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          File âm thanh (mp3, wav, ...)
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files[0])}
            required
            className="text-white"
          />
        </label>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/tracks")}
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
