require('dotenv').config({path: '.env'});
const mongoose = require('mongoose');

async function fixCategories() {
  await mongoose.connect(process.env.DB_URI);
  const db = mongoose.connection.db;
  const cats = await db.collection('categories').find({name: 'Read More'}).toArray();
  let count = 0;
  for(let c of cats) {
    if(c.slug) {
      const fixedName = c.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      await db.collection('categories').updateOne({_id: c._id}, {$set: {name: fixedName}});
      count++;
    }
  }
  console.log('Fixed ' + count + ' categories');
  process.exit(0);
}

fixCategories().catch(console.error);
