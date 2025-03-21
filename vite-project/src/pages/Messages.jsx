import React, { useState, useEffect } from 'react';
import { MessageSquare, AlertCircle, Menu } from 'lucide-react';
import ContactSidebar from '../components/chat/ContactSidebar';
import ChatArea from '../components/chat/ChatArea';
import AIAssistantSetup from '../components/chat/AIAssistantSetup';
import { useChat } from '../context/ChatContext';

const Messages = () => {
  const { 
    contacts, 
    messages: allMessages, 
    activeContactId, 
    loading, 
    error, 
    clearError,
    connectionStatus,
    setActiveContact, 
    sendMessage, 
    sendTypingIndicator, 
    createAIAssistant,
    typingContacts
  } = useChat();
  
  const [showAISetup, setShowAISetup] = useState(false);
  const [localMessages, setLocalMessages] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Get the active contact
  const activeContact = contacts.find(contact => contact.id === activeContactId);
  
  // Update local messages when active contact changes
  useEffect(() => {
    if (activeContactId && allMessages[activeContactId]) {
      setLocalMessages(allMessages[activeContactId]);
    } else {
      setLocalMessages([]);
    }
  }, [activeContactId, allMessages]);
  
  // Check if active contact is typing
  const isTyping = activeContactId ? typingContacts?.[activeContactId] : false;
  
  const handleSendMessage = async (text) => {
    if (!activeContactId || !text.trim()) return;
    
    // Create a temporary message
    const tempMessage = {
      id: `temp-${Date.now()}`,
      senderId: 'currentUser',
      text: text.trim(),
      timestamp: new Date().toISOString(),
      status: 'sending'
    };
    
    // Add to local messages immediately
    setLocalMessages(prev => [...prev, tempMessage]);
    
    try {
      // Send the message
      const sentMessage = await sendMessage(text);
      
      // Update local messages with the sent message
      setLocalMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id ? sentMessage : msg
        )
      );
      
      // If the recipient is an AI, the response will be handled automatically
      // through the ChatContext's message subscription
    } catch (error) {
      // Update the temporary message to show error
      setLocalMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id 
            ? { ...msg, status: 'failed' } 
            : msg
        )
      );
    }
  };
  
  const handleCreateAIAssistant = async (assistantData) => {
    const newAssistant = await createAIAssistant(assistantData.name, assistantData.specialty);
    if (newAssistant) {
      setShowAISetup(false);
      setActiveContact(newAssistant.id);
    }
  };

  const handleTyping = (isTyping) => {
    if (activeContactId) {
      sendTypingIndicator(activeContactId, isTyping);
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const handleBackToContacts = () => {
    setIsMobileMenuOpen(true);
  };

  // Show loading state only when there are no contacts and loading is true
  const showLoading = loading && contacts.length === 0;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-2 flex justify-between items-center">
          <div className="flex items-center">
            <AlertCircle className="mr-2" size={20} />
            <span className="text-sm sm:text-base">{error}</span>
          </div>
          <button 
            onClick={clearError}
            className="text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}
      
      {/* Connection Status */}
      {connectionStatus === 'error' && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 text-xs sm:text-sm">
          Connection to chat server lost. Messages may not be delivered.
        </div>
      )}
      
      {/* Loading State */}
      {showLoading ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 text-blue-500 mb-4 mx-auto" />
            <h3 className="font-medium text-base sm:text-lg mb-2">Loading chat...</h3>
            <div className="animate-pulse flex justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Mobile Menu Toggle Button */}
          {activeContactId && (
            <button
              className="md:hidden fixed top-4 left-4 z-30 bg-gray-100 text-gray-600 rounded-full p-2 shadow-md"
              onClick={toggleMobileMenu}
            >
              <Menu size={20} />
            </button>
          )}
          
          {/* Mobile Contact Button - Fixed at bottom */}
          <button
            className="md:hidden fixed bottom-4 right-4 z-30 bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle chat contacts"
          >
            <MessageSquare size={24} />
          </button>
          
          {/* Sidebar */}
          <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block md:w-1/3 lg:w-1/4 xl:w-1/5 border-r border-gray-200 overflow-hidden`}>
            <ContactSidebar 
              contacts={contacts}
              activeContactId={activeContactId}
              onSelectContact={setActiveContact}
              onCreateAI={() => setShowAISetup(true)}
              isMobile={isMobileMenuOpen}
              onToggleSidebar={toggleMobileMenu}
            />
          </div>
          
          {/* Chat Area */}
          <div className={`${
            isMobileMenuOpen ? 'hidden' : 'block'
          } md:block flex-1 overflow-hidden`}>
            {activeContactId ? (
              <ChatArea
                contact={activeContact}
                messages={localMessages}
                onSendMessage={handleSendMessage}
                onTyping={handleTyping}
                isTyping={isTyping}
                onBackToContacts={handleBackToContacts}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50 text-gray-500 p-4">
                <div className="text-center max-w-md">
                  <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-4 mx-auto" />
                  <h3 className="font-medium text-base sm:text-lg mb-2">No conversation selected</h3>
                  <p className="text-sm sm:text-base">Choose a contact from the sidebar or create a new AI assistant to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* AI Assistant Setup Modal */}
      {showAISetup && (
        <AIAssistantSetup
          onClose={() => setShowAISetup(false)}
          onSubmit={handleCreateAIAssistant}
        />
      )}
      
      {/* Mobile Overlay - darkens background when sidebar is open */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-30 z-10"
          onClick={toggleMobileMenu}
        ></div>
      )}
    </div>
  );
};

export default Messages;