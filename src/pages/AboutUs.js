import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation'; // Reusing the same navigation
import '../styles/home.css'; // Reusing common styles from home (like the footer)
import '../styles/about.css'; // A new, dedicated stylesheet for this page

function AboutUs() {
    // Dummy data for the team members section
    const teamMembers = [
        {
            id: 1,
            name: 'Elena Fernando',
            role: 'Founder & CEO',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
        },
        {
            id: 2,
            name: 'Ravi Perera',
            role: 'Head of Technology',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
        },
        {
            id: 3,
            name: 'Aisha Khan',
            role: 'Community Manager',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80'
        }
    ];

    return (
        <div className="about-us-page">
            {/* 1. Reused Navigation Bar for consistency */}
            <Navigation />

            {/* 2. Hero Section - Specific to the About Us page */}
            <header className="about-hero">
                <div className="container">
                    <h1>About PageTurn</h1>
                    <p>Empowering Education, One Book at a Time.</p>
                </div>
            </header>

            {/* 3. Main Content Area */}
            <main className="about-content container">

                {/* Our Mission Section */}
                <section className="mission-section">
                    <div className="mission-text">
                        <h2>Our Mission</h2>
                        <p>Our mission is to make education accessible and affordable for everyone in Sri Lanka. We believe that knowledge should not be a luxury. By creating a trusted platform for buying and selling pre-loved educational books and materials, we empower students, support educators, and promote a culture of sustainable learning.</p>
                        <p>PageTurn was born from a simple idea: to connect those who have knowledge to share with those who need it most. We are passionate about creating a community where learning can thrive without financial barriers.</p>
                    </div>
                    <div className="mission-image">
                        <img src="https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80" alt="A person holding a book in a library" />
                    </div>
                </section>

                {/* How It Works Section - Reused from HomePage for clarity */}
                <section className="how-it-works-section">
                    <h2>How It Works</h2>
                    <div className="steps">
                        <Link to="/create-account" className="step">
                            <i className="fas fa-user-plus"></i>
                            <h3>Create Account</h3>
                            <p>Sign up to start buying or selling pre-owned educational materials.</p>
                        </Link>
                        <Link to="/browse" className="step">
                            <i className="fas fa-search"></i>
                            <h3>Browse or List</h3>
                            <p>Find educational treasures or list your used materials for others.</p>
                        </Link>
                        <Link to="/buy-sell" className="step">
                            <i className="fas fa-exchange-alt"></i>
                            <h3>Buy or Sell</h3>
                            <p>Complete secure transactions and help support affordable education.</p>
                        </Link>
                    </div>
                </section>

                {/* Meet the Team Section */}
                <section className="team-section">
                    <h2>Meet The Team</h2>
                    <div className="team-grid">
                        {teamMembers.map(member => (
                            <div key={member.id} className="team-member-card">
                                <img src={member.image} alt={member.name} />
                                <h3>{member.name}</h3>
                                <p>{member.role}</p>
                            </div>
                        ))}
                    </div>
                </section>

            </main>

            {/* 4. Reused Footer Sections for consistency */}
            {/* Info Banner */}
            <div className="info-banner">
                <div className="info-item left">
                    <img src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80" alt="Delivery Truck" />
                    <span>Island wide delivery</span>
                </div>
                <div className="info-item center">
                    <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80" alt="Secure Payments" />
                    <span>Secure payments</span>
                </div>
                <div className="info-item right">
                    <img src="https://images.unsplash.com/photo-1607863680198-23d4b2565df0?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80" alt="Best Price" />
                    <span>Best Price</span>
                </div>
            </div>

            {/* First Footer Section */}
            <div className="footer-section">
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
                            <li><a href="#">Textbooks</a></li>
                            <li><a href="#">Novels</a></li>
                            <li><a href="#">Comics</a></li>
                            <li><a href="#">Science</a></li>
                            <li><a href="#">History</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="#">Home</a></li>
                            <li><a href="#">Sell Book</a></li>
                            <li><a href="#">My Account</a></li>
                            <li><a href="#">Help</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-right">
                    <div style={{ textAlign: 'right' }}>
                        <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Site Logo" className="logo" />
                        <span style={{ textAlign: 'right' }}>PageTurn</span>
                    </div>
                    <p>Empowering education through affordable reading</p>
                </div>
            </div>

            {/* Second Footer Section */}
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

            {/* Copyright Footer */}
            <footer className="copyright-footer">
                <p>© 2025 PageTurn Bookstore. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default AboutUs;