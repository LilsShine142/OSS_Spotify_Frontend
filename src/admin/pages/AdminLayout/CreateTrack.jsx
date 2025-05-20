import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  uploadFileAudioToCloudinary,
  uploadToCloudinary,
} from "../../../services/CloudUploadService/CloudService";

const CreateTrack = () => {
  const [title, setTitle] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [img, setImg] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [audioProgress, setAudioProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [imgProgress, setImgProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(null);
  const navigate = useNavigate();

  // Lấy danh sách albums
  useEffect(() => {
    const fetchAlbums = async () => {
      console.log("Fetching albums...");
      try {
        setFetching(true);
        const res = await axios.get("http://localhost:8000/spotify_app/albums/");
        console.log("Albums response:", res.data);
        setAlbums(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching albums:", error);
        toast.error("Không thể tải danh sách album!");
      } finally {
        setFetching(false);
      }
    };
    fetchAlbums();
  }, []);

  // Tính duration của audio file
  useEffect(() => {
    if (audioFile) {
      const audio = new Audio(URL.createObjectURL(audioFile));
      audio.addEventListener("loadedmetadata", () => {
        const duration = Math.round(audio.duration);
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;
        const formattedDuration = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        setAudioDuration(formattedDuration);
        console.log("Audio duration:", formattedDuration);
      });
    }
  }, [audioFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission started...");
    console.log("Form data:", { title, albumId, audioFile, videoFile, img });

    // Kiểm tra dữ liệu đầu vào
    if (!title.trim()) {
      toast.error("Tên bài hát không được để trống!");
      return;
    }
    if (!audioFile) {
      toast.error("Vui lòng chọn file âm thanh!");
      return;
    }
    if (audioFile && !audioFile.type.startsWith("audio/")) {
      toast.error("File âm thanh không hợp lệ. Vui lòng chọn file MP3, WAV, v.v.");
      return;
    }
    if (audioFile && audioFile.size > 100 * 1024 * 1024) {
      toast.error("File âm thanh quá lớn. Vui lòng chọn file dưới 100MB.");
      return;
    }
    if (videoFile && !videoFile.type.startsWith("video/")) {
      toast.error("File video không hợp lệ. Vui lòng chọn file MP4, v.v.");
      return;
    }
    if (videoFile && videoFile.size > 100 * 1024 * 1024) {
      toast.error("File video quá lớn. Vui lòng chọn file dưới 100MB.");
      return;
    }
    if (img && !img.type.startsWith("image/")) {
      toast.error("File ảnh không hợp lệ. Vui lòng chọn file JPG, PNG, v.v.");
      return;
    }
    if (img && img.size > 10 * 1024 * 1024) {
      toast.error("File ảnh quá lớn. Vui lòng chọn file dưới 10MB.");
      return;
    }
    if (albumId && !/^[0-9a-fA-F]{24}$/.test(albumId)) {
      toast.error("ID album không hợp lệ!");
      return;
    }
    if (albumId) {
      const selectedAlbum = albums.find((album) => album._id === albumId);
      if (!selectedAlbum) {
        toast.error("Album đã chọn không tồn tại! Vui lòng chọn lại.");
        return;
      }
    }
    if (!audioDuration) {
      toast.error("Không thể xác định độ dài file âm thanh!");
      return;
    }

    if (!window.confirm("Bạn có chắc muốn tạo bài hát này?")) {
      return;
    }

    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
    if (!token) {
      console.error("No token found for upload");
      toast.error("Vui lòng đăng nhập với quyền admin để tạo bài hát.");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    if (albumId) formData.append("album_id", albumId);
    formData.append("duration", audioDuration);

    setLoading(true);

    // Upload audio file
    try {
      console.log("Uploading audio file to Cloudinary...");
      const audioUrl = await uploadFileAudioToCloudinary(audioFile, (progress) => {
        setAudioProgress(progress);
        console.log("Audio upload progress:", progress);
      });
      if (!audioUrl || !audioUrl.startsWith("https://res.cloudinary.com/")) {
        throw new Error("Upload file âm thanh thất bại: URL không hợp lệ.");
      }
      console.log("Uploaded audio URL:", audioUrl);
      formData.append("audio_file", audioUrl);
    } catch (error) {
      console.error("Error uploading audio:", error.response?.data || error.message);
      const errorMsg =
        error.response?.data?.error?.message ||
        "Không thể upload file âm thanh. Kiểm tra upload preset hoặc kết nối Cloudinary.";
      toast.error(errorMsg);
      setLoading(false);
      return;
    }

    // Upload video file
    if (videoFile) {
      try {
        console.log("Uploading video file to Cloudinary...");
        const videoUrl = await uploadFileAudioToCloudinary(videoFile, (progress) => {
          setVideoProgress(progress);
          console.log("Video upload progress:", progress);
        });
        if (!videoUrl || !videoUrl.startsWith("https://res.cloudinary.com/")) {
          throw new Error("Upload file video thất bại: URL không hợp lệ.");
        }
        console.log("Uploaded video URL:", videoUrl);
        formData.append("video_file", videoUrl);
      } catch (error) {
        console.error("Error uploading video:", error.response?.data || error.message);
        const errorMsg =
          error.response?.data?.error?.message ||
          "Không thể upload file video. Kiểm tra upload preset hoặc kết nối Cloudinary.";
        toast.error(errorMsg);
        setLoading(false);
        return;
      }
    }

    // Upload image file
    if (img) {
      try {
        console.log("Uploading image file to Cloudinary...");
        const imgUrl = await uploadToCloudinary(img, (progress) => {
          setImgProgress(progress);
          console.log("Image upload progress:", progress);
        });
        if (!imgUrl || !imgUrl.startsWith("https://res.cloudinary.com/")) {
          throw new Error("Upload ảnh thất bại: URL không hợp lệ.");
        }
        console.log("Uploaded image URL:", imgUrl);
        formData.append("img", imgUrl);
      } catch (error) {
        console.error("Error uploading image:", error.response?.data || error.message);
        const errorMsg =
          error.response?.data?.error?.message ||
          "Không thể upload file ảnh. Kiểm tra upload preset hoặc kết nối Cloudinary.";
        toast.error(errorMsg);
        setLoading(false);
        return;
      }
    }

    // Debug FormData
    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value}`);
    }

    // Gửi request tới backend
    try {
      console.log("Sending request to backend...");
      const res = await axios.post(
        "http://localhost:8000/spotify_app/songs/upload/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Upload response:", res.data);
      toast.success("Tạo bài hát thành công!");
      navigate("/admin/tracks");
    } catch (error) {
      console.error("Error creating track:", error.response?.data);
      let errorMsg = error.response?.data?.error || "Tạo bài hát thất bại.";
      if (error.response?.status === 401) {
        errorMsg = "Bạn không có quyền admin hoặc token không hợp lệ.";
        navigate("/login");
      } else if (error.response?.status === 400) {
        if (error.response?.data?.audio_file) {
          errorMsg = `Lỗi file âm thanh: ${error.response.data.audio_file}`;
        } else if (error.response?.data?.album_id) {
          errorMsg = `Lỗi album: Album với ID ${albumId} không tồn tại.`;
        } else {
          errorMsg = Object.entries(error.response?.data || {})
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`)
            .join("; ");
        }
      } else if (error.response?.status === 500) {
        errorMsg = "Lỗi server: Vui lòng kiểm tra cấu hình model hoặc serializer.";
      }
      toast.error(`Lỗi: ${errorMsg}`);
    } finally {
      setLoading(false);
      setAudioProgress(0);
      setVideoProgress(0);
      setImgProgress(0);
    }
  };

  if (fetching) {
    return (
      <div className="p-6 max-w-md mx-auto text-white">
        <h1 className="text-3xl font-bold mb-6">Tạo bài hát mới</h1>
        <p className="text-gray-500 animate-pulse">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">Tạo bài hát mới</h1>
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
                {album.album_name || "Không tên"} - {album.artist_name}
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
            required
            disabled={loading}
            className="text-white"
          />
          {audioFile && (
            <div className="mt-2">
              <audio controls className="w-full rounded bg-[#282828]">
                <source src={URL.createObjectURL(audioFile)} type={audioFile.type} />
              </audio>
              {audioProgress > 0 && audioProgress < 100 && (
                <div className="flex items-center gap-2 mt-2">
                  <progress
                    value={audioProgress}
                    max="100"
                    className="w-full h-1 bg-gray-700 rounded"
                  />
                  <span className="text-sm text-gray-400">{audioProgress}%</span>
                </div>
              )}
              {audioDuration && (
                <p className="text-sm text-gray-400 mt-2">Thời lượng: {audioDuration}</p>
              )}
            </div>
          )}
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
          {videoFile && (
            <div className="mt-2">
              <video controls className="w-full rounded bg-[#282828]">
                <source src={URL.createObjectURL(videoFile)} type={videoFile.type} />
              </video>
              {videoProgress > 0 && videoProgress < 100 && (
                <div className="flex items-center gap-2 mt-2">
                  <progress
                    value={videoProgress}
                    max="100"
                    className="w-full h-1 bg-gray-700 rounded"
                  />
                  <span className="text-sm text-gray-400">{videoProgress}%</span>
                </div>
              )}
            </div>
          )}
        </label>

        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Ảnh bìa (jpg, png, ...)
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImg(e.target.files[0])}
            disabled={loading}
            className="text-white"
          />
          {img && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(img)}
                alt="Preview"
                className="w-32 h-32 object-cover rounded"
              />
              {imgProgress > 0 && imgProgress < 100 && (
                <div className="flex items-center gap-2 mt-2">
                  <progress
                    value={imgProgress}
                    max="100"
                    className="w-full h-1 bg-gray-700 rounded"
                  />
                  <span className="text-sm text-gray-400">{imgProgress}%</span>
                </div>
              )}
            </div>
          )}
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
            {loading ? "Đang tạo..." : "Tạo bài hát"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTrack;