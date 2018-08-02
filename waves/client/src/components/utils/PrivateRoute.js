import React from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";

const PrivateRoute = ({ component: Component, user, adminRoute, ...rest }) => {
  const { isAuth, isAdmin } = user.userData;
  if (adminRoute && !isAdmin && isAuth) {
    return <Redirect to="/user/dashboard" />;
  }
  return (
    <Route
      {...rest} //exact, path, etc.
      render={props => {
        //these props are match,history,location
        return isAuth === true ? (
          <Component {...props} user={user} />
        ) : (
          <Redirect to="/register_login" />
        );
      }}
    />
  );
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRouter(connect(mapStateToProps)(PrivateRoute));
