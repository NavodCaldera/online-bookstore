import React from 'react';
import { Link } from 'react-router-dom';

function BookCard({ book }) {
  // Ensure price is a number before using toFixed
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return price.toFixed(2);
    } else if (typeof price === 'string') {
      return parseFloat(price).toFixed(2);
    }
    return '0.00'; // Default fallback
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <img 
        src={book.imageUrl || 'https://via.placeholder.com/150x200'} 
        alt={book.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
        <p className="text-sm mb-3 line-clamp-2">{book.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">${formatPrice(book.price)}</span>
          <Link 
            to={`/books/${book.id}`} 
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
