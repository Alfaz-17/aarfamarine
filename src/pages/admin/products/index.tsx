import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Star } from 'lucide-react';
import api from '@/lib/api';
import { useAdminCache } from '@/hooks/use-admin-cache';
import AdminLayout from '@/components/admin/admin-layout';

export default function AdminProductListPage() {
  const { data: productsData, mutate: mutateProducts } = useAdminCache<any[]>("/products");
  const { data: categoriesData } = useAdminCache<any[]>("/categories");
  
  const products = productsData || [];
  const categories = categoriesData || [];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.brand?.name && product.brand.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || product.category?._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleFeatured = async (product: any) => {
    try {
      const { data } = await api.put(`/products/${product._id}`, { featured: !product.featured });
      const updatedProduct = { ...product, ...data };
      mutateProducts(products.map(p => p._id === product._id ? updatedProduct : p));
      setMessage({ type: 'success', text: `Asset ${updatedProduct.featured ? 'promoted to strategic status' : 'removed from strategic focus'}.` });
    } catch (error) {
      console.error("Error toggling featured", error);
      setMessage({ type: 'error', text: 'Status update failed.' });
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Confirm decommissioning of this inventory unit?')) return;

    try {
      await api.delete(`/products/${productId}`);
      mutateProducts(products.filter(p => p._id !== productId));
      setMessage({ type: 'success', text: 'Unit removed from fleet inventory.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Decommissioning failed. Check system logs.' });
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-8 relative">
        <div>
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-tighter font-syne m-0">Inventory Console</h1>
          <p className="text-xs font-mono font-bold text-primary-light uppercase tracking-[0.3em] mt-2 m-0">Manage Marine Components & Spares</p>
        </div>
        <Link href="/admin/products/new">
          <a className="px-8 py-4 bg-primary-light hover:bg-primary-light text-white text-[10px] font-mono font-bold uppercase tracking-widest transition-all shadow-xl flex items-center gap-3 no-underline">
            <Plus className="w-4 h-4" /> Add New Asset
          </a>
        </Link>
      </div>

      {message.text && (
        <div className={`p-4 text-xs font-mono font-bold uppercase tracking-widest border-l-4 ${message.type === 'success' ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500' : 'bg-red-950/40 text-red-300 border-red-500'}`}>
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-primary/55 p-8 border border-primary-light/20">
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest block">Search Matrix</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Title, Specs, or Brand..."
                className="w-full pl-10 pr-4 py-4 bg-slate-950/60 border border-primary-light/20 focus:border-primary-light focus:bg-slate-950 outline-none text-xs text-white font-mono"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-light/70" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest block">Sector Filter</label>
            <select
              className="w-full px-4 py-4 bg-slate-950/60 border border-primary-light/20 focus:border-primary-light focus:bg-slate-950 outline-none text-xs uppercase font-bold font-mono text-white tracking-widest"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Sectors</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id} className="bg-slate-950 text-white">{cat.name}</option>
              ))}
            </select>
          </div>
      </div>

      {/* Products Table */}
      <div className="bg-primary/20 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-primary-light text-[10px] font-mono font-bold uppercase tracking-widest">
                <th className="py-5 px-6">Asset Component</th>
                <th className="py-5 px-6">Sector</th>
                <th className="py-5 px-6 text-center">Focus</th>
                <th className="py-5 px-6">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-xs">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-primary-light/5 transition-colors">
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-slate-950 relative border border-primary-light/20 shrink-0">
                          {product.image ? (
                            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500">NO_IMG</div>
                          )}
                       </div>
                       <div>
                          <h4 className="font-bold text-white uppercase tracking-tight text-sm mb-1 font-sans">{product.title}</h4>
                          <p className="text-[10px] text-slate-400 line-clamp-1 italic m-0">{product.description}</p>
                       </div>
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <span className="px-3 py-1 bg-primary-light/10 border border-primary-light/20 text-primary-light text-[9px] font-extrabold uppercase tracking-widest">
                      {product.category?.name || 'Unassigned'}
                    </span>
                  </td>
                  <td className="py-6 px-6 text-center">
                    <button
                      onClick={() => handleToggleFeatured(product)}
                      className={`p-2 transition-all duration-300 bg-transparent border-0 cursor-pointer ${product.featured ? 'text-amber-400 scale-125' : 'text-slate-600 hover:text-amber-400/50'}`}
                      title={product.featured ? "Strategic Asset (Featured)" : "Mark as Strategic"}
                    >
                      <Star className={`w-5 h-5 ${product.featured ? 'fill-amber-400' : ''}`} />
                    </button>
                  </td>
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-4">
                      <Link href={`/admin/products/${product._id}`}>
                        <a className="p-2 text-primary-light hover:text-white transition-colors">
                          <Edit className="w-4 h-4" />
                        </a>
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors bg-transparent border-0 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500 uppercase tracking-widest font-mono text-xs">
                    No components located in database query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

AdminProductListPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
