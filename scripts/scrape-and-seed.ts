import mongoose from 'mongoose';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { Category, Product } from '../src/lib/models';

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const DB_URI = process.env.DB_URI;
if (!DB_URI) {
  throw new Error('DB_URI not found in .env');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const BASE_URL = 'https://aarfamarine.com';

const axiosInstance = axios.create({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
  }
});

async function uploadToCloudinary(imageUrl: string): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'aarfamarine_products',
    });
    return result.secure_url;
  } catch (err: any) {
    console.error(`Failed to upload ${imageUrl} to Cloudinary: ${err.message}`);
    return imageUrl; // fallback to original
  }
}

async function scrapeMainCategory(mainCatSlug: string, mainCategoryName: string) {
  console.log(`Scraping main category: ${mainCategoryName}`);
  const url = `${BASE_URL}/sub-category/${mainCatSlug}`;
  try {
    const res = await axiosInstance.get(url);
    const $ = cheerio.load(res.data);

    // Find all subcategories (which map to our `Category` model)
    const subCategories: { name: string; slug: string; href: string }[] = [];
    $('.shop-wrap a, .product-card a, .single-product a, .item a, .grid a, a').each((_, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      
      // Look for links that point to 'products/<mainCatSlug>/<subCatSlug>'
      if (href && href.startsWith(`products/${mainCatSlug}/`) && text) {
        const parts = href.split('/');
        if (parts.length >= 3) {
          const subCatSlug = parts[2];
          subCategories.push({ name: text, slug: subCatSlug, href });
        }
      }
    });

    // De-duplicate subcategories by slug
    const uniqueSubCategories = Array.from(new Map(subCategories.map(item => [item.slug, item])).values());
    console.log(`Found ${uniqueSubCategories.length} subcategories for ${mainCategoryName}`);

    for (const subCat of uniqueSubCategories) {
      // 1. Create the Category in DB
      let category = await Category.findOne({ slug: subCat.slug });
      if (!category) {
        category = new Category({
          name: subCat.name,
          slug: subCat.slug,
          mainCategory: mainCategoryName
        });
        await category.save();
        console.log(`  Created category: ${subCat.name}`);
      }

      // 2. Scrape the subcategory page for products
      await scrapeSubCategoryProducts(subCat.href, category._id);
    }
  } catch (err: any) {
    console.error(`Error scraping main category ${mainCatSlug}:`, err.message);
  }
}

async function scrapeSubCategoryProducts(subCatHref: string, categoryId: any) {
  const url = `${BASE_URL}/${subCatHref}`;
  console.log(`  Scraping product list at ${url}`);
  try {
    const res = await axiosInstance.get(url);
    const $ = cheerio.load(res.data);

    const productLinks: string[] = [];
    $('.shop-wrap a, .product-card a, .single-product a, .item a, .grid a, a').each((_, el) => {
      const href = $(el).attr('href');
      // Product detail pages usually start with 'detail/'
      if (href && href.startsWith('detail/')) {
        productLinks.push(href);
      }
    });

    const uniqueProductLinks = Array.from(new Set(productLinks));
    console.log(`    Found ${uniqueProductLinks.length} products`);

    for (const link of uniqueProductLinks) {
      await scrapeProductDetail(link, categoryId);
    }
  } catch (err: any) {
    console.error(`Error scraping subcategory products ${url}:`, err.message);
  }
}

async function scrapeProductDetail(productHref: string, categoryId: any) {
  const url = `${BASE_URL}/${productHref}`;
  console.log(`    Scraping product: ${url}`);
  try {
    const res = await axiosInstance.get(url);
    const $ = cheerio.load(res.data);

    const title = $('h1, h2.product-title, .title').first().text().trim();
    if (!title) return; // Skip if no title found

    const slugParts = productHref.split('/');
    const slug = slugParts[slugParts.length - 1];

    const description = $('.description, #description, .details').first().text().trim();

    // Parse specifications
    let specificationsHtml = '';
    const specsElement = $('.specifications, table, .table-responsive');
    if (specsElement.length > 0) {
      specificationsHtml = specsElement.html() || '';
    }

    const rawImageUrls: string[] = [];
    $('img').each((_, el) => {
      const src = $(el).attr('src');
      if (src && (src.includes('product') || src.includes('upload'))) {
        // Handle relative URLs
        let absoluteSrc = src;
        if (!src.startsWith('http')) {
          absoluteSrc = src.startsWith('/') ? `${BASE_URL}${src}` : `${BASE_URL}/${src}`;
        }
        rawImageUrls.push(absoluteSrc);
      }
    });

    const uniqueRawImageUrls = Array.from(new Set(rawImageUrls));
    
    // Upload images to Cloudinary
    const cloudinaryImageUrls: string[] = [];
    for (const imgUrl of uniqueRawImageUrls) {
      const secureUrl = await uploadToCloudinary(imgUrl);
      cloudinaryImageUrls.push(secureUrl);
    }

    const mainImage = cloudinaryImageUrls.length > 0 ? cloudinaryImageUrls[0] : '';

    // Upsert or insert Product
    let product = await Product.findOne({ slug });
    if (!product) {
      product = new Product({
        title,
        slug,
        description,
        specifications: specificationsHtml,
        category: categoryId,
        image: mainImage,
        images: cloudinaryImageUrls,
        availability: 'in-stock'
      });
      await product.save();
      console.log(`      Saved product: ${title}`);
    } else {
      console.log(`      Product already exists: ${title}`);
    }

  } catch (err: any) {
    console.error(`Error scraping product detail ${url}:`, err.message);
  }
}

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(DB_URI as string);
  console.log('Connected to DB.');

  console.log('Dropping existing Category and Product collections...');
  try {
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Collections cleared.');
  } catch (e: any) {
    console.warn('Could not delete collections:', e.message);
  }

  const mainCategories = [
    { slug: 'navigation', name: 'Navigation' },
    { slug: 'automation', name: 'Automation' },
    { slug: 'communication', name: 'Communication' }
  ];

  for (const cat of mainCategories) {
    await scrapeMainCategory(cat.slug, cat.name);
  }

  console.log('Scraping completed.');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(console.error);
