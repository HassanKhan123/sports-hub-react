import React, { Component } from "react";
import * as firebase from "firebase";
import { Link } from "react-router-dom";
import firebaseActions from "../../config/firebase";

import swal from "sweetalert2";

import "./style.css";

class adminPanel extends Component {
  state = {
    saledProducts: [],
    loading: true
  };
  async componentDidMount() {
    try {
      await firebase
        .firestore()
        .collection("ratedItems")
        .get()
        .then(doc => {
          doc.docs.forEach(data => {
            console.log(data.data());
            this.setState({
              saledProducts: [...this.state.saledProducts, data.data()]
            });
          });
        });
      this.setState({ loading: false });
    } catch (error) {
      swal.fire("Error", error.message, "error");
      this.setState({ loading: false });
    }
  }
  logout = async () => {
    this.setState({ loading: true });
    try {
      await firebaseActions.signOutFirebase();
      swal.fire(
        "Successfully Logged out",
        "You are now redirected to Home page",
        "success"
      );
      this.setState(
        {
          loading: false
        },
        () => {
          this.props.history.replace("/");
        }
      );
    } catch (e) {
      swal.fire("Error", e.message, "error");
    }
  };

  render() {
    const showSaled = this.state.saledProducts.map((item, index) => {
      return (
        <div key={Math.random()}>
          <div className='col s12 m6 l3'>
            <div className='card' style={{ marginLeft: 20 }}>
              <div className='card-image'>
                <img src={item.productImage} width='100' />
              </div>
              <div className='card-content'>
                <p>Name: {item.productName}</p>
                <p>Price: {item.productPrice}</p>
                <p>Category: {item.productCategory}</p>
                <p>
                  Rating:{" "}
                  <div class='stars-outer'>
                    <div
                      class='stars-inner'
                      style={{
                        width: `${Math.round(
                          ((item.productRating / 5) * 100) / 10
                        ) * 10}%`
                      }}
                    ></div>
                  </div>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    });
    return (
      <div>
        <div className='navbar-fixed'>
          <nav className='green'>
            <div className='container'>
              <div className='nav-wrapper'>
                <Link to='/' className='brand-logo'>
                  Sports Hub
                </Link>
                <ul className='right hide-on-med-and-down'>
                  <li>
                    <button className='btn green' onClick={this.logout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
        <h3 className='center'>Welcome Admin</h3>
        <div className='center'>
          <Link style={{ color: "black" }} to='/vendors/products'>
            See all products by company name ?{" "}
          </Link>
        </div>
        <h4>All Saled Products</h4>
        {this.state.loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <img src={require("../../assets/images/spinner.gif")} width='100' />
          </div>
        ) : null}
        <div className='row'>{showSaled}</div>
      </div>
    );
  }
}

export default adminPanel;
