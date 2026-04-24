import React from 'react';
import { Trash2, Users, Calendar } from 'lucide-react';

const UserList = ({ users, onDeleteUser, loading }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading && users.length === 0) {
    return (
      <div className="card p-12 flex flex-col items-center justify-center text-primary-400">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary-100 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-primary-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="card p-12 flex flex-col items-center justify-center text-primary-400">
        <Users size={48} className="mb-4 opacity-20" />
        <p className="text-lg">No users found. Create your first user!</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="px-6 py-4 border-b border-primary-100 flex items-center justify-between bg-primary-50/50">
        <h2 className="font-semibold text-primary-900 flex items-center gap-2">
          <Users size={18} className="text-primary-500" />
          Recent Users
          <span className="ml-2 px-2 py-0.5 bg-primary-200 text-primary-700 text-xs rounded-full">
            {users.length}
          </span>
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-primary-500 border-b border-primary-100">
              <th className="px-6 py-3 font-medium">User</th>
              <th className="px-6 py-3 font-medium">Joined</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-50">
            {users.map((user) => (
              <tr key={user.id} className="group hover:bg-primary-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-primary-900">{user.name}</span>
                    <span className="text-xs text-primary-500">{user.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs text-primary-600">
                    <Calendar size={14} className="opacity-50" />
                    {formatDate(user.created_at)}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onDeleteUser(user.id)}
                    className="p-2 text-primary-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Delete User"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
