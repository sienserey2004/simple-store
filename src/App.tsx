import React, { useState } from 'react';
import { ShoppingCart, User, LogOut, Menu, X, Trash2, Plus, Minus, CreditCard, Package, CheckCircle } from 'lucide-react';

// Types
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface UserData {
  email: string;
  name: string;
}

// Mock products data
const mockProducts: Product[] = [
  { id: 1, name: "Wireless Headphones", price: 79.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", description: "Premium wireless headphones", category: "Electronics" },
  { id: 2, name: "Smart Watch", price: 199.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", description: "Fitness tracking smartwatch", category: "Electronics" },
  { id: 3, name: "Running Shoes", price: 89.99, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", description: "Comfortable running shoes", category: "Fashion" },
  { id: 4, name: "Coffee Maker", price: 49.99, image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400", description: "Automatic coffee maker", category: "Home" },
  { id: 5, name: "Backpack", price: 39.99, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", description: "Durable travel backpack", category: "Fashion" },
  { id: 6, name: "Desk Lamp", price: 29.99, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400", description: "LED desk lamp", category: "Home" },
  { id: 7, name: "Bluetooth Speaker", price: 59.99, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400", description: "Portable bluetooth speaker", category: "Electronics" },
  { id: 8, name: "Sunglasses", price: 24.99, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400", description: "UV protection sunglasses", category: "Fashion" },
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'login' | 'products' | 'cart' | 'checkout' | 'success'>('login');
  const [user, setUser] = useState<UserData | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Checkout state
  const [checkoutForm, setCheckoutForm] = useState({
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  // Login handler
  const handleLogin = () => {
    if (loginEmail && loginPassword) {
      const name = loginEmail.split('@')[0];
      setUser({ email: loginEmail, name });
      setCurrentPage('products');
      setLoginEmail('');
      setLoginPassword('');
    }
  };

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setCurrentPage('login');
    setMobileMenuOpen(false);
  };

  // Add to cart
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Update quantity
  const updateQuantity = (id: number, change: number) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
      )
    );
  };

  // Remove from cart
  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Calculate total
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Get categories
  const categories = ['All', ...Array.from(new Set(mockProducts.map(p => p.category)))];

  // Filter products
  const filteredProducts = selectedCategory === 'All'
    ? mockProducts
    : mockProducts.filter(p => p.category === selectedCategory);

  // Checkout handler
  const handleCheckout = () => {
    if (checkoutForm.fullName && checkoutForm.address && checkoutForm.city && 
        checkoutForm.zipCode && checkoutForm.cardNumber && checkoutForm.expiryDate && 
        checkoutForm.cvv) {
      setCurrentPage('success');
    }
  };

  // Header Component
  const Header = () => (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-xl sm:text-2xl font-bold text-gray-900">ShopHub</h1>
          </div>

          {/* Desktop Navigation */}
          {user && (
            <nav className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => setCurrentPage('products')}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Products
              </button>
              <button
                onClick={() => setCurrentPage('cart')}
                className="relative text-gray-700 hover:text-blue-600"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-700 hover:text-red-600"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </nav>
          )}

          {/* Mobile menu button */}
          {user && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          )}
        </div>

        {/* Mobile Navigation */}
        {user && mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <button
              onClick={() => {
                setCurrentPage('products');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Products
            </button>
            <button
              onClick={() => {
                setCurrentPage('cart');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <div className="px-4 py-2 text-gray-700">
              <User className="h-5 w-5 inline mr-2" />
              {user.name}
            </div>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded"
            >
              <LogOut className="h-5 w-5 inline mr-2" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );

  // Login Page
  const LoginPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <Package className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">Welcome to ShopHub</h2>
          <p className="text-gray-600 mt-2">Sign in to start shopping</p>
        </div>
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Sign In
          </button>
        </div>
        <p className="text-center text-sm text-gray-600 mt-6">
          Demo: Use any email and password
        </p>
      </div>
    </div>
  );

  // Products Page
  const ProductsPage = () => (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Products</h2>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Cart Page
  const CartPage = () => (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h2>
        
        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
            <button
              onClick={() => setCurrentPage('products')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md mb-6">
              {cart.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center p-4 border-b last:border-b-0 gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-blue-600 font-bold">${item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Subtotal:</span>
                <span className="text-2xl font-bold text-blue-600">${cartTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={() => setCurrentPage('checkout')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Checkout Page
  const CheckoutPage = () => (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={checkoutForm.fullName}
                    onChange={e => setCheckoutForm({...checkoutForm, fullName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={checkoutForm.address}
                    onChange={e => setCheckoutForm({...checkoutForm, address: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={checkoutForm.city}
                      onChange={e => setCheckoutForm({...checkoutForm, city: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      value={checkoutForm.zipCode}
                      onChange={e => setCheckoutForm({...checkoutForm, zipCode: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Payment Information</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={checkoutForm.cardNumber}
                    onChange={e => setCheckoutForm({...checkoutForm, cardNumber: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={checkoutForm.expiryDate}
                      onChange={e => setCheckoutForm({...checkoutForm, expiryDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      value={checkoutForm.cvv}
                      onChange={e => setCheckoutForm({...checkoutForm, cvv: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center space-x-2"
              >
                <CreditCard className="h-5 w-5" />
                <span>Complete Payment</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Success Page
  const SuccessPage = () => (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white rounded-lg shadow-md p-12">
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-2">Thank you for your order.</p>
          <p className="text-lg font-semibold text-blue-600 mb-8">Order Total: ${cartTotal.toFixed(2)}</p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setCart([]);
                setCurrentPage('products');
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage />;
      case 'products':
        return <ProductsPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'success':
        return <SuccessPage />;
      default:
        return <LoginPage />;
    }
  };

  return <div className="font-sans">{renderPage()}</div>;
};

export default App;