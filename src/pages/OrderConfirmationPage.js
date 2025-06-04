import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const { orderId, paymentId } = location.state || {};

  if (!orderId) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Order Not Found</h1>
        <p className="mb-6">We couldn't find your order information.</p>
        <Link to="/" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 text-center">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="text-green-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been successfully placed and is being processed.
        </p>
        
        <div className="bg-gray-100 p-4 rounded-md mb-6 text-left">
          <p className="mb-2"><span className="font-semibold">Order ID:</span> {orderId}</p>
          <p><span className="font-semibold">Payment ID:</span> {paymentId}</p>
        </div>
        
        <p className="mb-6 text-sm text-gray-500">
          A confirmation email has been sent to your registered email address with all the details.
        </p>
        
        <div className="flex flex-col space-y-3">
          <Link to="/orders" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
            View Your Orders
          </Link>
          <Link to="/" className="text-blue-600 hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;