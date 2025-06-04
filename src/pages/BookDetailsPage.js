import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function BookDetailsPage({ addToCart }) {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Helper function to format price
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return price.toFixed(2);
    } else if (typeof price === 'string') {
      return parseFloat(price).toFixed(2);
    }
    return '0.00'; // Default fallback
  };

  useEffect(() => {
    // In a real app, fetch from your API
    fetch(`http://localhost:3001/api/books/${id}`)
      .then(response => response.json())
      .then(data => {
        setBook(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(`Error fetching book with id ${id}:`, error);
        setLoading(false);
        // Fallback data for development
        setBook({
          id: parseInt(id),
          title: 'Sample Book Title',
          author: 'Sample Author',
          genre: 'Fiction',
          price: 12.99,
          description: 'This is a detailed description of the book. It would contain multiple paragraphs about the plot, characters, and themes of the book. This is just placeholder text for development purposes.',
          imageUrl: 'https://via.placeholder.com/300x400',
          publishedDate: '2023-01-01',
          isbn: '978-3-16-148410-0'
        });
      });
  }, [id]);

  const handleAddToCart = () => {
    if (book) {
      addToCart({ ...book, quantity });
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading book details...</div>;
  }

  if (!book) {
    return <div className="container mx-auto px-4 py-8 text-center">Book not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 p-4">
            <img 
              src={book.imageUrl || 'https://via.placeholder.com/300x400'} 
              alt={book.title} 
              className="w-full h-auto object-cover rounded"
            />
          </div>
          <div className="md:w-2/3 p-4">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-gray-600 mb-4">by {book.author}</p>
            
            <div className="mb-4">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                {book.genre}
              </span>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{book.description}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Details</h2>
              <ul className="text-gray-700">
                <li><strong>ISBN:</strong> {book.isbn}</li>
                <li><strong>Published:</strong> {book.publishedDate}</li>
              </ul>
            </div>
            
            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold mr-4">${formatPrice(book.price)}</span>
              <div className="flex items-center">
                <label htmlFor="quantity" className="mr-2">Quantity:</label>
                <input 
                  type="number" 
                  id="quantity"
                  min="1" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                  className="w-16 border rounded p-1 text-center"
                />
              </div>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetailsPage;

