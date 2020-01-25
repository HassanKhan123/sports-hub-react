import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import swal from "sweetalert2";
import Select from "react-select";
// import {Form} from 'materialize-css'
import * as firebase from "firebase";
import db from "../../config/firebase";
import M from "materialize-css";
import logingOutActions from "../../store/user/actions";

import "./index.css";

class Home extends Component {
  state = {
    loading: true,
    productsFetched: [],
    search: "",
    searchProducts: [],
    categorySearch: "cricket",
    ratedProducts: []
  };

  cart = async (item, index) => {
    console.log(item.productName);
    console.log(item.price);
    console.log(item.category);

    var obj = {
      productName: item.productName,
      productPrice: item.price,
      productCategory: item.category,
      productImage: item.productImage,
      productRating: item.rating,
      productCompany: item.companyName
    };
    console.log(obj);
    console.log(this.props.cartProduct);
    let arr = this.props.cartProduct;
    arr.push(obj);
    console.log(arr);
    console.log(typeof arr);
    try {
      this.setState({ loading: true });
      await firebase
        .firestore()
        .collection("users")
        .doc(this.props.userID)
        .set(
          {
            cartItems: arr
          },
          {
            merge: true
          }
        );
      this.setState({ loading: false });
      swal.fire("Success", "Product added to cart", "success");
    } catch (e) {
      this.setState({ loading: false });
      swal.fire("Error", e.message, "error");
    }
  };

  logout = async () => {
    this.setState({ loading: true });
    try {
      this.props.logout();

      this.setState(
        {
          loading: false
        },
        () => {
          this.props.history.replace("/signin");
        }
      );
    } catch (e) {
      swal.fire("Error", e.message, "error");
    }
  };

  async componentDidMount() {
    console.log(this.props.history);
    try {
      await firebase
        .firestore()
        .collection("vendors")
        .get()
        .then(doc => {
          doc.docs.forEach(data => {
            firebase
              .firestore()
              .collection("vendors")
              .doc(data.id)
              .collection("products")
              .get()
              .then(product => {
                product.docs.forEach(pro => {
                  firebase
                    .firestore()
                    .collection("vendors")
                    .doc(data.id)
                    .collection("products")
                    .doc(pro.id)
                    .get()
                    .then(item => {
                      this.setState({
                        productsFetched: [
                          ...this.state.productsFetched,
                          item.data()
                        ],
                        loading: false
                      });
                    });
                });
              });
          });
        });

      await firebase
        .firestore()
        .collection("ratedItems")
        .orderBy("productRating", "desc")
        .limit(4)
        .get()
        .then(doc => {
          doc.docs.forEach(data => {
            console.log(data.data());
            this.setState({
              ratedProducts: [...this.state.ratedProducts, data.data()]
            });
          });
        });
    } catch (e) {
      swal.fire("Error", e.message, "error");
    }

    // const items = await firebase.firestore().collection('users').doc(this.props.userID).get();
    // console.log(items.data());
    // this.props.cartProducts.push(items.data().cartItems);
  }

  searchNameHandler = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };
  searchChangeHandler = categorySearch => {
    this.setState({ categorySearch });
  };

  searchHandler = async e => {
    e.preventDefault();
    console.log("form");
    this.setState({ loading: true, searchProducts: [] });
    if (this.state.search === "") {
      this.setState({ searchProducts: [], loading: false });
    } else {
      await firebase
        .firestore()
        .collection("vendors")
        .get()
        .then(doc => {
          doc.docs.forEach(data => {
            firebase
              .firestore()
              .collection("vendors")
              .doc(data.id)
              .collection("products")
              .where("category", "==", this.state.categorySearch.value)
              .where("productName", "==", this.state.search)
              .get()
              .then(snapShot => {
                console.log(snapShot.docs);

                snapShot.forEach(doc => {
                  console.log(doc.id, " ", doc.data());
                  this.setState({
                    searchProducts: [...this.state.searchProducts, doc.data()],
                    loading: false
                  });
                });
              });
          });
        });
    }
  };

  render() {
    // document.addEventListener("DOMContentLoaded", function() {
    //   var elems = document.querySelectorAll("select");
    //   var instances = M.FormSelect.init(elems);
    // });

    const featuerd = (
      <div style={{ alignSelf: "center" }}>
        <div
          className='col s12 m6 l4'
          style={{ width: 500 }}
          key={Math.random()}
        >
          <h4>Featured Product</h4>
          <div className='card small'>
            <div className='card-image'>
              <img src={this.props.featuredProducts.productImage} width='100' />
            </div>
            <div className='card-content'>
              <p>Name: {this.props.featuredProducts.productName}</p>
              <p>Price: {this.props.featuredProducts.price}</p>
              <p>Category: {this.props.featuredProducts.category}</p>
              <p>Company: {this.props.featuredProducts.companyName}</p>
            </div>
            {/* <div className="card-action">
              {this.props.isUser ? (
                <button className="btn" onClick={() => this.cart(item, index)}>
                  Add to cart
                </button>
              ) : (
                <button className="btn disabled">Add to cart</button>
              )}
            </div> */}
          </div>
        </div>
      </div>
    );

    const { search } = this.state;
    const show = this.state.productsFetched.map((item, index) => {
      return (
        <div key={Math.random()}>
          <div className='col s12 m6 l3'>
            <div className='card' style={{ marginLeft: 20 }}>
              <div className='card-image'>
                <img src={item.productImage} width='100' />
              </div>
              <div className='card-content'>
                <p>Name: {item.productName}</p>
                <p>Price: {item.price}</p>
                <p>Category: {item.category}</p>
                <p>Company: {item.companyName}</p>
              </div>
              <div className='card-action'>
                {this.props.isUser ? (
                  <button
                    className='btn'
                    onClick={() => this.cart(item, index)}
                  >
                    Add to cart
                  </button>
                ) : (
                  <button className='btn disabled'>Add to cart</button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    });

    const showRated = this.state.ratedProducts.map((item, index) => {
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
                {/* <p>Rating: {item.productRating}</p> */}

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

    const showSearch = this.state.searchProducts.map((item, index) => {
      return (
        <div>
          <div className='col s12 l4' key={Math.random()}>
            <div className='card'>
              <div className='card-image'>
                <img src={item.productImage} width='100' />
              </div>
              <div className='card-content'>
                <p>Name: {item.productName}</p>
                <p>Price: {item.price}</p>
                <p>Category: {item.category}</p>
                <p>Company: {item.companyName}</p>
              </div>
              <div className='card-action'>
                {this.props.isUser ? (
                  <button
                    className='btn'
                    onClick={() => this.cart(item, index)}
                  >
                    Add to cart
                  </button>
                ) : (
                  <button className='btn disabled'>Add to cart</button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    });
    return (
      <div style={{ backgroundColor: "#F2F2F2" }}>
        <div className='navbar-fixed'>
          <nav className='green'>
            <div className='container'>
              <div className='nav-wrapper'>
                <Link to='/' className='brand-logo'>
                  Sports Hub
                </Link>
                <ul className='right hide-on-med-and-down'>
                  <li>
                    <Link to='/register-company'>Register Your Company</Link>
                  </li>

                  {!this.props.isUser ? (
                    <li>
                      <Link to='/login'>Login</Link>
                    </li>
                  ) : null}
                  {this.props.isUser ? (
                    <li>
                      <button className='btn green' onClick={this.logout}>
                        Logout
                      </button>
                    </li>
                  ) : null}

                  {this.props.isUser ? (
                    <li>
                      <Link to='/cart'>
                        <i className='medium material-icons'>
                          add_shopping_cart
                        </i>
                        {/* <img src={require('../../assets/images/shopping-cart-128.png')} style={{width:40,borderRadius:'50%'}}/> */}
                      </Link>
                    </li>
                  ) : null}
                  {this.props.isUser ? (
                    <li>logged in as {this.props.userName}</li>
                  ) : null}
                </ul>
              </div>
            </div>
          </nav>
        </div>

        <div style={{ margin: 30 }}>
          <nav className='search white'>
            <div className='nav-wrapper'>
              <form onSubmit={this.searchHandler} className='col s12'>
                <div className='row'>
                  <label
                    className='label-icon col s2 center'
                    style={{ marginTop: 8 }}
                    htmlFor='search'
                    onClick={this.searchHandler}
                  >
                    <i className='material-icons'>search</i>
                  </label>
                  <div className='input-field col s2'>
                    <Select
                      className='select'
                      value={this.state.selectedOption}
                      onChange={this.searchChangeHandler}
                      options={[
                        { value: "cricket", label: "Cricket" },
                        { value: "hockey", label: "Hockey" },
                        { value: "football", label: "Football" }
                      ]}
                    />
                  </div>
                  <div
                    className='input-field col s5'
                    style={{ marginTop: 22, marginLeft: 60 }}
                  >
                    <input
                      id='search'
                      type='search'
                      value={search}
                      placeholder='Search Products by Name'
                      onChange={this.searchNameHandler}
                      style={{ width: 200 }}
                    />
                  </div>
                </div>
              </form>
            </div>
          </nav>
        </div>

        <div className='row'>
          {this.state.searchProducts.length ? (
            showSearch
          ) : (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {featuerd}
              </div>

              <div style={{ width: "100%" }}>
                {this.state.ratedProducts.length ? (
                  <h4 style={{ marginLeft: 20 }}>Rated Products</h4>
                ) : null}

                {/* {this.state.loading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <img
                      src={require("../../assets/images/spinner.gif")}
                      width="100"
                    />
                  </div>
                ) : null} */}
                {showRated}
              </div>

              <div style={{ flex: 1 }}>
                <h4 style={{ marginLeft: 20 }}>All Products</h4>
                {this.state.loading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <img
                      src={require("../../assets/images/spinner.gif")}
                      width='100'
                    />
                  </div>
                ) : null}
                {show}
              </div>
            </div>
          )}
          {/* {this.state.searchProducts.length ? showSearch : } */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isUser: state.userReducer.isUser,
    userID: state.userReducer.userID,
    userName: state.userReducer.userName,
    cartProduct: state.userReducer.cartProduct,
    featuredProducts: state.vendorReducer.featuredProducts
  };
};

const mapDispatchToProps = {
  logout: logingOutActions.loggingOut
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
