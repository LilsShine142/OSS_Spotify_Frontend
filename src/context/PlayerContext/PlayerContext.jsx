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
    volume: 70,
    isShuffled: false,
    repeatMode: "off", // 'off', 'all', 'one'
    wasPlayingBeforeSeek: false,
  });
  const [queue, setQueue] = useState([]);

  const audioRef = useRef(null);

  // Hàm phát bài hát mới
  const play = (track, index = 0) => {
    console.log("Playing track:", track);
    const formattedTrack = {
      _id: track._id || track.id,
      title: track.title || track.name,
      artist:
        track.artist ||
        track.artists?.map((a) => a.name).join(", ") ||
        "Unknown Artist",
      coverImage: track.img || track.coverImage || "/default-cover.jpg",
      audioUrl: track.audio_file || track.url,
      duration: track.duration || 0,
    };
    // setQueue(trackQueue); // Lưu queue (từ bài hiện tại trở đi)
    setPlayerState({
      currentTrack: formattedTrack,
      isPlaying: true,
      currentTime: 0,
      duration: 0,
      currentIndex: index,
      wasPlayingBeforeSeek: false,
    });
  };

  // Hàm tạm dừng
  const pause = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      audioRef.current.pause();
      setPlayerState((prev) => ({
        ...prev,
        isPlaying: false,
        currentTime, // Giữ nguyên currentTime
      }));
    }
  };

  // Hàm tiếp tục phát
  // const resume = () => {
  //   setPlayerState((prev) => ({ ...prev, isPlaying: true }));
  // };
  // Hàm resume tiếp tục từ thời gian hiện tại
  const resume = () => {
    if (audioRef.current && playerState.currentTrack) {
      audioRef.current
        .play()
        .then(() =>
          setPlayerState((prev) => ({
            ...prev,
            isPlaying: true,
          }))
        )
        .catch((error) => {
          console.error("Resume failed:", error);
          setPlayerState((prev) => ({ ...prev, isPlaying: false }));
        });
    }
  };

  // Hàm toggle play/pause
  const togglePlayPause = () => {
    if (!playerState.currentTrack) return;
    playerState.isPlaying ? pause() : resume();
  };

  // Hàm xử lý khi bài hát kết thúc
  const handleEnded = () => {
    setPlayerState((prev) => ({ ...prev, isPlaying: false, currentTime: 0 }));
  };

  // Hàm seek đến thời gian cụ thể
  const seek = (time) => {
    if (audioRef.current) {
      const wasPlaying = playerState.isPlaying;
      setPlayerState((prev) => ({
        ...prev,
        isPlaying: false,
        wasPlayingBeforeSeek: wasPlaying,
        currentTime: time,
      }));

      audioRef.current.currentTime = time;

      if (wasPlaying) {
        setTimeout(() => {
          setPlayerState((prev) => ({ ...prev, isPlaying: true }));
        }, 100);
      }
    }
  };

  // Hàm xử lý cập nhật thời gian hiện tại
  const handleTimeUpdate = () => {
    setPlayerState((prev) => ({
      ...prev,
      currentTime: audioRef.current?.currentTime || 0,
    }));
  };

  // Hàm xử lý khi audio đã load
  const handleLoadedData = () => {
    setPlayerState((prev) => ({
      ...prev,
      duration: audioRef.current?.duration || 0,
    }));
  };

  const handleLoadedMetadata = () => {
    setPlayerState((prev) => ({
      ...prev,
      duration: audioRef.current?.duration || 0,
    }));
  };

  // Hàm xử lý xáo trộn
  const toggleShuffle = () => {
    setPlayerState((prev) => ({
      ...prev,
      isShuffled: !prev.isShuffled,
    }));
  };

  // Hàm xử lý lặp lại
  const toggleRepeat = (mode) => {
    setPlayerState((prev) => ({
      ...prev,
      repeatMode: mode,
    }));
  };

  const handleClick = (track, index) => {
    const slicedList = allTracks.slice(index); // phần còn lại từ bài hiện tại trở đi
    play(track, slicedList);
  };

  // Hàm chuyển bài tiếp theo
  const playNextTrack = () => {
    const nextIndex = playerState.currentIndex + 1;
    play(playerState.currentTrack, nextIndex);
  };

  // Hàm chuyển bài trước
  const playPreviousTrack = () => {
    // Logic chuyển bài trước
    // Cần implement dựa trên danh sách bài hát hiện có
  };

  // Hàm điều chỉnh volume
  const setVolume = (volume) => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
    setPlayerState((prev) => ({ ...prev, volume }));
  };

  // Effect xử lý play/pause khi state thay đổi
  useEffect(() => {
    if (!audioRef.current) return;

    if (playerState.isPlaying) {
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Playback failed:", error);
          setPlayerState((prev) => ({ ...prev, isPlaying: false }));
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [playerState.isPlaying, playerState.currentTrack]);

  // Effect xử lý khi currentTime thay đổi từ bên ngoài (như seek bar)
  useEffect(() => {
    if (
      audioRef.current &&
      Math.abs(audioRef.current.currentTime - playerState.currentTime) > 0.1
    ) {
      audioRef.current.currentTime = playerState.currentTime;
    }
  }, [playerState.currentTime]);

  return (
    <PlayerContext.Provider
      value={{
        playerState,
        play,
        pause,
        resume,
        togglePlayPause,
        seek,
        audioRef,
        toggleShuffle,
        toggleRepeat,
        playNextTrack,
        playPreviousTrack,
        setVolume,
      }}
    >
      {children}
      {/* Audio element ẩn */}
      <audio
        ref={audioRef}
        // Gắn cứng url tạm thời
        src={
          playerState.currentTrack
            ? "https://res.cloudinary.com/ddlso6ofq/raw/upload/v1747581594/wpkiiahs1ggwlctnuuhz.mp3"
            : undefined
        }
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={handleLoadedData}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
