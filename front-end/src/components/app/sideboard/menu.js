import React, {useState} from "react";
import {connect} from "react-redux";
import Analyse from "./menu_components/analyse/analyse";
import Visualize from "./menu_components/visualize";

const Menu = (props) => {
    const [selectedTab, changeTab] = useState("analyse");
    /*--------------------------------------------------------------- */

    const handleTabClick = (e) => {
        if(e.target.innerHTML!=="analyse"){
            changeTab("visualize");
        }else{
            changeTab("analyse");
        }
    };

    return (
        <div 
        className={props.css.settings || props.disp ==="none"?"menu collapse":"menu"} 
        >

            <div className="menu__tabs">
                <span 
                onClick={handleTabClick}
                className={selectedTab==="analyse" ? `menu__tabs-btn active` :`menu__tabs-btn`}
                >
                    analyse
                </span>

                <span 
                onClick={handleTabClick}
                className={selectedTab==="visualize" ? `menu__tabs-btn active` :`menu__tabs-btn`}
                >
                    visualize
                </span> 
            </div>

            <div className="menu__container">
                {selectedTab==="analyse"?<Analyse/> : <Visualize/>}
            </div>
        </div>
    );
};

const mapStoreToProps = (state) => {
    return {
        css: state.css
    }
}
const ConnectedMenu = connect(mapStoreToProps)(Menu);

export default ConnectedMenu;