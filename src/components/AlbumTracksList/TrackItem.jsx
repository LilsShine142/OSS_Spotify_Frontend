// import React, { useState } from "react";
// import { GiPauseButton } from "react-icons/gi";
// import { IoPlay } from "react-icons/io5";
// import { assets } from "@/assets/assets";
// import { formatDurationFromHHMMSS } from "@/lib/utils";

// const TrackItem = ({
//   track,
//   index,
//   isPlaying,
//   isCurrentTrack,
//   onPlayTrack,
//   onMouseEnter,
//   onMouseLeave,
//   hoveredTrackId,
// }) => {
//   return (
//     <div
//       className={`grid grid-cols-12 gap-4 items-center py-3 group hover:bg-gray-900/50 transition-colors
//         ${isCurrentTrack ? "bg-gray-800/50" : ""}`}
//       onClick={() => onPlayTrack(track, index)}
//       onMouseEnter={() => onMouseEnter(track._id)}
//       onMouseLeave={onMouseLeave}
//     >
//       {/* Số thứ tự */}
//       <div className="col-span-1 text-center text-gray-400 group-hover:text-white">
//         {isCurrentTrack ? (
//           <div className="flex justify-center">
//             <div className="w-4 h-4 relative">
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="w-full h-2 bg-green-500 animate-pulse"></div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           index + 1
//         )}
//       </div>

//       {/* Tiêu đề bài hát */}
//       <div className="col-span-6 flex items-center pl-2 gap-3">
//         <div className="relative w-10 h-10">
//           <img
//             src={track.img || assets.avatar}
//             alt={track.title}
//             className="w-10 h-10 object-cover rounded-md"
//           />
//           {/* Nút Play xuất hiện khi hover */}
//           <div
//             className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-md
//               ${
//                 hoveredTrackId === track._id || isCurrentTrack
//                   ? "opacity-100"
//                   : "opacity-0"
//               } transition-opacity`}
//           >
//             {isCurrentTrack && isPlaying ? (
//               <GiPauseButton className="w-5 h-5 text-gray-300" />
//             ) : (
//               <IoPlay className="w-5 h-5 text-gray-300 group-hover:text-white" />
//             )}
//           </div>
//         </div>

//         <div className="flex flex-col">
//           <p
//             className={`font-medium truncate ${
//               isCurrentTrack ? "text-green-500" : "text-white"
//             }`}
//           >
//             {track.title}
//           </p>
//           <p className="text-gray-400 text-sm truncate">
//             {track.artists?.map((artist) => artist.name).join(", ") ||
//               "Nghệ sĩ"}
//           </p>
//         </div>
//       </div>

//       {/* Album */}
//       <div className="col-span-3 text-gray-400 group-hover:text-white pl-2 truncate">
//         {track.artists?.name || "Album"}
//       </div>

//       {/* Thời gian */}
//       <div className="col-span-1 text-right text-gray-400 group-hover:text-white pr-2">
//         {formatDurationFromHHMMSS(track.duration)}
//       </div>
//     </div>
//   );
// };

// export default TrackItem;

import React, { useState } from "react";
import { GiPauseButton } from "react-icons/gi";
import { IoPlay } from "react-icons/io5";
import { HiOutlineDownload } from "react-icons/hi";
import { assets } from "@/assets/assets";
import { formatDurationFromHHMMSS } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const TrackItem = ({
  track,
  index,
  isPlaying,
  isCurrentTrack,
  onPlayTrack,
  onMouseEnter,
  onMouseLeave,
  hoveredTrackId,
  onDownload, // Thêm prop onDownload từ component cha
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const handleDownloadClick = (e) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra phần tử cha
    onDownload(track._id);
  };

  // Hàm xử lý khi click vào tên bài hát
  const handleTitleClick = (e, trackId) => {
    e.stopPropagation(); // Ngăn sự kiện lan ra phần tử cha
    navigate(`/track/${trackId}/video`); // Chuyển đến trang chi tiết bài hát
  };

  return (
    <div
      className={`grid grid-cols-12 gap-4 items-center py-3 group hover:bg-gray-900/50 transition-colors
        ${isCurrentTrack ? "bg-gray-800/50" : ""}`}
      onClick={() => onPlayTrack(track, index)}
      onMouseEnter={() => {
        onMouseEnter(track._id);
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        onMouseLeave();
        setIsHovered(false);
      }}
    >
      {/* Số thứ tự */}
      <div className="col-span-1 text-center text-gray-400 group-hover:text-white">
        {isCurrentTrack ? (
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
      <div className="col-span-5 flex items-center pl-2 gap-3">
        <div className="relative w-10 h-10">
          <img
            src={track.img || assets.avatar}
            alt={track.title}
            className="w-10 h-10 object-cover rounded-md"
          />
          {/* Nút Play xuất hiện khi hover */}
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-md
              ${
                hoveredTrackId === track._id || isCurrentTrack
                  ? "opacity-100"
                  : "opacity-0"
              } transition-opacity`}
          >
            {isCurrentTrack && isPlaying ? (
              <GiPauseButton className="w-5 h-5 text-gray-300" />
            ) : (
              <IoPlay className="w-5 h-5 text-gray-300 group-hover:text-white" />
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <button
            onClick={(e) => handleTitleClick(e, track._id)} // Thêm sự kiện click
            className={`font-medium truncate text-left ${
              isCurrentTrack ? "text-green-500" : "text-white"
            } hover:underline`} // Thêm hover:underline
          >
            {track.title}
          </button>
          <p className="text-gray-400 text-sm truncate">
            {
              (track.artists?.map((artist) => artist.name).join(", ") ||
                "Nghệ sĩ",
              console.log("track", track))
            }
          </p>
        </div>
      </div>

      {/* Album */}
      <div className="col-span-3 text-gray-400 group-hover:text-white pl-2 truncate">
        {track.artists?.name || "Album"}
      </div>

      {/* Thời gian */}
      <div className="col-span-2 text-right text-gray-400 group-hover:text-white pr-2 flex items-center justify-end">
        {/* Icon tải xuống chỉ hiển thị khi hover */}
        {(hoveredTrackId === track._id || isHovered) && (
          <button
            onClick={handleDownloadClick}
            className="p-1 mr-3 text-gray-400 hover:text-white transition-colors"
            title="Tải xuống"
          >
            <HiOutlineDownload className="w-5 h-5" />
          </button>
        )}
        {formatDurationFromHHMMSS(track.duration)}
      </div>
    </div>
  );
};

export default TrackItem;
