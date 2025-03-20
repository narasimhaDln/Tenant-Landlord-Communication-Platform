import React from 'react';
import { MessageSquare, Check } from 'lucide-react';

const MessagesCard = () => {
  const messages = [
    {
      id: 1,
      sender: 'John Landlord',
      message: "I'll send the maintenance team tomorrow morning.",
      time: '10:30 AM',
      read: true,
    },
    {
      id: 2,
      sender: 'Alice Tenant',
      message: 'Thank you for the quick response!',
      time: '10:35 AM',
      read: false,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MessageSquare size={20} className="text-blue-500" />
          Recent Messages
        </h2>
        <a href="/messages" className="text-blue-500 hover:underline">View All</a>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{message.sender}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{message.time}</span>
                {message.read && <Check size={16} className="text-green-500" />}
              </div>
            </div>
            <p className="text-gray-600 text-sm">{message.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagesCard;