import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Table from '../components/Table';

export default function UserDashboard() {
  const { token } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const headers = { Authorization: `Bearer ${token}` };
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async (sortBy = 'name', sortOrder = 'ASC') => {
    const res = await axios.get(`${API_URL}/stores`, { headers, params: { search, sortBy, sortOrder } });
    setStores(res.data);
  };

  const handleRate = async (storeId, rating) => {
    try {
      await axios.post(`${API_URL}/stores/${storeId}/rate`, { rating }, { headers });
      fetchStores();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit rating');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/auth/update-password`, { password: newPassword }, { headers });
      alert('Password updated successfully!');
      setNewPassword('');
    } catch (err) {
      alert(err.response?.data?.errors?.[0]?.msg || 'Password update failed');
    }
  };

  const columns = [
    { key: 'name', label: 'Store Name', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'overallRating', label: 'Overall Rating' },
    { key: 'userSubmittedRating', label: 'My Rating', render: (r) => r.userSubmittedRating || 'Not rated' },
    {
      key: 'action',
      label: 'Submit/Modify Rating',
      render: (r) => (
        <select 
          value={r.userSubmittedRating || ''} 
          onChange={(e) => handleRate(r.id, parseInt(e.target.value))}
        >
          <option value="" disabled>Select Rating</option>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
          ))}
        </select>
      )
    }
  ];

  return (
    <div>
      <Navbar title="Normal User Dashboard" />
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Search stores by Name or Address..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '0.5rem', width: '300px' }}
          />
          <button onClick={() => fetchStores()} style={{ padding: '0.5rem 1rem' }}>Search</button>
        </div>

        <h3>Stores List</h3>
        <Table columns={columns} data={stores} onSort={(f, o) => fetchStores(f, o)} />

        <hr style={{ margin: '3rem 0' }} />
        <h3>Update Password</h3>
        <form onSubmit={handlePasswordUpdate} style={{ maxWidth: '350px' }}>
          <input 
            type="password" 
            required 
            placeholder="New Password (8-16 chars, 1 uppercase, 1 special)"
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
          <button type="submit" style={{ padding: '0.5rem 1rem' }}>Update Password</button>
        </form>
      </div>
    </div>
  );
}