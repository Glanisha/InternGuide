import { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/api/faculty/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        // Sort notifications by createdAt (newest first)
        const sortedNotifications = response.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(sortedNotifications);
      } catch (err) {
        setError(err.message || "Failed to fetch notifications");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:8000/api/faculty/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      setNotifications(notifications.map(notification => 
        notification._id === id ? { ...notification, isRead: true } : notification
      ));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'certifications') return notification.type === 'certification_added';
    if (filter === 'achievements') return notification.type === 'achievement_added';
    return true;
  });

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-4 rounded-xl border border-red-500/30 text-red-300">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-black min-h-screen">
      <h1 className="text-3xl font-bold text-center text-white">Notifications</h1>
      
      <div className="glass-card p-6 rounded-xl backdrop-blur-sm border border-gray-700 shadow-lg">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              filter === 'all' 
                ? 'bg-blue-600/80 text-white shadow-md' 
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              filter === 'unread' 
                ? 'bg-blue-600/80 text-white shadow-md' 
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter('certifications')}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              filter === 'certifications' 
                ? 'bg-blue-600/80 text-white shadow-md' 
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            Certifications
          </button>
          <button
            onClick={() => setFilter('achievements')}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              filter === 'achievements' 
                ? 'bg-blue-600/80 text-white shadow-md' 
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            Achievements
          </button>
        </div>

        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="glass-card-inner p-6 text-center text-gray-400 rounded-lg border border-gray-700">
              No notifications found
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`glass-card-inner p-5 rounded-lg border transition-all ${
                  notification.isRead 
                    ? 'border-gray-700 hover:border-gray-600' 
                    : 'border-blue-500/30 bg-blue-900/20 hover:border-blue-400/50'
                }`}
                onClick={() => !notification.isRead && markAsRead(notification._id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium text-white">
                        {notification.studentName}
                      </span>
                      <span className="ml-3 text-xs px-2 py-1 bg-gray-800/50 text-gray-300 rounded-full">
                        {notification.studentId.department}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-300">{notification.message}</p>
                    
                    {notification.type === 'certification_added' && (
                      <div className="mt-3">
                        <span className="text-sm font-medium text-gray-400">New certifications:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {notification.relatedData.newCertifications.map((cert, index) => (
                            <span 
                              key={index} 
                              className="px-3 py-1 bg-green-900/30 text-green-300 text-xs rounded-full border border-green-700/30"
                            >
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {notification.type === 'achievement_added' && (
                      <div className="mt-3">
                        <span className="text-sm font-medium text-gray-400">New achievements:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {notification.relatedData.newAchievements.map((ach, index) => (
                            <span 
                              key={index} 
                              className="px-3 py-1 bg-purple-900/30 text-purple-300 text-xs rounded-full border border-purple-700/30"
                            >
                              {ach}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end ml-4">
                    <span className="text-xs text-gray-400">
                      {getTimeAgo(notification.createdAt)}
                    </span>
                    {!notification.isRead && (
                      <span className="mt-2 inline-block w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]"></span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;