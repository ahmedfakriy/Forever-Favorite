import { useState, useEffect } from 'react';
import { Product, Category, getProducts, getCategories } from '../lib/localData';
import ProductCard from './ProductCard';
import CategoryFilter from './CategoryFilter';
import HeroSection from './HeroSection';
import Footer from './Footer';
import ProductDetailModal from './ProductDetailModal';
import ShoppingCart from './ShoppingCart';
import { Store, ShoppingBag } from 'lucide-react';
import { getCartItems } from '../lib/cartLocal';

interface StoreFrontProps {
  onOpenAdmin: () => void;
}

export default function StoreFront({ onOpenAdmin }: StoreFrontProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    loadData();
    loadCartCount();
  }, []);

  async function loadData() {
    setLoading(true);
    const [categoriesResult, productsResult] = await Promise.all([
      getCategories(),
      getProducts()
    ]);

    setCategories(categoriesResult);
    setProducts(productsResult);
    setLoading(false);
  }

  async function loadCartCount() {
    const items = await getCartItems();
    const total = items.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(total);
  }

  function handleProductClick(product: Product) {
    setSelectedProduct(product);
  }

  function handleCartUpdate() {
    loadCartCount();
  }

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category_id === selectedCategory)
    : products;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Store className="w-5 h-5" />
              <span className="hidden sm:inline">الإدارة</span>
            </button>
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-gray-800">Forever Favorite</h1>
              <p className="text-sm text-gray-500">متجرك المفضل للإكسسوارات</p>
            </div>
            <button
              onClick={() => setShowCart(true)}
              className="relative flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-1">
        <HeroSection />

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">لا توجد منتجات في هذا القسم</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} onClick={() => handleProductClick(product)} className="cursor-pointer">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onCartUpdate={handleCartUpdate}
        />
      )}

      {showCart && (
        <ShoppingCart
          onClose={() => setShowCart(false)}
          cartCount={cartCount}
          onCartUpdate={handleCartUpdate}
        />
      )}
    </div>
  );
}
