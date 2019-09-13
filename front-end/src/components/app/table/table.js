import React,{useState, useEffect} from "react";
import {connect} from "react-redux";

import Header from "./header";
import Row from "./row";
import {post} from "../../../api/apiCalls";
import {update} from "../../../actions/update";
import { type, networkInterfaces } from "os";

const Table = (props) => {
    const [rows, setRows] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        if(props.selectedDatastore){
            props.dispatch({type:"SET_LOADING"});
            post("databook/getdata", props.csrf, {
                databook_name: props.loadedDatabook, 
                store_name: props.selectedDatastore
            }).then(response => response.json().then(data => {
                if(data.columns !== "list" && data.columns !== "var"){
                    let newObj = {};
                    newObj.columns = data.columns;
                    newObj.data = JSON.parse(data.data);

                    //==================TABLE DATA DISPATCH================================
                    props.dispatch(update("TABLEDATA", newObj));
                }else{
                    let newObj = {};
                    if(data.columns === "list"){
                        let tmp = [];
                        data.data.forEach(d => tmp.push(d));
                        newObj.data = tmp;
                        newObj.columns = data.columns;
                    }else if(data.columns === "var"){
                        newObj.data = data.data
                        newObj.columns = data.columns;
                    }
                    //==================TABLE DATA DISPATCH================================
                    props.dispatch(update("TABLEDATA", newObj));
                }
                props.dispatch({type:"RESET_LOADING"});
            }));
        }
    }, [props.selectedDatastore]);
    
    useEffect(() => {
        if(props.columns !== "list" && props.columns !== "var"){
            if(props.data[props.columns[0]]){
                let rowsArray = [];
                Object.keys(props.data[props.columns[0]]).forEach((rowNum, indx) => {
                    let rowData = [];
                    rowData.push(indx);
                    (props.columns).forEach((column, ind) => {
                        
                        rowData.push(props.data[column][rowNum])
                    });
                    rowNum++;
                    rowsArray.push(<Row rowData={rowData} key={indx}/>);
                })
    
                setRows(rowsArray);
            }
        }else{
            if(props.columns === "list"){
                let rowsArray = [];
                props.data.forEach((data,ind) => rowsArray.push(<div key={ind} className="list__data">{data}</div>));
                setData(rowsArray);
            }else{
                setData(<span className="var__data">{props.data}</span>);
            }
        }
        
    }, [props.columns, props.data])

    return (
        <div className="tableContainer">
            {
                props.columns!=="list" && props.columns!=="var"?
                <table className="table">
                    <thead>
                        <Header columns={props.columns}/>
                    </thead>
                    
                    <tbody>
                        {rows}
                    </tbody>
                </table>:""
            }

            {
                props.columns === "list" ?
                <div className="list">
                    {data}
                </div>:""
            }
            {
                props.columns === "var" ?
                <div className="var">
                    {data}
                </div>:""
            }
        </div>
    );
};

const mapStoreToProps = (state) => {
    return {
        data: state.tableData.data,
        columns: state.tableData.columns,
        csrf: state.csrf.csrf,
        loadedDatabook: state.loadedDatabook.name,
        selectedDatastore: state.listOfDatastores.selected
    }
}
const ConnectedTable = connect(mapStoreToProps)(Table);
export default ConnectedTable;