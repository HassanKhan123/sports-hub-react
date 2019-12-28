import React, { Component } from "react";
import { connect } from "react-redux";
import swal from "sweetalert2";
import { Link } from "react-router-dom";
import firebase from "../../config/firebase";
import Select from "react-select";
// import M from 'materialize-css';
// import M from "materialize-css";
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'materialize-css/dist/css/materialize.min.css'
import "../../config/materialize";
// import $ from 'jquery'
// import $ from "jquery";

class AddProduct extends Component {
  state = {
    productName: "",
    price: 0,
    productImage: "",
    category: "cricket",
    loading: false
  };

  componentDidMount() {}

  logout = async () => {
    this.setState({ loading: true });
    try {
      await firebase.signOutFirebase();
      swal.fire(
        "Successfully Logged out",
        "You are now redirected to login page",
        "success"
      );
      this.setState(
        {
          loading: false
        },
        () => {
          this.props.history.replace("/login-company");
        }
      );
    } catch (e) {
      swal.fire("Error", e.message, "error");
    }
  };

  selectChangeHandler = category => {
    console.log(category)
    this.setState({
      category:category.value
    });

  };

  changeHandler = e => {
    // const [id,value] = e.target;
    if (e.target.id === "productImage") {
      console.log(e.target.files);
      return this.setState({
        productImage: e.target.files[0]
      });
    }
    this.setState({
      [e.target.id]: e.target.value
    });
  };
  submitHandler = async e => {
    e.preventDefault();
    console.log(this.state);
    const { productName, price, productImage, category } = this.state;
    const credientials = {
      productName,
      price,
      productImage,
      category
    };

    if (productName === "" || price === 0) {
      swal.fire("Error", "Please fill all the fields", "error");
    } else {
      try {
        this.setState({ loading: true });
        const response = await firebase.addProduct(
          credientials,
          this.props.vendorID
        );
        console.log(response);
        this.props.featuredProducts(response);
        this.setState({
          loading: false,
          productName: "",
          price: 0,
          productImage: ""
        });
        swal.fire("Success", "Product Added Successfully", "success");
      } catch (e) {
        swal.fire("Error", e.message, "error");
        this.setState({
          loading: false,
          productName: "",
          price: 0,
          productImage: ""
        });
      }
    }
  };
  render() {
    const { productName, price } = this.state;
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
                    <button className="btn green" onClick={this.logout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
        <div className="center">
          {this.state.loading ? (
            <img
              src={require("../../assets/images/spinner.gif")}
              width="100"
              style={{ position: "fixed", top: 270, left: 630 }}
            />
          ) : null}
        </div>
        <div className="container">
          <h5 className="center">Add New Product</h5>
          <div className="row">
            <div>
              <form className="col s12" onSubmit={this.submitHandler}>
                <div className="row">
                  <div className="input-field col s6">
                    <input
                      id="productName"
                      type="text"
                      className="validate"
                      value={productName}
                      onChange={this.changeHandler}
                    />
                    <label htmlFor="productName">Product Name</label>
                  </div>
                  <div className="input-field col s6">
                    <input
                      id="price"
                      type="number"
                      className="validate"
                      value={price}
                      onChange={this.changeHandler}
                    />
                    <label htmlFor="price">Price</label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s12">
                    <Select
                      value={this.state.category}
                      onChange={this.selectChangeHandler}
                      options={[
                       
                        { value: "cricket", label: "Cricket" },
                        { value: "hockey", label: "Hockey" },
                        { value: "football", label: "Football" }
                      ]}
                    />
                    {/* <select onChange={this.selectChangeHandler}>
                      <option value="" disabled>
                        Product Category
                      </option>
                      <option value="cricket">Cricket</option>
                      <option value="football">Football</option>
                      <option value="hockey">Hockey</option>
                    </select> */}
                    {/* <label>Select Product Category</label> */}
                  </div>
                </div>

                <div className="row">
                  <div className="file-field input-field">
                    <div className="btn green">
                      <span>Product's Image</span>
                      <input
                        type="file"
                        id="productImage"
                        onChange={this.changeHandler}
                      />
                    </div>
                    <div className="file-path-wrapper">
                      <input className="file-path validate" type="text" />
                    </div>
                  </div>
                </div>

                <div className="center">
                  <button className="btn green">Add Product</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    vendorID: state.vendorReducer.vendorID
  };
};

const mapDispatchToProps = dispatch => {
  return {
    featuredProducts: credientials =>
      dispatch({
        type: "FEATURED_PRODUCT",
        payload: {
          data: credientials
        }
      })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddProduct);
