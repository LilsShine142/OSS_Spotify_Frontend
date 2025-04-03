import React, { useState } from "react";
import LeftSidebar from "../../layouts/components/Sidebar/LeftSidebar";
import RightSidebar from "../../layouts/components/Sidebar/RightSidebar";
import Header from "../../layouts/components/Header/Header";
import MainContent from "../../layouts/components/MainContent/MaiContent";
import NowPlayingBar from "../../layouts/components/Footer/NowPlayingBar";

const Home = () => {
  const [sidebarWidth, setSidebarWidth] = useState(360);
  const [currentAlbumId, setCurrentAlbumId] = useState(4); // ID album đang phát
  const [currentSongId, setCurrentSongId] = useState(30); // ID bài hát đang phát
  return (
    <div className="h-screen w-full bg-black overflow-hidden">
      <Header />
      <div className="flex h-full pt-2 gap-0.5">
        <LeftSidebar width={sidebarWidth} onResize={setSidebarWidth} />
        <MainContent sidebarWidth={sidebarWidth} />
        <RightSidebar sidebarWidth={sidebarWidth} currentSongId={currentSongId} />
        <NowPlayingBar />
      </div>
    </div>
  );
};

export default Home;
