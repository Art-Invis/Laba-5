// CategoryCard.js
import React from 'react';
import '../styles/Categories.css';

const CategoryCard = ({ imgSrc, title, features }) => (
  <div className="category-card">
    <img src={imgSrc} alt={title} />
    <h3>{title}</h3>
    <ul>
      {features.map((feature, index) => (
        <li key={index}>{feature}</li>
      ))}
    </ul>
  </div>
);

export default CategoryCard;
