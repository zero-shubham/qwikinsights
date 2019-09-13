import React, {useState, useEffect} from "react";
import {connect} from "react-redux";

import {post, get} from "../../../../../api/apiCalls";
import Dropdown from "../dropdown";

const UploadDataFiles = (props) => {
    const [warn, setWarn] = useState("");
    const [files, setFiles] = useState([]);
    const [filepath, setFilepath] = useState("");
    const [filePathOption, setFilePathOption] = useState(0);
    const [dropdownList, setDropdownList] = useState([]);

    /*When the user opts for FilePathOption get the filepaths from backend */
    useEffect(() => {
        if(filePathOption){
            let arrayPaths = [];
            props.dispatch({type:"SET_LOADING"});
            
            get("user/filepaths", props.csrf).then(response => response.json().then(data=> {
                data.file_paths.forEach((element) => {
                    arrayPaths.push(element)
                });
                setDropdownList(arrayPaths);
                
                props.dispatch({type:"RESET_LOADING"});
            }));
        }
    }, [filePathOption]);

    /*files contains details(name, size) of all the files to uploaded.
     since file_path is common to all it is sent only once  separately*/
    const handleLoad = () => {
        if(files.length && !props.loading){
            let files_obj = [];
            props.dispatch({type:"SET_LOADING"});

            files.forEach(file => {
                files_obj.push({name: file.name, size: file.size})
            });
            post("file/upload",props.csrf, {files:JSON.stringify(files_obj), file_path: filepath}).then(response => {
                response.json().then(data => {
                    console.log(data, Object.keys(data).includes("links"))
                    if(Object.keys(data).includes("links")){
                        data.links.forEach((link,ind) => {
                                    let formData = new FormData()
                                    Object.keys(link.fields).forEach(key => {
                                        formData.append(key, link.fields[key]);
                                    });
                                    formData.append("file", files[ind]);
                                    fetch(link.url, {
                                        method: "POST",
                                        mode: "no-cors",
                                        body: formData
                                    }).then(resp => {
                                        if(resp.status===0){
                                            setWarn("File was uploaded successfully!")
                                        }
                                    }).catch(error => setWarn(`${error}. Re-try!`))
                                })
                    }else{
                        setWarn(data.msg)
                    }
                    props.dispatch({type:"RESET_LOADING"});
                })
            })
            
        }
    }

    const handleInputChange = (e) => {
        let tmpPath = e.target.value;
        if(/^[a-zA-Z0-9-_]+(\/{0,1}[a-zA-Z0-9-_]+)*$/.test(tmpPath)){
            setWarn(`Your final file-path will be- *root*/${tmpPath}/*file*`);
            setFilepath(tmpPath);
        }else{
            setWarn("Entered file-path is not acceptable! There should be no trailing '/'");
            setFilepath("");
        }
    };

    const handleDropdpwnChange = (name,_type) => {
        if(_type === "file_paths"){
            setFilepath(name);
        }else{
            setFilepath("");
        }
    }

    return (
        <div className="uploadDataFiles">
            File-path
            {
                /*If filePathOption is True it will show the already available file-paths */
                filePathOption ? 
                <Dropdown optionsList={dropdownList} valueType="file-path" handleChange={handleDropdpwnChange}/>
                :
                <input 
                type="text" 
                placeholder="Enter filepath" 
                onChange={handleInputChange}
                value={filepath}
                className="menu__input"/>
            }

            File
            <input 
            type="file" 
            className="menu__input"
            onChange= {(e) => {
                let allowedFiles = ["csv", "json", "db", "xls", "xlsx"];
                let filesArray = [];

                /* this to add multiple file upload feature even if one file is unacceptable
                 nothing will go through */
                Object.keys(e.currentTarget.files).forEach(key => {
                    let fileType = (e.currentTarget.files[key].type).split("/")[1]
                    if(!allowedFiles.includes(fileType)){
                        e.currentTarget.value = '';
                        setWarn("File format not allowed! Try - csv, json, db, xls, xlsx.");
                        setFiles([]);
                        return;
                    }
                    filesArray.push(e.currentTarget.files[key]);
                })
                setFiles(filesArray);
            }} multiple
            />

        {/*checkbox to trigger filePathOption which means
         user wants to user already available file=paths*/}
            <div className="menu__chkbox">
                <input type="checkbox" name="filepathOption" value={1} id="filepathOption"
                onChange={(e)=> filePathOption?setFilePathOption(0):setFilePathOption(e.target.value)}/> 
                <label htmlFor="filepathOption">Upload to already available file-path.</label>
            </div>

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
};

const ConnectedUploadFiles = connect(mapStoreToProps)(UploadDataFiles);

export default ConnectedUploadFiles;


/*
                    /^[0-9a-zA-Z]+.{1}(xlsx|csv|xls|db|json)$/
                    if(!allowedFile.test(filename)){
                        e.currentTarget.value = '';
                    }*/
