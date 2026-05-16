import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Thermometer, Box, FileText, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import API from '../api';
import toast from 'react-hot-toast';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [form, setForm] = useState(null);
  const [submissionData, setSubmissionData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemRes = await API.get(`/items/${id}`);
        setItem(itemRes.data);
        
        try {
          const formRes = await API.get(`/forms/item/${id}`);
          setForm(formRes.data);
        } catch (e) {
          // No form found for this item, which is fine
        }

        // Record scan for history
        try {
          await API.post(`/auth/scan/${id}`);
        } catch (e) {
          console.error("Failed to record scan");
        }
      } catch (error) {
        toast.error('Item not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = Object.keys(submissionData).map(label => ({
        label,
        value: submissionData[label]
      }));
      
      await API.post('/submissions', {
        form: form._id,
        data
      });
      toast.success('Information submitted successfully!');
      setSubmissionData({});
    } catch (error) {
      toast.error('Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!item) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Item Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-1 glass-card p-6 rounded-3xl h-fit"
        >
          <div className="aspect-square bg-white rounded-2xl p-4 mb-6">
            <img src={item.qrCode} alt="QR Code" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{item.name}</h1>
          <p className="text-slate-400 mb-6">Model: {item.modelNumber}</p>
          
          <div className="space-y-4">
            <DetailItem icon={<Box className="text-blue-500" />} label="Status" value={item.coverStatus || 'N/A'} />
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
              {item.availableStock ? (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              <span className={item.availableStock ? 'text-emerald-500' : 'text-red-500 font-bold'}>
                {item.availableStock ? `In Stock (${item.quantity})` : 'Out of Stock'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Form or Description */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-2 space-y-6"
        >
          <div className="glass-card p-8 rounded-3xl">
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p className="text-slate-300 leading-relaxed">{item.description || 'No description provided.'}</p>
          </div>

          {form && (
            <div className="glass-card p-8 rounded-3xl border-t-4 border-primary-500 form-pattern">
              <h2 className="text-2xl font-bold mb-2">{form.title}</h2>
              <p className="text-slate-400 mb-8">{form.description}</p>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                {form.fields.map((field, idx) => (
                  <div key={idx}>
                    <label className="block text-sm font-medium mb-2">{field.label} {field.required && '*'}</label>
                    {field.type === 'select' ? (
                      <select 
                        className="input-field bg-slate-800"
                        required={field.required}
                        onChange={(e) => setSubmissionData({...submissionData, [field.label]: e.target.value})}
                      >
                        <option value="">Select option</option>
                        {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <input 
                        type={field.type} 
                        className="input-field"
                        required={field.required}
                        onChange={(e) => setSubmissionData({...submissionData, [field.label]: e.target.value})}
                      />
                    )}
                  </div>
                ))}
                <button 
                  type="submit" 
                  className="btn-primary w-full py-4 text-lg"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Information'}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
    <div className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg">{icon}</div>
    <div>
      <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  </div>
);

export default ItemDetails;
