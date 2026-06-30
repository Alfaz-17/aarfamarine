import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/contexts/auth-context';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, Anchor } from 'lucide-react';

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const { user, login } = useAuth();

  // Handle redirect if user is already logged in
  useEffect(() => {
    if (user) {
      window.location.href = '/admin';
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        window.location.href = '/admin';
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failure');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Marine Tech grid & overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(91,155,213,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(91,155,213,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary-light/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#1C3F95]/5 rounded-full filter blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white backdrop-blur-md p-10 border border-slate-200 shadow-2xl relative">
          {/* Corner highlights (HUD/Industrial brackets style) */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary-light" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary-light" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary-light" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary-light" />

          {/* Logo */}
          <div className="text-center mb-8">
             <div className="flex flex-col items-center justify-center gap-3 mb-2">
                <img src="/aarfa-logo.png" alt="Aarfa Marine Logo" className="h-16 w-auto object-contain" />
                <h1 className="text-xl font-bold tracking-widest text-slate-950 uppercase font-syne m-0">AARFA MARINE</h1>
             </div>
             <p className="text-[9px] font-mono font-bold text-primary-light tracking-[0.45em] uppercase m-0">Control Console Access</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-mono uppercase tracking-wider">
              [SYSTEM ERROR]: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest block">Operator Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="operator@aarfamarine.com"
                  className="w-full px-4 py-4 pl-12 border border-slate-200 bg-white focus:border-primary-light outline-none text-sm transition-all text-slate-950 font-mono"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-light/70" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest block">Access Key</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••••••"
                  className="w-full px-4 py-4 pl-12 pr-12 border border-slate-200 bg-white focus:border-primary-light outline-none text-sm transition-all text-slate-950 font-mono"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-light/70" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-light/70 hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-primary-light hover:bg-primary-light text-white font-bold text-xs uppercase tracking-[0.3em] transition-all shadow-xl disabled:opacity-50 border-0 cursor-pointer font-mono"
            >
              {isLoading ? 'Decrypting Credentials...' : 'Establish Secure Connection'}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-primary-light/10 text-center">
             <Link href="/">
               <a className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-primary-light hover:text-white transition-colors no-underline">
                 Abort Access & Return Home
               </a>
             </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
