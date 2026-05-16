import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import API from '../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User as UserIcon, Shield } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', formData);
      dispatch(setCredentials({ user: data, token: data.token }));
      toast.success('Account created successfully!');
      if (data.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-8 rounded-3xl form-pattern"
      >
        <div className="text-center mb-8">
          <div className="bg-primary-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-primary-500" />
          </div>
          <h2 className="text-3xl font-bold">Register</h2>
          <p className="text-slate-400 mt-2">Join us to start managing your stock</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <UserIcon className="w-4 h-4" /> Full Name
            </label>
            <input 
              name="name"
              type="text" 
              className="input-field"
              placeholder="John Doe"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email Address
            </label>
            <input 
              name="email"
              type="email" 
              className="input-field"
              placeholder="name@company.com"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Password
            </label>
            <input 
              name="password"
              type="password" 
              className="input-field"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Role
            </label>
            <select 
              name="role"
              className="input-field bg-slate-800"
              onChange={handleChange}
              value={formData.role}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="btn-primary w-full py-3 mt-4 flex justify-center items-center gap-2"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-400">
          Already have an account? <Link to="/login" className="text-primary-500 hover:underline font-semibold">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
