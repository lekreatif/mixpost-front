import React from 'react'
import { useNotification } from '@/contexts/NotificationContext'

const Notifications: React.FC = () => {
  const { notifications, removeNotification } = useNotification()

  return (
    <div className="fixed bottom-0 right-0 space-y-4 p-6">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`rounded-md px-4 py-3 shadow-md ${
            notification.type === 'success'
              ? 'bg-green-500'
              : notification.type === 'error'
                ? 'bg-red-500'
                : 'bg-blue-500'
          } text-white`}
        >
          <div className="flex items-center justify-between">
            <p>{notification.message}</p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="hover:text-primary-200 ml-4 text-white"
            >
              &times;
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Notifications
