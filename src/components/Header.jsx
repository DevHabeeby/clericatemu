
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Menu,
  Store,
  UserRound,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { cartCount } = useCart();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`);
      setSearch("");
      setMenuOpen(false);
    }
  };

  return (
    <>
      <div className="top-strip">
        <p>Welcome to Cleric A. — Shop more, save more!</p>
      </div>

      <header className="header">
        <div className="header-main container">

          <button
            className="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu size={25} />
          </button>

          <Link to="/" className="logo">
            Cleric <span>A.</span>
          </Link>

          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button type="submit">
              <Search size={21} />
            </button>
          </form>

          <div className="header-actions">

            <Link to="/products" className="header-link">
              <Store size={23} />
              <span>Products</span>
            </Link>

            <Link to="/cart" className="cart-link">
              <ShoppingCart size={24} />
              <span>Cart</span>
              <b>{cartCount}</b>
            </Link>

            {/* User Account */}
            <Link
              to={user ? "/account" : "/login"}
              className="account-link"
              title="My Account"
              aria-label="My Account"
            >
              <UserRound size={23} />
            </Link>

          </div>
        </div>

        <nav className={`navbar ${menuOpen ? "active" : ""}`}>
          <div className="container nav-content">

            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>

            <Link to="/products" onClick={() => setMenuOpen(false)}>
              All Products
            </Link>

            <Link
              to="/products?category=smartphones"
              onClick={() => setMenuOpen(false)}
            >
              Electronics
            </Link>

            <Link
              to="/products?category=beauty"
              onClick={() => setMenuOpen(false)}
            >
              Beauty
            </Link>

            <Link
              to="/products?category=womens-dresses"
              onClick={() => setMenuOpen(false)}
            >
              Fashion
            </Link>

            <Link
              to="/products?category=furniture"
              onClick={() => setMenuOpen(false)}
            >
              Home & Living
            </Link>

          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
