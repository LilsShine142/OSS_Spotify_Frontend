import React, { useState, useEffect } from 'react';
import { FaComments, FaRobot, FaPlus, FaSignInAlt } from 'react-icons/fa';
import CreateRoomModal from './CreateRoomModal';

const ChatSection = ({ isOpen, onClose, userId }) => {
  const [activeTab, setActiveTab] = useState('group');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserRooms();
    }
  }, [isOpen, userId]);

  const fetchUserRooms = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching rooms for user:', userId);
      const response = await fetch(`/chatting/rooms/user/?user_id=${userId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        throw new Error(`Failed to fetch rooms: ${response.status} ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
        throw new Error('Invalid response format from server');
      }

      console.log('Parsed response data:', data);
      
      if (!data.results) {
        throw new Error('No rooms data in response');
      }

      setRooms(data.results);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError(err.message || 'Failed to load rooms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoomCreated = (newRoom) => {
    setRooms(prevRooms => [newRoom, ...prevRooms]);
  };

  const handleJoinRoom = async () => {
    if (!roomCode || roomCode.length !== 6) {
      setJoinError('Please enter a valid 6-character room code');
      return;
    }

    try {
      const response = await fetch(`/chatting/rooms/find/${roomCode}/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        // If room found, try to join it
        const joinResponse = await fetch(`/chatting/rooms/${data.room_id}/join/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ user_id: userId }),
        });

        const joinData = await joinResponse.json();
        
        if (joinResponse.ok) {
          // Refresh rooms list
          fetchUserRooms();
          setShowJoinModal(false);
          setRoomCode('');
          setJoinError('');
        } else {
          setJoinError(joinData.error || 'Failed to join room');
        }
      } else {
        setJoinError('Room not found');
      }
    } catch (err) {
      console.error('Error joining room:', err);
      setJoinError('Failed to join room. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-[#181818] shadow-lg z-50">
      <div className="p-4 border-b border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Chat</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            &times;
          </button>
        </div>
        <div className="flex space-x-4">
          <button
            className={`flex items-center space-x-2 px-4 py-2 rounded ${
              activeTab === 'group' ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('group')}
          >
            <FaComments />
            <span>Group Chat</span>
          </button>
          <button
            className={`flex items-center space-x-2 px-4 py-2 rounded ${
              activeTab === 'ai' ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('ai')}
          >
            <FaRobot />
            <span>AI Chat</span>
          </button>
        </div>
      </div>

      {activeTab === 'group' && (
        <div className="p-4">
          <div className="flex gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex-1 flex items-center justify-center space-x-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
            >
              <FaPlus />
              <span>Create Room</span>
            </button>
            <button
              onClick={() => setShowJoinModal(true)}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              <FaSignInAlt />
              <span>Join Room</span>
            </button>
          </div>

          <div className="mt-4">
            <h3 className="text-white font-semibold mb-2">Your Rooms</h3>
            {loading ? (
              <div className="text-gray-400">Loading rooms...</div>
            ) : error ? (
              <div className="text-red-400">{error}</div>
            ) : rooms.length === 0 ? (
              <div className="text-gray-400">No rooms yet. Create one to get started!</div>
            ) : (
              <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {rooms.map(room => (
                  <div
                    key={room._id}
                    className="p-4 bg-[#242424] rounded-lg hover:bg-[#2a2a2a] cursor-pointer transition-all duration-200 border border-transparent hover:border-green-500/20 group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="text-white font-medium group-hover:text-green-400 transition-colors">{room.name}</h4>
                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{room.description || 'No description'}</p>
                      </div>
                      {room.is_host && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">
                          Host
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3 text-xs">
                      <div className="flex items-center text-gray-500">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Host: {room.host.name}
                      </div>
                      <div className="text-gray-500">
                        {new Date(room.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="p-4">
          <div className="text-gray-400">AI Chat coming soon...</div>
        </div>
      )}

      {showCreateModal && (
        <CreateRoomModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onRoomCreated={handleRoomCreated}
          userId={userId}
        />
      )}

      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#242424] p-6 rounded-lg w-96">
            <h3 className="text-white text-xl font-semibold mb-4">Join Room</h3>
            <div className="mb-4">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6);
                  setRoomCode(value);
                  setJoinError('');
                }}
                placeholder="Enter 6-character room code"
                className="w-full p-2 bg-[#181818] text-white rounded border border-gray-700 focus:border-green-500 focus:outline-none"
              />
              {joinError && (
                <p className="text-red-500 text-sm mt-1">{joinError}</p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setRoomCode('');
                  setJoinError('');
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinRoom}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
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