import React, {useState } from "react";
import {connect} from "react-redux";

import cog from "../../../assets/settings.svg";
import {toggleDarkmode, toggleSettingsCls} from "../../../actions/css";
import {updateLogin} from "../../../actions/user";
import {post} from "../../../api/apiCalls";

const User = (props) => {
    return (
        <div className={!props.css.settings?(props.disp ==="none"?`user collapse`:`user`):`user expand`}>
            <div className="user__details">
                <div className="user__details-container">
                    <div className="user__name">{props.user_details.name}</div>
                    <div className="user__email">{props.user_details.email}</div>
                    <div className="user__account_type">Account Type - {props.user_details.account_type}</div>
                </div>
                <div className="user__details-settings" onClick={() => {
                    if(props.css.settings){
                        props.dispatch(toggleSettingsCls(false))
                    }else{
                        props.dispatch(toggleSettingsCls(true))
                    }
                }}>
                    <svg alt="click to delete the current data-tab" className="user__details-settings-svg">
                        <use xlinkHref={`${cog}#Capa_1`}/>
                    </svg>
                </div>
            </div>
            
            <div className="user__settings">
                SETTIGNS MENU GOES HERE
            </div>

            <div
            className="user__darkmode-tag"
            >
                Dark Mode
                <div 
                className={`user__darkmode ${props.css.darkmode}`}
                onClick={
                    () => {
                        if(props.css.darkmode===''){
                            props.dispatch(toggleDarkmode({mode: 'dark'}))
                        }else{
                            props.dispatch(toggleDarkmode({mode: ''}))
                        }
                    }
                }
                >
                    <div className="user__darkmode-btn" ></div>
                </div>
            </div>
            

            <div
            className="user__logout"
            onClick={
                () => {
                    //add loader to screen and a message that logging out is beeing proccessed
                    if(!props.loading){
                        props.dispatch({type:"SET_LOADING"});
                        post('logout',props.csrf).then(response => 
                            response.json().then( data => {
                                if(!data.login){
                                    let user_details = {};
                                    user_details.login = data.login;
                                    user_details.userDetails = {};
                                    props.dispatch(updateLogin(user_details));
                                    props.dispatch({type: "SET_DEFAULT"});
                                }
                                props.dispatch({type:"RESET_LOADING"});
                            }));
                    }
                }
            }
            >
                logout
            </div>
        </div>
    );
};

const mapStoreToProps = (state) => {
    return {
        user_details: state.user.userDetails,
        css: state.css,
        csrf: state.csrf.csrf,
        loading: state.loading
    }
}
const ConnectedUser = connect(mapStoreToProps)(User)
export default ConnectedUser;