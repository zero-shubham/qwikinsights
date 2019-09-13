import React from "react";
import {connect} from "react-redux";

import {update} from "../../../actions/update";
import {del} from "../../../api/apiCalls";
import cancel from "../../../assets/cancel.svg";

const Datatab = (props) => {
    
    return (
        <div className= {props.datastores.selected===props.name?"datatab selected":"datatab"}>
            <div 
            className="datatab__name"
            onClick={(e) => {
                if(!props.loading){
                    let oldState = {...props.datastores};
                    oldState.selected = e.target.innerHTML;
    
                    props.dispatch(update("DATASTORE", oldState));
                }
            }}
            >
                {props.name}
            </div>


            <div className="datatab__delete">
                <svg 
                alt="click to delete the current data-tab" 
                className="datatab__delete-svg"
                onClick={(e) => {
                    if(!props.loading){
                        del("databook/datastore/delete", props.csrf, {
                            databook_name: props.loadedDatabook,
                            store_name: props.name
                        }).then(response => response.json().then(data => {
                            props.dispatch(update("DATASTORE", {
                                list: data.datastore_names,
                                selected: data.datastore_names[0]
                            }));
                        }))
                    }
                }}>

                    <use xlinkHref={`${cancel}#Capa_1`}/>

                </svg>
            </div>
        </div>
    );
};
const mapStoreToProps = (state) => {
    return {
        datastores: state.listOfDatastores,
        csrf: state.csrf.csrf,
        loadedDatabook: state.loadedDatabook.name,
        loading: state.loading
    }
}

const ConnectedDatatab = connect(mapStoreToProps)(Datatab)
export default ConnectedDatatab;