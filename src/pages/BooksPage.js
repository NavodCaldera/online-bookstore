import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    genre: '',
    priceRange: '',
    author: ''
  });
  
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);

  const getNumericPrice = (price) => {
    if (typeof price === 'number') {
      return price;
    } else if (typeof price === 'string') {
      return parseFloat(price) || 0;
    }
    return 0;
  };

  useEffect(() => {
    // In a real app, fetch from your API
    fetch('http://localhost:3001/api/books')
      .then(response => response.json())
      .then(data => {
        setBooks(data);
        
        // Extract unique genres and authors for filters
        const uniqueGenres = [...new Set(data.map(book => book.genre))];
        const uniqueAuthors = [...new Set(data.map(book => book.author))];
        
        setGenres(uniqueGenres);
        setAuthors(uniqueAuthors);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
        setLoading(false);
        // Fallback data for development
        const mockBooks = [
          { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic', price: 12.99, description: 'A classic novel about the American Dream', imageUrl: 'https://via.placeholder.com/150x200' },
          { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', price: 10.99, description: 'A powerful story of racial injustice', imageUrl: 'https://via.placeholder.com/150x200' },
          { id: 3, title: '1984', author: 'George Orwell', genre: 'Dystopian', price: 9.99, description: 'A dystopian novel about totalitarianism', imageUrl: 'https://via.placeholder.com/150x200' },
          { id: 4, title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', price: 14.99, description: 'A fantasy novel about a hobbits journey', imageUrl: 'https://via.placeholder.com/150x200' }
        ];
        setBooks(mockBooks);
        setGenres([...new Set(mockBooks.map(book => book.genre))]);
        setAuthors([...new Set(mockBooks.map(book => book.author))]);
      });
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const filteredBooks = books.filter(book => {
    const numericPrice = getNumericPrice(book.price);
    
    return (
      (filters.genre === '' || book.genre === filters.genre) &&
      (filters.author === '' || book.author === filters.author) &&
      (filters.priceRange === '' || 
        (filters.priceRange === 'under10' && numericPrice < 10) ||
        (filters.priceRange === '10to20' && numericPrice >= 10 && numericPrice <= 20) ||
        (filters.priceRange === 'over20' && numericPrice > 20)
      )
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Browse Books</h1>
      
      <div className="mb-8 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">Genre</label>
            <select 
              name="genre" 
              value={filters.genre} 
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block mb-2">Price Range</label>
            <select 
              name="priceRange" 
              value={filters.priceRange} 
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All Prices</option>
              <option value="under10">Under $10</option>
              <option value="10to20">$10 - $20</option>
              <option value="over20">Over $20</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-2">Author</label>
            <select 
              name="author" 
              value={filters.author} 
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All Authors</option>
              {authors.map(author => (
                <option key={author} value={author}>{author}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {loading ? (
        <p className="text-center">Loading books...</p>
      ) : (
        <>
          <p className="mb-4">{filteredBooks.length} books found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default BooksPage;

