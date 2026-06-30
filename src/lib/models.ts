import mongoose, { Schema, model, models, Model } from 'mongoose'

// ── User (Admin accounts) ──
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true })

export const User: Model<any> = models.User || model('User', UserSchema)

// ── Category ──
const CategorySchema = new Schema({
  name: { type: String, required: true },
  mainCategory: { type: String, enum: ['Navigation', 'Automation', 'Communication'], required: true, default: 'Navigation' },
  slug: { type: String, unique: true, sparse: true },
  description: { type: String },
  image: { type: String },
}, { timestamps: true })

export const Category: Model<any> = models.Category || model('Category', CategorySchema)

// ── Product ──
const ProductSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
  metaTitle: { type: String },
  metaDescription: { type: String },
  description: { type: String },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
  brandName: { type: String },
  specifications: { type: Schema.Types.Mixed },
  keywords: [{ type: String }],
  sku: { type: String },
  price: { type: Number, default: 0 },
  availability: { type: String, enum: ['in-stock', 'out-of-stock', 'on-demand'], default: 'in-stock' },
  image: { type: String },
  images: [{ type: String }],
  featured: { type: Boolean, default: false },
  reviews: [{ userName: String, rating: Number, comment: String, date: Date, isVerified: Boolean }],
  questions: [{ question: String, answer: String, userName: String, date: Date }]
}, { timestamps: true })

// Performance optimization indexes
ProductSchema.index({ title: 'text', description: 'text' }, { weights: { title: 10, description: 1 } })
ProductSchema.index({ category: 1 })
ProductSchema.index({ brand: 1 })
ProductSchema.index({ featured: 1 })

export const Product: Model<any> = models.Product || model('Product', ProductSchema)

// ── Brand ──
const BrandSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String },
  description: { type: String },
}, { timestamps: true })

export const Brand: Model<any> = models.Brand || model('Brand', BrandSchema)

// ── Order / Inquiry ──
const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  productTitle: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
})

const OrderSchema = new Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String },
  company: { type: String },
  message: { type: String },
  items: [OrderItemSchema],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  notes: { type: String },
}, { timestamps: true })

export const Order: Model<any> = models.Order || model('Order', OrderSchema)

// ── Service & Installation ──
const ServiceSchema = new Schema({
  name: { type: String, required: true },
  img: { type: String },
  dec: { type: String },
  featured: { type: Boolean, default: false }
}, { timestamps: true })

export const Service: Model<any> = models.Service || model('Service', ServiceSchema)

// ── Settings ──
const SettingsSchema = new Schema({
  siteName: { type: String, default: 'Aarfa Marine' },
  siteDescription: { type: String, default: 'Marine & Industrial Suppliers' },
  contactEmail: { type: String },
  contactPhone: { type: String },
  address: { type: String },
  geminiApiKey: { type: String },
  autoBackgroundRemoval: { type: Boolean, default: false },
  applyWatermark: { type: Boolean, default: true },
  watermarkText: { type: String, default: 'Aarfa Marine Solutions' },
}, { timestamps: true })

export const Settings: Model<any> = models.Settings || model('Settings', SettingsSchema)

// ── Inquiry ──
const InquirySchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  message: { type: String, required: true },
  source: { type: String },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' }
}, { timestamps: true })

export const Inquiry: Model<any> = models.Inquiry || model('Inquiry', InquirySchema)
