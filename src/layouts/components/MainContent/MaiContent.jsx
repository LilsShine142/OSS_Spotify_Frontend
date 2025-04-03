import React, { useState, useRef, useEffect } from "react";
import HomeContainer from "./HomeContainer";

const MainContent = ({ sidebarWidth }) => {
  const [extraWidth, setExtraWidth] = useState(0);
  const [width, setWidth] = useState(window.innerWidth);
  const isResizing = useRef(false);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = (e) => {
    isResizing.current = true;
    let startX = e.clientX;
    let startExtraWidth = extraWidth;

    const handleMouseMove = (event) => {
      if (!isResizing.current) return;
      let newExtraWidth =
        startExtraWidth + ((event.clientX - startX) / window.innerWidth) * 100;
      setExtraWidth(Math.max(0, Math.min(newExtraWidth, 10)));
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Tính toán trước giá trị width để tránh lặp toán tử điều kiện
  const baseWidth =
    sidebarWidth >= 1000
      ? `calc(100% - ${sidebarWidth}px + ${extraWidth}%)`
      : `calc(100% - ${sidebarWidth}px - 320px + ${extraWidth}%)`; // 320px là width của RightSidebar

  return (
    <div
      className="flex flex-col h-[78%] pr-2 relative"
      style={{
        width: baseWidth, // W có thể thay đổi
        minWidth: baseWidth, // Đảm bảo không nhỏ hơn baseWidth
      }}
    >
      <HomeContainer width={width} />
      {/* Thanh kéo dãn */}
      <div
        className="absolute h-full right-0.5 w-0.5 cursor-ew-resize bg-transparent hover:bg-gray-400 active:bg-white transition-all duration-200 z-20"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default MainContent;

// import React, { useState, useRef, useEffect } from "react";
// import CustomButton from "../../../components/Button/CustomButton";
// import BoxCard from "../../../components/BoxCard/BoxCard";
// import PlaylistBox from "../../../components/BoxCard/PlaylistBox";
// import { albumsData } from "../../../assets/assets";

// const MainContent = ({ sidebarWidth }) => {
//   const [width, setWidth] = useState(65);
//   const mainRef = useRef(null);
//   const isResizing = useRef(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setWidth((prevWidth) => Math.max(65, Math.min(prevWidth, 80)));
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const handleMouseDown = (e) => {
//     isResizing.current = true;
//     let startX = e.clientX;
//     let startWidth = width;

//     const handleMouseMove = (event) => {
//       if (!isResizing.current) return;
//       let newWidth =
//         startWidth + ((event.clientX - startX) / window.innerWidth) * 100;
//       setWidth(Math.max(65, Math.min(newWidth, 80)));
//     };

//     const handleMouseUp = () => {
//       isResizing.current = false;
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);
//   };

//   return (
//     <div
//       ref={mainRef}
//       className="flex flex-col h-[80%] pr-2 relative"
//       style={{
//         width:
//           sidebarWidth >= 1000
//             ? `calc(100% - ${sidebarWidth}px)`
//             : `calc(100% - ${sidebarWidth}px - 25%)`,
//         minWidth:
//           sidebarWidth >= 1000
//             ? `calc(100% - ${sidebarWidth}px)`
//             : `calc(100% - ${sidebarWidth}px - 25%)`,
//         maxWidth: sidebarWidth >= 1000 ? "100%" : "75%",
//       }}
//     >
//       <div className="text-white overflow-auto scrollbar-hidden rounded">
//         <header className="flex items-center h-[10%] px-10 gap-2 rounded sticky top-0 w-full z-50 bg-[#0C192C]">
//           <CustomButton variant="primary">Tất cả</CustomButton>
//           <CustomButton variant="secondary">Nhạc</CustomButton>
//           <CustomButton variant="secondary">Podcast</CustomButton>
//         </header>
//         <div className="flex flex-col h-full bg-gradient-to-b from-[#0d1a2d] to-black">
//           <div className="flex flex-wrap gap-4 p-4">
//             {albumsData
//               .slice(0, width > 65 ? 6 : width < 55 ? 3 : 4)
//               .map((album) => (
//                 <BoxCard key={album.AlbumID} Playlist={album} width={width} />
//               ))}
//           </div>

//           <div className="flex flex-col space-y-8 p-10">
//             <section className="flex flex-col">
//               <div className="flex justify-between items-center mb-3">
//                 <h2 className="text-2xl font-bold">Dành cho bạn</h2>
//                 <button className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
//                   Xem tất cả
//                 </button>
//               </div>
//               <div className="flex overflow-x-auto pb-4 scrollbar-hide -ml-6">
//                 {albumsData.map((album, index) => (
//                   <div
//                     key={album.AlbumID}
//                     className={`flex-none ${index > 0 ? "-ml-6" : ""} z-$
//                     {albumsData.length - index} relative`}
//                   >
//                     <PlaylistBox Playlist={album} />
//                   </div>
//                 ))}
//               </div>
//             </section>
//             <section className="flex flex-col">
//               <div className="flex justify-between items-center mb-3">
//                 <h2 className="text-2xl font-bold">
//                   Album và đĩa đơn nổi tiếng
//                 </h2>
//                 <button className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
//                   Xem tất cả
//                 </button>
//               </div>
//               <div className="flex overflow-x-auto pb-4 scrollbar-hide -ml-6">
//                 {albumsData.map((album, index) => (
//                   <div
//                     key={album.AlbumID}
//                     className={`flex-none ${index > 0 ? "-ml-6" : ""} z-$
//                     {albumsData.length - index} relative`}
//                   >
//                     <PlaylistBox Playlist={album} />
//                   </div>
//                 ))}
//               </div>
//             </section>
//           </div>
//         </div>
//       </div>
//       <div
//         className="absolute h-full right-0.5 w-0.5 cursor-ew-resize bg-transparent hover:bg-gray-400 active:bg-white transition-all duration-200 z-20 group-hover:bg-gray-400"
//         onMouseDown={handleMouseDown}
//       />
//     </div>
//   );
// };

// export default MainContent;
