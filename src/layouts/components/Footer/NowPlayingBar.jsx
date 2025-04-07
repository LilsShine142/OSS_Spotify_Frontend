import React, { useState, useMemo, useContext } from "react";
import { assets, songsData, albumsData } from "../../../assets/assets";
import { RenderIcon } from "../../../components/Button/RenderIcon";
import PlayButton from "../../../components/Button/PlayButton";
import { PlayerContext } from "../../../context/PlayerContext/PlayerContext";

const NowPlayingBar = ({
  currentSongId,
  currentAlbumId,
  isPlaying: propIsPlaying,
  nowPlaying: propNowPlaying,
  setNowPlaying: propSetNowPlaying,
}) => {
  // Sử dụng context nếu có, nếu không thì dùng từ props
  const context = useContext(PlayerContext);
  const nowPlaying = context?.nowPlaying || propNowPlaying;
  const setNowPlaying = context?.setNowPlaying || propSetNowPlaying;
  const isPlaying = context ? !!context.nowPlaying.id : propIsPlaying;

  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(34);

  // Tìm bài hát đang phát
  const currentSong = useMemo(() => {
    // Ưu tiên dùng bài hát từ context trước
    if (context?.nowPlaying?.metadata) {
      return {
        ...context.nowPlaying.metadata,
        SongID: context.nowPlaying.id,
      };
    }

    // Nếu không có từ context thì dùng từ props
    if (currentSongId) {
      const song = songsData.find((song) => song.SongID === currentSongId);
      if (song) return song;
    }

    if (currentAlbumId) {
      const album = albumsData.find(
        (album) => album.AlbumID === currentAlbumId
      );
      if (album?.songs?.length > 0) {
        return {
          ...album.songs[0],
          cover_image: album.songs[0].cover_image || album.CoverImage,
          Artist: album.songs[0].Artist || album.Artist,
        };
      }
    }

    return songsData.find((song) => song.SongID === 1) || null;
  }, [currentSongId, currentAlbumId, context?.nowPlaying]);

  const togglePlay = () => {
    if (!currentSong) return;

    if (isPlaying) {
      setNowPlaying({ id: null, type: null, metadata: null });
    } else {
      setNowPlaying({
        id: currentSong.SongID,
        type: "song",
        metadata: {
          title: currentSong.Title,
          artist: currentSong.Artist,
          coverImage: currentSong.cover_image,
          duration: currentSong.Duration,
        },
      });
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!currentSong) {
    return (
      <div className="h-[12%] fixed flex items-center justify-center right-0 bottom-0 w-full bg-[#121212] border-t border-gray-800 px-4 z-50">
        <p className="text-gray-400">Không có bài hát nào đang phát</p>
      </div>
    );
  }

  return (
    <div
      className={`h-[12%] fixed flex items-center justify-between right-0 bottom-0 w-full px-4 z-50
      transition-all duration-500 ease-in-out
      ${
        isPlaying
          ? "bg-gradient-to-r from-black via-[#1e1b4b] to-black"
          : "bg-gradient-to-r from-gray-900 via-black to-gray-900"
      }
      border-t border-gray-800 shadow-lg`}
    >
      {/* Phần thông tin bài hát */}
      <div className="flex items-center w-1/4 min-w-[180px]">
        <img
          src={currentSong.cover_image || assets.avatar}
          alt="Ảnh bìa"
          className="w-14 h-14 rounded-md object-cover"
        />
        <div className="ml-4 min-w-0">
          <div className="text-sm font-medium text-white truncate">
            {currentSong.Title}
          </div>
          <div className="text-xs text-gray-400 truncate">
            {currentSong.Artist || "Nghệ sĩ không xác định"}
          </div>
        </div>
        <button className="ml-4 text-gray-400 hover:text-white">
          <RenderIcon
            iconName={assets.like_icon}
            altText="Yêu thích"
            className="w-4 h-4"
          />
        </button>
      </div>

      {/* Khu vực điều khiển chính */}
      <div className="flex flex-col items-center w-2/4 max-w-[600px]">
        <div className="flex items-center gap-4">
          <button className="hover:scale-110 transition-transform">
            <RenderIcon
              iconName={assets.shuffle_icon}
              altText="Phát ngẫu nhiên"
              className="w-4 h-4"
            />
          </button>
          <button className="hover:scale-110 transition-transform">
            <RenderIcon
              iconName={assets.prev_icon}
              altText="Bài trước"
              className="w-4 h-4"
            />
          </button>

          <div className="relative p-[23px]">
            <PlayButton
              isActive={true}
              size="small"
              isBar={true}
              isPlaying={isPlaying}
              onTogglePlay={togglePlay}
            />
          </div>

          <button className="hover:scale-110 transition-transform">
            <RenderIcon
              iconName={assets.next_icon}
              altText="Bài tiếp"
              className="w-4 h-4"
            />
          </button>
          <button className="hover:scale-110 transition-transform">
            <RenderIcon
              iconName={assets.loop_icon}
              altText="Lặp lại"
              className="w-4 h-4"
            />
          </button>
        </div>

        <div className="w-full flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {formatTime((progress / 100) * (currentSong.Duration || 0))}
          </span>
          <div className="relative w-full h-1 bg-gray-600 rounded-full">
            <div
              className="absolute top-0 left-0 h-full bg-white rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">
            {formatTime(currentSong.Duration)}
          </span>
        </div>
      </div>

      {/* Khu vực điều khiển phụ */}
      <div className="flex items-center justify-end w-1/4 min-w-[180px] gap-3">
        {/* Nút chế độ xem đang phát */}
        <button
          className="hover:scale-110 transition-transform"
          title="Chế độ xem đang phát"
          aria-label="Chế độ xem đang phát"
        >
          <RenderIcon
            iconName={assets.plays_icon}
            altText="Chế độ xem đang phát"
            className="w-4 h-4"
          />
        </button>

        {/* Nút hiển thị lời bài hát */}
        <button
          className="hover:scale-110 transition-transform"
          title="Lời bài hát"
          aria-label="Lời bài hát"
        >
          <RenderIcon
            iconName={assets.mic_icon}
            altText="Lời bài hát"
            className="w-4 h-4"
          />
        </button>

        {/* Nút danh sách phát */}
        <button
          className="hover:scale-110 transition-transform"
          title="Danh sách phát"
          aria-label="Danh sách phát"
        >
          <RenderIcon
            iconName={assets.queue_icon}
            altText="Danh sách phát"
            className="w-4 h-4"
          />
        </button>

        {/* Điều chỉnh âm lượng */}
        <div className="flex items-center gap-2">
          <RenderIcon
            iconName={assets.volume_icon}
            altText="Âm lượng"
            className="w-4 h-4"
          />
          <div className="w-24 h-1 bg-gray-600 rounded-full">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${volume}%` }}
            />
          </div>
        </div>

        {/* Nút phát mini */}
        <button
          className="hover:scale-110 transition-transform"
          title="Ô phát mini"
          aria-label="Ô phát mini"
        >
          <RenderIcon
            iconName={assets.mini_player_icon}
            altText="Ô phát mini"
            className="w-4 h-4"
          />
        </button>

        {/* Nút toàn màn hình */}
        <button
          className="hover:scale-110 transition-transform"
          title="Toàn màn hình"
          aria-label="Toàn màn hình"
        >
          <RenderIcon
            iconName={assets.zoom_icon}
            altText="Toàn màn hình"
            className="w-4 h-4"
          />
        </button>
      </div>
    </div>
  );
};

export default NowPlayingBar;
