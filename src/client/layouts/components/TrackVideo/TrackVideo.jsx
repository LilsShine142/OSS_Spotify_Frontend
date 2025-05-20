// import React, { useState, useEffect, useContext } from "react";
// import { PlayerContext } from "../../../../context/PlayerContext/PlayerContext";
// import { useParams } from "react-router-dom";
// import CustomScrollbar from "../../../../components/Scrollbar/CustomScrollbar";
// import { assets } from "@/assets/assets";
// import PlayButton from "../../../../components/Button/PlayButton";
// import { RenderIcon } from "../../../../components/Button/RenderIcon";
// import { CiSaveDown1, CiVideoOn } from "react-icons/ci";
// import { HiDotsHorizontal } from "react-icons/hi";
// import { FaDownload } from "react-icons/fa";
// import LoadingSpinner from "../../../../components/Loading/LoadingSpinner";
// import Cookies from "js-cookie";
// import { getTrackVideoById } from "@/services/SongService/songService";
// import toast from "react-hot-toast";

// const TrackVideo = () => {
//   const { id: trackId } = useParams();
//   const [songData, setSongData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { playerState, play, pause, resume } = useContext(PlayerContext);
//   const [showDownloadModal, setShowDownloadModal] = useState(false);
//   const [showVideoDownloadModal, setShowVideoDownloadModal] = useState(false);
//   const [isVideoPlaying, setIsVideoPlaying] = useState(false);

//   useEffect(() => {
//     const fetchSongData = async () => {
//       const accessToken = Cookies.get("access_token");
//       try {
//         const response = await getTrackVideoById(trackId, accessToken);

//         if (response) {
//           setSongData(response);
//         } else {
//           setError("Không lấy được dữ liệu bài hát");
//         }
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSongData();
//   }, [trackId]);

//   const handlePlayTrack = () => {
//     if (!songData) return;

//     if (playerState.currentTrack?._id === songData._id) {
//       playerState.isPlaying ? pause() : resume();
//     } else {
//       play(
//         {
//           _id: songData._id,
//           title: songData.title,
//           artist: songData.artists?.map((a) => a.name).join(", ") || "Nghệ sĩ",
//           img: songData.image || assets.avatar,
//           audioUrl: songData.audio_file,
//           duration: songData.duration,
//         },
//         0
//       );
//     }
//   };

//   const isTrackPlaying = () => {
//     return (
//       songData &&
//       playerState.currentTrack?._id === songData._id &&
//       playerState.isPlaying
//     );
//   };

//   const openDownloadModal = () => {
//     setShowDownloadModal(true);
//   };

//   const openVideoDownloadModal = () => {
//     setShowVideoDownloadModal(true);
//   };

//   const handleDownload = async (type = "audio") => {
//     const fileUrl = type === "audio" ? songData.audio_file : songData.video_url;
//     const fileType = type === "audio" ? "audio/mp3" : "video/mp4";
//     const fileName = `${songData.title}.${type === "audio" ? "mp3" : "mp4"}`;

//     if (!songData || !fileUrl) {
//       toast.error(
//         `Không tìm thấy file ${type === "audio" ? "audio" : "video"} để tải!`
//       );
//       type === "audio"
//         ? setShowDownloadModal(false)
//         : setShowVideoDownloadModal(false);
//       return;
//     }

//     try {
//       toast.loading(`Đang tải ${type === "audio" ? "audio" : "video"}...`, {
//         id: songData._id + type,
//       });

//       const response = await fetch(fileUrl, {
//         method: "GET",
//       });

//       if (!response.ok)
//         throw new Error(
//           `Không thể tải file ${type === "audio" ? "audio" : "video"}`
//         );

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = fileName;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);

//       toast.success(`Tải ${type === "audio" ? "audio" : "video"} thành công!`, {
//         id: songData._id + type,
//       });
//     } catch (error) {
//       toast.error(
//         `Tải ${type === "audio" ? "audio" : "video"} thất bại: ${
//           error.message
//         }`,
//         {
//           id: songData._id + type,
//         }
//       );
//     } finally {
//       type === "audio"
//         ? setShowDownloadModal(false)
//         : setShowVideoDownloadModal(false);
//     }
//   };

//   const formatDuration = (durationStr) => {
//     if (!durationStr) return "00:00";
//     const [hours, minutes, seconds] = durationStr.split(":").map(Number);
//     return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   const getYearFromDate = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.getFullYear();
//   };

//   const toggleVideoPlayback = () => {
//     const videoElement = document.getElementById("song-video");
//     if (videoElement) {
//       if (isVideoPlaying) {
//         videoElement.pause();
//       } else {
//         videoElement.play();
//       }
//       setIsVideoPlaying(!isVideoPlaying);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full flex flex-col items-center justify-center bg-gray-900 bg-opacity-90 z-50">
//         <LoadingSpinner size="xl" color="primary" />
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="text-red-500 p-4">Lỗi: {error}</div>;
//   }

//   if (!songData) {
//     return <div className="text-white p-4">Không tìm thấy dữ liệu bài hát</div>;
//   }

//   function fixCloudinaryVideoUrl(badUrl) {
//     // Kiểm tra nếu URL đã đúng định dạng thì trả về luôn
//     if (badUrl.startsWith("https://res.cloudinary.com")) {
//       return badUrl;
//     }

//     // Xử lý URL bị lỗi
//     if (badUrl.startsWith("/media/https%3A")) {
//       // Bỏ phần '/media/' ở đầu
//       const urlWithoutMedia = badUrl.replace("/media/", "");

//       // Decode URI component để chuyển %3A back thành ':'
//       const decodedUrl = decodeURIComponent(urlWithoutMedia);

//       // Thay thế 'https:/' thành 'https://' (do bị mất 1 slash khi encode)
//       const fixedUrl = decodedUrl.replace("https:/", "https://");

//       return fixedUrl;
//     }

//     // Trường hợp URL không nhận dạng được
//     console.error("URL không đúng định dạng:", badUrl);
//     return badUrl; // Hoặc return null tùy bạn muốn xử lý
//   }

//   return (
//     <>
//       <CustomScrollbar className="text-white rounded flex flex-col h-full bg-gradient-to-b from-[#0d1a2d] to-black">
//         {/* Song Header */}
//         <div className="w-full pb-4">
//           <div className="flex items-end gap-6 px-6 pt-8">
//             <div className="flex-shrink-0">
//               <img
//                 src={songData?.image || assets.avatar}
//                 alt={`Ảnh bìa ${songData?.title}`}
//                 className="w-50 h-50 md:w-60 md:h-60 object-cover shadow-xl rounded-md"
//               />
//             </div>
//             <div className="flex flex-col justify-end">
//               <span className="text-xs uppercase text-[#b3b3b3] mb-2">
//                 BÀI HÁT
//               </span>
//               <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
//                 {songData?.title || "Không có tiêu đề"}
//               </h1>
//               <div className="flex items-center gap-2 text-sm text-[#b3b3b3]">
//                 {songData?.artists?.map((artist, index) => (
//                   <React.Fragment key={artist._id}>
//                     {index > 0 && <span>, </span>}
//                     <span>{artist.name}</span>
//                   </React.Fragment>
//                 ))}
//                 {songData?.duration && (
//                   <span>• {formatDuration(songData.duration)}</span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Video Player - HIỂN THỊ NGAY SAU HEADER */}
//         {songData?.video_file &&
//           (console.log("songData", songData),
//           (
//             <div className="px-6 pb-6">
//               <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
//                 <video
//                   id="song-video"
//                   src={fixCloudinaryVideoUrl(songData.video_file)}
//                   className="w-full h-full object-cover"
//                   controls
//                   poster={songData.image || assets.avatar}
//                 />
//               </div>
//             </div>
//           ))}
//       </CustomScrollbar>
//     </>
//   );
// };

// export default TrackVideo;

import React, { useState, useEffect, useContext, useCallback } from "react";
import { PlayerContext } from "../../../../context/PlayerContext/PlayerContext";
import { useParams } from "react-router-dom";
import CustomScrollbar from "../../../../components/Scrollbar/CustomScrollbar";
import { assets } from "@/assets/assets";
import PlayButton from "../../../../components/Button/PlayButton";
import { RenderIcon } from "../../../../components/Button/RenderIcon";
import { CiSaveDown1, CiVideoOn } from "react-icons/ci";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaDownload, FaPause, FaPlay } from "react-icons/fa";
import LoadingSpinner from "../../../../components/Loading/LoadingSpinner";
import Cookies from "js-cookie";
import { getTrackVideoById } from "@/services/SongService/songService";
import toast from "react-hot-toast";

const TrackVideo = () => {
  const { id: trackId } = useParams();
  const [songData, setSongData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { playerState, play, pause, resume } = useContext(PlayerContext);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showVideoDownloadModal, setShowVideoDownloadModal] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  // Hàm xử lý URL Cloudinary
  const fixCloudinaryUrl = useCallback((url) => {
    if (!url) return null;
    if (url.startsWith("https://res.cloudinary.com")) return url;
    if (url.startsWith("/media/https%3A")) {
      return decodeURIComponent(url.replace("/media/", "")).replace(
        "https:/",
        "https://"
      );
    }
    return url;
  }, []);

  // Hàm fetch dữ liệu bài hát
  const fetchSongData = useCallback(async () => {
    const accessToken = Cookies.get("access_token");
    try {
      setLoading(true);
      setError(null);

      const response = await getTrackVideoById(trackId, accessToken);
      if (response) {
        setSongData(response);
      } else {
        throw new Error("Không lấy được dữ liệu bài hát");
      }
    } catch (error) {
      setError(error.message);
      toast.error(`Lỗi khi tải dữ liệu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [trackId]);

  useEffect(() => {
    fetchSongData();
  }, [fetchSongData]);

  // Hàm xử lý phát nhạc
  const handlePlayTrack = useCallback(() => {
    if (!songData) return;

    if (playerState.currentTrack?._id === songData._id) {
      playerState.isPlaying ? pause() : resume();
    } else {
      play(
        {
          _id: songData._id,
          title: songData.title,
          artist: songData.artists?.map((a) => a.name).join(", ") || "Nghệ sĩ",
          img: songData.image || assets.avatar,
          audioUrl: songData.audio_file,
          duration: songData.duration,
        },
        0
      );
    }
  }, [songData, playerState, play, pause, resume]);

  // Hàm kiểm tra trạng thái phát
  const isTrackPlaying = useCallback(() => {
    return (
      songData &&
      playerState.currentTrack?._id === songData._id &&
      playerState.isPlaying
    );
  }, [songData, playerState]);

  // Hàm mở modal tải audio
  const openDownloadModal = useCallback(() => {
    if (!songData?.audio_file) {
      toast.error("Không tìm thấy file audio");
      return;
    }
    setShowDownloadModal(true);
  }, [songData]);

  // Hàm mở modal tải video
  const openVideoDownloadModal = useCallback(() => {
    if (!songData?.video_file) {
      toast.error("Không tìm thấy file video");
      return;
    }
    setShowVideoDownloadModal(true);
  }, [songData]);

  // Hàm xử lý tải file
  const handleDownload = useCallback(
    async (type = "audio") => {
      const fileUrl =
        type === "audio" ? songData?.audio_file : songData?.video_file;
      const fileName = `${songData?.title}.${type === "audio" ? "mp3" : "mp4"}`;

      if (!fileUrl) {
        toast.error(`Không tìm thấy file ${type} để tải!`);
        return false;
      }

      try {
        toast.loading(`Đang tải ${type}...`, {
          id: `${songData?._id}-${type}`,
        });

        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error(`Không thể tải file ${type}`);

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success(`Tải ${type} thành công!`, {
          id: `${songData?._id}-${type}`,
        });
        return true;
      } catch (error) {
        toast.error(`Tải ${type} thất bại: ${error.message}`, {
          id: `${songData?._id}-${type}`,
        });
        return false;
      } finally {
        type === "audio"
          ? setShowDownloadModal(false)
          : setShowVideoDownloadModal(false);
      }
    },
    [songData]
  );

  // Hàm điều khiển video
  const toggleVideoPlayback = useCallback(() => {
    const videoElement = document.getElementById("song-video");
    if (videoElement) {
      isVideoPlaying ? videoElement.pause() : videoElement.play();
      setIsVideoPlaying(!isVideoPlaying);
    }
  }, [isVideoPlaying]);

  // Hàm theo dõi tiến trình video
  const handleVideoProgress = useCallback((e) => {
    const video = e.target;
    const progress = (video.currentTime / video.duration) * 100;
    setVideoProgress(progress);
  }, []);

  // Format thời lượng
  const formatDuration = useCallback((durationStr) => {
    if (!durationStr) return "00:00";
    const [h, m, s] = durationStr.split(":").map(Number);
    return `${h}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900/90 z-50">
        <LoadingSpinner size="xl" color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <p>{error}</p>
        <button
          onClick={fetchSongData}
          className="mt-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!songData) {
    return <div className="p-4 text-white">Không tìm thấy dữ liệu bài hát</div>;
  }

  const fixedVideoUrl = fixCloudinaryUrl(songData.video_file);
  console.log("songData", songData);
  return (
    <>
      <CustomScrollbar className="flex flex-col h-full bg-gradient-to-b from-[#0d1a2d] to-black text-white rounded">
        {/* Header Section */}
        <div className="w-full pb-4">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 px-6 pt-8">
            <div className="w-40 h-40 md:w-60 md:h-60 flex-shrink-0">
              <img
                src={songData?.img || assets.avatar}
                alt={`Ảnh bìa ${songData.title}`}
                className="w-full h-full object-cover shadow-xl rounded-md"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <span className="text-xs uppercase text-gray-400 mb-2">
                BÀI HÁT
              </span>
              <h1 className="text-3xl md:text-5xl font-bold mb-2 text-white line-clamp-2">
                {songData.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm text-gray-400">
                {songData.artists?.map((artist, index) => (
                  <React.Fragment key={`artist-${artist._id}-${index}`}>
                    {index > 0 && <span>, </span>}
                    <span className="hover:text-white transition-colors">
                      {artist.name}
                    </span>
                  </React.Fragment>
                ))}
                {songData.duration && (
                  <span>• {formatDuration(songData.duration)}</span>
                )}
              </div>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex justify-center md:justify-start items-center gap-4 py-4 px-6 md:px-20">
            <button
              onClick={openDownloadModal}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Tải audio"
            >
              <CiSaveDown1 className="w-6 h-6" />
            </button>
            {fixedVideoUrl && (
              <button
                onClick={openVideoDownloadModal}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Tải video"
              >
                <CiVideoOn className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Video Section */}
        {fixedVideoUrl && (
          <div className="px-4 md:px-6 pb-6">
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group">
              <video
                id="song-video"
                src={fixedVideoUrl}
                className="w-full h-full object-cover"
                controls
                poster={songData?.img || assets.avatar}
                onTimeUpdate={handleVideoProgress}
                onClick={toggleVideoPlayback}
                crossOrigin="anonymous"
              />

              {/* Custom Video Controls */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={toggleVideoPlayback}
                  className="p-4 bg-black/50 rounded-full hover:bg-black/70 transition-all"
                >
                  {isVideoPlaying ? (
                    <FaPause className="w-8 h-8 text-white" />
                  ) : (
                    <FaPlay className="w-8 h-8 text-white" />
                  )}
                </button>
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Song Info Section */}
        <div className="px-4 md:px-6 py-4">
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
              Thông tin bài hát
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Nghệ sĩ</h3>
                <div className="flex flex-wrap gap-3">
                  {songData.artists?.map((artist) => (
                    <div
                      key={`artist-detail-${artist._id}`}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={artist.image || assets.avatar}
                        alt={artist.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{artist.name}</p>
                        {artist.genre && (
                          <p className="text-sm text-gray-400">
                            {artist.genre}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Thông tin khác</h3>
                <div className="space-y-3">
                  {songData.release_date && (
                    <div>
                      <p className="text-gray-400 text-sm">Ngày phát hành</p>
                      <p>
                        {new Date(songData.release_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {songData.duration && (
                    <div>
                      <p className="text-gray-400 text-sm">Thời lượng</p>
                      <p>{formatDuration(songData.duration)}</p>
                    </div>
                  )}
                  {songData.genre && (
                    <div>
                      <p className="text-gray-400 text-sm">Thể loại</p>
                      <p>{songData.genre}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lyrics */}
            {songData.lyrics && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3">Lời bài hát</h3>
                <div className="bg-gray-900/50 p-4 rounded-lg whitespace-pre-wrap font-sans text-gray-300">
                  {songData.lyrics}
                </div>
              </div>
            )}
          </div>
        </div>
      </CustomScrollbar>

      {/* Download Modals */}
      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        onConfirm={() => handleDownload("audio")}
        title="audio"
        fileName={`${songData.title}.mp3`}
      />

      {fixedVideoUrl && (
        <DownloadModal
          isOpen={showVideoDownloadModal}
          onClose={() => setShowVideoDownloadModal(false)}
          onConfirm={() => handleDownload("video")}
          title="video"
          fileName={`${songData.title}.mp4`}
        />
      )}
    </>
  );
};

// Component DownloadModal tách riêng
const DownloadModal = ({ isOpen, onClose, onConfirm, title, fileName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4">Xác nhận tải xuống</h2>
        <p className="text-gray-300 mb-6">
          Bạn có muốn tải {title} <strong>{fileName}</strong> không?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 flex items-center gap-2"
          >
            <FaDownload />
            Tải xuống
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackVideo;
