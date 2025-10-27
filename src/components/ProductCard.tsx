import { Product } from '../lib/supabase';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image_url}
          alt={product.name_ar}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name_ar}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.name}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-emerald-600">{product.price} جنيه</span>
          {product.in_stock ? (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">متوفر</span>
          ) : (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">غير متوفر</span>
          )}
        </div>
      </div>
    </div>
  );
}
