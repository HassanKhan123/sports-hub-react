import React from 'react'
import {Route,Switch} from 'react-router-dom'
import Home from '../screens/Home'
import Signin from '../screens/Signin'
import Login from '../screens/Login'
import AddProduct from '../screens/AddProduct'
import RegisterCompany from '../screens/RegisterCompany/RegisterCompany'
import LoginCompany from '../screens/RegisterCompany/loginCompany'
import AddToCart from '../screens/AddToCart'
import Rating from '../screens/Rating'
import adminLogin from '../screens/adminLogin'
import adminPanel from '../screens/adminPanel'
import ProductsVendors from '../screens/ProductsVendors'


const Navigation = () => {
    return(
        <div>
            <Switch>
                <Route path="/" exact component={Home}/>
                <Route path="/signin" exact component={Signin}/>
                <Route path="/login" exact component={Login}/>
                <Route path="/add-product" exact component={AddProduct}/>
                <Route path="/register-company" exact component={RegisterCompany}/>
                <Route path="/login-company" exact component={LoginCompany}/>
                <Route path="/cart" exact component={AddToCart}/>
                <Route path="/rating" exact component={Rating} />
                <Route path="/admin/login" exact component={adminLogin}/>
                <Route path="/admin/adminPanel" exact component={adminPanel}/>
                <Route path="/vendors/products" exact component={ProductsVendors}/>





            </Switch>
        </div>
    )
}

export default Navigation