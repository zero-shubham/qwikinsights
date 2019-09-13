import React, {Component} from "react";
import {connect} from "react-redux";

import {get} from "../api/apiCalls";
import {updateLogin} from "../actions/user";

class Subscribe extends Component{
    constructor(props){
        super(props);
    };
    updateStoreWithUser = () => {
        if(this.props.csrf){
            this.props.dispatch({type:"SET_LOADING"});
            get("user",this.props.csrf).then(response =>  {
                response.json().then(data => {
                    if(Object.keys(data).length>1){
                        let details = {};
                        details.login = true;
                        details.userDetails = {...data}
                        this.props.dispatch(updateLogin(details));
                    }
                })
            });
            this.props.dispatch({type:"RESET_LOADING"});
        }
    }
    componentDidMount() {
        this.updateStoreWithUser();
    }
    componentDidUpdate(){
        this.updateStoreWithUser();
    }

    render() {
        return (
            <div className="subscribe">
            </div>
        )
    };
}

const mapStoreToProps = (state) => {
    return {
        csrf: state.csrf.csrf
    }
}
const ConnectedSubscribe = connect(mapStoreToProps)(Subscribe);
export default ConnectedSubscribe;