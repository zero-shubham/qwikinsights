const loadingReducer = (state=false, action) => {
    switch(action.type){
        case "RESET_LOADING":
            return false;
        case "SET_LOADING":
            return true;
        default:
            return state;
    }
};

export default loadingReducer;