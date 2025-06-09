import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

// Pages
import HomePage from './HomePage';
import CreateAccount from './pages/CreateAccount';
import Login from './pages/Login';
import BrowseList from './pages/BrowseList';
import BuySell from './pages/BuySell';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Help from './pages/Help';
import CheckoutPage from './pages/CheckoutPage';

// 404 Component
const NotFound = () => (
  <div style={{
    textAlign: 'center',
    padding: '2rem',
    minHeight: '50vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <a href="/" style={{ color: '#482E1D', textDecoration: 'underline' }}>
      Go back to Home
    </a>
  </div>
);

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/login" element={<Login />} />
            <Route path="/browse" element={<BrowseList />} />
            <Route path="/buy-sell" element={<BuySell />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/help" element={<Help />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;

