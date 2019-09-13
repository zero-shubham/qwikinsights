const userDefault = {
    login : false,
    userDetails: {}
};

const userReducer = (state=userDefault, action) => {
    switch(action.type){
        case "UPDATE":
            return{
                ...action.details
            }
        default:
            return state;
    }
};

export default userReducer;