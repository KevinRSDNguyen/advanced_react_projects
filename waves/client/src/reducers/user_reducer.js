import {
  LOGOUT_USER,
  AUTH_USER,
  ADD_TO_CART_USER,
  GET_CART_ITEMS_USER,
  REMOVE_CART_ITEM_USER
} from "../actions/types";

const initialState = {
  userData: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case AUTH_USER:
      return { ...state, userData: action.payload };
    case LOGOUT_USER:
      return { ...state, userData: {} };
    case ADD_TO_CART_USER:
      return {
        ...state,
        userData: {
          ...state.userData,
          cart: action.payload
        }
      };
    case GET_CART_ITEMS_USER:
      return { ...state, cartDetail: action.payload };
    case REMOVE_CART_ITEM_USER:
      return {
        ...state,
        cartDetail: action.payload.cartDetail,
        userData: {
          ...state.userData,
          cart: action.payload.cart
        }
      };
    default:
      return state;
  }
}
