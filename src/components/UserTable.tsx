
import React, { useState } from 'react';
import { MoreVertical, Edit, Trash2, Mail } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  avatar: string;
}

const UserTable = () => {
  const [users] = useState<User[]>([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'active', avatar: 'AJ' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User', status: 'active', avatar: 'BS' },
    { id: 3, name: 'Carol Williams', email: 'carol@example.com', role: 'User', status: 'inactive', avatar: 'CW' },
    { id: 4, name: 'David Brown', email: 'david@example.com', role: 'Editor', status: 'active', avatar: 'DB' },
  ]);

  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Recent Users</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">{user.avatar}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                  <button
                    onClick={() => setDropdownOpen(dropdownOpen === user.id ? null : user.id)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  
                  {dropdownOpen === user.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </button>
                        <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </button>
                        <button className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
