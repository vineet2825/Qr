import React, { useState } from 'react';
import { X, Upload, Save } from 'lucide-react';
import API from '../api';
import toast from 'react-hot-toast';

const AddItemModal = ({ onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    modelNumber: '',
    temperatureInfo: '',
    coverStatus: '',
    quantity: 0,
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/items', formData);
      toast.success('Item added successfully!');
      onCreated();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 relative form-pattern">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold mb-6">Add New Item</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium mb-1 text-slate-400">Item Name</label>
            <input name="name" type="text" className="input-field" required onChange={handleChange} />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium mb-1 text-slate-400">Model Number</label>
            <input name="modelNumber" type="text" className="input-field" required onChange={handleChange} />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium mb-1 text-slate-400">Cover/Finding Status</label>
            <input name="coverStatus" type="text" placeholder="e.g. Available" className="input-field" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-400">Initial Quantity</label>
            <input name="quantity" type="number" className="input-field" required onChange={handleChange} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1 text-slate-400">Description</label>
            <textarea name="description" rows="3" className="input-field" onChange={handleChange}></textarea>
          </div>
          
          <div className="col-span-2 flex gap-4 mt-4">
            <button 
              type="submit" 
              className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? 'Generating QR...' : <><Save className="w-5 h-5" /> Save Item & Generate QR</>}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="glass px-6 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
