import React, { useState } from 'react';
import QRCode from 'qrcode';
import { motion } from 'framer-motion';
import { QrCode, Download, Share2, Type, Link as LinkIcon, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const QRGeneratorTool = () => {
  const [text, setText] = useState('');
  const [qrImage, setQrImage] = useState('');
  const [loading, setLoading] = useState(false);

  const generateQR = async () => {
    if (!text) {
      toast.error('Please enter some text or URL');
      return;
    }
    setLoading(true);
    try {
      const url = await QRCode.toDataURL(text, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrImage(url);
    } catch (err) {
      toast.error('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrImage;
    link.download = `QR_Code_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">QR Code Generator</h1>
        <p className="text-slate-400">Generate a QR code for any link, text, or information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-3xl space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3 flex items-center gap-2 text-slate-400">
              <Type className="w-4 h-4" /> Input Text or URL
            </label>
            <textarea 
              rows="5"
              className="input-field resize-none"
              placeholder="https://example.com or enter any message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
          </div>

          <button 
            onClick={generateQR}
            disabled={loading}
            className="btn-primary w-full py-4 flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <QrCode className="w-5 h-5" />}
            Generate QR Code
          </button>
        </div>

        <div className="glass-card p-8 rounded-3xl flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-800">
          {qrImage ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6"
            >
              <div className="bg-white p-4 rounded-2xl shadow-2xl">
                <img src={qrImage} alt="Generated QR" className="w-48 h-48 object-contain" />
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={downloadQR}
                  className="glass p-3 rounded-xl hover:bg-primary-500 hover:text-white transition-all flex items-center gap-2 text-sm font-medium"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(text);
                    toast.success('Link copied to clipboard');
                  }}
                  className="glass p-3 rounded-xl hover:bg-slate-700 transition-all flex items-center gap-2 text-sm font-medium"
                >
                  <Share2 className="w-4 h-4" /> Copy Link
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="text-slate-600 flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800">
                <QrCode className="w-10 h-10 opacity-20" />
              </div>
              <p className="text-sm">Your generated QR will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRGeneratorTool;
