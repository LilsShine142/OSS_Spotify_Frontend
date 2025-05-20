import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import CreateRoomModal from './CreateRoomModal';
import ChatRoom from './ChatRoom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ChatSection = ({ userId }) => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  useEffect(() => {
    if (!userId) {
      console.error('No user ID provided to ChatSection');
      toast.error('Please log in to use chat');
      return;
    }
    loadRooms();
  }, [userId]);

  const loadRooms = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const token = userData?.token;

      if (!token) {
        console.error('No authentication token found');
        toast.error('Please log in to access chat rooms');
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/chatting/rooms/user/?user_id=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Rooms loaded successfully:', data.results);
      setRooms(data.results);
    } catch (error) {
      console.error('Error loading rooms:', error);
      toast.error('Failed to load chat rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleRoomCreated = (newRoom) => {
    setRooms(prev => [newRoom, ...prev]);
    setSelectedRoom(newRoom);
  };

  const handleJoinRoom = async () => {
    if (!roomCode) {
      setJoinError('Please enter a room code');
      return;
    }

    try {
      const findResponse = await fetch(`http://127.0.0.1:8000/chatting/rooms/find/${roomCode}/`);
      const findData = await findResponse.json();
      
      if (!findResponse.ok) {
        setJoinError('Room not found');
        return;
      }

      const joinResponse = await fetch(`http://127.0.0.1:8000/chatting/rooms/${findData.room_id}/join/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId }),
        });
        
        if (joinResponse.ok) {
        toast.success('Joined room successfully');
        await loadRooms();
          setShowJoinModal(false);
          setRoomCode('');
          setJoinError('');
        } else {
        const data = await joinResponse.json();
        setJoinError(data.error || 'Failed to join room');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      setJoinError('Failed to join room');
    }
  };

  const handleLeaveRoom = async () => {
    setSelectedRoom(null);
    await loadRooms();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#121212]">
        <div className="text-white">Loading rooms...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-[#121212]">
      {/* Sidebar - Made even smaller with toggle */}
      <div className={`${isSidebarMinimized ? 'w-12' : 'w-48'} bg-[#181818] border-r border-[#282828] flex flex-col transition-all duration-300 relative h-full`}>
        {/* Toggle button - Moved to top left */}
        <button
          onClick={() => setIsSidebarMinimized(!isSidebarMinimized)}
          className="absolute left-2 top-3 bg-[#282828] text-white p-1.5 rounded-full hover:bg-[#333333] transition-colors z-10 border border-[#404040]"
        >
          {isSidebarMinimized ? <FaChevronRight size={10} /> : <FaChevronLeft size={10} />}
        </button>

        {/* Header section - Fixed height */}
        <div className="p-2 border-b border-[#282828] bg-[#181818] flex-shrink-0">
          {!isSidebarMinimized && (
            <>
              <h2 className="text-base font-bold text-white mb-2 pl-10">Chat Rooms</h2>
              <div className="space-y-1.5">
            <button
              onClick={() => setShowCreateModal(true)}
                  className="w-full px-2 py-1.5 bg-[#1DB954] text-white rounded-full text-xs font-medium hover:bg-[#1ed760] transition-colors duration-200"
            >
                  Create Room
            </button>
            <button
              onClick={() => setShowJoinModal(true)}
                  className="w-full px-2 py-1.5 bg-[#282828] text-white rounded-full text-xs font-medium hover:bg-[#333333] transition-colors duration-200"
            >
                  Join Room
            </button>
              </div>
            </>
          )}
          </div>

        {/* Scrollable content - Takes remaining height */}
        <div className="flex-1 overflow-y-auto bg-[#181818]">
          {!isSidebarMinimized && (
            rooms.length === 0 ? (
              <div className="text-center text-gray-400 mt-2 p-2">
                <p className="text-xs mb-0.5">No rooms yet</p>
                <p className="text-[10px]">Create or join a room</p>
              </div>
            ) : (
              <div className="p-1.5">
                {rooms.map(room => (
                  <button
                    key={room._id}
                    onClick={() => setSelectedRoom(room)}
                    className={`w-full p-2 text-left rounded-lg mb-1 transition-all duration-200 ${
                      selectedRoom?._id === room._id
                        ? 'bg-[#1DB954] text-white shadow-lg'
                        : 'text-gray-300 hover:bg-[#282828] hover:shadow-md'
                    }`}
                  >
                    <div className="font-medium text-xs mb-0.5 truncate">{room.name}</div>
                    <div className="text-[10px] opacity-75">
                      {room.is_host ? 'You are host' : 'Member'}
                    </div>
                  </button>
                ))}
              </div>
            )
            )}
          </div>
        </div>

      {/* Chat area */}
      <div className="flex-1 bg-[#121212] flex flex-col">
        {selectedRoom ? (
          <div className="flex-1 flex flex-col">
            {/* Room header */}
            <div className="p-3 border-b border-[#282828] bg-[#181818]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedRoom.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selectedRoom.is_host ? 'You are the host' : 'You are a member'}
                  </p>
                </div>
                <button
                  onClick={handleLeaveRoom}
                  className="px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Leave Room
                </button>
              </div>
            </div>
            
            {/* Chat messages area */}
            <div className="flex-1">
              <ChatRoom
                room={selectedRoom}
                userId={userId}
                onLeave={handleLeaveRoom}
                isSidebarMinimized={isSidebarMinimized}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <p className="text-lg font-bold mb-1.5">Select a room to start chatting</p>
              <p className="text-sm">or create a new one</p>
            </div>
        </div>
      )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateRoomModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onRoomCreated={handleRoomCreated}
          userId={userId}
        />
      )}

      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-[#181818] p-4 rounded-xl w-[350px] shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-3">Join Room</h3>
            <div className="mb-3">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6);
                  setRoomCode(value);
                  setJoinError('');
                }}
                placeholder="Enter 6-character room code"
                className="w-full p-2 bg-[#282828] text-white rounded-lg border border-[#404040] focus:border-[#1DB954] focus:outline-none text-xs"
              />
              {joinError && (
                <p className="text-red-500 text-xs mt-1.5">{joinError}</p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setRoomCode('');
                  setJoinError('');
                }}
                className="px-2 py-1.5 text-gray-400 hover:text-white transition-colors font-medium text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinRoom}
                className="px-2 py-1.5 bg-[#1DB954] text-white rounded-full font-medium hover:bg-[#1ed760] transition-colors text-xs"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSection; 