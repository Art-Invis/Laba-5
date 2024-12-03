import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import {thunk} from 'redux-thunk';


const loadCartFromLocalStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error("Error loading cart from LocalStorage", error);
    return [];
  }
};

const saveCartToLocalStorage = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to LocalStorage", error);
  }
};

const initialState = {
  cart: loadCartFromLocalStorage(),
};


const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(thunk)
);


store.subscribe(() => {
  const { cart } = store.getState();
  saveCartToLocalStorage(cart);
});

export default store;
