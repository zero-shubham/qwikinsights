import React, {useState, useEffect} from "react";
import {connect} from "react-redux";

import Datatab from "./datatab";

const Topboard = (props) => {
    const [dataTabs, setDataTabs] = useState([]);

    useEffect(()=>{
        if((props.datastoresList).length){
            let dsList = [];
            (props.datastoresList).forEach((element, ind) => {
                dsList.push(<Datatab name={element} key={ind}/>);
            });
            setDataTabs(dsList);
            
        }else{
            setDataTabs([]);
        }
    }, [props.datastoresList])
    return (
        <div className={`topboard`} >
            {dataTabs}
        </div>
    )
};

const mapStoreToProps = (state) => {
    return {
        csrf: state.csrf.csrf,
        datastoresList: state.listOfDatastores.list
    }
}
const ConnectedTopboard = connect(mapStoreToProps)(Topboard);
export default ConnectedTopboard;