import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/actions';
import { Link } from 'react-router-dom';
import "../styles/SuccessPage.css";

const SuccessPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCart()); // Викликаємо очищення корзини
  }, [dispatch]);

  return (
    <div className="success-page">
      <div className="success-container">
        <img src="/checkout.png" alt="Success" className="success-image" />
        <h2>Success!</h2>
        <p className="message">
          Your order has been successfully placed. We will process your payment and notify you by email.
        </p>
        <Link to="/catalog" className="go-back">
          Back to Catalog
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
