import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navigation.css'; // Підключаємо стилі

const Navigation = ({ activePage }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Отримуємо токен із localStorage

  const handleLogout = () => {
    localStorage.removeItem('token'); // Видаляємо токен
    navigate('/login'); // Перенаправляємо на сторінку логіну
  };

  return (
    <nav className="navigation">
      <ul>
        <li>
          <Link to="/" className={activePage === 'home' ? 'active' : ''}>Home</Link>
        </li>
        <li>
          <Link to="/catalog" className={activePage === 'catalog' ? 'active' : ''}>Catalog</Link>
        </li>
        <li>
          <Link to="/cart" className={activePage === 'cart' ? 'active' : ''}>Cart</Link>
        </li>
        
        {/* Вертикальна риска для відділення */}
        <div className="divider"></div>

        {/* Логіка для логіну/реєстрації або виходу */}
        {!token ? (
          <>
            <li>
              <Link to="/login" className="auth-link">Login</Link>
            </li>
            <li>
              <Link to="/register" className="auth-link">Register</Link>
            </li>
          </>
        ) : (
          <li>
            <button className="auth-button" onClick={handleLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
