import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/dashboard/Header';
import { User, Bell, Lock, Camera, Sun, Moon, AlertTriangle, CheckCircle, X, MessageSquare, DollarSign, Info, Calendar, Wrench, BellOff } from 'lucide-react';

const TABS = {
  profile: { icon: User, label: 'Profile' },
  notifications: { icon: Bell, label: 'Notifications' },
  security: { icon: Lock, label: 'Security' }
};

// Sample notification data with multiple types
const SAMPLE_NOTIFICATIONS = [
  {
    id: 'payment1',
    type: 'payment',
    title: 'Rent Payment Confirmation',
    message: 'Your rent payment for this month has been processed successfully.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    read: false
  },
  {
    id: 'message1',
    type: 'message',
    title: 'New Message from Landlord',
    message: 'You have a new message about the upcoming property inspection.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
    read: true
  },
  {
    id: 'schedule1',
    type: 'schedule',
    title: 'Maintenance Visit Scheduled',
    message: 'The plumber is scheduled to visit on Friday at 3pm.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    read: false
  },
  {
    id: 'system1',
    type: 'system',
    title: 'Platform Update',
    message: 'Our platform has been updated with new features.',
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    read: false
  }
];

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    activeTab: 'profile',
    darkMode: localStorage.getItem('darkMode') === 'true',
    loading: true,
    filterType: 'all',
    toast: {
      visible: false,
      message: '',
      type: 'success',
      animating: false
    },
    profile: JSON.parse(localStorage.getItem('user') || '{}'),
    notifications: JSON.parse(localStorage.getItem('userNotifications') || '[]'),
    password: { current: '', new: '', confirm: '' }
  });
  
  // After the state declarations, define showToast first
  const [newNotificationsArrived, setNewNotificationsArrived] = useState(false);
  
  // Define showToast first before it's used by other functions
  const showToast = useCallback((message, type = 'success') => {
    // Helper function for setting toast state
    const setToastState = (visible, animating = false) => {
      setSettings(prev => ({
        ...prev,
        toast: {
          ...prev.toast,
          visible,
          animating,
          message: visible ? message : prev.toast.message,
          type: visible ? type : prev.toast.type
        }
      }));
    };

    if (settings.toast.visible) {
      // Hide current toast
      setToastState(false, true);
      
      // Wait for animation to complete, then show new toast
      setTimeout(() => {
        setToastState(true, false);
        
        // Auto-hide after 3 seconds
        setTimeout(() => setToastState(false, true), 3000);
      }, 300);
    } else {
      // Show toast immediately
      setToastState(true, false);
      
      // Auto-hide after 3 seconds
      setTimeout(() => setToastState(false, true), 3000);
    }
  }, []); // Empty dependency array to prevent infinite re-renders
  
  // Update settings helper with useCallback
  const updateSettings = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  // Now define refreshNotifications after showToast
  const refreshNotifications = useCallback(() => {
    try {
      // Get maintenance notifications from localStorage
      const maintenanceData = JSON.parse(localStorage.getItem('maintenanceRequests') || '[]');
      
      // Map maintenance requests to notification format
      const maintenanceNotifications = maintenanceData.map(request => ({
        id: request._id || `maintenance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'maintenance',
        title: `Maintenance Request: ${request.title || 'Untitled'}`,
        message: `Status: ${request.status || 'pending'}`,
        status: request.status || 'pending',
        date: request.createdAt || new Date().toISOString(),
        read: false
      }));
      
      // Get scheduled bookings from localStorage
      const scheduledBookings = JSON.parse(localStorage.getItem('scheduledBookings') || '[]');
      
      // Map scheduled bookings to notification format
      const scheduleNotifications = scheduledBookings.map(booking => ({
        id: booking.id || `schedule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'schedule',
        title: `Scheduled: ${booking.title || 'Appointment'}`,
        message: `${booking.description || ''} on ${new Date(booking.date || Date.now()).toLocaleDateString()} at ${booking.time || 'scheduled time'}`,
        status: booking.status || 'upcoming',
        date: booking.createdAt || new Date().toISOString(),
        read: false
      }));
      
      // Combine all notifications and sort by date
      const combinedNotifications = [...maintenanceNotifications, ...scheduleNotifications, ...SAMPLE_NOTIFICATIONS]
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Get current notifications from settings
      const currentNotifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
      
      // Check if there are new notifications
      if (currentNotifications.length > 0) {
        // Check if we have any new notifications by comparing IDs
        const currentIds = new Set(currentNotifications.map(n => n.id));
        const newItems = combinedNotifications.filter(n => !currentIds.has(n.id));
        
        if (newItems.length > 0) {
          setNewNotificationsArrived(true);
          
          // Play notification sound if available
          const notificationSound = document.getElementById('notification-sound');
          if (notificationSound) {
            notificationSound.play().catch(e => console.error('Error playing sound:', e));
          }
        }
      }
      
      // Save notifications to localStorage to persist between refreshes
      localStorage.setItem('userNotifications', JSON.stringify(combinedNotifications));
      
      // Update state with new notifications
      setSettings(prev => ({
        ...prev,
        loading: false,
        notifications: combinedNotifications
      }));
      
      return combinedNotifications;
    } catch (error) {
      console.error('Error refreshing notifications:', error);
      setSettings(prev => ({
        ...prev, 
        loading: false
      }));
      return [];
    }
  }, []); // Empty dependency array to avoid infinite renders

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedProfile = { ...settings.profile, avatar: reader.result };
      updateSettings('profile', updatedProfile);
      localStorage.setItem('user', JSON.stringify(updatedProfile));
      showToast('Profile picture updated successfully', 'success');
    };
    reader.readAsDataURL(file);
  };

  const toggleTheme = () => {
    const newTheme = !settings.darkMode;
    updateSettings('darkMode', newTheme);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    showToast(`Theme changed to ${newTheme ? 'dark' : 'light'} mode`, 'info');
  };

  const handleSubmit = (type) => async (e) => {
    e.preventDefault();
    const button = e.target.querySelector('button');
    const originalText = button.textContent;

    try {
      if (type === 'profile') {
        localStorage.setItem('user', JSON.stringify(settings.profile));
        showToast('Profile updated successfully', 'success');
      } else if (type === 'password') {
        if (settings.password.new !== settings.password.confirm) {
          throw new Error('Passwords do not match');
        }
        
        // Simulate password change
        updateSettings('password', { current: '', new: '', confirm: '' });
        showToast('Password changed successfully', 'success');
      }
      button.textContent = 'Saved!';
    } catch (error) {
      button.textContent = error.message || 'Error!';
      showToast(error.message || 'An error occurred', 'error');
    } finally {
      setTimeout(() => button.textContent = originalText, 2000);
    }
  };

  const markAllAsRead = () => {
    const updatedNotifications = settings.notifications.map(n => ({ ...n, read: true }));
    updateSettings('notifications', updatedNotifications);
    showToast('All notifications marked as read', 'info');
  };

  const dismissNotification = (id) => {
    updateSettings('notifications', settings.notifications.filter(item => item.id !== id));
    showToast('Notification dismissed', 'info');
  };

  const clearAllNotifications = () => {
    updateSettings('notifications', []);
    showToast('All notifications cleared', 'info');
  };

  // Filter notifications based on selected type
  const filteredNotifications = settings.notifications.filter(n => 
    settings.filterType === 'all' || n.type === settings.filterType
  );

  // Add this after the filteredNotifications line to track counts of different notification types
  const scheduleNotificationCount = settings.notifications.filter(n => 
    n.type === 'schedule' && !n.read
  ).length;

  // Update the tab click handler to reset the new notifications indicator
  const handleTabClick = useCallback((tabKey) => {
    // If clicking on the notifications tab, reset the new notification indicator
    if (tabKey === 'notifications') {
      setNewNotificationsArrived(false);
    }
    
    // Update the active tab
    updateSettings('activeTab', tabKey);
  }, [updateSettings]);

  // Update useEffect to properly handle refreshNotifications
  useEffect(() => {
    // Initialize theme from localStorage
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Update localStorage darkMode value when darkMode state changes
    localStorage.setItem('darkMode', settings.darkMode.toString());
  }, [settings.darkMode]);

  // Separate useEffect for notifications to avoid dependency cycles
  useEffect(() => {
    // Set loading state
    setSettings(prev => ({ ...prev, loading: true }));
    
    // Initial refresh
    refreshNotifications();
    
    // Set up interval to check for new notifications every 30 seconds
    const intervalId = setInterval(refreshNotifications, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [refreshNotifications]);

  if (settings.loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      
      {/* Notification sound */}
      <audio id="notification-sound" src="https://assets.mixkit.co/sfx/preview/mixkit-software-interface-notification-212.mp3" preload="auto"></audio>
      
      {/* Toast Notification */}
      {(settings.toast.visible || settings.toast.animating) && (
        <div 
          className={`fixed top-4 right-4 z-50 flex items-center p-4 mb-4 max-w-xs text-gray-500 rounded-lg shadow 
            ${settings.toast.type === 'success' ? 'bg-green-50 dark:bg-green-800 dark:text-green-200' : 
              settings.toast.type === 'error' ? 'bg-red-50 dark:bg-red-800 dark:text-red-200' : 
              'bg-blue-50 dark:bg-blue-800 dark:text-blue-200'} 
            ${settings.toast.visible ? 'animate-fade-in-down' : 'animate-fade-out-up'}`}
          role="alert"
        >
          <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg 
            ${settings.toast.type === 'success' ? 'bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-200' : 
              settings.toast.type === 'error' ? 'bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-200' : 
              'bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-200'}`}>
            {settings.toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : 
             settings.toast.type === 'error' ? <X className="w-5 h-5" /> : 
             <Info className="w-5 h-5" />}
          </div>
          <div className="ml-3 text-sm font-normal">{settings.toast.message}</div>
          <button 
            type="button" 
            className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 hover:bg-gray-200 dark:hover:bg-gray-700" 
            onClick={() => setSettings(prev => ({ ...prev, toast: { ...prev.toast, visible: false, animating: true } }))}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold dark:text-white">Settings</h2>
            <button onClick={toggleTheme} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
              {settings.darkMode ? <Sun className="text-yellow-500" /> : <Moon className="text-gray-600" />}
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <nav className="sm:w-48">
              {Object.entries(TABS).map(([key, { icon: Icon, label }]) => (
                <button
                  key={key}
                  onClick={() => handleTabClick(key)}
                  className={`w-full text-left px-4 py-2 rounded-lg mb-2 flex items-center ${
                    settings.activeTab === key 
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  <div className={`${key === 'notifications' && newNotificationsArrived ? 'relative' : ''}`}>
                    <Icon size={18} className={`mr-2 ${key === 'notifications' && newNotificationsArrived ? 'text-blue-500 dark:text-blue-400' : ''}`} />
                    {key === 'notifications' && newNotificationsArrived && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-notification-pulse"></span>
                    )}
                  </div>
                  {label}
                  {key === 'notifications' && settings.notifications.some(n => !n.read) && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {settings.notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
            
            <div className="flex-1">
              {settings.activeTab === 'profile' && (
                <form onSubmit={handleSubmit('profile')} className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        {settings.profile.avatar ? (
                          <img src={settings.profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-full h-full p-4 text-gray-400" />
                        )}
                        <label className="absolute bottom-0 right-0 p-1 bg-blue-500 rounded-full cursor-pointer">
                          <Camera size={16} className="text-white" />
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium dark:text-white">{settings.profile.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{settings.profile.role}</p>
                    </div>
                  </div>
                  
                  {['name', 'email'].map(field => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{field}</label>
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        value={settings.profile[field] || ''}
                        onChange={e => updateSettings('profile', { ...settings.profile, [field]: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2"
                      />
                    </div>
                  ))}
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">Save Changes</button>
                </form>
              )}
              
              {settings.activeTab === 'notifications' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap justify-between items-center mb-4">
                    <h3 className="text-lg font-medium dark:text-white">Notifications</h3>
                    <div className="flex space-x-2">
                      <button 
                        onClick={markAllAsRead} 
                        className="px-3 py-1 text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                      >
                        Mark all as read
                      </button>
                      <button 
                        onClick={clearAllNotifications} 
                        className="px-3 py-1 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded-lg dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                      >
                        Clear all
                      </button>
                      <select 
                        className="text-sm border rounded p-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={settings.filterType}
                        onChange={(e) => updateSettings('filterType', e.target.value)}
                      >
                        <option value="all">All notifications</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="payment">Payment</option>
                        <option value="message">Message</option>
                        <option value="schedule">Schedule</option>
                        <option value="system">System</option>
                      </select>
                    </div>
                  </div>
                  
                  {filteredNotifications.length > 0 ? (
                    <div className="space-y-3">
                      {filteredNotifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-3 border rounded-lg flex items-start ${
                            notification.read 
                              ? 'bg-white dark:bg-gray-800' 
                              : 'bg-blue-50 dark:bg-blue-900/20'
                          }`}
                        >
                          <div className={`p-2 rounded-full mr-3 flex-shrink-0 ${
                            notification.type === 'maintenance' 
                              ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300' 
                              : notification.type === 'payment' 
                              ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300'
                              : notification.type === 'message'
                              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                              : notification.type === 'schedule'
                              ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {notification.type === 'maintenance' && <Wrench size={20} />}
                            {notification.type === 'payment' && <DollarSign size={20} />}
                            {notification.type === 'message' && <MessageSquare size={20} />}
                            {notification.type === 'schedule' && <Calendar size={20} />}
                            {notification.type === 'system' && <Info size={20} />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-gray-900 dark:text-white">{notification.title}</h4>
                              <div className="flex space-x-2">
                                {!notification.read && (
                                  <button 
                                    onClick={() => {
                                      const updatedNotifications = settings.notifications.map(n => 
                                        n.id === notification.id ? {...n, read: true} : n
                                      );
                                      updateSettings('notifications', updatedNotifications);
                                    }}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 text-sm"
                                  >
                                    Mark as read
                                  </button>
                                )}
                                <button 
                                  onClick={() => dismissNotification(notification.id)} 
                                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{notification.message}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(notification.date).toLocaleDateString()}
                              </span>
                              {notification.status && (
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  notification.status === 'completed' || notification.status === 'approved'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                    : notification.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                    : notification.status === 'rejected'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                }`}>
                                  {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <BellOff className="w-12 h-12 mx-auto text-gray-400" />
                      <p className="mt-2 text-gray-500 dark:text-gray-400">No notifications to display</p>
                    </div>
                  )}
                  
                  {scheduleNotificationCount > 0 && (
                    <div className="mt-4 mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex justify-between items-start">
                          <div>
                          <div className="flex items-center">
                            <h4 className="font-medium text-gray-900 dark:text-white">New Schedule Bookings</h4>
                            <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {scheduleNotificationCount}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            You have {scheduleNotificationCount} new booking{scheduleNotificationCount > 1 ? 's' : ''}. Check your schedule for details.
                          </p>
                        </div>
                        <button 
                          onClick={() => {
                            // Mark all schedule notifications as read
                            const updatedNotifications = settings.notifications.map(n => 
                              n.type === 'schedule' ? {...n, read: true} : n
                            );
                            updateSettings('notifications', updatedNotifications);
                            showToast('Schedule notifications marked as read', 'success');
                          }}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          Mark All as Read
                        </button>
                      </div>
                      <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-2">
                        {settings.notifications
                          .filter(n => n.type === 'schedule' && !n.read)
                          .map(notification => (
                          <div key={notification.id} className="p-2 bg-white dark:bg-gray-700 rounded border-l-4 border-blue-500 flex items-start">
                            <div className="p-2 rounded-full mr-2 flex-shrink-0 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
                              <Calendar size={16} />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h5 className="font-medium text-sm text-gray-900 dark:text-white">
                                  {notification.title.replace('Scheduled: ', '')}
                                </h5>
                                <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                                  {notification.status}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-300">{notification.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <h4 className="text-md font-medium dark:text-white mb-3">Notification Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm dark:text-white">Email Notifications</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm dark:text-white">Push Notifications</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Receive push notifications</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm dark:text-white">SMS Notifications</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Receive notifications via SMS</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {settings.activeTab === 'security' && (
                <form onSubmit={handleSubmit('password')} className="space-y-4">
                  <h3 className="text-lg font-medium dark:text-white mb-4">Change Password</h3>
                  {['current', 'new', 'confirm'].map(field => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {field === 'current' ? 'Current Password' : `${field.charAt(0).toUpperCase() + field.slice(1)} Password`}
                      </label>
                      <input
                        type="password"
                        value={settings.password[field]}
                        onChange={e => updateSettings('password', { ...settings.password, [field]: e.target.value })}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2"
                      />
                    </div>
                  ))}
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">Update Password</button>
                  
                  <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium dark:text-white mb-4">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm dark:text-white">Enable 2FA</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;