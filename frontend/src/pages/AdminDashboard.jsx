import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Table from '../components/Table';

export default function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });

  const headers = { Authorization: `Bearer ${token}` };
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchStores();
  }, []);

  const fetchStats = async () => {
    const res = await axios.get(`${API_URL}/admin/dashboard`, { headers });
    setStats(res.data);
  };

  const fetchUsers = async (sortBy = 'name', sortOrder = 'ASC') => {
    const res = await axios.get(`${API_URL}/admin/users`, { headers, params: { ...filters, sortBy, sortOrder } });
    setUsers(res.data);
  };

  const fetchStores = async (sortBy = 'name', sortOrder = 'ASC') => {
    const res = await axios.get(`${API_URL}/admin/stores`, { headers, params: { ...filters, sortBy, sortOrder } });
    setStores(res.data);
  };

  const userColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
  ];

  const storeColumns = [
    { key: 'name', label: 'Store Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'rating', label: 'Overall Rating', sortable: true, render: (r) => r.rating ? parseFloat(r.rating).toFixed(1) : 'No ratings' },
  ];

  return (
    <div>
      <Navbar title="System Administrator Dashboard" />
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1rem 2rem', background: '#e2e8f0', borderRadius: '8px' }}><h3>Total Users: {stats.totalUsers}</h3></div>
          <div style={{ padding: '1rem 2rem', background: '#e2e8f0', borderRadius: '8px' }}><h3>Total Stores: {stats.totalStores}</h3></div>
          <div style={{ padding: '1rem 2rem', background: '#e2e8f0', borderRadius: '8px' }}><h3>Total Ratings: {stats.totalRatings}</h3></div>
        </div>

        <h3>Registered Users</h3>
        <Table columns={userColumns} data={users} onSort={(f, o) => fetchUsers(f, o)} />

        <h3 style={{ marginTop: '2rem' }}>Registered Stores</h3>
        <Table columns={storeColumns} data={stores} onSort={(f, o) => fetchStores(f, o)} />
      </div>
    </div>
  );
}