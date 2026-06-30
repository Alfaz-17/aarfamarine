const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeProductDetail(url) {
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(res.data);
    
    const title = $('h1, h2.product-title, .title').first().text().trim();
    const description = $('.description, #description, .details').first().text().trim();
    
    const specifications = [];
    $('table tr, ul li').each((i, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 5) {
        specifications.push(text);
      }
    });
    
    const images = [];
    $('img').each((i, el) => {
      const src = $(el).attr('src');
      if (src && (src.includes('product') || src.includes('upload'))) {
        images.push(src);
      }
    });
    
    console.log("Product Title:", title);
    console.log("Images:", images);
    console.log("Specs sample:", specifications.slice(0, 5));
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

scrapeProductDetail('https://aarfamarine.com/detail/navigation/gyro-compass/pgm-c-009');
