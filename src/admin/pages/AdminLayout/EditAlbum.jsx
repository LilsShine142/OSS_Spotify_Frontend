import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditAlbum() {
  const [albumName, setAlbumName] = useState("");
  const [artistId, setArtistId] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [totalTracks, setTotalTracks] = useState("");
  const [isfromDB, setIsfromDB] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();
  const { albumId } = useParams();

  useEffect(() => {
    if (!albumId) {
      alert("Không tìm thấy ID album!");
      navigate("/admin/albums");
      return;
    }

    const fetchArtistsAndAlbum = async () => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const token = userData?.token;
      if (!token) {
        alert("Bạn chưa đăng nhập!");
        navigate("/login");
        return;
      }

      try {
        const artistsRes = await axios.get("http://localhost:8000/spotify_app/artists/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Artists response:", artistsRes.data); // Debug response
        const artistData = artistsRes.data.results || artistsRes.data || [];
        setArtists(Array.isArray(artistData) ? artistData : []);

        const albumRes = await axios.get(`http://localhost:8000/spotify_app/albums/${albumId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const album = albumRes.data;
        setAlbumName(album.album_name || "");
        setArtistId(album.artist || "");
        setReleaseDate(album.release_date ? album.release_date.split("T")[0] : "");
        setTotalTracks(album.total_tracks || "");
        setIsfromDB(album.isfromDB ?? true);
        setIsHidden(album.isHidden ?? false);
      } catch (error) {
        const errorMsg = error.response?.data?.error || "Lấy dữ liệu album thất bại.";
        alert(errorMsg);
        console.error("Error fetching data:", error.response);
        navigate("/admin/albums");
      } finally {
        setFetching(false);
      }
    };

    fetchArtistsAndAlbum();
  }, [albumId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!albumName.trim()) {
      alert("Tên album không được để trống!");
      return;
    }
    if (!artistId) {
      alert("Vui lòng chọn nghệ sĩ cho album!");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("album_name", albumName);
    formData.append("artist", artistId);
    formData.append("release_date", releaseDate);
    formData.append("total_tracks", totalTracks || "0");
    formData.append("isfromDB", isfromDB.toString());
    formData.append("isHidden", isHidden.toString());
    if (coverFile) formData.append("cover_img", coverFile);

    setLoading(true);
    try {
      await axios.put(
        `http://localhost:8000/spotify_app/albums/${albumId}/update/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Cập nhật album thành công!");
      navigate("/admin/albums");
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Cập nhật album thất bại.";
      alert(errorMsg);
      console.error("Error updating album:", error.response);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-6 text-white text-center">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">Chỉnh sửa Album</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-[#121212] p-8 rounded-lg flex flex-col gap-6"
      >
        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Tên album
          <input
            type="text"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
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
            disabled={fetching}
            className="p-3 rounded bg-[#282828] text-white border border-gray-700 focus:border-green-500 outline-none transition"
          >
            <option value="">-- Chọn nghệ sĩ --</option>
            {fetching ? (
              <option disabled>Đang tải...</option>
            ) : artists.length > 0 ? (
              artists.map((artist) => (
                <option key={artist._id} value={artist._id}>
                  {artist.artist_name || "Không tên"}
                </option>
              ))
            ) : (
              <option disabled>Không có nghệ sĩ</option>
            )}
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
          Số lượng bài hát
          <input
            type="number"
            value={totalTracks}
            onChange={(e) => setTotalTracks(e.target.value)}
            placeholder="Nhập số lượng bài hát"
            className="p-3 rounded bg-[#282828] text-white border border-gray-700 focus:border-green-500 outline-none transition"
          />
        </label>

        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Từ cơ sở dữ liệu
          <input
            type="checkbox"
            checked={isfromDB}
            onChange={(e) => setIsfromDB(e.target.checked)}
            className="h-5 w-5 text-green-600"
          />
        </label>

        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Ẩn album
          <input
            type="checkbox"
            checked={isHidden}
            onChange={(e) => setIsHidden(e.target.checked)}
            className="h-5 w-5 text-green-600"
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
            onClick={() => navigate("/admin/albums")}
            className="text-gray-400 hover:text-white transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-6 py-3 rounded-full font-semibold transition"
          >
            {loading ? "Đang cập nhật..." : "Cập nhật album"}
          </button>
        </div>
      </form>
    </div>
  );
}