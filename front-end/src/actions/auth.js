import {callSigninOrSignup, getUserDetails} from "../api/apiCalls";
import {dumpLocalStorage} from "../settings/functions";


export const startRegister = (endpoint, body) => {
    return (dispatch) => {
        callSigninOrSignup(endpoint, body).then(response => {
            response.json().then(data => {
                if(!Object.keys(data).includes("msg")){
                    console.log(data);
                    //add prompt to screen that user has been registered and that email needs to confirmed
                }
            })
        });
    }
}

const updateLogin = (auth) => {
    return () => {
        type: "UPDATE",
        auth 
    }
}