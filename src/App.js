import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import CreateAccount from './pages/CreateAccount';
import BrowseList from './pages/BrowseList';
import BuySell from './pages/BuySell';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/browse" element={<BrowseList />} />
        <Route path="/buy-sell" element={<BuySell />} />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Router>
  );
}

export default App;

