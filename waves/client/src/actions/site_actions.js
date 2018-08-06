import axios from "axios";
import { GET_SITE_DATA, UPDATE_SITE_DATA } from "./types";

import { SITE_SERVER } from "../components/utils/misc";

export const getSiteData = () => dispatch => {
  return axios
    .get(`${SITE_SERVER}/site_data`)
    .then(({ data }) => {
      dispatch({
        type: GET_SITE_DATA,
        payload: data
      });
      return "Done";
    })
    .catch(err => {
      return Promise.reject(err.response.data.errors);
    });
};

export const updateSiteData = dataToSubmit => dispatch => {
  return axios
    .post(`${SITE_SERVER}/site_data`, dataToSubmit)
    .then(({ data }) => {
      dispatch({
        type: UPDATE_SITE_DATA,
        payload: data
      });
      return "Done";
    })
    .catch(err => {
      return Promise.reject(err.response.data.errors);
    });
};
