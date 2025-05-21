import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  uploadFileAudioToCloudinary,
  uploadToCloudinary,
} from "../../../services/CloudUploadService/CloudService";

const EditTrack = () => {
  const [title, setTitle] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [img, setImg] = useState(null); // For file upload
  const [imgUrl, setImgUrl] = useState(""); // For URL input
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [audioProgress, setAudioProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [imgProgress, setImgProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const navigate = useNavigate();
  const { songId } = useParams(); // Lấy ID bài hát từ URL

  // Lấy danh sách albums và thông tin bài hát
  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching albums and track...");
      try {
        setFetching(true);
        const userData = JSON.parse(localStorage.getItem("userData"));
        const token = userData?.token;
        if (!token) {
          toast.error("Vui lòng đăng nhập với quyền admin để chỉnh sửa bài hát.");
          navigate("/login");
          return;
        }

        // Fetch albums
        const albumRes = await axios.get("http://localhost:8000/spotify_app/albums/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Albums response:", albumRes.data);
        setAlbums(Array.isArray(albumRes.data) ? albumRes.data : []);

        // Fetch track
        const trackRes = await axios.get(`http://localhost:8000/spotify_app/songs/${songId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Track response:", trackRes.data);
        const trackData = trackRes.data;
        setCurrentTrack(trackData);
        setTitle(trackData.title || "");
        setAlbumId(trackData.album_id || trackData.album?._id || "");
        setImgUrl(trackData.img || "");
        setAudioDuration(trackData.duration || null);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(error.response?.data?.error || "Không thể tải dữ liệu bài hát hoặc album!");
        navigate("/admin/tracks");
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [songId, navigate]);

  // Tính duration của audio file mới
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

  const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission started...");
    console.log("Form data:", { title, albumId, audioFile, videoFile, img, imgUrl });

    // Kiểm tra dữ liệu đầu vào
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
    if (albumId && !albums.find((album) => album._id === albumId)) {
      toast.error("Album đã chọn không tồn tại!");
      return;
    }
    if (audioFile && !audioDuration) {
      toast.error("Không thể xác định độ dài file âm thanh!");
      return;
    }

    if (!window.confirm("Bạn có chắc muốn cập nhật bài hát này?")) {
      return;
    }

    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
    if (!token) {
      console.error("No token found for upload");
      toast.error("Vui lòng đăng nhập với quyền admin để chỉnh sửa bài hát.");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("album_id", albumId || "");
    if (audioFile) {
      formData.append("duration", audioDuration);
    } else if (currentTrack?.duration) {
      formData.append("duration", currentTrack.duration);
    }

    setLoading(true);

    try {
      // Upload audio file nếu có
      if (audioFile) {
        console.log("Uploading audio file to Cloudinary...");
        const audioUrl = await uploadFileAudioToCloudinary(audioFile, (progress) => {
          setAudioProgress(Math.round(progress));
          console.log("Audio upload progress:", progress);
        });
        if (!audioUrl || !audioUrl.startsWith("https://res.cloudinary.com/")) {
          throw new Error("Upload file âm thanh thất bại: URL không hợp lệ.");
        }
        console.log("Uploaded audio URL:", audioUrl);
        formData.append("audio_file", audioUrl);
      }

      // Upload video file nếu có
      if (videoFile) {
        console.log("Uploading video file to Cloudinary...");
        const videoUrl = await uploadFileAudioToCloudinary(videoFile, (progress) => {
          setVideoProgress(Math.round(progress));
          console.log("Video upload progress:", progress);
        });
        if (!videoUrl || !videoUrl.startsWith("https://res.cloudinary.com/")) {
          throw new Error("Upload file video thất bại: URL không hợp lệ.");
        }
        console.log("Uploaded video URL:", videoUrl);
        formData.append("video_file", videoUrl);
      }

      // Upload image file nếu có, ưu tiên file upload trước URL
      if (img) {
        console.log("Uploading image file to Cloudinary...");
        const imgUploadedUrl = await uploadToCloudinary(img, (progress) => {
          setImgProgress(Math.round(progress));
          console.log("Image upload progress:", progress);
        });
        if (!imgUploadedUrl || !imgUploadedUrl.startsWith("https://res.cloudinary.com/")) {
          throw new Error("Upload ảnh thất bại: URL không hợp lệ.");
        }
        console.log("Uploaded image URL:", imgUploadedUrl);
        formData.append("img", imgUploadedUrl);
      } else if (imgUrl.trim()) {
        formData.append("img", imgUrl);
      }

      // Debug FormData
      console.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}: ${value}`);
      }

      // Gửi request cập nhật tới backend
      console.log("Sending update request to backend...");
      const res = await axios.put(
        `http://localhost:8000/spotify_app/songs/${songId}/update/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Update response:", res.data);
      toast.success("Cập nhật bài hát thành công!");
      navigate("/admin/tracks");
    } catch (error) {
      console.error("Error updating track:", error.response?.data || error.message);
      let errorMsg = error.response?.data?.error || "Cập nhật bài hát thất bại.";
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
      } else if (error.response?.status === 404) {
        errorMsg = "Bài hát không tồn tại.";
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
        <h1 className="text-3xl font-bold mb-6">Chỉnh sửa bài hát</h1>
        <p className="text-gray-500 animate-pulse">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!currentTrack) {
    return (
      <div className="p-6 max-w-md mx-auto text-white">
        <h1 className="text-3xl font-bold mb-6">Chỉnh sửa bài hát</h1>
        <p className="text-red-500">Không tìm thấy bài hát!</p>
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
                {album.album_name || "Không tên"} - {album.artist_name || "Không có nghệ sĩ"}
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
          {audioFile ? (
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
          ) : (
            currentTrack.audio_file && (
              <div className="mt-2">
                <audio controls className="w-full rounded bg-[#282828]">
                  <source src={currentTrack.audio_file} />
                </audio>
                {audioDuration && (
                  <p className="text-sm text-gray-400 mt-2">Thời lượng: {audioDuration}</p>
                )}
              </div>
            )
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
          {videoFile ? (
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
          ) : (
            currentTrack.video_file && (
              <div className="mt-2">
                <video controls className="w-full rounded bg-[#282828]">
                  <source src={currentTrack.video_file} />
                </video>
              </div>
            )
          )}
        </label>

        <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
          Ảnh bìa (jpg, png, ...)
          {/* <input
            type="url"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
            placeholder="Nhập URL ảnh bài hát (tùy chọn)"
            disabled={loading || img}
            className="p-3 rounded bg-[#282828] text-white border border-gray-700 placeholder-gray-400 focus:border-green-500 outline-none transition"
          /> */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImg(e.target.files[0])}
            disabled={loading}
            className="text-white"
          />
          {img ? (
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
          ) : (
            imgUrl ? (
              <div className="mt-2">
                <img
                  src={imgUrl}
                  alt="URL Preview"
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            ) : (
              currentTrack.img && (
                <div className="mt-2">
                  <img
                    src={currentTrack.img}
                    alt="Current cover"
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )
            )
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
            {loading ? "Đang cập nhật..." : "Cập nhật bài hát"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTrack;

// import { toast } from "react-toastify"; // Thêm import

// export default function EditTrack() {
//     const [title, setTitle] = useState("");
//     const [albumId, setAlbumId] = useState("");
//     const [audioFile, setAudioFile] = useState(null);
//     const [videoFile, setVideoFile] = useState(null);
//     const [img, setImg] = useState("");
//     const [albums, setAlbums] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [fetching, setFetching] = useState(true);
//     const navigate = useNavigate();
//     const { songId } = useParams();

//     useEffect(() => {
//         const fetchData = async () => {
//             const userData = JSON.parse(localStorage.getItem("userData"));
//             const token = userData?.token;
//             if (!token) {
//                 console.error("No token found");
//                 toast.error("Vui lòng đăng nhập với quyền admin.");
//                 navigate("/login");
//                 return;
//             }
//             try {
//                 setFetching(true);
//                 const songRes = await axios.get(`http://localhost:8000/spotify_app/songs/${songId}`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 const songData = songRes.data;
//                 setTitle(songData.title || "");
//                 setAlbumId(songData.album?._id || "");
//                 setImg(songData.img || "");

//                 const albumsRes = await axios.get("http://localhost:8000/spotify_app/albums/", {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 console.log("Albums response:", albumsRes.data);
//                 setAlbums(Array.isArray(albumsRes.data) ? albumsRes.data : []);
//             } catch (error) {
//                 console.error("Lỗi tải dữ liệu:", error.response?.data);
//                 toast.error(error.response?.data?.error || "Không tải được dữ liệu bài hát hoặc album.");
//                 navigate("/admin/tracks");
//             } finally {
//                 setFetching(false);
//             }
//         };
//         fetchData();
//     }, [navigate, songId]);

//     const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!title.trim()) {
//             toast.error("Tên bài hát không được để trống!");
//             return;
//         }
//         if (albumId && !isValidObjectId(albumId)) {
//             toast.error("ID album không hợp lệ!");
//             return;
//         }
//         if (audioFile && !audioFile.type.startsWith("audio/")) {
//             toast.error("File âm thanh không hợp lệ. Vui lòng chọn file MP3, WAV, v.v.");
//             return;
//         }
//         if (videoFile && !videoFile.type.startsWith("video/")) {
//             toast.error("File video không hợp lệ. Vui lòng chọn file MP4, v.v.");
//             return;
//         }

//         const userData = JSON.parse(localStorage.getItem("userData"));
//         const token = userData?.token;
//         if (!token) {
//             console.error("No token found for update");
//             toast.error("Vui lòng đăng nhập với quyền admin.");
//             navigate("/login");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("title", title);
//         if (albumId) formData.append("album_id", albumId); // Sửa từ "album" thành "album_id"
//         if (audioFile) formData.append("audio_file", audioFile);
//         if (videoFile) formData.append("video_file", videoFile);
//         if (img.trim()) formData.append("img", img);

//         for (let [key, value] of formData.entries()) {
//             console.log(`FormData: ${key} =`, value);
//         }

//         setLoading(true);
//         try {
//             const res = await axios.put(`http://localhost:8000/spotify_app/songs/update/${songId}/`, formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             console.log("Update response:", res.data);
//             toast.success("Cập nhật bài hát thành công!");
//             navigate("/admin/tracks");
//         } catch (error) {
//             console.error("Error updating track:", error.response?.data);
//             let errorMsg = error.response?.data?.error || "Cập nhật bài hát thất bại.";
//             if (error.response?.status === 401) {
//                 toast.error("Bạn không có quyền admin hoặc token không hợp lệ.");
//                 navigate("/login");
//             } else if (error.response?.status === 404) {
//                 toast.error("Bài hát không tồn tại.");
//             } else if (error.response?.status === 400) {
//                 errorMsg = Object.entries(error.response?.data?.details || {})
//                     .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`)
//                     .join("; ");
//                 toast.error(`Lỗi: ${errorMsg}`);
//             } else {
//                 toast.error(`Lỗi: ${errorMsg}`);
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (fetching) {
//         return (
//             <div className="p-6 max-w-md mx-auto text-white">
//                 <h1 className="text-3xl font-bold mb-6">Chỉnh sửa bài hát</h1>
//                 <p className="text-gray-500 animate-pulse">Đang tải dữ liệu...</p>
//             </div>
//         );
//     }

//     return (
//         <div className="p-6 max-w-md mx-auto text-white">
//             <h1 className="text-3xl font-bold mb-6">Chỉnh sửa bài hát</h1>
//             <form
//                 onSubmit={handleSubmit}
//                 className="bg-[#121212] p-8 rounded-lg flex flex-col gap-6"
//             >
//                 <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
//                     Tên bài hát
//                     <input
//                         type="text"
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         placeholder="Nhập tên bài hát"
//                         required
//                         disabled={loading}
//                         className="p-3 rounded bg-[#282828] text-white border border-gray-700 placeholder-gray-400 focus:border-green-500 outline-none transition"
//                     />
//                 </label>
//                 <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
//                     Album
//                     <select
//                         value={albumId}
//                         onChange={(e) => setAlbumId(e.target.value)}
//                         disabled={loading || albums.length === 0}
//                         className="p-3 rounded bg-[#282828] text-white border border-gray-700 focus:border-green-500 outline-none transition"
//                     >
//                         <option value="">-- Chọn album (tùy chọn) --</option>
//                         {albums.map((album) => (
//                             <option key={album._id} value={album._id}>
//                                 {album.album_name || "Không tên"} (ID: {album._id})
//                             </option>
//                         ))}
//                     </select>
//                 </label>
//                 <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
//                     File âm thanh (mp3, wav, ...)
//                     <input
//                         type="file"
//                         accept="audio/*"
//                         onChange={(e) => setAudioFile(e.target.files[0])}
//                         disabled={loading}
//                         className="text-white"
//                     />
//                 </label>
//                 <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
//                     File video (mp4, ...)
//                     <input
//                         type="file"
//                         accept="video/*"
//                         onChange={(e) => setVideoFile(e.target.files[0])}
//                         disabled={loading}
//                         className="text-white"
//                     />
//                 </label>
//                 <label className="flex flex-col gap-2 text-gray-300 text-sm font-medium">
//                     URL ảnh bài hát (jpg, png, ...)
//                     <input
//                         type="url"
//                         value={img}
//                         onChange={(e) => setImg(e.target.value)}
//                         placeholder="Nhập URL ảnh bài hát (tùy chọn)"
//                         disabled={loading}
//                         className="p-3 rounded bg-[#282828] text-white border border-gray-700 placeholder-gray-400 focus:border-green-500 outline-none transition"
//                     />
//                 </label>
//                 <div className="flex justify-end gap-4">
//                     <button
//                         type="button"
//                         onClick={() => navigate("/admin/tracks")}
//                         disabled={loading}
//                         className="text-gray-400 hover:text-white transition"
//                     >
//                         Hủy
//                     </button>
//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-6 py-3 rounded-full font-semibold transition"
//                     >
//                         {loading ? "Đang cập nhật..." : "Cập nhật bài hát"}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }   

