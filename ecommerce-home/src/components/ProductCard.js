import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/ProductCard.css"
const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/item/${product.id}`, { state: { product } });
  };

  return (
    <div className="product-card">
      <div className="product-type-badge">{product.type}</div>
      
      {/* Відображення зображення з imageUrl */}
      <img src={product.imageUrl} alt={product.title} className="product-image" />
      
      <h3>{product.title}</h3>
      <p className="product-description">★ {product.description}</p>
      
      <p className="product-release"><strong>Release Date:</strong> {new Date(product.releaseDate).toLocaleDateString()}</p>
      
      <p className="product-price"><strong>${product.price}</strong></p>
      
      <button className='card-button' onClick={handleButtonClick}>View more</button>
    </div>
  );
};

export default ProductCard;
