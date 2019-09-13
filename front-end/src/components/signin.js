import React, {useState} from "react";
import {connect} from "react-redux";

import Loading from "./app/sideboard/loading";
import logo from  "../assets/loader.svg";
import {updateCsrf} from "../actions/csrf";
import {dumpLocalStorage} from "../settings/functions";
import {callSigninOrSignup} from "../api/apiCalls";

const Signin = (props) => {
    const [failure, setFailure] = useState("");
    const [type, changeType] = useState("signin");
    const [inputValues, changeInputValues] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [warnClasses, changeWarnClasses] = useState({
        name: "",
        email: "",
        password: ""
    });

    //-------------------------------------------------------------------------------------------------
    const resetWarnClasses = () => {
        let obj = {
            name: "",
            email: "",
            password: ""
        };
        setFailure("");
        changeWarnClasses(obj);
    }
    const resetInputValues = () => {
        let obj = {
            name: "",
            email: "",
            password: ""
        };
        changeInputValues(obj);
    }

    //this function hadles when the user wants to change to singup or to signin
    const handleCreateButton = () => {
        if(!props.loading){
            resetWarnClasses();
            //this is to reset the inputs
            resetInputValues();

            if(type==="signin"){
                changeType("signup");
            }else{
                changeType("signin");
            }
        }
    }

    //this function updates the state as per the value input by the user
    const handleInputValueChange = (key,value) =>{
        resetWarnClasses();
        let obj = {...inputValues}
        obj[key] = value
        changeInputValues(obj);
    };

    //this function validates whether the input is acceptable or not
    const validateInput = () => {
        let regexEmail = /^[a-zA-Z0-9_\.]+@[a-z]+\.[a-z]*\.{0,1}[a-z]+$/;
        let chkEmail = inputValues.email.match(regexEmail);
        let obj = {...warnClasses};

        if(type!=="signin"){
            if(inputValues.name == ""){
                obj.name = "active";
            }
        }
        if(!chkEmail){
            obj.email = "active";
            changeWarnClasses(obj);
        }
        if(inputValues.password == "" || inputValues.password.length < 8){
            obj.password = "active";
        }

        changeWarnClasses(obj);
        
        return type==="signin" ?
                    chkEmail && inputValues.password!="":
                    chkEmail && inputValues.password!="" && inputValues.name!="";
    };
    //--------------------------------------------------------------------------------------------------------

    //===================== RENDER ==============================================
    return (
        <div className="signin">
            <div 
            className={type==="signin"?"signin__logo":`signin__logo active`}
            >
                {<Loading active={props.loading} extra={"index"}/>}
                {  
                    <svg 
                    alt="logo" 
                    className={!props.loading?"sideboard__logo-svg index":"sideboard__logo-svg inactive index"}>
                        <use xlinkHref={`${logo}#Capa_1`}/>
                    </svg>
                }
                QwikInsights
            </div>

            <div className="signin__inputs">

                <span className={`signin__inputs-warn ${warnClasses.name}`}>This field must be filled with a valid name !</span>
                {   
                    <input type="text" 
                    placeholder="name" 
                    className={type==="signin"?`signin__inputs-text inactive`:`signin__inputs-text active`}
                    value={inputValues.name}
                    onChange={(e) => {
                        handleInputValueChange("name",e.target.value);
                    }}/>
                }


                <span className={`signin__inputs-warn ${warnClasses.email}`}>This field must be filled with a valid email !</span>
                <input 
                type="email" 
                placeholder="email" 
                className="signin__inputs-text"
                value={inputValues.email}
                onChange={(e) => {
                    handleInputValueChange("email",e.target.value);
                }}/>

                
                <span className={`signin__inputs-warn ${warnClasses.password}`}>This field must be filled with a valid password of minimum length 8 !</span>
                <input 
                type="password" 
                placeholder="password" 
                className="signin__inputs-text"
                value={inputValues.password}
                onChange={(e) => {
                    handleInputValueChange("password",e.target.value);
                }}/>

                <button 
                className="signin__inputs-button"
                onClick={() => {
                    if(!props.loading && validateInput()){
                            let endpoint = type==="signin"?"login":"register";
                            if(endpoint==="register"){

                                //========================SIGNUP====================
                                props.dispatch({type:"SET_LOADING"});
                                callSigninOrSignup(endpoint, inputValues).then(response => {
                                    response.json().then(data => {
                                        if(!Object.keys(data).includes("msg")){
                                            console.log(data);
                                            //add prompt to screen that user has been registered and that email needs to confirmed
                                        }else{
                                            setFailure(data.msg)
                                        }
                                        props.dispatch({type:"RESET_LOADING"});
                                    })
                                });
                            }else{

                                //================LOGIN=====================
                                props.dispatch({type:"SET_LOADING"});
                                callSigninOrSignup(endpoint, inputValues).then(response => {
                                    response.json().then(data => {
                                        if(!Object.keys(data).includes("msg")){
                                            props.dispatch(updateCsrf(data));
                                            dumpLocalStorage("csrf-qwikinsights", data);
                                            //add prompt to screen that user has been registered and that email needs to confirmed
                                        }else{
                                            setFailure(data.msg)
                                        }
                                        props.dispatch({type:"RESET_LOADING"});
                                    })
                                });
                            }
                            resetInputValues();
                    }
                }}>
                    {
                        type==="signin"?`Sign-In`:`Sign-up`
                    }
                </button>
            </div>

            <div className="signin__signupdialog">
                {
                    type==="signin"?`Don't have an account?`:`Already have an account?`
                }  
                <span 
                className="signin__signupdialog-button"
                onClick={handleCreateButton}
                >
                    &nbsp;
                    {
                    type==="signin"?`Create one!`:`Sign-in!`
                    }
                </span>
            </div>
            <span className={failure?"signin__failure active":"signin__failure"}>{failure}</span>
        </div>
    );
};

const mapStoreToProps = (state) => {
    return {
        loading: state.loading
    }
}

const ConnectedSignin = connect(mapStoreToProps)(Signin);
export default ConnectedSignin;