import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Users, QrCode, FileText, Plus, Search, Filter, AlertTriangle } from 'lucide-react';
import API from '../api';
import toast from 'react-hot-toast';
import AddItemModal from '../components/AddItemModal';
import FormBuilder from '../components/FormBuilder';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [forms, setForms] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      const [itemsRes, formsRes, subsRes] = await Promise.all([
        API.get('/items'),
        API.get('/forms'),
        API.get('/submissions')
      ]);
      setItems(itemsRes.data);
      setForms(formsRes.data);
      setSubmissions(subsRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.modelNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = items.filter(item => item.quantity < 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-400">Manage your inventory, forms, and users</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add New Item
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={<Package />} title="Total Items" value={items.length} color="text-blue-500" />
        <StatsCard icon={<QrCode />} title="QR Codes" value={items.length} color="text-primary-500" />
        <StatsCard icon={<FileText />} title="Submissions" value={submissions.length} color="text-purple-500" />
        <StatsCard icon={<AlertTriangle />} title="Low Stock" value={lowStockItems.length} color="text-amber-500" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <TabButton active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} label="Inventory" icon={<Package className="w-4 h-4" />} />
        <TabButton active={activeTab === 'forms'} onClick={() => setActiveTab('forms')} label="Forms" icon={<FileText className="w-4 h-4" />} />
        <TabButton active={activeTab === 'submissions'} onClick={() => setActiveTab('submissions')} label="Submissions" icon={<Users className="w-4 h-4" />} />
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search items..." 
                  className="input-field pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'forms' && <FormBuilder items={items} onCreated={fetchData} />}
        
        {activeTab === 'submissions' && <SubmissionList submissions={submissions} />}
      </div>

      {showAddModal && <AddItemModal onClose={() => setShowAddModal(false)} onCreated={fetchData} />}
    </div>
  );
};

const StatsCard = ({ icon, title, value, color }) => (
  <div className="glass-card p-6 rounded-2xl">
    <div className="flex items-center gap-4">
      <div className={`${color} bg-white/5 p-3 rounded-xl`}>{icon}</div>
      <div>
        <p className="text-sm text-slate-400">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const TabButton = ({ active, onClick, label, icon }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 font-medium transition-all border-b-2 ${
      active ? 'border-primary-500 text-primary-500' : 'border-transparent text-slate-400 hover:text-slate-200'
    }`}
  >
    {icon} {label}
  </button>
);

const ItemCard = ({ item }) => (
  <motion.div 
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="glass-card rounded-2xl overflow-hidden group"
  >
    <div className="aspect-video bg-slate-800 relative overflow-hidden">
      {item.qrCode ? (
        <img src={item.qrCode} alt="QR" className="w-full h-full object-contain p-4" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <QrCode className="w-12 h-12 text-slate-600" />
        </div>
      )}
      <div className="absolute top-2 right-2">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          item.quantity > 5 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'
        }`}>
          Stock: {item.quantity}
        </span>
      </div>
    </div>
    <div className="p-5">
      <h3 className="font-bold text-lg truncate">{item.name}</h3>
      <p className="text-slate-400 text-sm mb-4">Model: {item.modelNumber}</p>
      <div className="flex gap-2">
        <button className="btn-primary flex-1 py-2 text-sm" onClick={() => window.open(item.qrCode, '_blank')}>
          Download QR
        </button>
        <button className="glass flex-1 py-2 text-sm rounded-lg" onClick={() => window.location.href=`/item/${item._id}`}>
          View Details
        </button>
      </div>
    </div>
  </motion.div>
);

const SubmissionList = ({ submissions }) => (
  <div className="glass-card rounded-2xl overflow-hidden overflow-x-auto">
    <table className="w-full text-left">
      <thead className="bg-white/5 text-slate-400 text-sm">
        <tr>
          <th className="px-6 py-4">User</th>
          <th className="px-6 py-4">Form</th>
          <th className="px-6 py-4">Status</th>
          <th className="px-6 py-4">Date</th>
          <th className="px-6 py-4">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800">
        {submissions.map(sub => (
          <tr key={sub._id} className="hover:bg-white/5 transition-colors">
            <td className="px-6 py-4">
              <div className="font-medium">{sub.user?.name}</div>
              <div className="text-xs text-slate-500">{sub.user?.email}</div>
            </td>
            <td className="px-6 py-4 text-sm">{sub.form?.title}</td>
            <td className="px-6 py-4">
              <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                sub.status === 'approved' ? 'bg-emerald-500/20 text-emerald-500' :
                sub.status === 'rejected' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'
              }`}>
                {sub.status}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-slate-400">
              {new Date(sub.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4">
              <button className="text-primary-500 hover:underline text-sm">Review</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AdminDashboard;
