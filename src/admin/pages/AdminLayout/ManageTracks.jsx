import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";

function ManageTracks() {
  const [tracks, setTracks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.token) {
      alert("Vui lòng đăng nhập với quyền admin để quản lý bài hát.");
      navigate("/login");
    } else {
      fetchTracks();
    }
  }, [navigate]);

  const fetchTracks = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;

    if (!token) {
      alert("Vui lòng đăng nhập với quyền admin.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/spotify_app/songs/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Tracks response:", res.data);
      setTracks(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching tracks:", error.response?.data);
      alert(error.response?.data?.error || "Lấy dữ liệu bài hát thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      alert("ID bài hát không hợp lệ!");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;

    if (!token) {
      alert("Vui lòng đăng nhập với quyền admin.");
      navigate("/login");
      return;
    }

    if (window.confirm("Bạn có chắc muốn xóa bài hát này?")) {
      try {
        await axios.delete(`http://localhost:8000/songs/${id}/delete/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchTracks();
        alert("Xóa bài hát thành công.");
      } catch (error) {
        console.error("Error deleting track:", error.response?.data);
        const errorMsg = error.response?.data?.error || "Xóa bài hát thất bại.";
        if (error.response?.status === 401) {
          alert("Bạn không có quyền admin hoặc token không hợp lệ.");
          navigate("/login");
        } else {
          alert(`Lỗi: ${errorMsg}`);
        }
      }
    }
  };

  const handleToggleVisibility = async (id, isHidden) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;

    if (!token) {
      alert("Vui lòng đăng nhập với quyền admin.");
      navigate("/login");
      return;
    }

    const action = isHidden ? "hiện" : "ẩn";
    if (window.confirm(`Bạn có chắc muốn ${action} bài hát này?`)) {
      try {
        await axios.put(
          `http://localhost:8000/songs/${id}/${isHidden ? "unhide" : "hide"}/`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchTracks();
        alert(`Bài hát đã được ${action} thành công.`);
      } catch (error) {
        console.error("Error toggling visibility:", error.response?.data);
        const errorMsg = error.response?.data?.error || `Không thể ${action} bài hát.`;
        if (error.response?.status === 401) {
          alert("Bạn không có quyền admin hoặc token không hợp lệ.");
          navigate("/login");
        } else {
          alert(`Lỗi: ${errorMsg}`);
        }
      }
    }
  };

  const formatDuration = (timeStr) => {
    if (!timeStr) return "0:00";
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;
    return `${totalMinutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const getFileName = (url) => {
    if (!url) return "Không có";
    return url.split("/").pop() || "Không có";
  };

  const filteredTracks = tracks.filter((t) =>
    t.title?.toLowerCase().includes(search.toLowerCase())
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
              <th className="py-3 px-4">Album</th>
              <th className="py-3 px-4 w-28">Thời lượng</th>
              <th className="py-3 px-4 w-48">File Âm Thanh</th>
              <th className="py-3 px-4 w-48">File Video</th>
              <th className="py-3 px-4 w-48">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center text-gray-500 py-6 animate-pulse">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredTracks.length > 0 ? (
              filteredTracks.map((track, index) => (
                <tr
                  key={track._id}
                  className={`border-b border-gray-800 hover:bg-[#2a2a2a] transition-colors ${track.isHidden ? "opacity-50" : ""}`}
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="px-4 py-3">
                    <img
                      src={track.img || "/default-cover.png"}
                      alt={track.title || "Unknown"}
                      className="w-12 h-12 rounded object-cover shadow"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium truncate" title={track.title || "Unknown"}>
                    {track.title || "Unknown"}
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    {track.album_id?.album_name || "Chưa có"}
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {formatDuration(track.duration || "00:00:00")}
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    {track.audio_file ? (
                      <audio controls className="w-32 rounded bg-black">
                        <source src={track.audio_file} type="audio/mpeg" />
                      </audio>
                    ) : (
                      "Không có"
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    {track.video_file ? (
                      <video controls className="w-32 rounded bg-black">
                        <source src={track.video_file} type="video/mp4" />
                      </video>
                    ) : (
                      "Không có"
                    )}
                  </td>
                  <td className="py-3 px-4 flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => navigate(`/admin/edit-track/${track._id}`)}
                      className="text-yellow-400 hover:text-yellow-500 transition"
                      title="Chỉnh sửa bài hát"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(track._id)}
                      className="text-red-500 hover:text-red-600 transition"
                      title="Xóa bài hát"
                    >
                      <Trash2 size={20} />
                    </button>
                    <button
                      onClick={() => handleToggleVisibility(track._id, track.isHidden)}
                      className={`transition ${track.isHidden ? "text-blue-400 hover:text-blue-500" : "text-gray-400 hover:text-gray-500"}`}
                      title={track.isHidden ? "Hiện bài hát" : "Ẩn bài hát"}
                    >
                      {track.isHidden ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-gray-500 py-6">
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