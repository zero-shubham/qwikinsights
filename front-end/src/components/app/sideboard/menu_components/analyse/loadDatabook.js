import React, {useState, useEffect} from "react";
import {connect} from "react-redux";

import Dropdown from "../dropdown";
import {get, post} from "../../../../../api/apiCalls";
import {update} from "../../../../../actions/update";

const LoadDatabook = (props) => {
    const [warn, setWarn] = useState("");
    const [listOfDatabooks, updateListOfDatabooks] = useState([]);
    const [selectedOptions, setOptions] = useState({databook_name:""});
    /*--------------------------------------------------------------- */

    //on every render update the list of databooks and files
    useEffect(() => {
        props.dispatch({type:"SET_LOADING"});
        get("user/databooks", props.csrf).then(response => 
            response.json().then(data => {
                if(Object.keys(data)[0] === "databooks"){
                    let arrayOfDatabooks = [];
                    Object.keys(data["databooks"]).forEach(index => {
                        arrayOfDatabooks.push(data["databooks"][index]["name"]);
                    });
                    updateListOfDatabooks(arrayOfDatabooks);
                    //update the listOfDatabooks
                }else{
                    updateListOfDatabooks([]);
                }
                props.dispatch({type:"RESET_LOADING"});
            })
        );
    }, []);
    /*--------------------------------------------------------------- */
    const handleDropdpwnChange = (name,_type) => {
        let newObj = {...selectedOptions};
        if(_type === "databook"){
            newObj.databook_name = name;
            setOptions(newObj);
        }else{
            setOptions({databook_name: ""});
        }
        
    }

    const handleLoad = () => {
        if(selectedOptions.databook_name && !props.loading){
            props.dispatch({type:"SET_LOADING"});
            post("databook/load", props.csrf, selectedOptions).then(resp => resp.json().then(data => {
                if(!Object.keys(data).includes("databook_name")){
                    setWarn(data[Object.keys(data)[0]])
                }else{
                    props.dispatch(update("DATABOOK", data.databook_name));
                    props.dispatch(update("DATASTORE", {
                        list: data.datastore_names,
                        selected: data.datastore_names[0]
                    }));
                    //setWarn("Loaded successfully! Make sure to unload the databook to save your progress.")
                }
                props.dispatch({type:"RESET_LOADING"});
            }));
        }
    }

    return (
        <div className="loadDatabook">
            Select Databook:
            <Dropdown optionsList={listOfDatabooks} valueType="databook" handleChange={handleDropdpwnChange}/>

            <div className="menu__warn">{warn}</div>

            <div className="menu__btn" onClick={handleLoad}>
                Load
            </div>

            <div 
            className="menu__btn" 
            onClick={()=>props.clickFunc("back")}
            >
                Back
            </div>
        </div>
    )
};

const mapStoreToProps = (state) => {
    return {
        csrf: state.csrf.csrf,
        loading: state.loading
    }
}
const ConnectedLoadDatabook = connect(mapStoreToProps)(LoadDatabook);
export default ConnectedLoadDatabook;
//<input type="text" placeholder="Enter databook name" className="menu__input"/>
            