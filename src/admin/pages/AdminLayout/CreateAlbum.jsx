import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateAlbum() {
  const [title, setTitle] = useState("");
  const [artistId, setArtistId] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchArtists() {
      try {
        const res = await axios.get("http://localhost:8000/artists/");
        setArtists(res.data);
      } catch (error) {
        console.error("Lỗi tải nghệ sĩ:", error);
      }
    }
    fetchArtists();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Tên album không được để trống!");
      return;
    }
    if (!artistId) {
      alert("Vui lòng chọn nghệ sĩ cho album!");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist_id", artistId);
    formData.append("release_date", releaseDate);
    if (coverFile) formData.append("cover_file", coverFile);

    try {
      await axios.post("http://localhost:8000/albums/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Tạo album thành công!");
      navigate("/albums");
    } catch (error) {
      console.error(error);
      alert("Tạo album thất bại.");
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tên album"
            required
            className="p-3 rounded bg-[#282828] text-white border border-gray-700 placeholder-gray-400 focus:border-green-500 outline-none transition"
          />
        </label>

        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Nghệ sĩ
          <select
            value={artistId}
            onChange={(e) => setArtistId(e.target.value)}
            required
            className="p-3 rounded bg-[#282828] text-white border border-gray-700 focus:border-green-500 outline-none transition"
          >
            <option value="">-- Chọn nghệ sĩ --</option>
            {artists.map((artist) => (
              <option key={artist._id} value={artist._id}>
                {artist.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Ngày phát hành
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="p-3 rounded bg-[#282828] text-white border border-gray-700 focus:border-green-500 outline-none transition"
          />
        </label>

        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Ảnh bìa (jpg, png, ...)
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files[0])}
            className="text-white"
          />
        </label>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/albums")}
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
