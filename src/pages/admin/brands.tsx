import React, { useState } from 'react';
import { Plus, Trash2, Award, Upload, X } from 'lucide-react';
import api from '@/lib/api';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import { useAdminCache } from '@/hooks/use-admin-cache';
import AdminLayout from '@/components/admin/admin-layout';

export default function AdminBrandPage() {
  const { data, isLoading, mutate } = useAdminCache<any[]>('/brands');
  const brands = data || [];
  
  const [newBrand, setNewBrand] = useState({ name: '', image: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      if (editingId) setNewBrand({ ...newBrand, image: '' }); // Clear existing on new selection
    }
  };

  const handleEdit = (brand: any) => {
    setEditingId(brand._id);
    setNewBrand({ name: brand.name, image: brand.image || brand.logo || '' });
    setLogoPreview(brand.image || brand.logo || '');
    setLogoFile(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewBrand({ name: '', image: '' });
    setLogoPreview('');
    setLogoFile(null);
  };

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrand.name.trim() || (!logoFile && !editingId)) return;

    setIsUploading(true);
    try {
      let logoUrl = newBrand.image;
      if (logoFile) {
        logoUrl = await uploadToCloudinary(logoFile, "brands");
      }
      
      if (editingId) {
        const res = await api.put(`/brands/${editingId}`, { 
          name: newBrand.name, 
          image: logoUrl 
        });
        mutate(brands.map(b => b._id === editingId ? res.data : b));
        setEditingId(null);
        setMessage({ type: 'success', text: 'Brand identity updated.' });
      } else {
        const res = await api.post('/brands', { 
          name: newBrand.name, 
          image: logoUrl 
        });
        mutate([...brands, res.data]);
        setMessage({ type: 'success', text: 'Partner brand synchronized.' });
      }
      
      setNewBrand({ name: '', image: '' });
      setLogoFile(null);
      setLogoPreview('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Operation failure.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Sever partnership link with this brand?')) return;
    try {
      await api.delete(`/brands/${id}`);
      mutate(brands.filter(b => b._id !== id));
      setMessage({ type: 'success', text: 'Brand removed.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Operation failed.' });
    }
  };

  if (isLoading) return <div className="text-xs font-mono font-bold uppercase tracking-widest animate-pulse text-primary-light">Syncing Brand Registry...</div>;

  return (
    <div className="max-w-4xl space-y-12 font-sans">
      {/* Header */}
      <div className="border-b border-slate-800 pb-8 relative">
        <h1 className="text-3xl font-extrabold text-white uppercase tracking-tighter font-syne m-0">Strategic Partners</h1>
        <p className="text-xs font-mono font-bold text-primary-light uppercase tracking-[0.3em] mt-2 m-0">Manage Manufacturer Relationships & Branding</p>
      </div>

      {message.text && (
        <div className={`p-4 text-xs font-mono font-bold uppercase tracking-widest border-l-4 ${message.type === 'success' ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500' : 'bg-red-950/40 text-red-300 border-red-500'}`}>
          {message.text}
        </div>
      )}

      {/* Forms */}
      <div className="bg-primary/55 p-10 border border-primary-light/20 relative">
         <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary-light/40" />
         <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary-light/40" />
         <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary-light/40" />
         <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary-light/40" />

         <div className="flex justify-between items-center mb-8">
            <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-primary-light m-0">{editingId ? 'Modify Strategic Partner' : 'Onboard New Partner'}</h2>
            {editingId && (
               <button onClick={handleCancelEdit} className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 hover:text-white bg-transparent border-0 cursor-pointer">Cancel Edit</button>
            )}
         </div>
         <form onSubmit={handleAddBrand} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 md:items-end">
               <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest block">Brand Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Caterpillar Marine" 
                    className="w-full px-6 py-4 bg-slate-950/60 border border-primary-light/20 focus:border-primary-light focus:bg-slate-950 outline-none text-xs text-white font-mono"
                    value={newBrand.name}
                    onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                    required
                  />
               </div>
               <div className="w-full md:w-48 space-y-2 text-center">
                  <label className="text-[10px] font-mono font-bold text-slate-300 tracking-widest block mb-4">Logo ID</label>
                  {logoPreview ? (
                     <div className="relative h-14 border border-primary-light/20 bg-slate-950 flex items-center justify-center p-2">
                        <img src={logoPreview} alt="Logo" className="max-h-full max-w-full object-contain" />
                        <button type="button" onClick={() => { setLogoFile(null); setLogoPreview(''); }} className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full border-0 cursor-pointer"><X className="w-3 h-3" /></button>
                     </div>
                  ) : (
                     <label className="block h-14 border-2 border-dashed border-slate-800 hover:border-primary-light flex items-center justify-center cursor-pointer transition-colors bg-slate-950/40">
                        <Upload className="w-4 h-4 text-slate-400" />
                        <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                      </label>
                  )}
               </div>
            </div>
            <button type="submit" disabled={isUploading} className="w-full py-4 bg-primary-light hover:bg-primary-light text-white text-[10px] font-mono font-bold uppercase tracking-widest border-0 cursor-pointer">
               {isUploading ? 'Synchronizing Data...' : editingId ? 'Commit Update' : 'Register Partnership'}
            </button>
         </form>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {brands.map(brand => (
            <div key={brand._id} className="bg-primary/55 p-6 border border-primary-light/20 flex flex-col items-center group relative h-48">
               <div className="flex-1 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  {(brand.image || brand.logo) ? (
                    <img src={brand.image || brand.logo} alt={brand.name} className="max-h-16 max-w-full object-contain" />
                  ) : (
                    <div className="text-[10px] font-mono text-slate-500">NO_LOGO</div>
                  )}
               </div>
               <h3 className="text-[10px] font-mono font-bold text-primary-light uppercase tracking-widest text-center border-t border-slate-850 pt-4 w-full m-0">{brand.name}</h3>
               <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(brand)} className="p-2 bg-slate-950/80 rounded-full shadow-md text-primary-light hover:text-white border-0 cursor-pointer">
                     <Award className="w-3 h-3" />
                  </button>
                  <button onClick={() => handleDelete(brand._id)} className="p-2 bg-slate-950/80 rounded-full shadow-md text-red-400 hover:text-red-300 border-0 cursor-pointer">
                     <Trash2 className="w-3 h-3" />
                  </button>
               </div>
            </div>
         ))}
         {brands.length === 0 && (
            <div className="col-span-full py-20 bg-slate-950/40 border border-dashed border-slate-800 text-center text-xs font-mono font-bold text-slate-500 uppercase tracking-widest italic">
              No partners currently registered in the grid
            </div>
         )}
      </div>
    </div>
  );
}

AdminBrandPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
