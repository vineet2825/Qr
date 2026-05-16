import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, AlertCircle } from 'lucide-react';

const QRScanner = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 10,
    });

    scanner.render(onScanSuccess, onScanError);

    function onScanSuccess(result) {
      scanner.clear();
      // Result is expected to be a URL like http://localhost:5173/item/ID
      // We extract the path and navigate
      try {
        const url = new URL(result);
        navigate(url.pathname);
      } catch (e) {
        // If not a URL, maybe it's just the ID
        navigate(`/item/${result}`);
      }
    }

    function onScanError(err) {
      // console.warn(err);
    }

    return () => {
      scanner.clear().catch(error => console.error("Failed to clear scanner", error));
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="bg-primary-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8 text-primary-500" />
        </div>
        <h1 className="text-3xl font-bold">Scan QR Code</h1>
        <p className="text-slate-400 mt-2 text-balance">Point your camera at an item's QR code to view details and forms</p>
      </motion.div>

      <div className="w-full max-w-md bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl relative">
        <div id="reader" className="w-full"></div>
        
        {/* Scanner Overlay UI */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8">
           <div className="flex justify-between">
              <div className="w-8 h-8 border-t-4 border-l-4 border-primary-500 rounded-tl-lg"></div>
              <div className="w-8 h-8 border-t-4 border-r-4 border-primary-500 rounded-tr-lg"></div>
           </div>
           <div className="flex justify-between">
              <div className="w-8 h-8 border-b-4 border-l-4 border-primary-500 rounded-bl-lg"></div>
              <div className="w-8 h-8 border-b-4 border-r-4 border-primary-500 rounded-br-lg"></div>
           </div>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2 text-slate-500 text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>Ensure you are in a well-lit environment</span>
      </div>
    </div>
  );
};

export default QRScanner;
