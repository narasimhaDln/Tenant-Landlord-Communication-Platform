import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, AlertTriangle, DollarSign, FileText, Check } from 'lucide-react';

const NotificationSettings = () => {
  // Notification state with default preferences
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      maintenance: true,
      messages: true,
      payments: true,
      documents: false,
      announcements: true,
    },
    push: {
      maintenance: true,
      messages: true,
      payments: true,
      documents: true,
      announcements: true,
    },
    sms: {
      maintenance: false,
      messages: false,
      payments: true,
      documents: false,
      announcements: false,
    }
  });

  // Handle toggle changes
  const handleToggle = (channel, type) => {
    setNotificationSettings({
      ...notificationSettings,
      [channel]: {
        ...notificationSettings[channel],
        [type]: !notificationSettings[channel][type]
      }
    });
  };

  // Handle saving settings
  const handleSave = () => {
    // Show success notification
    setShowSuccessToast(true);
    
    // Hide after 3 seconds
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);

    // Here you would save to backend
    console.log('Saving notification settings:', notificationSettings);
  };

  // Success toast state
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Define notification categories with icons
  const notificationTypes = [
    {
      id: 'maintenance',
      label: 'Maintenance Updates',
      description: 'Get notified about status changes to your maintenance requests',
      icon: <AlertTriangle size={20} className="text-yellow-500" />
    },
    {
      id: 'messages',
      label: 'New Messages',
      description: 'Receive notifications when you get new messages',
      icon: <MessageSquare size={20} className="text-blue-500" />
    },
    {
      id: 'payments',
      label: 'Payment Reminders',
      description: 'Get reminders about upcoming or past due payments',
      icon: <DollarSign size={20} className="text-green-500" />
    },
    {
      id: 'documents',
      label: 'Document Updates',
      description: 'Be notified when new documents are shared with you',
      icon: <FileText size={20} className="text-purple-500" />
    },
    {
      id: 'announcements',
      label: 'Announcements',
      description: 'Stay updated with important announcements from management',
      icon: <Bell size={20} className="text-red-500" />
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notification Preferences</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage how you receive notifications and updates.
        </p>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 text-green-800 dark:text-green-300 rounded-md p-4 flex items-center">
          <Check size={18} className="mr-2" />
          <span>Your notification preferences have been saved successfully!</span>
        </div>
      )}

      {/* Notification Settings Table */}
      <div className="mt-6 overflow-hidden border border-gray-200 dark:border-gray-700 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Notification Type
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center justify-center">
                  <Mail size={16} className="mr-1" />
                  Email
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center justify-center">
                  <Bell size={16} className="mr-1" />
                  Push
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center justify-center">
                  <MessageSquare size={16} className="mr-1" />
                  SMS
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {notificationTypes.map((type) => (
              <tr key={type.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">{type.icon}</div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{type.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{type.description}</div>
                    </div>
                  </div>
                </td>
                
                {/* Email toggle */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="inline-flex items-center">
                    <label className="relative flex cursor-pointer items-center">
                      <input 
                        type="checkbox" 
                        checked={notificationSettings.email[type.id]} 
                        onChange={() => handleToggle('email', type.id)}
                        className="sr-only peer" 
                      />
                      <div className="h-6 w-11 rounded-full bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </td>
                
                {/* Push toggle */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="inline-flex items-center">
                    <label className="relative flex cursor-pointer items-center">
                      <input 
                        type="checkbox" 
                        checked={notificationSettings.push[type.id]} 
                        onChange={() => handleToggle('push', type.id)}
                        className="sr-only peer" 
                      />
                      <div className="h-6 w-11 rounded-full bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </td>
                
                {/* SMS toggle */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="inline-flex items-center">
                    <label className="relative flex cursor-pointer items-center">
                      <input 
                        type="checkbox" 
                        checked={notificationSettings.sms[type.id]} 
                        onChange={() => handleToggle('sms', type.id)}
                        className="sr-only peer" 
                      />
                      <div className="h-6 w-11 rounded-full bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phone number for SMS */}
      <div className="mt-6">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Phone Number for SMS Notifications
        </label>
        <div className="relative rounded-md shadow-sm">
          <input
            type="tel"
            name="phone"
            id="phone"
            className="p-2 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Standard message rates may apply. You can opt out at any time.
        </p>
      </div>

      {/* Frequency settings */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Notification Frequency</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="frequency-immediate"
              name="notification_frequency"
              type="radio"
              defaultChecked
              className="h-4 w-4 border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="frequency-immediate" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Send immediately
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="frequency-digest"
              name="notification_frequency"
              type="radio"
              className="h-4 w-4 border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="frequency-digest" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Daily digest
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="frequency-weekly"
              name="notification_frequency"
              type="radio"
              className="h-4 w-4 border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="frequency-weekly" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Weekly summary
            </label>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save preferences
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings; 