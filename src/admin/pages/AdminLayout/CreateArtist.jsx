import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateArtist() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Tên nghệ sĩ không được để trống!");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/artists/", { name, bio });
      alert("Thêm nghệ sĩ thành công!");
      navigate("/artists");
    } catch (error) {
      console.error(error);
      alert("Thêm nghệ sĩ thất bại.");
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded bg-[#282828] text-white placeholder-gray-400 border border-gray-700 focus:border-green-500 outline-none transition"
            placeholder="Nhập tên nghệ sĩ"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Mô tả
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="p-3 rounded bg-[#282828] text-white placeholder-gray-400 border border-gray-700 focus:border-green-500 outline-none transition"
            placeholder="Mô tả ngắn về nghệ sĩ"
          />
        </label>

        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate("/artists")}
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
