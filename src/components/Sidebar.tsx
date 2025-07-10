
import React from 'react';
import { Home, Users, BarChart3, Settings, Bell, Search, Menu } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: Users, label: 'Users', active: false },
    { icon: BarChart3, label: 'Analytics', active: false },
    { icon: Bell, label: 'Notifications', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:z-0`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">TestApp</h1>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                item.active 
                  ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
