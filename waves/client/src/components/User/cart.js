import React, { Component } from "react";
import UserLayout from "../../hoc/user";
import UserProductBlock from "../utils/User/product_block";

import { connect } from "react-redux";
import { getCartItems, removeCartItem } from "../../actions/user_actions";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faFrown from "@fortawesome/fontawesome-free-solid/faFrown";
import faSmile from "@fortawesome/fontawesome-free-solid/faSmile";

//Pay pal sandbox
// AfvPdMknM6c-doO76N3XwuI_AG3j5hhu_Qb7AiWX940KLW1nWZhao_05bokMENukFC0B9d9pVNIgZ133
import Paypal from "../utils/paypal";

class UserCart extends Component {
  state = {
    loading: true,
    total: 0,
    showTotal: false, // Set to true once we calculate total and have unprocessed cart items
    showSuccess: false //Set to true when transaction clears and empty cart
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
            this.calculateTotal(this.props.user.cartDetail);
          }
        });
    }
  }
  calculateTotal = cartDetail => {
    let total = 0;

    cartDetail.forEach(item => {
      total += parseInt(item.price, 10) * item.quantity;
    });

    this.setState({
      total,
      showTotal: true
    });
  };
  removeFromCart = id => {
    this.props.removeCartItem(id).then(() => {
      if (this.props.user.cartDetail.length <= 0) {
        this.setState({
          showTotal: false
        });
      } else {
        this.calculateTotal(this.props.user.cartDetail);
      }
    });
  };
  showNoItemMessage = () => (
    <div className="cart_no_items">
      <FontAwesomeIcon icon={faFrown} />
      <div>You have no items</div>
    </div>
  );
  transactionError = data => {
    alert("Paypal error");
  };

  transactionCanceled = () => {
    alert("Transaction cancled");
  };

  transactionSuccess = data => {
    // this.props
    //   .dispatch(
    //     onSuccessBuy({
    //       cartDetail: this.props.user.cartDetail,
    //       paymentData: data
    //     })
    //   )
    //   .then(() => {
    //     if (this.props.user.successBuy) {
    //       this.setState({
    //         showTotal: false,
    //         showSuccess: true
    //       });
    //     }
    //   });
  };
  render() {
    return (
      <UserLayout>
        <div>
          <h1>My Cart</h1>
          <div className="user_cart">
            <UserProductBlock
              products={this.props.user}
              type="cart"
              removeItem={id => this.removeFromCart(id)}
            />
            {this.state.showTotal ? (
              <div>
                <div className="user_cart_sum">
                  <div>Total amount: $ {this.state.total}</div>
                </div>
              </div>
            ) : this.state.showSuccess ? (
              <div className="cart_success">
                <FontAwesomeIcon icon={faSmile} />
                <div>THANK YOU</div>
                <div>YOUR ORDER IS NOW COMPLETE</div>
              </div>
            ) : (
              this.showNoItemMessage()
            )}
          </div>
          {this.state.showTotal ? (
            <div className="paypal_button_container">
              <Paypal
                toPay={this.state.total}
                transactionError={data => this.transactionError(data)}
                transactionCanceled={data => this.transactionCanceled(data)}
                onSuccess={data => this.transactionSuccess(data)}
              />
            </div>
          ) : null}
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
  { getCartItems, removeCartItem }
)(UserCart);
