export default function HeroSection() {
  return (
    <div className="relative h-96 overflow-hidden rounded-2xl mb-8 shadow-xl">
      <img
        src="/WhatsApp Image 2025-10-26 at 8.29.40 PM (1).jpeg"
        alt="Forever Favorite Store"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
        <div className="px-8 text-white max-w-2xl">
          <h1 className="text-5xl font-bold mb-4">Forever Favorite</h1>
          <p className="text-xl mb-6">متجرك المفضل للإكسسوارات والمنتجات المميزة</p>
          <p className="text-lg">أحدث المنتجات بأفضل الأسعار</p>
        </div>
      </div>
    </div>
  );
}
