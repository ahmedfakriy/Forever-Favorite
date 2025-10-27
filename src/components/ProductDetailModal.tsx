import { X, ShoppingCart, Check } from 'lucide-react';
import { Product } from '../lib/localData';
import { useState } from 'react';
import { addToCart } from '../lib/cartLocal';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onCartUpdate: () => void;
}

export default function ProductDetailModal({ product, onClose, onCartUpdate }: ProductDetailModalProps) {
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleAddToCart() {
    setLoading(true);
    await addToCart(product.id);
    setAdded(true);
    onCartUpdate();
    setLoading(false);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">{product.name_ar}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
              <img
                src={product.image_url}
                alt={product.name_ar}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{product.name_ar}</h3>
                <p className="text-lg text-gray-500">{product.name}</p>
              </div>

              {product.description && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">الوصف</h4>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              <div className="border-t border-b py-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">السعر</span>
                  <span className="text-3xl font-bold text-emerald-600">{product.price} جنيه</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-600">الحالة:</span>
                {product.in_stock ? (
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">متوفر</span>
                ) : (
                  <span className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">غير متوفر</span>
                )}
              </div>

              {product.in_stock && (
                <button
                  onClick={handleAddToCart}
                  disabled={loading || added}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                    added
                      ? 'bg-green-500 text-white'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-6 h-6" />
                      تم الإضافة للسلة
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-6 h-6" />
                      {loading ? 'جاري الإضافة...' : 'إضافة للسلة'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
