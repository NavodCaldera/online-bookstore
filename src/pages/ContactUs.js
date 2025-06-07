import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import '../styles/home.css';    // For shared styles like the footer
import '../styles/contact.css'; // A new, dedicated stylesheet for this page

function ContactUs() {
    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would handle form submission logic here
        alert('Thank you for your message! We will get back to you shortly.');
        e.target.reset(); // Reset form fields
    };

    return (
        <div className="contact-us-page">
            {/* 1. Reused Navigation Bar */}
            <Navigation />

            {/* 2. Hero Section */}
            <header className="contact-hero">
                <div className="container">
                    <h1>Get In Touch</h1>
                    <p>We'd love to hear from you. Please fill out the form below or reach out to us directly.</p>
                </div>
            </header>

            {/* 3. Main Content Area */}
            <main className="contact-content container">
                <div className="contact-grid">

                    {/* Contact Information */}
                    <div className="contact-details">
                        <h2>Contact Information</h2>
                        <p>Our team is available to help you from Monday to Friday, 9:00 AM to 5:00 PM.</p>
                        <ul className="info-list">
                            <li>
                                <i className="fas fa-map-marker-alt"></i>
                                <span>No. 123, Galle Road, Colombo 03, Sri Lanka</span>
                            </li>
                            <li>
                                <i className="fas fa-phone"></i>
                                <span>+94 77 123 4567</span>
                            </li>
                            <li>
                                <i className="fas fa-envelope"></i>
                                <span>info@pageturn.lk</span>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-container">
                        <h2>Send Us a Message</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input type="text" id="name" name="name" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email" id="email" name="email" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="subject">Subject</label>
                                <input type="text" id="subject" name="subject" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Your Message</label>
                                <textarea id="message" name="message" rows="6" required></textarea>
                            </div>
                            <button type="submit" className="btn-submit">Send Message</button>
                        </form>
                    </div>
                </div>

                {/* Map Section */}
                <div className="map-container">
                    <h2>Our Location</h2>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31687.18258392131!2d79.8449626573755!3d6.902249591322058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25963120b1509%3A0x2db2c18a68712853!2sColombo!5e0!3m2!1sen!2slk!4v1672583855526!5m2!1sen!2slk"
                        width="600"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Our Location in Colombo">
                    </iframe>
                </div>
            </main>

            {/* 4. Reused Footer from HomePage */}
            <div className="footer-section">
                {/* ... (This JSX is identical to the footer in HomePage.js) ... */}
            </div>
            <div className="footer-bottom">
                {/* ... (This JSX is identical to the footer in HomePage.js) ... */}
            </div>
            <footer className="copyright-footer">
                <p>© 2025 PageTurn Bookstore. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default ContactUs;