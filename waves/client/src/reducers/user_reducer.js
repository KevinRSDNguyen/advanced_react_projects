import { LOGIN_USER, FAIL_LOGIN_USER } from "../actions/types";

const initialState = {
  loginSucces: undefined,
  userData: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loginSucces: action.payload };
    case FAIL_LOGIN_USER:
      return { ...state, loginSucces: false };
    default:
      return state;
  }
}
