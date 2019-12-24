import swal from "sweetalert2";
import firebase from '../../config/firebase';

function loginHandler(email, password) {
  return async function(dispatch) {
    console.log("logging in.....");
    try {
      var response = await firebase.logedInFirebase(email, password);
      console.log(response.cartItems);

      if (response !== undefined) {
        swal.fire(
          "Successfully Login",
          "You are now redirected to Home Page",
          "success"
        );

        dispatch({
          type: "LOGING_IN",
          payload: {
            uid: response.uid,
            cartItems:response.cartItems
          }
        });
      }
    } catch (e) {
      swal.fire("Error", e.message, "error");
      throw e
    }
  };
}

function loggingOut(){
    return async function(dispatch){
        try{
            await firebase.signOutFirebase();
            swal.fire(
                "Successfully Logout",
                "You are now redirected to Login Page",
                "success"
              );
              dispatch({
                type: "LOGING_OUT",
              });
        }
        catch(e){
            swal.fire('Error',e.message,'error')
        }
    }
}



export default {
  loginHandler,
  loggingOut
};
