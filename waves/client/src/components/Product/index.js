import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import PageTop from "../utils/page_top";
import ProdNfo from "./prodNfo";
import ProdImg from "./prodImg";

import { connect } from "react-redux";
import { addToCart } from "../../actions/user_actions";
import {
  getProductDetail,
  clearProductDetail
} from "../../actions/products_actions";

class ProductPage extends Component {
  componentDidMount() {
    const id = this.props.match.params.id;
    this.props
      .getProductDetail(id)
      .then(() => {})
      .catch(err => {
        toast.error(
          "Could not find product with that id. Redirecting back to home page in a few seconds"
        );
        setTimeout(() => {
          this.props.history.push("/");
        }, 4000);
      });
  }
  componentWillUnmount() {
    this.props.clearProductDetail();
  }
  addToCartHandler(id) {
    this.props.addToCart(id);
  }
  render() {
    return (
      <div>
        <ToastContainer />
        <PageTop title="Product detail" />
        <div className="container">
          {this.props.products.prodDetail ? (
            <div className="product_detail_wrapper">
              <div className="left">
                <div style={{ width: "500px" }}>
                  <ProdImg detail={this.props.products.prodDetail} />
                </div>
              </div>
              <div className="right">
                <ProdNfo
                  addToCart={id => this.addToCartHandler(id)}
                  detail={this.props.products.prodDetail}
                />
              </div>
            </div>
          ) : (
            "Loading"
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.products
  };
};

export default connect(
  mapStateToProps,
  { getProductDetail, clearProductDetail, addToCart }
)(ProductPage);
