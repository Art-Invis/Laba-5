// actions.js
import { fetchCart, updateCart } from '../api';

export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
export const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';
export const SET_ERROR = 'SET_ERROR'; 
// actions.js
export const LOAD_CART = 'LOAD_CART';

// Action Creator
export const loadCart = (cart) => ({
  type: LOAD_CART,
  payload: cart,
});

export const loadCartFromBackend = (token) => {
  return async (dispatch) => {
    try {
      const response = await fetchCart(token);
      dispatch(loadCart(response.items || [])); // Передаємо масив `items`, якщо він є
    } catch (error) {
      console.error("Error loading cart from backend:", error);
    }
  };
};


export const updateCartBackend = (product, token) => {
  return async (dispatch) => {
    try {
      const updatedCart = await updateCart([product], token);
      dispatch(loadCart(updatedCart.cart));
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };
};

export const addToCart = (product) => {
  return (dispatch, getState) => {
    const { cart } = getState();
    const existingItem = cart.find(
      (item) => item.id === product.id && item.selectedOption === product.selectedOption
    );

    if (existingItem) {
      const maxQuantity = product.selectableOptions.find(
        (option) => option.value === product.selectedOption
      )?.quantity;

      if (existingItem.quantity + product.quantity > maxQuantity) {
        alert(`Cannot add more than ${maxQuantity} of ${product.title} (${product.selectedOption})`);
        return;
      }
    }

    dispatch({
      type: ADD_TO_CART,
      payload: product,
    });
  };
};


export const removeFromCart = (product) => ({
  type: REMOVE_FROM_CART,
  payload: product,
});

export const updateQuantity = (productId, selectedOption, quantity) => {
  return (dispatch, getState) => {
    const { cart } = getState();
    const item = cart.find(
      (item) => item.id === productId && item.selectedOption === selectedOption
    );

    if (item) {
      const maxQuantity = item.selectableOptions.find(
        (option) => option.value === selectedOption
      )?.quantity;

      if (quantity > maxQuantity) {
        dispatch(setError(`Cannot update quantity beyond ${maxQuantity} for ${item.title} (${selectedOption})`));
        return;
      }
    }

    dispatch({
      type: UPDATE_QUANTITY,
      payload: { productId, selectedOption, quantity },
    });
  };
};

export const clearCart = () => {
  return {
    type: 'CLEAR_CART',
  };
};

export const fetchProducts = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_PRODUCTS_REQUEST });

    try {
      const response = await fetch('http://localhost:3001/api/items');
      const data = await response.json();
      dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: FETCH_PRODUCTS_FAILURE, error: error.message });
    }
  };
};


export const setError = (error) => ({
  type: SET_ERROR,
  payload: error,
});

export const clearError = () => ({
  type: SET_ERROR,
  payload: null,
});
