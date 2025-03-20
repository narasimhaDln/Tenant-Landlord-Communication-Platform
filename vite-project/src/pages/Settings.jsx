import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/dashboard/Header';
import { User, Bell, Lock, Camera, Sun, Moon, AlertTriangle, CheckCircle } from 'lucide-react';

const TABS = {
  profile: { icon: User, label: 'Profile' },
  notifications: { icon: Bell, label: 'Notifications' },
  security: { icon: Lock, label: 'Security' }
};

const Settings = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    loading: true,
    activeTab: 'profile',
    isDark: localStorage.getItem('theme') === 'dark',
    profile: {},
    notifications: [],
    password: { current: '', new: '', confirm: '' }
  });
  
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return navigate('/login');
    
    try {
      const maintenanceData = localStorage.getItem('maintenanceRequests') || '[]';
      const requests = JSON.parse(maintenanceData);
      const notifications = requests.map(req => ({
        id: req._id || req.id,
        title: `Maintenance: ${req.title}`,
        message: `Status: ${req.status} - Priority: ${req.priority}`,
        date: req.createdAt || new Date().toISOString(),
        type: req.status === 'completed' ? 'success' : 'pending'
      }));
      
      setState(prev => ({
        ...prev,
        loading: false,
        profile: JSON.parse(userData),
        notifications
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        profile: JSON.parse(userData) 
      }));
    }
    
    document.documentElement.classList.toggle('dark', state.isDark);
  }, [navigate, state.isDark]);

  const updateState = (key, value) => setState(prev => ({ ...prev, [key]: value }));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedProfile = { ...state.profile, avatar: reader.result };
      updateState('profile', updatedProfile);
      localStorage.setItem('user', JSON.stringify(updatedProfile));
    };
    reader.readAsDataURL(file);
  };

  const toggleTheme = () => {
    const newTheme = !state.isDark;
    updateState('isDark', newTheme);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleSubmit = (type) => async (e) => {
    e.preventDefault();
    const button = e.target.querySelector('button');
    const originalText = button.textContent;

    try {
      if (type === 'profile') {
        localStorage.setItem('user', JSON.stringify(state.profile));
      } else if (type === 'password') {
        if (state.password.new !== state.password.confirm) {
          throw new Error('Passwords do not match');
        }
        updateState('password', { current: '', new: '', confirm: '' });
      }
      button.textContent = 'Saved!';
    } catch (error) {
      button.textContent = error.message || 'Error!';
    } finally {
      setTimeout(() => button.textContent = originalText, 2000);
    }
  };

  if (state.loading) {
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
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold dark:text-white">Settings</h2>
            <button onClick={toggleTheme} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
              {state.isDark ? <Sun className="text-yellow-500" /> : <Moon className="text-gray-600" />}
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <nav className="sm:w-48">
              {Object.entries(TABS).map(([key, { icon: Icon, label }]) => (
                <button
                  key={key}
                  onClick={() => updateState('activeTab', key)}
                  className={`w-full text-left px-4 py-2 rounded-lg mb-2 flex items-center ${
                    state.activeTab === key 
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  <Icon size={18} className="mr-2" />
                  {label}
                </button>
              ))}
            </nav>
            
            <div className="flex-1">
              {state.activeTab === 'profile' && (
                <form onSubmit={handleSubmit('profile')} className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        {state.profile.avatar ? (
                          <img src={state.profile.avatar} alt="Profile" className="w-full h-full object-cover" />
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
                      <h3 className="text-lg font-medium dark:text-white">{state.profile.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{state.profile.role}</p>
                    </div>
                  </div>
                  
                  {['name', 'email'].map(field => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{field}</label>
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        value={state.profile[field] || ''}
                        onChange={e => updateState('profile', { ...state.profile, [field]: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  ))}
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Save Changes</button>
                </form>
              )}
              
              {state.activeTab === 'notifications' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium dark:text-white mb-4">Maintenance Requests</h3>
                  {state.notifications.length === 0 ? (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
                      <p className="text-gray-500 dark:text-gray-400">No maintenance requests found</p>
                    </div>
                  ) : (
                    state.notifications.map(n => (
                      <div key={n.id} className={`flex justify-between p-4 rounded-lg ${
                        n.type === 'success' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'
                      }`}>
                        <div className="flex items-start space-x-3">
                          {n.type === 'success' ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1" />
                          )}
                          <div>
                            <p className="font-medium dark:text-white">{n.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{n.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {new Date(n.date).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => updateState('notifications', state.notifications.filter(item => item.id !== n.id))} 
                          className="text-sm text-gray-500"
                        >
                          Dismiss
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
              
              {state.activeTab === 'security' && (
                <form onSubmit={handleSubmit('password')} className="space-y-4">
                  <h3 className="text-lg font-medium dark:text-white mb-4">Change Password</h3>
                  {['current', 'new', 'confirm'].map(field => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {field === 'current' ? 'Current Password' : `${field.charAt(0).toUpperCase() + field.slice(1)} Password`}
                      </label>
                      <input
                        type="password"
                        value={state.password[field]}
                        onChange={e => updateState('password', { ...state.password, [field]: e.target.value })}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  ))}
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Update Password</button>
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