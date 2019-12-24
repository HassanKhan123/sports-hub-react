import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import swal from 'sweetalert2'
import loginActions from "../../store/vendors/actions";
import Header from "../../components/Header";

import "../../index.css";

class loginCompany extends Component {
  state = {
    email: "",
    password: "",
    loading: false
  };
  
  chageHandler = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  submitHandler = async e => {
    e.preventDefault();
    console.log(this.props)
    const { email, password } = this.state;
    if (email === "" || password === "") {
      swal.fire("Error", "Please fill all the fields", "error");
    } else {
      this.setState({ loading: true });
      try{
        await this.props.login(email, password);
      
      
        this.setState(
          {
            email: "",
            password: "",
            loading: false
          },
          () => {
              console.log('hi')
            this.props.history.replace("/add-product");
          }
        );
      }catch(e){
        swal.fire("Error", e.message, "error");
        this.setState({
            email: "",
            password: "",
            loading: false
        })
      }
      
     
        
      
    }
  };

  render() {
    const { email, password } = this.state;
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
            <div className="form">
              <form className="col s12" onSubmit={this.submitHandler}>
                <div className="row">
                  <div className="input-field col s6 l12">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={this.chageHandler}
                    />
                    <label htmlFor="email">Email</label>
                  </div>
                  <div className="input-field col s6 l12">
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={this.chageHandler}
                    />
                    <label htmlFor="password">Password</label>
                  </div>
                </div>

                <div className="center">
                  <button className="btn green">Login</button>
                  <Link to="/register-company" className="link">
                    Company not registered? Register now
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

const mapDispatchToProps = {
  login: loginActions.loginHandler
};

export default connect(null, mapDispatchToProps)(loginCompany);
