import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import '../styles/contact.css'; // Reusing contact styles for consistency
import '../styles/home.css';

function Help() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const helpSections = {
    'getting-started': {
      title: 'Getting Started',
      icon: 'fas fa-play-circle',
      content: [
        {
          question: 'How do I create an account?',
          answer: 'Click on "Sign Up" in the navigation menu, fill out the registration form with your details, and verify your email address. You can then start buying and selling books immediately.'
        },
        {
          question: 'Is PageTurn free to use?',
          answer: 'Yes! Creating an account and browsing books is completely free. We only charge a small commission when you successfully sell a book through our platform.'
        },
        {
          question: 'What types of books can I find?',
          answer: 'We specialize in educational materials including textbooks, reference books, and academic resources across 12 categories: Fiction, Science, Mathematics, Technology, Business, Arts, History, Literature, Philosophy, Psychology, Non-Fiction, and Reference.'
        }
      ]
    },
    'buying': {
      title: 'Buying Books',
      icon: 'fas fa-shopping-cart',
      content: [
        {
          question: 'How do I search for books?',
          answer: 'Use the search bar to find books by title, author, or keywords. You can also filter by category, price range, condition, and language to narrow down your results.'
        },
        {
          question: 'What do the book conditions mean?',
          answer: 'New: Brand new, unused books. Used: Previously owned but in good readable condition. Fair: Shows wear but all pages are intact and readable. Poor: Heavily used with significant wear but still functional.'
        },
        {
          question: 'How do I add books to my cart?',
          answer: 'Click the "Add to Cart" button on any book listing. You can view your cart by clicking the cart icon in the header, where you can adjust quantities or remove items.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept major credit cards (Visa, MasterCard), debit cards, and mobile payment options. All transactions are secured with SSL encryption.'
        }
      ]
    },
    'selling': {
      title: 'Selling Books',
      icon: 'fas fa-tag',
      content: [
        {
          question: 'How do I list a book for sale?',
          answer: 'Go to the "Browse" page and click on "List Your Items" tab. Fill out the book details including title, author, condition, price, and description. Your listing will be live immediately.'
        },
        {
          question: 'How should I price my books?',
          answer: 'Research similar books on our platform to set competitive prices. Generally, used textbooks sell for 40-70% of their original retail price, depending on condition and demand.'
        },
        {
          question: 'What information should I include in my listing?',
          answer: 'Include accurate title, author, edition, publication year, ISBN (if available), honest condition assessment, and clear description of any wear or damage.'
        },
        {
          question: 'How do I get paid?',
          answer: 'Once a buyer purchases your book, payment is processed through our secure system. Funds are transferred to your account after successful delivery confirmation.'
        }
      ]
    },
    'account': {
      title: 'Account Management',
      icon: 'fas fa-user-cog',
      content: [
        {
          question: 'How do I update my profile?',
          answer: 'Log in to your account and go to "My Account" section where you can update your personal information, contact details, and preferences.'
        },
        {
          question: 'I forgot my password. What should I do?',
          answer: 'Click on "Forgot Password" on the login page. Enter your email address and we\'ll send you instructions to reset your password.'
        },
        {
          question: 'How do I change my email address?',
          answer: 'Go to your account settings and update your email address. You\'ll need to verify the new email address before the change takes effect.'
        },
        {
          question: 'Can I delete my account?',
          answer: 'Yes, you can delete your account from the account settings page. Note that this action is permanent and cannot be undone.'
        }
      ]
    },
    'safety': {
      title: 'Safety & Security',
      icon: 'fas fa-shield-alt',
      content: [
        {
          question: 'Is it safe to buy from other users?',
          answer: 'Yes! We have verification systems in place and encourage users to check seller ratings and reviews. All payments are processed securely through our platform.'
        },
        {
          question: 'How do I report a problem with a seller or buyer?',
          answer: 'Contact our support team through the "Contact Us" page with details about the issue. We investigate all reports and take appropriate action.'
        },
        {
          question: 'What if I receive a book that doesn\'t match the description?',
          answer: 'Contact us within 7 days of receiving the book. We offer buyer protection and will work with you and the seller to resolve the issue.'
        },
        {
          question: 'How is my personal information protected?',
          answer: 'We use industry-standard encryption and security measures to protect your data. We never share your personal information with third parties without your consent.'
        }
      ]
    },
    'technical': {
      title: 'Technical Support',
      icon: 'fas fa-tools',
      content: [
        {
          question: 'The website is not loading properly. What should I do?',
          answer: 'Try refreshing the page, clearing your browser cache, or using a different browser. If the problem persists, contact our technical support team.'
        },
        {
          question: 'I\'m having trouble uploading book images.',
          answer: 'Ensure your images are in JPG, PNG, or GIF format and under 5MB in size. Try using a different browser or device if the problem continues.'
        },
        {
          question: 'The search function isn\'t working correctly.',
          answer: 'Try using different keywords or check your spelling. If you\'re still having issues, please report it to our technical team.'
        },
        {
          question: 'Can I use PageTurn on my mobile device?',
          answer: 'Yes! Our website is fully responsive and works on all mobile devices and tablets. Simply visit our website through your mobile browser.'
        }
      ]
    }
  };

  const filteredSections = Object.entries(helpSections).filter(([key, section]) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return section.title.toLowerCase().includes(searchLower) ||
           section.content.some(item => 
             item.question.toLowerCase().includes(searchLower) ||
             item.answer.toLowerCase().includes(searchLower)
           );
  });

  return (
    <div className="contact-container">
      <Navigation />
      
      <div className="contact-header">
        <h1>Help Center</h1>
        <p>Find answers to frequently asked questions and get the help you need</p>
      </div>

      {/* Search Bar */}
      <div className="help-search" style={{ 
        maxWidth: '600px', 
        margin: '2rem auto', 
        padding: '0 1rem' 
      }}>
        <div style={{ 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: '#f8f9fa',
          borderRadius: '25px',
          padding: '0.5rem 1rem',
          border: '2px solid #e9ecef'
        }}>
          <i className="fas fa-search" style={{ 
            color: '#6c757d', 
            marginRight: '0.5rem' 
          }}></i>
          <input
            type="text"
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              flex: 1,
              fontSize: '1rem',
              padding: '0.5rem 0'
            }}
          />
        </div>
      </div>

      <div className="help-content" style={{ 
        display: 'flex', 
        maxWidth: '1200px', 
        margin: '0 auto', 
        gap: '2rem',
        padding: '0 1rem'
      }}>
        {/* Sidebar Navigation */}
        <div className="help-sidebar" style={{ 
          minWidth: '250px',
          background: '#f8f9fa',
          borderRadius: '10px',
          padding: '1.5rem',
          height: 'fit-content',
          position: 'sticky',
          top: '2rem'
        }}>
          <h3 style={{ 
            marginBottom: '1rem', 
            color: '#333',
            fontSize: '1.2rem'
          }}>Help Topics</h3>
          {Object.entries(helpSections).map(([key, section]) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.75rem',
                margin: '0.25rem 0',
                border: 'none',
                background: activeSection === key ? '#007bff' : 'transparent',
                color: activeSection === key ? 'white' : '#333',
                borderRadius: '5px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease'
              }}
            >
              <i className={section.icon} style={{ marginRight: '0.5rem' }}></i>
              {section.title}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="help-main" style={{ flex: 1 }}>
          {filteredSections.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem',
              color: '#6c757d'
            }}>
              <i className="fas fa-search" style={{ 
                fontSize: '3rem', 
                marginBottom: '1rem' 
              }}></i>
              <h3>No results found</h3>
              <p>Try different keywords or browse our help topics</p>
            </div>
          ) : (
            filteredSections.map(([key, section]) => (
              <div key={key} style={{ 
                display: activeSection === key || searchQuery ? 'block' : 'none',
                marginBottom: searchQuery ? '2rem' : '0'
              }}>
                <h2 style={{ 
                  color: '#333',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <i className={section.icon}></i>
                  {section.title}
                </h2>
                
                <div className="faq-list">
                  {section.content.map((item, index) => (
                    <div key={index} style={{
                      background: 'white',
                      border: '1px solid #e9ecef',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                      overflow: 'hidden',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{
                        background: '#f8f9fa',
                        padding: '1rem',
                        borderBottom: '1px solid #e9ecef'
                      }}>
                        <h4 style={{ 
                          margin: 0,
                          color: '#333',
                          fontSize: '1.1rem'
                        }}>
                          <i className="fas fa-question-circle" style={{ 
                            color: '#007bff',
                            marginRight: '0.5rem'
                          }}></i>
                          {item.question}
                        </h4>
                      </div>
                      <div style={{ padding: '1rem' }}>
                        <p style={{ 
                          margin: 0,
                          lineHeight: '1.6',
                          color: '#555'
                        }}>
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Contact Support Section */}
      <div style={{
        background: '#f8f9fa',
        padding: '3rem 1rem',
        marginTop: '3rem',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '1rem', color: '#333' }}>
          Still need help?
        </h3>
        <p style={{ 
          marginBottom: '2rem', 
          color: '#6c757d',
          maxWidth: '600px',
          margin: '0 auto 2rem'
        }}>
          Can't find what you're looking for? Our support team is here to help you with any questions or issues.
        </p>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link 
            to="/contact" 
            style={{
              background: '#007bff',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '5px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'background 0.3s ease'
            }}
          >
            <i className="fas fa-envelope"></i>
            Contact Support
          </Link>
          <a 
            href="mailto:support@pageturn.lk"
            style={{
              background: '#28a745',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '5px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'background 0.3s ease'
            }}
          >
            <i className="fas fa-at"></i>
            Email Us
          </a>
        </div>
      </div>

      {/* Footer sections from other pages */}
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
                <img src="/logo.webp" alt="Site Logo" className="logo" />
              </Link>
              <span style={{textAlign: 'right'}}>PageTurn</span>
            </div>
            <p>Empowering education through affordable reading</p>
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

export default Help;
