import React, { useState, useContext } from "react";
import LeftSidebar from "../../layouts/components/Sidebar/LeftSidebar";
import RightSidebar from "../../layouts/components/Sidebar/RightSidebar";
import Header from "../../layouts/components/Header/Header";
import MainContent from "../../layouts/components/MainContent/MaiContent";
import NowPlayingBar from "../../layouts/components/Footer/NowPlayingBar";
import { PlayerProvider } from "../../../context/PlayerContext/PlayerContext";
const Home = () => {
  const [sidebarWidth, setSidebarWidth] = useState(360);

  return (
    <PlayerProvider>
      <div className="h-screen w-full bg-black overflow-hidden">
        <Header />
        <div className="flex h-full pt-2 gap-0.5">
          <LeftSidebar width={sidebarWidth} onResize={setSidebarWidth} />
          <MainContent sidebarWidth={sidebarWidth} />
          <RightSidebar
            sidebarWidth={sidebarWidth}
            currentSongId={30} // Tạm thời gắn cứng ID bài hát
          />
          <NowPlayingBar />
        </div>
      </div>
    </PlayerProvider>
  );
};

export default Home;
