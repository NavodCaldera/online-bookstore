import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Initialize with the same cart items as BuySell.js
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: 'Advanced Mathematics',
      author: 'John Smith',
      price: 2500,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      seller: 'Sarah K.'
    },
    {
      id: 2,
      title: 'Physics Practical Guide',
      author: 'Dr. Wilson',
      price: 1200,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      seller: 'Mike R.'
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const addToCart = (item) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      updateQuantity(item.id, existingItem.quantity + 1);
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const value = {
    cartItems,
    setCartItems,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    addToCart,
    removeFromCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
