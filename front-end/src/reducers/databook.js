const databookDefault = {
    name: ""
};

const databookReducer = (state=databookDefault, action) => {
    switch(action.type){
        case "UPDATE_DATABOOK":
            return{
                name: action.payload
            }
        case "SET_DEFAULT":
            return databookDefault;
        default:
            return state;
    }
};

export default databookReducer;