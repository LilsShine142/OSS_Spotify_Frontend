import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreatePlaylist() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Tên playlist không được để trống!");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/playlists/", { title, description });
      alert("Tạo playlist thành công!");
      navigate("/playlists");
    } catch (error) {
      console.error(error);
      alert("Tạo playlist thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">Tạo Playlist mới</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-[#121212] p-8 rounded-lg flex flex-col gap-6"
      >
        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Tên playlist
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tên playlist"
            required
            className="p-3 rounded bg-[#282828] text-white border border-gray-700 placeholder-gray-400 focus:border-green-500 outline-none transition"
          />
        </label>

        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Mô tả
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả ngắn về playlist"
            className="p-3 rounded bg-[#282828] text-white border border-gray-700 placeholder-gray-400 focus:border-green-500 outline-none transition"
          />
        </label>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/playlists")}
            className="text-gray-400 hover:text-white transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-6 py-3 rounded-full font-semibold transition"
          >
            {loading ? "Đang tạo..." : "Tạo playlist"}
          </button>
        </div>
      </form>
    </div>
  );
}
