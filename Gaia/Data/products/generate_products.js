// generate_products.js
// Run with: node generate_products.js
// Generates placeholder product pages under Gaia/Data/products/page-*.json
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '.');
const total = 1000;
const pageSize = 200;
const pages = Math.ceil(total / pageSize);
const categories = ['GLAMUR','MODA','MI DINASTIA'];
const brands = ['ORIONIX','LUXEA','NEXUS LAB','ATELIER'];

function slugify(s){return String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');}

for(let p=1;p<=pages;p++){
  const items = [];
  const start = (p-1)*pageSize + 1;
  const end = Math.min(p*pageSize, total);
  for(let i=start;i<=end;i++){
    const category = categories[i % categories.length];
    const brand = brands[i % brands.length];
    const title = `Producto Demo ${String(i).padStart(4,'0')}`;
    const id = `demo-${String(i).padStart(4,'0')}`;
    const sku = `DEM-${String(i).padStart(4,'0')}`;
    const price = Number((9.99 + i * 2.5).toFixed(2));
    const stock = (i * 7) % 51;
    const rating = Number((3 + (i % 20) / 20 * 2).toFixed(2));
    const featured = (i % 50) === 0;
    const image = `https://picsum.photos/seed/demo${i}/800/600`;
    const gallery = [image, `https://picsum.photos/seed/demo${i}-1/800/600`, `https://picsum.photos/seed/demo${i}-2/800/600`];
    const slug = slugify(title + '-' + id);
    items.push({
      id,id_sku:sku,sku,title,slug,category,brand,price,currency:'EUR',image,gallery,short_description:`Versión demo del ${title} — imagen placeholder.`,description:`Descripción de producto demo ${i}. Este producto es de prueba y marcado como demo. No es vendible hasta que se reemplace con datos reales.`,availability:'demo',stock,tags:['demo','placeholder',category.toLowerCase()],featured,rating, url:`/ciudadela/producto.html?id=${slug}`,buy_url:null,buyable:false,demo:true
    });
  }
  const outPath = path.join(OUT, `page-${p}.json`);
  fs.writeFileSync(outPath, JSON.stringify(items, null, 2), 'utf8');
  console.log('Wrote', outPath, items.length);
}

// meta
const meta = { total: total, pageSize: pageSize, pages: pages, generated_at: new Date().toISOString(), note: 'Placeholder demo products. Run generate_products.js to reproduce locally.' };
fs.writeFileSync(path.join(OUT,'meta.json'), JSON.stringify(meta, null, 2), 'utf8');
console.log('Generated meta.json');
