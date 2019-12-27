import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import swal from "sweetalert2";
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
    categorySearch: "cricket"
  };

  cart = async (item, index) => {
    console.log(item.productName);
    console.log(item.price);
    console.log(item.category);

    var obj = {
      productName: item.productName,
      productPrice: item.price,
      productCategory: item.category,
      productImage: item.productImage
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
          this.props.history.replace("/login");
        }
      );
    } catch (e) {
      swal.fire("Error", e.message, "error");
    }
  };

  async componentDidMount() {
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
    } catch (e) {
      swal.fire("Error", e.message, "error");
    }

    // const items = await firebase.firestore().collection('users').doc(this.props.userID).get();
    // console.log(items.data());
    // this.props.cartProducts.push(items.data().cartItems);
  }

  searchChangeHandler = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  searchHandler = async e => {
    e.preventDefault();
    console.log("form");
    this.setState({ loading: true, searchProducts: [] });
    if (this.state.search === "") {
      this.setState({ searchProducts: [],loading:false });
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
              .where("category", "==", this.state.categorySearch)
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
    document.addEventListener("DOMContentLoaded", function() {
      var elems = document.querySelectorAll("select");
      var instances = M.FormSelect.init(elems);
    });

    const featuerd = (
      <div style={{ alignSelf: "center" }}>
        <div className="col s12 l6" style={{ width: 500 }} key={Math.random()}>
          <h4>Featured Product</h4>
          <div className="card">
            <div className="card-image">
              <img src={this.props.featuredProducts.productImage} width="100" />
            </div>
            <div className="card-content">
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
        <div>
          <div className="col s12 l4" key={Math.random()}>
            <div className="card">
              <div className="card-image">
                <img src={item.productImage} width="100" />
              </div>
              <div className="card-content">
                <p>Name: {item.productName}</p>
                <p>Price: {item.price}</p>
                <p>Category: {item.category}</p>
                <p>Company: {item.companyName}</p>
              </div>
              <div className="card-action">
                {this.props.isUser ? (
                  <button
                    className="btn"
                    onClick={() => this.cart(item, index)}
                  >
                    Add to cart
                  </button>
                ) : (
                  <button className="btn disabled">Add to cart</button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    });

    const showSearch = this.state.searchProducts.map((item, index) => {
      return (
        <div>
          <div className="col s12 l4" key={Math.random()}>
            <div className="card">
              <div className="card-image">
                <img src={item.productImage} width="100" />
              </div>
              <div className="card-content">
                <p>Name: {item.productName}</p>
                <p>Price: {item.price}</p>
                <p>Category: {item.category}</p>
                <p>Company: {item.companyName}</p>
              </div>
              <div className="card-action">
                {this.props.isUser ? (
                  <button
                    className="btn"
                    onClick={() => this.cart(item, index)}
                  >
                    Add to cart
                  </button>
                ) : (
                  <button className="btn disabled">Add to cart</button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    });
    return (
      <div>
        <div className="navbar-fixed">
          <nav className="green">
            <div className="container">
              <div className="nav-wrapper">
                <Link to="/" className="brand-logo">
                  Sports Hub
                </Link>
                <ul className="right hide-on-med-and-down">
                  <li>
                    <Link to="/register-company">Register Your Company</Link>
                  </li>

                  {!this.props.isUser ? (
                    <li>
                      <Link to="/login">Login</Link>
                    </li>
                  ) : null}
                  {this.props.isUser ? (
                    <li>
                      <button className="btn green" onClick={this.logout}>
                        Logout
                      </button>
                    </li>
                  ) : null}

                  {this.props.isUser ? (
                    <li>
                      <Link to="/cart">
                        <i className="medium material-icons">
                          add_shopping_cart
                        </i>
                        {/* <img src={require('../../assets/images/shopping-cart-128.png')} style={{width:40,borderRadius:'50%'}}/> */}
                      </Link>
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
          </nav>
        </div>

        <div style={{ margin: 30 }}>
          <nav className="search white">
            <div className="nav-wrapper">
              <form onSubmit={this.searchHandler} className="col s12">
                <div className="row">
                  <label
                    className="label-icon col s2 center"
                    style={{ marginTop: -8 }}
                    htmlFor="search"
                    onClick={this.searchHandler}
                  >
                    <i className="material-icons">search</i>
                  </label>
                  <div className="input-field col s2">
                    <select
                      onChange={this.searchChangeHandler}
                      id="categorySearch"
                    >
                      <option value="cricket">Cricket</option>
                      <option value="football">Football</option>
                      <option value="hockey">Hockey</option>
                    </select>
                  </div>
                  <div className="input-field col s5" style={{ marginTop: 8 }}>
                    <input
                      id="search"
                      type="search"
                      value={search}
                      placeholder="Search Products by Name"
                      onChange={this.searchChangeHandler}
                    />
                  </div>
                </div>
              </form>
            </div>
          </nav>
        </div>

        <div className="row">
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

              <div>
                <h3
                  style={{
                    backgroundColor: "black",
                    padding: 20,
                    color: "white",
                    opacity: 0.7,
                    textAlign: "center"
                  }}
                >
                  All Products
                </h3>
                {this.state.loading ? (
                  <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                  <img
                    src={require("../../assets/images/spinner.gif")}
                    width="100"
                  
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
    cartProduct: state.userReducer.cartProduct,
    featuredProducts: state.vendorReducer.featuredProducts
  };
};

const mapDispatchToProps = {
  logout: logingOutActions.loggingOut
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
