import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

function NewsletterSubscription({ source = 'footer_form', className = 'subscribe-form' }) {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    setIsSubscribing(true);

    try {
      const response = await fetch('http://localhost:3002/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          source: source
        })
      });

      const data = await response.json();

      if (data.success) {
        showToast(data.message, 'success');
        setEmail('');
      } else {
        showToast(data.error || 'Failed to subscribe. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      showToast('Failed to subscribe. Please check your connection and try again.', 'error');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      <input 
        type="email" 
        placeholder="Enter your email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required 
        disabled={isSubscribing}
        style={{
          opacity: isSubscribing ? 0.7 : 1,
          cursor: isSubscribing ? 'not-allowed' : 'text'
        }}
      />
      <button 
        type="submit" 
        disabled={isSubscribing}
        style={{
          opacity: isSubscribing ? 0.7 : 1,
          cursor: isSubscribing ? 'not-allowed' : 'pointer'
        }}
      >
        {isSubscribing ? (
          <>
            <i className="fas fa-spinner fa-spin" style={{ marginRight: '5px' }}></i>
            Subscribing...
          </>
        ) : (
          'Subscribe'
        )}
      </button>
    </form>
  );
}

export default NewsletterSubscription;
