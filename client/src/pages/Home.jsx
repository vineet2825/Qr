import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QrCode, ShieldCheck, BarChart3, Smartphone } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-blue-600 bg-clip-text text-transparent">
          Next-Gen QR Stock Management
        </h1>
        <p className="text-xl text-slate-400 mb-10 px-4">
          Streamline your inventory with mobile-first QR tracking, dynamic forms, and real-time stock analytics.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 px-4">
          <Link to="/register" className="btn-primary px-8 py-4 text-lg shadow-lg shadow-primary-500/20">
            Get Started Free
          </Link>
          <Link to="/scan" className="glass px-8 py-4 text-lg rounded-lg hover:bg-white/10 transition-all">
            Scan QR Code
          </Link>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 w-full px-4"
      >
        <FeatureCard 
          icon={<QrCode className="w-10 h-10 text-primary-400" />}
          title="Instant QR Generation"
          description="Automatically generate unique QR codes for every item you upload."
        />
        <FeatureCard 
          icon={<Smartphone className="w-10 h-10 text-blue-400" />}
          title="Mobile First"
          description="Upload products and scan codes directly from your mobile camera."
        />
        <FeatureCard 
          icon={<ShieldCheck className="w-10 h-10 text-emerald-400" />}
          title="Secure Auth"
          description="Role-based access control and JWT protected endpoints."
        />
        <FeatureCard 
          icon={<BarChart3 className="w-10 h-10 text-purple-400" />}
          title="Dynamic Forms"
          description="Create custom forms for users to fill after scanning."
        />
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="glass-card p-8 rounded-2xl text-left hover:border-primary-500/50 transition-colors group">
    <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{description}</p>
  </div>
);

export default Home;
