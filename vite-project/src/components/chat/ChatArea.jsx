import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, MoreVertical } from 'lucide-react';
import ChatBubble from './ChatBubble';
import DateDivider from './DateDivider';

const ChatArea = ({ contact, messages = [], onSendMessage, onTyping, isTyping }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isAttachOpen, setIsAttachOpen] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing indicator
  const handleChange = (e) => {
    const text = e.target.value;
    setNewMessage(text);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set typing indicator
    onTyping(true);

    // Set timeout to clear typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    onSendMessage(newMessage);
    setNewMessage('');
    setIsAttachOpen(false);
    setIsEmojiOpen(false);
    setIsMenuOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={contact?.avatar || `https://ui-avatars.com/api/?name=${contact?.name}&background=random`}
              alt={contact?.name}
              className="w-10 h-10 rounded-full"
            />
            {contact?.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{contact?.name || 'Unknown Contact'}</h2>
            <p className="text-sm text-gray-500">{contact?.isOnline ? 'Online' : 'Offline'}</p>
          </div>
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date}>
            <DateDivider date={date} />
            {dateMessages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <div className="animate-pulse">Typing</div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="1"
            />
            <div className="absolute right-2 bottom-2 flex space-x-2">
              <button
                type="button"
                onClick={() => setIsAttachOpen(!isAttachOpen)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <Paperclip className="w-5 h-5 text-gray-500" />
              </button>
              <button
                type="button"
                onClick={() => setIsEmojiOpen(!isEmojiOpen)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <Smile className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatArea; 