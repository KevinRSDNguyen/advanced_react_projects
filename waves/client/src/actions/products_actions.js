import axios from "axios";
import {
  GET_PRODUCTS_BY_SELL,
  GET_PRODUCTS_BY_ARRIVAL,
  GET_BRANDS,
  GET_WOODS
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

export const getBrands = () => dispatch => {
  axios
    .get(`${PRODUCT_SERVER}/brands`)
    .then(({ data }) =>
      dispatch({
        type: GET_BRANDS,
        payload: data
      })
    )
    .catch(err => {});
};

export const getWoods = () => dispatch => {
  axios
    .get(`${PRODUCT_SERVER}/woods`)
    .then(({ data }) =>
      dispatch({
        type: GET_WOODS,
        payload: data
      })
    )
    .catch(err => {});
};
