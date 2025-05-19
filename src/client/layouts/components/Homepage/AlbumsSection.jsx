import React from "react";
import PlaylistCarousel from "@/components/BoxCard/PlaylistCarousel";

const AlbumsSection = ({ albums = [] }) => {
    return (
        <section className="flex flex-col">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">New Releases</h2>
                <button className="text-sm font-bold text-gray-400 hover:text-white">
                    Xem tất cả
                </button>
            </div>
            <div className="flex pb-4 scrollbar-hide -ml-6">
                <PlaylistCarousel playlists={albums} variant="album" />
            </div>
        </section>
    );
};

export default AlbumsSection;