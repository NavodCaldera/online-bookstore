import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Navigation from '../components/Navigation';
import '../styles/Checkout.css'; // We will create this file next

function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state for shipping and payment
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Sri Lanka',
    paymentMethod: 'credit-card',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // Basic form validation
    const requiredFields = ['fullName', 'email', 'address', 'city', 'postalCode', 'cardName', 'cardNumber', 'cardExpiry', 'cardCVC'];
    for (let field of requiredFields) {
      if (!formData[field]) {
        showToast(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`, 'error');
        return;
      }
    }

    setIsProcessing(true);
    showToast('Processing your order...', 'info');

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      showToast('Payment successful! Your order has been placed.', 'success');
      
      // Clear the cart after successful order
      clearCart();

      // Redirect to home page or an order confirmation page
      navigate('/');
    }, 2500); // 2.5 second delay to simulate API call
  };
  
  const deliveryFee = 300;
  const subtotal = getTotalPrice();
  const total = subtotal + deliveryFee;

  if (cartItems.length === 0 && !isProcessing) {
      return (
          <div className="checkout-page">
            <Navigation />
            <div className="container empty-checkout">
                <h2>Your Cart is Empty</h2>
                <p>There is nothing to check out. Please add some books to your cart first.</p>
                <Link to="/browse" className="btn-primary">Browse Books</Link>
            </div>
          </div>
      )
  }

  return (
    <div className="checkout-page">
      <Navigation />
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>  <Link to="/buy-sell?section=buy">Cart</Link>  <span>Checkout</span>
        </div>
        
        <form className="checkout-main" onSubmit={handlePlaceOrder}>
          {/* Left Side: Shipping & Payment Details */}
          <div className="checkout-details">
            <div className="form-section">
              <h3>Shipping Information</h3>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="address">Street Address</label>
                <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code</label>
                  <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Payment Details</h3>
              <div className="payment-method">
                <div className="method-option active">
                  <i className="fas fa-credit-card"></i> Credit / Debit Card
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="cardName">Name on Card</label>
                <input type="text" id="cardName" name="cardName" value={formData.cardName} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input type="text" id="cardNumber" name="cardNumber" value={formData.cardNumber} placeholder="•••• •••• •••• ••••" maxLength="19" onChange={handleInputChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cardExpiry">Expiry Date</label>
                  <input type="text" id="cardExpiry" name="cardExpiry" value={formData.cardExpiry} placeholder="MM/YY" maxLength="5" onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="cardCVC">CVC</label>
                  <input type="text" id="cardCVC" name="cardCVC" value={formData.cardCVC} placeholder="123" maxLength="3" onChange={handleInputChange} required />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item.id} className="summary-item">
                  <img src={item.image} alt={item.title} />
                  <div className="item-info">
                    <p className="item-title">{item.title}</p>
                    <p className="item-quantity">Qty: {item.quantity}</p>
                  </div>
                  <p className="item-price">LKR {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="summary-calculation">
              <div className="calc-line">
                <span>Subtotal</span>
                <span>LKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="calc-line">
                <span>Delivery Fee</span>
                <span>LKR {deliveryFee.toLocaleString()}</span>
              </div>
              <div className="calc-line total">
                <span>Total</span>
                <span>LKR {total.toLocaleString()}</span>
              </div>
            </div>
            <button type="submit" className="place-order-btn" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-lock"></i> Place Order
                </>
              )}
            </button>
            <div className="secure-payment-info">
                <i className="fas fa-shield-alt"></i> Secure Payment
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;