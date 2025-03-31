import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { 
  FiUser, 
  FiBriefcase, 
  FiMessageSquare,
  FiMenu,
  FiX,
  FiSend
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isChatOpen) {
      const newSocket = io("http://localhost:8000", {
        withCredentials: true,
        auth: { token: localStorage.getItem("token") },
      });
  
      setSocket(newSocket);
  
      newSocket.on("connect", () => {
        setIsConnected(true);
        console.log("Connected to chat server");
  
        const studentId = localStorage.getItem("userId");
        const mentorId = localStorage.getItem("mentorId");
  
        if (studentId && mentorId) {
          const roomId = `${studentId}_${mentorId}`;
          newSocket.emit("joinRoom", { studentId, mentorId });
          console.log("Joined room:", roomId);
        }
  
        fetchMessages();
      });
  
      newSocket.on("disconnect", () => {
        setIsConnected(false);
        console.log("Disconnected from chat server");
      });
  
      newSocket.on("message", (message) => {
        setMessages((prev) => [...prev, message]);
      });
  
      return () => {
        newSocket.off("message");
        newSocket.disconnect();
      };
    }
  }, [isChatOpen]);
  

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch message history from API
  const fetchMessages = async () => {
    try {
      const studentId = localStorage.getItem("userId");
      const mentorId = localStorage.getItem("mentorId");
  
      if (!studentId || !mentorId) {
        console.error("❌ Missing studentId or mentorId");
        return;
      }
  
      const response = await fetch(
        `http://localhost:5000/api/messages?studentId=${studentId}&mentorId=${mentorId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
    }
  };
  

const handleSendMessage = () => {
  if (!newMessage.trim() || !socket || !isConnected) return;

  const messageData = {
    text: newMessage,
    senderId: localStorage.getItem("userId"),
    receiverId: localStorage.getItem("mentorId"),
    timestamp: new Date().toISOString(),
  };

  socket.emit("sendMessage", messageData);

  // Optimistically update UI
  setMessages((prev) => [...prev, messageData]);
  setNewMessage("");
};


  // Navigation logic
  const getActiveTab = () => {
    if (location.pathname.includes('updateform')) return 'Profile';
    if (location.pathname.includes('internships')) return 'Internships';
    return 'Profile';
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  const menuItems = [
    { 
      name: 'Profile', 
      icon: <FiUser size={20} />,
      path: 'updateform' 
    },
    { 
      name: 'Internships', 
      icon: <FiBriefcase size={20} />,
      path: 'internships' 
    },
  ];

  const handleNavigation = (path, name) => {
    setActiveTab(name);
    setIsOpen(false);
    navigate(`/student-dashboard/${path}`);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#16191C] text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 bg-[#16191C] text-gray-300 w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} transition-transform duration-300 ease-in-out shadow-xl`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-[#292E33]">
            <h1 className="text-xl font-semibold text-white">Dashboard</h1>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 mt-4">
            {menuItems.map((item) => (
              <button
                key={item.name}
                className={`w-full flex items-center px-6 py-4 text-left transition-colors duration-200 ${activeTab === item.name ? 'bg-[#29CB97] text-white' : 'hover:bg-[#292E33] text-gray-300'}`}
                onClick={() => handleNavigation(item.path, item.name)}
              >
                <span className="mr-4">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
            
            {/* Chat Button */}
            <button
              className={`w-full flex items-center px-6 py-4 text-left transition-colors duration-200 ${isChatOpen ? 'bg-[#29CB97] text-white' : 'hover:bg-[#292E33] text-gray-300'}`}
              onClick={toggleChat}
            >
              <span className="mr-4"><FiMessageSquare size={20} /></span>
              <span>Chat with Mentor</span>
              {!isConnected && isChatOpen && (
                <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>
              )}
            </button>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-[#292E33]">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
                <FiUser size={18} />
              </div>
              <span className="ml-3">User Profile</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="fixed inset-y-0 right-0 z-40 w-80 bg-white shadow-lg flex flex-col border-l border-gray-200">
          {/* Chat Header */}
          <div className="p-4 bg-[#29CB97] text-white flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Chat with Mentor</h2>
              <div className="text-xs flex items-center">
                Status: {isConnected ? (
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                    Connected
                  </span>
                ) : (
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                    Connecting...
                  </span>
                )}
              </div>
            </div>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="p-1 rounded-full hover:bg-white hover:bg-opacity-20"
            >
              <FiX size={20} />
            </button>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                {isConnected ? 'No messages yet. Start the conversation!' : 'Connecting to chat...'}
              </div>
            ) : (
              messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`mb-4 ${message.sender === 'student' ? 'flex justify-end' : ''}`}
                >
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">
                      {message.sender === 'mentor' ? 'Mentor' : 'You'} - {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className={`p-3 rounded-lg max-w-[70%] ${message.sender === 'student' ? 'bg-[#29CB97] text-white ml-auto' : 'bg-gray-100'}`}>
                      {message.text}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#29CB97]"
                disabled={!isConnected}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!isConnected || !newMessage.trim()}
                className={`px-4 py-2 rounded-r-lg transition-colors flex items-center ${
                  isConnected && newMessage.trim() 
                    ? 'bg-[#29CB97] text-white hover:bg-[#1fb881]' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FiSend size={18} className="mr-1" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay - Only on mobile when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;