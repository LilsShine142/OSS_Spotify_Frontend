// import React, { useState, useMemo, useContext } from "react";
// import { assets, songsData, albumsData } from "../../../../assets/assets";
// import { RenderIcon } from "../../../../components/Button/RenderIcon";
// import PlayButton from "../../../../components/Button/PlayButton";
// import { PlayerContext } from "../../../../context/PlayerContext/PlayerContext";

// const NowPlayingBar = ({
//   currentSongId,
//   currentAlbumId,
//   isPlaying: propIsPlaying,
//   nowPlaying: propNowPlaying,
//   setNowPlaying: propSetNowPlaying,
// }) => {
//   // Sử dụng context nếu có, nếu không thì dùng từ props
//   const context = useContext(PlayerContext);
//   const nowPlaying = context?.nowPlaying || propNowPlaying;
//   const setNowPlaying = context?.setNowPlaying || propSetNowPlaying;
//   const isPlaying = context ? !!context.nowPlaying.id : propIsPlaying;

//   const [volume, setVolume] = useState(70);
//   const [progress, setProgress] = useState(34);

//   // Tìm bài hát đang phát
//   const currentSong = useMemo(() => {
//     // Ưu tiên dùng bài hát từ context trước
//     if (context?.nowPlaying?.metadata) {
//       return {
//         ...context.nowPlaying.metadata,
//         SongID: context.nowPlaying.id,
//       };
//     }

//     // Nếu không có từ context thì dùng từ props
//     if (currentSongId) {
//       const song = songsData.find((song) => song.SongID === currentSongId);
//       if (song) return song;
//     }

//     if (currentAlbumId) {
//       const album = albumsData.find(
//         (album) => album.AlbumID === currentAlbumId
//       );
//       if (album?.songs?.length > 0) {
//         return {
//           ...album.songs[0],
//           cover_image: album.songs[0].cover_image || album.CoverImage,
//           Artist: album.songs[0].Artist || album.Artist,
//         };
//       }
//     }

//     return songsData.find((song) => song.SongID === 1) || null;
//   }, [currentSongId, currentAlbumId, context?.nowPlaying]);

//   const togglePlay = () => {
//     if (!currentSong) return;

//     if (isPlaying) {
//       setNowPlaying({ id: null, type: null, metadata: null });
//     } else {
//       setNowPlaying({
//         id: currentSong.SongID,
//         type: "song",
//         metadata: {
//           title: currentSong.Title,
//           artist: currentSong.Artist,
//           coverImage: currentSong.cover_image,
//           duration: currentSong.Duration,
//         },
//       });
//     }
//   };

//   const formatTime = (seconds) => {
//     if (!seconds) return "0:00";
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   if (!currentSong) {
//     return (
//       <div className="h-[12%] fixed flex items-center justify-center right-0 bottom-0 w-full bg-[#121212] border-t border-gray-800 px-4 z-50">
//         <p className="text-gray-400">Không có bài hát nào đang phát</p>
//       </div>
//     );
//   }

// return (
//   <div
//     className={`h-[12%] fixed flex items-center justify-between right-0 bottom-0 w-full px-4 z-50
//     transition-all duration-500 ease-in-out
//     ${
//       isPlaying
//         ? "bg-gradient-to-r from-black via-[#1e1b4b] to-black"
//         : "bg-gradient-to-r from-gray-900 via-black to-gray-900"
//     }
//     border-t border-gray-800 shadow-lg`}
//   >
// {/* Phần thông tin bài hát */}
// <div className="flex items-center w-1/4 min-w-[180px]">
//   <img
//     src={currentSong.cover_image || assets.avatar}
//     alt="Ảnh bìa"
//     className="w-14 h-14 rounded-md object-cover"
//   />
//   <div className="ml-4 min-w-0">
//     <div className="text-sm font-medium text-white truncate">
//       {currentSong.Title}
//     </div>
//     <div className="text-xs text-gray-400 truncate">
//       {currentSong.Artist || "Nghệ sĩ không xác định"}
//     </div>
//   </div>
//   <button className="ml-4 text-gray-400 hover:text-white">
//     <RenderIcon
//       iconName={assets.like_icon}
//       altText="Yêu thích"
//       className="w-4 h-4"
//     />
//   </button>
// </div>

// {/* Khu vực điều khiển chính */}
// <div className="flex flex-col items-center w-2/4 max-w-[600px]">
//   <div className="flex items-center gap-4">
//     <button className="hover:scale-110 transition-transform">
//       <RenderIcon
//         iconName={assets.shuffle_icon}
//         altText="Phát ngẫu nhiên"
//         className="w-4 h-4"
//       />
//     </button>
//     <button className="hover:scale-110 transition-transform">
//       <RenderIcon
//         iconName={assets.prev_icon}
//         altText="Bài trước"
//         className="w-4 h-4"
//       />
//     </button>

// <div className="relative p-[23px]">
//   <PlayButton
//     isActive={true}
//     size="small"
//     isBar={true}
//     isPlaying={isPlaying}
//     onTogglePlay={togglePlay}
//   />
// </div>

//     <button className="hover:scale-110 transition-transform">
//       <RenderIcon
//         iconName={assets.next_icon}
//         altText="Bài tiếp"
//         className="w-4 h-4"
//       />
//     </button>
//     <button className="hover:scale-110 transition-transform">
//       <RenderIcon
//         iconName={assets.loop_icon}
//         altText="Lặp lại"
//         className="w-4 h-4"
//       />
//     </button>
//   </div>

//   <div className="w-full flex items-center gap-2">
//     <span className="text-xs text-gray-400">
//       {formatTime((progress / 100) * (currentSong.Duration || 0))}
//     </span>
//     <div className="relative w-full h-1 bg-gray-600 rounded-full">
//       <div
//         className="absolute top-0 left-0 h-full bg-white rounded-full"
//         style={{ width: `${progress}%` }}
//       />
//     </div>
//     <span className="text-xs text-gray-400">
//       {formatTime(currentSong.Duration)}
//     </span>
//   </div>
// </div>

// {/* Khu vực điều khiển phụ */}
// <div className="flex items-center justify-end w-1/4 min-w-[180px] gap-3">
//   {/* Nút chế độ xem đang phát */}
//   <button
//     className="hover:scale-110 transition-transform"
//     title="Chế độ xem đang phát"
//     aria-label="Chế độ xem đang phát"
//   >
//     <RenderIcon
//       iconName={assets.plays_icon}
//       altText="Chế độ xem đang phát"
//       className="w-4 h-4"
//     />
//   </button>

//   {/* Nút hiển thị lời bài hát */}
//   <button
//     className="hover:scale-110 transition-transform"
//     title="Lời bài hát"
//     aria-label="Lời bài hát"
//   >
//     <RenderIcon
//       iconName={assets.mic_icon}
//       altText="Lời bài hát"
//       className="w-4 h-4"
//     />
//   </button>

//   {/* Nút danh sách phát */}
//   <button
//     className="hover:scale-110 transition-transform"
//     title="Danh sách phát"
//     aria-label="Danh sách phát"
//   >
//     <RenderIcon
//       iconName={assets.queue_icon}
//       altText="Danh sách phát"
//       className="w-4 h-4"
//     />
//   </button>

//   {/* Điều chỉnh âm lượng */}
//   <div className="flex items-center gap-2">
//     <RenderIcon
//       iconName={assets.volume_icon}
//       altText="Âm lượng"
//       className="w-4 h-4"
//     />
//     <div className="w-24 h-1 bg-gray-600 rounded-full">
//       <div
//         className="h-full bg-white rounded-full"
//         style={{ width: `${volume}%` }}
//       />
//     </div>
//   </div>

//   {/* Nút phát mini */}
//   <button
//     className="hover:scale-110 transition-transform"
//     title="Ô phát mini"
//     aria-label="Ô phát mini"
//   >
//     <RenderIcon
//       iconName={assets.mini_player_icon}
//       altText="Ô phát mini"
//       className="w-4 h-4"
//     />
//   </button>

//   {/* Nút toàn màn hình */}
//   <button
//     className="hover:scale-110 transition-transform"
//     title="Toàn màn hình"
//     aria-label="Toàn màn hình"
//   >
//     <RenderIcon
//       iconName={assets.zoom_icon}
//       altText="Toàn màn hình"
//       className="w-4 h-4"
//     />
//   </button>
// </div>
//   </div>
// );
// };

// export default NowPlayingBar;

// import React, { useContext } from "react";
// import AudioPlayer from "react-h5-audio-player";
// import "react-h5-audio-player/lib/styles.css";
// import { PlayerContext } from "../../../../context/PlayerContext/PlayerContext";

// const NowPlayingBar = () => {
//   const { playerState, pause, play } = useContext(PlayerContext);

//   if (!playerState.currentTrack) {
//     return (
//       <div className="h-[12%] fixed flex items-center justify-center right-0 bottom-0 w-full bg-[#121212] border-t border-gray-800 px-4 z-50">
//         <p className="text-gray-400">Không có bài hát nào đang phát</p>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed bottom-0 left-0 right-0 z-50">
//       <AudioPlayer
//         autoPlay
//         src={playerState.currentTrack.audioUrl}
//         onPlay={() => play(playerState.currentTrack)}
//         onPause={pause}
//         header={
//           <div className="text-white flex items-center">
//             <img
//               src={playerState.currentTrack.coverImage}
//               alt="Cover"
//               className="w-10 h-10 rounded-md mr-3"
//             />
//             <div>
//               <div className="font-medium">
//                 {playerState.currentTrack.title}
//               </div>
//               <div className="text-sm text-gray-400">
//                 {playerState.currentTrack.artist}
//               </div>
//             </div>
//           </div>
//         }
//         layout="horizontal-reverse"
//         style={{
//           background: "#181818",
//           color: "white",
//           borderRadius: "0",
//         }}
//         customProgressBarSection={[
//           <div key="time" className="text-white mx-2 text-sm">
//             {playerState.currentTrack.duration}
//           </div>,
//         ]}
//       />
//     </div>
//   );
// };

// export default NowPlayingBar;

// import React, { useContext } from "react";
// import AudioPlayer from "react-h5-audio-player";
// import "react-h5-audio-player/lib/styles.css";
// import { PlayerContext } from "../../../../context/PlayerContext/PlayerContext";
// import { assets } from "@/assets/assets";

// const NowPlayingBar = () => {
//   const { playerState, pause, togglePlayPause } = useContext(PlayerContext);

//   if (!playerState.currentTrack) {
//     return (
//       <div className="h-[90px] fixed flex items-center justify-center right-0 bottom-0 w-full bg-[#121212] border-t border-gray-800 px-4 z-50">
//         <p className="text-gray-400">Không có bài hát nào đang phát</p>
//       </div>
//     );
//   }
//   return (
//     <div
//       className={`h-[12%] fixed flex items-center justify-between right-0 bottom-0 w-full px-4 z-50
//       transition-all duration-500 ease-in-out
//       ${
//         isPlaying
//           ? "bg-gradient-to-r from-black via-[#1e1b4b] to-black"
//           : "bg-gradient-to-r from-gray-900 via-black to-gray-900"
//       }
//       border-t border-gray-800 shadow-lg`}
//     >
//       {/* Phần thông tin bài hát */}
//       <div className="flex items-center w-1/4 min-w-[180px]">
//         <img
//           src={currentSong.cover_image || assets.avatar}
//           alt="Ảnh bìa"
//           className="w-14 h-14 rounded-md object-cover"
//         />
//         <div className="ml-4 min-w-0">
//           <div className="text-sm font-medium text-white truncate">
//             {currentSong.Title}
//           </div>
//           <div className="text-xs text-gray-400 truncate">
//             {currentSong.Artist || "Nghệ sĩ không xác định"}
//           </div>
//         </div>
//         <button className="ml-4 text-gray-400 hover:text-white">
//           <RenderIcon
//             iconName={assets.like_icon}
//             altText="Yêu thích"
//             className="w-4 h-4"
//           />
//         </button>
//       </div>

//       <AudioPlayer
//         autoPlay={playerState.isPlaying}
//         src={assets.song1}
//         onPlay={togglePlayPause}
//         onPause={pause}
//         onClickNext={() => {}}
//         onClickPrevious={() => {}}
//         showSkipControls={true}
//         showJumpControls={false}
//         header={
//           <div className="text-white flex items-center">
//             <img
//               src={playerState.currentTrack.coverImage}
//               alt="Cover"
//               className="w-10 h-10 rounded-md mr-3"
//             />
//             <div>
//               <div className="font-medium">
//                 {playerState.currentTrack.title}
//               </div>
//               <div className="text-sm text-gray-400">
//                 {playerState.currentTrack.artist}
//               </div>
//             </div>
//           </div>
//         }
//         layout="horizontal-reverse"
//         style={{
//           background: "#181818",
//           color: "white",
//           borderRadius: "0",
//         }}
//       />
//     </div>
//   );
// };

// export default NowPlayingBar;

// import React, { useContext } from "react";
// import AudioPlayer from "react-h5-audio-player";
// import "react-h5-audio-player/lib/styles.css";
// import { PlayerContext } from "../../../../context/PlayerContext/PlayerContext";
// import { assets } from "@/assets/assets";

// const NowPlayingBar = () => {
//   const { playerState, pause, togglePlayPause } = useContext(PlayerContext);

//   return (
//     <div
//       className={`h-[90px] fixed bottom-0 right-0 w-full z-50 px-6 py-3
//         bg-gradient-to-r from-gray-900 via-black to-gray-900
//         border-t border-gray-800/50 shadow-xl
//         transition-all duration-300 ease-in-out
//         ${
//           playerState.isPlaying
//             ? "opacity-100 scale-100"
//             : "opacity-90 scale-[0.98]"
//         }`}
//     >
//       <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
//         {/* Track Info */}
//         <div className="flex items-center w-1/4 min-w-[200px]">
//           {playerState.currentTrack ? (
//             <>
//               <img
//                 src={playerState.currentTrack.cover_image || assets.avatar}
//                 alt="Track cover"
//                 className="w-12 h-12 rounded-lg object-cover shadow-md"
//               />
//               <div className="ml-4 min-w-0">
//                 <div className="text-sm font-semibold text-white truncate">
//                   {playerState.currentTrack.Title}
//                 </div>
//                 <div className="text-xs text-gray-400 truncate">
//                   {playerState.currentTrack.Artist || "Unknown Artist"}
//                 </div>
//               </div>
//               <button className="ml-4 text-gray-400 hover:text-pink-400 transition-colors">
//                 <img src={assets.like_icon} alt="Like" className="w-5 h-5" />
//               </button>
//             </>
//           ) : (
//             <div className="flex items-center">
//               <div className="w-12 h-12 bg-gray-800 rounded-lg animate-pulse" />
//               <div className="ml-4">
//                 <div className="text-sm font-semibold text-gray-400">
//                   No track selected
//                 </div>
//                 <div className="text-xs text-gray-500">
//                   Select a song to play
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Audio Player Controls */}
//         <AudioPlayer
//           autoPlay={playerState.isPlaying}
//           src={playerState.currentTrack ? assets.song1 : ""}
//           onPlay={togglePlayPause}
//           onPause={pause}
//           onClickNext={() => {}}
//           onClickPrevious={() => {}}
//           showSkipControls={true}
//           showJumpControls={false}
//           layout="horizontal-reverse"
//           className="w-2/4"
//           style={{
//             background: "transparent",
//             color: "white",
//             padding: "0",
//             boxShadow: "none",
//           }}
//           customAdditionalControls={[]}
//           customVolumeControls={[]}
//           customIcons={{
//             play: (
//               <svg
//                 className="w-8 h-8 text-white hover:text-pink-400"
//                 fill="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path d="M8 5v14l11-7z" />
//               </svg>
//             ),
//             pause: (
//               <svg
//                 className="w-8 h-8 text-white hover:text-pink-400"
//                 fill="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
//               </svg>
//             ),
//             next: (
//               <svg
//                 className="w-6 h-6 text-white hover:text-pink-400"
//                 fill="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
//               </svg>
//             ),
//             previous: (
//               <svg
//                 className="w-6 h-6 text-white hover:text-pink-400"
//                 fill="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path d="M18 18l-8.5-6L18 6v12zM6 6v12h2V6H6z" />
//               </svg>
//             ),
//           }}
//         />

//         {/* Volume and Additional Controls */}
//         <div className="flex items-center w-1/4 justify-end gap-4">
//           <button className="text-gray-400 hover:text-white transition-colors">
//             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//               <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z" />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NowPlayingBar;

// import React, { useContext } from "react";
// import AudioPlayer from "react-h5-audio-player";
// import "react-h5-audio-player/lib/styles.css";
// import { PlayerContext } from "../../../../context/PlayerContext/PlayerContext";
// import { assets } from "@/assets/assets";
// import { RenderIcon } from "../../../../components/Button/RenderIcon";
// const formatTime = (seconds) => {
//   const mins = Math.floor(seconds / 60);
//   const secs = Math.floor(seconds % 60);
//   return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
// };

// const NowPlayingBar = () => {
//   const { playerState, pause, togglePlayPause } = useContext(PlayerContext);

//   // Mock state for demonstration (replace with actual state management)
//   const currentSong = playerState.currentTrack || {};
//   const progress = 50; // Replace with actual progress state
//   const volume = 70; // Replace with actual volume state

//   return (
//     <div
//       className={`h-[90px] fixed bottom-0 right-0 w-full z-50 px-6 py-3
//         bg-gradient-to-r from-gray-900 via-black to-gray-900
//         border-t border-gray-800/50 shadow-xl
//         transition-all duration-300 ease-in-out
//         ${
//           playerState.isPlaying
//             ? "opacity-100 scale-100"
//             : "opacity-90 scale-[0.98]"
//         }`}
//     >
//       <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
//         {/* Phần thông tin bài hát */}
//         <div className="flex items-center w-1/4 min-w-[180px]">
//           {playerState.currentTrack ? (
//             <>
//               <img
//                 src={currentSong.cover_image || assets.avatar}
//                 alt="Ảnh bìa"
//                 className="w-14 h-14 rounded-md object-cover shadow-md"
//               />
//               <div className="ml-4 min-w-0">
//                 <div className="text-sm font-medium text-white truncate">
//                   {currentSong.Title || "Unknown Title"}
//                 </div>
//                 <div className="text-xs text-gray-400 truncate">
//                   {currentSong.Artist || "Nghệ sĩ không xác định"}
//                 </div>
//               </div>
//               <button className="ml-4 text-gray-400 hover:text-pink-400 transition-colors">
//                 <RenderIcon
//                   iconName={assets.like_icon}
//                   altText="Yêu thích"
//                   className="w-4 h-4"
//                 />
//               </button>
//             </>
//           ) : (
//             <div className="flex items-center">
//               <div className="w-14 h-14 bg-gray-800 rounded-md animate-pulse" />
//               <div className="ml-4">
//                 <div className="text-sm font-semibold text-gray-400">
//                   No track selected
//                 </div>
//                 <div className="text-xs text-gray-500">
//                   Select a song to play
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Khu vực điều khiển chính */}
//         <div className="flex flex-col items-center w-2/4 max-w-[600px]">
//           <AudioPlayer
//             autoPlay={playerState.isPlaying}
//             src={playerState.currentTrack ? assets.song1 : ""}
//             onPlay={togglePlayPause}
//             onPause={pause}
//             onClickNext={() => {}}
//             onClickPrevious={() => {}}
//             showSkipControls={true}
//             showJumpControls={false}
//             layout="horizontal-reverse"
//             className="w-full"
//             style={{
//               background: "transparent",
//               color: "white",
//               padding: "0",
//               boxShadow: "none",
//             }}
//             customAdditionalControls={[]}
//             customVolumeControls={[]}
//             customIcons={{
//               play: (
//                 <RenderIcon
//                   iconName={assets.play_icon}
//                   altText="Play"
//                   className="w-8 h-8 text-gray-400 hover:text-pink-400"
//                 />
//               ),
//               pause: (
//                 <RenderIcon
//                   iconName={assets.pause_icon}
//                   altText="Pause"
//                   className="w-8 h-8 text-gray-400 hover:text-pink-400"
//                 />
//               ),
//               next: (
//                 <RenderIcon
//                   iconName={assets.next_icon}
//                   altText="Bài tiếp"
//                   className="w-6 h-6 text-gray-400 hover:text-pink-400"
//                 />
//               ),
//               previous: (
//                 <RenderIcon
//                   iconName={assets.prev_icon}
//                   altText="Bài trước"
//                   className="w-6 h-6 text-gray-400 hover:text-pink-400"
//                 />
//               ),
//             }}
//           />
//           <div className="w-full flex items-center gap-2">
//             <span className="text-xs text-gray-400">
//               {formatTime((progress / 100) * (currentSong.Duration || 0))}
//             </span>
//             <div className="relative w-full h-1 bg-gray-600 rounded-full">
//               <div
//                 className="absolute top-0 left-0 h-full bg-pink-400 rounded-full transition-all"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//             <span className="text-xs text-gray-400">
//               {formatTime(currentSong.Duration || 0)}
//             </span>
//           </div>
//         </div>

//         {/* Khu vực điều khiển phụ */}
//         <div className="flex items-center justify-end w-1/4 min-w-[180px] gap-3">
//           <button
//             className="text-gray-400 hover:text-pink-400 hover:scale-110 transition-transform"
//             title="Chế độ xem đang phát"
//             aria-label="Chế độ xem đang phát"
//           >
//             <RenderIcon
//               iconName={assets.plays_icon}
//               altText="Chế độ xem đang phát"
//               className="w-4 h-4"
//             />
//           </button>
//           <button
//             className="text-gray-400 hover:text-pink-400 hover:scale-110 transition-transform"
//             title="Lời bài hát"
//             aria-label="Lời bài hát"
//           >
//             <RenderIcon
//               iconName={assets.mic_icon}
//               altText="Lời bài hát"
//               className="w-4 h-4"
//             />
//           </button>
//           <button
//             className="text-gray-400 hover:text-pink-400 hover:scale-110 transition-transform"
//             title="Danh sách phát"
//             aria-label="Danh sách phát"
//           >
//             <RenderIcon
//               iconName={assets.queue_icon}
//               altText="Danh sách phát"
//               className="w-4 h-4"
//             />
//           </button>
//           <div className="flex items-center gap-2">
//             <RenderIcon
//               iconName={assets.volume_icon}
//               altText="Âm lượng"
//               className="w-4 h-4 text-gray-400"
//             />
//             <div className="w-24 h-1 bg-gray-600 rounded-full">
//               <div
//                 className="h-full bg-pink-400 rounded-full"
//                 style={{ width: `${volume}%` }}
//               />
//             </div>
//           </div>
//           <button
//             className="text-gray-400 hover:text-pink-400 hover:scale-110 transition-transform"
//             title="Ô phát mini"
//             aria-label="Ô phát mini"
//           >
//             <RenderIcon
//               iconName={assets.mini_player_icon}
//               altText="Ô phát mini"
//               className="w-4 h-4"
//             />
//           </button>
//           <button
//             className="text-gray-400 hover:text-pink-400 hover:scale-110 transition-transform"
//             title="Toàn màn hình"
//             aria-label="Toàn màn hình"
//           >
//             <RenderIcon
//               iconName={assets.zoom_icon}
//               altText="Toàn màn hình"
//               className="w-4 h-4"
//             />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NowPlayingBar;

import React, { useContext, useRef, useState, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { PlayerContext } from "../../../../context/PlayerContext/PlayerContext";
import { assets } from "@/assets/assets";
import { RenderIcon } from "../../../../components/Button/RenderIcon";
import TrackInfo from "./TrackInfo";
import PlayButton from "../../../../components/Button/PlayButton";
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const NowPlayingBar = () => {
  const { playerState, pause, togglePlayPause } = useContext(PlayerContext);
  const audioPlayerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [duration, setDuration] = useState(0);

  const currentSong = playerState.currentTrack || {};
  console.log("Current song:", currentSong);
  // Sync progress with playback
  useEffect(() => {
    const player = audioPlayerRef.current?.audio?.current;
    if (!player) return;

    const updateProgress = () => {
      if (player.duration) {
        setProgress((player.currentTime / player.duration) * 100);
        setDuration(player.duration);
      }
    };

    player.addEventListener("timeupdate", updateProgress);
    player.addEventListener("loadedmetadata", () =>
      setDuration(player.duration)
    );
    return () => {
      player.removeEventListener("timeupdate", updateProgress);
      player.removeEventListener("loadedmetadata", () => {});
    };
  }, [currentSong]);

  // Sync volume with AudioPlayer
  useEffect(() => {
    const player = audioPlayerRef.current?.audio?.current;
    if (player) {
      player.volume = volume / 100;
    }
  }, [volume]);

  // Handle progress bar seeking
  const handleSeek = (e) => {
    const player = audioPlayerRef.current?.audio?.current;
    if (!player || !player.duration) return;

    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newProgress = (offsetX / rect.width) * 100;
    const newTime = (newProgress / 100) * player.duration;

    player.currentTime = newTime;
    setProgress(newProgress);
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newVolume = Math.min(100, Math.max(0, (offsetX / rect.width) * 100));
    setVolume(newVolume);
  };

  // Custom control handlers
  const handlePlayPause = () => {
    togglePlayPause();
  };

  const handleNext = () => {
    // Implement next track logic in PlayerContext
    audioPlayerRef.current?.audio?.current?.pause();
  };

  const handlePrevious = () => {
    // Implement previous track logic in PlayerContext
    audioPlayerRef.current?.audio?.current?.pause();
  };

  return (
    <div
      className={`h-[90px] fixed bottom-0 right-0 w-full z-50 px-6 py-3
        bg-gradient-to-r from-gray-900 via-black to-gray-900
        border-t border-gray-800/50 shadow-xl
        transition-all duration-300 ease-in-out
        ${
          playerState.isPlaying
            ? "opacity-100 scale-100"
            : "opacity-90 scale-[0.98]"
        }`}
    >
      <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
        {/* Phần thông tin bài hát */}
        {currentSong ? (
          <TrackInfo track={currentSong} />
        ) : (
          <div>Đang không có bài hát nào</div>
        )}

        {/* Khu vực điều khiển chính */}
        <div className="flex flex-col items-center w-2/4 max-w-[600px]">
          <div className="flex items-center gap-4">
            <button
              className="text-gray-400 hover:text-pink-400 hover:scale-110 transition-transform"
              title="Phát ngẫu nhiên"
            >
              <RenderIcon
                iconName={assets.shuffle_icon}
                altText="Phát ngẫu nhiên"
                className="w-4 h-4"
              />
            </button>
            <button
              onClick={handlePrevious}
              className="text-gray-400 hover:text-pink-400 hover:scale-110 transition-transform"
              title="Bài trước"
            >
              <RenderIcon
                iconName={assets.prev_icon}
                altText="Bài trước"
                className="w-4 h-4"
              />
            </button>
            {/* <button
              onClick={handlePlayPause}
              className="rounded-full bg-white p-2 hover:scale-110 transition-transform"
            >
              <RenderIcon
                iconName={
                  playerState.isPlaying ? assets.pause_icon : assets.play_icon
                }
                altText={playerState.isPlaying ? "Pause" : "Play"}
                className="w-4 h-4"
              />
            </button> */}
            <div className="relative p-[23px]">
              <PlayButton
                isActive={true}
                size="small"
                track={currentSong}
                isBar={true}
                isPlaying={playerState.isPlaying}
                onTogglePlay={togglePlayPause}
              />
            </div>
            <button
              onClick={handleNext}
              className="text-gray-400 hover:text-pink-400 hover:scale-110 transition-transform"
              title="Bài tiếp"
            >
              <RenderIcon
                iconName={assets.next_icon}
                altText="Bài tiếp"
                className="w-4 h-4"
              />
            </button>
            <button
              className="text-gray-400 hover:text-pink-400 hover:scale-110 transition-transform"
              title="Lặp lại"
            >
              <RenderIcon
                iconName={assets.loop_icon}
                altText="Lặp lại"
                className="w-4 h-4"
              />
            </button>
          </div>
          <div className="w-full flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-400">
              {formatTime((progress / 100) * duration)}
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
              {formatTime(duration)}
            </span>
          </div>
          {/* Hidden AudioPlayer for playback */}
          <AudioPlayer
            ref={audioPlayerRef}
            autoPlay={playerState.isPlaying}
            src={
              playerState.currentTrack
                ? "https://res.cloudinary.com/ddlso6ofq/raw/upload/v1747581594/wpkiiahs1ggwlctnuuhz.mp3"
                : ""
            }
            onPlay={togglePlayPause}
            onPause={pause}
            showSkipControls={false}
            showJumpControls={false}
            showFilledVolume={false}
            style={{ display: "none" }} // Hide default controls
          />
        </div>

        {/* Khu vực điều khiển phụ */}
        <div className="flex items-center justify-end w-1/4 min-w-[180px] gap-3">
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
            <RenderIcon
              iconName={assets.volume_icon}
              altText="Âm lượng"
              className="w-4 h-4 text-gray-400"
            />
            <div
              className="w-24 h-1 bg-gray-600 rounded-full cursor-pointer"
              onClick={handleVolumeChange}
            >
              <div
                className="h-full bg-pink-400 rounded-full"
                style={{ width: `${volume}%` }}
              />
            </div>
          </div>
          <button
            className="text-gray-400 hover:text-pink-400 hover:scale-110 transition-transform"
            title="Ô phát mini"
            aria-label="Ô phát mini"
          >
            <RenderIcon
              iconName={assets.mini_player_icon}
              altText="Ô phát mini"
              className="w-4 h-4"
            />
          </button>
          <button
            className="text-gray-400 hover:text-pink-400 hover:scale-110 transition-transform"
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
    </div>
  );
};

export default NowPlayingBar;
