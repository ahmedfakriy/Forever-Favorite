/*
  # إضافة نظام المصادقة وعربة التسوق

  1. الجداول الجديدة
    - `cart_items` - عناصر السلة
      - `id` (uuid, primary key)
      - `session_id` (text) - معرف الجلسة
      - `product_id` (uuid) - معرف المنتج
      - `quantity` (integer) - الكمية
      - `created_at` (timestamp)
    
    - `settings` - إعدادات الموقع
      - `id` (uuid, primary key)
      - `key` (text) - المفتاح
      - `value` (text) - القيمة
      - `created_at` (timestamp)

  2. الأمان
    - تفعيل RLS على الجداول
    - السماح للجميع بإدارة السلة
    - حماية صفحة الإدارة بكلمة مرور
*/

-- Create cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Cart items policies
CREATE POLICY "Anyone can view cart items"
  ON cart_items FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert cart items"
  ON cart_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update cart items"
  ON cart_items FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete cart items"
  ON cart_items FOR DELETE
  TO anon, authenticated
  USING (true);

-- Settings policies
CREATE POLICY "Anyone can view settings"
  ON settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert settings"
  ON settings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update settings"
  ON settings FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('admin_password', 'admin123'),
  ('whatsapp_number', '201234567890'),
  ('store_name', 'Forever Favorite'),
  ('store_description', 'متجرك المفضل للإكسسوارات'),
  ('facebook_url', 'https://facebook.com'),
  ('instagram_url', 'https://instagram.com')
ON CONFLICT (key) DO NOTHING;