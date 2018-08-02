import { LOGOUT_USER, AUTH_USER } from "../actions/types";

const initialState = {
  userData: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case AUTH_USER:
      return { ...state, userData: action.payload };
    case LOGOUT_USER:
      return { ...state, userData: {} };
    default:
      return state;
  }
}
