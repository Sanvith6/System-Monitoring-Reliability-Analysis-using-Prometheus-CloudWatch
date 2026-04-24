import React, { useState } from 'react';
import { UserPlus, Loader2 } from 'lucide-react';

const UserForm = ({ onUserCreated }) => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await onUserCreated(formData);
      setFormData({ name: '', email: '' });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-accent/10 rounded-lg text-accent">
          <UserPlus size={20} />
        </div>
        <h2 className="text-xl font-semibold text-primary-900">Add New User</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            className="input-field"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            className="input-field"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : 'Create User'}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
