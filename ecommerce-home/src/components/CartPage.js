import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, updateCart } from '../redux/actions';
import { useNavigate } from 'react-router-dom';
import "../styles/CartPage.css";

const CartPage = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      await dispatch(fetchCart());
      setLoading(false);
    };
    loadCart();
  }, [dispatch]);

  const handleRemoveFromCart = (id, selectedOption) => {
    const updatedCart = cart.filter(item => !(item.id === id && item.selectedOption === selectedOption));
    dispatch(updateCart(updatedCart));
  };

  const handleQuantityChange = (id, selectedOption, quantity) => {
    const item = cart.find(item => item.id === id && item.selectedOption === selectedOption);
    if (item) {
      const maxQuantity = item.selectableOptions?.find(opt => opt.value === selectedOption)?.quantity || Infinity;
      if (quantity > maxQuantity) {
        alert(`Only ${maxQuantity} items available for ${item.title} (${selectedOption}).`);
        return;
      }
    }
    if (quantity > 0) {
      const updatedCart = cart.map(item =>
        item.id === id && item.selectedOption === selectedOption
          ? { ...item, quantity }
          : item
      );
      dispatch(updateCart(updatedCart));
    } else {
      alert("Quantity must be at least 1.");
    }
  };

  const calculateTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleBackToCatalog = () => {
    navigate('/catalog');
  };

  if (loading) {
    return <p>Loading your cart...</p>;
  }

  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>
      <div className="cart-summary">
        <p>Total amount: <strong>${calculateTotalAmount().toFixed(2)}</strong></p>
        <button className="checkout-button" onClick={handleCheckout}>Continue</button>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart-message">
          <p>Your cart is empty😔</p>
          <button className="back-to-catalog-button" onClick={handleBackToCatalog}>Back to Catalog</button>
        </div>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div key={`${item.id}-${item.selectedOption}`} className="cart-item">
              <img src={item.imageUrl || '/default-image.jpg'} alt={item.title} className="cart-item-image" />
              <div className="cart-item-details">
                <h3 className="item-title">{item.title}</h3>
                <p className="item-cost">Cost: ${item.price}</p>
                <p className="item-type">Type: {item.type}</p>
                {item.selectedOption && (
                  <p className="item-option">Option: <strong>{item.selectedOption}</strong></p>
                )}
                <div className="quantity-container">
                  <span>Amount:</span>
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(item.id, item.selectedOption, item.quantity - 1)}>-</button>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => handleQuantityChange(item.id, item.selectedOption, parseInt(e.target.value))}
                    />
                    <button onClick={() => handleQuantityChange(item.id, item.selectedOption, item.quantity + 1)}>+</button>
                  </div>
                </div>
              </div>
              <button className="remove-button" onClick={() => handleRemoveFromCart(item.id, item.selectedOption)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartPage;
