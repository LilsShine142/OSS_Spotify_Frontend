import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { FaPaperPlane, FaUser } from 'react-icons/fa';
import RoomPlaylist from './RoomPlaylist';

const ChatRoom = ({ room, userId, onLeave, isSidebarMinimized }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const messagesEndRef = useRef(null);
  const [users, setUsers] = useState({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!room || !userId) return;

    const loadMessages = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const token = userData?.token;

        if (!token) {
          console.error('No authentication token found');
          toast.error('Please log in to access messages');
          return;
        }

        const response = await fetch(`http://127.0.0.1:8000/chatting/rooms/${room._id}/messages/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Messages loaded successfully:', data);
        
        // Messages are already ordered and formatted by the backend
        setMessages(data.results || []);
        
        // Update users state with fetched user info
        const usersMap = {};
        data.results.forEach(message => {
          if (message.user) {
            usersMap[message.user_id] = message.user;
          }
        });
        setUsers(usersMap);
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error('Failed to load messages');
      }
    };

    const connectWebSocket = () => {
      try {
        const wsUrl = `ws://127.0.0.1:8001/ws/chat/${room._id}/`;
        console.log('Connecting to WebSocket:', wsUrl);
        
        const newSocket = new WebSocket(wsUrl);
        
        newSocket.onopen = () => {
          console.log('WebSocket connected successfully');
          setConnectionStatus('connected');
          // Send user info to identify the connection
          newSocket.send(JSON.stringify({
            type: 'user_join',
            user_id: userId
          }));
        };

        newSocket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('Received message:', data);
            
            if (data.type === 'chat_message') {
              // Check if message already exists to prevent duplicates
              setMessages(prev => {
                const messageExists = prev.some(msg => msg._id === data.message._id);
                if (messageExists) {
                  return prev;
                }
                return [...prev, data.message];
              });
              
              // Update user info if available
              if (data.user) {
                setUsers(prev => ({
                  ...prev,
                  [data.message.user_id]: data.user
                }));
              }
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        newSocket.onerror = (error) => {
          console.error('WebSocket error:', error);
          setConnectionStatus('error');
          toast.error('Connection error. Please try again.');
          // Attempt to reconnect after 5 seconds
          setTimeout(() => {
            if (newSocket.readyState === WebSocket.CLOSED) {
              console.log('Attempting to reconnect...');
              connectWebSocket();
            }
          }, 5000);
        };

        newSocket.onclose = (event) => {
          console.log('WebSocket connection closed:', event.code, event.reason);
          setConnectionStatus('disconnected');
          // Attempt to reconnect if the connection was closed unexpectedly
          if (event.code !== 1000) {
            setTimeout(() => {
              console.log('Attempting to reconnect...');
              connectWebSocket();
            }, 5000);
          }
        };

        setSocket(newSocket);

        return () => {
          if (newSocket) {
            newSocket.close(1000, 'Component unmounting');
          }
        };
      } catch (error) {
        console.error('Error setting up WebSocket:', error);
        setConnectionStatus('error');
        toast.error('Failed to connect to chat');
        setTimeout(() => {
          console.log('Attempting to reconnect...');
          connectWebSocket();
        }, 5000);
      }
    };

    loadMessages();
    const cleanup = connectWebSocket();

    return () => {
      if (cleanup) cleanup();
    };
  }, [room, userId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || socket.readyState !== WebSocket.OPEN) return;

    try {
      const messageData = {
        type: 'chat_message',
        message: newMessage.trim(),
        user_id: userId,
        room_id: room._id
      };
      socket.send(JSON.stringify(messageData));
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        console.error('Invalid timestamp:', timestamp);
        return 'Invalid time';
      }
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid time';
    }
  };

  const formatDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        console.error('Invalid timestamp:', timestamp);
        return 'Invalid date';
      }
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = formatDate(message.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full bg-[#121212]">
      {/* Connection status indicator */}
      <div className={`px-3 py-1 text-xs ${
        connectionStatus === 'connected' ? 'bg-green-900/20 text-green-400' :
        connectionStatus === 'connecting' ? 'bg-yellow-900/20 text-yellow-400' :
        'bg-red-900/20 text-red-400'
      }`}>
        {connectionStatus === 'connected' ? 'Connected' :
         connectionStatus === 'connecting' ? 'Connecting...' :
         'Disconnected'}
      </div>

      {/* Messages area with input */}
      <div className="flex-1 flex flex-col">
        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-[30vh]">
          {Object.entries(messageGroups).map(([date, messages]) => (
            <div key={date} className="space-y-4">
              {/* Date separator */}
              <div className="flex items-center justify-center">
                <div className="px-3 py-1 bg-[#282828] rounded-full text-xs text-gray-400">
                  {date}
                </div>
              </div>

              {/* Messages for this date */}
              {messages.map((message, index) => {
                const isCurrentUser = message.user_id === userId;
                const showAvatar = index === 0 || messages[index - 1]?.user_id !== message.user_id;
                const user = users[message.user_id];

                return (
                  <div
                    key={message._id}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} group`}
                  >
                    {/* Message content */}
                    <div className="flex flex-col max-w-[70%]">
                      {/* Username and avatar for other users */}
                      {!isCurrentUser && showAvatar && (
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 rounded-full bg-[#282828] flex items-center justify-center flex-shrink-0">
                            {user?.profile_pic ? (
                              <img
                                src={user.profile_pic}
                                alt={user.name}
                                className="w-6 h-6 rounded-full"
                              />
                            ) : (
                              <FaUser className="text-gray-400 text-sm" />
                            )}
                          </div>
                          <span className="text-xs text-gray-400">
                            {user?.name || 'Unknown User'}
                          </span>
                        </div>
                      )}

                      {/* Message bubble */}
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          isCurrentUser
                            ? 'bg-[#1DB954] text-white rounded-br-none'
                            : 'bg-[#282828] text-white rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      </div>

                      {/* Timestamp */}
                      <span className={`text-[10px] text-gray-500 mt-1 ${
                        isCurrentUser ? 'text-right' : 'text-left'
                      }`}>
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <div className="bg-[#181818] border-t border-[#282828] h-20 mb-[12%]">
          <form onSubmit={handleSendMessage} className="h-full flex items-center px-4">
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-[#282828] text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB954] placeholder-gray-500 hover:bg-[#333333] transition-colors"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || connectionStatus !== 'connected'}
                className={`p-2.5 rounded-full ${
                  newMessage.trim() && connectionStatus === 'connected'
                    ? 'bg-[#1DB954] text-white hover:bg-[#1ed760] hover:scale-105'
                    : 'bg-[#282828] text-gray-500 cursor-not-allowed'
                } transition-all duration-200`}
                title={!newMessage.trim() ? "Type a message to send" : "Send message"}
              >
                <FaPaperPlane size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Room Playlist */}
      <RoomPlaylist room={room} socket={socket} />
    </div>
  );
};

export default ChatRoom; 