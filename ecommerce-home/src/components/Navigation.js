import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navigation.css';

const Navigation = ({ activePage }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
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
        {!token ? (
          <>
            <li>
              <Link to="/login" className={activePage === 'login' ? 'active' : ''}>Login</Link>
            </li>
            <li>
              <Link to="/register" className={activePage === 'register' ? 'active' : ''}>Register</Link>
            </li>
          </>
        ) : (
          <li>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
