import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import '../styles/about.css';

function AboutUs() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      alert(`Thank you for subscribing with email: ${email}`);
      setEmail('');
    } else {
      alert('Please enter a valid email address.');
    }
  };

  return (
    <div className="about-page">
      {/* Navigation Bar */}
      <Navigation />

      {/* About Container - Based on original design */}
      <div className="about-container">
        {/* Left Column: Heading and Image 1 */}
        <div className="about-left">
          <Link to="/about" className="about-link">About us</Link>
          <div className="about-title">PageTurn Is Best<br />Choice For You</div>
          <img src="/abt_img1.png" alt="Book on table" className="about-image1" />
        </div>
        
        {/* Right Column: Image 2 and Description */}
        <div className="about-right">
          <img src="/abt_img2.png" alt="Person holding book" className="about-image2" />
          <div className="about-desc">
            Welcome! We're passionate about literature and committed to sharing the magic of storytelling. 
            Our page is where you'll discover our love for books, our mission to connect readers, and our 
            dedication to fostering a vibrant reading community. Join us on this literary journey as we 
            explore, and celebrate the captivating world of words.
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="mission-section">
        <h2><span className="underline">Our Mission</span></h2>
        <p className="mission-subtitle">
          Fueling curiosity and lifelong learning through insightful knowledge sharing<br />
          with a carefully curated selection of books.
        </p>
        <div className="mission-cards">
          <div className="mission-card">
            <div className="mission-icon">
              <svg width="40" height="40" fill="none" stroke="#223" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="4" y="3" width="16" height="18" rx="2" stroke="#223" fill="none"/>
                <path d="M8 7h8M8 11h8M8 15h4" stroke="#223"/>
                <path d="M7 3v18" stroke="#223"/>
              </svg>
            </div>
            <div className="mission-title">Best Bookstore</div>
            <div className="mission-text">
              Books Explore More. Your go-to destination for a treasure trove of reading wonders.
            </div>
            <button className="mission-arrow">
              <span>&rarr;</span>
            </button>
          </div>
          
          <div className="mission-card">
            <div className="mission-icon">
              <svg width="40" height="40" fill="none" stroke="#223" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="5" stroke="#223" fill="none"/>
                <path d="M12 13v7M12 20l-3-3M12 20l3-3" stroke="#223"/>
              </svg>
            </div>
            <div className="mission-title">Trusted Seller</div>
            <div className="mission-text">
              Quality Shop with confidence knowing we're your trusted seller for genuine items.
            </div>
            <button className="mission-arrow">
              <span>&rarr;</span>
            </button>
          </div>
          
          <div className="mission-card">
            <div className="mission-icon">
              <svg width="40" height="40" fill="none" stroke="#223" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="7" width="18" height="13" rx="2" stroke="#223" fill="none"/>
                <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" stroke="#223"/>
                <circle cx="18" cy="12" r="1" stroke="#223"/>
              </svg>
            </div>
            <div className="mission-title">Expand Store</div>
            <div className="mission-text">
              Diversify our products to cater to evolving needs and preferences of our customers.
            </div>
            <button className="mission-arrow">
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      </section>

      {/* Join the Community Section */}
      <section className="community-section">
        <div className="community-books">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Community Books" />
        </div>
        <form className="community-form" onSubmit={handleNewsletterSubmit}>
          <div className="community-title"><span className="underline">Join the community</span></div>
          <div className="community-subtitle">For newest books updates</div>
          <div className="community-input-group">
            <input 
              type="email" 
              placeholder="Enter your mail" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <button type="submit">&rarr;</button>
          </div>
        </form>
      </section>

      {/* Footer Section */}
      <div className="footer-section">
        <div className="footer-left">
          <h2>Receive The Latest Offers & Updates Via Email</h2>
          <form className="subscribe-form" onSubmit={handleNewsletterSubmit}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>

        <div className="footer-center">
          <div className="footer-column">
            <h3>Categories</h3>
            <ul>
              <li><Link to="/browse?category=textbooks">Textbooks</Link></li>
              <li><Link to="/browse?category=fiction">Novels</Link></li>
              <li><Link to="/browse?category=arts">Comics</Link></li>
              <li><Link to="/browse?category=science">Science</Link></li>
              <li><Link to="/browse?category=history">History</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/browse">Sell Book</Link></li>
              <li><Link to="/buy-sell">My Account</Link></li>
              <li><Link to="/help">Help</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-right">
          <div style={{textAlign: 'right'}}>
            <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Logo" className="logo" style={{float: 'right'}} />
            <br />
            <h2><span style={{textAlign: 'right'}}>PageTurn</span></h2>
            <p>Making education more accessible through pre-loved books and educational materials</p>
          </div>
        </div>
      </div>

      {/* Second Footer */}
      <div className="footer-bottom">
        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>

        <div className="footer-center-logo">
          <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Logo" />
          <span>PageTurn</span>
        </div>

        <div className="footer-payments">
          <h4>We accept</h4>
          <div className="payment-icons">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MasterCard" />
          </div>
        </div>
      </div>

      <footer className="copyright-footer">
        <p>&copy; 2025 PageTurn Bookstore. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default AboutUs;
