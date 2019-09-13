import React from "react";
import {connect} from "react-redux";
import User from "./user";
import Menu from "./menu";
import Loading from "./loading";
import logo from  "../../../assets/loader.svg";

const Sideboard = (props) => {

    return (
        <div className={`sideboard`} >
            <div className="sideboard__top">
                <div className="sideboard__logo">
                    {<Loading active={props.loading}/>}
                    {  
                        <svg 
                        alt="logo" 
                        className={!props.loading?"sideboard__logo-svg":"sideboard__logo-svg inactive"}>
                            <use xlinkHref={`${logo}#Capa_1`}/>
                        </svg>
                    }
                    <div>QwikInsights</div>
                </div>
                <hr className="sideboard__hr"/>
            </div>
            
            <div className="sideboard__bottom">
                <Menu disp={props.disp}/>
                <User disp={props.disp}/>
            </div>
        </div>
    )
};

const mapStoreToProps = (state) => {
    return {
        loading: state.loading,
        css: state.css
    }
}
const ConnectedSideboard = connect(mapStoreToProps)(Sideboard);
export default ConnectedSideboard;