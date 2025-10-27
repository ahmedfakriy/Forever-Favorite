/*
  # متجر إلكتروني للإكسسوارات - Forever Favorite

  1. الجداول الجديدة
    - `categories` - أقسام المنتجات
      - `id` (uuid, primary key)
      - `name` (text) - اسم القسم
      - `name_ar` (text) - الاسم بالعربية
      - `icon` (text) - أيقونة القسم
      - `created_at` (timestamp)
    
    - `products` - المنتجات
      - `id` (uuid, primary key)
      - `name` (text) - اسم المنتج
      - `name_ar` (text) - الاسم بالعربية
      - `description` (text) - الوصف
      - `price` (numeric) - السعر
      - `image_url` (text) - رابط الصورة
      - `category_id` (uuid) - معرف القسم
      - `in_stock` (boolean) - متوفر أم لا
      - `created_at` (timestamp)

  2. الأمان
    - تفعيل RLS على جميع الجداول
    - السماح للجميع بقراءة المنتجات والأقسام
    - السماح بإضافة وتعديل وحذف المنتجات (للإدارة)
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_ar text NOT NULL,
  icon text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_ar text NOT NULL,
  description text DEFAULT '',
  price numeric NOT NULL CHECK (price >= 0),
  image_url text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  in_stock boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read access)
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert categories"
  ON categories FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update categories"
  ON categories FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete categories"
  ON categories FOR DELETE
  TO anon, authenticated
  USING (true);

-- Products policies (public read access)
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert products"
  ON products FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update products"
  ON products FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete products"
  ON products FOR DELETE
  TO anon, authenticated
  USING (true);

-- Insert categories
INSERT INTO categories (name, name_ar, icon) VALUES
  ('Headphones', 'سماعات', 'Headphones'),
  ('Watches', 'ساعات', 'Watch'),
  ('Women Fashion', 'ملابس حريمي', 'ShoppingBag'),
  ('Kids Fashion', 'أطفال', 'Baby'),
  ('Phone Cases', 'جرابات', 'Smartphone'),
  ('Screen Protectors', 'اسكرينات', 'Tablet'),
  ('Computer Accessories', 'مستلزمات كومبيوتر', 'Monitor'),
  ('Satellite Accessories', 'مستلزمات دش', 'Satellite'),
  ('Perfumes', 'برفان', 'Sparkles')
ON CONFLICT DO NOTHING;