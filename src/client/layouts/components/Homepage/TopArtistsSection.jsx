import React, { useState, useEffect } from "react";
import PlaylistCarousel from "@/components/BoxCard/PlaylistCarousel";

export const artists = []; // Initialize as empty

const TopArtistsSection = () => {
    const [artistsData, setArtistsData] = useState([]);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/spotify_api/top-artists/");
                const data = await response.json();
                setArtistsData(data); // Update state
                artists.push(...data); // Save as JSON without altering frontend structure
            } catch (error) {
                console.error("Error fetching top artists:", error);
            }
        };

        fetchArtists();
    }, []);

    return (
        <section className="flex flex-col">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Top Artists</h2>
                <button className="text-sm font-bold text-gray-400 hover:text-white">
                    Xem tất cả
                </button>
            </div>
            <div className="flex pb-4 scrollbar-hide -ml-6">
                <PlaylistCarousel playlists={artistsData} variant="artist" />
            </div>
        </section>
    );
};

export default TopArtistsSection;