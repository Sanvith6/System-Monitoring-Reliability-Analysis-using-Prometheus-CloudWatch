import React, { useState, useEffect } from 'react';
import { Activity, Users as UsersIcon, ShieldCheck, AlertCircle, RefreshCcw } from 'lucide-react';
import UserForm from './UserForm';
import UserList from './UserList';
import { userAPI, healthAPI } from '../services/api';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [health, setHealth] = useState({ status: 'loading' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userData, healthData] = await Promise.all([
        userAPI.getUsers(),
        healthAPI.getHealth()
      ]);
      setUsers(userData);
      setHealth(healthData);
      setError('');
    } catch (err) {
      setError('System unavailable. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      healthAPI.getHealth().then(setHealth);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateUser = async (userData) => {
    const newUser = await userAPI.createUser(userData);
    setUsers([newUser, ...users]);
  };

  const handleDeleteUser = async (id) => {
    await userAPI.deleteUser(id);
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary-500 mb-1">Total Users</p>
            <h3 className="text-2xl font-bold text-primary-900">{users.length}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <UsersIcon size={24} />
          </div>
        </div>

        <div className="card p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary-500 mb-1">System Health</p>
            <div className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${health.status === 'healthy' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
              <h3 className="text-lg font-semibold text-primary-900 capitalize">{health.status}</h3>
            </div>
          </div>
          <div className={`p-3 rounded-xl ${health.status === 'healthy' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            <ShieldCheck size={24} />
          </div>
        </div>

        <div className="card p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary-500 mb-1">API Status</p>
            <h3 className="text-lg font-semibold text-primary-900">
              {health.version ? `v${health.version}` : 'Offline'}
            </h3>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Activity size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-1">
          <UserForm onUserCreated={handleCreateUser} />
          
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle className="shrink-0 mt-0.5" size={18} />
              <div>
                <p className="font-semibold">System Error</p>
                <p className="opacity-80">{error}</p>
                <button 
                  onClick={fetchData}
                  className="mt-2 flex items-center gap-1.5 text-red-800 font-medium hover:underline"
                >
                  <RefreshCcw size={14} /> Retry
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: List */}
        <div className="lg:col-span-2">
          <UserList 
            users={users} 
            onDeleteUser={handleDeleteUser} 
            loading={loading} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
