import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { auth } from "./actions/user_actions";

import Layout from "./hoc/layout";
import PrivateRoute from "./components/utils/PrivateRoute";

//Public Routes
import Home from "./components/Home";
import RegisterLogin from "./components/Register_login";
import Register from "./components/Register_login/register";
import Shop from "./components/Shop";

//Private Routes
import UserDashboard from "./components/User";
import AddProduct from "./components/User/Admin/add_product";

class Routes extends Component {
  componentDidMount() {
    this.props.auth();
  }
  render() {
    return (
      <Layout>
        <Switch>
          <PrivateRoute
            path="/user/dashboard"
            exact
            component={UserDashboard}
          />
          <PrivateRoute
            path="/admin/add_product"
            exact
            adminRoute
            component={AddProduct}
          />
          <Route path="/register" exact component={Register} />
          <Route path="/register_login" exact component={RegisterLogin} />
          <Route path="/shop" exact component={Shop} />
          <Route path="/" exact component={Home} />
        </Switch>
      </Layout>
    );
  }
}

export default withRouter(
  connect(
    null,
    { auth }
  )(Routes)
);
