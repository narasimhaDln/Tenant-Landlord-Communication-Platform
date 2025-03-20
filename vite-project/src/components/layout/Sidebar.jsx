import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, PenTool as Tool, Calendar, DollarSign, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Tool size={20} />, label: 'Maintenance', path: '/maintenance' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
    { icon: <Calendar size={20} />, label: 'Schedule', path: '/schedule' },
    { icon: <DollarSign size={20} />, label: 'Payments', path: '/payments' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  // Function to determine active link class
  const getLinkClass = ({ isActive }) => 
    `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md' 
        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
    }`;

  // Improved logout handler
  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Force a full page reload to the login page
    window.location.href = '/login';
  };

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 fixed left-0 top-0 shadow-xl overflow-y-auto">
      <div className="flex items-center gap-3 mb-10">
        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
          <Home size={20} className="text-white" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
          PropConnect
        </h1>
      </div>
      
      {/* User profile section */}
      <div className="mb-8 p-3 bg-gray-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white font-medium">
              {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))?.name?.charAt(0) || 'U' : 'U'}
            </span>
          </div>
          <div>
            <p className="font-medium text-white">
              {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))?.name || 'User' : 'User'}
            </p>
            <p className="text-xs text-gray-400">Property Manager</p>
          </div>
        </div>
      </div>
      
      <div className="mb-3">
        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold ml-3">Menu</p>
      </div>
      
      <nav className="mb-8">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink to={item.path} className={getLinkClass} end={item.path === '/'}>
                <span className="text-blue-400">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="pt-6 mt-auto border-t border-gray-700">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 transition-all duration-200 w-full text-white shadow-md"
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;