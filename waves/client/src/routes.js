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
import ProductPage from "./components/Product";
import ResetUser from "./components/Reset_user"; //Generate resetToken
import ResetPass from "./components/Reset_user/reset_pass";
import PageNotFound from "./components/utils/page_not_found";

//Private Routes
import UserDashboard from "./components/User";
import AddProduct from "./components/User/Admin/add_product";
import ManageCategories from "./components/User/Admin/manage_categories";
import UserCart from "./components/User/cart";
import UpdateProfile from "./components/User/update_profile";
import ManageSite from "./components/User/Admin/manage_site";
import AddFile from "./components/User/Admin/add_file";

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
          <PrivateRoute path="/user/cart" exact component={UserCart} />
          <PrivateRoute
            path="/user/user_profile"
            exact
            component={UpdateProfile}
          />
          <PrivateRoute
            path="/admin/add_product"
            exact
            adminRoute
            component={AddProduct}
          />
          <PrivateRoute
            path="/admin/manage_categories"
            exact
            adminRoute
            component={ManageCategories}
          />
          <PrivateRoute
            path="/admin/site_info"
            exact
            adminRoute
            component={ManageSite}
          />
          <PrivateRoute
            path="/admin/add_file"
            exact
            adminRoute
            component={AddFile}
          />
          <Route path="/reset_user" exact component={ResetUser} />
          <Route path="/reset_password/:token" exact component={ResetPass} />
          <Route path="/product_detail/:id" exact component={ProductPage} />
          <Route path="/register" exact component={Register} />
          <Route path="/register_login" exact component={RegisterLogin} />
          <Route path="/shop" exact component={Shop} />
          <Route path="/" exact component={Home} />
          <Route component={PageNotFound} />
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
