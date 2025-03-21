import React from 'react';
import { User, Bot } from 'lucide-react';

const ChatBubble = ({ message }) => {
  const isUser = message.senderId === 'currentUser';
  const isAI = message.isAI;
  const isError = message.status === 'failed';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2 sm:mb-4`}>
      <div className={`flex items-start space-x-1 sm:space-x-2 max-w-[80%] sm:max-w-[70%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          {isUser ? (
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <User className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
            </div>
          ) : (
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <Bot className="w-3 h-3 sm:w-5 sm:h-5 text-gray-600" />
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base ${
              isUser
                ? 'bg-blue-500 text-white'
                : isAI
                ? 'bg-gray-100 text-gray-900'
                : 'bg-gray-200 text-gray-900'
            } ${isError ? 'border border-red-500' : ''}`}
          >
            <p className="whitespace-pre-wrap break-words">{message.text}</p>
            <div className={`text-[10px] sm:text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
          
          {/* Message Status */}
          {isUser && (
            <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
              {message.status === 'sending' && 'Sending...'}
              {message.status === 'sent' && 'Sent'}
              {message.status === 'delivered' && 'Delivered'}
              {message.status === 'read' && 'Read'}
              {message.status === 'failed' && 'Failed to send'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble; 