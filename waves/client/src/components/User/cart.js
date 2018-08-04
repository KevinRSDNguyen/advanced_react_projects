import React, { Component } from "react";
import UserLayout from "../../hoc/user";

import { connect } from "react-redux";
import { getCartItems } from "../../actions/user_actions";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faFrown from "@fortawesome/fontawesome-free-solid/faFrown";
import faSmile from "@fortawesome/fontawesome-free-solid/faSmile";

class UserCart extends Component {
  state = {
    loading: true,
    total: 0,
    showTotal: false, //Set to true when transaction clears
    showSuccess: false
  };
  componentDidMount() {
    let cartItems = [];
    let {
      user: {
        userData: { cart }
      }
    } = this.props;

    if (cart && cart.length > 0) {
      cart.forEach(item => {
        cartItems.push(item.id);
      });
      this.props
        //ids of each unique product, then current cart that only has IDs of prod
        .getCartItems(cartItems, cart)
        .then(() => {
          if (this.props.user.cartDetail.length > 0) {
            //cartDetail contains all info about product, unlike cart which is just id and quant
            // this.calculateTotal(user.cartDetail);
          }
        });
    }
  }

  render() {
    return (
      <UserLayout>
        <div>
          <p>User Cart</p>
        </div>
      </UserLayout>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(
  mapStateToProps,
  { getCartItems }
)(UserCart);
