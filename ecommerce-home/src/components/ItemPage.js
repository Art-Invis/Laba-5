import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/actions';
import { fetchProductById } from '../api';
import "../styles/ItemPage.css";

const ItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState("");
  const [error, setError] = useState(""); 
  const [successMessage, setSuccessMessage] = useState(""); 
  const [totalPrice, setTotalPrice] = useState(0); 

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data); 
      } catch (error) {
        console.error("Error loading product:", error);
      }
    };
    loadProduct();
  }, [id]);


  useEffect(() => {
    if (product && product.price) {
      setTotalPrice(product.price * quantity);
    }
  }, [product, quantity]);

  if (!product) {
    return <p>Product not found</p>;
  }

  const handleQuantityChange = (e) => {
    const value = Math.min(e.target.value, product.selectableOptions.find(option => option.value === selectedOption)?.quantity);
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (product.selectableOptions?.length > 0 && !selectedOption) {
      setError("Please select an option before adding to cart.");
      return;
    }

    const selectedOptionDetails = product.selectableOptions.find(option => option.value === selectedOption);
    if (selectedOptionDetails && quantity > selectedOptionDetails.quantity) {
      setError(`Only ${selectedOptionDetails.quantity} items available.`);
      return;
    }

    const itemToAdd = {
      ...product,
      quantity,
      selectedOption,
      maxQuantity: selectedOptionDetails?.quantity,
    };
    dispatch(addToCart(itemToAdd));
    setSuccessMessage(`"${product.title}" added to cart!`);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const selectedOptionDetails = product.selectableOptions?.find(option => option.value === selectedOption);

  return (
    <div className="item-page">
      <div className="product-image-container">
        <img src={product.imageUrl} alt={product.title} className="product-image" />
      </div>
      <div className="product-info">
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        <p>Release Date: {new Date(product.releaseDate).toLocaleDateString()}</p>

        <div className="fields">
          <div className="field">
            <label>Countable field</label>
            <input 
              type="number" 
              value={quantity} 
              onChange={handleQuantityChange} 
              min="1" 
              max={selectedOptionDetails?.quantity}  
              placeholder="1" 
            />
          </div>

          {product.selectableOptions?.length > 0 && (
            <div className="field">
              <label>Selectable Field</label>
              <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                <option value="">Select</option>
                {product.selectableOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} - {option.quantity} available
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}
        {selectedOptionDetails && (
          <p className="availability-message">
            Available for selected option: {selectedOptionDetails.quantity} items
          </p>
        )}

        <p className="product-price">Price: ${product.price}</p>
        <p className="product-total-price">Total Price: ${totalPrice.toFixed(2)}</p>

        <div className="buttons">
          <button className="buy-button" onClick={handleAddToCart}>Add to Cart</button>
          <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>
        </div>
        
        {successMessage && <div className="success-message">{successMessage}</div>}
      </div>
    </div>
  );
};

export default ItemPage;
