import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, RefreshCw } from "lucide-react";

function ManageAlbums() {
  const [albums, setAlbums] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchAlbums = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/spotify_app/albums/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data) ? res.data : [];
      setAlbums(data);
    } catch (error) {
      alert(error.response?.data?.error || "Lấy dữ liệu album thất bại.");
      console.error("Error fetching albums:", error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleDelete = async (id) => {
    if (!id) {
      alert("ID album không hợp lệ!");
      return;
    }
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      navigate("/login");
      return;
    }
    if (window.confirm("Bạn có chắc muốn xóa album này?")) {
      try {
        await axios.delete(`http://localhost:8000/spotify_app/albums/${id}/delete/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchAlbums();
        alert("Xóa album thành công.");
      } catch (error) {
        const errorMsg = error.response?.data?.error || "Xóa album thất bại.";
        alert(errorMsg);
        console.error("Error deleting album:", error.response);
      }
    }
  };

  const filteredAlbums = albums.filter((a) =>
    a.album_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wide">Quản lý album</h1>
        <div className="flex gap-4">
          <button
            onClick={fetchAlbums}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-semibold transition"
            title="Làm mới danh sách"
          >
            <RefreshCw size={20} />
          </button>
          <button
            onClick={() => navigate("/admin/create-album")}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full font-semibold transition"
          >
            + Thêm album
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Tìm kiếm album..."
        className="w-full p-3 mb-6 bg-[#121212] text-white rounded-md border border-gray-700 placeholder-gray-400 focus:border-green-500 outline-none transition"
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
              <th className="py-3 px-4">Tên album</th>
              <th className="py-3 px-4">Nghệ sĩ</th>
              <th className="py-3 px-4 w-40">Ngày phát hành</th>
              <th className="py-3 px-4 w-48">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-6 animate-pulse">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredAlbums.length > 0 ? (
              filteredAlbums.map((album, index) => (
                <tr
                  key={album._id}
                  className="border-b border-gray-800 hover:bg-[#2a2a2a] transition-colors"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="px-4 py-3">
                    <img
                      src={album.cover_img || "/default-cover.png"}
                      alt={album.album_name || "Unknown"}
                      className="w-12 h-12 rounded object-cover shadow"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium truncate" title={album.album_name || "Unknown"}>
                    {album.album_name || "Unknown"}
                  </td>
                  <td className="py-3 px-4 text-gray-300">{album.artist_name || "Chưa có"}</td>
                  <td className="py-3 px-4 text-gray-400">
                    {album.release_date ? new Date(album.release_date).toLocaleDateString() : "Chưa có"}
                  </td>
                  <td className="py-3 px-4 flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/admin/edit-album/${album._id}`)}
                      className="text-yellow-400 hover:text-yellow-500 transition"
                      title="Chỉnh sửa album"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(album._id)}
                      className="text-red-500 hover:text-red-600 transition"
                      title="Xóa album"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-6">
                  Không có album nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageAlbums;