import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Імпорт useSelector для доступу до стану Redux
import Header from './components/HeaderComponent';
import MainContent from './components/MainContentComponent';
import Categories from './components/CategoriesComponent';
import Footer from './components/FooterComponent';
import CatalogPage from './components/CatalogPage';
import ItemPage from './components/ItemPage';
import CartPage from './components/CartPage'; // Імпортуємо сторінку кошика
import CheckoutPage from './components/CheckoutPage';
import SuccessPage from './components/SuccessPage';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './components/LoginPage'; // Додайте файл LoginPage
import RegisterPage from './components/RegisterPage'; // Додайте файл RegisterPage



function App() {
  const location = useLocation();
  const cart = useSelector((state) => state.cart.cartItems || []); // Забезпечуємо, що це масив

  const getActivePage = () => {
    if (location.pathname.includes("/catalog") || location.pathname.includes("/item")) {
      return "catalog";
    }
    if (location.pathname === "/cart" || location.pathname === "/checkout" || location.pathname === "/success") {
      return "cart";  // Keep "Cart" active on both Cart and Checkout pages
    }
    if (location.pathname === "/login") {
      return "login";  // Keep "Login" active when on Login page
    }
    if (location.pathname === "/register") {
      return "register";  // Keep "Register" active when on Register page
    }
    return "home";
  };

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const resetSearchTerm = () => {
    setSearchTerm(''); // Очищення пошукового терміна
  };

  return (
    <div className="App">
      <Header 
        activePage={getActivePage()} 
        searchTerm={searchTerm} 
        onSearchChange={handleSearchChange} 
        cartItemCount={cart.length} // Відображаємо кількість товарів у кошику
      />
      <Routes>
        <Route path="/" element={ 
          <>
            <MainContent />
            <Categories />
          </>
        } />
        <Route path="/catalog/*" element={<CatalogPage searchTerm={searchTerm} setSearchTerm={setSearchTerm} resetSearchTerm={resetSearchTerm} />} />
        <Route path="/item/:id" element={<ProtectedRoute><ItemPage /></ProtectedRoute>} /> {/* Захищаємо сторінку товару */}
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} /> {/* Захищаємо сторінку кошика */}
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} /> {/* Захищаємо сторінку оформлення замовлення */}
        <Route path="/success" element={<ProtectedRoute><SuccessPage /></ProtectedRoute>} /> {/* Захищаємо сторінку успіху */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
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
