import axios from "axios";
import {
  GET_PRODUCTS_BY_SELL,
  GET_PRODUCTS_BY_ARRIVAL,
  GET_BRANDS,
  GET_WOODS,
  GET_PRODUCTS_TO_SHOP
} from "./types";

import { PRODUCT_SERVER } from "../components/utils/misc";

export const getProductsBySell = () => dispatch => {
  axios
    .get(`${PRODUCT_SERVER}/articles?sortBy=sold&order=desc&limit=4`)
    .then(({ data }) =>
      dispatch({
        type: GET_PRODUCTS_BY_SELL,
        payload: data
      })
    );
};

export const getProductsByArrival = () => dispatch => {
  axios
    .get(`${PRODUCT_SERVER}/articles?sortBy=createdAt&order=desc&limit=4`)
    .then(({ data }) =>
      dispatch({
        type: GET_PRODUCTS_BY_ARRIVAL,
        payload: data
      })
    );
};

export const getProductsToShop = (
  skip,
  limit,
  filters = [],
  previousState = []
) => dispatch => {
  const data = {
    limit,
    skip,
    filters
  };

  return axios
    .post(`${PRODUCT_SERVER}/shop`, data)
    .then(response => {
      let newState = [...previousState, ...response.data.articles];
      dispatch({
        type: GET_PRODUCTS_TO_SHOP,
        payload: {
          size: response.data.size,
          articles: newState
        }
      });
      return "Done";
    })
    .catch(err => {});
};

export const addProduct = datatoSubmit => {
  return axios
    .post(`${PRODUCT_SERVER}/article`, datatoSubmit)
    .then(response => response.data)
    .catch(err => Promise.reject(err.response.data.errors));
};

export const getBrands = () => dispatch => {
  return axios
    .get(`${PRODUCT_SERVER}/brands`)
    .then(({ data }) => {
      dispatch({
        type: GET_BRANDS,
        payload: data
      });
      return "done";
    })
    .catch(err => {});
};

export const getWoods = () => dispatch => {
  return axios
    .get(`${PRODUCT_SERVER}/woods`)
    .then(({ data }) => {
      dispatch({
        type: GET_WOODS,
        payload: data
      });
      return "done";
    })
    .catch(err => {});
};
