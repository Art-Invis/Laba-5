import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_QUANTITY, LOAD_CART } from './actions';

const initialState = {
  cart: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      console.log("Adding to cart:", action.payload);
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };

    case LOAD_CART:
      console.log("Loading cart:", action.payload);
      return {
        ...state,
        cart: Array.isArray(action.payload) ? action.payload : [],
      };


    case REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(
          (item) => item.id !== action.payload.id || item.selectedOption !== action.payload.selectedOption
        ),
      };

    case UPDATE_QUANTITY:
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.productId && item.selectedOption === action.payload.selectedOption
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    

    default:
      return state;
  }
};

export default rootReducer;
