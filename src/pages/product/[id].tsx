import React, { useState } from "react"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronDown, Phone, Mail, ShieldCheck, Cpu, Globe, X } from "lucide-react"
import { OrderForm } from "@/components/common/order-form"
import { motion, AnimatePresence } from "framer-motion"
import { MainLayout } from '@/components/layout'
import { NextPageWithLayout } from '@/interfaces/layout'
import { GetStaticProps, GetStaticPaths } from 'next'
import connectToDatabase from '@/lib/db'
import { Product } from '@/lib/models'
import { SEO } from '@/components/seo/SEO'
import { ProductSchema } from '@/components/seo/product-schema'

interface ProductProps {
  product: any
  relatedProducts: any[]
}

const ProductDetailPage: NextPageWithLayout<ProductProps> = ({ product, relatedProducts }) => {
  const [openAccordion, setOpenAccordion] = useState<string | null>("details")
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)


  if (!product) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 bg-slate-50 font-sans">
      <h2 className="text-3xl font-extrabold text-primary font-syne m-0">Asset Not Found</h2>
      <Link href="/products">
        <a className="px-8 py-3 bg-primary-light text-white font-mono text-xs uppercase tracking-widest no-underline">
          Return to Inventory
        </a>
      </Link>
    </div>
  );

  const accordionItems = [
    { id: "details", title: "Technical Specifications", content: "Built to withstand extreme maritime and marine environment conditions, this component features high-grade corrosion resistance and is fully compliant with SOLAS/IMO international shipping standards." },
    { id: "shipping", title: "Logistics & Delivery", content: "Sourced directly from the Alang ship breaking yard, this part is thoroughly inspected, tested by marine technicians, and securely packed for global transit. We offer worldwide door-to-port shipping via leading freight partners." }
  ];

  return (
    <>
      <SEO 
        title={`${product.title} ${product.brand ? `by ${product.brand}` : ''}`}
        description={product.description || `Buy ${product.title} from Aarfa Marine. High-quality marine equipment from Alang Shipyard.`}
        canonicalUrl={`/product/${product._id}`}
        ogImage={product.image}
        ogType="article"
      />
      <ProductSchema product={product} />
      <main className="min-h-screen pb-16 md:pb-20 pt-28 md:pt-32 bg-marine-mist text-primary font-sans overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link href="/products">
            <a className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-primary transition-colors mb-8 md:mb-12 uppercase tracking-widest no-underline">
              <ChevronLeft className="w-4 h-4" />
              Back to Inventory
            </a>
          </Link>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-24">
            {/* Main Image & Gallery */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4 md:space-y-6"
            >
              <div 
                className="relative aspect-square bg-primary/5 overflow-hidden border border-slate-200 shadow-2xl cursor-pointer"
                onClick={() => setLightboxImage(product.image)}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 font-mono text-sm">NO IMAGE AVAILABLE</div>
                )}
                <div className="absolute top-4 right-4 bg-primary text-white px-3 md:px-4 py-1.5 text-[9px] font-mono font-bold uppercase tracking-widest">
                  {product.category?.name || "General"}
                </div>
              </div>
              
              {/* Gallery Images */}
              {product.images && product.images.length > 0 && (
                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                  {product.images.map((img: string, i: number) => (
                    <div 
                      key={i} 
                      className="w-24 h-24 flex-shrink-0 relative overflow-hidden border border-slate-200 rounded-sm cursor-pointer hover:border-primary-light transition-all"
                      onClick={() => setLightboxImage(img)}
                    >
                      <img 
                        src={img} 
                        alt={`${product.title} - Preview ${i + 1}`} 
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Specs & CTA */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <div className="mb-8 md:mb-10 lg:pt-4">
                <span className="text-primary-light tracking-widest uppercase text-[10px] font-mono font-bold mb-4 block">Refurbished Unit</span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary mb-5 md:mb-6 leading-tight uppercase tracking-normal font-syne m-0">
                  {product.title}
                </h1>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-8 border-l-4 border-primary-light/40 pl-6 m-0 mt-6">
                  {product.description}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8 md:mb-10 pb-8 md:pb-10 border-b border-slate-200">
                 <div className="text-center">
                    <ShieldCheck className="w-6 h-6 text-primary-light mx-auto mb-2" />
                    <span className="text-[8px] font-mono uppercase font-bold text-slate-400 tracking-widest block">Class Approved</span>
                 </div>
                 <div className="text-center">
                    <Cpu className="w-6 h-6 text-primary-light mx-auto mb-2" />
                    <span className="text-[8px] font-mono uppercase font-bold text-slate-400 tracking-widest block">Bench Tested</span>
                 </div>
                 <div className="text-center">
                    <Globe className="w-6 h-6 text-primary-light mx-auto mb-2" />
                    <span className="text-[8px] font-mono uppercase font-bold text-slate-400 tracking-widest block">Worldwide Ship</span>
                 </div>
              </div>

              {/* CTAs */}
              <div className="space-y-4 mb-12">
                 <OrderForm productId={product._id} productTitle={product.title} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                     <a href="tel:+919023968557" className="flex items-center justify-center gap-2 py-4 border border-slate-300 hover:border-primary text-primary font-mono font-bold uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all no-underline">
                       <Phone className="w-4 h-4" /> Call Hotline
                     </a>
                     <a href={`mailto:aarfa.navigation@gmail.com?subject=Enquiry for ${product.title}`} className="flex items-center justify-center gap-2 py-4 border border-slate-300 hover:border-primary text-primary font-mono font-bold uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all no-underline">
                        <Mail className="w-4 h-4" /> Email Inquiry
                     </a>
                  </div>
              </div>

              {/* Accordions */}
              <div className="space-y-2">
                {accordionItems.map((item) => (
                  <div key={item.id} className="border-b border-slate-200">
                    <button
                      onClick={() => setOpenAccordion(openAccordion === item.id ? null : item.id)}
                      className="w-full flex items-center justify-between py-5 text-left group bg-transparent border-0 cursor-pointer"
                    >
                      <span className="text-xs uppercase font-mono font-bold tracking-widest text-primary group-hover:text-primary-light transition-colors">{item.title}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${openAccordion === item.id ? "rotate-180 text-primary-light" : ""}`} />
                    </button>

                    <motion.div
                      initial={false}
                      animate={{ height: openAccordion === item.id ? "auto" : 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-xs md:text-sm text-slate-500 leading-relaxed m-0">
                        {item.content}
                      </p>
                    </motion.div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20 md:mt-40">
              <h2 className="text-xl md:text-2xl font-extrabold text-primary mb-8 md:mb-12 uppercase tracking-normal font-syne border-b border-primary-light/50 pb-6 inline-block m-0">
                Compatible Components
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                {relatedProducts.map((rel) => (
                  <Link key={rel._id} href={`/product/${rel._id}`}>
                    <a className="group relative overflow-hidden bg-white border border-slate-200 hover:border-primary-light transition-all duration-500 block no-underline">
                       <div className="aspect-[4/3] relative bg-primary/5 overflow-hidden">
                          {rel.image ? (
                            <img src={rel.image} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px] font-mono">NO IMAGE</div>
                          )}
                       </div>
                       <div className="p-4 border-t border-slate-100">
                          <h3 className="text-[10px] font-mono font-bold text-primary uppercase truncate group-hover:text-primary-light transition-colors tracking-wider m-0">{rel.title}</h3>
                       </div>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-primary/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
              onClick={() => setLightboxImage(null)}
            >
              <button 
                className="absolute top-6 right-6 text-white hover:text-primary-light transition-colors z-50 bg-transparent border-0"
                onClick={() => setLightboxImage(null)}
              >
                <X className="w-8 h-8" />
              </button>
              <div className="relative max-w-4xl max-h-[80vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
                <img
                  src={lightboxImage}
                  alt="Full size view"
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  )
}

ProductDetailPage.getLayout = (page) => <MainLayout>{page}</MainLayout>

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], // Pre-render no pages at build time, render on demand
    fallback: 'blocking' // Wait for HTML to generate on first request
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const { id } = context.params as { id: string }
    await connectToDatabase()
    
    // Check if valid ObjectId if you are using mongoose ObjectId strictly
    const product = await Product.findById(id).populate('category').lean()
    
    if (!product) {
      return { notFound: true }
    }

    let relatedProducts = []
    if (product.category) {
      relatedProducts = await Product.find({ 
        category: product.category._id,
        _id: { $ne: product._id }
      }).limit(4).lean()
    }
    
    return {
      props: {
        product: JSON.parse(JSON.stringify(product)),
        relatedProducts: JSON.parse(JSON.stringify(relatedProducts))
      },
      revalidate: 60,
    }
  } catch (error) {
    console.error("Error in getStaticProps for product:", error)
    return { notFound: true }
  }
}

export default ProductDetailPage
