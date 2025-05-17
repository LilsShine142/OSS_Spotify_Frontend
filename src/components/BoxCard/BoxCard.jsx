import React, { useState } from "react";
import { Link } from "react-router-dom";
import PlayButton from "../Button/PlayButton";

const BoxCard = ({ playlist, width, variant = "default" }) => {
  const [isHovered, setIsHovered] = useState(false);

  /* Xác định loại item và ID tương ứng dựa trên playlist
    Mới chỉ xác định các trường hợp cơ bản, sẽ mở rộng thêm
  */
  const getItemInfo = () => {
    if (variant === "artist") return { id: playlist._id, type: "artist" };
    if (variant === "playlist") return { id: playlist._id, type: "playlist" };
    if (variant === "album") return { id: playlist._id, type: "album" };
    if (playlist.artist_id)
      // Ưu tiên kiểm tra các trường đặc trưng trước
      return { id: playlist.artist_id, type: "artist" };
    if (playlist.PlaylistID)
      return { id: playlist.PlaylistID, type: "playlist" };
    if (playlist.AlbumID) return { id: playlist.AlbumID, type: "album" };
    if (playlist.SongID) return { id: playlist.SongID, type: "song" };

    // Fallback cho các trường hợp khác
    return {
      id: playlist.id,
      type: playlist.type || "album", // Tùy xem db có type hay không
    };
  };

  const { id, type } = getItemInfo();
  const dynamicWidth =
    width >= 65 ? "w-[260px]" : width <= 55 ? "w-[200px]" : "w-[300px]";

  // ClassName động
  const containerClass = `relative p-3 text-white rounded-lg cursor-pointer transition-all duration-300 hover:bg-[#282828] ${
    variant === "list"
      ? `bg-gray-900 h-[52px] flex items-center justify-between ${dynamicWidth}`
      : variant === "playlist" || variant === "artist" || variant === "album"
      ? `w-48  flex flex-col items-center py-4 rounded-lg cursor-pointer transition-all duration-200 transform origin-center ${
          isHovered ? "scale-105 z-10" : ""
        }`
      : ""
  }`;

  const imageClass = `object-cover ${
    variant === "list"
      ? "w-12 h-12 rounded-md mr-3"
      : variant === "playlist" || variant === "album"
      ? "w-40 h-40 rounded-lg mb-2"
      : variant === "artist"
      ? "w-40 h-40 rounded-full mb-4 mx-auto"
      : ""
  }`;
  // Class cho phần text với chiều cao cố định
  const textContainerClass =
    variant === "list"
      ? "flex-1 truncate"
      : "w-full pl-3 text-left h-[60px] overflow-hidden"; // Album, Playlist, Artist

  const handlePlayButtonClick = (e) => {
    // Ngừng sự kiện click để không chuyển trang khi nhấn PlayButton
    e.stopPropagation();
  };

  return (
    <div
      className={containerClass}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={type && id ? `${type}/${id}` : "/default-page"} // Không / trước type thì cần giữ trong layout /home, tạm thời gắn default-page, sau có thể bỏ và áp dụng cho trang khác
        state={{ fromHome: true }}
        className="relative"
      >
        <img
          src={
            playlist.profile_img || playlist.cover_img || "/default-image.jpg"
          }
          alt={playlist.Title || playlist.artist_name || "Default"}
          className={imageClass}
        />
      </Link>

      {isHovered && (
        <PlayButton
          isActive={true}
          size={variant === "list" ? "small" : "medium"}
          itemId={id}
          itemType={type}
          variant={variant}
          onClick={handlePlayButtonClick} // Bắt sự kiện click vào nút PlayButton và ngừng sự kiện lan ra ngoài
        />
      )}

      <div className={textContainerClass}>
        <h3
          className={`font-bold text-gray-300 h-full${
            variant === "list"
              ? "text-sm"
              : type === "artist"
              ? "text-lg mb-1"
              : "text-sm text-gray-300 line-clamp-2"
          }`}
        >
          {playlist.Title || playlist.artist_name}
        </h3>
        {variant === "artist" && (
          <p className="text-gray-400 text-sm text-left">
            {playlist.label || "Nghệ sĩ"}
          </p>
        )}
      </div>
    </div>
  );
};

export default BoxCard;
