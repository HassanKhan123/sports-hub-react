import React, { Component } from "react";
import * as firebase from "firebase";
import Select from "react-select";

import Header from "../../components/Header";
import "./index.css";

export default class ProductsVendors extends Component {
  state = {
    productsFetched: [],
    companyNames: [],
    loading: true,
    categorySearch: "",
    filtered: []
  };
  async componentDidMount() {
    try {
      await firebase
        .firestore()
        .collection("vendors")
        .get()
        .then(doc => {
          doc.docs.forEach(data => {
            this.setState({
              companyNames: [
                ...this.state.companyNames,
                data.data().companyName
              ]
            });
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
      console.log(e);
    }
  }

  searchChangeHandler = async categorySearch => {
    this.setState({ categorySearch: categorySearch.value }, () => {
      const filtered = this.state.productsFetched.filter(product => {
        return product.companyName == this.state.categorySearch;
      });

      this.setState({
        filtered
      });
    });
  };
  render() {
    const arr = this.state.companyNames.map(name => {
      return { value: name, label: name };
    });
    const show = this.state.filtered.map((item, index) => {
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
            </div>
          </div>
        </div>
      );
    });
    return (
      <div>
        <Header />
        <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div className='input-field col s2'>
            <Select
              className='select'
              value={this.state.categorySearch.value}
              onChange={this.searchChangeHandler}
              options={arr}
            />
          </div>
        </div>
        <div className='row'>{show}</div>
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
      </div>
    );
  }
}
