import React, { Component } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert2";
import { connect } from "react-redux";

import firebase from "../../config/firebase";
import Header from "../../components/Header";
import actionHandlers from "../../store/user/actions";

import "../../index.css";
import "./style.css";

class Signin extends Component {
  state = {
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
    loading: false
  };
  loginWithFb = async () => {
    this.setState({ loading: true });

    await this.props.fbLogin();
    this.setState({ loading: false },()=>{
      this.props.history.replace('/')
    });
  };

  loginWithGoogle = async () => {
    this.setState({ loading: true });

    await this.props.googleLogin();
    this.setState({ loading: false },()=>{
      this.props.history.replace('/')
    });
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
      <div style={{ height: "100vh", backgroundColor: "#ACC99D" }}>
        <Header />
        {this.state.loading ? (
          <img
            src={require("../../assets/images/spinner.gif")}
            width='100'
            style={{ position: "fixed", top: 270, left: 630 }}
          />
        ) : null}
        <div className='center'>
          {/* <img
            src={require("../../assets/images/avatar.png")}
            className='image'
          /> */}
          <div className='row'>
            <div className='container'>
              <form className='col s12' onSubmit={this.submitHandler}>
                <div className='row'>
                  <div className='input-field col s6'>
                    <input
                      id='firstname'
                      type='text'
                      value={firstname}
                      onChange={this.changeHandler}
                    />
                    <label htmlFor='firstname' style={{ color: "white" }}>
                      First Name
                    </label>
                  </div>
                  <div className='input-field col s6'>
                    <input
                      id='lastname'
                      type='text'
                      value={lastname}
                      onChange={this.changeHandler}
                    />
                    <label htmlFor='lastname' style={{ color: "white" }}>
                      Last Name
                    </label>
                  </div>
                </div>

                <div className='row'>
                  <div className='input-field col s6'>
                    <input
                      id='username'
                      type='text'
                      value={username}
                      onChange={this.changeHandler}
                    />
                    <label htmlFor='username' style={{ color: "white" }}>
                      User Name
                    </label>
                  </div>
                  <div className='input-field col s6'>
                    <input
                      id='email'
                      type='email'
                      value={email}
                      onChange={this.changeHandler}
                    />
                    <label htmlFor='email' style={{ color: "white" }}>
                      Email
                    </label>
                  </div>
                </div>

                <div className='row'>
                  <div className='input-field col s6'>
                    <input
                      id='password'
                      type='password'
                      value={password}
                      onChange={this.changeHandler}
                    />
                    <label htmlFor='password' style={{ color: "white" }}>
                      Password
                    </label>
                  </div>
                  <div className='input-field col s6'>
                    <input
                      id='confirmpassword'
                      type='password'
                      value={confirmpassword}
                      onChange={this.changeHandler}
                    />
                    <label htmlFor='confirmpassword' style={{ color: "white" }}>
                      Confirm Password
                    </label>
                  </div>
                </div>

                <div className='center' style={{ marginBottom: 2 }}>
                  <button className='btn green'>Register</button>
                  <Link to='/login' className='link'>
                    Already have an account? Login now
                  </Link>
                </div>
              </form>
              <div className='center'>
                <h5 className='white-text'>OR</h5>

                <button
                  className='btn blue white-text darken-4 loginBtn'
                  onClick={this.loginWithFb}
                >
                  <i className='fab fa-facebook-f left'></i> Sign up with
                  Facebook
                </button>

                <button
                  className='btn blue white-text loginBtn'
                  onClick={this.loginWithGoogle}
                >
                  <i className='fab fa-google left'></i> Sign up with Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  fbLogin: actionHandlers.fbLoginHandler,
  googleLogin:actionHandlers.googleLoginHandler
};

export default connect(null, mapDispatchToProps)(Signin);
