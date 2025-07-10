
import React from 'react';
import { Clock, User, FileText, Settings, Bell } from 'lucide-react';

interface Activity {
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
  type: 'user' | 'file' | 'settings' | 'notification';
}

const ActivityFeed = () => {
  const activities: Activity[] = [
    { id: 1, user: 'Alice Johnson', action: 'created', target: 'new project', time: '2 minutes ago', type: 'file' },
    { id: 2, user: 'Bob Smith', action: 'updated', target: 'user profile', time: '5 minutes ago', type: 'user' },
    { id: 3, user: 'Carol Williams', action: 'changed', target: 'system settings', time: '1 hour ago', type: 'settings' },
    { id: 4, user: 'David Brown', action: 'sent', target: 'notification', time: '2 hours ago', type: 'notification' },
    { id: 5, user: 'Alice Johnson', action: 'deleted', target: 'old files', time: '3 hours ago', type: 'file' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'user': return User;
      case 'file': return FileText;
      case 'settings': return Settings;
      case 'notification': return Bell;
      default: return Clock;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'user': return 'text-blue-500 bg-blue-100';
      case 'file': return 'text-green-500 bg-green-100';
      case 'settings': return 'text-purple-500 bg-purple-100';
      case 'notification': return 'text-yellow-500 bg-yellow-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = getIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${getIconColor(activity.type)}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;
