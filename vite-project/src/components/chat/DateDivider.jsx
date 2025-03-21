import React from 'react';

const DateDivider = ({ date }) => {
  const today = new Date();
  const messageDate = new Date(date);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let displayDate;
  if (messageDate.toDateString() === today.toDateString()) {
    displayDate = 'Today';
  } else if (messageDate.toDateString() === yesterday.toDateString()) {
    displayDate = 'Yesterday';
  } else {
    displayDate = messageDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  return (
    <div className="flex items-center justify-center my-2 sm:my-4">
      <div className="flex-1 border-t border-gray-200"></div>
      <span className="px-2 sm:px-4 text-xs sm:text-sm text-gray-500 bg-gray-50 sm:bg-white">{displayDate}</span>
      <div className="flex-1 border-t border-gray-200"></div>
    </div>
  );
};

export default DateDivider; 