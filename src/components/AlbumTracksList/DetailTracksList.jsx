// File này dùng để hiển thị danh sách bài hát trong album, playlist, và bài hát đã thích từ api của hệ thống
import React, { useState, useEffect, useContext } from "react";
import { PlayerContext } from "../../context/PlayerContext/PlayerContext";
import { useParams } from "react-router-dom";
import CustomScrollbar from "../Scrollbar/CustomScrollbar";
import { assets } from "@/assets/assets";
import PlayButton from "../Button/PlayButton";
import { RenderIcon } from "../Button/RenderIcon";
import { CiSaveDown1 } from "react-icons/ci";
import { HiDotsHorizontal } from "react-icons/hi";
import LoadingSpinner from "../Loading/LoadingSpinner";
import Cookies from "js-cookie";
import { getTracksListByPlaylistId } from "@/services/SpotifyAppService/TracksListService";
import { IoPlay } from "react-icons/io5";
const DetailTracksList = () => {
  const { id: typeId } = useParams();
  const [albumData, setAlbumData] = useState(null);
  const [tracksListData, setTracksListData] = useState(null);
  const [artistInfo, setArtistInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [bestImage, setBestImage] = useState({
    url: "/default-image.png",
    width: 60,
    height: 60,
  });
  const { play, nowPlaying, playerState } = useContext(PlayerContext);
  const [hoveredTrackId, setHoveredTrackId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = Cookies.get("access_token");
      try {
        const data = await getTracksListByPlaylistId(typeId, accessToken);
        if (data.success) {
          setAlbumData(data.Playlist);
          setTracksListData(data);
          setCurrentTrackId(data.Playlist?.tracks?.[0]?.id || null); // set track đầu tiên làm track hiện tại
          setLoading(false);
          getBestImage(data.Playlist?.image || assets.avatar);
        } else {
          setError("Không lấy được dữ liệu playlist");
          setLoading(false);
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [typeId]);

  // Hàm chọn ảnh phù hợp
  const getBestImage = (images) => {
    if (!images || images.length === 0) {
      setBestImage({ url: "/default-image.png", width: 50, height: 50 });
    }

    const screenWidth = window.innerWidth;
    console.log("screenWidth", screenWidth);
    let selectedImage = {};

    // Tùy theo độ rộng màn hình, lấy ảnh phù hợp
    if (screenWidth > 1024) {
      // Màn hình lớn (desktop)
      selectedImage = { url: images[0].url, width: 60, height: 60 } || {
        url: "/default-image.png",
        width: 60,
        height: 60,
      };
    } else if (screenWidth > 840) {
      // Màn hình trung bình (tablet)
      selectedImage = { url: images[1].url, width: 50, height: 50 } || {
        url: "/default-image.png",
        width: 50,
        height: 50,
      };
    } else {
      // Màn hình nhỏ (mobile)
      selectedImage = { url: images[2].url, width: 40, height: 40 } || {
        url: "/default-image.png",
        width: 40,
        height: 40,
      };
    }

    // Cập nhật state với ảnh đã chọn
    setBestImage(selectedImage);
  };

  // Cập nhật ảnh khi resize màn hình
  useEffect(() => {
    const handleResize = () => {
      if (albumData) {
        getBestImage(albumData.images);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [albumData]);

  const formatDuration = (ms) => {
    const hours = Math.floor(ms / 3600000); // 1 giờ = 3600000ms
    const minutes = Math.floor((ms % 3600000) / 60000); // 1 phút = 60000ms

    // Trả về chuỗi dạng "giờ phút giây"
    let result = "";
    if (hours > 0) {
      result += `${hours} giờ`;
    }
    if (minutes > 0) {
      if (result) result += " "; // Thêm khoảng trắng nếu đã có phần giờ
      result += `${minutes} phút`;
    }
    return result;
  };

  // const formatDurationForEachSong = (ms) => {
  //   const minutes = Math.floor(ms / 60000);
  //   const seconds = Math.floor((ms % 60000) / 1000);
  //   return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  // };
  const formatDurationFromHHMMSS = (timeStr) => {
    // Tách theo dấu ":"
    const parts = timeStr.split(":").map(Number);

    let totalSeconds = 0;

    if (parts.length === 3) {
      // HH:MM:SS
      totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      // MM:SS
      totalSeconds = parts[0] * 60 + parts[1];
    } else {
      // Không đúng định dạng
      return "0:00";
    }

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const getCredits = (trackArtists) => {
    if (trackArtists.length <= 1) return "";
    return trackArtists
      .slice(1)
      .map((artist) => artist.name)
      .join(", ");
  };

  // const handlePlayButtonClick = (trackId) => {
  //   if (isPlaying && currentTrackId === trackId) {
  //     setIsPlaying(false);
  //   } else {
  //     setIsPlaying(true);
  //     setCurrentTrackId(trackId);
  //   }
  // };
  // Hàm tách chuỗi date chỉ lấy năm
  const getYearFromDate = (dateString) => {
    const date = new Date(dateString); // Chuyển chuỗi thành đối tượng Date
    return date.getFullYear(); // Trả về năm từ đối tượng Date
  };

  // Hàm phát bài hát
const handlePlayTrack = (track) => {
    play({
      _id: track._id,
      title: track.title,
      artist: track.artists?.map((artist) => artist.name).join(", ") || "Nghệ sĩ",
      img: track.img || bestImage.url,
      audioUrl: track.audio_file, // Đảm bảo đúng key
      duration: track.duration,
    });
  };

  const isTrackPlaying = (trackId) => {
    return playerState.currentTrack?._id === trackId && playerState.isPlaying;
  };

  if (loading)
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full flex flex-col items-center justify-center bg-gray-900 bg-opacity-90 z-50">
        {/* <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div> */}
        <LoadingSpinner size="xl" color="primary" />
      </div>
    );
  if (error) return <div className="text-red-500 p-4">Lỗi: {error}</div>;
  if (!tracksListData)
    return <div className="text-white p-4">Không tìm thấy dữ liệu album</div>;
  console.log("image", bestImage); // Kiểm tra ảnh bìa album
  console.log("albumData", albumData); // Kiểm tra danh sách bài hát

  // Tính tổng thời gian album (tính bằng mili giây)
  const totalDurationMs = tracksListData.Playlist?.songs?.reduce(
    (total, track) => total + track.duration_ms,
    0
  );

  // Tính tổng thời gian album sau khi tính toán
  const formattedTotalDuration = formatDuration(totalDurationMs);
  return (
    <CustomScrollbar className="text-white rounded flex flex-col h-full bg-gradient-to-b from-[#0d1a2d] to-black">
      {/* Album Header */}
      <div className="w-full pb-4">
        <div className="flex items-end gap-6 px-6 pt-8">
          <div className="flex-shrink-0">
            <img
              src={bestImage.url || "default-image.png"}
              alt="Ảnh bìa album"
              className={`w-${bestImage.width || 50} h-${
                bestImage.height || 50
              } md:w-30 md:h-30 object-cover shadow-xl rounded-md`}
            />
          </div>
          {albumData && (
            <div className="flex flex-col justify-end">
              <span className="text-xs uppercase text-[#b3b3b3] mb-2">
                {albumData.type}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                {albumData.name}
              </h1>
              <div className="flex items-center gap-2 text-sm text-[#b3b3b3]">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <img
                    src={artistInfo?.images[0].url || "default-image.png"}
                    alt="Nghệ sĩ"
                    className="w-8 h-8 object-cover"
                  />
                </div>

                <span>
                  {/* {albumData?.artists[0]?.name || ""} •{" "} */}
                  {/* {getYearFromDate(albumData.release_date)} •{" "} */}
                  {albumData.total_songs} bài hát,{" "}
                  {formattedTotalDuration || ""}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-4 py-4 p-20">
          <div className="relative">
            {/* <PlayButton
              isActive={true}
              size="medium"
              itemId={2}
              itemType="album"
              variant="list"
              isPlaying={isPlaying}
              onTogglePlay={handlePlayTrack}
            /> */}
          </div>

          <button className="hover:scale-110 transition-transform">
            <RenderIcon
              iconName={assets.shuffle_icon}
              altText="Xáo trộn"
              className="w-6 h-6"
            />
          </button>
          <button className="hover:scale-110 transition-transform">
            <RenderIcon
              iconName={assets.plus_icon}
              altText="Thêm"
              className="w-6 h-6"
            />
          </button>
          <button className="hover:scale-110 transition-transform">
            <RenderIcon
              icon={CiSaveDown1}
              altText="Tải xuống"
              className="w-8 h-8 hover:text-white"
            />
          </button>
          <button className="hover:scale-110 transition-transform">
            <RenderIcon
              icon={HiDotsHorizontal}
              altText="Thêm tùy chọn"
              className="w-8 h-8 hover:text-white"
            />
          </button>
        </div>
      </div>

      <div className="px-6">
        {/* Header - Tiêu đề cột */}
        <div className="grid grid-cols-12 gap-4 items-center text-gray-400 border-b border-gray-800 py-1">
          <div className="col-span-1 text-center text-sm font-medium">#</div>
          <div className="col-span-6 text-sm font-medium pl-2">Tiêu đề</div>
          <div className="col-span-3 text-sm font-medium pl-2">Album</div>
          <div className="col-span-2 text-right text-sm font-medium pr-12">
            Thời gian
          </div>
        </div>

        {/* Danh sách bài hát */}
        <div className="">
          {tracksListData.Playlist?.songs?.map((track, index) => (
            <div
              key={track._id}
              className={`grid grid-cols-12 gap-4 items-center py-3 group hover:bg-gray-900/50 transition-colors
                ${isTrackPlaying(track._id) ? "bg-gray-800/50" : ""}`}
              onClick={() => handlePlayTrack(track)}
              onMouseEnter={() => setHoveredTrackId(track._id)}
              onMouseLeave={() => setHoveredTrackId(null)}
            >
              {/* Số thứ tự */}
              {/* <div className="col-span-1 text-center text-gray-400 group-hover:text-white">
                {index + 1}
              </div> */}
              <div className="col-span-1 text-center text-gray-400 group-hover:text-white">
                {isTrackPlaying(track._id) ? (
                  <div className="flex justify-center">
                    <div className="w-4 h-4 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-2 bg-green-500 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  index + 1
                )}
              </div>

              {/* Tiêu đề bài hát */}
              <div className="col-span-6 flex items-center pl-2 gap-3">
                <div className="relative w-10 h-10">
                  <img
                    src={track.img || assets.avatar}
                    alt={track.title}
                    className="w-10 h-10 object-cover rounded-md"
                  />
                  {/* Nút Play xuất hiện khi hover */}
                  {/* Nút Play - HIỂN THỊ KHI HOVER HOẶC ĐANG PHÁT */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-md
                      ${
                        hoveredTrackId === track._id ||
                        isTrackPlaying(track._id)
                          ? "opacity-100"
                          : "opacity-0"
                      } transition-opacity`}
                  >
                    <IoPlay
                      size={20}
                      className={`text-white ${
                        isTrackPlaying(track._id) ? "text-green-500" : ""
                      }`}
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <p
                    className={`font-medium truncate ${
                      isTrackPlaying(track._id)
                        ? "text-green-500"
                        : "text-white"
                    }`}
                  >
                    {track.title}
                  </p>
                  <p className="text-gray-400 text-sm truncate">
                    {track.artists?.map((artist) => artist.name).join(", ") ||
                      "Nghệ sĩ"}
                  </p>
                </div>
              </div>
              {/* Album */}
              <div className="col-span-3 text-gray-400 group-hover:text-white pl-2 truncate">
                {track.artists?.name || "Album"}
                {/* {track.artists?.length > 1 && `, ${getCredits(track.artists)}`} */}
              </div>

              {/* Thời gian */}
              <div className="col-span-1 text-right text-gray-400 group-hover:text-white pr-2">
                {formatDurationFromHHMMSS(track.duration)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </CustomScrollbar>
  );
};

export default DetailTracksList;
