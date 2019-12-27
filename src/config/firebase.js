import * as firebase from 'firebase'

var firebaseConfig = {
    apiKey: "AIzaSyAKIkrZwg1SIkQ3ONBezdLGHOCqi9hb1cI",
    authDomain: "hassan-sports-hub.firebaseapp.com",
    databaseURL: "https://hassan-sports-hub.firebaseio.com",
    projectId: "hassan-sports-hub",
    storageBucket: "hassan-sports-hub.appspot.com",
    messagingSenderId: "379472130448",
    appId: "1:379472130448:web:a6eeb08c941dd99ddc8315"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var signedInFirebase = async (email,pass,fname,lname,uname) => {
    try {
        // var image=localStorage.getItem("imgURL");
       
        var response = await firebase.auth().createUserWithEmailAndPassword(email, pass);
        var data=await firebase.firestore().collection('users').doc(response.user.uid).set({
            firstName:fname,
            lastName:lname,
            userName:uname,
            email:email,
            cartItems:[]
            
            
        })
        return data;
    } catch (e) {
        throw e;
    }
}

  

  var signInFirebase = async (email,pass,cname) => {
    try {
        // var image=localStorage.getItem("imgURL");
       
        var response = await firebase.auth().createUserWithEmailAndPassword(email, pass);
        var data=await firebase.firestore().collection('vendors').doc(response.user.uid).set({
            companyName:cname,
            email:email
            
            
        })
        return data;
    } catch (e) {
        throw e;
    }
}


var logedInFirebase = async (email, pass) => {
  try {

      var response = await firebase.auth().signInWithEmailAndPassword(email, pass);
      var getData=await firebase.firestore().collection('users').doc(response.user.uid).get();
      // localStorage.setItem("uid",response.user.uid);
      return {...getData.data(),uid:response.user.uid};
  } catch (e) {
      throw e;
  }
}

var logInFirebase = async (email, pass) => {
  try {

      var response = await firebase.auth().signInWithEmailAndPassword(email, pass);
      var getData=await firebase.firestore().collection('vendors').doc(response.user.uid).get();
      // localStorage.setItem("uid",response.user.uid);
      return {...getData.data(),uid:response.user.uid};
  } catch (e) {
      throw e;
  }
}

var signOutFirebase=async()=>{
  try{
      var response=await firebase.auth().signOut();
      return response;
  }
  catch(e){
      throw e;
  }
}


const addProduct = async (credentials,vendorID) => {
  try{
      const getName= await firebase.firestore().collection('vendors').doc(vendorID).get();
      const url=await uploadImage(credentials.productImage,'productPictures/');
      credentials.productImage=url;
      credentials.companyName= getName.data().companyName;
      credentials.price = Number(credentials.price);
      console.log(credentials)
      await saveDocument('vendors',vendorID,credentials)
      return credentials
     
      
  }
  catch(e){
      throw(e)
  }
  
}

const saveDocument = async (collection,documment,data) => {
  const res=await firebase.firestore().collection(collection).doc(documment).collection('products').doc().set(data)
  console.log(res)
}

const uploadImage = async  (file,folderName) => {
  try{
      const fileName = folderName+Math.random().toString() + '.jpg';
      const storageRef = firebase.storage().ref().child(fileName)
      await storageRef.put(file);

      const url = await storageRef.getDownloadURL();

      return url
  }
  catch(e){
      throw(e)
  }
}


// var loginWithFb=async()=>{
//   var provider = new firebase.auth.FacebookAuthProvider();
//   try{
//       var res=await firebase.auth().signInWithPopup(provider);
//       // The signed-in user info.
//       var user = res.user;
     

//       var data=await firebase.firestore().collection('vendors').doc(user.uid).set({
//           firstname:user.displayName,
//           email:user.email,
//           imageURL:user.photoURL

//       })
//       console.log(user);
//       console.log(user.displayName);
//       console.log(user.photoURL);

//       localStorage.setItem("loginUser",user.photoURL);
//       localStorage.setItem("loginUserName",user.displayName);
//       localStorage.setItem("info",JSON.stringify(user));
//        localStorage.setItem("uid",user.uid);
//       localStorage.setItem("login",JSON.stringify(1))

//       setTimeout(()=>{
//           window.location.assign("pages/home.html")
//       },2000);
    
    
      
//   }catch(e){
//       console.log(e.message);
//   }
  
// }
export default {
  signInFirebase,
  signedInFirebase,
  logInFirebase,
  logedInFirebase,
  addProduct,
  signOutFirebase
}