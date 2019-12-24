import React, { Component } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert2";
import firebase from "../../config/firebase";
import Header from "../../components/Header";

import "../../index.css";
import "./style.css";

export default class Signin extends Component {
  state = {
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
    loading: false
  };

  changeHandler = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  submitHandler = async e => {
    e.preventDefault();
    const {
      firstname,
      lastname,
      username,
      email,
      password,
      confirmpassword
    } = this.state;

    if (
      firstname === "" ||
      lastname === "" ||
      username === "" ||
      email === "" ||
      password === "" ||
      confirmpassword === ""
    ) {
      swal.fire("Error", "Please Fill all the fields", "error");
    } else if (password !== confirmpassword) {
      swal.fire("Error", "Password match failed", "error");
    } else {
      try {
        this.setState({ loading: true });
        await firebase.signedInFirebase(
          email,
          password,
          firstname,
          lastname,
          username
        );
        swal.fire(
          "Successfully SignUp",
          "You are now redirected to login Page",
          "success"
        );
        this.setState(
          {
            firstname: "",
            lastname: "",
            username: "",
            email: "",
            password: "",
            loading: false
          },
          () => {
            this.props.history.replace("/login");
          }
        );
      } catch (e) {
        console.log(e);
        swal.fire("Error", e.message, "error");
        this.setState({
          firstname: "",
          lastname: "",
          username: "",
          email: "",
          password: "",
          loading: false
        });
      }
    }
  };

  render() {
    const {
      firstname,
      lastname,
      username,
      email,
      password,
      confirmpassword
    } = this.state;
    return (
      <div style={{height:'100vh',backgroundColor:'#ACC99D'}}>
        <Header />
        {this.state.loading ? (
          <img
            src={require("../../assets/images/spinner.gif")}
            width="100"
            style={{ position: "fixed", top: 270, left: 630 }}
          />
        ) : null}
        <div className="center">
          <img
            src={require("../../assets/images/avatar.png")}
            className="img"
          />
          <div className="row">
            <div className="container">
              <form className="col s12" onSubmit={this.submitHandler}>
                <div className="row">
                  <div className="input-field col s6">
                    <input
                      id="firstname"
                      type="text"
                      value={firstname}
                      onChange={this.changeHandler}
                    />
                    <label htmlFor="firstname" style={{color:'white'}}>First Name</label>
                  </div>
                  <div className="input-field col s6">
                    <input
                      id="lastname"
                      type="text"
                      value={lastname}
                      onChange={this.changeHandler}
                    />
                    <label htmlFor="lastname" style={{color:'white'}}>Last Name</label>
                  </div>
                </div>

                <div className="row">
                  <div className="input-field col s6">
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={this.changeHandler}
                    />
                    <label htmlFor="username" style={{color:'white'}}>User Name</label>
                  </div>
                  <div className="input-field col s6">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={this.changeHandler}
                    />
                    <label htmlFor="email" style={{color:'white'}}>Email</label>
                  </div>
                </div>

                <div className="row">
                  <div className="input-field col s6">
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={this.changeHandler}
                    />
                    <label htmlFor="password" style={{color:'white'}}>Password</label>
                  </div>
                  <div className="input-field col s6">
                    <input
                      id="confirmpassword"
                      type="password"
                      value={confirmpassword}
                      onChange={this.changeHandler}
                    />
                    <label htmlFor="confirmpassword" style={{color:'white'}}>Confirm Password</label>
                  </div>
                </div>

                <div className="center">
                  <button className="btn green">Register</button>
                  <Link to="/login" className="link">
                    Already have an account? Login now
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
