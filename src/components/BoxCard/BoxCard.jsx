// import React from "react";

// const BoxCard = ({ Playlist, width }) => {
//   // Tăng kích thước BoxCard khi MainContent rộng ra, giảm khi thu nhỏ
//   const dynamicWidth =
//     width >= 65 ? "w-[260px]" : width <= 55 ? "w-[200px]" : "w-[300px]";

//   return (
//     <div
//       className={`p-3 h-[55px] bg-gray-900 text-white rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-800 transition-all duration-300 ${dynamicWidth}`}
//     >
//       {/* Hình ảnh Playlist */}
//       <img
//         src={Playlist.CoverImage}
//         alt={Playlist.Title}
//         className="w-12 h-12 rounded-md object-cover mr-3"
//       />

//       {/* Thông tin Playlist */}
//       <div className="flex-1 truncate">
//         <h3 className="font-semibold text-sm">{Playlist.Title}</h3>
//       </div>

//       {/* Hiệu ứng nhạc đang phát */}
//       <div className="text-green-500 text-xl">▮▮▮</div>
//     </div>
//   );
// };

// export default BoxCard;
// import React from "react";

// const BoxCard = ({
//   Playlist,
//   width,
//   variant = "default",
//   index,
//   hoverIndex,
//   setHoverIndex,
// }) => {
//   // Điều chỉnh kích thước dựa vào width (cho kiểu list)
//   const dynamicWidth =
//     width >= 65 ? "w-[260px]" : width <= 55 ? "w-[200px]" : "w-[300px]";

//   return (
//     <div
//       className={`relative p-3 bg-gray-900 text-white rounded-lg cursor-pointer transition-all duration-300
//         ${
//           variant === "list"
//             ? `h-[55px] flex items-center justify-between ${dynamicWidth}`
//             : `
//           text-white rounded-lg
//           w-48 cursor-pointer
//           bg-transparent
//           transition-all duration-200
//           transform origin-center flex flex-col items-center py-4 hover:bg-[#282828] scale-105 ${
//             hoverIndex === index ? "bg-[#282828] scale-105 z-10" : ""
//           }`
//         }`}
//     >
//       {/* Hình ảnh Playlist */}
//       <img
//         src={Playlist.CoverImage}
//         alt={Playlist.Title}
//         className={`object-cover ${
//           variant === "list"
//             ? "w-12 h-12 rounded-md mr-3"
//             : "w-40 h-40 rounded-lg mb-2"
//         }`}
//       />

//       {/* Thông tin Playlist */}
//       <div
//         className={`${
//           variant === "list" ? "flex-1 truncate" : "w-full text-center"
//         }`}
//       >
//         <h3
//           className={`font-semibold text-sm ${
//             variant === "list" ? "" : "text-gray-300 line-clamp-2"
//           }`}
//         >
//           {Playlist.Title}
//         </h3>
//       </div>

//       {/* Hiệu ứng nhạc đang phát (Chỉ xuất hiện trong list) */}
//       {variant === "list" && <div className="text-green-500 text-xl">▮▮▮</div>}
//     </div>
//   );
// };

// export default BoxCard;
import React from "react";

const BoxCard = ({
  playlist,
  width,
  variant = "default",
  index,
  hoverIndex,
}) => {
  // Điều chỉnh kích thước dựa vào width (chỉ áp dụng cho list)
  const dynamicWidth =
    width >= 65 ? "w-[260px]" : width <= 55 ? "w-[200px]" : "w-[300px]";

  return (
    <div
      className={`relative p-3 text-white rounded-lg cursor-pointer transition-all duration-300 
    ${
      variant === "list"
        ? `bg-gray-900 h-[52px] flex items-center justify-between hover:bg-[#282828] ${dynamicWidth}`
        : variant === "playlist"
        ? `w-48 flex flex-col items-center py-4 rounded-lg cursor-pointer transition-all duration-200 transform origin-center ${
            hoverIndex === index
              ? "bg-[#282828] scale-105 z-10"
              : "hover:bg-[#282828] hover:scale-105"
          }`
        : "" 
    }`}
    >
      {/* Hình ảnh Playlist */}
      <img
        src={playlist.CoverImage}
        alt={playlist.Title}
        className={`object-cover ${
          variant === "list"
            ? "w-12 h-12 rounded-md mr-3"
            : "w-40 h-40 rounded-lg mb-2"
        }`}
      />

      {/* Thông tin Playlist */}
      <div
        className={`${
          variant === "list" ? "flex-1 truncate" : "w-full text-center"
        }`}
      >
        <h3
          className={`font-semibold text-sm ${
            variant === "list" ? "" : "text-gray-300 line-clamp-2"
          }`}
        >
          {playlist.Title}
        </h3>
      </div>

      {/* Hiệu ứng nhạc đang phát (Chỉ xuất hiện trong list) */}
      {variant === "list" && <div className="text-green-500 text-xl">▮▮▮</div>}
    </div>
  );
};

export default BoxCard;
