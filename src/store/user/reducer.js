const initialState = {
  userID: "",
  userName:'',
  isUser: false,
  cartProduct: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "FB_LOGING_IN":
    case "GOOGLE_LOGING_IN":
     
      return {
        ...state,
        userID: action.payload.uid,
        userName:action.payload.userName,
        isUser: true,
        cartProduct: action.payload.cartItems
      };

    case "LOGING_IN":
      return {
        ...state,
        userID: action.payload.uid,
        userName:action.payload.userName,
        isUser: true,
        cartProduct: action.payload.cartItems
      };
    case "LOGING_OUT":
      return {
        ...state,
        userID: "",
        isUser: false
      };
    case "PAYMENT_DONE":
      return {
        ...state,
        cartProduct: []
      };

    default:
      return state;
  }
};

export default reducer;
