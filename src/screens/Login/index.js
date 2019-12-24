import React, { Component } from "react";
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import swal from 'sweetalert2'
import loginActions from "../../store/user/actions";

import Header from "../../components/Header";
import "../../index.css";
import "./style.css";

class login extends Component {
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
            this.props.history.replace("/");
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
    const {email,password,loading} = this.state;
    return (
      <div style={{height:'100vh',backgroundColor:'#ACC99D'}}>
        <Header />
        {loading ? (
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
                    <label htmlFor="email" style={{color:'white'}}>Email</label>
                  </div>
                  <div className="input-field col s6 l12">
                    <input
                      
                      id="password"
                      type="password"
                      value={password}
                      onChange={this.chageHandler}
                    />
                    <label htmlFor="password" style={{color:'white'}}>Password</label>
                  </div>
                </div>

                <div className="center">
                    <button className="btn green">Login</button>
                    <Link to="/signin" className="link">Don't have an account? Register now</Link>
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

export default connect(null, mapDispatchToProps)(login);

