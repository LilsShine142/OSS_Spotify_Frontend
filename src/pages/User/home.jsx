import React from "react";
import Sidebar from "../../layouts/components/Sidebar/Sidebar";
import Header from "../../layouts/components/Header/Header";
import Footer from "../../layouts/components/Footer/MusicPlayer";
import MainContent from "../../layouts/components/MainContent/MaiContent";

const Home = () => {
  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Header */}
      <Header />
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <MainContent />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
