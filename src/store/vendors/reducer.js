const initialState={
    vendorID:'',
    featuredProducts:''
}

const reducer = (state=initialState,action) => {
    switch(action.type){
        case 'LOGGING_IN':
            return {
                ...state,
                vendorID:action.payload.uid
            }
        case 'FEATURED_PRODUCT':
            return{
                ...state,
                featuredProducts:action.payload.data
            }
       
        default:
            return state
    }
}

export default reducer