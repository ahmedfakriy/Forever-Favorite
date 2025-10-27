export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
}

const CART_KEY = 'forever_favorite_cart';

export function getSessionId(): string {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substring(2) + Date.now();
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}

function getCart(): CartItem[] {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export async function addToCart(productId: string): Promise<void> {
  const cart = getCart();
  const existingItem = cart.find(item => item.product_id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: 'cart_' + Date.now() + '_' + Math.random().toString(36).substring(2),
      product_id: productId,
      quantity: 1
    });
  }

  saveCart(cart);
}

export async function getCartItems(): Promise<CartItem[]> {
  return getCart();
}

export async function updateCartItemQuantity(itemId: string, quantity: number): Promise<void> {
  let cart = getCart();

  if (quantity <= 0) {
    cart = cart.filter(item => item.id !== itemId);
  } else {
    const item = cart.find(item => item.id === itemId);
    if (item) {
      item.quantity = quantity;
    }
  }

  saveCart(cart);
}

export async function removeFromCart(itemId: string): Promise<void> {
  const cart = getCart().filter(item => item.id !== itemId);
  saveCart(cart);
}

export async function clearCart(): Promise<void> {
  localStorage.removeItem(CART_KEY);
}
