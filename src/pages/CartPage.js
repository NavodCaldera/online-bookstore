import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function CartPage({ cart, updateQuantity, removeFromCart, isLoggedIn }) {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  // Add this helper function at the beginning of the component
  const getNumericPrice = (price) => {
    if (typeof price === 'number') {
      return price;
    } else if (typeof price === 'string') {
      return parseFloat(price) || 0;
    }
    return 0;
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + getNumericPrice(item.price) * item.quantity, 0);
  };

  // This is the total including any shipping, tax, etc.
  const calculateTotal = () => {
    // For now, total is same as subtotal, but you can add shipping, tax, etc.
    return calculateSubtotal();
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <p className="mb-4">Your cart is empty</p>
        <Link to="/books" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Browse Books
        </Link>
      </div>
    );
  }

  const proceedToCheckout = async () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    try {
      // Create order in the backend
      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          total_amount: calculateTotal(),
          shipping_address: 'User address', // You should collect this from the user
          payment_method: 'card',
          items: cart.map(item => ({
            book_id: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await response.json();
      
      // Store order data for the checkout page
      localStorage.setItem('pendingOrder', JSON.stringify({
        id: orderData.id,
        items: cart,
        total_amount: calculateTotal()
      }));
      
      // Navigate to checkout
      navigate('/checkout');
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Failed to create order. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cart.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-16 w-12 flex-shrink-0 mr-4">
                      <img 
                        className="h-16 w-12 object-cover" 
                        src={item.imageUrl || 'https://via.placeholder.com/48x64'} 
                        alt={item.title} 
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-500">by {item.author}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input 
                    type="number" 
                    min="1" 
                    value={item.quantity} 
                    onChange={(e) => updateQuantity(item.id, Math.max(1, parseInt(e.target.value)))}
                    className="w-16 border rounded p-1 text-center"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${(getNumericPrice(item.price) * item.quantity).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 md:w-1/2 md:ml-auto">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>${calculateSubtotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
        <button 
          onClick={proceedToCheckout}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          disabled={cart.length === 0}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default CartPage;


