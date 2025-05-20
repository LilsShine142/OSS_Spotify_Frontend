import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { toast } from 'react-toastify';

const MusicPlayer = ({ room, userId, socket }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);
    const audioRef = useRef(null);

    useEffect(() => {
        if (socket) {
            const handleMessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'play_song') {
                        handlePlaySong(data.song_id);
                    } else if (data.type === 'song_completed') {
                        handleSongCompleted();
                    }
                } catch (error) {
                    console.error('Error handling WebSocket message:', error);
                }
            };

            socket.addEventListener('message', handleMessage);
            
            return () => {
                socket.removeEventListener('message', handleMessage);
            };
        }
    }, [socket]);

    const handlePlaySong = async (songId) => {
        try {
            const response = await fetch(`/spotify_app/songs/${songId}/`);
            if (!response.ok) throw new Error('Failed to load song');
            
            const song = await response.json();
            setCurrentSong(song);
            if (audioRef.current) {
                audioRef.current.src = song.audio_file;
                audioRef.current.play();
                setIsPlaying(true);
            }
        } catch (error) {
            console.error('Error playing song:', error);
            toast.error('Failed to play song');
        }
    };

    const handleSongCompleted = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        setCurrentSong(null);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleEnded = () => {
        handleSongCompleted();
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'song_completed'
            }));
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-[#282828] p-4">
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
            />
            
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                {/* Song Info */}
                <div className="flex items-center space-x-4 w-1/3">
                    {currentSong && (
                        <>
                            <img
                                src={currentSong.img || '/default-song-image.png'}
                                alt={currentSong.title}
                                className="w-14 h-14 rounded"
                            />
                            <div>
                                <h4 className="text-white font-medium">{currentSong.title}</h4>
                                <p className="text-gray-400 text-sm">{currentSong.duration}</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Playback Controls */}
                <div className="flex flex-col items-center w-1/3">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={togglePlay}
                            className="text-white hover:text-[#1DB954] transition-colors"
                            disabled={!currentSong}
                        >
                            {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
                        </button>
                    </div>
                    <div className="w-full mt-2">
                        <div className="relative h-1 bg-[#282828] rounded-full">
                            <div
                                className="absolute h-full bg-[#1DB954] rounded-full"
                                style={{ width: `${(currentTime / duration) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Volume Control */}
                <div className="flex items-center space-x-2 w-1/3 justify-end">
                    <button
                        onClick={toggleMute}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-24"
                    />
                </div>
            </div>
        </div>
    );
};

export default MusicPlayer; 