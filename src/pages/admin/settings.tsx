import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Sparkles, Type, ShieldCheck, Loader2, Eye, EyeOff } from 'lucide-react';
import api from '@/lib/api';
import AdminLayout from '@/components/admin/admin-layout';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<{
    geminiApiKey?: string
    autoBackgroundRemoval?: boolean
    applyWatermark?: boolean
    watermarkText?: string
  }>({
    geminiApiKey: '',
    autoBackgroundRemoval: false,
    applyWatermark: true,
    watermarkText: 'Aarfa Marine Solutions',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: '********', newPassword: '' });
  const [showPasswords, setShowPasswords] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data) {
          setSettings({
            geminiApiKey: data.geminiApiKey || '',
            autoBackgroundRemoval: Boolean(data.autoBackgroundRemoval),
            applyWatermark: data.applyWatermark !== false,
            watermarkText: data.watermarkText || 'Aarfa Marine Solutions',
          });
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
        setMessage({ type: 'error', text: 'Failed to load system settings.' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await api.post('/settings', settings);
      setMessage({ type: 'success', text: 'Settings updated successfully.' });
    } catch (err) {
      console.error("Error saving settings:", err);
      setMessage({ type: 'error', text: 'Failed to save settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setIsUpdatingPassword(true);
    setMessage({ type: '', text: '' });
    try {
      await api.post('/auth/change-password', passwords);
      setMessage({ type: 'success', text: 'Password updated successfully.' });
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err: any) {
      console.error("Error updating password:", err);
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update password.' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading) return <div className="text-[10px] font-mono font-bold uppercase tracking-widest p-10 text-primary-light">Accessing secure telemetry settings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-12 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-8 relative">
        <div>
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-tighter font-syne m-0">System Console</h1>
          <p className="text-xs font-mono font-bold text-primary-light uppercase tracking-[0.3em] mt-2 m-0">Global UI & Asset Processing Configuration</p>
        </div>
        <ShieldCheck className="w-8 h-8 text-primary-light/20" />
      </div>

      {message.text && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-4 text-[10px] font-mono font-bold uppercase tracking-widest border-l-4 ${
            message.type === 'success' ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500' : 'bg-red-950/40 text-red-300 border-red-500'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {/* Gemini API Configuration */}
        <div className="bg-primary/55 p-10 border border-primary-light/20 space-y-8 relative">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary-light/40" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary-light/40" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary-light/40" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary-light/40" />

          <div className="flex items-center gap-4 text-primary-light border-b border-slate-800 pb-6">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest m-0">AI Integration</h2>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-[0.2em] block">Gemini API Key</label>
            <input
              type="password"
              value={settings.geminiApiKey || ''}
              onChange={(e) => setSettings(prev => ({ ...prev, geminiApiKey: e.target.value }))}
              className="w-full bg-slate-950/60 border border-primary-light/20 p-5 text-sm outline-none focus:border-primary-light transition-colors font-mono text-white"
              placeholder="Enter your Gemini API key"
            />
            <p className="text-[9px] font-mono text-slate-400 italic m-0">This key is used to power AI features across the admin panel.</p>
          </div>
        </div>

        <div className="bg-primary/55 p-10 border border-primary-light/20 space-y-8 relative">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary-light/40" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary-light/40" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary-light/40" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary-light/40" />

          <div className="flex items-center gap-4 text-primary-light border-b border-slate-800 pb-6">
            <Type className="w-5 h-5" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest m-0">Product Image Processing</h2>
          </div>

          <label className="flex items-center justify-between gap-4 border border-primary-light/20 p-4 cursor-pointer">
            <span>
              <span className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-300">Apply Watermark</span>
              <span className="block text-[9px] font-mono text-slate-400 mt-1">Used when admins upload product images.</span>
            </span>
            <input
              type="checkbox"
              checked={settings.applyWatermark !== false}
              onChange={(e) => setSettings(prev => ({ ...prev, applyWatermark: e.target.checked }))}
              className="w-4 h-4 accent-[#1E5FA6]"
            />
          </label>

          <div className="space-y-4">
            <label className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-[0.2em] block">Watermark Text</label>
            <input
              type="text"
              value={settings.watermarkText || ''}
              onChange={(e) => setSettings(prev => ({ ...prev, watermarkText: e.target.value }))}
              className="w-full bg-slate-950/60 border border-primary-light/20 p-5 text-sm outline-none focus:border-primary-light transition-colors font-mono text-white"
              placeholder="Aarfa Marine Solutions"
            />
          </div>

          <label className="flex items-center justify-between gap-4 border border-primary-light/20 p-4 cursor-pointer">
            <span>
              <span className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-300">Auto Background Removal</span>
              <span className="block text-[9px] font-mono text-slate-400 mt-1">Prepares transparent-style product images before upload.</span>
            </span>
            <input
              type="checkbox"
              checked={Boolean(settings.autoBackgroundRemoval)}
              onChange={(e) => setSettings(prev => ({ ...prev, autoBackgroundRemoval: e.target.checked }))}
              className="w-4 h-4 accent-[#1E5FA6]"
            />
          </label>
        </div>

        {/* Security & Authentication */}
        <div className="bg-primary/55 p-10 border border-primary-light/20 space-y-8 relative">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary-light/40" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary-light/40" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary-light/40" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary-light/40" />

          <div className="flex items-center gap-4 text-primary-light border-b border-slate-800 pb-6">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest m-0">Security & Authentication</h2>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-[0.2em] block">Current Password</label>
              <div className="relative">
                <input
                  type={showPasswords ? "text" : "password"}
                  autoComplete="current-password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full bg-slate-950/60 border border-primary-light/20 p-5 pr-14 text-sm outline-none focus:border-primary-light transition-colors font-mono text-white"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
                >
                  {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-[0.2em] block">New Password</label>
              <div className="relative">
                <input
                  type={showPasswords ? "text" : "password"}
                  autoComplete="new-password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full bg-slate-950/60 border border-primary-light/20 p-5 pr-14 text-sm outline-none focus:border-primary-light transition-colors font-mono text-white"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
                >
                  {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              onClick={handlePasswordChange}
              disabled={isUpdatingPassword || !passwords.currentPassword || !passwords.newPassword}
              className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold uppercase tracking-[0.2em] text-[10px] transition-all border-0 cursor-pointer disabled:opacity-50"
            >
              {isUpdatingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
      </div>

      {/* Sync Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full md:w-auto px-12 py-5 bg-primary-light hover:bg-primary-light text-white font-mono font-bold uppercase tracking-[0.4em] text-[10px] transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50 border-0 cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Committing Changes...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" /> Synchronize System Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}

AdminSettingsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
