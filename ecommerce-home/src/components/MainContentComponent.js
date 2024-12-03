import React from 'react';
import '../styles/MainContent.css'; // Importing styles
import '../styles/App.css';

const MainContent = () => {
  return (
    <section className="main-content">
      <div className="promo-banner">
        <div className="promo-img">
          {/* Correcting the image source path */}
          <img src="/discover.jpg" alt="Promo Album" />
        </div>
        <div className="promo-text">
          <h1>Discover the World of Music with New Albums and Exclusive Merch from Your Favorite Artists!</h1>
          <p>
            Don't miss out on your chance to grab concert tickets, the latest releases, and official merch 
            that brings you closer to your idols. Music unites us all, and our collection offers unique 
            experiences and unforgettable emotions. From limited-edition vinyl to exclusive artist bundles, 
            explore everything that makes the music world so special!
          </p>
          <p className="bordered">
            Stay ahead of the curve by exploring our hand-picked recommendations, and be the first to know 
            about upcoming live shows and exclusive drops from top performers. Let music be your journey, and 
            our store your trusted companion on this exciting adventure!
          </p>
        </div>
      </div>
    </section>
  );
}

export default MainContent;
