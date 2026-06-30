import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, X, ChevronLeft, Loader2, Sparkles, ShieldCheck, Crop } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import { addWatermark } from '@/lib/utils/watermark';
import { removeBackgroundClient } from '@/lib/background-removal-client';
import api from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MarineLoader } from '@/components/common/marine-loader';
import CropModal from '@/components/common/CropModal';
import AdminLayout from '@/components/admin/admin-layout';

export default function AdminProductEditPage() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brandName: '',
    category: '',
    featured: false
  });
  
  const [existingImage, setExistingImage] = useState('');
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imagesFile, setImagesFile] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [fileQueue, setFileQueue] = useState<File[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [categories, setCategories] = useState<any[]>([]);
  
  // Global Settings state
  const [globalSettings, setGlobalSettings] = useState({
    autoBackgroundRemoval: false,
    applyWatermark: true,
    watermarkText: 'Aarfa Marine Solutions'
  });

  // Background removal state
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [cropTarget, setCropTarget] = useState<{ type: 'main' | 'gallery-existing' | 'gallery-new', index?: number, url: string } | null>(null);
  const [bgProcessingIndex, setBgProcessingIndex] = useState<{type: 'main' | 'gallery-existing' | 'gallery-new', index?: number} | null>(null);

  const [bgStatus, setBgStatus] = useState('');

  // Handle file queue processing
  useEffect(() => {
    if (!cropTarget && fileQueue.length > 0) {
      const nextFile = fileQueue[0];
      const reader = new FileReader();
      reader.onload = () => {
        setCropTarget({ type: 'gallery-new', url: reader.result as string });
        setFileQueue(prev => prev.slice(1));
      };
      reader.readAsDataURL(nextFile);
    }
  }, [cropTarget, fileQueue]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes, settingsRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get('/categories'),
          api.get('/settings')
        ]);
        
        const prod = prodRes.data;
        setFormData({
          title: prod.title || '',
          description: prod.description || '',
          brandName: prod.brandName || '',
          category: prod.category?._id || prod.category || '',
          featured: prod.featured || false
        });
        setExistingImage(prod.image || '');
        setExistingImages(prod.images || []);
        setCategories(catRes.data);
        if (settingsRes.data) {
          setGlobalSettings(settingsRes.data);
        }
      } catch (error) {
        console.error('Error fetching edit data:', error);
        setMessage({ type: 'error', text: 'Failed to load asset data.' });
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setExistingImage(''); // New image replaces existing
      setCropTarget({ type: 'main', url: URL.createObjectURL(file) });
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFileQueue(prev => [...prev, ...files]);
    }
  };

  const handleRemoveExistingSecondary = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveBackground = async (type: 'main' | 'gallery-existing' | 'gallery-new' = 'main', index?: number, fileOverride?: File | Blob) => {
    let sourceImage: File | Blob | null = null;
    
    if (type === 'main') {
      if (fileOverride) {
        sourceImage = fileOverride;
      } else if (imageFile) {
        sourceImage = imageFile;
      } else if (existingImage) {
        try {
          setBgStatus('Fetching...');
          const response = await fetch(existingImage);
          sourceImage = await response.blob();
        } catch (error) {
          console.error("Error fetching main image:", error);
          setMessage({ type: 'error', text: 'Could not fetch image for processing.' });
          return;
        }
      }
    } else if (type === 'gallery-existing' && index !== undefined) {
      try {
        setBgStatus('Fetching...');
        const response = await fetch(existingImages[index]);
        sourceImage = await response.blob();
      } catch (error) {
        console.error("Error fetching existing gallery image:", error);
        setMessage({ type: 'error', text: 'Could not fetch image.' });
        return;
      }
    } else if (type === 'gallery-new' && index !== undefined) {
      sourceImage = fileOverride || imagesFile[index];
    }

    if (!sourceImage) return;
    
    setIsRemovingBg(true);
    setBgProcessingIndex({ type, index });
    setBgStatus('Initializing AI...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setBgStatus('Removing background...');
      
      const processedBlob = await removeBackgroundClient(sourceImage);
      const processedFile = new File([processedBlob], `processed-${type}.png`, { type: 'image/png' });
      
      if (type === 'main') {
        setImageFile(processedFile);
        setImagePreview(URL.createObjectURL(processedFile));
        setExistingImage('');
      } else if (type === 'gallery-existing' && index !== undefined) {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
        setImagesFile(prev => [...prev, processedFile]);
        setImagePreviews(prev => [...prev, URL.createObjectURL(processedFile)]);
      } else if (type === 'gallery-new' && index !== undefined) {
        setImagesFile(prev => {
          const newFiles = [...prev];
          newFiles[index] = processedFile;
          return newFiles;
        });
        
        setImagePreviews(prev => {
          const newPreviews = [...prev];
          newPreviews[index] = URL.createObjectURL(processedFile);
          return newPreviews;
        });
      }
      
      setBgStatus('Complete!');
      setTimeout(() => {
        setBgStatus('');
        setBgProcessingIndex(null);
      }, 2000);
    } catch (error: any) {
      console.error("Background removal error:", error);
      setMessage({ type: 'error', text: 'Background removal simulation completed.' });
      setBgProcessingIndex(null);
    } finally {
      setIsRemovingBg(false);
    }
  };

  const onCropComplete = async (croppedFile: File) => {
    if (!cropTarget) return;

    if (cropTarget.type === 'main') {
      setImageFile(croppedFile);
      setImagePreview(URL.createObjectURL(croppedFile));
      setExistingImage('');
      
      if (globalSettings.autoBackgroundRemoval) {
        handleRemoveBackground('main', undefined, croppedFile);
      }
    } else {
      const newIndex = imagesFile.length;
      setImagesFile(prev => [...prev, croppedFile]);
      setImagePreviews(prev => [...prev, URL.createObjectURL(croppedFile)]);
      
      if (globalSettings.autoBackgroundRemoval) {
        handleRemoveBackground('gallery-new', newIndex, croppedFile);
      }
    }
    setCropTarget(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      let mainImageUrl = existingImage;
      let secondaryImageUrls: string[] = [...existingImages];

      setIsUploading(true);
      
      // Upload new main image if selected
      if (imageFile) {
        const processedImage = globalSettings.applyWatermark 
          ? await addWatermark(imageFile, globalSettings.watermarkText) 
          : imageFile;
        mainImageUrl = await uploadToCloudinary(processedImage);
      }

      // Upload new secondary images
      for (const file of imagesFile) {
        const processedImage = globalSettings.applyWatermark 
          ? await addWatermark(file, globalSettings.watermarkText) 
          : file;
        const url = await uploadToCloudinary(processedImage);
        secondaryImageUrls.push(url);
      }
      
      setIsUploading(false);

      await api.put(`/products/${id}`, {
        ...formData,
        image: mainImageUrl,
        images: secondaryImageUrls
      });

      setMessage({ type: "success", text: "Product updated successfully." });
      setTimeout(() => router.push('/admin/products'), 1500);
      
    } catch (error: any) {
      console.error("Error updating product:", error);
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to update product." });
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  if (isLoading) return <MarineLoader />;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-8 relative">
         <Link href="/admin/products">
            <a className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-slate-400 hover:text-white uppercase tracking-widest no-underline">
               <ChevronLeft className="w-4 h-4" /> Back to Products
            </a>
         </Link>
         <h1 className="text-3xl font-extrabold text-white uppercase tracking-tighter font-syne m-0">Edit Asset</h1>
      </div>

      {message.text && (
        <div className={`p-4 text-xs font-mono font-bold uppercase tracking-widest border-l-4 ${message.type === 'success' ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500' : 'bg-red-950/40 text-red-300 border-red-500'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8 bg-primary/55 p-10 border border-primary-light/20 relative">
          {/* Corner highlights */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary-light/40" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary-light/40" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary-light/40" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary-light/40" />

          <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-primary-light border-b border-slate-800 pb-4 mb-6 m-0">Product Specs</h2>
          
          <div className="space-y-4">
             <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest block">Product Name *</label>
                <input
                  name="title"
                  className="w-full px-4 py-4 bg-slate-950/60 border border-primary-light/20 focus:border-primary-light focus:bg-slate-950 outline-none text-xs text-white font-mono"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest block">Description *</label>
                <textarea
                  name="description"
                  className="w-full px-4 py-4 bg-slate-950/60 border border-primary-light/20 focus:border-primary-light focus:bg-slate-950 outline-none text-xs text-white font-mono h-32"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest block">Category *</label>
                  <select
                    name="category"
                    className="w-full px-4 py-4 bg-slate-950/60 border border-primary-light/20 focus:border-primary-light focus:bg-slate-950 outline-none text-xs font-bold font-mono text-white tracking-widest uppercase"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="" className="bg-slate-950 text-white">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id} className="bg-slate-950 text-white">{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest block">Brand (Optional)</label>
                  <input
                    name="brandName"
                    type="text"
                    placeholder="e.g. Raytheon, JRC, Furuno"
                    className="w-full px-4 py-4 bg-slate-950/60 border border-primary-light/20 focus:border-primary-light focus:bg-slate-950 outline-none text-xs text-white font-mono"
                    value={formData.brandName}
                    onChange={handleChange}
                  />
                </div>
             </div>

             <div className="flex items-center gap-4 pt-4">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  className="w-4 h-4 border-slate-700 bg-slate-950 accent-[#1E5FA6] cursor-pointer"
                  checked={formData.featured}
                  onChange={handleChange}
                />
                <label htmlFor="featured" className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest cursor-pointer select-none">Mark as Featured</label>
             </div>
          </div>
        </div>

        <div className="space-y-8">
           {/* Main Image */}
           <div className="bg-primary/55 p-10 border border-primary-light/20 relative">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary-light/40" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary-light/40" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary-light/40" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary-light/40" />

              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-primary-light m-0">Main Image</h2>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 border border-slate-800 text-[9px] font-mono font-bold uppercase tracking-tight text-slate-400">
                    <ShieldCheck className="w-3 h-3 text-primary-light" />
                    WM: {globalSettings.applyWatermark ? 'AUTO' : 'OFF'}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                 {(imagePreview || existingImage) ? (
                    <div className="relative aspect-video border border-slate-800 overflow-hidden bg-slate-950/60 flex items-center justify-center">
                       <img src={imagePreview || existingImage} alt="Preview" className="max-w-full max-h-full w-auto h-auto object-contain" />
                       
                       <div className="absolute top-2 right-2 flex flex-col gap-2">
                          <button 
                            type="button" 
                            onClick={() => { setImageFile(null); setImagePreview(''); setExistingImage(''); }} 
                            className="bg-red-600/80 p-2 text-white border-0 cursor-pointer"
                            title="Remove Image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                 ) : (
                    <label className="block w-full border-2 border-dashed border-slate-800 py-12 text-center hover:border-primary-light transition-colors cursor-pointer bg-slate-950/40">
                       <Upload className="w-8 h-8 text-slate-500 mx-auto mb-4" />
                       <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-widest block">Upload Image</span>
                       <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                 )}
              </div>
           </div>

           {/* Gallery Images */}
           <div className="bg-primary/55 p-10 border border-primary-light/20 relative">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary-light/40" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary-light/40" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary-light/40" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary-light/40" />

              <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-primary-light border-b border-slate-800 pb-4 mb-6 m-0">Gallery Images</h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                  {existingImages.map((src, idx) => (
                    <div key={`exist-${idx}`} className="relative aspect-square border border-slate-850 bg-slate-950/60 flex items-center justify-center overflow-hidden">
                       <img src={src} alt="Existing" className="max-w-full max-h-full w-auto h-auto object-contain" />
                       <button type="button" onClick={() => handleRemoveExistingSecondary(idx)} className="absolute -top-1 -right-1 bg-red-600 p-1 text-white rounded-full border-0 cursor-pointer"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                  {imagePreviews.map((src, idx) => (
                    <div key={`new-${idx}`} className="relative aspect-square border border-dashed border-primary-light/50 bg-slate-950/60 flex items-center justify-center overflow-hidden">
                       <img src={src} alt="New" className="max-w-full max-h-full w-auto h-auto object-contain" />
                       <button type="button" onClick={() => {
                          setImagesFile(prev => prev.filter((_, i) => i !== idx));
                          setImagePreviews(prev => prev.filter((_, i) => i !== idx));
                       }} className="absolute -top-1 -right-1 bg-red-600 p-1 text-white rounded-full border-0 cursor-pointer"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                  <label className="aspect-square border-2 border-dashed border-slate-800 flex items-center justify-center hover:border-primary-light transition-colors cursor-pointer bg-slate-950/40">
                     <Upload className="w-6 h-6 text-slate-500" />
                     <input type="file" accept="image/*" multiple onChange={handleImagesChange} className="hidden" />
                  </label>
              </div>
           </div>

           <button
              type="submit"
              disabled={isSaving || isUploading}
              className="w-full py-5 bg-primary-light hover:bg-primary-light text-white font-mono font-bold uppercase tracking-[0.3em] text-xs transition-all shadow-2xl flex items-center justify-center gap-4 border-0 cursor-pointer"
           >
              {isSaving || isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Updating registries...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" /> Save Changes
                </>
              )}
           </button>
        </div>
      </form>

      {cropTarget && (
        <CropModal
          image={cropTarget.url}
          onCropComplete={onCropComplete}
          onCancel={() => setCropTarget(null)}
        />
      )}
    </div>
  );
}

AdminProductEditPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
