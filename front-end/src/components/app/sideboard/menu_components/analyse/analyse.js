import React, {useState, useEffect} from "react";
import {connect} from "react-redux";

import MenuLink from "../menuLink";
import LoadDatabook from "./loadDatabook";
import CreateDatabook from "./createDatabook";
import UploadDataFiles from "./uploadDataFiles";
import Delete from "./delete";
import ApplyMethods from "./applyMethods";

const Analyse = (props) => {
    const handleMenuLinkClick = (menu) =>  {
        if(!props.loading){
            if(menu === "Load Databook"){
                changeRender(<LoadDatabook clickFunc={handleMenuLinkClick}/>)
            }else if(menu === "Create Databook"){
                changeRender(<CreateDatabook clickFunc={handleMenuLinkClick}/>)
            }else if(menu === "Upload Data-file"){
                changeRender(<UploadDataFiles clickFunc={handleMenuLinkClick}/>)
            }else if(menu === "Delete"){
                changeRender(<Delete clickFunc={handleMenuLinkClick}/>)
            }else if(menu === "back"){
                changeRender(defaultMenu)
            }
        }
    }
    const defaultMenu = [
        <MenuLink title="Create Databook" key={2} clickFunc={handleMenuLinkClick}/>,
        <MenuLink title="Load Databook" key={1} clickFunc={handleMenuLinkClick}/>,
        <MenuLink title="Upload Data-file" key={3} clickFunc={handleMenuLinkClick}/>,
        <MenuLink title="Delete" key={4} clickFunc={handleMenuLinkClick}/>,
    ];
    const [renderComponents, changeRender] = useState(defaultMenu);


    useEffect(() => {
        if(props.databook){
            changeRender(<ApplyMethods/>);
        }else{
            changeRender(defaultMenu);
        }
    }, [props.databook])

    /*------------------------------------------------------------ */
    return (
        <div className={renderComponents.length==defaultMenu.length?`analyse`:`analyse center`}>
            {
                <div className="analyse__links">
                    
                    {renderComponents}
                    
                </div>
            }
        </div>
    );
};

const mapStoreToProps = (state) => {
    return {
        databook: state.loadedDatabook.name,
        loading: state.loading
    }
}
const ConnectedAnalyse = connect(mapStoreToProps)(Analyse)
export default ConnectedAnalyse;