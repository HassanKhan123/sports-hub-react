import React, { Component } from "react";
import * as firebase from "firebase";
import StripeCheckout from "react-stripe-checkout";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import Header from "../../components/Header";
toast.configure();

class AddToCart extends Component {
  state = {
    cartItems: [],
    cartLength: 0,
    loading: true,
    cost: 0,
  };
  handleToken = async (token,addresses) => {
    const {cost} = this.state;
    const response = await axios.post(
      " https://stripe-paymnet-backend.herokuapp.com/checkout",
      { token,cost }
    );
    const { status } = response.data;
    console.log("Response:", response.data);
    if (status === "success") {
      toast("Success! Your items will be delievered to you in 2 buisness days", { type: "success" });
      this.setState({cartItems:[]});
      
      this.props.history.replace('/rating');
    } else {
      toast("Something went wrong", { type: "error" });
    }
  }
  async componentDidMount() {
    const data = await firebase
      .firestore()
      .collection("users")
      .doc(this.props.userID)
      .get();

    data.data().cartItems.map(cartItem => {
      console.log(this.state.cost);
      return this.setState({
        cost: this.state.cost + cartItem.productPrice
      });
    });
    console.log(data.data().cartItems);
    this.setState({
      cartItems: [...this.state.cartItems, data.data().cartItems],
      cartLength: data.data().cartItems.length,
      loading: false
    });
  }

  render() {
    console.log(this.state.cartLength);
    const items =
      this.state.cartLength !== 0 ? (
        this.state.cartItems.map(item => {
          return item.map(i => {
            return (
              <li className="collection-item avatar" key={Math.random()}>
                <img src={i.productImage} alt="" className="circle" />
                <div>
                  {i.productName}
                  <a href="#!" className="secondary-content">
                    {i.productPrice}
                  </a>
                </div>
              </li>
            );
          });
        })
      ) : (
        <li className="collection-item">
          <h4 className="center">Your cart is empty</h4>
        </li>
      );
    return (
      <div>
        <Header />
        {this.state.loading ? (
          <img
            src={require("../../assets/images/spinner.gif")}
            width="100"
            style={{ position: "fixed", top: 270, left: 630 }}
          />
        ) : null}
        <div className="container">
          <ul className="collection with-header">
            <li className="collection-header">
              <h4>Your Cart</h4>
            </li>
            {items}
            {this.state.cartLength !== 0 ? (
              <div className="center">
                <p>Total Cost is {this.state.cost}</p>
                <StripeCheckout
                  stripeKey="pk_test_f2BZQ4UzVo87lJJGHeHirViw00IkyuJdti"
                  token={this.handleToken}
                  billingAddress
                  shippingAddress
                  amount={this.state.cost*100}
                
                />
              </div>
            ) : null}
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userID: state.userReducer.userID,
    cartProduct:state.userReducer.cartProduct
  };
};



export default connect(mapStateToProps)(AddToCart);
