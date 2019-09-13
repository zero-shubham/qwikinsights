import React from "react";

const MenuLink = (props) => {

    return (
        <li 
        className="menulink"
        onClick={() => {
            props.clickFunc(props.title);
        }}
        >
            {props.title}
        </li>
    );
};

export default MenuLink;