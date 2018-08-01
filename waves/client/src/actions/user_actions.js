import axios from "axios";
import { LOGIN_USER, FAIL_LOGIN_USER } from "./types";
import { USER_SERVER, PRODUCT_SERVER } from "../components/utils/misc";

export const registerUser = dataToSubmit => {
  return axios
    .post(`${USER_SERVER}/register`, dataToSubmit)
    .then(response => response.data)
    .catch(err => Promise.reject(err.response.data.errors));
};

export const loginUser = (dataToSubmit, history) => dispatch => {
  axios
    .post(`${USER_SERVER}/login`, dataToSubmit)
    .then(({ data }) => {
      history.push("/user/dashboard");
      dispatch({ type: LOGIN_USER, payload: data });
    })
    .catch(err => {
      dispatch({ type: FAIL_LOGIN_USER });
    });
};
