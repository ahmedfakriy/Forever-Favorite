import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function addProduct() {
  const dataPath = path.join(__dirname, '../src/data/products.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  console.log('\n=== إضافة منتج جديد ===\n');

  console.log('الأقسام المتاحة:');
  data.categories.forEach((cat, index) => {
    console.log(`${index + 1}. ${cat.name_ar} (${cat.name})`);
  });

  const categoryIndex = parseInt(await question('\nاختر رقم القسم: ')) - 1;
  const category = data.categories[categoryIndex];

  if (!category) {
    console.log('❌ قسم غير صحيح!');
    rl.close();
    return;
  }

  const nameAr = await question('الاسم بالعربي: ');
  const nameEn = await question('الاسم بالإنجليزي: ');
  const price = parseFloat(await question('السعر: '));
  const imageUrl = await question('رابط الصورة: ');
  const description = await question('الوصف (اختياري): ');
  const inStock = (await question('متوفر؟ (y/n): ')).toLowerCase() === 'y';

  const newProduct = {
    id: `prod-${Date.now()}`,
    name: nameEn,
    name_ar: nameAr,
    description: description || '',
    price: price,
    image_url: imageUrl,
    category_id: category.id,
    in_stock: inStock
  };

  data.products.push(newProduct);

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');

  console.log('\n✅ تم إضافة المنتج بنجاح!');
  console.log('المنتج:', newProduct);

  rl.close();
}

addProduct().catch(console.error);
