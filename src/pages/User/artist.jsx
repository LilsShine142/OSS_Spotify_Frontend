import React from "react";
import LeftSidebar from "../../layouts/components/Sidebar/LeftSidebar";
import RightSidebar from "../../layouts/components/Sidebar/RightSidebar";
import Header from "../../layouts/components/Header/Header";
import Footer from "../../layouts/components/Footer/MusicPlayer";
import MainContent from "../../layouts/components/MainContent/MaiContent";
import Artist from "../../layouts/components/Artist/Artist";

const Home = () => {
  return (
    <div className="h-screen bg-black flex flex-col">
      <Header />
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <LeftSidebar />
        <RightSidebar />
        <Artist />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
