import React, {useState, useEffect} from "react";
import {connect} from "react-redux";

import Dropdown from "../dropdown";
import {get, del} from "../../../../../api/apiCalls";

const Delete = (props) => {
    const [selectedType, setType] = useState("");
    const [dropdownList, setList] = useState([]);
    const [deleteFile, setDelete] = useState({name:"", type:""});
    const [warn, setWarn] = useState("Select an option from above.");

    useEffect(() => {
        if(selectedType){
            setWarn("");
            props.dispatch({type:"SET_LOADING"});
            get(`user/${selectedType}`, props.csrf).then(response => 
                response.json().then(data => {
                    if(Object.keys(data)[0] === selectedType){
                        //update the listOfDatabooks
                        let arrayOfFiles = [];
                        Object.keys(data[selectedType]).forEach(index => {
                            arrayOfFiles.push(data[selectedType][index]["name"])
                        });
                        setList(arrayOfFiles);
                    }else{
                        setList([]);
                    }
                    props.dispatch({type:"RESET_LOADING"});
                })
            );
        }else{
            setWarn("Select an option from above.");
        }
    }, [selectedType]);

    const handleDropdpwnChange = (name,_type) => {
        let newObj = {...deleteFile};
        if(_type === "files"){
            newObj.name = name;
            newObj.type = "file";
        }else{
            newObj.name = name;
            newObj.type = "databook";
        }
        setDelete(newObj);
    };

    const handleDelete = () => {
        if(deleteFile.name && !props.loading){
            let newObj = {};
            if(deleteFile.type === "file"){
                newObj.file_name = deleteFile.name
            }else{
                newObj.databook_name = deleteFile.name
            }
            props.dispatch({type:"SET_LOADING"});
            del(`${deleteFile.type}/delete`, props.csrf, newObj).then(response => response.json().then(data => {
                setWarn(data.msg);
                
                props.dispatch({type:"RESET_LOADING"});
            }))
        }
    };

    return  (
        <div className="deleteMenu">
            <div className="deleteMenu__radio">
                <div onClick={(e) => setType(e.target.value)}>
                    <input type="radio" id="files" name="type" value="files"
                    />
                    <label htmlFor="files">Delete Files</label>
                </div>

                <div onClick={(e) => setType(e.target.value)}>
                    <input type="radio" id="databooks" name="type" value="databooks"
                    />
                    <label htmlFor="databooks">Delete Databooks</label>
                </div>
            </div>

            {selectedType ? 
                <Dropdown optionsList={dropdownList} valueType={selectedType} handleChange={handleDropdpwnChange}/> : 
                ""
            }

            <div className="menu__warn">{warn}</div>
            <div className="menu__btn" onClick={handleDelete}>
                Delete
            </div>

            <div 
            className="menu__btn" 
            onClick={()=>props.clickFunc("back")}
            >
                Back
            </div>
        </div>
    );
};

const mapStoreToProps = (state) => {
    return {
        csrf: state.csrf.csrf,
        loading: state.loading
    }
};
const ConnectedDelete = connect(mapStoreToProps)(Delete)
export default ConnectedDelete;