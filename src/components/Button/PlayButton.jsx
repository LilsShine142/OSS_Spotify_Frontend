// import React, { useContext } from "react";
// import { RenderIcon } from "./RenderIcon";
// import { assets } from "../../assets/assets";
// import { PlayerContext } from "../../context/PlayerContext/PlayerContext";

// const PlayButton = ({
//   isActive = true,
//   size = "medium",
//   itemId,
//   itemType,
//   variant = "list",
//   isPlaying: propIsPlaying, // Nhận từ props (tuỳ chọn)
//   onTogglePlay: propOnTogglePlay, // Nhận từ props (tuỳ chọn)
// }) => {
//   const sizeClasses = {
//     small: "w-10 h-10",
//     medium: "w-12 h-12",
//     large: "w-14 h-14",
//   };

//   // Lấy từ Context nếu không truyền từ props
//   const { nowPlaying, setNowPlaying } = useContext(PlayerContext);
//   const contextIsPlaying =
//     nowPlaying.id === itemId && nowPlaying.type === itemType;

//   // Ưu tiên dùng prop nếu được truyền, không thì dùng context
//   const isPlaying =
//     propIsPlaying !== undefined ? propIsPlaying : contextIsPlaying;

//   const handleToggle = (e) => {
//     e.stopPropagation();

//     if (propOnTogglePlay) {
//       // Nếu có callback từ props thì gọi nó
//       propOnTogglePlay();
//     } else {
//       // Ngược lại dùng Context
//       if (isPlaying) {
//         setNowPlaying({ id: null, type: null });
//       } else {
//         setNowPlaying({ id: itemId, type: itemType });
//       }
//     }
//   };

//   if (!isActive) return null;

//   const positionClasses =
//     variant === "list"
//       ? "right-0 top-1/2 -translate-y-1/2"
//       : "right-2 bottom-2";

//   return (
//     <div
//       className={`absolute ${positionClasses} inset-0 flex items-center justify-center ${sizeClasses[size]}`}
//     >
//       <div
//         className="bg-white rounded-full p-2 flex items-center justify-center hover:scale-110 transition-transform"
//         onClick={handleToggle}
//       >
//         <RenderIcon
//           iconName={isPlaying ? assets.pause_icon : assets.play_icon}
//           altText={isPlaying ? "Tạm dừng" : "Phát"}
//           className="w-4 h-4"
//           isPlayPause={true}
//         />
//       </div>
//     </div>
//   );
// };

// export default PlayButton;

import React, { useContext } from "react";
import { RenderIcon } from "./RenderIcon";
import { assets } from "../../assets/assets";
import { PlayerContext } from "../../context/PlayerContext/PlayerContext";

const PlayButton = ({
  isActive = true,
  size = "medium",
  itemId,
  itemType,
  variant = "list",
  isBar = false,
  isPlaying: propIsPlaying, // Nhận từ props (tuỳ chọn)
  onTogglePlay: propOnTogglePlay, // Nhận từ props (tuỳ chọn)
}) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-14 h-14",
  };

  // Lấy từ Context nếu không truyền từ props
  const { nowPlaying, setNowPlaying } = useContext(PlayerContext);
  const contextIsPlaying =
    nowPlaying.id === itemId && nowPlaying.type === itemType;

  // Ưu tiên dùng prop nếu được truyền, không thì dùng context
  const isPlaying =
    propIsPlaying !== undefined ? propIsPlaying : contextIsPlaying;

  const handleToggle = (e) => {
    e.stopPropagation();

    if (propOnTogglePlay) {
      // Nếu có callback từ props thì gọi nó
      propOnTogglePlay();
    } else {
      // Ngược lại dùng Context
      if (isPlaying) {
        setNowPlaying({ id: null, type: null });
      } else {
        setNowPlaying({ id: itemId, type: itemType });
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
      className={`absolute ${positionClasses} ${positionClasses} p-[6px] flex items-center justify-center `}
    >
      <div
        className={`${isBar ? "bg-white" : " bg-green-500"} rounded-full ${
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
