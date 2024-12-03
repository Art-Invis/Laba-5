import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import FiltersComponent from './FiltersComponent';
import ProductCard from './ProductCard';
import ItemPage from './ItemPage';
import { fetchProducts } from '../api'; 
import Spinner from './Spinner'; 
import '../styles/CatalogPage.css';

const CatalogPage = ({ searchTerm, setSearchTerm }) => {
  const [products, setProducts] = useState([]); 
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortCriteria, setSortCriteria] = useState(''); 
  const [sortOrder, setSortOrder] = useState('asc'); 
  const navigate = useNavigate();

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching products with parameters:');
      console.log('Вибрана категорія:', selectedCategory);
      console.log('Пошуковий запит:', searchTerm);
      console.log('Критерій сортування:', sortCriteria);
      console.log('Порядок сортування:', sortOrder);

      const data = await fetchProducts(selectedCategory, searchTerm, sortCriteria, sortOrder);
      console.log('Дані отримані з бекенду:', data);
      
      setProducts(data);
      setFilteredProducts(data);

      setTimeout(() => {
        setLoading(false);
      }, 500); 
    } catch (error) {
      console.error('Помилка завантаження продуктів:', error);
      setLoading(false);
    }
  }, [selectedCategory, searchTerm, sortCriteria, sortOrder]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]); 

  const handleFilterChange = useCallback(() => {
    let updatedProducts = [...products];

    if (selectedCategory) {
      updatedProducts = updatedProducts.filter(product => product.type === selectedCategory);
    }

    if (searchTerm) {
      updatedProducts = updatedProducts.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(updatedProducts);
  }, [products, selectedCategory, searchTerm]);

  useEffect(() => {
    handleFilterChange();
  }, [selectedCategory, searchTerm, handleFilterChange]);

  const resetFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
    setSortCriteria('');
    setSortOrder('asc');
    setFilteredProducts(products);
  };

  const viewProductDetails = (product) => {
    navigate(`/item/${product.id}`, { state: { product } });
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <div className="catalog-page">
            {loading ? (
              <Spinner /> 
            ) : (
              <>
                <FiltersComponent 
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  sortCriteria={sortCriteria}
                  setSortCriteria={setSortCriteria}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  resetFilters={resetFilters} 
                />
                
                <div className="products-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onViewDetails={viewProductDetails} />
                  ))}
                </div>
              </>
            )}
          </div>
        } 
      />
      <Route path="/item/:id" element={<ItemPage products={products} />} />
    </Routes>
  );
};

export default CatalogPage;
