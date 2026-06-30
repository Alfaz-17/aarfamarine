import React, { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Package, Phone, Mail, Calendar, Loader2, Trash2, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react"
import api from "@/lib/api"
import { useAdminCache } from '@/hooks/use-admin-cache';
import AdminLayout from '@/components/admin/admin-layout';

interface OrderItem {
  product: any
  productTitle: string
  quantity: number
}

interface Order {
  _id: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  items: OrderItem[]
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  createdAt: string
}

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-950/40 border border-yellow-500/50 text-yellow-300", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-950/40 border border-blue-500/50 text-blue-300", icon: AlertCircle },
  completed: { label: "Completed", color: "bg-emerald-950/40 border border-emerald-500/50 text-emerald-300", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-950/40 border border-red-500/50 text-red-300", icon: XCircle }
}

export default function AdminOrdersPage() {
  const { data, isLoading, mutate } = useAdminCache<Order[]>("/orders");
  const orders = data || [];
  
  const [updating, setUpdating] = useState<string | null>(null)

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId)
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus })
      mutate(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus as Order['status'] } : order
      ))
    } catch (err) {
      console.error("Failed to update order:", err)
    } finally {
      setUpdating(null)
    }
  }

  const deleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return
    
    try {
      await api.delete(`/orders/${orderId}`)
      mutate(orders.filter(order => order._id !== orderId))
    } catch (err) {
      console.error("Failed to delete order:", err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-primary-light">
        <Loader2 className="w-8 h-8 animate-spin text-primary-light" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-slate-800 pb-8 relative">
        <Link href="/admin">
          <a className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-slate-400 hover:text-white uppercase tracking-widest no-underline mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Admin
          </a>
        </Link>
        <h1 className="text-3xl font-extrabold text-white uppercase tracking-tighter font-syne m-0">Inquiry Ledger</h1>
        <p className="text-xs font-mono font-bold text-primary-light uppercase tracking-[0.3em] mt-2 m-0">{orders.length} total transmissions</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-primary/55 border border-primary-light/20 p-12 text-center relative">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary-light/40" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary-light/40" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary-light/40" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary-light/40" />
          
          <Package className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2 font-syne">No Transmission Logs</h2>
          <p className="text-sm text-slate-400 m-0">Customer spares inquiries will appear in this control queue.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const StatusIcon = statusConfig[order.status].icon
            return (
              <div key={order._id} className="bg-primary/40 border border-primary-light/20 p-6 relative">
                {/* Corner Tech bracket */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary-light/30" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary-light/30" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary-light/30" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary-light/30" />

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Inquiry details */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className={`px-3 py-1 text-[9px] font-mono font-bold uppercase flex items-center gap-1.5 ${statusConfig[order.status].color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusConfig[order.status].label}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary-light" />
                        {formatDate(order.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 font-syne uppercase tracking-tight">{order.customerName}</h3>
                    
                    <div className="flex flex-wrap gap-6 text-xs font-mono text-slate-350 mb-4">
                      <a href={`tel:${order.customerPhone}`} className="flex items-center gap-1.5 hover:text-white text-primary-light no-underline">
                        <Phone className="w-4 h-4" />
                        {order.customerPhone}
                      </a>
                      {order.customerEmail && (
                        <a href={`mailto:${order.customerEmail}`} className="flex items-center gap-1.5 hover:text-white text-primary-light no-underline">
                          <Mail className="w-4 h-4" />
                          {order.customerEmail}
                        </a>
                      )}
                    </div>

                    {/* Spares Selected list */}
                    <div className="border-t border-slate-800 pt-4">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-primary-light block mb-2">Requested Fleet Components</span>
                      {order.items && order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-850 last:border-0 font-mono text-xs text-slate-300">
                          <span className="font-semibold text-white">{item.productTitle}</span>
                          <span className="text-primary-light">Qty: {item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {order.notes && (
                      <div className="mt-4 p-3 bg-slate-950/60 border border-slate-850 text-xs font-mono text-slate-400 italic">
                        Operator Notes: {order.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 lg:w-48">
                    <label className="text-[8px] font-mono font-bold text-primary-light uppercase tracking-widest block">Update Registry</label>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      disabled={updating === order._id}
                      className="w-full px-3 py-3 bg-slate-950 border border-primary-light/20 focus:border-primary-light focus:bg-slate-950 outline-none text-xs font-bold font-mono text-white tracking-widest uppercase cursor-pointer"
                    >
                      <option value="pending" className="bg-slate-950 text-white">Pending</option>
                      <option value="confirmed" className="bg-slate-950 text-white">Confirmed</option>
                      <option value="completed" className="bg-slate-950 text-white">Completed</option>
                      <option value="cancelled" className="bg-slate-950 text-white">Cancelled</option>
                    </select>
                    
                    <button
                      onClick={() => deleteOrder(order._id)}
                      className="w-full px-3 py-3 border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/5 text-red-400 font-mono text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer bg-transparent"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Log
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

AdminOrdersPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
