
import { Link, useNavigate } from "react-router-dom";
import { UserRound, LogOut, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <main className="container section account-page">
        <div className="account-card">
          <h1>Please Login</h1>
          <p>You need to log in to view your account.</p>
          <Link to="/login" className="primary-btn">
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container section account-page">
      <div className="account-card">
        <div className="auth-icon">
          <UserRound size={35} />
        </div>

        <h1>My Account</h1>
        <p>Welcome to your Temu account!</p>

        <div className="account-details">
          <div>
            <span>Full Name</span>
            <strong>{user.displayName || "Customer"}</strong>
          </div>

          <div>
            <span>Email Address</span>
            <strong>{user.email}</strong>
          </div>
        </div>

        <Link to="/products" className="primary-btn">
          <ShoppingBag size={18} />
          Continue Shopping
        </Link>

        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </main>
  );
}

export default Account;
