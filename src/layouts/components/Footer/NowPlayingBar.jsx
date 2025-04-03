import React, { useMemo } from "react";
import { assets, songsData } from "../../../assets/assets";

const NowPlayingBar = () => {
  // State để theo dõi trạng thái phát nhạc (playing/paused)
  const [isPlaying, setIsPlaying] = React.useState(false);
  // State âm lượng (từ 0-100)
  const [volume, setVolume] = React.useState(70);
  // State tiến độ phát bài hát (từ 0-100%)
  const [progress, setProgress] = React.useState(35);

  // Tìm bài hát hiện tại, tối ưu bằng useMemo
  const currentSong = useMemo(
    () => songsData.find((song) => song.SongID === 29),
    [songsData]
  );

  // Nếu không tìm thấy bài hát thì không render gì
  if (!currentSong) {
    return null;
  }

  // Hàm chuyển đổi thời gian từ giây sang phút:giây
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Hàm helper để render icon từ assets
  const renderIcon = (iconName, altText, className, isPlayPause = false) => {
    return (
      <img
        src={iconName || assets.avatar}
        alt={altText}
        className={`cursor-pointer ${
          isPlayPause
            ? "brightness-100"
            : "brightness-50 hover:invert-0 hover:brightness-100"
        } invert hover:scale-110 transition-transform duration-200 ${className}`}
      />
    );
  };
  return (
    /* Thanh player cố định ở dưới cùng màn hình */
    <div className="h-[12%] fixed flex items-center justify-between right-0 bottom-0 w-full bg-[#121212] border-t border-gray-800  px-4 z-50">
      {/* Khu vực bên trái - Thông tin bài hát */}
      <div className="flex items-center w-1/4 min-w-[180px]">
        {/* Ảnh bìa album */}
        <img
          src={currentSong.cover_image}
          alt="Ảnh bìa album"
          className="w-14 h-14 rounded-md object-cover"
        />

        {/* Tên bài hát và nghệ sĩ */}
        <div className="ml-4 min-w-0">
          <div className="text-sm font-medium text-white truncate">
            {currentSong.Title}
          </div>
          <div className="text-xs text-gray-400 truncate">
            {currentSong.Artist || "Nghệ sĩ không xác định"}
          </div>
        </div>

        {/* Nút thích bài hát */}
        <button className="ml-4 text-gray-400 hover:text-white">
          {renderIcon(assets.like_icon, "Yêu thích", "w-4 h-4")}
        </button>
      </div>

      {/* Điều khiển phát nhạc */}
      <div className="flex flex-col items-center w-2/4 max-w-[600px]">
        {/* Các nút điều khiển chính */}
        <div className="flex items-center gap-4 mb-2">
          <button
            className="hover:scale-110 transition-transform"
            title="Phát ngẫu nhiên"
          >
            {renderIcon(assets.shuffle_icon, "Phát ngẫu nhiên", "w-4 h-4")}
          </button>
          <button
            className="hover:scale-110 transition-transform"
            title="Bài trước"
          >
            {renderIcon(assets.prev_icon, "Bài trước", "w-4 h-4")}
          </button>

          {/* Nút play/pause chính */}
          <button
            className="bg-white rounded-full p-2 hover:scale-105 transition-transform"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Tạm dừng" : "Phát"}
          >
            {/* Play/Pause - không đổi màu khi hover */}
            {isPlaying
              ? renderIcon(assets.pause_icon, "Tạm dừng", "w-4 h-4", true)
              : renderIcon(assets.play_icon, "Phát", "w-4 h-4", true)}
          </button>

          <button
            className="hover:scale-110 transition-transform"
            title="Bài tiếp"
          >
            {renderIcon(assets.next_icon, "Bài tiếp", "w-4 h-4")}
          </button>
          <button
            className="hover:scale-110 transition-transform"
            title="Lặp lại"
          >
            {renderIcon(assets.loop_icon, "Lặp lại", "w-4 h-4")}
          </button>
        </div>

        {/* Thanh tiến độ bài hát */}
        <div className="w-full flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {formatTime((progress / 100) * currentSong.Duration)}
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

      {/* Âm lượng và playlist */}
      <div className="flex items-center justify-end w-1/4 min-w-[180px] gap-3">
        {/* Nút mở chế độ xem đang phát */}
        <button
          className="hover:scale-110 transition-transform"
          title="Chế độ xem đang phát"
        >
          {renderIcon(assets.plays_icon, "Chế độ xem đang phát", "w-4 h-4")}
        </button>
        {/* Nút mở lời bài hát */}
        <button
          className="hover:scale-110 transition-transform"
          title="Lời bài hát"
        >
          {renderIcon(assets.mic_icon, "Lời bài hát", "w-4 h-4")}
        </button>
        {/* Nút mở danh sách phát */}
        <button
          className="hover:scale-110 transition-transform"
          title="Danh sách phát"
        >
          {renderIcon(assets.queue_icon, "Danh sách phát", "w-4 h-4")}
        </button>

        {/* Điều chỉnh âm lượng */}
        <div className="flex items-center gap-2">
          {renderIcon(assets.volume_icon, "Âm lượng", "w-4 h-4")}
          <div className="w-24 h-1 bg-gray-600 rounded-full">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${volume}%` }}
            />
          </div>
        </div>
        {/* Nút mở ô phát mini */}
        <button
          className="hover:scale-110 transition-transform"
          title="Ô phát mini"
        >
          {renderIcon(assets.mini_player_icon, "Ô phát mini", "w-4 h-4")}
        </button>
        {/* Nút mở toàn màn hình */}
        <button
          className="hover:scale-110 transition-transform"
          title="Toàn màn hinh"
        >
          {renderIcon(assets.zoom_icon, "Toàn màn hinh", "w-4 h-4")}
        </button>
      </div>
    </div>
  );
};

export default NowPlayingBar;
