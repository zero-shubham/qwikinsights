const defaultDatastore = {
    list: [], 
    selected: ""
}

const datastoreReducer = (state=defaultDatastore, action) => {
    switch(action.type){
        case "UPDATE_DATASTORE":
            return{
                ...action.payload
            }
        case "SET_DEFAULT":
            return defaultDatastore;
        default:
            return state;
    }
};

export default datastoreReducer;