import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import HomePage from './HomePage';
import CreateAccount from './pages/CreateAccount';
import Login from './pages/Login';
import BrowseList from './pages/BrowseList';
import BuySell from './pages/BuySell';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import HelpPage from './pages/HelpPage'; // Corrected Path: Use ./ to go down one directory from 'src' to 'pages'

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
            <Route path="*" element={<div>Page not found</div>} />
            <Route path="/help" element={<HelpPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;

