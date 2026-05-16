import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { LayoutDashboard, LogOut, QrCode, Package, User } from 'lucide-react';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="glass fixed top-0 w-full z-50 px-4 py-3 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-primary-500 flex items-center gap-2">
        <QrCode className="w-8 h-8" />
        <span className="hidden sm:inline">QRStock</span>
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            {user.role === 'admin' ? (
              <Link to="/admin" className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Admin Dashboard">
                <LayoutDashboard className="w-6 h-6 text-slate-300" />
              </Link>
            ) : (
              <Link to="/dashboard" className="p-2 hover:bg-white/10 rounded-full transition-colors" title="User Dashboard">
                <User className="w-6 h-6 text-slate-300" />
              </Link>
            )}
            <Link to="/generate" className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Generate QR">
              <Plus className="w-6 h-6 text-slate-300" />
            </Link>
            <Link to="/scan" className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Scan QR">
              <QrCode className="w-6 h-6 text-slate-300" />
            </Link>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-500/10 rounded-full transition-colors group"
              title="Logout"
            >
              <LogOut className="w-6 h-6 text-slate-300 group-hover:text-red-400" />
            </button>
          </>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/register" className="btn-primary text-sm">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
