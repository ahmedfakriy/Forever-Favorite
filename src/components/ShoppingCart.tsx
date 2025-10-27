import { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, MessageCircle } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';
import { getCartItems, updateCartItemQuantity, removeFromCart, clearCart } from '../lib/cart';

interface ShoppingCartProps {
  onClose: () => void;
  cartCount: number;
  onCartUpdate: () => void;
}

interface CartItemWithProduct {
  id: string;
  quantity: number;
  product: Product;
}

export default function ShoppingCart({ onClose, cartCount, onCartUpdate }: ShoppingCartProps) {
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCartItems();
  }, [cartCount]);

  async function loadCartItems() {
    setLoading(true);
    const cartItems = await getCartItems();

    const itemsWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        const { data: product } = await supabase
          .from('products')
          .select('*')
          .eq('id', item.product_id)
          .single();

        return {
          id: item.id,
          quantity: item.quantity,
          product: product as Product,
        };
      })
    );

    setItems(itemsWithProducts.filter(item => item.product));
    setLoading(false);
  }

  async function handleUpdateQuantity(itemId: string, quantity: number) {
    await updateCartItemQuantity(itemId, quantity);
    onCartUpdate();
    loadCartItems();
  }

  async function handleRemove(itemId: string) {
    await removeFromCart(itemId);
    onCartUpdate();
    loadCartItems();
  }

  async function handleCheckout() {
    if (items.length === 0) return;

    const message = items.map((item) =>
      `${item.product.name_ar} - الكمية: ${item.quantity} - السعر: ${item.product.price * item.quantity} جنيه`
    ).join('\n');

    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const whatsappMessage = `مرحبا، أريد طلب المنتجات التالية:\n\n${message}\n\nالإجمالي: ${total.toFixed(2)} جنيه\n\nالدفع عند الاستلام`;

    const whatsappNumber = '201234567890';
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(url, '_blank');

    await clearCart();
    onCartUpdate();
    onClose();
  }

  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="bg-emerald-600 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">سلة التسوق</h2>
          <button onClick={onClose} className="p-2 hover:bg-emerald-700 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">السلة فارغة</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-gray-50 p-4 rounded-xl">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name_ar}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{item.product.name_ar}</h3>
                    <p className="text-sm text-gray-500">{item.product.name}</p>
                    <p className="text-emerald-600 font-bold mt-1">{item.product.price} جنيه</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 bg-white rounded-lg border">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-gray-800">الإجمالي</span>
              <span className="text-2xl font-bold text-emerald-600">{total.toFixed(2)} جنيه</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-3"
            >
              <MessageCircle className="w-6 h-6" />
              إتمام الطلب عبر واتساب
            </button>
            <p className="text-center text-sm text-gray-500 mt-3">الدفع عند الاستلام</p>
          </div>
        )}
      </div>
    </div>
  );
}
