import React, { createContext, useContext, useState, useEffect } from 'react'; // MODIFIED: Imported useEffect

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // MODIFIED: Initialize state from localStorage instead of hardcoded data
  // This makes the cart persistent across page reloads.
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('pageturn_cart_items');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse cart items from localStorage", error);
      return [];
    }
  });

  // ADDED: A useEffect hook to save the cart to localStorage whenever it changes.
  useEffect(() => {
    localStorage.setItem('pageturn_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);


  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      // If quantity is 0, remove the item from the cart
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    } else {
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
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
      // If item exists, just increase its quantity
      updateQuantity(item.id, existingItem.quantity + 1);
    } else {
      // Otherwise, add the new item to the cart with quantity 1
      setCartItems(prevItems => [...prevItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  // ADDED: The clearCart function needed for after checkout.
  const clearCart = () => {
    setCartItems([]);
  };

  // MODIFIED: The value object provided to consumers of the context.
  // It's good practice to not expose the raw 'setCartItems' function.
  // We've also added the new clearCart function.
  const value = {
    cartItems,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    addToCart,
    removeFromCart,
    clearCart, // <-- Export the new function
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};