import React from 'react';
import { useNotification } from '../contexts/NotificationContext';

const Notifications: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed bottom-0 right-0 p-6 space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`px-4 py-3 rounded-md shadow-md ${
            notification.type === 'success' ? 'bg-green-500'
            : notification.type === 'error' ? 'bg-red-500'
            : 'bg-blue-500'
          } text-white`}
        >
          <div className="flex items-center justify-between">
            <p>{notification.message}</p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-4 text-white hover:text-gray-200"
            >
              &times;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
