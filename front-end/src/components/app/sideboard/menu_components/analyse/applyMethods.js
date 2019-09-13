import React, {Component} from "react";
import {connect} from "react-redux";

import {post} from "../../../../../api/apiCalls";
import Dropdown from "../dropdown";
import {update} from "../../../../../actions/update";

class ApplyMethods extends Component{
    constructor(props){
        super(props);

        this.state = {
            funcType : 0,
            allMethodsAndAttributes : undefined,
            radioOption : "",
            optionsList : [],
            parameters: undefined,
            selectedMethod: undefined,
            selectedParameter: undefined,
            parameterValue: "",
            newDataStore: ""
        }
    }

    getMethods = (_type, store_name="") => {
        this.props.dispatch({type:"SET_LOADING"});
        post("databook/getmethods", this.props.csrf,{
            databook_name: this.props.loadedDatabook,
            store_name,
            _type
        }).then(response => response.json().then(data => {
            if(!Object.keys(data).includes("msg")){
                this.setState(state => ({...state,allMethodsAndAttributes: data}));
            }else{
                console.log(data)
                alert("something went wrong")
            }
            this.props.dispatch({type:"RESET_LOADING"});
        }));
    }

    handleDropdownChange = (name,_type) => {
        let newObj = {};
        switch(_type){
            case "method":
                newObj = {};
                this.state.allMethodsAndAttributes["methods"][name].slice(1).forEach(parameter => newObj[parameter]="");
                if(this.state.allMethodsAndAttributes["methods"][name].includes("func")){
                    newObj["other"]=""
                }
                this.setState(state => ({
                    ...state,
                    parameters:newObj,
                    selectedMethod: {name, _type},
                    selectedParameter: undefined,
                    parameterValue: ""
                }) );
                return;
            
            case "parameter":
                if(name){
                    this.setState(state => ({
                        ...state,
                        selectedParameter: name
                    }) );
                }
                return;
            
            case "callable-attribute":
                newObj = {};

                this.state.allMethodsAndAttributes["attributes"]["callable"][name].forEach(
                    parameter => newObj[parameter]=""
                );
                
                this.setState(state => ({
                    ...state,
                    parameters:newObj,
                    selectedMethod: {name, _type},
                    selectedParameter: undefined,
                    parameterValue: ""
                }) );
                return;
            case "attribute":
                this.setState(state => ({
                    ...state,
                    parameters:undefined,
                    selectedMethod: {name, _type},
                    selectedParameter: undefined,
                    parameterValue: ""
                }) );
            default:
                return;
        }
    };

    handleAdd = () => {
        let newObj = {...this.state.parameters};
        let regexStr = new RegExp(/^("|').+("|')$/);
        let regexRange = new RegExp(/^[0-9]+:[0-9]+$/);
        let regexList = new RegExp(/^(\[).+(\])$/);
        let regexFlt = new RegExp(/^[0-9]+\.[0-9]+$/);
        let regexInt = new RegExp(/^[0-9]+$/);
        let tmp;
        if(this.state.selectedParameter && this.state.parameterValue){
            if(regexList.test(this.state.parameterValue)){
                tmp = (this.state.parameterValue).replace("[","");
                tmp = tmp.replace("]","");
                let final = [];
                tmp.split(",").forEach(ele => {
                    let tmp_;
                    if(regexStr.test(ele)){
                        tmp_ = ele.replace(/("|')/,"");
                        tmp_ = tmp_.replace(/("|')/,"");
                        tmp_ += ":str";
                    }else if(regexFlt.test(ele)){
                        tmp_ = ele + ":float";
                    }else if(regexInt.test(ele)){
                        tmp_ = ele + ":int";
                    }else if(regexRange.test(ele)){
                        tmp_ = ele + ":range";
                    }

                    final.push(tmp_)
                });
                final = final.join(",");
                final += "$list";
                tmp = final;
            }else if(regexStr.test(this.state.parameterValue)){
                tmp = (this.state.parameterValue).replace(/("|')/,"");
                tmp = tmp.replace(/("|')/,"");
                tmp += ":str";
            }else if(regexFlt.test(this.state.parameterValue)){
                tmp = this.state.parameterValue + ":float";
            }else if(regexInt.test(this.state.parameterValue)){
                tmp = this.state.parameterValue + ":int";
            }else if(regexRange.test(this.state.parameterValue)){
                tmp = this.state.parameterValue + ":range";
            }
            newObj[this.state.selectedParameter] = tmp;
        }
        this.setState(state => ({...state,parameters:newObj,parameterValue:""}));
    };

    handleApply = () => {
        if(this.state.newDataStore && this.state.selectedMethod.name && !this.props.loading){
            this.props.dispatch({type:"SET_LOADING"});
            post("databook/applymethod", this.props.csrf, {
                databook_name: this.props.loadedDatabook,
                store_name: this.props.selectedDatastore,
                new_store_name: this.state.newDataStore,
                method: this.state.selectedMethod,
                parameters: this.state.parameters
            }).then(response => response.json().then(data => {
                this.props.dispatch(update("DATASTORE", {
                    list: data,
                    selected: data[0]
                }));

                this.props.dispatch({type:"RESET_LOADING"});
            }));
        }
    };

    componentDidUpdate(prevProps, prevState){
        if(this.state.funcType !== prevState.funcType){
            switch(this.state.funcType){
                case "1":
                    this.getMethods("datastore", this.props.selectedDatastore);
                    return;
                case "2":
                    this.getMethods("special");
                    return;
                default:
                    return;
            }
        }else if(this.state.radioOption !== prevState.radioOption){
            switch(this.state.radioOption){
                case "methods":
                    this.setState(state => ({
                        ...state,
                        optionsList:[...Object.keys(this.state.allMethodsAndAttributes["methods"])],
                        selectedMethod: undefined,
                        parameters: undefined,
                        parameterValue: ""
                    }));
                    return;
                case "attrCallable":
                    this.setState(state => ({
                        ...state,
                        optionsList:[...Object.keys(this.state.allMethodsAndAttributes["attributes"]["callable"])],
                        selectedMethod: undefined,
                        parameters: undefined,
                        parameterValue: ""
                    }));
                    return;
                case "attr":
                    this.setState(state => ({
                        ...state,
                        optionsList: this.state.allMethodsAndAttributes["attributes"]["attribute"],
                        selectedMethod: undefined,
                        parameters: undefined,
                        parameterValue: ""
                    }));
                    return;
                default:
                    return;
            }
        }
    }

    render(){
        return (
            <div className="applyMethods">
                <div className="applyMethods__txt">Select type of function:</div>
                <div className="applyMethods__Inp">
                    <select 
                    className="dropdown" 
                    value={this.state.funcType} 
                    onChange={(e) => {
                        let tmp = e.target.value;
                        this.setState(state => ({...state,funcType: tmp}))
                    }}>
                        <option label={`Select a function type!`} value={0} key={0}>{`Select a function type!`}</option>
                        <option label="Datastore functions" value={1} key={1}>Datastore functions</option>
                        <option label="Special functions" value={2} key={2}>Special functions</option>
                    </select>
                </div>


                {
                /*when all methods and attributes are availbale 
                for a datastore, and datastore functions are opted for.*/
                this.state.allMethodsAndAttributes ? 
                <div 
                className="applyMethods__radInp" 
                onChange={(e) => {
                    let tmp = e.target.value;
                    this.setState(state => ({...state,radioOption: tmp}))
                }}>
                    <div className="applyMethods__radInp-div"> 
                        <input type="radio" name="methods" value="methods" id="methods"/>
                        <label htmlFor="methods">Methods</label>
                    </div>

                    <div className="applyMethods__radInp-div">
                        <input type="radio" name="methods" value="attrCallable" id="attrCallable"/>
                        <label htmlFor="attrCallable">Callable-Attributes</label>
                    </div>

                    <div className="applyMethods__radInp-div">
                        <input type="radio" name="methods" value="attr" id="attr"/>
                        <label htmlFor="attr">Attributes</label>
                    </div>
                    
                </div> : 
                ""
            }
            {
                this.state.radioOption? 
                <div className="applyMethods__Inp">
                    <Dropdown 
                    optionsList={this.state.optionsList} 
                    valueType={this.state.radioOption==="attr"?"attribute":(this.state.radioOption==="attrCallable"?"callable-attribute":"method")} 
                    handleChange={this.handleDropdownChange}/>
                </div>:
                ""
            }
            {
                this.state.selectedMethod &&
                <div className="applyMethods__parameters">
                    {
                        this.state.parameters?
                        <Dropdown 
                        optionsList={[...Object.keys(this.state.parameters)]} 
                        valueType="parameter" 
                        handleChange={this.handleDropdownChange}/>:""
                    }

                    {
                        this.state.selectedParameter &&
                        <input 
                        type="text"
                        className="menu__input" 
                        placeholder="Enter parameter value" 
                        value={this.state.parameterValue}
                        onChange={(e) => {
                            let tmp = e.target.value;
                            this.setState(state => ({...state, parameterValue:tmp}));
                        }}/>
                    }
                    {
                        this.state.selectedParameter &&
                        <span className="applyMethods__info">
                            To specify string type enclose it with quotes, like one has to in pandas library.<br/>
                            Hint: Column names are string by default even if they essentially numbers.
                        </span>
                    }
                    {
                        this.state.selectedParameter &&
                        <div className="menu__btn" onClick={this.handleAdd}>
                            Add
                        </div>
                    }
                </div>
            }

            <input 
            type="text"
            className="menu__input" 
            placeholder="Enter new datastore name" 
            value={this.state.newDataStore}
            onChange={(e) => {
                let tmp = e.target.value;
                this.setState(state => ({
                    ...state,
                    newDataStore:tmp
                }));
            }}/>

            <div className="menu__btn" onClick={this.handleApply}>
                Apply
            </div>
            </div>
        );
    }
};

const mapStoreToProps = (state) => {
    return {
        csrf: state.csrf.csrf,
        loadedDatabook: state.loadedDatabook.name,
        selectedDatastore: state.listOfDatastores.selected,
        loading: state.loading
    }
};
const ConnectedApplyMethods = connect(mapStoreToProps)(ApplyMethods);
export default ConnectedApplyMethods;