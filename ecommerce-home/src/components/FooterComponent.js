import React from 'react';
import '../styles/Footer.css'; // Importing the CSS for the footer

const Footer = () =>  {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Перший блок - Лого та Назва */}
        <div className="footer-block">
          <h2><i className="fas fa-headphones-alt"></i> Music World</h2>
        </div>

        {/* Другий блок - Текстове повідомлення */}
        <div className="footer-block">
          <p>
            Let music be your journey, and our store your trusted companion on this exciting adventure!
          </p>
        </div>

        {/* Третій блок - Соціальні іконки */}
        <div className="footer-block social-icons">
          <a href="https://www.facebook.com"><img src="/facebook.png" alt="facebook.svg"/></a>
          <a href="https://www.linkedin.com"><img src="/linkedin.png" alt="linkedin.svg"/></a>
          <a href="https://twitter.com"><img src="/twitter.png" alt="twitter"/></a>
          <a href="https://www.youtube.com"><img src="/youtube.png" alt="youtube"/></a>
          <a href="https://www.instagram.com"><img src="/instagram.png" alt="instagram"/></a>
        </div>
      </div>
      <hr/>
      <div className="footer-bottom">
        <p>2024 IoT © Copyright all rights reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
