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

async function deleteProduct() {
  const dataPath = path.join(__dirname, '../src/data/products.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  console.log('\n=== حذف منتج ===\n');

  if (data.products.length === 0) {
    console.log('❌ لا توجد منتجات للحذف!');
    rl.close();
    return;
  }

  console.log('المنتجات الموجودة:');
  data.products.forEach((product, index) => {
    console.log(`${index + 1}. ${product.name_ar} - ${product.price} جنيه`);
  });

  const productIndex = parseInt(await question('\nاختر رقم المنتج للحذف: ')) - 1;

  if (productIndex < 0 || productIndex >= data.products.length) {
    console.log('❌ رقم غير صحيح!');
    rl.close();
    return;
  }

  const deletedProduct = data.products[productIndex];
  const confirm = await question(`هل أنت متأكد من حذف "${deletedProduct.name_ar}"؟ (y/n): `);

  if (confirm.toLowerCase() === 'y') {
    data.products.splice(productIndex, 1);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    console.log('\n✅ تم حذف المنتج بنجاح!');
  } else {
    console.log('\n❌ تم إلغاء العملية');
  }

  rl.close();
}

deleteProduct().catch(console.error);
