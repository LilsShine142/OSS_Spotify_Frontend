import React, { useState, useContext } from "react";
import LeftSidebar from "../../layouts/components/Sidebar/LeftSidebar";
import RightSidebar from "../../layouts/components/Sidebar/RightSidebar";
import Header from "../../layouts/components/Header/Header";
import MainContent from "../../layouts/components/MainContent/MaiContent";
import NowPlayingBar from "../../layouts/components/Footer/NowPlayingBar";
import { PlayerContext } from "../../../context/PlayerContext/PlayerContext";

const Home = () => {
  const [sidebarWidth, setSidebarWidth] = useState(360);
  const { nowPlaying, setNowPlaying } = useContext(PlayerContext);

  // Xác định currentSongId và currentAlbumId từ nowPlaying
  const currentSongId = nowPlaying.type === "song" ? nowPlaying.id : null;
  const currentAlbumId = nowPlaying.type === "album" ? nowPlaying.id : null;

  return (
    <div className="h-screen w-full bg-black overflow-hidden">
      <Header />
      <div className="flex h-full pt-2 gap-0.5">
        <LeftSidebar width={sidebarWidth} onResize={setSidebarWidth} />
        <MainContent sidebarWidth={sidebarWidth} />
        <RightSidebar
          sidebarWidth={sidebarWidth}
          currentSongId={30} // Tạm thời gắn cứng ID bài hát
        />
        <NowPlayingBar
          currentSongId={currentSongId}
          currentAlbumId={currentAlbumId}
          isPlaying={!!nowPlaying.id}
          nowPlaying={nowPlaying}
          setNowPlaying={setNowPlaying}
        />
      </div>
    </div>
  );
};

export default Home;
