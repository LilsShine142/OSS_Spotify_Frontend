import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, RefreshCw } from "lucide-react";

function ManageArtists() {
  const [artists, setArtists] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchArtists = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get("http://127.0.0.1:8000/spotify_app/artists/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API response:", res.data);
      const data = res.data.results || [];
      setArtists(Array.isArray(data) ? data : []);
    } catch (error) {
      alert(error.response?.data?.error || "Lấy dữ liệu nghệ sĩ thất bại.");
      console.error("Error fetching artists:", error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleDelete = async (id) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      navigate("/login");
      return;
    }
    if (window.confirm("Bạn có chắc muốn xóa nghệ sĩ này?")) {
      console.log("Deleting artist with ID:", id);
      try {
        await axios.delete(`http://127.0.0.1:8000/spotify_app/artists/${id}/delete`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchArtists();
        alert("Xóa nghệ sĩ thành công.");
      } catch (error) {
        const errorMsg = error.response?.data?.error || "Xóa nghệ sĩ thất bại.";
        alert(errorMsg);
        console.error("Error deleting artist:", error.response);
      }
    }
  };

  const filteredArtists = Array.isArray(artists)
    ? artists.filter((a) =>
        a.artist_name
          ? a.artist_name.toLowerCase().includes(search.toLowerCase())
          : false
      )
    : [];

  return (
    <div className="p-6 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wide">Quản lý nghệ sĩ</h1>
        <div className="flex gap-4">
          <button
            onClick={fetchArtists}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-semibold transition"
            title="Làm mới danh sách"
          >
            <RefreshCw size={20} />
          </button>
          <button
            onClick={() => navigate("/admin/create-artist")}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full font-semibold transition"
          >
            + Thêm nghệ sĩ
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Tìm kiếm nghệ sĩ..."
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
              <th className="py-3 px-4">Tên nghệ sĩ</th>
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
            ) : filteredArtists.length > 0 ? (
              filteredArtists.map((artist, index) => (
                <tr
                  key={artist._id}
                  className="border-b border-gray-800 hover:bg-[#2a2a2a] transition-colors"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="px-4 py-3">
                    <img
                      src={artist.profile_img || "/default-avatar.png"}
                      alt={artist.artist_name || "Unknown"}
                      className="w-12 h-12 rounded-full object-cover shadow"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium truncate" title={artist.artist_name || "Unknown"}>
                    {artist.artist_name || "Unknown"}
                  </td>
                  <td className="py-3 px-4 flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/admin/edit-artist/${artist._id}`)}
                      className="text-yellow-400 hover:text-yellow-500 transition"
                      title="Chỉnh sửa nghệ sĩ"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(artist._id)}
                      className="text-red-500 hover:text-red-600 transition"
                      title="Xóa nghệ sĩ"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-6">
                  Không có nghệ sĩ nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageArtists;