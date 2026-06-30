import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Grid3X3, Award, ArrowUpRight, ShoppingCart } from 'lucide-react';
import { useAdminCache } from '@/hooks/use-admin-cache';
import Link from 'next/link';
import AdminLayout from '@/components/admin/admin-layout';

export default function AdminDashboard() {
  const { data: stats } = useAdminCache('/products/dashboard/stats');
  const [time, setTime] = useState('');

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return <div className="text-xs font-mono font-bold uppercase tracking-widest animate-pulse p-4 text-primary-light">Syncing marine system data...</div>;

  const cards = [
    { title: 'Total Inventory', value: stats.products, icon: Package, href: '/admin/products' },
    { title: 'Categories', value: stats.categories, icon: Grid3X3, href: '/admin/categories' },
    { title: 'Partner Brands', value: stats.brands, icon: Award, href: '/admin/brands' },
    { title: 'Customer Inquiries', value: stats.orders || 0, icon: ShoppingCart, href: '/admin/orders' },
  ];

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div className="flex justify-between items-end border-b border-slate-800 pb-8 relative">
        <div>
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-tighter font-syne m-0">Command Center</h1>
          <p className="text-xs font-mono font-bold text-primary-light uppercase tracking-[0.3em] mt-2 m-0">Real-Time Vessel Fleet & Inventory Telemetry</p>
        </div>
        <div className="text-right">
           <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Telemetry Status</span>
           <span className="text-xs font-mono font-bold text-emerald-400">ONLINE // {time}</span>
        </div>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, index) => {
          const CardIcon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-primary/50 p-8 border border-primary-light/20 group hover:border-primary-light transition-all relative overflow-hidden"
            >
              {/* Technical HUD visual style */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary-light/40 group-hover:border-primary-light" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary-light/40 group-hover:border-primary-light" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary-light/40 group-hover:border-primary-light" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary-light/40 group-hover:border-primary-light" />
              
              <CardIcon className="w-8 h-8 text-primary-light mb-6 group-hover:scale-110 transition-transform" />
              <dt className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">{card.title}</dt>
              <dd className="text-4xl font-extrabold text-white tracking-tighter font-syne m-0">{card.value}</dd>
              <Link href={card.href}>
                 <a className="absolute top-4 right-4 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-5 h-5 text-primary-light" />
                 </a>
              </Link>
            </motion.div>
          );
        })}
      </div>
      
      {/* Main Operations Panels */}
      <div className="grid lg:grid-cols-2 gap-8 mt-12">
        <div className="bg-primary/80 p-10 text-white relative h-64 flex flex-col justify-center border border-primary-light/20">
            {/* Corner highlights */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary-light/40" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary-light/40" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary-light/40" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary-light/40" />
            
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-4 font-syne">Inventory Operations</h2>
            <p className="text-slate-300 text-sm italic mb-8 font-sans">Maintain the high standard of Aarfa Marine by reviewing, cataloging, and updating the spare parts inventory.</p>
            <Link href="/admin/products">
              <a className="inline-flex items-center gap-4 text-[10px] font-mono font-bold uppercase tracking-widest text-primary-light hover:text-white transition-all no-underline">
                Manage Components <ArrowUpRight className="w-4 h-4" />
              </a>
            </Link>
        </div>
        
        <div className="bg-slate-900/60 p-10 border border-slate-800 h-64 flex flex-col justify-center relative">
            <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-4 font-syne">Brand Partnerships</h2>
            <p className="text-slate-400 text-sm mb-8 font-sans">Manage maritime brand partnerships, OEM manufacturers, and parts suppliers to keep catalog synced.</p>
            <div className="flex gap-6">
                <Link href="/admin/brands">
                  <a className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary-light hover:text-white transition-colors no-underline">
                    Manage Brands
                  </a>
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}

AdminDashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
