import React, { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../../../../context/PlayerContext/PlayerContext";
import { assets } from "@/assets/assets";
import { RenderIcon } from "../../../../components/Button/RenderIcon";
import TrackInfo from "./TrackInfo";
import PlayButton from "../../../../components/Button/PlayButton";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { getTracksListByPlaylistId } from "@/services/SpotifyAppService/TracksListService";
import { TiVolumeMute } from "react-icons/ti";

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const NowPlayingBar = () => {
  const { id: typeId } = useParams();
  const {
    playerState,
    play,
    pause,
    resume,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
  } = useContext(PlayerContext);

  const [tracksList, setTracksList] = useState([]);
  const [localVolume, setLocalVolume] = useState(70);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off"); // 'off', 'all', 'one'

  useEffect(() => {
    const fetchTracks = async () => {
      const accessToken = Cookies.get("access_token");
      try {
        const data = await getTracksListByPlaylistId(typeId, accessToken);
        if (data.success) {
          setTracksList(data.Playlist?.songs || []);
        }
      } catch (error) {
        console.error("Failed to fetch tracks:", error);
      }
    };

    fetchTracks();
  }, [typeId]);

  // Đồng bộ volume từ context
  useEffect(() => {
    if (playerState.volume !== undefined) {
      setLocalVolume(playerState.volume);
    }
  }, [playerState.volume]);

  const handlePlayTrack = (index = 0) => {
    if (!tracksList || tracksList.length === 0) return;

    // Đảm bảo index nằm trong khoảng hợp lệ
    const safeIndex = Math.max(0, Math.min(index, tracksList.length - 1));
    const selectedTrack = tracksList[safeIndex];

    if (!selectedTrack) return;

    // Kiểm tra nếu đang phát cùng track
    if (playerState.currentTrack?._id === selectedTrack._id) {
      playerState.isPlaying ? pause() : resume();
    } else {
      // Phát track mới và cập nhật currentIndex
      play(
        {
          _id: selectedTrack._id,
          title: selectedTrack.title,
          artist:
            selectedTrack.artists?.map((a) => a.name).join(", ") || "Nghệ sĩ",
          img: selectedTrack.img || assets.avatar,
          audioUrl: selectedTrack.audio_file,
          duration: selectedTrack.duration,
        },
        safeIndex
      ); // Truyền index vào hàm play
    }
  };

  const handleShuffle = () => {
    setIsShuffled(!isShuffled);
    toggleShuffle();
  };

  const handleRepeat = () => {
    const modes = ["off", "all", "one"];
    const nextMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
    setRepeatMode(nextMode);
    toggleRepeat(nextMode);
  };

  // Xử lý seek
  const handleSeek = (e) => {
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const seekPercentage = offsetX / rect.width;
    const seekTime = seekPercentage * playerState.duration;

    // Gọi hàm seek từ context nếu có
    if (seek) seek(seekTime);
  };

  const handleVolumeChange = (e) => {
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newVolume = Math.min(100, Math.max(0, (offsetX / rect.width) * 100));

    setLocalVolume(newVolume);
    setVolume(newVolume);
  };

  const handleMuteToggle = () => {
    const newVolume = localVolume > 0 ? 0 : 70;
    setLocalVolume(newVolume);
    setVolume(newVolume);
  };

  const progress =
    playerState.duration > 0
      ? (playerState.currentTime / playerState.duration) * 100
      : 0;

  return (
    <div
      className={`h-[12%] fixed bottom-0 right-0 w-full z-50 px-6 py-3
      border-t border-gray-800 shadow-xl
      transition-all duration-500 ease-in-out
      ${
        playerState.isPlaying
          ? "bg-gradient-to-r from-black via-[#1e1b4b] to-black"
          : "bg-gradient-to-r from-gray-900 via-black to-gray-900"
      }`}
    >
      <div className="flex items-center justify-between h-full max-w-8xl mx-auto">
        {/* Track info */}
        <TrackInfo track={playerState.currentTrack} />
        {/* Main controls */}
        <div className="flex flex-col items-center w-2/4 max-w-[600px]">
          <div className="flex items-center gap-4">
            {/* Nút xáo trộn */}
            <button
              onClick={handleShuffle}
              className={`${
                isShuffled ? "text-pink-400" : "text-gray-400"
              } hover:scale-110 transition-transform`}
              title="Phát ngẫu nhiên"
            >
              <RenderIcon iconName={assets.shuffle_icon} className="w-4 h-4" />
            </button>

            {/* Nút bài trước */}
            <button
              onClick={() => handlePlayTrack(playerState.currentIndex - 1)}
              className="text-gray-400 hover:text-pink-400 hover:scale-110 transition-transform"
              title="Bài trước"
            >
              <RenderIcon iconName={assets.prev_icon} className="w-4 h-4" />
            </button>

            {/* Nút play/pause */}
            <div className="relative p-[23px]">
              <PlayButton
                isActive={true}
                size="small"
                isBar={true}
                isPlaying={playerState.isPlaying}
                onTogglePlay={() =>
                  handlePlayTrack(playerState.currentIndex || 0)
                }
              />
            </div>

            {/* Nút bài tiếp */}
            <button
              onClick={() => handlePlayTrack(playerState.currentIndex + 1)}
              className="text-gray-400 hover:text-pink-400 hover:scale-110 transition-transform"
              title="Bài tiếp"
            >
              <RenderIcon iconName={assets.next_icon} className="w-4 h-4" />
            </button>

            {/* Nút lặp lại */}
            <button
              onClick={handleRepeat}
              className={`${
                repeatMode !== "off" ? "text-pink-400" : "text-gray-400"
              } hover:scale-110 transition-transform`}
              title={
                repeatMode === "one" ? "Lặp lại một bài" : "Lặp lại tất cả"
              }
            >
              <RenderIcon
                iconName={
                  repeatMode === "one" ? assets.loop_icon : assets.loop_icon
                }
                className="w-4 h-4"
              />
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-400">
              {formatTime(playerState.currentTime)}
            </span>
            <div
              className="relative w-full h-1 bg-gray-600 rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div
                className="absolute top-0 left-0 h-full bg-pink-400 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">
              {formatTime(playerState.duration)}
            </span>
          </div>
        </div>

        {/* Volume controls */}
        <div className="flex items-center justify-end w-1/4 min-w-[180px] gap-3">
          {/* Các nút phụ khác... */}
          <button
            className="text-gray-400 hover:text-pink-400 hover:scale-110 transition-transform"
            title="Chế độ xem đang phát"
            aria-label="Chế độ xem đang phát"
          >
            <RenderIcon
              iconName={assets.plays_icon}
              altText="Chế độ xem đang phát"
              className="w-4 h-4"
            />
          </button>
          <button
            className="text-gray-400 hover:text-pink-400 hover:scale-110 transition-transform"
            title="Lời bài hát"
            aria-label="Lời bài hát"
          >
            <RenderIcon
              iconName={assets.mic_icon}
              altText="Lời bài hát"
              className="w-4 h-4"
            />
          </button>
          <button
            className="text-gray-400 hover:text-pink-400 hover:scale-110 transition-transform"
            title="Danh sách phát"
            aria-label="Danh sách phát"
          >
            <RenderIcon
              iconName={assets.queue_icon}
              altText="Danh sách phát"
              className="w-4 h-4"
            />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMuteToggle}
              className="text-gray-400 hover:text-pink-400"
            >
              {localVolume > 0 ? (
                <RenderIcon iconName={assets.volume_icon} className="w-4 h-4" />
              ) : (
                <RenderIcon iconName={assets.x_volume} className="w-4 h-4" />
              )}
            </button>
            <div
              className="w-24 h-1 bg-gray-600 rounded-full cursor-pointer"
              onClick={handleVolumeChange}
            >
              <div
                className="h-full bg-pink-400 rounded-full transition-all"
                style={{ width: `${localVolume}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NowPlayingBar;
