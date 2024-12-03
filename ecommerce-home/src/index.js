// src/index.js
import React from 'react'; 
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'; // Імпортуємо Provider з react-redux
import store from './redux/store'; // Імпортуємо store з файлу store.js

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}> {/* Додаємо Provider і передаємо store */}
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
