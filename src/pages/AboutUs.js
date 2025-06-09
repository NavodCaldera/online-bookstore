import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import '../styles/about.css';
import '../styles/home.css';

// Import images
import abtImg1 from '../assets/images/abt_img1.png';
import abtImg2 from '../assets/images/abt_img2.png';
import bestBookImg from '../assets/images/best_book.png';
import trustSellerImg from '../assets/images/trust_seller.png';
import expandImg from '../assets/images/expand.png';
import commImg from '../assets/images/comm.png';
import logoImg from '../assets/images/logo.webp';

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
          <img src={abtImg1} alt="Book on table" className="about-image1" />
        </div>

        {/* Right Column: Image 2 and Description */}
        <div className="about-right">
          <img src={abtImg2} alt="Person holding book" className="about-image2" />
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
              <img src={bestBookImg} alt="Best Bookstore" width="40" height="40" />
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
              <img src={trustSellerImg} alt="Trusted Seller" width="40" height="40" />
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
              <img src={expandImg} alt="Expand Store" width="40" height="40" />
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
          <img src={commImg} alt="Community Books" />
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

      {/* First Footer Section */}
      <div className="footer-section">
        <div className="container">
          <div className="footer-left">
            <h2>Receive The Latest Offers & Updates Via Email</h2>
            <form className="subscribe-form">
              <input type="email" placeholder="Enter your email" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>

          <div className="footer-center">
            <div className="footer-column">
              <h3>Categories</h3>
              <ul>
                <li><Link to="/browse?category=mathematics">Mathematics</Link></li>
                <li><Link to="/browse?category=reference">Reference</Link></li>
                <li><Link to="/browse?category=technology">Technology</Link></li>
                <li><Link to="/browse?category=literature">Literature</Link></li>
                <li><Link to="/browse?category=non-fiction">Non-Fiction</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Quick Links</h3>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/buy-sell?section=buy">Buy Books</Link></li>
                <li><Link to="/buy-sell?section=sell">Sell Books</Link></li>
                <li><Link to="/buy-sell?section=account">My Account</Link></li>
                <li><Link to="/help">Help</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-right">
            <div style={{textAlign: 'right'}}>
              <Link to="/">
                <img src={logoImg} alt="Site Logo" className="logo" />
              </Link>
              <span style={{textAlign: 'right'}}>PageTurn</span>
            </div>
            <p>Empowering education through affordable reading</p>
          </div>
        </div>
      </div>

      {/* Second Footer Section */}
      <div className="footer-bottom">
        <div className="container">
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
            <Link to="/">
              <img src={logoImg} alt="Logo" />
            </Link>
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
      </div>

      {/* Copyright Footer */}
      <footer className="copyright-footer">
        <p>&copy; 2025 PageTurn Bookstore. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default AboutUs;
