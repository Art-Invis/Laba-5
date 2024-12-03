import React from 'react';
import Navigation from './Navigation';
import '../styles/Header.css';

const Header = ({ activePage, searchTerm, onSearchChange }) => {
  return (
    <header>
      <div className="logo">
        <h1><i className="fas fa-headphones-alt"></i> Music World</h1>
      </div>
      {activePage === 'catalog' && (
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm} // Прив'язуємо поле пошуку до значення searchTerm
            onChange={onSearchChange} // Викликаємо функцію при зміні тексту
          />
        </div>
      )}
      <Navigation activePage={activePage} />
    </header>
  );
};

export default Header;
