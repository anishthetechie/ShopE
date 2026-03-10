import { useEffect, useMemo, useState } from "react";

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 129.99,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    description: "Immersive sound, deep bass, and long battery life.",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 89.99,
    category: "Wearables",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    description: "Track workouts, sleep, and notifications with ease.",
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    price: 49.99,
    category: "Audio",
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80",
    description: "Portable design with clear sound and strong bass.",
  },
  {
    id: 4,
    name: "Laptop Backpack",
    price: 59.99,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=900&q=80",
    description: "Spacious, lightweight, and perfect for daily use.",
  },
];

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("shopclone_user");
    const savedCart = localStorage.getItem("shopclone_cart");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("shopclone_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("shopclone_user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("shopclone_cart", JSON.stringify(cart));
  }, [cart]);

  function login(e) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) return;

    const namePart = email.split("@")[0];
    const displayName =
      namePart.charAt(0).toUpperCase() + namePart.slice(1).toLowerCase();

    setUser({
      email,
      name: displayName,
    });

    setEmail("");
    setPassword("");
  }

  function logout() {
    setUser(null);
    setCartOpen(false);
  }

  function addToCart(product) {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);

      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });

    setCartOpen(true);
  }

  function increaseQty(id) {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  }

  function decreaseQty(id) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

if (!user) {
  return (
    <div className="login-page">
      <div className="login-scene">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>

        <div className="floating-card package-card">
          <div className="package-lid"></div>
          <div className="package-body"></div>
          <div className="package-label"></div>
        </div>

        <div className="floating-card payment-card">
          <div className="payment-chip"></div>
          <div className="payment-line line-1"></div>
          <div className="payment-line line-2"></div>
          <div className="payment-line line-3"></div>
        </div>

        <div className="floating-card bag-card">
          <div className="bag-handle"></div>
          <div className="bag-body"></div>
        </div>
      </div>

      <div className="login-card">
        <div className="login-badge">Welcome to ShopClone</div>
        <h1>Your one-stop shopping destination</h1>
        <p className="login-subtext">
          Sign in to browse all items, add products to your cart, and explore
          the store experience.
        </p>

        <form className="login-form" onSubmit={login}>
          <label>Email address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>

        <p className="login-note">
          Demo site: enter any email and password to continue.
        </p>
      </div>
    </div>
  );
}
  return (
    <div className="app">
      <header className="header">
        <div>
          <h1 className="brand">ShopClone</h1>
          <p className="welcome-text">Welcome back, {user.name}</p>
        </div>

        <div className="header-right">
          <button className="cart-button" onClick={() => setCartOpen(true)}>
            Cart ({cartCount})
          </button>
          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="main-content">
        <section className="hero">
          <h2>Explore our featured items</h2>
          <p>
            Browse premium picks, add products to your cart, and test the full
            shopping flow.
          </p>
        </section>

        <section className="products-section">
          <div className="products-grid">
            {products.map((product) => (
              <div className="card" key={product.id}>
                <img src={product.image} alt={product.name} />
                <div className="card-body">
                  <span className="category">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p className="description">{product.description}</p>
                  <p className="price">{formatPrice(product.price)}</p>
                  <button onClick={() => addToCart(product)}>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {cartOpen && <div className="cart-overlay" onClick={() => setCartOpen(false)}></div>}

      <aside className={`cart-panel ${cartOpen ? "open" : ""}`}>
        <div className="cart-header">
          <div>
            <h2>Your Cart</h2>
            <p>{cartCount} item(s)</p>
          </div>
          <button className="close-cart" onClick={() => setCartOpen(false)}>
            ✕
          </button>
        </div>

        <div className="cart-content">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty.</p>
              <span>Add an item to see it here.</span>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p>{formatPrice(item.price)} each</p>

                  <div className="qty-row">
                    <div className="qty-controls">
                      <button onClick={() => decreaseQty(item.id)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => increaseQty(item.id)}>+</button>
                    </div>

                    <button
                      className="remove-link"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>

                  <strong>{formatPrice(item.price * item.qty)}</strong>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>Subtotal</span>
            <strong>{formatPrice(cartTotal)}</strong>
          </div>
          <button className="checkout-btn">Proceed to Checkout</button>
        </div>
      </aside>
    </div>
  );
}

