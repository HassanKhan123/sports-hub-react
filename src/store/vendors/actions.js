import swal from "sweetalert2";
import firebase from "../../config/firebase";

function loginHandler(email, password) {
  return async function(dispatch) {
    console.log("logging in.....");
    try {
      var response = await firebase.logInFirebase(email, password);
      console.log(response);

      if (response !== undefined) {
        swal.fire(
          "Successfully Login",
          "You are now redirected to Add Products Page",
          "success"
        );

        dispatch({
          type: "LOGGING_IN",
          payload: {
            uid: response.uid
          }
        });
      }
    } catch (e) {
      swal.fire("Error", e.message, "error");
      throw e
    }
  };
}



export default {
  loginHandler
};
