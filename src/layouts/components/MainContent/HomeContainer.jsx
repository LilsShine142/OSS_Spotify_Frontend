import React, { useState, useEffect } from "react";
import CustomButton from "../../../components/Button/CustomButton";
import BoxCard from "../../../components/BoxCard/BoxCard";
import PlaylistCarousel from "../../../components/BoxCard/PlaylistCarousel";
import { artists, albumsData } from "../../../assets/assets";
import AlbumsSection from "../Homepage/AlbumSection";
import TopArtistsSection from "../Homepage/TopArtistsSection";

const HomeContainer = ({ width }) => {
  
  return (
    <div className="text-white scrollbar-hidden rounded flex flex-col h-full bg-gradient-to-b from-[#0d1a2d] to-black">
      <header className="flex flex-shrink-0 items-center h-[60px] px-4 md:px-10 gap-2 overflow-hidden">
        {/* playlist and artist from api */}
        <CustomButton variant="primary" className="truncate">
          Global
        </CustomButton>

        {/* playlist and artist from database */}
        <CustomButton variant="secondary" className="truncate">
          Local
        </CustomButton>

        {/* <CustomButton variant="secondary" className="truncate">
          Podcast
        </CustomButton> */}
      </header>

      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hidden px-2 md:px-6">

        {/* Recently played , tạm cmt nhiều quá làm k hết=)) */}
        {/* <div className="flex flex-wrap gap-4 p-4">
          {albumsData

            .slice(0, width > 1024 ? 6 : width < 768 ? 3 : 4)
            .map((album) => (
              <BoxCard
                key={album.AlbumID}
                playlist={album}
                width={width}
                variant="list"
              />
            ))}
        </div> */}

        <div className="flex flex-col space-y-8 p-10">
          {/* <section className="flex flex-col">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Dành cho bạn</h2>
              <button className="text-sm font-bold text-gray-400 hover:text-white">
                Xem tất cả
              </button>
            </div>
            <div className="flex pb-4 scrollbar-hide -ml-6">
              <PlaylistCarousel playlists={albumsData} variant="playlist" />
            </div>
          </section> */}

          <TopArtistsSection/>

          <AlbumsSection/>
        </div>
      </div>
    </div>
  );
};

export default HomeContainer;
