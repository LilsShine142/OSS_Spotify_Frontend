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
import TrackListHeader from "./TrackListHeader";
import TrackItem from "./TrackItem";
import { Trackcolumns } from "@/lib/constaints/constants";

const DetailTracksList = () => {
  const { id: typeId } = useParams();
  const [albumData, setAlbumData] = useState(null);
  const [tracksListData, setTracksListData] = useState(null);
  const [artistInfo, setArtistInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bestImage, setBestImage] = useState({
    url: "/default-image.png",
    width: 60,
    height: 60,
  });
  const { playerState, play, pause, resume, togglePlayPause } =
    useContext(PlayerContext);
  const [hoveredTrackId, setHoveredTrackId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = Cookies.get("access_token");
      try {
        const data = await getTracksListByPlaylistId(typeId, accessToken);
        if (data.success) {
          setAlbumData(data.Playlist);
          setTracksListData(data);
          // setCurrentTrackId(data.Playlist?.tracks?.[0]?.id || null); // set track đầu tiên làm track hiện tại
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

  const getCredits = (trackArtists) => {
    if (trackArtists.length <= 1) return "";
    return trackArtists
      .slice(1)
      .map((artist) => artist.name)
      .join(", ");
  };

  // Hàm tách chuỗi date chỉ lấy năm
  const getYearFromDate = (dateString) => {
    const date = new Date(dateString); // Chuyển chuỗi thành đối tượng Date
    return date.getFullYear(); // Trả về năm từ đối tượng Date
  };

  const handlePlayTrack = (track, currentTrackindex) => {
    console.log("Playing track._id:", track._id);
    console.log("playerState.currentTrack", playerState.currentTrack);
    if (playerState.currentTrack?._id === track._id) {
      console.log("playerState.isPlaying", playerState.isPlaying);
      // Nếu đang phát cùng track thì toggle play/pause
      console.log("Đang phát track này");
      playerState.isPlaying ? pause() : resume();
    } else {
      // Nếu là track khác thì phát track mới
      play(
        {
          _id: track._id,
          title: track.title,
          artist: track.artists?.map((a) => a.name).join(", ") || "Nghệ sĩ",
          img: track.img || bestImage.url,
          audioUrl: track.audio_file,
          duration: track.duration,
        },
        currentTrackindex
      );
    }
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
            <PlayButton
              isActive={true}
              size="medium"
              // itemId={2}
              // itemType="album"
              // variant="list"
              isPlaying={playerState.isPlaying}
              onTogglePlay={() => {
                handlePlayTrack(playerState.currentIndex || 0);
              }}
            />
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

      {/* BẢNG DANH SÁCH BÀI HÁT */}
      <div className="px-6">
        <TrackListHeader columns={Trackcolumns} />
        <div>
          {tracksListData.Playlist?.songs?.map((track, index) => (
            <TrackItem
              key={track._id}
              track={track}
              index={index}
              isPlaying={playerState.isPlaying}
              isCurrentTrack={isTrackPlaying(track._id)}
              onPlayTrack={() => handlePlayTrack(track, index)}
              onMouseEnter={setHoveredTrackId}
              onMouseLeave={() => setHoveredTrackId(null)}
              hoveredTrackId={hoveredTrackId}
            />
          ))}
        </div>
      </div>
    </CustomScrollbar>
  );
};

export default DetailTracksList;
