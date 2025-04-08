import React, { createContext, useState } from "react";

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  // Thêm state để lưu cả loại item (type) và ID
  const [nowPlaying, setNowPlaying] = useState({
    id: null,
    type: null, // 'song', 'album', 'playlist'
  });

  return (
    <PlayerContext.Provider value={{ nowPlaying, setNowPlaying }}>
      {children}
    </PlayerContext.Provider>
  );
};
