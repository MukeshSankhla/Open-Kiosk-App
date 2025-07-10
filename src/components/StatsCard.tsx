
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: LucideIcon;
}

const StatsCard = ({ title, value, change, changeType, icon: Icon }: StatsCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          <p className={`text-sm mt-2 flex items-center ${
            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}>
            {change}
            <span className="text-gray-500 ml-1">from last month</span>
          </p>
        </div>
        <div className={`p-3 rounded-full ${
          changeType === 'positive' ? 'bg-green-100' : 'bg-blue-100'
        }`}>
          <Icon className={`h-6 w-6 ${
            changeType === 'positive' ? 'text-green-600' : 'text-blue-600'
          }`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
