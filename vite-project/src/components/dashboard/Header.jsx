import React, { useState } from 'react';
import { Bell, Search, User, Sun, Moon, ChevronDown, LogOut, Settings, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generateAvatarUrl, getUserInitials } from '../../utils/avatarUtils';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New maintenance request', time: '5 min ago', read: false },
    { id: 2, text: 'Your request has been updated', time: '1 hour ago', read: false },
    { id: 3, text: 'Payment reminder', time: '3 hours ago', read: true }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);
  const toggleNotifications = () => setShowNotifications(!showNotifications);
  
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm p-4 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        <div className="flex items-center gap-4">
         
          
          <div className="relative">
            <button 
              onClick={toggleNotifications} 
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <Bell size={20} className="dark:text-gray-200" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50">
                <div className="p-3 border-b dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-medium dark:text-gray-200">Notifications</h3>
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-blue-500 hover:text-blue-700"
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div>
                      {notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`p-3 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${notification.read ? '' : 'bg-blue-50 dark:bg-blue-900/20'}`}
                        >
                          <div className="flex justify-between">
                            <p className="text-sm font-medium dark:text-gray-200">{notification.text}</p>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
                <div className="p-2 border-t dark:border-gray-700 text-center">
                  <Link to="/notifications" className="text-xs text-blue-500 hover:text-blue-700">
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={toggleUserMenu}
            >
              {user ? (
                <img
                  src={generateAvatarUrl(user)}
                  alt={`${user.name || 'User'}'s avatar`}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User size={16} className="text-blue-600" />
                </div>
              )}
              <div className="hidden md:block">
                <p className="font-medium dark:text-gray-200">{user?.name || 'User'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user?.role || 'User'}</p>
              </div>
              <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;