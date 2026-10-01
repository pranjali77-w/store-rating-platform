import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', address: '', password: '' });
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/signup`, formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors([{ msg: err.response?.data?.message || 'Registration failed' }]);
      }
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '3rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Sign Up (Normal User)</h2>
      {errors.length > 0 && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {errors.map((e, idx) => <p key={idx}>{e.msg}</p>)}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Name (20-60 characters)</label>
          <input type="text" required style={{ width: '100%', padding: '0.5rem' }} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label>
          <input type="email" required style={{ width: '100%', padding: '0.5rem' }} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Address (Max 400 characters)</label>
          <textarea required style={{ width: '100%', padding: '0.5rem' }} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Password (8-16 chars, 1 uppercase, 1 special char)</label>
          <input type="password" required style={{ width: '100%', padding: '0.5rem' }} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '0.75rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px' }}>Register</button>
      </form>
      <p style={{ marginTop: '1rem' }}>Already registered? <Link to="/login">Login here</Link></p>
    </div>
  );
}