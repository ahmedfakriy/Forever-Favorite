import { supabase } from './supabase';

export interface CartItem {
  id: string;
  session_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
}

export function getSessionId(): string {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substring(2) + Date.now();
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}

export async function addToCart(productId: string): Promise<void> {
  const sessionId = getSessionId();

  const { data: existing } = await supabase
    .from('cart_items')
    .select('*')
    .eq('session_id', sessionId)
    .eq('product_id', productId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + 1 })
      .eq('id', existing.id);
  } else {
    await supabase
      .from('cart_items')
      .insert([{ session_id: sessionId, product_id: productId, quantity: 1 }]);
  }
}

export async function getCartItems(): Promise<CartItem[]> {
  const sessionId = getSessionId();
  const { data } = await supabase
    .from('cart_items')
    .select('*')
    .eq('session_id', sessionId);

  return data || [];
}

export async function updateCartItemQuantity(itemId: string, quantity: number): Promise<void> {
  if (quantity <= 0) {
    await supabase.from('cart_items').delete().eq('id', itemId);
  } else {
    await supabase.from('cart_items').update({ quantity }).eq('id', itemId);
  }
}

export async function removeFromCart(itemId: string): Promise<void> {
  await supabase.from('cart_items').delete().eq('id', itemId);
}

export async function clearCart(): Promise<void> {
  const sessionId = getSessionId();
  await supabase.from('cart_items').delete().eq('session_id', sessionId);
}
