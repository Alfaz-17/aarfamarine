import React, { useState } from 'react';
import { Plus, Trash2, Edit2, LayoutGrid, Layers } from 'lucide-react';
import api from '@/lib/api';
import { useAdminCache } from '@/hooks/use-admin-cache';
import AdminLayout from '@/components/admin/admin-layout';

const MAIN_CATEGORIES = ['Navigation', 'Automation', 'Communication'];

export default function AdminCategoryPage() {
  const { data, isLoading, mutate } = useAdminCache<any[]>('/categories');
  const categories = data || [];
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newMainCategory, setNewMainCategory] = useState('Navigation');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingMainCategory, setEditingMainCategory] = useState('Navigation');

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const res = await api.post('/categories', { name: newCategoryName, mainCategory: newMainCategory });
      mutate([...categories, res.data]);
      setNewCategoryName('');
      setMessage({ type: 'success', text: 'New sub-sector registered.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Registration failure.' });
    }
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editingName.trim()) return;
    try {
      const res = await api.put(`/categories/${id}`, { name: editingName, mainCategory: editingMainCategory });
      mutate(categories.map(c => c._id === id ? res.data : c));
      setEditingId(null);
      setMessage({ type: 'success', text: 'Sector designation updated.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Update failure.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Decommission this sector? This may affect linked assets.')) return;
    try {
      await api.delete(`/categories/${id}`);
      mutate(categories.filter(c => c._id !== id));
      setMessage({ type: 'success', text: 'Sector decommissioned.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Operation failed.' });
    }
  };

  if (isLoading) return <div className="text-xs font-mono font-bold uppercase tracking-widest animate-pulse text-primary-light">Scanning Sector Registries...</div>;

  return (
    <div className="max-w-4xl space-y-12 font-sans">
      {/* Header */}
      <div className="border-b border-slate-800 pb-8 relative">
        <h1 className="text-3xl font-extrabold text-white uppercase tracking-tighter font-syne m-0">Sector Management</h1>
        <p className="text-xs font-mono font-bold text-primary-light uppercase tracking-[0.3em] mt-2 m-0">Classify Fleet Inventory & Components</p>
      </div>

      {message.text && (
        <div className={`p-4 text-xs font-mono font-bold uppercase tracking-widest border-l-4 ${message.type === 'success' ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500' : 'bg-red-950/40 text-red-300 border-red-500'}`}>
          {message.text}
        </div>
      )}

      {/* Register Form */}
      <div className="bg-primary/55 p-10 border border-primary-light/20 relative">
         <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary-light/40" />
         <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary-light/40" />
         <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary-light/40" />
         <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary-light/40" />

         <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-primary-light mb-6 m-0">Register New Sub-Sector</h2>
         <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-4">
            <select
              className="px-6 py-4 bg-slate-950/60 border border-primary-light/20 focus:border-primary-light outline-none text-xs text-primary-light font-mono font-bold uppercase tracking-widest cursor-pointer"
              value={newMainCategory}
              onChange={(e) => setNewMainCategory(e.target.value)}
            >
              {MAIN_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input 
              type="text" 
              placeholder="Sub-Sector Name (e.g. Radar Systems)" 
              className="flex-1 px-6 py-4 bg-slate-950/60 border border-primary-light/20 focus:border-primary-light focus:bg-slate-950 outline-none text-xs text-white font-mono"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              required
            />
            <button type="submit" className="px-10 py-4 bg-primary-light hover:bg-primary-light text-white text-[10px] font-mono font-bold uppercase tracking-widest transition-colors shadow-xl border-0 cursor-pointer">
               Register
            </button>
         </form>
      </div>

      {/* Sectors Table */}
      <div className="bg-primary/20 border border-slate-800 shadow-2xl">
         <table className="w-full text-left">
            <thead>
               <tr className="bg-slate-900 border-b border-slate-800 text-primary-light text-[10px] font-mono font-bold uppercase tracking-widest">
                  <th className="py-5 px-8">Main Category</th>
                  <th className="py-5 px-8">Sub-Sector Designation</th>
                  <th className="py-5 px-8 text-right">Operations</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-xs text-white">
               {categories.map(cat => (
                  <tr key={cat._id} className="hover:bg-primary-light/5 transition-colors">
                     <td className="py-6 px-8">
                        <div className="flex items-center gap-3 text-primary-light">
                           <Layers className="w-4 h-4 opacity-70" />
                           {editingId === cat._id ? (
                              <select
                                className="px-2 py-2 border border-primary-light bg-slate-900 outline-none text-xs font-bold text-primary-light w-full max-w-[150px] font-mono uppercase"
                                value={editingMainCategory}
                                onChange={(e) => setEditingMainCategory(e.target.value)}
                              >
                                {MAIN_CATEGORIES.map(mCat => (
                                  <option key={mCat} value={mCat}>{mCat}</option>
                                ))}
                              </select>
                           ) : (
                              <span className="text-[10px] uppercase font-bold tracking-widest">{cat.mainCategory || 'Navigation'}</span>
                           )}
                        </div>
                     </td>
                     <td className="py-6 px-8">
                        <div className="flex items-center gap-4">
                           <LayoutGrid className="w-5 h-5 text-primary-light" />
                           {editingId === cat._id ? (
                              <input 
                                type="text"
                                className="px-4 py-2 border border-primary-light bg-slate-900 outline-none text-xs font-bold text-white w-full max-w-xs font-mono"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleUpdateCategory(cat._id)}
                              />
                           ) : (
                              <span className="text-sm font-bold text-white uppercase tracking-tight font-sans">{cat.name}</span>
                           )}
                        </div>
                     </td>
                     <td className="py-6 px-8 text-right">
                        <div className="flex justify-end gap-2">
                           {editingId === cat._id ? (
                              <>
                                 <button onClick={() => handleUpdateCategory(cat._id)} className="text-emerald-400 hover:text-emerald-300 p-2 font-bold text-[10px] uppercase tracking-widest bg-transparent border-0 cursor-pointer">
                                    Save
                                 </button>
                                 <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-white p-2 font-bold text-[10px] uppercase tracking-widest bg-transparent border-0 cursor-pointer">
                                    Cancel
                                 </button>
                              </>
                           ) : (
                              <>
                                 <button 
                                    onClick={() => { setEditingId(cat._id); setEditingName(cat.name); setEditingMainCategory(cat.mainCategory || 'Navigation'); }} 
                                    className="text-primary-light hover:text-white p-2 bg-transparent border-0 cursor-pointer"
                                 >
                                    <Edit2 className="w-4 h-4" />
                                 </button>
                                 <button onClick={() => handleDelete(cat._id)} className="text-red-400 hover:text-red-300 p-2 bg-transparent border-0 cursor-pointer">
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                              </>
                           )}
                        </div>
                     </td>
                  </tr>
               ))}
               {categories.length === 0 && (
                  <tr>
                     <td colSpan={3} className="py-20 text-center text-xs font-bold text-slate-500 uppercase tracking-widest italic">
                       No sub-sectors registered in the grid
                     </td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}

AdminCategoryPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
