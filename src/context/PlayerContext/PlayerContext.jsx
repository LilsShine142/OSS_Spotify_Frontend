// import React, { createContext, useState, useRef, useEffect } from "react";

// export const PlayerContext = createContext();

// export const PlayerProvider = ({ children }) => {
//   const audioRef = useRef(new Audio());
//   const [playerState, setPlayerState] = useState({
//     isPlaying: false,
//     currentTime: 0,
//     duration: 0,
//     volume: 0.7,
//   });

//   const [nowPlaying, setNowPlaying] = useState({
//     _id: null,
//     title: "",
//     artist: "Unknown Artist", // Mặc định nếu không có thông tin
//     coverImage: null, // Hoặc URL hình ảnh mặc định
//     audioUrl: "",
//     duration: "00:00", // Mặc định
//   });

//   // Xử lý khi bài hát thay đổi
//   useEffect(() => {
//     if (!nowPlaying.audioUrl) {
//       console.log("Không có audioUrl");
//       return;
//     }

//     const audio = audioRef.current;
//     console.log("Setting audio source:", nowPlaying.audioUrl);

//     // Reset audio element
//     audio.pause();
//     audio.currentTime = 0;

//     // Thiết lập nguồn mới
//     audio.src = nowPlaying.audioUrl;
//     audio.volume = playerState.volume;

//     const playAudio = async () => {
//       try {
//         await audio.play();
//         console.log("Đang phát audio");
//         setPlayerState((prev) => ({ ...prev, isPlaying: true }));
//       } catch (err) {
//         console.error("Lỗi khi phát audio:", err);
//         setPlayerState((prev) => ({ ...prev, isPlaying: false }));
//       }
//     };

//     playAudio();

//     return () => {
//       audio.pause();
//     };
//   }, [nowPlaying.audioUrl]); // Chỉ chạy lại khi audioUrl thay đổi

//   // Các hàm xử lý phát nhạc (giữ nguyên như trước)
//   const play = (track) => {
//     setNowPlaying({
//       _id: track._id,
//       title: track.title,
//       artist: track.artist || "Unknown Artist",
//       coverImage: track.img || "/default-cover.jpg", // Ảnh mặc định
//       audioUrl: track.audio_file, // Sử dụng audio_file từ dữ liệu của bạn
//       duration: track.duration,
//     });
//     setPlayerState((prev) => ({ ...prev, isPlaying: true }));
//   };

//   const pause = () => {
//     audioRef.current.pause();
//     setPlayerState((prev) => ({ ...prev, isPlaying: false }));
//   };

//   const togglePlayPause = () => {
//     if (playerState.isPlaying) {
//       pause();
//     } else {
//       audioRef.current
//         .play()
//         .then(() => setPlayerState((prev) => ({ ...prev, isPlaying: true })))
//         .catch((e) => console.error("Lỗi phát nhạc:", e));
//     }
//   };

//   const seek = (time) => {
//     audioRef.current.currentTime = time;
//     setPlayerState((prev) => ({ ...prev, currentTime: time }));
//   };

//   const setVolume = (volume) => {
//     audioRef.current.volume = volume;
//     setPlayerState((prev) => ({ ...prev, volume }));
//   };

//   return (
//     <PlayerContext.Provider
//       value={{
//         nowPlaying,
//         playerState,
//         audioRef,
//         play,
//         pause,
//         togglePlayPause,
//         seek,
//         setVolume,
//       }}
//     >
//       {children}
//     </PlayerContext.Provider>
//   );
// };













// import React, { createContext, useState } from "react";
// import AudioPlayer from "react-h5-audio-player";
// import "react-h5-audio-player/lib/styles.css";
// import { assets } from "@/assets/assets";

// export const PlayerContext = createContext();

// export const PlayerProvider = ({ children }) => {
//   const [playerState, setPlayerState] = useState({
//     currentTrack: null,
//     isPlaying: false,
//   });

//   const play = (track) => {
//     setPlayerState({
//       currentTrack: {
//         _id: track._id,
//         title: track.title,
//         artist: track.artist || "Unknown Artist",
//         coverImage: track.img || "/default-cover.jpg",
//         audioUrl: track.audio_file,
//         duration: track.duration,
//       },
//       isPlaying: true,
//     });
//   };

//   const pause = () => {
//     setPlayerState((prev) => ({ ...prev, isPlaying: false }));
//   };
//   console.log("PlayerProvider", playerState);
//   return (
//     <PlayerContext.Provider value={{ playerState, play, pause }}>
//       {children}

//       {/* Player cố định ở bottom */}
//       {playerState.currentTrack && (
//         <div className="fixed bottom-0 left-0 right-0 z-50">
//           <AudioPlayer
//             autoPlay
//             src={assets.song1}
//             onPlay={() =>
//               setPlayerState((prev) => ({ ...prev, isPlaying: true }))
//             }
//             onPause={() =>
//               setPlayerState((prev) => ({ ...prev, isPlaying: false }))
//             }
//             header={
//               <div className="text-white flex items-center">
//                 <img
//                   src={playerState.currentTrack.coverImage}
//                   alt="Cover"
//                   className="w-10 h-10 rounded-md mr-3"
//                 />
//                 <div>
//                   <div className="font-medium">
//                     {playerState.currentTrack.title}
//                   </div>
//                   <div className="text-sm text-gray-400">
//                     {playerState.currentTrack.artist}
//                   </div>
//                 </div>
//               </div>
//             }
//             layout="horizontal-reverse"
//             style={{
//               background: "#181818",
//               color: "white",
//               borderRadius: "0",
//             }}
//             customProgressBarSection={['current-time', 'progress-bar', 'duration']}
//             // customProgressBarSection={[
//             //   <div key="time" className="text-white mx-2 text-sm">
//             //     {playerState.currentTrack.duration}
//             //   </div>,
//             // ]}
//           />
//         </div>
//       )}
//     </PlayerContext.Provider>
//   );
// };
















import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [playerState, setPlayerState] = useState({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  });

  const audioRef = useRef(null);

  const play = (track) => {
    const formattedTrack = {
      _id: track._id,
      title: track.title,
      artist: track.artist || "Unknown Artist",
      coverImage: track.img || "/default-cover.jpg",
      audioUrl: track.audio_file,
      duration: track.duration || 0,
    };

    setPlayerState((prev) => ({
      ...prev,
      currentTrack: formattedTrack,
      isPlaying: true,
      currentTime: 0,
    }));
  };

  const pause = () => {
    setPlayerState((prev) => ({ ...prev, isPlaying: false }));
  };

  const togglePlayPause = () => {
    if (playerState.isPlaying) {
      pause();
    } else if (playerState.currentTrack) {
      setPlayerState((prev) => ({ ...prev, isPlaying: true }));
    }
  };

  const handleTimeUpdate = () => {
    const current = audioRef.current?.currentTime || 0;
    setPlayerState((prev) => ({ ...prev, currentTime: current }));
  };

  const handleLoadedData = () => {
    const duration = audioRef.current?.duration || 0;
    setPlayerState((prev) => ({ ...prev, duration }));
  };

  const handleEnded = () => {
    setPlayerState((prev) => ({ ...prev, isPlaying: false, currentTime: 0 }));
  };

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setPlayerState((prev) => ({ ...prev, currentTime: time }));
    }
  };

  // Phát hoặc dừng audio tương ứng khi isPlaying thay đổi
  useEffect(() => {
    if (!audioRef.current) return;

    if (playerState.isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [playerState.isPlaying, playerState.currentTrack]);

  return (
    <PlayerContext.Provider
      value={{
        playerState,
        play,
        pause,
        togglePlayPause,
        handleTimeUpdate,
        handleLoadedData,
        handleEnded,
        seek,
        audioRef,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
