import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify"; // Thêm import

export default function EditTrack() {
    const [title, setTitle] = useState("");
    const [albumId, setAlbumId] = useState("");
    const [audioFile, setAudioFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [img, setImg] = useState("");
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const navigate = useNavigate();
    const { songId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            const userData = JSON.parse(localStorage.getItem("userData"));
            const token = userData?.token;
            if (!token) {
                console.error("No token found");
                toast.error("Vui lòng đăng nhập với quyền admin.");
                navigate("/login");
                return;
            }
            try {
                setFetching(true);
                const songRes = await axios.get(`http://localhost:8000/spotify_app/songs/${songId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const songData = songRes.data;
                setTitle(songData.title || "");
                setAlbumId(songData.album?._id || "");
                setImg(songData.img || "");

                const albumsRes = await axios.get("http://localhost:8000/spotify_app/albums/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Albums response:", albumsRes.data);
                setAlbums(Array.isArray(albumsRes.data) ? albumsRes.data : []);
            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error.response?.data);
                toast.error(error.response?.data?.error || "Không tải được dữ liệu bài hát hoặc album.");
                navigate("/admin/tracks");
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, [navigate, songId]);

    const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error("Tên bài hát không được để trống!");
            return;
        }
        if (albumId && !isValidObjectId(albumId)) {
            toast.error("ID album không hợp lệ!");
            return;
        }
        if (audioFile && !audioFile.type.startsWith("audio/")) {
            toast.error("File âm thanh không hợp lệ. Vui lòng chọn file MP3, WAV, v.v.");
            return;
        }
        if (videoFile && !videoFile.type.startsWith("video/")) {
            toast.error("File video không hợp lệ. Vui lòng chọn file MP4, v.v.");
            return;
        }

        const userData = JSON.parse(localStorage.getItem("userData"));
        const token = userData?.token;
        if (!token) {
            console.error("No token found for update");
            toast.error("Vui lòng đăng nhập với quyền admin.");
            navigate("/login");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        if (albumId) formData.append("album_id", albumId); // Sửa từ "album" thành "album_id"
        if (audioFile) formData.append("audio_file", audioFile);
        if (videoFile) formData.append("video_file", videoFile);
        if (img.trim()) formData.append("img", img);

        for (let [key, value] of formData.entries()) {
            console.log(`FormData: ${key} =`, value);
        }

        setLoading(true);
        try {
            const res = await axios.put(`http://localhost:8000/spotify_app/songs/update/${songId}/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Update response:", res.data);
            toast.success("Cập nhật bài hát thành công!");
            navigate("/admin/tracks");
        } catch (error) {
            console.error("Error updating track:", error.response?.data);
            let errorMsg = error.response?.data?.error || "Cập nhật bài hát thất bại.";
            if (error.response?.status === 401) {
                toast.error("Bạn không có quyền admin hoặc token không hợp lệ.");
                navigate("/login");
            } else if (error.response?.status === 404) {
                toast.error("Bài hát không tồn tại.");
            } else if (error.response?.status === 400) {
                errorMsg = Object.entries(error.response?.data?.details || {})
                    .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`)
                    .join("; ");
                toast.error(`Lỗi: ${errorMsg}`);
            } else {
                toast.error(`Lỗi: ${errorMsg}`);
            }
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="p-6 max-w-md mx-auto text-white">
                <h1 className="text-3xl font-bold mb-6">Chỉnh sửa bài hát</h1>
                <p className="text-gray-500 animate-pulse">Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-md mx-auto text-white">
            <h1 className="text-3xl font-bold mb-6">Chỉnh sửa bài hát</h1>
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
                        disabled={loading}
                        className="p-3 rounded bg-[#282828] text-white border border-gray-700 placeholder-gray-400 focus:border-green-500 outline-none transition"
                    />
                </label>
                <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
                    Album
                    <select
                        value={albumId}
                        onChange={(e) => setAlbumId(e.target.value)}
                        disabled={loading || albums.length === 0}
                        className="p-3 rounded bg-[#282828] text-white border border-gray-700 focus:border-green-500 outline-none transition"
                    >
                        <option value="">-- Chọn album (tùy chọn) --</option>
                        {albums.map((album) => (
                            <option key={album._id} value={album._id}>
                                {album.album_name || "Không tên"} (ID: {album._id})
                            </option>
                        ))}
                    </select>
                </label>
                <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
                    File âm thanh (mp3, wav, ...)
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => setAudioFile(e.target.files[0])}
                        disabled={loading}
                        className="text-white"
                    />
                </label>
                <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
                    File video (mp4, ...)
                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideoFile(e.target.files[0])}
                        disabled={loading}
                        className="text-white"
                    />
                </label>
                <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
                    URL ảnh bài hát (jpg, png, ...)
                    <input
                        type="url"
                        value={img}
                        onChange={(e) => setImg(e.target.value)}
                        placeholder="Nhập URL ảnh bài hát (tùy chọn)"
                        disabled={loading}
                        className="p-3 rounded bg-[#282828] text-white border border-gray-700 placeholder-gray-400 focus:border-green-500 outline-none transition"
                    />
                </label>
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/tracks")}
                        disabled={loading}
                        className="text-gray-400 hover:text-white transition"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-6 py-3 rounded-full font-semibold transition"
                    >
                        {loading ? "Đang cập nhật..." : "Cập nhật bài hát"}
                    </button>
                </div>
            </form>
        </div>
    );
}   