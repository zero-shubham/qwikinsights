import React, {useEffect, useState} from "react";

/*
    Dropdown will need optionList that is array of labels for the options to be created.
    valueType will also need to be passed which will used along with the labels as value for this options
    created.
    
*/
const Dropdown = (props) => {
    const [options, setOptions] = useState([]);
    const [optionState, changeOptionState] = useState("");
    const populateOptions = () => {
        
        let optionsArray = [];
        if(props.optionsList.length===0){
            optionsArray.push(<option label={`No ${props.valueType} found!`} value="404" key={0}>{`No ${props.valueType} found!`}</option>)
            setOptions(optionsArray);
            changeOptionState("404");
            return;
        }
        optionsArray.push(<option label={`Select your ${props.valueType}!`} value="0" key={0}>{`Select your ${props.valueType}!`}</option>)
        props.optionsList.forEach((optionLabel, ind) => {
            optionsArray.push(<option label={optionLabel} value={`${optionLabel}$${props.valueType}`} key={ind + 1}>{optionLabel}</option>)
        });
        setOptions(optionsArray);
    };

    useEffect(() => populateOptions(), [props.optionsList])
    return(
        <select 
        className="dropdown" 
        onChange={(e) => {
            changeOptionState(e.target.value)
            props.handleChange(e.target.value.split("$")[0],e.target.value.split("$")[1]);
        }} 
        value={optionState}>

            {options}

        </select>
    );
};

export default Dropdown;