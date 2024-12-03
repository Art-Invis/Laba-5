import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './components/HeaderComponent';
import MainContent from './components/MainContentComponent';
import Categories from './components/CategoriesComponent';
import Footer from './components/FooterComponent';
import CatalogPage from './components/CatalogPage';
import ItemPage from './components/ItemPage';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import SuccessPage from './components/SuccessPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token'); // Перевіряємо, чи є токен
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const location = useLocation();
  const cart = useSelector((state) => state.cart);

  const getActivePage = () => {
    if (location.pathname.includes("/catalog") || location.pathname.includes("/item")) {
      return "catalog";
    }
    if (location.pathname === "/cart" || location.pathname === "/checkout" || location.pathname === "/success") {
      return "cart";
    }
    return "home";
  };

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const resetSearchTerm = () => {
    setSearchTerm('');
  };

  return (
    <div className="App">
      <Header 
        activePage={getActivePage()} 
        searchTerm={searchTerm} 
        onSearchChange={handleSearchChange} 
        cartItemCount={cart.length} 
      />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <>
              <MainContent />
              <Categories />
            </>
          </ProtectedRoute>
        } />
        <Route path="/catalog/*" element={
          <ProtectedRoute>
            <CatalogPage searchTerm={searchTerm} setSearchTerm={setSearchTerm} resetSearchTerm={resetSearchTerm} />
          </ProtectedRoute>
        } />
        <Route path="/item/:id" element={
          <ProtectedRoute>
            <ItemPage />
          </ProtectedRoute>
        } />
        <Route path="/cart" element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        } />
        <Route path="/success" element={
          <ProtectedRoute>
            <SuccessPage />
          </ProtectedRoute>
        } />
      </Routes>
      <Footer />
    </div>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
