import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Table from '../components/Table';

export default function OwnerDashboard() {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const headers = { Authorization: `Bearer ${token}` };
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`${API_URL}/owner/dashboard`, { headers });
      setData(res.data);
    } catch (err) {
      console.error(err);
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
    { key: 'userName', label: 'User Name' },
    { key: 'userEmail', label: 'User Email' },
    { key: 'rating', label: 'Submitted Rating' },
  ];

  return (
    <div>
      <Navbar title="Store Owner Dashboard" />
      <div style={{ padding: '2rem' }}>
        {data ? (
          <>
            <h2>Store: {data.storeName}</h2>
            <div style={{ padding: '1rem', background: '#e2e8f0', borderRadius: '8px', maxWidth: '250px', margin: '1rem 0' }}>
              <h3>Average Rating: {data.averageRating}</h3>
            </div>

            <h3>Submitted Ratings</h3>
            <Table columns={columns} data={data.ratings} />
          </>
        ) : (
          <p>Loading dashboard...</p>
        )}

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