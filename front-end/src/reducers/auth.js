const authDefault = {
    login : false,
    csrf_token : "",
    csrf_refresh_token : ""
};

const authReducer = (state=authDefault, action) => {
    switch(action.type){
        case "UPDATE":
            return{
                ...action.auth
            }
        default:
            return state;
    }
};

export default authReducer;