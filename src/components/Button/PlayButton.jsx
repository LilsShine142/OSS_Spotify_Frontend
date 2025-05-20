import React from "react";
import { RenderIcon } from "./RenderIcon";
import { assets } from "../../assets/assets";
import { usePlayer } from "../../context/PlayerContext/PlayerContext";

const PlayButton = ({
  isActive = true,
  size = "medium",
  track = {}, // object bài hát (có thể undefined)
  variant = "list",
  isBar = false,
  isPlaying, // Nhận từ props thay vì tự tính toán
  onTogglePlay, // Nhận hàm toggle từ props
}) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-14 h-14",
  };

  const { playerState } = usePlayer();

  const handleToggle = (e) => {
    e.stopPropagation();

    // Nếu có truyền vào hàm onTogglePlay thì gọi nó
    if (onTogglePlay) {
      onTogglePlay();
    }
    // Nếu không thì dùng logic mặc định
    else if (track) {
      const isCurrentTrack = playerState.currentTrack?._id === track?._id;
      if (isCurrentTrack && playerState.isPlaying) {
        pause();
      } else {
        play(track);
      }
    }
  };

  if (!isActive) return null;

  const positionClasses =
    variant === "list"
      ? "right-0 top-1/2 -translate-y-1/2"
      : variant === "playlist" || variant === "artist" || variant === "album"
      ? "right-[15px] bottom-[85px]"
      : "";

  return (
    <div
      className={`absolute ${positionClasses} p-[6px] flex items-center justify-center`}
    >
      <div
        className={`${isBar ? "bg-white" : "bg-green-500"} rounded-full ${
          sizeClasses[size]
        } p-2 flex items-center justify-center hover:scale-110 transition-transform shadow-lg`}
        onClick={handleToggle}
      >
        <RenderIcon
          iconName={isPlaying ? assets.pause_icon : assets.play_icon}
          altText={isPlaying ? "Tạm dừng" : "Phát"}
          className="w-4 h-4"
          isPlayPause={true}
        />
      </div>
    </div>
  );
};

export default PlayButton;
