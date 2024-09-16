import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CartSidebar.css';
import { X, Trash2, Plus, Minus } from 'lucide-react';

const CartSidebar = ({ isOpen, onClose, cart, updateCartItemQuantity }) => {
  const navigate = useNavigate();

  const calculateSubtotal = () => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((total, item) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      return total + price * item.quantity;
    }, 0).toFixed(2);
  };

  const handleQuantityChange = (item, change) => {
    const newQuantity = item.quantity + change;
    updateCartItemQuantity(item.id, newQuantity, item.selectedSize);
  };

  const handleRemoveItem = (item) => {
    updateCartItemQuantity(item.id, 0, item.selectedSize);
  };

  const handleOrderClick = () => {
    onClose(); // Close the sidebar
    navigate('/contact'); // Navigate to the contact form page
  };

  return (
    <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="cart-sidebar-content">
        <div className="cart-sidebar-header">
          <h2>ORDER LIST</h2>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>
        <div className="cart-items">
          {Array.isArray(cart) && cart.length > 0 ? (
            cart.map((item, index) => (
              <div key={`${item.id}-${item.selectedSize || index}`} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  {item.name === "Duct Chairs" && item.selectedSize && (
                    <p>Size: {item.selectedSize}mm</p>
                  )}
                  <div className="quantity-control">
                    <button onClick={() => handleQuantityChange(item, -1)} disabled={item.quantity === 1}>
                      <Minus size={18} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item, 1)}>
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
                <button onClick={() => handleRemoveItem(item)} className="remove-btn">
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          ) : (
            <p>Your Cart is Empty!</p>
          )}
        </div>
        <div className="cart-summary">
          <button className="checkout-btn" onClick={handleOrderClick} disabled={!Array.isArray(cart) || cart.length === 0}>
            ORDER
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;