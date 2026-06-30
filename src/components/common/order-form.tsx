import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ShoppingCart, Check, Loader2 } from "lucide-react"
import api from "@/lib/api"

interface OrderFormProps {
  productId: string
  productTitle: string
  onClose?: () => void
}

export function OrderForm({ productId, productTitle, onClose }: OrderFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    quantity: 1,
    notes: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await api.post("/orders", {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        items: [{
          product: productId,
          productTitle: productTitle,
          quantity: formData.quantity
        }],
        notes: formData.notes
      })

      setSuccess(true)
      setTimeout(() => {
        setIsOpen(false)
        setSuccess(false)
        setFormData({
          customerName: "",
          customerPhone: "",
          customerEmail: "",
          quantity: 1,
          notes: ""
        })
        if (onClose) onClose();
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to place order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-4 bg-primary hover:bg-primary-light text-white font-bold uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-3 border-0 cursor-pointer"
      >
        <ShoppingCart className="w-4 h-4" />
        Request Quote / Order Now
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1A1A1A]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            onClick={() => !loading && setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md max-h-[92svh] overflow-y-auto p-5 sm:p-8 relative border border-[#ED1C24]/20 shadow-2xl"
              onClick={(e: any) => e.stopPropagation()}
            >
              {/* Technical brackets */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#ED1C24]/40" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#ED1C24]/40" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#ED1C24]/40" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#ED1C24]/40" />

              <button
                onClick={() => !loading && setIsOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-[#1A1A1A] transition-colors bg-transparent border-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2 font-syne uppercase">Request Transmitted!</h3>
                  <p className="text-sm text-slate-500 m-0">Our engineers will contact you shortly with the quotation.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 font-syne m-0">Request Spare Quote</h2>
                  <p className="text-xs font-bold text-slate-400 mb-6 line-clamp-1 uppercase tracking-wider m-0">{productTitle}</p>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs border border-red-200 uppercase tracking-widest font-mono">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 focus:border-primary-light focus:outline-none text-xs"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.customerPhone}
                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 focus:border-primary-light focus:outline-none text-xs"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 focus:border-primary-light focus:outline-none text-xs"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                        Quantity
                      </label>
                      <div className="flex items-center border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, quantity: Math.max(1, formData.quantity - 1) })}
                          className="w-12 h-12 flex items-center justify-center text-[#1A1A1A] hover:bg-slate-100 transition-colors text-xl font-bold bg-transparent border-0 cursor-pointer"
                        >
                          −
                        </button>
                        <span className="flex-1 text-center text-sm font-bold text-[#1A1A1A]">
                          {formData.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, quantity: formData.quantity + 1 })}
                          className="w-12 h-12 flex items-center justify-center text-[#1A1A1A] hover:bg-slate-100 transition-colors text-xl font-bold bg-transparent border-0 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                        Notes (Optional)
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 focus:border-primary-light focus:outline-none text-xs resize-none"
                        rows={3}
                        placeholder="Enter part details, serial numbers, ship name..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-primary hover:bg-primary-light text-white font-bold uppercase tracking-widest text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-2 border-0 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          Processing...
                        </>
                      ) : (
                        "Submit Quotation Request"
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
