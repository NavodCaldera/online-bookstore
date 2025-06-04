import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard';

function HomePage() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Handle carousel navigation with useCallback
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === featuredBooks.length - 1 ? 0 : prev + 1));
  }, [featuredBooks.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? featuredBooks.length - 1 : prev - 1));
  }, [featuredBooks.length]);

  useEffect(() => {
    // In a real app, fetch from your API
    fetch('http://localhost:3001/api/books/featured')
      .then(response => response.json())
      .then(data => {
        setFeaturedBooks(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching featured books:', error);
        setLoading(false);
        // Fallback data for development
        setFeaturedBooks([
          { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 12.99, description: 'A classic novel about the American Dream', imageUrl: 'https://via.placeholder.com/150x200' },
          { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 10.99, description: 'A powerful story of racial injustice', imageUrl: 'https://via.placeholder.com/150x200' },
          { id: 3, title: '1984', author: 'George Orwell', price: 9.99, description: 'A dystopian novel about totalitarianism', imageUrl: 'https://via.placeholder.com/150x200' }
        ]);
      });
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (featuredBooks.length > 0) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredBooks.length, nextSlide]);

  // Testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      quote: "This bookstore has the best selection I've ever seen. Their recommendations are always spot on!",
      image: "https://via.placeholder.com/50x50"
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 5,
      quote: "Fast shipping and excellent customer service. I've been a loyal customer for years.",
      image: "https://via.placeholder.com/50x50"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      rating: 4,
      quote: "I love their monthly book subscription box. It's introduced me to so many great authors I wouldn't have discovered otherwise.",
      image: "https://via.placeholder.com/50x50"
    }
  ];

  return (
    <div>
      {/* Hero Banner Section */}
      <section className="relative h-96 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Discover Your Next Great Read</h1>
          <p className="text-xl text-white mb-8 max-w-2xl">Explore our vast collection of books from bestsellers to hidden gems</p>
          <Link to="/books" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Books Carousel */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Books</h2>
          
          {loading ? (
            <p className="text-center">Loading featured books...</p>
          ) : (
            <div className="relative">
              {/* Carousel controls */}
              <button 
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                aria-label="Previous slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Carousel */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {featuredBooks.map((book) => (
                    <div key={book.id} className="w-full flex-shrink-0 px-4">
                      <div className="flex justify-center">
                        <div className="w-full max-w-sm">
                          <BookCard book={book} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                aria-label="Next slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Carousel indicators */}
              <div className="flex justify-center mt-6">
                {featuredBooks.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-3 w-3 mx-1 rounded-full ${currentSlide === index ? 'bg-blue-600' : 'bg-gray-300'}`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Fiction', 'Non-Fiction', 'Mystery', 'Sci-Fi', 'Romance', 'Biography', 'History', 'Children'].map((category) => (
              <Link 
                key={category} 
                to={`/books?category=${category.toLowerCase()}`}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition duration-300"
              >
                <h3 className="text-xl font-semibold">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="italic text-gray-600">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="mb-6 max-w-2xl mx-auto">Stay updated with our latest releases, author interviews, and exclusive offers.</p>
          <form className="flex flex-col md:flex-row justify-center max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="px-4 py-3 rounded-lg md:rounded-r-none mb-2 md:mb-0 text-gray-800 w-full"
              required
            />
            <button 
              type="submit" 
              className="bg-gray-800 hover:bg-gray-900 px-6 py-3 rounded-lg md:rounded-l-none font-semibold transition duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white pt-8 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div>
              <h3 className="text-xl font-bold mb-4">BookStore</h3>
              <p className="mb-4">Your destination for quality books and exceptional reading experiences.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg className="h-6 w-6 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>support@bookstore.com</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>(555) 123-4567</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-700 text-center">
            <p>&copy; 2023 BookStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;




