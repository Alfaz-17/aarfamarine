import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import Image from 'next/image'

interface ProductCardProps {
  product: any
  tone?: 'dark' | 'light'
}

const ProductCard: FC<ProductCardProps> = ({ product, tone = 'dark' }) => {
  const isLight = tone === 'light'
  let categoryText = ''
  if (typeof product.category === 'object' && product.category) {
    if (product.category.mainCategory) {
      categoryText = `${product.category.mainCategory} / ${product.category.name}`
    } else {
      categoryText = product.category.name
    }
  }

  return (
    <Link href={`/products/${product.slug || product._id}`} passHref>
      <Box
        component="a"
        sx={{
          display: 'block',
          textDecoration: 'none',
          p: { xs: 1, sm: 1.5, md: 2 },
        mb: 0,
        bgcolor: isLight ? 'common.white' : 'rgba(255, 255, 255, 0.03)',
        border: isLight ? '1px solid' : '1px solid rgba(255,255,255,0.12)',
        borderColor: isLight ? 'divider' : 'rgba(255,255,255,0.12)',
        backdropFilter: isLight ? 'none' : 'blur(10px)',
        borderRadius: 1,
        height: '100%',
        boxShadow: isLight ? { xs: '0 8px 20px rgba(10,25,47,0.07)', md: '0 16px 40px rgba(10,25,47,0.08)' } : 'none',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden', // for the shine effect
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '50%',
          height: '100%',
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)',
          transform: 'skewX(-25deg)',
          transition: 'all 0.6s ease',
          zIndex: 10,
          pointerEvents: 'none',
        },
        // The expanding fill background for professional pop
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '0%',
          bgcolor: isLight ? 'primary.main' : 'common.white',
          transition: 'height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          zIndex: -1,
        },
        '&:hover': {
          transform: 'translateY(-10px)',
          borderColor: isLight ? 'primary.main' : 'common.white',
          boxShadow: isLight
            ? '0 25px 50px rgba(10,25,47,0.2), 0 10px 20px #1E5FA624'
            : '0 25px 50px rgba(0,0,0,0.5)',
          '&::before': {
            left: '200%',
          },
          '&::after': {
            height: '100%',
          },
          '& .product-img': {
            transform: 'scale(1.08) rotate(1.5deg)',
          },
          '& .product-overlay': {
            opacity: 1,
          },
          '& .product-title': {
            color: isLight ? 'common.white' : 'primary.main',
          },
          '& .product-desc, & .product-brand': {
            color: isLight ? 'rgba(255,255,255,0.7)' : 'text.secondary',
          },
          '& .view-more-action': {
            opacity: 1,
            transform: 'translateX(0)',
            color: isLight ? 'common.white' : 'primary.main',
          },
          '& .view-more-arrow': {
            transform: 'translateX(4px)',
          }
        },
      }}
    >
      <Box
        sx={{
          lineHeight: 0,
          overflow: 'hidden',
          borderRadius: 1,
          mb: { xs: 1, md: 2 },
          position: 'relative',
          height: { xs: 220, sm: 180, md: 240 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: isLight ? 'background.default' : 'rgba(255,255,255,0.05)',
        }}
      >
        {product.image || product.images?.[0] ? (
          <Image
            className="product-img"
            src={product.image || product.images[0]}
            alt={`Buy ${product.title} - Marine Navigation Spares by Aarfa Marine`}
            title={`High-quality reconditioned ${product.title}`}
            layout="fill"
            objectFit="contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              padding: '8px',
              transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          />
        ) : (
          <Typography variant="body2" sx={{ color: isLight ? 'text.secondary' : 'rgba(255,255,255,0.4)' }}>
            No Image Available
          </Typography>
        )}
        {/* Hover gradient overlay */}
        <Box
          className="product-overlay"
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: 1,
            background: isLight
              ? 'linear-gradient(180deg, transparent 50%, rgba(10,31,64,0.45) 100%)'
              : 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.45) 100%)',
            opacity: 0,
            transition: 'opacity 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            pointerEvents: 'none',
          }}
        />
      </Box>
      <Box sx={{ mb: { xs: 0.25, md: 2 } }}>
        {/* Category tag */}
        {categoryText && (
          <Typography sx={{
            fontSize: { xs: '0.65rem', sm: '0.65rem', md: '0.68rem' }, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: { xs: 0.5, md: 1 }, color: 'secondary.main', mb: 0.5,
          }}>
            {categoryText}
          </Typography>
        )}

        <Typography
          className="product-title"
          component="h3"
          variant="h5"
          sx={{
            fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1.15rem' },
            fontWeight: 700,
            mb: { xs: 0.25, md: 1 },
            color: isLight ? 'text.primary' : 'common.white',
            transition: 'color 0.3s ease',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: { xs: 1.25, md: 1.35 },
            minHeight: { xs: '2.2rem', sm: '2.4rem', md: '2.8rem' }
          }}
        >
          {product.title}
        </Typography>

        {/* Description */}
        {product.description && (
          <Typography className="product-desc" variant="body2" sx={{
            color: isLight ? 'text.secondary' : 'rgba(255,255,255,0.5)',
            transition: 'color 0.3s ease',
            fontSize: { xs: '0.8rem', sm: '0.78rem', md: '0.85rem' },
            lineHeight: { xs: 1.35, md: 1.5 },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: { xs: 1, sm: 2 },
            WebkitBoxOrient: 'vertical',
            mb: 0.5,
          }}>
            {product.description}
          </Typography>
        )}
        
        {/* Brand (optional, subtle) */}
        {product.brandName && (
          <Typography className="product-brand" variant="body2" sx={{ 
            color: isLight ? 'text.secondary' : 'rgba(255,255,255,0.5)', 
            transition: 'color 0.3s ease',
            minHeight: '1.25rem', fontSize: { xs: '0.78rem', md: '0.9rem' } 
          }}>
            Brand: {product.brandName}
          </Typography>
        )}

        {/* View Details Action */}
        <Box 
          className="view-more-action"
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            mt: 1.5, 
            color: isLight ? 'primary.main' : 'primary.light', 
            fontWeight: 700, 
            fontSize: { xs: '0.75rem', md: '0.8rem' },
            textTransform: 'uppercase',
            letterSpacing: 1,
            opacity: 0,
            transform: 'translateX(-10px)',
            transition: 'all 0.35s ease',
          }}
        >
          View Details 
          <Box component="span" className="view-more-arrow" sx={{ transition: 'transform 0.3s ease' }}>
            →
          </Box>
        </Box>
      </Box>

      </Box>
    </Link>
  )
}

export default ProductCard
