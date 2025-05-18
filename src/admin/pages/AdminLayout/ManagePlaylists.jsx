import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

function ManagePlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/playlists/");
      setPlaylists(res.data);
    } catch {
      alert("Lấy dữ liệu playlist thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa playlist này?")) {
      try {
        await axios.delete(`http://localhost:8000/playlists/${id}/`);
        fetchPlaylists();
        alert("Xóa playlist thành công.");
      } catch {
        alert("Xóa playlist thất bại.");
      }
    }
  };

  const filteredPlaylists = playlists.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wide">Quản lý playlist</h1>
        <button
          onClick={() => navigate("/admin/create-playlist")}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full font-semibold transition"
        >
          + Thêm playlist
        </button>
      </div>

      <input
        type="text"
        placeholder="Tìm kiếm playlist..."
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
              <th className="py-3 px-4">Tên playlist</th>
              <th className="py-3 px-4 w-48">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-6 animate-pulse">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredPlaylists.length > 0 ? (
              filteredPlaylists.map((playlist, index) => (
                <tr
                  key={playlist._id}
                  className="border-b border-gray-800 hover:bg-[#2a2a2a] transition-colors"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="px-4 py-3">
                    <img
                      src={playlist.cover || "/default-cover.png"}
                      alt={playlist.title}
                      className="w-12 h-12 rounded object-cover shadow"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium truncate" title={playlist.title}>
                    {playlist.title}
                  </td>
                  <td className="py-3 px-4 flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/admin/edit-playlist/${playlist._id}`)}
                      className="text-yellow-400 hover:text-yellow-500 transition"
                      title="Chỉnh sửa playlist"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(playlist._id)}
                      className="text-red-500 hover:text-red-600 transition"
                      title="Xóa playlist"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-6">
                  Không có playlist nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManagePlaylists;
