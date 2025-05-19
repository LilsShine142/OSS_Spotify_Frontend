import React from "react";
import PlaylistCarousel from "@/components/BoxCard/PlaylistCarousel";

const TopArtistsSection = ({ artists = [] }) => {
    return (
        <section className="flex flex-col">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Top Artists</h2>
                <button className="text-sm font-bold text-gray-400 hover:text-white">
                    Xem tất cả
                </button>
            </div>
            <div className="flex pb-4 scrollbar-hide -ml-6">
                <PlaylistCarousel playlists={artists} variant="artist" />
            </div>
        </section>
    );
};

export default TopArtistsSection;