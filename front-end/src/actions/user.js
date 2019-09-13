import {callSigninOrSignup} from "../api/apiCalls";
import {updateCsrf} from "./csrf";
import {dumpLocalStorage} from "../settings/functions";

export const updateLogin = (details) => {
    return {
        type: "UPDATE",
        details 
    }
};

//keeping it here to make redux handle this in asynchronous way
export const startRegister = (endpoint, body) => {
    return (dispatch) => {
        dispatch({type:"SET_LOADING"});
        callSigninOrSignup(endpoint, body).then(response => {
            response.json().then(data => {
                if(!Object.keys(data).includes("msg")){
                    console.log(data);
                    //add prompt to screen that user has been registered and that email needs to confirmed
                }
                dispatch({type:"RESET_LOADING"});
            })
        });
    }
};

export const startLogin = (endpoint, body) => {
    return (dispatch) => {
        dispatch({type:"SET_LOADING"});
        callSigninOrSignup(endpoint, body).then(response => {
            response.json().then(data => {
                if(!Object.keys(data).includes("msg")){
                    dispatch(updateCsrf(data));
                    dumpLocalStorage("csrf-qwikinsights", data);
                    //add prompt to screen that user has been registered and that email needs to confirmed
                }else{
                    
                }
                dispatch({type:"RESET_LOADING"});
            })
        });
    }
};

