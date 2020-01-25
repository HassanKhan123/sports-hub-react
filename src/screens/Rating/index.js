import React, { Component } from "react";
import * as firebase from "firebase";
import swal from 'sweetalert2'
import { connect } from "react-redux";
import Header from "../../components/Header";

class Rating extends Component {
  state = {
    ratedItems: [],
    ratedLength: 0,
    loading: true
  };

  async componentDidMount() {
    const data = await firebase
      .firestore()
      .collection("users")
      .doc(this.props.userID)
      .get();

    // data.data().cartItems.map(cartItem => {
    //   return this.setState({
    //     cost: this.state.cost + cartItem.productPrice
    //   });
    // });
    this.setState({
      ratedItems: [...this.state.ratedItems, data.data().cartItems],
      ratedLength: data.data().cartItems.length,
      loading: false
    });
  }

  rate = async () => {
      this.setState({loading:true})
      console.log('rated => ',this.state.ratedItems);
      try{
        this.state.ratedItems.map(item => {
            return item.map(async i=>{
                return firebase.firestore().collection('ratedItems').doc().set({
                    productName:i.productName,
                    productImage:i.productImage,
                    productCategory:i.productCategory,
                    productPrice:i.productPrice,
                    productRating:i.productRating
  
                })
            })
        })
        await firebase.firestore().collection('users').doc(this.props.userID).set({
            cartItems:[]
          },{merge:true})
          this.props.paymentDone();
        
        this.setState({loading:false,ratedItems:[]})
        swal.fire('Success','Successfully Rated','success')
        this.props.history.replace('/');
      }
      catch(e){
          this.setState({loading:false})
          swal.fire('Error',e.message,'error')
      }
      
  }

  render() {
    const items =
      this.state.ratedLength !== 0
        ? this.state.ratedItems.map(item => {
            return item.map(i => {
              console.log(i);
              return (
                <li className="collection-item avatar" key={Math.random()}>
                  <img src={i.productImage} alt="" className="circle" />
                  <div>
                    {i.productName}
                    <div
                      className="secondary-content"
                      style={{ marginTop: -10 }}
                    >
                      <input
                        type="number"
                        name=""
                        id=""
                        step="0.1"
                        max="5"
                        placeholder="Rate 1 - 5"
                        onChange={e => {
                            if(e.target.value < 1 || e.target.value > 5){
                                swal.fire('Error','Please Rate 1 - 5','error')
                                return;
                            }
                          i.productRating = Number(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </li>
              );
            });
          })
        : null;
    return (
      <div style={{backgroundColor:"#F2F2F2",height:"100vh"}}>
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
              <h4>Your Purchased Products</h4>
            </li>
            {items}
            {this.state.ratedLength !== 0 ? (
              <div className="center" style={{margin:40}}>
                <button onClick={this.rate} className="btn btn-success">Rate</button>
              </div>
            ) : null}
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userID: state.userReducer.userID,
    cartProduct: state.userReducer.cartProduct
  };
};

const mapDispatchToProps = dispatch => {
  return {
    paymentDone: () => dispatch({ type: "PAYMENT_DONE" })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Rating);
