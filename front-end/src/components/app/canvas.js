import React from "react";
import {connect} from "react-redux";

import {post} from "../../api/apiCalls";
import Table from "./table/table";
import stats_illustration from "../../assets/stats-illustration.svg";
import unload from "../../assets/unload.svg";

const Canvas = (props) => {
    const handleUnload = () => {
        props.dispatch({type:"SET_LOADING"});
        post("databook/unload", props.csrf, {databook_name: props.databook}).
            then(response => response.json().then(data => {
                if(data.msg === "Done"){
                    props.dispatch({type:"RESET_LOADING"});
                    props.dispatch({type: "SET_DEFAULT"});
                }
        }));
    }

    return (
        <div className="canvas">
            <div className="canvas__top">
                {
                    !props.databook ?
                        <div className="canvas__top-head">No databook has been loaded!</div> : 
                        <div className="canvas__header">{props.databook}</div>
                }

                {
                    props.databook && 
                    <svg alt="click to unload databook" className="canvas__header-svg" 
                    onClick={
                        () => {
                            if(!props.loading)
                                handleUnload();
                        }
                        
                    }>
                        <use xlinkHref={`${unload}#Capa_1`}/>
                    </svg>
                }
            </div>

            {  
                !props.databook ? <img src={stats_illustration} className="canvas__illustration"/> : <Table/>
            }
        </div>
    );
};

const mapStoreToProps = (state) => ({
    databook: state.loadedDatabook.name,
    csrf: state.csrf.csrf,
    loading: state.loading
})

const ConnectedCanvas = connect(mapStoreToProps)(Canvas)
export default ConnectedCanvas;