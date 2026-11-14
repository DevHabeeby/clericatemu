import { Link } from "react-router-dom";
import {
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">

        <div className="footer-brand">
          <h2 className="logo">Cleric <span>A.</span></h2>
          <p>
            Your everyday shopping destination.
            Discover amazing products and enjoy
            shopping at great prices.
          </p>

          <div className="footer-socials">
            <a href="#facebook" aria-label="Facebook">Facebook</a>
            <a href="#instagram" aria-label="Instagram">Instagram</a>
            <a href="#twitter" aria-label="Twitter">Twitter</a>
          </div>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/products">All Products</Link>
          <Link to="/cart">Shopping Cart</Link>
          <Link to="/checkout">Checkout</Link>
        </div>

        <div className="footer-links">
          <h3>Categories</h3>
          <Link to="/products?category=smartphones">Electronics</Link>
          <Link to="/products?category=beauty">Beauty</Link>
          <Link to="/products?category=womens-dresses">Fashion</Link>
          <Link to="/products?category=furniture">Home & Living</Link>
        </div>

        <div className="footer-links">
          <h3>My Account</h3>
          <Link to="/login">Login</Link>
          <Link to="/register">Create Account</Link>
          <Link to="/account">My Profile</Link>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p><Mail size={17} /> support@clerica.com</p>
          <p><Phone size={17} /> Customer Support</p>
          <p><MapPin size={17} /> Nigeria</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Cleric A.
          All rights reserved.
        </p>
        <span>Built for educational purposes.</span>
      </div>
    </footer>
  );
}

export default Footer;