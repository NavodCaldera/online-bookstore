import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import BrowseList from './pages/BrowseList';
import BuySell from './pages/BuySell';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/browse" element={<BrowseList />} />
        <Route path="/buy-sell" element={<BuySell />} />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Router>
  );
}

export default App;

