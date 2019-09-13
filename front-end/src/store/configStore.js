import {createStore,compose, applyMiddleware, combineReducers} from "redux";
import thunk from "redux-thunk";

import userReducer from "../reducers/user";
import csrfReducer from "../reducers/csrf";
import cssReducer from "../reducers/css";
import datastoreReducer from "../reducers/datastore";
import databookReducer from "../reducers/databook";
import tableDataReducer from "../reducers/tableData";
import loadingReducer from "../reducers/loading";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default () => {
    const store = createStore(
        combineReducers({
            user: userReducer, 
            csrf: csrfReducer,
            css: cssReducer,
            listOfDatastores: datastoreReducer,
            loadedDatabook: databookReducer,
            tableData: tableDataReducer,
            loading: loadingReducer
        }),
        composeEnhancers(applyMiddleware(thunk))
    );
    return store;
}