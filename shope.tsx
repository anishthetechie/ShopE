import React, { useEffect, useMemo, useState } from "react";
import { ShoppingCart, Search, User, Star, Trash2, LogOut, Plus, Minus, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const DEMO_PRODUCTS = [
  {
    id: 1,
    name: "Wireless Noise-Canceling Headphones",
    price: 129.99,
    rating: 4.6,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    description: "Immersive sound, deep bass, and all-day comfort.",
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 89.99,
    rating: 4.4,
    category: "Wearables",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    description: "Track workouts, heart rate, sleep, and notifications.",
  },
  {
    id: 3,
    name: "Minimal Desk Lamp",
    price: 34.99,
    rating: 4.3,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    description: "Warm lighting and a clean modern design for your setup.",
  },
  {
    id: 4,
    name: "Portable Bluetooth Speaker",
    price: 49.99,
    rating: 4.7,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=900&q=80",
    description: "Compact body, powerful sound, and excellent battery life.",
  },
  {
    id: 5,
    name: "Everyday Backpack",
    price: 59.99,
    rating: 4.5,
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    description: "Lightweight, durable, and perfect for school or travel.",
  },
  {
    id: 6,
    name: "Ceramic Coffee Mug Set",
    price: 24.99,
    rating: 4.2,
    category: "Kitchen",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80",
    description: "A cozy mug set for daily coffee or tea rituals.",
  },
];

const CATEGORIES = ["All", "Electronics", "Wearables", "Home", "Fashion", "Kitchen"];

function Stars({ rating }) {
  const full = Math.round(rating);
  return (
    <div className="flex items-center gap-1 text-amber-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < full ? "fill-current" : ""}`} />
      ))}
      <span className="ml-1 text-sm text-slate-600">{rating}</span>
    </div>
  );
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function AmazonLikeStoreDemo() {
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("demo_store_user");
    const savedCart = localStorage.getItem("demo_store_cart");
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("demo_store_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("demo_store_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("demo_store_user");
    }
  }, [user]);

  const filteredProducts = useMemo(() => {
    return DEMO_PRODUCTS.filter((product) => {
      const matchesQuery =
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [query, selectedCategory]);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) return;
    const loggedInUser = { email: loginForm.email, name: loginForm.email.split("@")[0] };
    setUser(loggedInUser);
    setLoginForm({ email: "", password: "" });
  };

  const handleLogout = () => {
    setUser(null);
    setIsCartOpen(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 p-6 md:p-10">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col justify-center"
          >
            <Badge className="mb-4 w-fit rounded-full px-4 py-1 text-sm">Marketplace Demo</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
              An Amazon-style storefront demo with login and cart.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              This is a functional e-commerce front end with a login page, searchable products,
              category filters, add-to-cart behavior, quantity controls, and persistent cart state.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Email login demo",
                "Product cards",
                "Shopping cart drawer",
                "Local storage persistence",
              ].map((item) => (
                <div key={item} className="rounded-2xl border bg-white p-4 text-sm shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="rounded-3xl border-0 bg-white shadow-2xl">
              <CardContent className="p-8">
                <div className="mb-8 flex items-center gap-3">
                  <div className="rounded-2xl bg-slate-900 p-3 text-white">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">Sign in</h2>
                    <p className="text-sm text-slate-500">Enter any email and password to continue</p>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                    <Input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                    <Input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter password"
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <Button type="submit" className="h-12 w-full rounded-xl text-base font-medium">
                    <User className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </form>

                <p className="mt-4 text-xs leading-5 text-slate-500">
                  Demo note: this prototype uses front-end-only authentication for showcase purposes.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b bg-slate-950 text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 md:px-6">
          <div className="text-2xl font-bold tracking-tight">ShopClone</div>

          <div className="relative hidden flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="h-11 rounded-xl border-0 bg-white pl-10 text-slate-900"
            />
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div className="hidden text-right md:block">
              <p className="text-xs text-slate-300">Hello, {user.name}</p>
              <p className="text-sm font-semibold">Account</p>
            </div>
            <Button
              variant="secondary"
              className="rounded-xl"
              onClick={() => setIsCartOpen((prev) => !prev)}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart ({cartCount})
            </Button>
            <Button variant="outline" className="rounded-xl border-slate-700 bg-transparent text-white hover:bg-slate-800 hover:text-white" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-4 md:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="h-11 rounded-xl border-0 bg-white pl-10 text-slate-900"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <section className="mb-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-8 text-white shadow-xl">
          <h1 className="text-3xl font-bold md:text-5xl">Discover deals across categories</h1>
          <p className="mt-3 max-w-2xl text-slate-200">
            Browse curated demo products, add items to your cart, and test the shopping flow.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === category
                    ? "bg-white text-slate-900"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Products</h2>
              <p className="text-sm text-slate-500">{filteredProducts.length} item(s) found</p>
            </div>
            <Badge className="rounded-full px-4 py-1 text-sm">Subtotal: {formatPrice(subtotal)}</Badge>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="overflow-hidden rounded-3xl border-0 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="p-5">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <Badge variant="secondary" className="rounded-full">{product.category}</Badge>
                      <Stars rating={product.rating} />
                    </div>
                    <h3 className="text-lg font-semibold leading-6">{product.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{product.description}</p>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <div className="text-2xl font-bold">{formatPrice(product.price)}</div>
                      <Button className="rounded-xl" onClick={() => addToCart(product)}>
                        Add to cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.aside
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b p-5">
                <div>
                  <h3 className="text-xl font-semibold">Your cart</h3>
                  <p className="text-sm text-slate-500">{cartCount} total item(s)</p>
                </div>
                <Button variant="ghost" onClick={() => setIsCartOpen(false)}>Close</Button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                {cart.length === 0 ? (
                  <div className="rounded-3xl border border-dashed p-8 text-center text-slate-500">
                    Your cart is empty.
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="rounded-2xl border p-4 shadow-sm">
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-20 w-20 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="line-clamp-2 font-medium">{item.name}</h4>
                              <p className="mt-1 text-sm text-slate-500">{formatPrice(item.price)} each</p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="rounded-lg border p-2 hover:bg-slate-50"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="min-w-8 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="rounded-lg border p-2 hover:bg-slate-50"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="font-semibold">{formatPrice(item.price * item.quantity)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t p-5">
                <div className="mb-4 flex items-center justify-between text-lg font-semibold">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <Button className="h-12 w-full rounded-xl text-base">Proceed to checkout</Button>
                <p className="mt-3 text-center text-xs text-slate-500">
                  Demo only — checkout flow can be added next.
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
