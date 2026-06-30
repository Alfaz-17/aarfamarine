import React, { useState } from 'react';
import { Upload, ChevronLeft, Loader2 } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import api from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/admin-layout';

export default function AdminServiceFormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    dec: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      let mainImageUrl = '';

      if (imageFile) {
        setIsUploading(true);
        mainImageUrl = await uploadToCloudinary(imageFile);
        setIsUploading(false);
      }

      await api.post("/services", {
        ...formData,
        img: mainImageUrl,
      });

      setMessage({ type: "success", text: "Service added successfully." });
      setTimeout(() => {
        router.push('/admin/services');
      }, 1500);
      
    } catch (error: any) {
      console.error("Error creating service:", error);
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to add service." });
      setIsUploading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-8 relative">
         <Link href="/admin/services">
            <a className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-slate-400 hover:text-white uppercase tracking-widest no-underline">
               <ChevronLeft className="w-4 h-4" /> Back to Services
            </a>
         </Link>
         <h1 className="text-3xl font-extrabold text-white uppercase tracking-tighter font-syne m-0">Add New Service</h1>
      </div>

      {message.text && (
        <div className={`p-4 text-xs font-mono font-bold uppercase tracking-widest border-l-4 ${
          message.type === 'success' ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500' : 
          'bg-red-950/40 text-red-300 border-red-500'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="bg-primary/55 p-10 border border-primary-light/20 relative">
           <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-primary-light border-b border-slate-800 pb-4 mb-6 m-0">Service Image</h2>
           <div className="space-y-6">
              {imagePreview ? (
                 <div className="relative aspect-video border border-slate-800 overflow-hidden bg-slate-950/60 flex items-center justify-center">
                    <img src={imagePreview} alt="Preview" className="max-w-full max-h-full w-auto h-auto object-contain" />
                    <button 
                      type="button" 
                      onClick={() => { setImageFile(null); setImagePreview(''); }} 
                      className="absolute top-2 right-2 bg-red-600/80 p-2 text-white border-0 cursor-pointer text-xs font-mono"
                    >
                      REMOVE
                    </button>
                 </div>
              ) : (
                 <label className="block w-full border-2 border-dashed border-slate-800 py-12 text-center cursor-pointer bg-slate-950/40 hover:bg-slate-950/60 transition-colors">
                    <Upload className="w-8 h-8 text-slate-500 mx-auto mb-4" />
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-widest block">Upload Service Image</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                 </label>
              )}
           </div>
        </div>

        <div className="space-y-8 bg-primary/55 p-10 border border-primary-light/20 relative">
          <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-primary-light border-b border-slate-800 pb-4 mb-6 m-0">Service Details</h2>
          
          <div className="space-y-6">
             <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest block">Service Name *</label>
                <input
                  name="name"
                  placeholder="E.g., Radar Installation"
                  className="w-full px-4 py-4 bg-slate-950/60 border border-primary-light/20 focus:border-primary-light focus:bg-slate-950 outline-none text-xs text-white font-mono"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest block">Description *</label>
                <textarea
                  name="dec"
                  placeholder="Describe the service..."
                  className="w-full px-4 py-4 bg-slate-950/60 border border-primary-light/20 focus:border-primary-light focus:bg-slate-950 outline-none text-xs text-white font-mono min-h-[150px]"
                  value={formData.dec}
                  onChange={handleChange}
                  required
                />
             </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || isUploading}
            className="w-full lg:w-1/2 py-5 bg-primary-light hover:bg-primary-light text-white font-mono font-bold uppercase tracking-[0.3em] text-xs transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-70 border-0 cursor-pointer"
          >
            {isLoading || isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                Processing...
              </>
            ) : (
              'Save Service'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

AdminServiceFormPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
