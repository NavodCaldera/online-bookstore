import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link to="/" className="text-xl font-bold mb-2 md:mb-0">BookStore</Link>
        <div className="flex flex-wrap gap-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/books" className="hover:text-gray-300">Books</Link>
          <Link to="/cart" className="hover:text-gray-300">Cart</Link>
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="hover:text-gray-300">Profile</Link>
              <button 
                onClick={() => setIsLoggedIn(false)} 
                className="hover:text-gray-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;