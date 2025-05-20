import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

function ManageTracks() {
  const [tracks, setTracks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/songs/");
      setTracks(res.data);
    } catch (error) {
      alert("Lấy dữ liệu bài hát thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bài hát này?")) {
      try {
        // Nếu dùng POST /songs/<id>/delete/
        await axios.post(`http://localhost:8000/songs/${id}/delete/`);
        fetchTracks();
        alert("Xóa bài hát thành công.");
      } catch (error) {
        alert("Xóa bài hát thất bại.");
      }
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const filteredTracks = tracks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wide">
          Quản lý bài hát
        </h1>
        <button
          onClick={() => navigate("/admin/create-track")}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full font-semibold transition"
        >
          + Thêm bài hát
        </button>
      </div>

      <input
        type="text"
        placeholder="Tìm kiếm bài hát..."
        className="w-full p-3 mb-6 bg-[#121212] text-white rounded-md border border-gray-700 placeholder-gray-500 focus:border-green-500 outline-none transition"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        disabled={loading}
      />

      <div className="rounded-lg overflow-hidden shadow-md shadow-black/50">
        <table className="w-full text-left text-sm bg-[#181818] border border-gray-800">
          <thead className="bg-[#282828] text-gray-400 uppercase select-none">
            <tr>
              <th className="py-3 px-4 w-12">#</th>
              <th className="py-3 px-4">Ảnh</th>
              <th className="py-3 px-4">Tên bài hát</th>
              <th className="py-3 px-4">Nghệ sĩ</th>
              <th className="py-3 px-4">Album</th>
              <th className="py-3 px-4 w-28">Thời lượng</th>
              <th className="py-3 px-4 w-48">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-6 animate-pulse">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredTracks.length > 0 ? (
              filteredTracks.map((track, index) => (
                <tr
                  key={track.song_id}
                  className="border-b border-gray-800 hover:bg-[#2a2a2a] transition-colors"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="px-4 py-3">
                    <img
                      src={track.cover || "/default-cover.png"}
                      alt={track.title}
                      className="w-12 h-12 rounded object-cover shadow"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium truncate" title={track.title}>
                    {track.title}
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    {track.artist_name || "Chưa có"}
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    {track.album_name || "Chưa có"}
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {formatDuration(track.duration || 0)}
                  </td>
                  <td className="py-3 px-4 flex items-center gap-3 flex-wrap">
                    {track.audio_file && (
                      <audio controls className="w-32 rounded bg-black">
                        <source src={track.audio_file || undefined} type="audio/mpeg" />
                      </audio>
                    )}
                    <button
                      onClick={() => navigate(`/admin/edit-track/${track.song_id}`)}
                      className="text-yellow-400 hover:text-yellow-500 transition"
                      title="Chỉnh sửa bài hát"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(track.song_id)}
                      className="text-red-500 hover:text-red-600 transition"
                      title="Xóa bài hát"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-6">
                  Không có bài hát nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageTracks;
