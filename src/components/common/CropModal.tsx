import React, { useState, useCallback } from 'react'
import Cropper, { Point, Area } from 'react-easy-crop'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Crop } from 'lucide-react'
import getCroppedImg from '@/lib/utils/cropImage'

const EasyCropper = Cropper as any;

interface CropModalProps {
  image: string
  onCropComplete: (croppedImage: File) => void
  onCancel: () => void
  aspect?: number
}

const ASPECT_RATIOS = [
  { label: 'Original', value: undefined },
  { label: '1:1', value: 1 / 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:2', value: 3 / 2 },
  { label: '16:9', value: 16 / 9 },
  { label: '9:16', value: 9 / 16 },
]

const CropModal: React.FC<CropModalProps> = ({ 
  image, 
  onCropComplete, 
  onCancel,
  aspect: initialAspect = 4 / 3
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [aspect, setAspect] = useState<number | undefined>(initialAspect)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropChange = (crop: Point) => {
    setCrop(crop)
  }

  const onZoomChange = (zoom: number) => {
    setZoom(zoom)
  }

  const onCropCompleteInternal = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleCrop = async () => {
    if (croppedAreaPixels) {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels)
      if (croppedImage) {
        onCropComplete(croppedImage)
      }
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-slate-900 w-full max-w-2xl h-[85vh] flex flex-col relative overflow-hidden shadow-2xl border border-slate-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950">
            <div className="flex items-center gap-3">
              <div className="bg-primary-light/10 p-2 text-primary-light">
                <Crop className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-white font-syne m-0">Crop Image</h2>
            </div>
            <button onClick={onCancel} className="text-slate-400 hover:text-red-400 transition-colors bg-transparent border-0 cursor-pointer">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Ratio Selector */}
          <div className="flex items-center gap-2 p-4 bg-slate-950/60 border-b border-slate-800 overflow-x-auto no-scrollbar">
            <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-slate-400 mr-2 shrink-0">Ratio</span>
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio.label}
                onClick={() => setAspect(ratio.value)}
                className={`px-4 py-2 text-[8px] font-mono font-bold uppercase tracking-widest transition-all shrink-0 cursor-pointer ${
                  aspect === ratio.value 
                  ? 'bg-primary-light text-white border-0' 
                  : 'bg-slate-900 border border-slate-700 text-slate-300 hover:border-primary-light hover:text-primary-light'
                }`}
              >
                {ratio.label}
              </button>
            ))}
          </div>

          {/* Cropper area */}
          <div className="flex-grow relative bg-slate-950/20">
            <EasyCropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={onCropChange}
              onCropComplete={onCropCompleteInternal}
              onZoomChange={onZoomChange}
            />
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-800 bg-slate-950 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 w-12">Zoom</span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-grow h-1 bg-slate-850 rounded-full appearance-none accent-[#1E5FA6] cursor-pointer"
              />
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={onCancel}
                className="flex-1 py-4 border border-slate-700 bg-slate-900 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCrop}
                className="flex-1 py-4 bg-primary-light hover:bg-primary-light border-0 text-white text-[10px] font-mono font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" /> Save Crop
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default CropModal
