import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, X, ChevronLeft, Plus, Crop, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import { addWatermark } from '@/lib/utils/watermark';
import { removeBackgroundClient } from '@/lib/background-removal-client';
import api from '@/lib/api';
import Link from 'next/link';
import CropModal from '@/components/common/CropModal';
import AdminLayout from '@/components/admin/admin-layout';

export default function AdminProductFormPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brandName: '',
    category: '',
    featured: false
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imagesFile, setImagesFile] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [categories, setCategories] = useState<any[]>([]);

  // Cropping state
  const [cropTarget, setCropTarget] = useState<{ type: 'main' | 'gallery', index?: number, url: string } | null>(null);
  const [fileQueue, setFileQueue] = useState<File[]>([]);

  // Global Settings state
  const [globalSettings, setGlobalSettings] = useState({
    autoBackgroundRemoval: false,
    applyWatermark: true,
    watermarkText: 'Aarfa Marine Solutions'
  });

  // Background removal state
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [bgProcessingIndex, setBgProcessingIndex] = useState<{type: 'main' | 'gallery', index?: number} | null>(null);
  const [bgStatus, setBgStatus] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, settingsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/settings')
        ]);
        setCategories(catRes.data);
        if (settingsRes.data) {
          setGlobalSettings(settingsRes.data);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchData();
  }, []);

  // Handle file queue processing
  useEffect(() => {
    if (!cropTarget && fileQueue.length > 0) {
      const nextFile = fileQueue[0];
      const reader = new FileReader();
      reader.onload = () => {
        setCropTarget({ type: 'gallery', url: reader.result as string });
        setFileQueue(prev => prev.slice(1));
      };
      reader.readAsDataURL(nextFile);
    }
  }, [cropTarget, fileQueue]);

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
      const reader = new FileReader();
      reader.onload = () => {
        setCropTarget({ type: 'main', url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFileQueue(prev => [...prev, ...files]);
    }
  };

  const onCropComplete = async (croppedFile: File) => {
    if (!cropTarget) return;

    if (cropTarget.type === 'main') {
      setImageFile(croppedFile);
      setImagePreview(URL.createObjectURL(croppedFile));
      
      if (globalSettings.autoBackgroundRemoval) {
        handleRemoveBackground('main', undefined, croppedFile);
      }
    } else {
      const newIndex = imagesFile.length;
      setImagesFile(prev => [...prev, croppedFile]);
      setImagePreviews(prev => [...prev, URL.createObjectURL(croppedFile)]);
      
      if (globalSettings.autoBackgroundRemoval) {
        handleRemoveBackground('gallery', newIndex, croppedFile);
      }
    }
    setCropTarget(null);
  };

  const handleRemoveBackground = async (type: 'main' | 'gallery' = 'main', index?: number, fileOverride?: File) => {
    let sourceFile = fileOverride || (type === 'main' ? imageFile : (index !== undefined ? imagesFile[index] : null));
    if (!sourceFile) return;
    
    setIsRemovingBg(true);
    setBgProcessingIndex({ type, index });
    setBgStatus('Initializing AI...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setBgStatus('Removing background...');
      
      const processedBlob = await removeBackgroundClient(sourceFile);
      const processedFile = new File([processedBlob], `processed-${type}${index !== undefined ? `-${index}` : ''}.png`, { type: 'image/png' });
      
      if (type === 'main') {
        setImageFile(processedFile);
        setImagePreview(URL.createObjectURL(processedFile));
      } else if (index !== undefined) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      let mainImageUrl = '';
      let secondaryImageUrls: string[] = [];

      setIsUploading(true);
      
      // Upload main image with watermark
      if (imageFile) {
        const processedImage = globalSettings.applyWatermark 
          ? await addWatermark(imageFile, globalSettings.watermarkText) 
          : imageFile;
        mainImageUrl = await uploadToCloudinary(processedImage);
      }

      // Upload secondary images
      for (const file of imagesFile) {
        const processedImage = globalSettings.applyWatermark 
          ? await addWatermark(file, globalSettings.watermarkText) 
          : file;
        const url = await uploadToCloudinary(processedImage);
        secondaryImageUrls.push(url);
      }
      
      setIsUploading(false);

      await api.post("/products", {
        ...formData,
        image: mainImageUrl,
        images: secondaryImageUrls
      });

      setMessage({ type: "success", text: "Asset added successfully to registry." });
      // Reset form
      setFormData({ title: '', description: '', brandName: '', category: '', featured: false });
      setImageFile(null);
      setImagePreview('');
      setImagesFile([]);
      setImagePreviews([]);
      
    } catch (error: any) {
      console.error("Error creating product:", error);
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to add asset." });
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-8 relative">
         <Link href="/admin/products">
            <a className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-slate-400 hover:text-white uppercase tracking-widest no-underline">
               <ChevronLeft className="w-4 h-4" /> Back to Products
            </a>
         </Link>
         <h1 className="text-3xl font-extrabold text-white uppercase tracking-tighter font-syne m-0">Add New Product</h1>
      </div>

      {message.text && (
        <div className={`p-4 text-xs font-mono font-bold uppercase tracking-widest border-l-4 ${
          message.type === 'success' ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500' : 
          message.type === 'info' ? 'bg-blue-950/40 text-blue-300 border-blue-500' :
          'bg-red-950/40 text-red-300 border-red-500'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Main Image Upload */}
        <div className="space-y-12">
           <div className="bg-primary/55 p-10 border border-primary-light/20 space-y-6 relative">
              {/* Corner highlights */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary-light/40" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary-light/40" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary-light/40" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary-light/40" />

              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-2">
                <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-primary-light m-0">Main Image</h2>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 border border-slate-800 text-[9px] font-mono font-bold uppercase tracking-tight text-slate-400">
                    <ShieldCheck className="w-3 h-3 text-primary-light" />
                    Watermark: {globalSettings.applyWatermark ? 'AUTO' : 'OFF'}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 border border-slate-800 text-[9px] font-mono font-bold uppercase tracking-tight text-slate-400">
                    <Sparkles className="w-3 h-3 text-primary-light" />
                    Auto BG: {globalSettings.autoBackgroundRemoval ? 'AUTO' : 'OFF'}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                 {imagePreview ? (
                    <div className="relative border border-slate-800 overflow-hidden bg-slate-950/60 flex items-center justify-center min-h-[300px]">
                       <img src={imagePreview} alt="Preview" className="max-w-full max-h-[600px] w-auto h-auto object-contain" />
                       <div className="absolute top-2 right-2 flex flex-col gap-2">
                          <button 
                            type="button"
                            onClick={() => { setImageFile(null); setImagePreview(''); }} 
                            className="bg-red-600/80 p-2 text-white border-0 cursor-pointer hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>

                           <button
                             type="button"
                             onClick={() => imagePreview && setCropTarget({ type: 'main', url: imagePreview })}
                             className="bg-primary-light/80 p-2 text-white border-0 cursor-pointer hover:bg-primary-light"
                             title="Crop Image"
                           >
                             <Crop className="w-4 h-4" />
                           </button>
                       </div>

                       {isRemovingBg && bgProcessingIndex?.type === 'main' && (
                         <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] flex items-center justify-center flex-col gap-3">
                           <div className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800">
                             <Loader2 className="w-4 h-4 animate-spin text-primary-light" />
                             <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary-light">{bgStatus}</span>
                           </div>
                         </div>
                       )}
                    </div>
                 ) : (
                    <label className="block w-full border-2 border-dashed border-slate-800 py-12 text-center cursor-pointer bg-slate-950/40 hover:bg-slate-950/60 transition-colors">
                       <Upload className="w-8 h-8 text-slate-500 mx-auto mb-4" />
                       <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-widest block">Upload Main Product Image</span>
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
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                 {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative aspect-square border border-slate-850 bg-slate-950/60 flex items-center justify-center overflow-hidden">
                       <img src={src} alt="Sub" className="max-w-full max-h-full w-auto h-auto object-contain" />
                       <button 
                          type="button"
                          onClick={() => {
                             setImagesFile(prev => prev.filter((_, i) => i !== idx));
                             setImagePreviews(prev => prev.filter((_, i) => i !== idx));
                          }} 
                          className="absolute -top-1 -right-1 bg-red-600 p-1 text-white rounded-full hover:bg-red-700 shadow-md border-0 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => setCropTarget({ type: 'gallery', index: idx, url: src })} 
                          className="absolute -bottom-1 -right-1 bg-primary-light p-1 text-white rounded-full shadow-lg border-0 cursor-pointer"
                          title="Crop Image"
                        >
                          <Crop className="w-3 h-3" />
                        </button>
                    </div>
                 ))}
                 <label className="aspect-square border-2 border-dashed border-slate-800 flex items-center justify-center cursor-pointer bg-slate-950/40 hover:bg-slate-950/60 transition-colors">
                    <Plus className="w-6 h-6 text-slate-500" />
                    <input type="file" accept="image/*" multiple onChange={handleImagesChange} className="hidden" />
                 </label>
              </div>
           </div>
        </div>

        {/* Details Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8 bg-primary/55 p-10 border border-primary-light/20 relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary-light/40" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary-light/40" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary-light/40" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary-light/40" />

            <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-primary-light border-b border-slate-800 pb-4 mb-6 m-0">Asset Spec Sheets</h2>
            
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest block">Product Name *</label>
                  <input
                    name="title"
                    placeholder="E.g., MAN B&W Cylinder Liner"
                    className="w-full px-4 py-4 bg-slate-950/60 border border-primary-light/20 focus:border-primary-light focus:bg-slate-950 outline-none text-xs text-white font-mono"
                    value={formData.title}
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
                  <label htmlFor="featured" className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest cursor-pointer select-none">Mark as Featured Product</label>
               </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-primary/55 p-10 border border-primary-light/20 flex flex-col relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary-light/40" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary-light/40" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary-light/40" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary-light/40" />

            <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-primary-light border-b border-slate-800 pb-4 mb-6 m-0">Detailed Specs & Notes</h2>
            <textarea
              name="description"
              placeholder="Enter comprehensive product specification, condition, model numbers, OEM availability, etc."
              className="w-full px-4 py-4 bg-slate-950/60 border border-primary-light/20 focus:border-primary-light focus:bg-slate-950 outline-none text-xs text-white font-mono flex-grow min-h-[200px]"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || isUploading}
            className="w-full lg:w-1/2 py-5 bg-primary-light hover:bg-primary-light text-white font-mono font-bold uppercase tracking-[0.3em] text-xs transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-70 border-0 cursor-pointer"
          >
            {isLoading || isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                Processing Assets...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" /> Add Product to Catalog
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

AdminProductFormPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
