import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import HomeContainer from './components/MainContent/HomeContainer';
import PremiumPage from './components/Premium/PremiumPage';
import CustomScrollbar from '../../../components/Scrollbar/CustomScrollbar';

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-black">
      <Header />
      <CustomScrollbar className="flex-1">
        <Routes>
          <Route path="/" element={<HomeContainer />} />
          <Route path="/premium" element={<PremiumPage />} />
          {/* Add other routes here */}
        </Routes>
      </CustomScrollbar>
    </div>
  );
};

export default MainLayout; 