import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaPlus, FaTimes, FaList, FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { PlayerContext } from '../../../../context/PlayerContext/PlayerContext';

const RoomPlayerBar = ({ currentSong, isPlaying, currentTime, duration, onPlayPause, onNext, onPrev, onSeek }) => {
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className={`h-[12%] fixed bottom-0 right-0 w-full z-50 px-6 py-3
            border-t border-gray-800 shadow-xl
            transition-all duration-500 ease-in-out
            ${isPlaying ? "bg-gradient-to-r from-black via-[#1e1b4b] to-black" : "bg-gradient-to-r from-gray-900 via-black to-gray-900"}`}>
            <div className="flex items-center justify-between h-full max-w-8xl mx-auto">
                {/* Track info */}
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

                {/* Main controls */}
                <div className="flex flex-col items-center w-2/4 max-w-[600px]">
                    <div className="flex items-center gap-4">
                        {/* Previous button */}
                        <button
                            onClick={onPrev}
                            className="text-gray-400 hover:text-pink-400 hover:scale-110 transition-transform"
                            title="Previous"
                        >
                            <FaStepBackward size={16} />
                        </button>

                        {/* Play/Pause button */}
                        <button
                            onClick={onPlayPause}
                            className="text-white hover:text-pink-400 hover:scale-110 transition-transform"
                            title={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
                        </button>

                        {/* Next button */}
                        <button
                            onClick={onNext}
                            className="text-gray-400 hover:text-pink-400 hover:scale-110 transition-transform"
                            title="Next"
                        >
                            <FaStepForward size={16} />
                        </button>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full mt-2">
                        <div 
                            className="h-1 bg-gray-600 rounded-full cursor-pointer"
                            onClick={onSeek}
                        >
                            <div 
                                className="h-full bg-pink-500 rounded-full"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Volume control */}
                <div className="w-1/3 flex justify-end">
                    <div className="flex items-center space-x-2">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={currentTime}
                            onChange={(e) => onSeek(e.target.value)}
                            className="w-24"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const RoomPlaylist = ({ room, socket, onPlaySong }) => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddSong, setShowAddSong] = useState(false);
    const [allSongs, setAllSongs] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const audioRef = useRef(null);
    const { play, pause, resume, seek, currentSong, isPlaying, currentTime } = useContext(PlayerContext);
    const [isInitialSync, setIsInitialSync] = useState(true);
    const lastProcessedMessageRef = useRef(null);

    // Update songs state to include playing state
    const updateSongsWithPlayingState = (songsList, currentIndex, isCurrentlyPlaying) => {
        return songsList.map((song, index) => ({
            ...song,
            isPlaying: index === currentIndex && isCurrentlyPlaying
        }));
    };

    // Update songs whenever currentSongIndex or isPlaying changes
    useEffect(() => {
        setSongs(prev => updateSongsWithPlayingState(prev, currentSongIndex, isPlaying));
    }, [currentSongIndex, isPlaying]);

    useEffect(() => {
        console.log('Component mounted');
        loadPlaylist();
        loadAllSongs();
        
        // Listen for room state sync events
        const handleRoomStateSync = (event) => {
            const roomState = event.detail;
            console.log('Received room state sync:', roomState);
            
            // Check if we've already processed this state
            const stateKey = `${roomState.playing_song?._id}-${roomState.current_time}-${roomState.is_playing}`;
            if (lastProcessedMessageRef.current === stateKey) {
                console.log('Skipping duplicate state sync');
                return;
            }
            lastProcessedMessageRef.current = stateKey;
            
            if (roomState.playing_song) {
                // Find the song in our local songs array
                const song = songs.find(s => s._id === roomState.playing_song._id);
                console.log('Found matching song:', song);
                
                if (song) {
                    // Calculate the correct position to seek to
                    const now = new Date();
                    const playStartedAt = new Date(roomState.play_started_at);
                    const elapsedTime = (now - playStartedAt) / 1000; // Convert to seconds
                    const seekPosition = roomState.current_time + elapsedTime;
                    
                    console.log('Calculated seek position:', seekPosition, {
                        now: now.toISOString(),
                        playStartedAt: playStartedAt.toISOString(),
                        elapsedTime,
                        currentTime: roomState.current_time
                    });

                    // Update the current song index
                    const songIndex = songs.findIndex(s => s._id === roomState.playing_song._id);
                    if (songIndex !== -1) {
                        setCurrentSongIndex(songIndex);
                    }

                    // Play the song
                    play({
                        _id: song._id,
                        title: song.title,
                        artist: song.artist || "Unknown Artist",
                        img: song.img || '/default-song-image.png',
                        audioUrl: song.audio_file,
                        duration: song.duration
                    });
                    
                    // Seek to the correct position
                    console.log('Seeking to position:', seekPosition);
                    seek(seekPosition);
                    
                    if (roomState.is_playing) {
                        console.log('Resuming playback');
                        resume();
                    } else {
                        console.log('Pausing playback');
                        pause();
                    }
                } else {
                    console.log('Song not found in local playlist, adding it');
                    // If the song is not in our local playlist, add it
                    const newSong = {
                        _id: roomState.playing_song._id,
                        title: roomState.playing_song.title,
                        artist: roomState.playing_song.artist || "Unknown Artist",
                        img: roomState.playing_song.img || '/default-song-image.png',
                        audio_file: roomState.playing_song.audio_file,
                        duration: roomState.playing_song.duration
                    };
                    
                    setSongs(prev => {
                        const newSongs = [...prev, newSong];
                        setCurrentSongIndex(newSongs.length - 1);
                        return newSongs;
                    });
                }
            }
        };

        window.addEventListener('roomStateSync', handleRoomStateSync);
        
        if (socket) {
            const handleMessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('Received WebSocket message:', data);
                    
                    // Skip if we've already processed this message
                    const messageKey = JSON.stringify(data);
                    if (lastProcessedMessageRef.current === messageKey) {
                        console.log('Skipping duplicate message');
                        return;
                    }
                    lastProcessedMessageRef.current = messageKey;
                    
                    if (data.type === 'playlist_update') {
                        handlePlaylistUpdate(data.message);
                    } else if (data.type === 'song_completed') {
                        handleSongCompleted();
                    } else if (data.type === 'music_control') {
                        handleMusicControl(data.message);
                    } else if (data.type === 'user_joined') {
                        // When a new user joins, send them the current playback state
                        if (currentSong && socket.readyState === WebSocket.OPEN) {
                            const now = new Date();
                            const message = {
                                type: 'music_control',
                                message: {
                                    action: 'sync',
                                    song_id: currentSong._id,
                                    current_time: currentTime,
                                    is_playing: isPlaying,
                                    play_started_at: now.toISOString()
                                }
                            };
                            console.log('Sending sync message to new user:', message);
                            socket.send(JSON.stringify(message));
                        }
                    }
                } catch (error) {
                    console.error('Error handling WebSocket message:', error);
                }
            };

            socket.addEventListener('message', handleMessage);
            
            return () => {
                socket.removeEventListener('message', handleMessage);
                window.removeEventListener('roomStateSync', handleRoomStateSync);
            };
        }
    }, [room._id, socket, songs, currentSong, currentTime, isPlaying]);

    // Load initial room state when component mounts
    useEffect(() => {
        const loadRoomState = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/chatting/rooms/${room._id}/state/`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.playing_song) {
                        const song = songs.find(s => s.id === data.playing_song._id);
                        if (song) {
                            play({
                                _id: song.id,
                                title: song.title,
                                artist: song.artist || "Unknown Artist",
                                img: song.img,
                                audioUrl: song.audio_file,
                                duration: song.duration
                            });
                            
                            // Calculate the correct position to seek to
                            const seekPosition = data.current_time;
                            seek(seekPosition);
                            
                            if (data.is_playing) {
                                resume();
                            } else {
                                pause();
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading room state:', error);
            }
        };

        if (isInitialSync && songs.length > 0) {
            loadRoomState();
            setIsInitialSync(false);
        }
    }, [songs, isInitialSync]);

    const handleMusicControl = (data) => {
        console.log('Handling music control:', data);
        const { action, song_id, current_time, is_playing } = data;
        
        // Skip if we've already processed this control message
        const controlKey = `${action}-${song_id}-${current_time}-${is_playing}`;
        if (lastProcessedMessageRef.current === controlKey) {
            console.log('Skipping duplicate control message');
            return;
        }
        lastProcessedMessageRef.current = controlKey;
        
        if (action === 'play' || action === 'pause' || action === 'sync') {
            const song = songs.find(s => s._id === song_id);
            console.log('Found song for music control:', song);
            
            if (song) {
                if (is_playing) {
                    console.log('Playing song:', song.title);
                    play({
                        _id: song._id,
                        title: song.title,
                        artist: song.artist || "Unknown Artist",
                        img: song.img || '/default-song-image.png',
                        audioUrl: song.audio_file,
                        duration: song.duration
                    });
                    
                    // Update current song index
                    const songIndex = songs.findIndex(s => s._id === song_id);
                    if (songIndex !== -1) {
                        setCurrentSongIndex(songIndex);
                    }
                    
                    // If it's a sync action, also seek to the correct position
                    if (action === 'sync') {
                        console.log('Syncing to position:', current_time);
                        seek(current_time);
                    }
                } else {
                    console.log('Pausing song:', song.title);
                    pause();
                }
            }
        } else if (action === 'seek') {
            console.log('Seeking to position:', current_time);
            seek(current_time);
        }
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                // Pause
                console.log('Toggle: Pausing current song');
                pause();
                if (socket && socket.readyState === WebSocket.OPEN) {
                    const message = {
                        type: 'music_control',
                        message: {
                            action: 'pause',
                            song_id: songs[currentSongIndex]?.id,
                            current_time: audioRef.current.currentTime,
                            is_playing: false
                        }
                    };
                    console.log('Sending pause message:', message);
                    socket.send(JSON.stringify(message));
                }
            } else {
                // Play
                console.log('Toggle: Playing current song');
                playNextSong(currentSongIndex);
                if (socket && socket.readyState === WebSocket.OPEN) {
                    const message = {
                        type: 'music_control',
                        message: {
                            action: 'play',
                            song_id: songs[currentSongIndex]?.id,
                            current_time: audioRef.current.currentTime,
                            is_playing: true
                        }
                    };
                    console.log('Sending play message:', message);
                    socket.send(JSON.stringify(message));
                }
            }
        }
    };

    const playNextSong = (index) => {
        if (songs[index]) {
            console.log('Playing next song at index:', index);
            setCurrentSongIndex(index);
            const song = songs[index];
            
            if (socket && socket.readyState === WebSocket.OPEN) {
                const message = {
                    type: 'music_control',
                    message: {
                        action: 'play',
                        song_id: song.id,
                        current_time: 0,
                        is_playing: true
                    }
                };
                console.log('Sending play next message:', message);
                socket.send(JSON.stringify(message));
            }

            play({
                _id: song.id,
                title: song.title,
                artist: song.artist || "Unknown Artist",
                img: song.img,
                audioUrl: song.audio_file,
                duration: song.duration
            });
        }
    };

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

    const handleSongCompleted = async () => {
        console.log('Song completed, handling next song');
        try {
            // Get the next song index
            const nextIndex = (currentSongIndex + 1) % songs.length;
            
            if (songs.length > 0) {
                const nextSong = songs[nextIndex];
                console.log('Playing next song:', nextSong);

                // Update room state in the database
                const userData = JSON.parse(localStorage.getItem('userData'));
                const token = userData?.token;

                if (!token) {
                    console.error('No authentication token found');
                    return;
                }

                const response = await fetch(`http://127.0.0.1:8000/chatting/rooms/${room._id}/state/`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        playing_song_id: nextSong._id,
                        current_time: 0,
                        is_playing: true,
                        play_started_at: new Date().toISOString()
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to update room state');
                }

                // Update local state
                setCurrentSongIndex(nextIndex);
                
                // Play the next song
                play({
                    _id: nextSong._id,
                    title: nextSong.title,
                    artist: nextSong.artist || "Unknown Artist",
                    img: nextSong.img || '/default-song-image.png',
                    audioUrl: nextSong.audio_file,
                    duration: nextSong.duration
                });

                // Notify other users
                if (socket && socket.readyState === WebSocket.OPEN) {
                    const message = {
                        type: 'music_control',
                        message: {
                            action: 'play',
                            song_id: nextSong._id,
                            current_time: 0,
                            is_playing: true
                        }
                    };
                    console.log('Sending next song message:', message);
                    socket.send(JSON.stringify(message));
                }
            } else {
                // If no more songs, update room state to stop playing
                const userData = JSON.parse(localStorage.getItem('userData'));
                const token = userData?.token;

                if (!token) {
                    console.error('No authentication token found');
                    return;
                }

                const response = await fetch(`http://127.0.0.1:8000/chatting/rooms/${room._id}/state/`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        playing_song_id: null,
                        current_time: 0,
                        is_playing: false,
                        play_started_at: null
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to update room state');
                }

                // Notify other users
                if (socket && socket.readyState === WebSocket.OPEN) {
                    const message = {
                        type: 'music_control',
                        message: {
                            action: 'stop',
                            song_id: null,
                            current_time: 0,
                            is_playing: false
                        }
                    };
                    console.log('Sending stop message:', message);
                    socket.send(JSON.stringify(message));
                }
            }
        } catch (error) {
            console.error('Error handling song completion:', error);
            toast.error('Error playing next song');
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

    const handleSeek = (e) => {
        if (audioRef.current) {
            const seekTime = typeof e === 'number' ? e : (e.target.value / 100) * audioRef.current.duration;
            audioRef.current.currentTime = seekTime;
            
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: 'music_control',
                    message: {
                        action: 'seek',
                        song_id: songs[currentSongIndex]?.id,
                        current_time: seekTime,
                        is_playing: songs[currentSongIndex]?.isPlaying
                    }
                }));
            }
        }
    };

    const handleNext = () => {
        const nextIndex = (currentSongIndex + 1) % songs.length;
        playNextSong(nextIndex);
    };

    const handlePrev = () => {
        const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        playNextSong(prevIndex);
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
                                        key={song._id}
                                        className={`flex items-center p-3 hover:bg-[#282828] transition-colors ${
                                            index === currentSongIndex ? 'bg-[#282828]' : ''
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <img
                                                src={song.img || '/default-song-image.png'}
                                                alt={song.title}
                                                className="w-12 h-12 rounded flex-shrink-0"
                                            />
                                            <div className="min-w-0">
                                                <h4 className="text-white font-medium truncate">{song.title}</h4>
                                                <p className="text-gray-400 text-sm">{song.duration}</p>
                                            </div>
                                        </div>
                                        {index === currentSongIndex && (
                                            <button
                                                onClick={togglePlay}
                                                className="ml-auto text-green-500 hover:text-green-400"
                                            >
                                                {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Add the player bar */}
            {songs.length > 0 && (
                <RoomPlayerBar
                    currentSong={songs[currentSongIndex]}
                    isPlaying={isPlaying}
                    currentTime={currentTime}
                    duration={songs[currentSongIndex]?.duration}
                    onPlayPause={togglePlay}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    onSeek={handleSeek}
                />
            )}
            
            <audio
                ref={audioRef}
                src={songs[currentSongIndex]?.audio_file}
                onTimeUpdate={() => {
                    if (audioRef.current) {
                        const currentTime = audioRef.current.currentTime;
                        if (socket && socket.readyState === WebSocket.OPEN) {
                            const message = {
                                type: 'music_control',
                                message: {
                                    action: 'seek',
                                    song_id: songs[currentSongIndex]?._id,
                                    current_time: currentTime,
                                    is_playing: isPlaying
                                }
                            };
                            socket.send(JSON.stringify(message));
                        }
                    }
                }}
                onEnded={handleSongCompleted}
            />
        </>
    );
};

export default RoomPlaylist; 