import axios from "axios";
import { AUTH_USER, LOGOUT_USER } from "./types";
import { USER_SERVER } from "../components/utils/misc";

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
