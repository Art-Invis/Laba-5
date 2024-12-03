import React, { useState } from 'react';
import '../styles/Categories.css';
import Button from './PrimaryButtonComponent.js';
import CategoryCard from './CategoryCard';
import categoriesData from './categoriesData';

const Categories = () => {
  const [showMore, setShowMore] = useState(false);

  const handleViewMore = () => {
    setShowMore(!showMore);
  };

  const visibleCategories = showMore ? categoriesData : categoriesData.slice(0, 3);

  return (
    <section className="categories">
      <h2>______________Our Product Categories:______________</h2>
      <div className="category-cards">
        {visibleCategories.map((category, index) => (
          <CategoryCard 
            key={index} 
            imgSrc={category.imgSrc} 
            title={category.title} 
            features={category.features} 
          />
        ))}
      </div>

      {/* Кнопка для перегляду більше/менше */}
      <Button onClick={handleViewMore} text={showMore ? 'View Less' : 'View More'} />
    </section>
  );
};

export default Categories;
