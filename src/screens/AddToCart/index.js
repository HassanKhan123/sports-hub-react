import React, { Component } from "react";
import * as firebase from "firebase";
import { connect } from "react-redux";

import Header from "../../components/Header";
class AddToCart extends Component {
  state = {
    cartItems: [],
    cartLength:0,
    loading:true
  };
  async componentDidMount() {
    const data = await firebase
      .firestore()
      .collection("users")
      .doc(this.props.userID)
      .get();
    this.setState({
      cartItems: [...this.state.cartItems, data.data().cartItems],
      cartLength:data.data().cartItems.length,
      loading:false
    });
  }

  render() {
    console.log(this.state.cartLength);
    const items = this.state.cartLength !==0? (this.state.cartItems.map(item => {
      return item.map(i => {
        return (
          <li className="collection-item avatar" key={Math.random()}>
            <img src={i.productImage} alt="" class="circle" />
            <div>
              {i.productName}
              <a href="#!" className="secondary-content">{i.productPrice}</a>
            </div>
          </li>
        );
      });
    })) : (<li className="collection-item">
        <h4 className="center">Your cart is empty</h4>
    </li>)
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
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userID: state.userReducer.userID
  };
};

export default connect(mapStateToProps, {})(AddToCart);
