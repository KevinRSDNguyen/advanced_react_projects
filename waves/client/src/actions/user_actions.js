import axios from "axios";
import {
  AUTH_USER,
  LOGOUT_USER,
  ADD_TO_CART_USER,
  GET_CART_ITEMS_USER,
  REMOVE_CART_ITEM_USER,
  ON_SUCCESS_BUY_USER
} from "./types";
import { USER_SERVER, PRODUCT_SERVER } from "../components/utils/misc";

export const registerUser = dataToSubmit => {
  return axios
    .post(`${USER_SERVER}/register`, dataToSubmit)
    .then(response => response.data)
    .catch(err => Promise.reject(err.response.data.errors));
};

export const loginUser = dataToSubmit => {
  return axios
    .post(`${USER_SERVER}/login`, dataToSubmit)
    .then(({ data }) => {
      return data;
    })
    .catch(err => {
      return Promise.reject(err.response.data.errors);
    });
};

export const auth = () => dispatch => {
  axios
    .get(`${USER_SERVER}/auth`)
    .then(response => {
      dispatch({
        type: AUTH_USER,
        payload: response.data
      });
    })
    .catch(err => {});
};

export const logoutUser = () => dispatch => {
  axios
    .get(`${USER_SERVER}/logout`)
    .then(response =>
      dispatch({
        type: LOGOUT_USER
      })
    )
    .catch(err => {});
};

export const addToCart = _id => dispatch => {
  axios
    .post(`${USER_SERVER}/addToCart?productId=${_id}`)
    .then(({ data }) =>
      dispatch({
        type: ADD_TO_CART_USER,
        payload: data
      })
    )
    .catch(err => {});
};

//First is unique product id's, second is user's cart with quanitities
export const getCartItems = (cartItems, userCart) => dispatch => {
  return (
    axios
      //Template string sturns array of stings into 1 str
      .get(`${PRODUCT_SERVER}/articles_by_id?id=${cartItems}&type=array`)
      .then(({ data }) => {
        userCart.forEach(item => {
          data.forEach((k, i) => {
            if (item.id === k._id) {
              data[i].quantity = item.quantity;
            }
          });
        });
        dispatch({
          type: GET_CART_ITEMS_USER,
          payload: data
        });
        return "Done";
      })
      .catch(err => {
        return Promise.reject(err.response.data.errors);
      })
  );
};

export const removeCartItem = id => dispatch => {
  return axios
    .get(`${USER_SERVER}/removeFromCart?_id=${id}`)
    .then(({ data }) => {
      data.cart.forEach(item => {
        data.cartDetail.forEach((k, i) => {
          if (item.id === k._id) {
            data.cartDetail[i].quantity = item.quantity;
          }
        });
      });
      dispatch({
        type: REMOVE_CART_ITEM_USER,
        payload: data
      });
      return "Done";
    })
    .catch(err => {
      return Promise.reject(err.response.data.errors);
    });
};

export const onSuccessBuy = data => dispatch => {
  return axios
    .post(`${USER_SERVER}/successBuy`, data)
    .then(({ data }) => {
      dispatch({
        type: ON_SUCCESS_BUY_USER,
        payload: data
      });
      return "Done";
    })
    .catch(err => {
      return Promise.reject(err.response.data.errors);
    });
};

export const updateUserData = dataToSubmit => {
  return axios
    .post(`${USER_SERVER}/update_profile`, dataToSubmit)
    .then(({ data }) => {
      return "Done";
    })
    .catch(err => {
      return Promise.reject(err.response.data.errors);
    });
};
