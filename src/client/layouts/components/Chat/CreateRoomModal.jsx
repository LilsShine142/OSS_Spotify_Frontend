import React, { useState } from 'react';
import { toast } from 'react-toastify';

const CreateRoomModal = ({ isOpen, onClose, onRoomCreated, userId }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Room name is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const token = userData?.token;

      if (!token) {
        console.error('No authentication token found');
        toast.error('Please log in to create a room');
        return;
      }

      const requestData = {
        name,
        description,
        host: userId,
        is_private: false,
        password: null
      };
      console.log('Creating room with data:', requestData);
      
      const response = await fetch('http://127.0.0.1:8000/chatting/rooms/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Get the raw response text first
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        // Try to parse the response as JSON
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Invalid response from server');
      }

      if (response.ok) {
        toast.success('Room created successfully!');
        onRoomCreated(data);
        setName('');
        setDescription('');
        onClose();
      } else {
        const errorMessage = data.error || 'Failed to create room';
        console.error('Error response:', errorMessage);
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error('Error creating room:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
      });
      const errorMessage = 'Failed to create room. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#181818] rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-white mb-4">Create Group Chat</h2>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Room Name</label>
          <input
            className="w-full px-3 py-2 rounded bg-[#242424] text-white outline-none"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter room name"
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Description</label>
          <textarea
            className="w-full px-3 py-2 rounded bg-[#242424] text-white outline-none"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Enter description (optional)"
            disabled={loading}
          />
        </div>
        {error && <div className="text-red-400 mb-2 text-sm">{error}</div>}
        <button
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-60"
          onClick={handleCreate}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </div>
  );
};

export default CreateRoomModal; 