import React, { useState } from 'react';
import { Search, Plus, Bot, Menu, X } from 'lucide-react';

const ContactSidebar = ({ contacts, activeContactId, onSelectContact, onCreateAI, isMobile = false, onToggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format time for last message
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // If less than 24 hours ago
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    // If less than 7 days ago
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    // Otherwise show the date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const containerClass = isMobile 
    ? "fixed inset-y-0 left-0 z-20 w-72 sm:w-80 md:w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
    : "flex flex-col h-full bg-white";

  return (
    <div className={containerClass}>
      {/* Header with toggle button for mobile */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Contacts</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onCreateAI}
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
              title="Create AI Assistant"
            >
              <Plus className="w-5 h-5" />
            </button>
            {isMobile && (
              <button
                onClick={onToggleSidebar}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No contacts found
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => {
                onSelectContact(contact.id);
                if (isMobile && onToggleSidebar) {
                  onToggleSidebar();
                }
              }}
              className={`w-full p-3 sm:p-4 flex items-center space-x-2 sm:space-x-3 hover:bg-gray-50 transition-colors ${
                activeContactId === contact.id ? 'bg-blue-50' : ''
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <img
                  src={contact.avatar || `https://ui-avatars.com/api/?name=${contact.name}&background=random`}
                  alt={contact.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                />
                {contact.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>

              {/* Contact Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base">
                    {contact.name}
                    {contact.isAI && (
                      <Bot className="inline-block w-3 h-3 sm:w-4 sm:h-4 ml-1 text-blue-500" />
                    )}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {formatTime(contact.lastMessageTime)}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {contact.lastMessage || 'No messages yet'}
                </p>
              </div>

              {/* Unread Count */}
              {contact.unread > 0 && (
                <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                  {contact.unread}
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ContactSidebar; 