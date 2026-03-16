export const endpoints = {
  auth: {
    signup: '/api/v1/auth/signup',
    signin: '/api/v1/auth/signin',
  },
  products: {
    all: '/api/v1/products',
    one: (id) => `/api/v1/products/${id}`,
  },
  categories: {
    all: '/api/v1/categories',
  },
  brands: {
    all: '/api/v1/brands',
  },
  cart: {
    base: '/api/v1/cart',
    item: (productId) => `/api/v1/cart/${productId}`,
  },
  orders: {
    checkoutSession: (cartId) => `/api/v1/orders/checkout-session/${cartId}`,
    cashOrder: (cartId) => `/api/v1/orders/${cartId}`,
    userOrders: (userId) => `/api/v1/orders/user/${userId}`,
  },
  wishlist: {
    base: '/api/v1/wishlist',
    item: (productId) => `/api/v1/wishlist/${productId}`,
  }
}
