import React, {useEffect} from "react";
import {connect} from "react-redux";

import Signin from "./signin";
import App from "./app/app";
import Subscribe from "./subscribe";

const Container = (props) => {
    
    return (
        <div 
        className="container"
        >
            {
                props.user.login ?
                    <App/> : 
                     <Signin/>
            }
            <Subscribe/>
        </div>
    )
}

const mapStoreToProps = (state) => {
    return {
        user: state.user,
        loading: state.loading
    }
};

const ConnectedContainer = connect(mapStoreToProps)(Container);
export default ConnectedContainer;