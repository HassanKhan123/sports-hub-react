import React, { Component } from "react";
import swal from "sweetalert2";
import { Link } from "react-router-dom";

import firebase from "../../config/firebase";
import Header from "../../components/Header";
import "../../index.css";

class RegisterCompany extends Component {
  state = {
    email: "",
    password: "",
    companyName: "",
    loading: false
  };

  changeHandler = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  loginHandler = async e => {
    const { email, password, companyName } = this.state;
    e.preventDefault();
    if (email === "" || password === "" || companyName === "") {
      swal.fire("Error", "Please fill all the fields", "error");
    } else {
      try {
        this.setState({ loading: true });
        await firebase.signInFirebase(email, password, companyName);
        swal.fire(
          "Successfully SignUp",
          "You are now redirected to login Page",
          "success"
        );
        this.setState(
          {
            companyName: "",
            email: "",
            password: "",
            loading: false
          },
          () => {
            this.props.history.replace("/login-company");
          }
        );
      } catch (e) {
        console.log(e);
        swal.fire("Error", e.message, "error");
        this.setState({
          companyName: "",
          email: "",
          password: "",
          loading: false
        });
      }
    }
    // this.setState({loading:true});
    // console.log('form submitted')
  };

  render() {
    const { email, password, companyName } = this.state;
    return (
      <div>
        <Header />
        <div className="center">
          {this.state.loading ? (
            <img
              src={require("../../assets/images/spinner.gif")}
              width="100"
              style={{ position: "fixed", top: 270, left: 630 }}
            />
          ) : null}
        </div>
        <div className="center">
          <img
            src={require("../../assets/images/company.png")}
            className="img"
            style={{ width: "120px" }}
          />

          <div className="row">
            <div className="container">
              <form className="col s12" onSubmit={this.loginHandler}>
                <div className="row">
                  <div className="input-field col s6 l12">
                    <input
                      id="companyName"
                      type="text"
                      value={companyName}
                      onChange={this.changeHandler}
                    />
                    <label htmlFor="companyName">Company Name</label>
                  </div>
                </div>

                <div className="row">
                  <div className="input-field col s6">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={this.changeHandler}
                    />
                    <label htmlFor="email">Email</label>
                  </div>
                  <div className="input-field col s6">
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={this.changeHandler}
                    />
                    <label htmlFor="password">Password</label>
                  </div>
                </div>

                <div className="center">
                  <button className="btn green">Register</button>
                  <Link to="/login-company" className="link">
                    Company already registered? Login now
                  </Link>
                </div>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    );
  }
}

export default RegisterCompany;
