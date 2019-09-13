import React, {useState, useEffect} from "react";
import {connect} from "react-redux";

import {post, get} from "../../../../../api/apiCalls";
import Dropdown from "../dropdown";

const CreateDatabook = (props) => {
    const [warn, setWarn] = useState("");
    const [data, setData] = useState({databook_name:"", file_name:""});
    const [listOfFiles, updateListOfFiles] = useState([]);
    /*--------------------------------------------------------------- */

    //on every render update the list of databooks and files
    useEffect(() => {
        props.dispatch({type:"SET_LOADING"});
        get("user/files", props.csrf).then(response => 
            response.json().then(data => {
                if(Object.keys(data)[0] === "files"){
                    //update the listOfDatabooks
                    let arrayOfFiles = [];
                    Object.keys(data["files"]).forEach(index => {
                        arrayOfFiles.push(data["files"][index]["name"])
                    });
                    updateListOfFiles(arrayOfFiles);
                }else{
                    updateListOfFiles([]);
                }
                
                props.dispatch({type:"RESET_LOADING"});
            })
        );
    }, []);
    /*--------------------------------------------------------------- */
    const handleDropdpwnChange = (name,_type) => {
        let newObj = {...data};
        if(_type === "datafile"){
            newObj.file_name = name;
        }
        setData(newObj);
    }

    const handleInputChange = (e) => {
        let newObj = {...data};
        newObj.databook_name = e.target.value;
        setData(newObj);

        if(e.target.value && warn){
            setWarn("");
        }
    };

    const handleCreate = () => {
        if(data.databook_name && data.file_name && !props.loading){
            props.dispatch({type:"SET_LOADING"});
            post("databook/create", props.csrf, { databook_name: data.databook_name, file_name: data.file_name})
                .then(response => {
                    response.json().then(data => {
                        setWarn(data.msg);
                        setData("");
                    })
                    
                    props.dispatch({type:"RESET_LOADING"});
                })
        }else{
            setWarn("All the fields need to filled!");
        }
        
    }
    return (
        <div className="createDatabook">
            <input 
            type="text" 
            placeholder="Enter databook name" 
            onChange={handleInputChange}
            value={data.databook_name || ""}
            className="menu__input"/>

            Select Data file:
            <Dropdown optionsList={listOfFiles} valueType="datafile" handleChange={handleDropdpwnChange}/>

            <div className="menu__warn">{warn}</div>

            <div className="menu__btn" onClick={handleCreate}>
                Create
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
};

const ConnectedCreateDatabook = connect(mapStoreToProps)(CreateDatabook);

export default ConnectedCreateDatabook;