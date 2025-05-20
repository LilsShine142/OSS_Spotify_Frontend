import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaList } from 'react-icons/fa';
import { toast } from 'react-toastify';

const RoomPlaylist = ({ room, socket, onPlaySong }) => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddSong, setShowAddSong] = useState(false);
    const [allSongs, setAllSongs] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);

    useEffect(() => {
        console.log('Component mounted');
        loadPlaylist();
        loadAllSongs();
        
        if (socket) {
            const handleMessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'playlist_update') {
                        handlePlaylistUpdate(data.message);
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
    }, [room._id, socket]);

    const loadAllSongs = async () => {
        console.log('loadAllSongs called');
        try {
            console.log('Fetching songs from API...');
            const response = await fetch('http://127.0.0.1:8000/spotify_app/songs/', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            
            console.log('API Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error:', errorText);
                throw new Error('Failed to load songs');
            }
            
            const data = await response.json();
            console.log('Songs data received:', data);
            setAllSongs(data || []);
            console.log('allSongs state updated:', data?.length || 0, 'songs');
        } catch (error) {
            console.error('Error in loadAllSongs:', error);
            toast.error('Failed to load songs');
        }
    };

    const loadPlaylist = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            const token = userData?.token;

            if (!token) {
                console.error('No authentication token found');
                toast.error('Please log in to access playlist');
                return;
            }

            const response = await fetch(`http://127.0.0.1:8000/chatting/rooms/${room._id}/playlist/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to load playlist');
            
            const data = await response.json();
            console.log('Fetched playlist:', data);
            setSongs(data.songs || []);
            
            // If there are songs in the playlist, start playing the first one
            if (data.songs && data.songs.length > 0) {
                playNextSong(0);
            }
        } catch (error) {
            toast.error('Failed to load playlist');
            console.error('Error loading playlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlaylistUpdate = (data) => {
        if (data.type === 'add_song') {
            setSongs(prev => {
                const newSongs = [...prev, data.song];
                // If this is the first song, start playing it
                if (prev.length === 0) {
                    playNextSong(0);
                }
                return newSongs;
            });
        } else if (data.type === 'remove_song') {
            setSongs(prev => prev.filter(song => song.id !== data.song_id));
        }
    };

    const handleSongCompleted = () => {
        // Remove the current song and play the next one
        setSongs(prev => {
            const newSongs = prev.filter((_, index) => index !== currentSongIndex);
            if (newSongs.length > 0) {
                // Play the next song (or first song if we were at the end)
                const nextIndex = currentSongIndex >= newSongs.length ? 0 : currentSongIndex;
                playNextSong(nextIndex);
            }
            return newSongs;
        });
    };

    const playNextSong = (index) => {
        if (songs[index]) {
            setCurrentSongIndex(index);
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: 'music_control',
                    action: 'play',
                    song_id: songs[index].id
                }));
            }
        }
    };

    const handleAddSong = async (songId) => {
        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            const token = userData?.token;

            if (!token) {
                console.error('No authentication token found');
                toast.error('Please log in to add songs');
                return;
            }

            const response = await fetch(`http://127.0.0.1:8000/chatting/rooms/${room._id}/playlist/add/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ song_id: songId }),
                credentials: 'include'
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add song');
            }
            
            // Get the updated playlist after adding the song
            const playlistResponse = await fetch(`http://127.0.0.1:8000/chatting/rooms/${room._id}/playlist/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            if (!playlistResponse.ok) throw new Error('Failed to load updated playlist');
            
            const playlistData = await playlistResponse.json();
            setSongs(playlistData.songs || []);
            setShowAddSong(false);
            toast.success('Song added to playlist');
            
            // If this is the first song, start playing it
            if (songs.length === 0 && socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: 'play_song',
                    song_id: songId
                }));
            }
        } catch (error) {
            toast.error('Failed to add song to playlist');
            console.error('Error adding song:', error);
        }
    };

    const handleAddSongClick = () => {
        console.log('Add Song button clicked');
        console.log('Current allSongs:', allSongs);
        setShowAddSong(!showAddSong);
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <>
            <button
                onClick={() => {
                    console.log('Toggle button clicked');
                    setIsOpen(!isOpen);
                }}
                className="fixed right-4 top-4 z-[100] bg-[#1DB954] hover:bg-[#1ed760] text-white p-2 rounded-full shadow-lg transition-colors"
                title="Toggle Playlist"
            >
                <FaList size={20} />
            </button>

            <div 
                className={`fixed right-0 top-0 h-full w-80 bg-[#181818] border-l border-[#282828] transform transition-transform duration-300 ease-in-out z-50 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="h-full flex flex-col">
                    <div className="p-4 border-b border-[#282828]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white">Room Playlist</h3>
                            <div className="flex items-center gap-2 mr-4">
                                <button
                                    onClick={handleAddSongClick}
                                    className="text-green-500 hover:text-green-400 transition-colors"
                                    title={showAddSong ? "Close Add Song" : "Add Song"}
                                >
                                    {showAddSong ? <FaTimes size={20} /> : <FaPlus size={20} />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                    title="Close Playlist"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>
                        </div>

                        {showAddSong && (
                            <div className="mb-4">
                                <div className="max-h-48 overflow-y-auto bg-[#282828] rounded-lg">
                                    {allSongs && allSongs.length > 0 ? (
                                        allSongs.map(song => (
                                            <div
                                                key={song._id}
                                                className="flex items-center justify-between p-2 hover:bg-[#383838] transition-colors"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={song.img || '/default-song-image.png'}
                                                        alt={song.title}
                                                        className="w-10 h-10 rounded"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="text-white text-sm truncate max-w-[150px]">{song.title}</span>
                                                        <span className="text-gray-400 text-xs">{song.duration}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleAddSong(song._id)}
                                                    className="text-green-500 hover:text-green-400 p-1"
                                                    title="Add to playlist"
                                                >
                                                    <FaPlus size={14} />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-gray-400">
                                            No songs available
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto bg-[#181818]">
                        {songs.length === 0 ? (
                            <div className="h-full flex items-center justify-center">
                                <p className="text-gray-400 text-center">No songs in playlist</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-[#282828]">
                                {songs.map((song, index) => (
                                    <div
                                        key={song.id}
                                        className={`flex items-center p-3 hover:bg-[#282828] transition-colors ${
                                            index === currentSongIndex ? 'bg-[#282828]' : ''
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <img
                                                src={song.img}
                                                alt={song.title}
                                                className="w-12 h-12 rounded flex-shrink-0"
                                            />
                                            <div className="min-w-0">
                                                <h4 className="text-white font-medium truncate">{song.title}</h4>
                                                <p className="text-gray-400 text-sm">{song.duration}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default RoomPlaylist; 