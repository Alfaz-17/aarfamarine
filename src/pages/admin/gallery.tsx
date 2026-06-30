import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, Trash2, Loader2, CheckCircle2 } from 'lucide-react';
import AdminLayout from '@/components/admin/admin-layout';
import Head from 'next/head';

export default function AdminGallery() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('workshop');
  const [activeTab, setActiveTab] = useState('all');
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setImages(data);
    } catch (error) {
      console.error('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      // 1. Compress file to base64 instantly via Canvas
      const fileBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new window.Image();
          img.src = event.target?.result as string;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 1200;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            
            // Compress to highly optimized JPEG
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            resolve(dataUrl);
          };
          img.onerror = error => reject(error);
        };
        reader.onerror = error => reject(error);
      });
      
      // 2. Upload to Cloudinary via our upload API
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileBase64, folder: 'aarfa-marine/gallery' }),
      });
      
      const uploadData = await uploadRes.json();
      
      if (!uploadRes.ok) throw new Error(uploadData.error || 'Failed to upload image');
      
      // 3. Save to database
      const saveRes = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: uploadData.secure_url,
          title,
          category
        }),
      });
      
      if (!saveRes.ok) throw new Error('Failed to save to database');
      
      setMessage({ type: 'success', text: 'Image uploaded successfully!' });
      setFile(null);
      setPreview(null);
      setTitle('');
      fetchImages();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An error occurred during upload' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setImages(images.filter(img => img._id !== id));
      } else {
        alert('Failed to delete image');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-12">
      <Head>
        <title>Manage Infrastructure Gallery | Admin</title>
      </Head>

      <div className="flex justify-between items-end border-b border-slate-800 pb-8 relative">
        <div>
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-tighter font-syne m-0">Infrastructure Gallery</h1>
          <p className="text-xs font-mono font-bold text-primary-light uppercase tracking-[0.3em] mt-2 m-0">Upload photos of workshop & office</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="bg-primary/50 p-8 border border-primary-light/20 relative">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary-light/40" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary-light/40" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary-light/40" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary-light/40" />
          
          <h2 className="text-xl font-bold text-white mb-6 font-syne uppercase">Upload New Image</h2>
          
          {message.text && (
            <div className={`p-4 mb-6 text-sm font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {message.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
              {message.text}
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-5">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">Image Title (Optional)</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-2 focus:border-primary-light focus:outline-none focus:ring-1 focus:ring-primary-light"
                placeholder="e.g. Radar Testing Rig"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">Category</label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-2 focus:border-primary-light focus:outline-none focus:ring-1 focus:ring-primary-light"
              >
                <option value="workshop">Workshop</option>
                <option value="office">Office</option>
                <option value="company">Company</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">Select Image</label>
              <div className="border-2 border-dashed border-slate-700 p-2 text-center hover:border-primary-light transition-colors relative min-h-[140px] flex flex-col items-center justify-center">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  required
                />
                {preview ? (
                  <img src={preview} alt="Preview" className="max-h-[120px] object-contain mb-2" />
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <span className="text-sm font-mono text-slate-300">
                      Click or drag image here
                    </span>
                  </>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={uploading || !file}
              className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 px-4 uppercase tracking-wider text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
              ) : (
                <><Upload className="w-4 h-4" /> Upload Image</>
              )}
            </button>
          </form>
        </div>

        {/* Gallery Grid */}
        <div className="lg:col-span-2">
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
            {['all', 'workshop', 'office', 'company'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest border transition-colors ${
                  activeTab === tab 
                    ? 'bg-primary-light/20 text-primary-light border-primary-light/50' 
                    : 'bg-slate-900/50 text-slate-500 border-slate-800 hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-500 font-mono animate-pulse uppercase text-xs tracking-widest">
              Loading gallery matrix...
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20 text-slate-500 font-mono uppercase text-xs border border-dashed border-slate-800">
              No images in gallery yet
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.filter(img => activeTab === 'all' || img.category === activeTab).map(img => (
                <div key={img._id} className="group relative border border-slate-800 overflow-hidden bg-slate-900 aspect-square">
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] font-mono font-bold text-primary-light uppercase tracking-widest">{img.category}</span>
                    <span className="text-sm text-white font-semibold truncate">{img.title || 'Untitled'}</span>
                    <button 
                      onClick={() => handleDelete(img._id)}
                      className="absolute top-2 right-2 p-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

AdminGallery.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
