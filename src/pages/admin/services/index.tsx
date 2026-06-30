import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { useAdminCache } from '@/hooks/use-admin-cache';
import AdminLayout from '@/components/admin/admin-layout';

export default function AdminServiceListPage() {
  const { data, isLoading, mutate } = useAdminCache<any[]>("/services");
  const services = data || [];
  
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleDelete = async (serviceId: string) => {
    if (!window.confirm('Confirm removal of this service?')) return;

    try {
      await api.delete(`/services/${serviceId}`);
      mutate(services.filter(s => s._id !== serviceId));
      setMessage({ type: 'success', text: 'Service removed successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Removal failed.' });
    }
  };

  if (isLoading) return <div className="text-xs font-mono font-bold uppercase tracking-widest animate-pulse text-primary-light p-10">Scanning Services...</div>;

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-8 relative">
        <div>
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-tighter font-syne m-0">Services Console</h1>
          <p className="text-xs font-mono font-bold text-primary-light uppercase tracking-[0.3em] mt-2 m-0">Manage Service Offerings</p>
        </div>
        <Link href="/admin/services/new">
          <a className="px-8 py-4 bg-primary-light hover:bg-primary-light text-white text-[10px] font-mono font-bold uppercase tracking-widest transition-all shadow-xl flex items-center gap-3 no-underline">
            <Plus className="w-4 h-4" /> Add New Service
          </a>
        </Link>
      </div>

      {message.text && (
        <div className={`p-4 text-xs font-mono font-bold uppercase tracking-widest border-l-4 ${message.type === 'success' ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500' : 'bg-red-950/40 text-red-300 border-red-500'}`}>
          {message.text}
        </div>
      )}

      {/* Services Table */}
      <div className="bg-primary/20 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-primary-light text-[10px] font-mono font-bold uppercase tracking-widest">
                <th className="py-5 px-6">Service Offering</th>
                <th className="py-5 px-6">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-xs">
              {services.map((service) => (
                <tr key={service._id} className="hover:bg-primary-light/5 transition-colors">
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-slate-950 relative border border-primary-light/20 shrink-0">
                          {service.img ? (
                            <img src={service.img} alt={service.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500">NO_IMG</div>
                          )}
                       </div>
                       <div>
                          <h4 className="font-bold text-white uppercase tracking-tight text-sm mb-1 font-sans">{service.name}</h4>
                          <p className="text-[10px] text-slate-400 line-clamp-1 italic m-0 max-w-xl">{service.dec}</p>
                       </div>
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/services/${service._id}`}>
                        <a className="p-2 border border-slate-700 hover:border-primary-light text-slate-400 hover:text-white transition-colors bg-slate-950 rounded-md">
                          <Edit className="w-4 h-4" />
                        </a>
                      </Link>
                      <button 
                        onClick={() => handleDelete(service._id)}
                        className="p-2 border border-slate-700 hover:border-red-500 text-slate-400 hover:text-red-500 transition-colors bg-slate-950 cursor-pointer rounded-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-12 text-center text-slate-500">
                    No services found. Click 'Add New Service' to create one.
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

AdminServiceListPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
