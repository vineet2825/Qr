import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { History, FileCheck, Star, QrCode, Download, ExternalLink } from 'lucide-react';
import API from '../api';

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [history, setHistory] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyRes, subsRes] = await Promise.all([
          API.get('/auth/history'),
          API.get('/submissions')
        ]);
        setHistory(historyRes.data);
        setSubmissions(subsRes.data.filter(s => s.user?._id === user?._id));
      } catch (error) {
        console.error('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold">Hello, {user?.name}!</h1>
        <p className="text-slate-400">Welcome to your personal dashboard</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard icon={<History />} title="Items Scanned" value={history.length} />
        <StatsCard icon={<FileCheck />} title="Submissions" value={submissions.length} />
        <StatsCard icon={<Star />} title="Saved Items" value="0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scanned Items History with QR Codes */}
        <section className="lg:col-span-2 glass-card p-6 rounded-3xl">
          <div className="flex items-center gap-2 mb-6">
            <QrCode className="text-primary-500" />
            <h2 className="text-xl font-bold">Your Scanned History</h2>
          </div>
          
          {history.length === 0 ? (
            <div className="text-center py-20 text-slate-500 italic">
              No items scanned yet. Use the scanner to start your history!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {history.map((record, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:border-primary-500/50 transition-colors group"
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-white rounded-lg p-1 shrink-0 overflow-hidden">
                      <img src={record.item?.qrCode} alt="QR" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate">{record.item?.name}</h3>
                      <p className="text-xs text-slate-500 mb-2">{record.item?.modelNumber}</p>
                      <div className="flex gap-2">
                        <a 
                          href={record.item?.qrCode} 
                          download={`QR_${record.item?.name}.png`}
                          className="p-1.5 bg-primary-500/10 text-primary-500 rounded-md hover:bg-primary-500 hover:text-white transition-colors"
                          title="Download QR"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                        <button 
                          onClick={() => window.location.href=`/item/${record.item?._id}`}
                          className="p-1.5 bg-white/5 text-slate-300 rounded-md hover:bg-white/10 transition-colors"
                          title="View Details"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-3 text-right">
                    Scanned: {new Date(record.scannedAt).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Submissions Sidebar */}
        <section className="glass-card p-6 rounded-3xl h-fit">
          <div className="flex items-center gap-2 mb-6">
            <FileCheck className="text-primary-500" />
            <h2 className="text-xl font-bold">Recent Forms</h2>
          </div>
          
          <div className="space-y-3">
            {submissions.map(sub => (
              <div key={sub._id} className="bg-white/5 p-3 rounded-xl flex flex-col gap-1 border border-white/5">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-xs">{sub.form?.title}</h3>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                    sub.status === 'approved' ? 'bg-emerald-500/20 text-emerald-500' :
                    sub.status === 'rejected' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'
                  }`}>
                    {sub.status}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">{new Date(sub.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
            {submissions.length === 0 && <p className="text-center py-6 text-xs text-slate-600 italic">No submissions</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

const StatsCard = ({ icon, title, value }) => (
  <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
    <div className="p-3 bg-white/5 rounded-xl text-primary-500">{icon}</div>
    <div>
      <p className="text-xs text-slate-500 font-bold uppercase">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default UserDashboard;
