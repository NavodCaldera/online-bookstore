import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Corrected Paths: Use ../ to go up one directory from 'pages' to 'src'
import Navigation from '../components/Navigation';
import '../styles/help.css';

function HelpPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "What is PageTurn?",
      answer: "PageTurn is a platform dedicated to making education more affordable. We allow students and book lovers to buy and sell pre-owned educational materials, reducing costs by 50-70% compared to retail prices."
    },
    {
      question: "How do I buy a book?",
      answer: "To buy a book, simply browse our collection using the 'Shop Now' link or the search bar. When you find a book you like, click the 'Add to Cart' button. You can view your cart and proceed to checkout by clicking the shopping cart icon in the header."
    },
    {
      question: "How do I sell my books?",
      answer: "To sell your books, navigate to the 'My Account' section and select 'Sell Books'. You'll be guided through the process of listing your book, which includes adding details like the title, author, condition, and price. Once listed, other users can purchase it."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept secure payments through major credit cards, including Visa and MasterCard. All transactions are encrypted for your security."
    },
    {
      question: "How does shipping and delivery work?",
      answer: "We offer island-wide delivery for all purchases. Shipping costs and estimated delivery times are calculated at checkout based on your location. You will receive a tracking number once your order has been dispatched."
    },
    {
      question: "What if I can't find the answer to my question here?",
      answer: "If your question is not answered in our FAQ, please do not hesitate to reach out to our support team. You can get in touch with us via our Contact Us page."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div>
      <Navigation />
      <div className="help-container">
        <header className="help-header">
          <h1>Help & Support</h1>
          <p>Your questions, answered. Find the information you need below.</p>
        </header>

        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button
                  className={`faq-question ${openFaq === index ? 'active' : ''}`}
                  onClick={() => toggleFaq(index)}
                >
                  {faq.question}
                  <span className="faq-icon">{openFaq === index ? '−' : '+'}</span>
                </button>
                <div className={`faq-answer ${openFaq === index ? 'show' : ''}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="contact-support-section">
            <h2>Still need help?</h2>
            <p>Our support team is ready to assist you.</p>
            <Link to="/contact" className="btn-primary">Contact Us</Link>
        </section>
      </div>
    </div>
  );
}

export default HelpPage;