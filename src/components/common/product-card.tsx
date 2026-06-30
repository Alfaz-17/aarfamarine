import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

interface ProductCardProps {
  product: {
    _id: string
    title: string
    image: string
    category?: {
      name: string
    }
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState(product.image || "/images/placeholder.jpg")
  const [hasError, setHasError] = useState(false)

  return (
    <Link href={`/product/${product._id}`}>
      <a className="group block h-full bg-white border border-black/10 hover:border-[#ED1C24] transition-all relative no-underline">
        <div className="aspect-[4/5] relative overflow-hidden bg-[#1A1A1A]/5">
            <Image 
              src={imgSrc} 
              alt={product.title} 
              layout="fill"
              onError={() => {
                  if (!hasError) {
                      setHasError(true);
                      setImgSrc("/images/placeholder.jpg"); 
                  }
              }}
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-[#ED1C24]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                <span className="px-5 py-2 bg-white text-[#1A1A1A] text-[10px] font-bold uppercase tracking-widest shadow-xl">Inspect Part</span>
            </div>
        </div>
        <div className="p-4 border-t border-black/5">
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#ED1C24] font-bold mb-1 block">
              REF: {product.category?.name || "General"}
            </span>
            <h3 className="text-sm font-bold text-[#1A1A1A] line-clamp-2 uppercase tracking-tighter group-hover:text-[#ED1C24] transition-colors leading-tight m-0">
              {product.title}
            </h3>
        </div>
      </a>
    </Link>
  )
}
