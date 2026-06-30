import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import { SEO } from '@/components/seo/SEO'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Pagination from '@mui/material/Pagination'
import IconButton from '@mui/material/IconButton'
import FilterListIcon from '@mui/icons-material/FilterList'
import CloseIcon from '@mui/icons-material/Close'
import Drawer from '@mui/material/Drawer'
import ExploreIcon from '@mui/icons-material/Explore'
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna'
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import { NextPageWithLayout } from '@/interfaces/layout'
import { MainLayout } from '@/components/layout'
import PageHero from '@/components/page-hero'
import ProductCard from '@/components/product-card'
import { CtaBand } from '@/components/home'
import connectToDatabase from '@/lib/db'
import { Product, Category, Brand } from '@/lib/models'

interface ProductsPageProps {
  products: any[]
  categories: any[]
  brands: any[]
}

const MAIN_CATEGORIES = [
  { name: 'Navigation', icon: <ExploreIcon /> },
  { name: 'Communication', icon: <SettingsInputAntennaIcon /> },
  { name: 'Automation', icon: <PrecisionManufacturingIcon /> },
]

const PRODUCTS_PER_PAGE = 8

// ─── Sidebar Filter Content (shared between desktop sidebar and mobile drawer) ───
interface FilterContentProps {
  categories: any[]
  selectedMainCategory: string | null
  selectedSubCategory: string | null
  onMainCategoryClick: (name: string) => void
  onSubCategoryClick: (id: string | null) => void
}

const FilterContent: React.FC<FilterContentProps> = ({
  categories, selectedMainCategory, selectedSubCategory,
  onMainCategoryClick, onSubCategoryClick,
}) => (
  <Box>
    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: 'text.disabled', mb: 2 }}>
      Categories
    </Typography>
    {MAIN_CATEGORIES.map((cat) => {
      const isActive = selectedMainCategory === cat.name
      const catSubCategories = categories.filter(c => (c.mainCategory || 'Navigation') === cat.name)
      
      return (
        <Accordion
          key={cat.name}
          expanded={isActive}
          onChange={() => onMainCategoryClick(cat.name)}
          disableGutters
          elevation={0}
          sx={{
            bgcolor: 'transparent',
            '&:before': { display: 'none' },
            mb: 0.5,
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ fontSize: 20, color: isActive ? 'primary.main' : 'text.secondary' }} />}
            sx={{
              minHeight: '44px !important',
              px: 2,
              py: 0,
              borderRadius: 1,
              bgcolor: isActive ? '#1E5FA61A' : 'transparent',
              color: isActive ? 'primary.main' : 'text.primary',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.95rem',
              border: isActive ? '1px solid #1E5FA640' : '1px solid transparent',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: isActive ? '#1E5FA61A' : 'rgba(10,25,47,0.04)',
              },
              '& .MuiAccordionSummary-content': {
                my: '0 !important',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              },
              '& .MuiSvgIcon-root': {
                fontSize: 20,
                color: isActive ? 'primary.main' : 'text.secondary',
              }
            }}
          >
            {cat.icon}
            {cat.name}
          </AccordionSummary>
          
          <AccordionDetails sx={{ p: 0, pt: 1, pl: 2, pb: 1 }}>
            <Box
              onClick={() => onSubCategoryClick(null)}
              sx={{
                px: 2, py: 1, mb: 0.5, borderRadius: 1, cursor: 'pointer',
                fontSize: '0.85rem',
                color: selectedSubCategory === null ? 'primary.main' : 'text.secondary',
                fontWeight: selectedSubCategory === null ? 700 : 400,
                bgcolor: selectedSubCategory === null ? '#1E5FA60F' : 'transparent',
                transition: 'all 0.15s',
                '&:hover': { bgcolor: 'rgba(10,25,47,0.04)', color: 'text.primary' },
              }}
            >
              All {cat.name}
            </Box>
            {catSubCategories.map((sub) => (
              <Box
                key={sub._id}
                onClick={() => onSubCategoryClick(sub._id)}
                sx={{
                  px: 2, py: 1, mb: 0.5, borderRadius: 1, cursor: 'pointer',
                  fontSize: '0.85rem',
                  color: selectedSubCategory === sub._id ? 'primary.main' : 'text.secondary',
                  fontWeight: selectedSubCategory === sub._id ? 700 : 400,
                  bgcolor: selectedSubCategory === sub._id ? '#1E5FA60F' : 'transparent',
                  transition: 'all 0.15s',
                  '&:hover': { bgcolor: 'rgba(10,25,47,0.04)', color: 'text.primary' },
                }}
              >
                {sub.name}
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      )
    })}
  </Box>
)

// ─── Main Page ───────────────────────────────────────────────────
const ProductsPage: NextPageWithLayout<ProductsPageProps> = ({ products, categories, brands }) => {
  const router = useRouter()
  const { category, search } = router.query

  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Sync state with URL parameter
  React.useEffect(() => {
    if (category && typeof category === 'string') {
      setSelectedMainCategory(category)
    }
    if (search && typeof search === 'string') {
      setSearchQuery(search)
    }
  }, [category, search])

  const handleMainCategoryClick = (catName: string) => {
    if (selectedMainCategory === catName) {
      // Toggle off (close dropdown and clear filter)
      setSelectedMainCategory(null)
      setSelectedSubCategory(null)
      router.push(`/products`, undefined, { shallow: true })
    } else {
      // Toggle on (open dropdown and apply filter)
      setSelectedMainCategory(catName)
      setSelectedSubCategory(null)
      router.push(`/products?category=${catName}`, undefined, { shallow: true })
    }
    setCurrentPage(1)
  }

  const handleSubCategoryClick = (id: string | null) => {
    setSelectedSubCategory(id)
    setCurrentPage(1)
  }

  // Filter + sort
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      let match = true
      
      // Resolve category names for search and filtering
      const catObj = categories.find(c => c._id === (typeof product.category === 'string' ? product.category : product.category?._id))
      const mainCatOfProduct = catObj?.mainCategory || 'Navigation'
      const subCatOfProduct = catObj?.name || ''

      // 1. Text Search (checks title, main category, and subcategory)
      if (searchQuery) {
        const sq = searchQuery.toLowerCase()
        const matchesTitle = product.title?.toLowerCase().includes(sq)
        const matchesMainCat = mainCatOfProduct.toLowerCase().includes(sq)
        const matchesSubCat = subCatOfProduct.toLowerCase().includes(sq)
        
        if (!matchesTitle && !matchesMainCat && !matchesSubCat) {
          match = false
        }
      }

      // 2. Main Category Filter
      if (selectedMainCategory && mainCatOfProduct !== selectedMainCategory) {
        match = false
      }

      // 3. Sub Category Filter
      if (selectedSubCategory) {
        const categoryId = typeof product.category === 'string' ? product.category : product.category?._id
        if (categoryId !== selectedSubCategory) {
          match = false
        }
      }

      return match
    })

    return result
  }, [products, categories, selectedMainCategory, selectedSubCategory, searchQuery])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  )

  const activeSubCategories = selectedMainCategory
    ? categories.filter(c => (c.mainCategory || 'Navigation') === selectedMainCategory)
    : []

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const SIDEBAR_WIDTH = 260

  return (
    <>
      <SEO 
        title="Products Catalog"
        description="Browse our complete catalog of marine electronics, navigation aids, and communication systems from Alang Shipyard."
        canonicalUrl="/products"
      />

      <PageHero
        title="Products Catalog"
        subtitle="High-quality marine navigation, communication, and automation systems."
        image="/images/marine-radio.jpg"
        compact
      />

      <Box sx={{ backgroundColor: 'background.default', minHeight: '80vh', position: 'relative' }}>
        {/* Subtle background glow */}
        <Box sx={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100vw', height: '500px', background: 'radial-gradient(circle, #1E5FA61A 0%, rgba(245,247,250,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: { xs: 2.5, md: 4 } }}>
          <Box sx={{ display: 'flex', gap: { xs: 0, md: 4 } }}>

            {/* ─── DESKTOP SIDEBAR ─── */}
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                width: SIDEBAR_WIDTH,
                flexShrink: 0,
                position: 'sticky',
                top: 129,
                alignSelf: 'flex-start',
                maxHeight: 'calc(100vh - 140px)',
                overflowY: 'auto',
                pr: 1,
                // Custom scrollbar
                '&::-webkit-scrollbar': { width: 4 },
                '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 2 },
              }}
            >
              <Box sx={{
                p: 3, borderRadius: 1, bgcolor: 'common.white',
                border: '1px solid rgba(10,25,47,0.08)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                mb: 3
              }}>
                <FilterContent
                  categories={categories}
                  selectedMainCategory={selectedMainCategory}
                  selectedSubCategory={selectedSubCategory}
                  onMainCategoryClick={handleMainCategoryClick}
                  onSubCategoryClick={handleSubCategoryClick}
                />
              </Box>
            </Box>

            {/* ─── MAIN CONTENT ─── */}
            <Box sx={{ flex: 1, minWidth: 0 }}>

              {/* Top bar: Search + Sort + Mobile Filter Toggle */}
              <Box sx={{
                display: 'grid',
                gap: { xs: 1, sm: 2 },
                mb: { xs: 2, md: 3 },
                gridTemplateColumns: { xs: '44px minmax(0, 1fr)', md: 'minmax(0, 1fr)' },
                alignItems: 'center',
              }}>
                {/* Mobile filter button */}
                <IconButton
                  onClick={() => setMobileFilterOpen(true)}
                  sx={{
                    display: { xs: 'flex', md: 'none' },
                    bgcolor: 'common.white', border: '1px solid rgba(10,25,47,0.1)',
                    borderRadius: 1, width: { xs: 44, sm: 48 }, height: { xs: 44, sm: 48 },
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <FilterListIcon />
                </IconButton>

                {/* Search */}
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search equipment..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  size="small"
                  sx={{
                    gridColumn: { xs: '2 / 3', sm: '2 / 3', md: '1 / 2' },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'common.white',
                      borderRadius: 1,
                      color: 'text.primary',
                      border: '1px solid rgba(10,25,47,0.1)',
                      transition: 'all 0.3s',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      '& fieldset': { border: 'none' },
                      '&:hover': { border: '1px solid #1E5FA673' },
                      '&.Mui-focused': {
                        border: '1px solid', borderColor: 'primary.light',
                        boxShadow: '0 4px 16px #1E5FA61F',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      py: 1.5,
                      fontSize: '0.95rem',
                      '&::placeholder': { color: 'rgba(10,25,47,0.4)', opacity: 1 }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'primary.light', fontSize: 22, ml: 0.5 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Mobile active filters chips */}
              {selectedMainCategory && (
                <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Box sx={{
                    display: 'inline-flex', alignItems: 'center', gap: 0.5,
                    px: 2, py: 0.75, borderRadius: 50,
                    bgcolor: '#1E5FA61A', color: 'primary.main',
                    fontSize: '0.8rem', fontWeight: 600,
                  }}>
                    {selectedMainCategory}
                    {selectedSubCategory && ` / ${activeSubCategories.find(s => s._id === selectedSubCategory)?.name || ''}`}
                    <CloseIcon
                      sx={{ fontSize: 16, cursor: 'pointer', ml: 0.5 }}
                      onClick={() => { setSelectedMainCategory(null); setSelectedSubCategory(null); router.push('/products', undefined, { shallow: true }); setCurrentPage(1) }}
                    />
                  </Box>
                </Box>
              )}

              {/* Results count */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.9rem' }}>
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                  {totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
                </Typography>
              </Box>

              {/* Product Grid */}
              {paginatedProducts.length > 0 ? (
                <Grid container spacing={{ xs: 1.25, sm: 2, md: 3 }}>
                  {paginatedProducts.map((product) => (
                    <Grid item xs={6} sm={6} md={4} lg={3} key={product._id}>
                      <ProductCard product={product} tone="light" />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ py: 10, textAlign: 'center', bgcolor: 'common.white', border: '1px dashed rgba(10,25,47,0.15)', borderRadius: 1 }}>
                  <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    No products found matching your criteria.
                  </Typography>
                </Box>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{
                  display: 'flex', justifyContent: 'center', mt: 5, mb: 2,
                }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_, page) => {
                      setCurrentPage(page)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    color="primary"
                    size="large"
                    siblingCount={0}
                    boundaryCount={1}
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontWeight: 600,
                        fontSize: { xs: '0.82rem', md: '0.95rem' },
                        borderRadius: 1,
                        border: '1px solid rgba(10,25,47,0.08)',
                        mx: { xs: 0.1, md: 0.5 },
                        transition: 'all 0.2s',
                        '&.Mui-selected': {
                          bgcolor: 'primary.main',
                          color: 'common.white',
                          boxShadow: '0 4px 12px #1E5FA64D',
                          '&:hover': { bgcolor: 'primary.dark' },
                        },
                        '&:hover': {
                          bgcolor: '#1E5FA614',
                        }
                      }
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ─── MOBILE FILTER DRAWER ─── */}
      <Drawer
        anchor="left"
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: { xs: '86vw', sm: 320 },
            maxWidth: 340,
            pt: 2,
            px: 2,
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Filters</Typography>
          <IconButton onClick={() => setMobileFilterOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <FilterContent
          categories={categories}
          selectedMainCategory={selectedMainCategory}
          selectedSubCategory={selectedSubCategory}
          onMainCategoryClick={(name) => { handleMainCategoryClick(name) }}
          onSubCategoryClick={(id) => { handleSubCategoryClick(id); setMobileFilterOpen(false) }}
        />
      </Drawer>

      <CtaBand tone="dark" />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    await connectToDatabase()
    
    const [products, categories, brands] = await Promise.all([
      Product.find({}).populate('category', 'name').populate('brand', 'name').sort({ createdAt: -1 }).lean(),
      Category.find({}).sort({ name: 1 }).lean(),
      Brand.find({}).sort({ name: 1 }).lean(),
    ])
    
    const serializedProducts = JSON.parse(JSON.stringify(products))
    const serializedCategories = JSON.parse(JSON.stringify(categories))
    const serializedBrands = JSON.parse(JSON.stringify(brands))

    return {
      props: {
        products: serializedProducts || [],
        categories: serializedCategories || [],
        brands: serializedBrands || [],
      },
      revalidate: 60, // ISR: revalidate every 60 seconds
    }
  } catch (error) {
    console.error("Error fetching products catalog:", error)
    return {
      props: {
        products: [],
        categories: [],
        brands: [],
      },
      revalidate: 60,
    }
  }
}

ProductsPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>

export default ProductsPage
