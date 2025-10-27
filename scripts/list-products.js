import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function listProducts() {
  const dataPath = path.join(__dirname, '../src/data/products.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  console.log('\n=== قائمة المنتجات ===\n');

  if (data.products.length === 0) {
    console.log('❌ لا توجد منتجات');
    return;
  }

  data.products.forEach((product, index) => {
    const category = data.categories.find(c => c.id === product.category_id);
    console.log(`${index + 1}. ${product.name_ar} (${product.name})`);
    console.log(`   القسم: ${category?.name_ar || 'غير محدد'}`);
    console.log(`   السعر: ${product.price} جنيه`);
    console.log(`   الحالة: ${product.in_stock ? 'متوفر ✅' : 'غير متوفر ❌'}`);
    console.log('');
  });

  console.log(`إجمالي المنتجات: ${data.products.length}`);
}

listProducts();
